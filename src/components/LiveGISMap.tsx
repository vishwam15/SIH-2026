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
    <div style="position:relative; width:18px; height:18px; border-radius:50%; background:#0284c7; border:3px solid #ffffff; box-shadow:0 0 0 6px rgba(2,132,199,0.2), 0 2px 8px rgba(0,0,0,0.3);">
      <div style="position:absolute; inset:-4px; border-radius:50%; border:2px solid rgba(2,132,199,0.8); animation:pulse 1.8s infinite;"></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const officerIcon = L.divIcon({
  className: 'live-officer-pin',
  html: `
    <div style="position:relative; width:22px; height:22px; border-radius:8px; background:#d97706; border:2px solid #ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#ffffff;">V</div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const ndmaIcon = L.divIcon({
  className: 'live-ndma-pin',
  html: `
    <div style="position:relative; width:22px; height:22px; border-radius:8px; background:#7c3aed; border:2px solid #ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#ffffff;">C</div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const sosIcon = L.divIcon({
  className: 'live-sos-pin',
  html: `
    <div style="position:relative; width:28px; height:28px; border-radius:50%; background:#dc2626; border:3px solid #ffffff; box-shadow:0 0 0 8px rgba(220,38,38,0.25), 0 2px 10px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; font-weight:900; color:#ffffff; font-size:11px;">SOS</div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
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
        border: '1px solid rgba(203, 213, 225, 0.8)',
        background: '#ffffff',
        color: '#0f172a',
        padding: '10px 14px',
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
  return <Polyline positions={route} pathOptions={{ color: '#dc2626', weight: 5, opacity: 0.9, dashArray: '8 8' }} />;
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
              <strong style={{ color: '#dc2626' }}>SOS Active</strong>
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
    <div className="relative overflow-hidden rounded-2xl border border-slate-300 shadow-xl" style={{ height: 420 }}>
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        {/* Light theme tiles (CartoDB Positron) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {currentUserLocation && (
          <Circle center={[currentUserLocation.lat, currentUserLocation.lng]} radius={400} pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.2 }} />
        )}

        {markers}
        <BuildRoute activeSos={activeSos} liveLocations={liveLocations} />
        {currentUserLocation && <RecenterButton target={currentUserLocation} />}
      </MapContainer>
    </div>
  );
};