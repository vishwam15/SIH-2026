import React from 'react';
import { Cpu, Radio, CloudRain, Map, Database, ArrowRight, Sparkles, Waves, Mountain } from 'lucide-react';

export const AIWorkflowDiagram: React.FC = () => {
  const inputs = [
    { name: 'IoT Sensors', desc: 'Ultrasonic water & soil probes', icon: Radio, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { name: 'Weather Telemetry', desc: 'Rainfall Doppler radar & IMD', icon: CloudRain, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { name: 'Geographic GIS', desc: 'DEM elevation & slope models', icon: Map, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { name: 'Historical Data', desc: '50-year monsoon flood records', icon: Database, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  ];

  return (
    <div className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> NEURAL MULTI-HAZARD PREDICTIVE ENGINE
        </span>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-display">
          AI Risk Prediction Data Pipeline
        </h2>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Heterogeneous multi-source ingestion with deep ResNet-LSTM spatio-temporal ML processing
        </p>
      </div>

      {/* Visual Workflow Node Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Step 1: Data Ingestion Inputs (Cols 1-4) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            1. Data Ingestion Sources
          </span>
          {inputs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card p-3 rounded-xl border flex items-center gap-3 transition-transform hover:scale-[1.02]"
              >
                <div className={`p-2.5 rounded-lg border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrow Connector 1 */}
        <div className="hidden lg:flex lg:col-span-1 justify-center">
          <div className="flex flex-col items-center gap-1 text-blue-400 animate-pulse">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        {/* Step 2: AI Neural Processing Core (Cols 5-8) */}
        <div className="lg:col-span-3 text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 block mb-3">
            2. ML Processing Core
          </span>

          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/50 shadow-2xl shadow-blue-500/20 group">
            {/* Spinning Radar Effect */}
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-600/20 border-2 border-blue-400/60 flex items-center justify-center relative overflow-hidden mb-3">
              <Cpu className="w-10 h-10 text-cyan-300 z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/30 to-transparent animate-radar-sweep" />
            </div>

            <h3 className="font-bold text-sm text-white font-display">ResNet-LSTM & XGBoost</h3>
            <p className="text-[11px] text-slate-400 mt-1">Multi-modal spatio-temporal neural classification</p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] text-emerald-400 font-bold">Model v4.2 Active (96.4% ACC)</span>
            </div>
          </div>
        </div>

        {/* Arrow Connector 2 */}
        <div className="hidden lg:flex lg:col-span-1 justify-center">
          <div className="flex flex-col items-center gap-1 text-blue-400 animate-pulse">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        {/* Step 3: Risk Prediction Outputs (Cols 9-12) */}
        <div className="lg:col-span-3 space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 block mb-1">
            3. Hazard Risk Output
          </span>

          {/* Output Card 1: Flood */}
          <div className="glass-card p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400">
                <Waves className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Urban Flood Risk</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
                78% HIGH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Time to inundation impact: 1.2 hrs</p>
          </div>

          {/* Output Card 2: Landslide */}
          <div className="glass-card p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Mountain className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Landslide Risk</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/40">
                65% MODERATE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Slope saturation warning active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
