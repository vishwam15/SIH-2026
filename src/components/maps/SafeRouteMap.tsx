import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { SafeRouteInfo } from '../../types';
import { Navigation } from 'lucide-react';

interface SafeRouteMapProps {
  route: SafeRouteInfo;
  height?: string;
}

const customPinIcon = (color: string) =>
  L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 10px ${color}; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: #ffffff; width: 6px; height: 6px; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export const SafeRouteMap: React.FC<SafeRouteMapProps> = ({ route, height = '450px' }) => {
  const centerLat = route.coordinatesPath[0][0];
  const centerLng = route.coordinatesPath[0][1];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 glass-panel shadow-2xl">
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Emergency Safe Evacuation Navigation Path
          </span>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          ● SAFE ROUTE ACTIVE ({route.estimatedTimeMin} mins ETA)
        </span>
      </div>

      <div style={{ height }}>
        <MapContainer center={[centerLat, centerLng]} zoom={13} scrollWheelZoom={true}>
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  maxZoom={19}
/>

          {/* Green Recommended Evacuation Route Polyline */}
          <Polyline
            positions={route.coordinatesPath}
            pathOptions={{
              color: '#10b981',
              weight: 6,
              opacity: 0.9,
              dashArray: '10, 10',
            }}
          />

          {/* Start Marker */}
          <Marker position={route.coordinatesPath[0]} icon={customPinIcon('#3b82f6')}>
            <Popup>
              <div className="p-1 text-xs">
                <span className="font-bold text-blue-400">📍 CURRENT LOCATION</span>
                <p className="text-slate-200 mt-1">{route.startLocation}</p>
              </div>
            </Popup>
          </Marker>

          {/* Destination Shelter Marker */}
          <Marker
            position={route.coordinatesPath[route.coordinatesPath.length - 1]}
            icon={customPinIcon('#10b981')}
          >
            <Popup>
              <div className="p-1 text-xs">
                <span className="font-bold text-emerald-400">🏥 SAFE SHELTER DESTINATION</span>
                <p className="text-slate-200 mt-1">{route.destinationShelter}</p>
              </div>
            </Popup>
          </Marker>

          {/* Hazardous Road Points (Red Circles) */}
          {route.hazardousPoints.map((pt, idx) => (
            <React.Fragment key={idx}>
              <Circle
                center={[pt.lat, pt.lng]}
                radius={300}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.4,
                }}
              />
              <Marker position={[pt.lat, pt.lng]} icon={customPinIcon('#ef4444')}>
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold text-rose-400">🚫 ROAD BLOCKED / HAZARD</span>
                    <p className="text-slate-200 mt-1">{pt.reason}</p>
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
