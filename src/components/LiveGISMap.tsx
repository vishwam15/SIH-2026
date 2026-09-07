import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MapZone } from '../types';
import { AppMapTileLayer } from './maps/AppMapTileLayer';

type LiveLocationEntry = {
  userId: string;
  role?: string;
  lat: number;
  lng: number;
  timestamp?: string;
  severity?: string;
};

type LiveGISMapProps = {
  userRole?: string;
  currentUserId?: string;
  currentUserLocation?: { lat: number; lng: number } | null;
  liveLocations?: LiveLocationEntry[];
  activeSos?: LiveLocationEntry[];
  safeZone?: { name: string; lat: number; lng: number };
  zones?: MapZone[];
};

const citizenIcon = L.divIcon({
  className: 'live-citizen-pin',
  html: `
    <div style="position:relative; width:18px; height:18px; border-radius:50%; background:#22d3ee; border:3px solid #ecfeff; box-shadow:0 0 0 8px rgba(34,211,238,0.18), 0 0 18px rgba(34,211,238,0.8);">
      <div style="position:absolute; inset:-4px; border-radius:50%; border:2px solid rgba(34,211,238,0.8); animation:pulse 1.8s infinite;"></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const officerIcon = L.divIcon({
  className: 'live-officer-pin',
  html: `
    <div style="position:relative; width:20px; height:20px; border-radius:8px; background:#f59e0b; border:2px solid #fff; box-shadow:0 0 16px rgba(245,158,11,0.7); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; color:#fff;">V</div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const ndmaIcon = L.divIcon({
  className: 'live-ndma-pin',
  html: `
    <div style="position:relative; width:20px; height:20px; border-radius:8px; background:#8b5cf6; border:2px solid #fff; box-shadow:0 0 16px rgba(139,92,246,0.7); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; color:#fff;">C</div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const sosIcon = L.divIcon({
  className: 'live-sos-pin',
  html: `
    <div style="position:relative; width:26px; height:26px; border-radius:50%; background:#ef4444; border:3px solid #fff; box-shadow:0 0 0 10px rgba(239,68,68,0.18), 0 0 18px rgba(239,68,68,0.95); display:flex; align-items:center; justify-content:center; font-weight:900; color:#fff; font-size:12px;">SOS</div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const safeZoneIcon = L.divIcon({
  className: 'live-safe-zone-pin',
  html: '<div style="width:22px;height:22px;border-radius:7px;background:#10b981;border:3px solid #ecfdf5;box-shadow:0 0 16px rgba(16,185,129,0.8);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:13px;">S</div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function RecenterButton({ target }: { target: { lat: number; lng: number } }) {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => {
        if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
      }}
      style={{
        position: 'absolute',
        zIndex: 1200,
        right: '16px',
        bottom: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(148,163,184,0.35)',
        background: 'rgba(15, 23, 42, 0.9)',
        color: '#fff',
        padding: '10px 12px',
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '0.04em',
        cursor: 'pointer',
      }}
    >
      Recenter on Me
    </button>
  );
}

function BuildRoute({
  userRole,
  currentUserId,
  selectedSosId,
  activeSos,
  liveLocations,
  currentUserLocation,
  safeZone,
  routeToSafeZone,
}: {
  userRole?: string;
  currentUserId?: string;
  selectedSosId?: string | null;
  activeSos: LiveLocationEntry[];
  liveLocations: LiveLocationEntry[];
  currentUserLocation?: { lat: number; lng: number } | null;
  safeZone?: { name: string; lat: number; lng: number };
  routeToSafeZone: boolean;
}) {
  const [route, setRoute] = useState<Array<[number, number]>>([]);
  const [routeKind, setRouteKind] = useState<'response' | 'safe-zone'>('response');

  useEffect(() => {
    const sos = activeSos.find((item) => item.userId === selectedSosId) || activeSos[0];
    let start: { lat: number; lng: number } | null = null;
    let destination: { lat: number; lng: number } | null = null;
    let kind: 'response' | 'safe-zone' = 'response';

    const isResponder = ['field', 'field_officer', 'response', 'response_team'].includes(userRole ?? '');
    const isCitizen = userRole === 'citizen';

    if (sos && isResponder && routeToSafeZone && safeZone) {
      start = { lat: sos.lat, lng: sos.lng };
      destination = safeZone;
      kind = 'safe-zone';
    } else if (sos) {
      const officers = liveLocations.filter((item) =>
        ['field', 'field_officer', 'response', 'response_team', 'authority', 'admin'].includes(item.role ?? '')
      );
      const ownUnit = currentUserId ? officers.find((unit) => unit.userId === currentUserId) : null;
      const nearest = ownUnit || (!isResponder ? officers
        .map((unit) => ({ ...unit, distance: Math.hypot(unit.lat - sos.lat, unit.lng - sos.lng) }))
        .sort((a, b) => a.distance - b.distance)[0] : null);
      if (isCitizen) {
        start = currentUserLocation || { lat: sos.lat, lng: sos.lng };
        destination = safeZone ? { lat: safeZone.lat, lng: safeZone.lng } : null;
        kind = 'safe-zone';
      } else {
        start = nearest ? { lat: nearest.lat, lng: nearest.lng } : currentUserLocation || null;
        destination = { lat: sos.lat, lng: sos.lng };
      }
    } else if (routeToSafeZone && currentUserLocation && safeZone) {
      start = currentUserLocation;
      destination = safeZone;
      kind = 'safe-zone';
    }

    if (!start || !destination) {
      setRoute([]);
      return;
    }

    setRouteKind(kind);
    const directPath: Array<[number, number]> = [[start.lat, start.lng], [destination.lat, destination.lng]];

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('OSRM unavailable');
        const json = await res.json();
        const coords = json.routes?.[0]?.geometry?.coordinates || [];
        if (coords.length) {
          setRoute(coords.map(([lng, lat]: [number, number]) => [lat, lng]));
          return;
        }
      } catch (err) {
        console.warn('OSRM route fallback used:', err instanceof Error ? err.message : String(err));
      }
      setRoute(directPath);
    };

    fetchRoute();
  }, [activeSos, currentUserId, currentUserLocation, liveLocations, routeToSafeZone, safeZone, selectedSosId, userRole]);

  if (!route.length) return null;
  return (
    <Polyline
      positions={route}
      pathOptions={{
        color: routeKind === 'safe-zone' ? '#10b981' : '#ef4444',
        weight: 5,
        opacity: 0.95,
        dashArray: '10 8',
      }}
    />
  );
}

