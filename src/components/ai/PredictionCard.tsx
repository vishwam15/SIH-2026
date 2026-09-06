import React from 'react';
import type { AIPredictionResult } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Waves, Mountain, BrainCircuit, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PredictionCardProps {
  prediction: AIPredictionResult;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const isFlood = prediction.hazardType === 'FLOOD';
  const Icon = isFlood ? Waves : Mountain;
  const accentColor = isFlood ? 'text-cyan-400' : 'text-amber-400';
  const borderAccent = isFlood ? 'border-cyan-500/30' : 'border-amber-500/30';

  return (
    <div className={`glass-panel p-6 rounded-2xl border ${borderAccent} transition-all`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl bg-slate-800 border border-slate-700 ${accentColor}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white font-display">
                {prediction.hazardType} PREDICTION
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                (Impact in ~{prediction.timeToImpactHours}h)
              </span>
            </div>
            <p className="text-xs text-slate-400">{prediction.targetLocation}</p>
          </div>
        </div>

        <RiskBadge level={prediction.riskLevel} size="md" />
      </div>

      {/* Main Metric Banner */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Disaster Probability
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-white font-display">
              {prediction.probabilityPct}%
            </span>
            <span className="text-xs font-bold text-rose-400">High Confidence</span>
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Model Accuracy
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-emerald-400 font-display">
              {prediction.confidenceScorePct}%
            </span>
            <span className="text-xs text-slate-400">Validation Score</span>
          </div>
        </div>
      </div>

      {/* Primary Influencing Factors Breakdown */}
      <div className="space-y-3 mb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
          Key Contributing Factors
        </h4>

        <div className="space-y-2">
          {prediction.keyFactors.map((factor, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{factor.name}</span>
                <span className="text-slate-400 font-bold">{factor.weightPct}% Influence</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    factor.impact === 'HIGH'
                      ? 'bg-rose-500'
                      : factor.impact === 'MEDIUM'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${factor.weightPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Summary Box */}
      <div className="bg-blue-950/20 border border-blue-500/20 p-3.5 rounded-xl mb-4 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">AI Analytical Synthesis:</span>
          "{prediction.summaryText}"
        </div>
      </div>

      {/* Recommended Action */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            Intervention: <strong className="text-white">{prediction.recommendedIntervention}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
