import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MapZone, SensorData, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Search, MapPin, X, Loader2, Waves, Mountain, Radio } from 'lucide-react';

interface MultiHazardMapProps {
  zones: MapZone[];
  sensors: SensorData[];
  onSelectLocation?: (zone: MapZone) => void;
  height?: string;
}

interface SearchResultItem {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Child component to trigger animated flyTo on map
const MapFlyToController: React.FC<{ center: [number, number] | null }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

// Custom Leaflet Icons Generator using SVG markers
const createCustomMarkerIcon = (risk: RiskLevel) => {
  let color = '#10b981'; // green
  if (risk === 'MODERATE') color = '#f59e0b';
  if (risk === 'HIGH') color = '#f97316';
  if (risk === 'CRITICAL') color = '#ef4444';

  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
      <defs>
        <filter id="glow-${risk}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${color}" flood-opacity="0.8"/>
        </filter>
      </defs>
      <path d="M16 0 C7.16 0 0 7.16 0 16 C0 26 16 40 16 40 C16 40 32 26 32 16 C32 7.16 24.84 0 16 0 Z" fill="#0f172a" stroke="${color}" stroke-width="2.5" filter="url(#glow-${risk})"/>
      <circle cx="16" cy="16" r="7" fill="${color}" />
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: iconSvg,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
};

const searchPinIcon = L.divIcon({
  className: 'custom-search-pin',
  html: `
    <div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 15px #3b82f6; display: flex; align-items: center; justify-content: center;">
      <div style="background: #ffffff; width: 8px; height: 8px; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export const MultiHazardMap: React.FC<MultiHazardMapProps> = ({
  zones,
  sensors,
  onSelectLocation,
  height = '540px',
}) => {
  const [activeLayerFilter, setActiveLayerFilter] = useState<'all' | 'flood' | 'landslide' | 'sensor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);

  // Debounced Geocoding fetch from OpenStreetMap Nominatim API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        setSuggestions(data.slice(0, 5));
      } catch (err) {
        console.error('Nominatim geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectCity = (item: SearchResultItem) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setFlyToCoords([lat, lng]);
    setSearchedLocation({ name: item.display_name, lat, lng });
    setSuggestions([]);
    setSearchQuery('');
  };

  const filteredZones = zones.filter((zone) => {
    if (activeLayerFilter === 'flood') return zone.type === 'flood';
    if (activeLayerFilter === 'landslide') return zone.type === 'landslide';
    return true;
  });

  const centerLat = 19.076;
  const centerLng = 72.8777;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel">
      {/* Floating City Search Overlay */}
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <div className="relative bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white rounded-lg p-1.5 shadow-xl flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, region, or zone..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none py-1"
          />
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0 mr-2" />
          ) : searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Suggestion Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-[1001] divide-y divide-slate-800">
            {suggestions.map((item) => (
              <div
                key={item.place_id}
                onClick={() => handleSelectCity(item)}
                className="p-2.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer transition flex items-start gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{item.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layer Selector Bar Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs">
        <button
          onClick={() => setActiveLayerFilter('all')}
          className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
            activeLayerFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveLayerFilter('flood')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
            activeLayerFilter === 'flood'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Waves className="w-3 h-3 text-cyan-400" /> Flood
        </button>
        <button
          onClick={() => setActiveLayerFilter('landslide')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
            activeLayerFilter === 'landslide'
              ? 'bg-amber-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Mountain className="w-3 h-3 text-amber-400" /> Landslide
        </button>
        <button
          onClick={() => setActiveLayerFilter('sensor')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
            activeLayerFilter === 'sensor'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3 h-3 text-emerald-400" /> Sensors
        </button>
      </div>

      {/* Leaflet Map Container */}
      <div style={{ height }}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={11}
          scrollWheelZoom={true}
          className="z-10"
        >
          <TileLayer
  attribution='Tiles &copy; Esri'
  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  maxZoom={16}
/>

          {/* Map FlyTo Controller */}
          <MapFlyToController center={flyToCoords} />

          {/* Temporary Marker for Searched Location */}
          {searchedLocation && (
            <Marker position={[searchedLocation.lat, searchedLocation.lng]} icon={searchPinIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-bold text-blue-400 block mb-1">📍 SEARCHED LOCATION</span>
                  <p className="text-slate-200">{searchedLocation.name}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Hazard Zones Circles & Pins */}
          {activeLayerFilter !== 'sensor' &&
            filteredZones.map((zone) => {
              const zoneColor =
                zone.riskLevel === 'CRITICAL'
                  ? '#ef4444'
                  : zone.riskLevel === 'HIGH'
                  ? '#f97316'
                  : zone.riskLevel === 'MODERATE'
                  ? '#f59e0b'
                  : '#10b981';

              return (
                <React.Fragment key={zone.id}>
                  <Circle
                    center={[zone.coordinates.lat, zone.coordinates.lng]}
                    radius={zone.radiusMeters || 600}
                    pathOptions={{
                      color: zoneColor,
                      fillColor: zoneColor,
                      fillOpacity: zone.riskLevel === 'CRITICAL' ? 0.35 : 0.2,
                      weight: 2,
                    }}
                  />

                  <Marker
                    position={[zone.coordinates.lat, zone.coordinates.lng]}
                    icon={createCustomMarkerIcon(zone.riskLevel)}
                    eventHandlers={{
                      click: () => onSelectLocation && onSelectLocation(zone),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[240px]">
                        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-700">
                          <h4 className="font-bold text-sm text-white leading-snug">{zone.name}</h4>
                          <RiskBadge level={zone.riskLevel} size="sm" />
                        </div>

                        {zone.description && (
                          <p className="text-xs text-slate-300 mb-3 bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                            {zone.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block uppercase">Rainfall</span>
                            <span className="font-bold text-cyan-400">{zone.rainfallMmHr} mm/h</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block uppercase">Water Level</span>
                            <span className="font-bold text-blue-400">{zone.waterLevelM} m</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block uppercase">Soil Moisture</span>
                            <span className="font-bold text-amber-400">{zone.soilMoisturePct}%</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block uppercase">Risk Level</span>
                            <span className="font-bold text-rose-400">{zone.floodRiskPct}%</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}

          {/* IoT Sensor Markers */}
          {(activeLayerFilter === 'all' || activeLayerFilter === 'sensor') &&
            sensors.map((sensor) => (
              <Marker
                key={sensor.id}
                position={[sensor.coordinates.lat, sensor.coordinates.lng]}
                icon={createCustomMarkerIcon(
                  sensor.status === 'ONLINE' ? 'LOW' : sensor.status === 'WARNING' ? 'MODERATE' : 'CRITICAL'
                )}
              >
                <Popup>
                  <div className="p-2 min-w-[220px]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {sensor.type}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">● {sensor.status}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1">{sensor.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{sensor.locationName}</p>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-xs">
                      <span className="text-slate-400">Reading: </span>
                      <span className="font-bold text-white">{sensor.latestReading}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};