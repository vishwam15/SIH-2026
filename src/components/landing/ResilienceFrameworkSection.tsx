import React, { useState, useEffect } from 'react';
import {
  Activity,
  Navigation,
  Radio,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ResilienceFrameworkSection: React.FC<{ onNavigate: (page: any) => void }> = ({ onNavigate }) => {
  // Pillar 1 Interactive State: Hydrological Simulator
  const [rainIntensity, setRainIntensity] = useState(85);
  const runoffCoeff = (0.75 + (rainIntensity / 200) * 0.2).toFixed(2);
  const floodRiskPct = Math.min(100, Math.round((rainIntensity / 150) * 100));

  // Pillar 2 Interactive State: Dijkstra Evacuation Graph
  const [hazardInjected, setHazardInjected] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Pillar 3 Interactive State: Dispatch Simulator
  const [activeDispatchStep, setActiveDispatchStep] = useState(0);

  // Auto-cycle dispatch pulses
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDispatchStep((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateHazard = () => {
    setIsCalculatingRoute(true);
    setTimeout(() => {
      setHazardInjected((prev) => !prev);
      setIsCalculatingRoute(false);
    }, 700);
  };

  return (
    <section
      id="framework"
      className="py-32 relative overflow-hidden bg-[#030008]/95 backdrop-blur-3xl border-t border-white/10 z-10"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-rose-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-rose-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> RESILIENCE FRAMEWORK ARCHITECTURE
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            CLOSED-LOOP <span className="animate-neon-text">DISASTER INTELLIGENCE.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
            From predictive cloudburst hydrodynamics to dynamic life-safety evacuation corridors and automated NDRF tactical dispatch.
          </p>
        </div>

        {/* 3 Interactive "Animatories" Pillar Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* ========================================================================= */}
          {/* PILLAR 1: PREDICTIVE HYDROLOGY & NOWCASTING SIMULATOR                     */}
          {/* ========================================================================= */}
          <div className="rounded-[30px] bg-[#090b14]/90 border border-cyan-500/30 p-8 flex flex-col justify-between relative hover:border-cyan-400/60 transition-all shadow-[0_0_30px_rgba(0,240,255,0.08)] group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-extrabold uppercase">
                  Pillar 01 // Hydrology
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400 animate-pulse" /> 0–3H NOWCAST
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-black text-white">
                  Predictive Runoff & Cloudburst Hydrodynamics
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Couples radar rainfall with DEM depression storage and drainage graph capacity to model street-level inundation waves.
                </p>
              </div>

              {/* Interactive Animatory Widget: Rainfall Slider & Dynamic Hydrograph */}
              <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Rainfall Intensity:
                  </span>
                  <span className="text-cyan-300 font-black">{rainIntensity} mm/h</span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="160"
                  value={rainIntensity}
                  onChange={(e) => setRainIntensity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                {/* Animated Hydrograph Bars */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Drainage Runoff Load:</span>
                    <span className={floodRiskPct > 70 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {floodRiskPct}% {floodRiskPct > 70 ? 'SURCHARGE' : 'STABLE'}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 flex items-center p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        floodRiskPct > 70
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                      }`}
                      style={{ width: `${floodRiskPct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">RUNOFF COEFF (C)</span>
                    <span className="text-cyan-300 font-bold">{runoffCoeff}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">IMD FORECAST LEAD</span>
                    <span className="text-slate-200 font-bold">+120 Minutes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onNavigate('flood')}
                className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Launch Flood Model</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PILLAR 2: DYNAMIC HAZARD-PENALIZED DIJKSTRA ROUTE MESH                   */}
          {/* ========================================================================= */}
          <div className="rounded-[30px] bg-[#090b14]/90 border border-purple-500/30 p-8 flex flex-col justify-between relative hover:border-purple-400/60 transition-all shadow-[0_0_30px_rgba(168,85,247,0.08)] group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-extrabold uppercase">
                  Pillar 02 // Evacuation
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-purple-400 animate-pulse" /> GRAPH ROUTING
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-black text-white">
                  Dynamic Dijkstra Hazard-Penalized Corridors
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Real-time edge penalty matrices recalculate road paths around waterlogged corridors, guiding evacuees safely to relief shelters.
                </p>
              </div>

              {/* Interactive Animatory Widget: Graph Topology Route Simulation */}
              <div className="p-4 rounded-2xl bg-black/70 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">GRAPH TOPOLOGY STATUS</span>
                  <span className={hazardInjected ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {hazardInjected ? 'CORRIDOR BLOCKED → RE-ROUTED' : 'PRIMARY CORRIDOR ACTIVE'}
                  </span>
                </div>

                {/* Animated Node Graph Visualizer */}
                <div className="relative h-28 w-full bg-slate-950/80 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-2">
                  <svg className="w-full h-full" viewBox="0 0 240 90">
                    {/* Primary Path */}
                    <line
                      x1="30"
                      y1="45"
                      x2="120"
                      y2={hazardInjected ? '72' : '45'}
                      stroke={hazardInjected ? '#ef4444' : '#10b981'}
                      strokeWidth={hazardInjected ? '1.5' : '3'}
                      strokeDasharray={hazardInjected ? '4 3' : 'none'}
                    />
                    <line
                      x1="120"
                      y1={hazardInjected ? '72' : '45'}
                      x2="210"
                      y2="45"
                      stroke={hazardInjected ? '#a855f7' : '#10b981'}
                      strokeWidth="3"
                    />

                    {/* Alternate Safe Corridor when hazard injected */}
                    {hazardInjected && (
                      <path
                        d="M 30,45 Q 120,15 210,45"
                        fill="none"
                        stroke="#00F0FF"
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                    )}

                    {/* Nodes */}
                    <circle cx="30" cy="45" r="7" fill="#00F0FF" />
                    <text x="30" y="32" fontSize="9" fill="#00F0FF" textAnchor="middle" fontFamily="monospace">
                      Citizen
                    </text>

                    <circle
                      cx="120"
                      cy={hazardInjected ? '72' : '45'}
                      r="6"
                      fill={hazardInjected ? '#ef4444' : '#a855f7'}
                    />
                    <text
                      x="120"
                      y={hazardInjected ? '88' : '32'}
                      fontSize="9"
                      fill={hazardInjected ? '#ef4444' : '#a855f7'}
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {hazardInjected ? 'Hazard Zone' : 'Node X'}
                    </text>

                    <circle cx="210" cy="45" r="7" fill="#10b981" />
                    <text x="210" y="32" fontSize="9" fill="#10b981" textAnchor="middle" fontFamily="monospace">
                      Shelter
                    </text>
                  </svg>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleSimulateHazard}
                    disabled={isCalculatingRoute}
                    className="w-full py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isCalculatingRoute ? 'animate-spin' : ''}`} />
                    <span>{hazardInjected ? 'Clear Hazard Barrier' : 'Inject Flooded Corridor'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onNavigate('routes')}
                className="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Open Route Navigator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PILLAR 3: OFFLINE-FIRST EDGE & TACTICAL NDRF DISPATCH                     */}
          {/* ========================================================================= */}
          <div className="rounded-[30px] bg-[#090b14]/90 border border-rose-500/30 p-8 flex flex-col justify-between relative hover:border-rose-400/60 transition-all shadow-[0_0_30px_rgba(244,63,94,0.08)] group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-extrabold uppercase">
                  Pillar 03 // Operations
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-rose-400 animate-ping" /> TACTICAL MESH
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-black text-white">
                  Resilient Offline Edge & Automated NDRF Dispatch
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  PWA local FIFO queue saves field incident reports during cellular blackouts, synchronizing seamlessly with disaster command dispatches.
                </p>
              </div>

              {/* Interactive Animatory Widget: Live Incident Dispatch Pulse */}
              <div className="p-4 rounded-2xl bg-black/70 border border-rose-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">LIVE WEBSOCKET PIPELINE</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PWA CACHED & READY
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 0, label: 'Citizen SOS Triggered', role: 'Offline PWA Sync', time: 'T+0.0s' },
                    { id: 1, label: 'Geo-Cluster Ingestion', role: 'FastAPI Edge', time: 'T+0.4s' },
                    { id: 2, label: 'NDRF Unit #03 Dispatched', role: 'Socket.IO Mesh', time: 'T+0.9s' },
                    { id: 3, label: 'Medical Evacuation En-Route', role: 'Life Corridor Cleared', time: 'T+1.4s' },
                  ].map((step) => {
                    const isCurrent = activeDispatchStep === step.id;
                    return (
                      <div
                        key={step.id}
                        className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between transition-all duration-300 ${
                          isCurrent
                            ? 'bg-rose-500/20 border-rose-500/60 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'bg-black/40 border-white/5 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCurrent ? 'bg-rose-400 animate-ping' : 'bg-slate-600'
                            }`}
                          />
                          <span className="font-bold">{step.label}</span>
                        </div>
                        <span className="text-[10px] text-rose-300/80">{step.time}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">OFFLINE QUEUE</span>
                    <span className="text-emerald-400 font-bold">0 Pending (Auto-Sync)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RF PACKET LOSS</span>
                    <span className="text-cyan-300 font-bold">&lt; 0.02%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onNavigate('field-reports')}
                className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Open Dispatch Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
