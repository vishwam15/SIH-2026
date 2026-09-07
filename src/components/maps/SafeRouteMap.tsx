import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AppMapTileLayer } from './AppMapTileLayer';
import type { SafeRouteInfo } from '../../types';
import { Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SafeRouteMapProps {
  route: SafeRouteInfo;
  height?: string;
}

// Child component to fit map view to route bounds whenever path changes
const RouteBoundsFitter: React.FC<{ coords: [number, number][]; hazards: { lat: number; lng: number }[] }> = ({
  coords,
  hazards,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!coords || coords.length === 0) return;

    const allPoints: [number, number][] = [...coords];
    hazards.forEach((h) => allPoints.push([h.lat, h.lng]));

    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 15,
      animate: true,
      duration: 1.0,
    });
  }, [coords, hazards, map]);

  return null;
};

const customPinIcon = (color: string, label: string) =>
  L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 14px ${color}; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 12px; font-weight: 900;">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const hazardPinIcon = L.divIcon({
  className: 'hazard-flood-pin',
  html: `
    <div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 0 12px rgba(239, 68, 68, 0.9); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 900;">
      ⚠
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const SafeRouteMap: React.FC<SafeRouteMapProps> = ({ route, height = '480px' }) => {
  const centerLat = route.coordinatesPath[0]?.[0] || 19.117;
  const centerLng = route.coordinatesPath[0]?.[1] || 72.844;

  const isSafe = route.status === 'SAFE';

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 glass-panel shadow-2xl flex flex-col">
      {/* Shifted Top Header Bar - Cleanly separated from Map to eliminate overlap */}
      <div className="px-5 py-3.5 bg-slate-900/95 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Navigation className="w-4 h-4 animate-pulse" />
          </span>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200 block">
              Emergency Safe Evacuation Corridor
            </span>
            <span className="text-[11px] text-slate-400">
              Auto-diverts away from {route.hazardousPoints?.length || 0} flooded hotspots
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-extrabold uppercase rounded-lg border flex items-center gap-1.5 ${
              isSafe
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isSafe ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {isSafe ? 'SAFE CORRIDOR ACTIVE' : 'HIGH CLEARANCE ROUTE'} ({route.estimatedTimeMin} MINS ETA)
          </span>
        </div>
      </div>

      {/* Map Container - Zoom controls and route display with zero clashes */}
      <div style={{ height }} className="relative w-full">
        <MapContainer center={[centerLat, centerLng]} zoom={13} scrollWheelZoom={true} className="w-full h-full">
          <AppMapTileLayer defaultMode="streets" />

          <RouteBoundsFitter coords={route.coordinatesPath} hazards={route.hazardousPoints || []} />

          {/* Glowing Green Recommended Safe Route Polyline */}
          <Polyline
            positions={route.coordinatesPath}
            pathOptions={{
              color: '#10b981',
              weight: 6,
              opacity: 0.95,
              dashArray: '12, 10',
            }}
          />

          {/* Underlay glow polyline */}
          <Polyline
            positions={route.coordinatesPath}
            pathOptions={{
              color: '#34d399',
              weight: 12,
              opacity: 0.35,
            }}
          />

          {/* Start Marker */}
          {route.coordinatesPath[0] && (
            <Marker position={route.coordinatesPath[0]} icon={customPinIcon('#3b82f6', '📍')}>
              <Popup>
                <div className="p-1.5 text-xs text-slate-800">
                  <span className="font-bold text-blue-600 block mb-0.5">📍 CURRENT LOCATION</span>
                  <p className="font-semibold text-slate-900">{route.startLocation}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination Shelter Marker */}
          {route.coordinatesPath.length > 1 && (
            <Marker
              position={route.coordinatesPath[route.coordinatesPath.length - 1]}
              icon={customPinIcon('#10b981', '🏥')}
            >
              <Popup>
                <div className="p-1.5 text-xs text-slate-800">
                  <span className="font-bold text-emerald-600 block mb-0.5">🏥 EMERGENCY REFUGE SHELTER</span>
                  <p className="font-semibold text-slate-900">{route.destinationShelter}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Distance: <strong>{route.distanceKm} km</strong> • ETA: <strong>{route.estimatedTimeMin} mins</strong>
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Inundated Hotspots Avoided by Pathfinding (Red Halos & Pins) */}
          {(route.hazardousPoints || []).map((pt, idx) => (
            <React.Fragment key={idx}>
              <Circle
                center={[pt.lat, pt.lng]}
                radius={380}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.3,
                  weight: 2,
                  dashArray: '4, 4',
                }}
              />
              <Marker position={[pt.lat, pt.lng]} icon={hazardPinIcon}>
                <Popup>
                  <div className="p-1.5 text-xs text-slate-800">
                    <span className="font-bold text-rose-600 flex items-center gap-1 block mb-0.5">
                      🚫 WATERLOGGED ROAD BLOCKED
                    </span>
                    <p className="font-semibold text-slate-900">{pt.reason}</p>
                    <span className="text-[11px] text-rose-500 font-bold mt-1 block">
                      ● Surcharged Drainage Node - Impassable
                    </span>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
