import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

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
  currentUserLocation?: { lat: number; lng: number } | null;
  liveLocations?: LiveLocationEntry[];
  activeSos?: LiveLocationEntry[];
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

function BuildRoute({ activeSos, liveLocations }: { activeSos: LiveLocationEntry[]; liveLocations: LiveLocationEntry[] }) {
  const [route, setRoute] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    if (!activeSos || activeSos.length === 0) {
      setRoute([]);
      return;
    }

    const sos = activeSos[0];
    const officers = liveLocations.filter((item) => ['field', 'response', 'authority'].includes(item.role ?? ''));
    if (officers.length === 0) {
      setRoute([[sos.lat, sos.lng]]);
      return;
    }

    const nearest = officers
      .map((unit) => ({
        ...unit,
        distance: Math.hypot(unit.lat - sos.lat, unit.lng - sos.lng),
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    const directPath: Array<[number, number]> = [
      [nearest.lat, nearest.lng],
      [sos.lat, sos.lng],
    ];

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${nearest.lng},${nearest.lat};${sos.lng},${sos.lat}?overview=full&geometries=geojson`;
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
  }, [activeSos, liveLocations]);

  if (!route.length) return null;
  return <Polyline positions={route} pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.9, dashArray: '8 8' }} />;
}

export const LiveGISMap: React.FC<LiveGISMapProps> = ({ currentUserLocation, liveLocations = [], activeSos = [] }) => {
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
          : entry.role === 'field'
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {currentUserLocation && (
          <Circle center={[currentUserLocation.lat, currentUserLocation.lng]} radius={400} pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.15 }} />
        )}

        {markers}
        <BuildRoute activeSos={activeSos} liveLocations={liveLocations} />
        {currentUserLocation && <RecenterButton target={currentUserLocation} />}
      </MapContainer>
    </div>
  );
};
