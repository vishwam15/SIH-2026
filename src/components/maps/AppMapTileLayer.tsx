import React, { useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { Layers } from 'lucide-react';

export type BasemapMode = 'dark' | 'streets' | 'satellite';

interface AppMapTileLayerProps {
  defaultMode?: BasemapMode;
  showSwitcher?: boolean;
}

export const AppMapTileLayer: React.FC<AppMapTileLayerProps> = ({
  defaultMode = 'dark',
  showSwitcher = true,
}) => {
  const [mode, setMode] = useState<BasemapMode>(defaultMode);
  const [menuOpen, setMenuOpen] = useState(false);

  const mapboxToken = (import.meta as any).env?.VITE_MAPBOX_TOKEN;
  const cartoKey = (import.meta as any).env?.VITE_CARTO_KEY;

  const renderTiles = () => {
    // 1. SATELLITE
    if (mode === 'satellite') {
      if (mapboxToken) {
        return (
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
            maxZoom={19}
          />
        );
      }
      return (
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxNativeZoom={18}
          maxZoom={19}
        />
      );
    }

    // 2. STREETS / LIGHT NAVIGATION
    if (mode === 'streets') {
      if (mapboxToken) {
        return (
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
            maxZoom={19}
          />
        );
      }
      if (cartoKey) {
        return (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${cartoKey}`}
            maxZoom={19}
          />
        );
      }
      // Zero-watermark, free OpenStreetMap tiles
      return (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
      );
    }

    // 3. DARK MODE (Command Center)
    if (mapboxToken) {
      return (
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
          maxZoom={19}
        />
      );
    }
    if (cartoKey) {
      return (
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${cartoKey}`}
          maxZoom={19}
        />
      );
    }

    // Default: High-clarity, watermark-free ESRI ArcGIS Dark Gray Canvas Base + Labels
    return (
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxNativeZoom={16}
          maxZoom={19}
        />
        <TileLayer
          attribution=""
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxNativeZoom={16}
          maxZoom={19}
        />
      </>
    );
  };

  return (
    <>
      {renderTiles()}
      {showSwitcher && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1200,
          }}
        >
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/20 backdrop-blur-md shadow-xl text-xs font-bold transition"
              title="Change Map Style"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize">{mode === 'dark' ? 'Dark' : mode === 'streets' ? 'Streets' : 'Satellite'}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-32 rounded-xl bg-slate-900/95 border border-white/15 backdrop-blur-xl p-1 shadow-2xl flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('dark');
                    setMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition ${
                    mode === 'dark' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🌙 Dark Mode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('streets');
                    setMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition ${
                    mode === 'streets' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🗺️ Street View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('satellite');
                    setMenuOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition ${
                    mode === 'satellite' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🛰️ Satellite
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
