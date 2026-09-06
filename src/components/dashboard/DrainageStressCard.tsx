import React from 'react';
import { Gauge } from 'lucide-react';

interface DrainageStressCardProps {
  capacityPct: number;
  currentLoadPct: number;
  flowRateM3s: number;
  status: 'OPTIMAL' | 'MODERATE STRESS' | 'HIGH LOAD' | 'OVERLOAD RISK';
}

export const DrainageStressCard: React.FC<DrainageStressCardProps> = ({
  capacityPct = 100,
  currentLoadPct = 92,
  flowRateM3s = 145.2,
  status = 'OVERLOAD RISK',
}) => {
  const isOverload = currentLoadPct >= 85;

  return (
    <div className={`glass-panel p-6 rounded-2xl border transition-all ${
      isOverload ? 'border-rose-500/40 bg-rose-950/10 border-glow-red' : 'border-white/10'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white font-display">Drainage Stress Analysis</h3>
            <p className="text-xs text-slate-400">Real-time stormwater outlet & pump channel load</p>
          </div>
        </div>

        <span className={`px-3 py-1 text-xs font-extrabold uppercase rounded-lg border ${
          isOverload
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        }`}>
          {status}
        </span>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">
            Drain Capacity
          </span>
          <span className="text-2xl font-black text-white font-display">{capacityPct}%</span>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">
            Current Channel Load
          </span>
          <span className={`text-2xl font-black font-display ${isOverload ? 'text-rose-400' : 'text-amber-400'}`}>
            {currentLoadPct}%
          </span>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">
            Water Discharge Flow
          </span>
          <span className="text-2xl font-black text-cyan-400 font-display">
            {flowRateM3s} <span className="text-xs text-slate-400 font-normal">m³/s</span>
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">Channel Hydraulic Saturation</span>
          <span className={isOverload ? 'text-rose-400 font-bold' : 'text-slate-300'}>
            {currentLoadPct}% Saturated
          </span>
        </div>

        <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              currentLoadPct > 85
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600'
            }`}
            style={{ width: `${currentLoadPct}%` }}
          />

          {/* 80% Threshold Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400/80 z-10"
            style={{ left: '85%' }}
            title="Critical Overload Threshold (85%)"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
          <span>0% (Empty)</span>
          <span className="text-rose-400 font-semibold">85% Critical Siphon Limit</span>
          <span>100% (Maximum Flow)</span>
        </div>
      </div>
    </div>
  );
};
