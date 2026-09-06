import React, { useState } from 'react';
import type { SafeRouteInfo } from '../types';
import { SafeRouteMap } from '../components/maps/SafeRouteMap';
import { Navigation, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SafeRoutesProps {
  routes: SafeRouteInfo[];
}

export const SafeRoutes: React.FC<SafeRoutesProps> = ({ routes }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].id);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

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
            Real-time hydrodynamic inundation avoidance and dynamic shelter routing engine
          </p>
        </div>

        {/* Route Selector Tabs */}
        <div className="flex items-center gap-2">
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition border ${
                selectedRouteId === r.id
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Route: {r.startLocation.split(' ')[0]} &rarr; Shelter
            </button>
          ))}
        </div>
      </div>

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
          <SafeRouteMap route={selectedRoute} height="500px" />
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