export const LiveGISMap: React.FC<LiveGISMapProps> = ({ userRole, currentUserId, currentUserLocation, liveLocations = [], activeSos = [], safeZone, zones = [] }) => {
  const [routeToSafeZone, setRouteToSafeZone] = useState(false);
  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);
  const defaultCenter = useMemo(() => {
    if (currentUserLocation) return [currentUserLocation.lat, currentUserLocation.lng] as [number, number];
    return [19.076, 72.8777] as [number, number];
  }, [currentUserLocation]);

  const markers = useMemo(() => {
    const items: React.ReactNode[] = [];

    liveLocations.forEach((entry) => {
      if (!entry || !Number.isFinite(entry.lat) || !Number.isFinite(entry.lng)) return;
      const icon =
        entry.role === 'citizen'
          ? citizenIcon
          : ['field', 'response', 'response_team'].includes(entry.role ?? '')
            ? officerIcon
            : ndmaIcon;

      items.push(
        <Marker key={`loc-${entry.userId}`} position={[entry.lat, entry.lng]} icon={icon}>
          <Popup>
            <div style={{ fontSize: 12 }}>
              <strong>{entry.role}</strong>
              <div>{entry.userId}</div>
              <small>{entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : 'Updated now'}</small>
            </div>
          </Popup>
        </Marker>
      );
    });

    activeSos.forEach((entry) => {
      if (!entry || !Number.isFinite(entry.lat) || !Number.isFinite(entry.lng)) return;
      items.push(
        <Marker key={`sos-${entry.userId}`} position={[entry.lat, entry.lng]} icon={sosIcon}>
          <Popup>
            <div style={{ fontSize: 12 }}>
              <strong style={{ color: '#ef4444' }}>SOS Active</strong>
              <div>{entry.userId}</div>
              <div>Severity: {entry.severity || 'CRITICAL'}</div>
            </div>
          </Popup>
        </Marker>
      );
    });

    return items;
  }, [liveLocations, activeSos]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl" style={{ height: 420 }}>
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <AppMapTileLayer defaultMode="dark" />

        {currentUserLocation && (
          <Circle center={[currentUserLocation.lat, currentUserLocation.lng]} radius={400} pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.15 }} />
        )}

        {zones.map((zone) => {
          if (!Number.isFinite(zone.coordinates?.lat) || !Number.isFinite(zone.coordinates?.lng)) return null;
          const radius = Number.isFinite(zone.radiusMeters) ? zone.radiusMeters : 500;
          const isHazard = zone.type === 'flood' || zone.type === 'landslide';
          const color = isHazard ? '#ef4444' : '#f59e0b';
          return (
            <Circle
              key={`zone-${zone.id}`}
              center={[zone.coordinates.lat, zone.coordinates.lng]}
              radius={radius}
              pathOptions={{ color, fillColor: color, fillOpacity: isHazard ? 0.2 : 0.1, weight: 2 }}
            >
              <Popup>
                <strong>{zone.name}</strong>
                <div>{zone.type.toUpperCase()} · {zone.riskLevel}</div>
                <div>Risk: {zone.type === 'flood' ? zone.floodRiskPct : zone.landslideRiskPct}%</div>
              </Popup>
            </Circle>
          );
        })}

        {markers}
        {safeZone && (
          <Marker position={[safeZone.lat, safeZone.lng]} icon={safeZoneIcon}>
            <Popup>
              <strong>Safe zone</strong>
              <div>{safeZone.name}</div>
            </Popup>
          </Marker>
        )}
        <BuildRoute
          userRole={userRole}
          currentUserId={currentUserId}
          selectedSosId={selectedSosId}
          activeSos={activeSos}
          liveLocations={liveLocations}
          currentUserLocation={currentUserLocation}
          safeZone={safeZone}
          routeToSafeZone={routeToSafeZone}
        />
        {currentUserLocation && <RecenterButton target={currentUserLocation} />}
      </MapContainer>
      {activeSos.length > 1 && (
        <label className="absolute right-4 top-4 z-[1200] flex items-center gap-2 rounded-xl border border-rose-400/40 bg-slate-950/95 px-3 py-2 text-[10px] font-bold text-rose-200">
          SOS incident
          <select value={selectedSosId || activeSos[0]?.userId} onChange={(event) => setSelectedSosId(event.target.value)} className="rounded bg-slate-900 px-1.5 py-1 text-[10px] text-white">
            {activeSos.map((sos) => <option key={sos.userId} value={sos.userId}>{sos.userId}</option>)}
          </select>
        </label>
      )}
      {safeZone && currentUserLocation && (
        <button
          type="button"
          onClick={() => setRouteToSafeZone((visible) => !visible)}
          className="absolute left-4 bottom-4 z-[1200] rounded-xl border border-emerald-400/40 bg-slate-950/90 px-3 py-2 text-[11px] font-extrabold text-emerald-200 shadow-lg"
        >
          {routeToSafeZone
            ? 'Hide active route'
            : activeSos.length > 0 && ['field', 'field_officer', 'response', 'response_team'].includes(userRole ?? '')
              ? `Evacuate to ${safeZone.name}`
              : `Route to ${safeZone.name}`}
        </button>
      )}
    </div>
  );
};
