import React, { useState } from 'react';
import type { SafeRouteInfo } from '../types';
import { SafeRouteMap } from '../components/maps/SafeRouteMap';
import { DisasterShieldAPI } from '../services/api';
import { Navigation, AlertTriangle, ShieldCheck, CheckCircle2, Zap, RefreshCw, CloudRain } from 'lucide-react';

interface SafeRoutesProps {
  routes: SafeRouteInfo[];
}

export const SafeRoutes: React.FC<SafeRoutesProps> = ({ routes: initialRoutes }) => {
  const [routesList, setRoutesList] = useState<SafeRouteInfo[]>(initialRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialRoutes[0]?.id || 'route-1');
  const [simRainfall, setSimRainfall] = useState<number>(95);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [engineStatus, setEngineStatus] = useState<string>('FastAPI Connected');
  const [liveRainfall, setLiveRainfall] = useState<number | null>(null);

  React.useEffect(() => {
    DisasterShieldAPI.getLiveTelemetryMesh()
      .then((mesh) => {
        if (mesh && mesh.weather) {
          setLiveRainfall(mesh.weather.current_rainfall_mm_hr);
        }
      })
      .catch(() => {});
  }, []);

  const selectedRoute = routesList.find((r) => r.id === selectedRouteId) || routesList[0];

  const handleRecalculateSafeRoute = async (rainfallOverride?: number) => {
    setIsCalculating(true);
    const rainToUse = rainfallOverride !== undefined ? rainfallOverride : simRainfall;
    setEngineStatus('Computing Dijkstra Avoidance Graph...');

    try {
      const dynamicRoute = await DisasterShieldAPI.getDynamicSafeRoute(
        [19.1170, 72.8440],
        [19.0550, 72.8350],
        rainToUse
      );

      if (dynamicRoute) {
        setRoutesList((prev) => {
          const filtered = prev.filter((r) => r.id !== dynamicRoute.id);
          return [dynamicRoute, ...filtered];
        });
        setSelectedRouteId(dynamicRoute.id);
        setEngineStatus(`FastAPI Engine: Path Optimized (${rainToUse} mm/h rain)`);
      } else {
        setEngineStatus('Backend unreachable, loaded local route');
      }
    } catch {
      setEngineStatus('Error connecting to engine');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Navigation className="w-6 h-6" />
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
              Safe Evacuation Route System 🚗
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hydrodynamic inundation avoidance and dynamic shelter routing engine (FastAPI + NetworkX)
          </p>
        </div>

        {/* Route Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {routesList.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition border ${
                selectedRouteId === r.id
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r.id.startsWith('live-route') ? '⚡ Live Engine Route' : `Route: ${r.startLocation.split(' ')[0]} → Shelter`}
            </button>
          ))}
        </div>
      </div>

      {/* Live Simulation Trigger Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-2">
              FastAPI Modified Dijkstra Engine
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {engineStatus}
              </span>
            </span>
            <p className="text-[11px] text-slate-400">
              Assigns infinite weight (barrier) to street corridors adjacent to surcharged manholes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Scenario Preset Chips */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            {liveRainfall !== null && (
              <button
                onClick={() => {
                  setSimRainfall(liveRainfall);
                  handleRecalculateSafeRoute(liveRainfall);
                }}
                className="px-2.5 py-1 rounded-lg font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 transition flex items-center gap-1"
                title="Apply real-time Open-Meteo satellite precipitation"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Live: {liveRainfall} mm/h
              </button>
            )}
            <button
              onClick={() => setSimRainfall(30)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                simRainfall <= 40 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 mm (Dry)
            </button>
            <button
              onClick={() => setSimRainfall(65)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                simRainfall > 40 && simRainfall <= 85 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              65 mm (Heavy)
            </button>
            <button
              onClick={() => setSimRainfall(130)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                simRainfall > 85 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              130 mm (Torrent)
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={simRainfall}
              onChange={(e) => setSimRainfall(Number(e.target.value))}
              className="w-24 accent-emerald-500 cursor-pointer"
            />
            <span className="text-xs font-black text-emerald-400 w-14">{simRainfall} mm/h</span>
          </div>

          <button
            onClick={() => handleRecalculateSafeRoute()}
            disabled={isCalculating}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? 'Calculating...' : 'Recalculate Avoidance Route'}
          </button>
        </div>
      </div>

      {/* Citizen Safety Status Cards */}
      {selectedRoute && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-2">Citizen Safety Status</p>
            <div className="text-2xl font-black text-white">{selectedRoute.status}</div>
            <p className="text-[11px] text-slate-300 mt-1">Route viability based on current hazard layers</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-2">Estimated Travel</p>
            <div className="text-2xl font-black text-white">{selectedRoute.estimatedTimeMin} min</div>
            <p className="text-[11px] text-slate-300 mt-1">Time to the nearest safety point</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-2">Emergency Contact</p>
            <div className="text-base font-black text-white">112 / NDMA Helpdesk</div>
            <p className="text-[11px] text-slate-300 mt-1">Use during active flooding or landslide watch</p>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Route Map (Col 8) & Route Details Checklist (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Safe Route Map (Col 8) */}
        <div className="lg:col-span-8">
          <SafeRouteMap route={selectedRoute} height="520px" />
        </div>

        {/* Route Summary Checklist & Roads to Avoid (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Start & Destination info */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" /> Evacuation Route Protocol
            </h3>

            {/* Current Location */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-blue-400 block mb-0.5">
                📍 CURRENT LOCATION
              </span>
              <p className="text-xs font-bold text-white">{selectedRoute.startLocation}</p>
            </div>

            {/* Destination Shelter */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">
                🏥 NEAREST SAFE SHELTER
              </span>
              <p className="text-xs font-bold text-white">{selectedRoute.destinationShelter}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Distance: <strong>{selectedRoute.distanceKm} km</strong> • Est. Transit: <strong>{selectedRoute.estimatedTimeMin} mins</strong>
              </p>
            </div>
          </div>

          {/* Card 2: Recommended Safe Passages (Green) */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
            <h4 className="font-bold text-xs uppercase text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 🟢 RECOMMENDED SAFE PASSAGES
            </h4>

            <ul className="space-y-2 text-xs">
              {selectedRoute.safePassages.map((passage, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{passage}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Dangerous Roads to Avoid (Red) */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/40 bg-rose-950/10 space-y-3">
            <h4 className="font-bold text-xs uppercase text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 🚫 ROADS TO AVOID (HIGH INUNDATION)
            </h4>

            <ul className="space-y-2 text-xs">
              {selectedRoute.roadsToAvoid.map((road, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <strong className="text-rose-300">{road}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
