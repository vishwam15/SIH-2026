import React from 'react';
import type { EmergencyAlert } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ShieldAlert, MapPin, Clock, Users, CheckCircle, AlertOctagon } from 'lucide-react';

interface AlertCardProps {
  alert: EmergencyAlert;
  onAcknowledge: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge }) => {
  const isCritical = alert.severity === 'CRITICAL';

  return (
    <div
      className={`glass-panel p-5 rounded-2xl border transition-all ${
        isCritical
          ? 'border-rose-500/50 bg-rose-950/10 border-glow-red'
          : 'border-white/10 hover:border-blue-500/30'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <RiskBadge level={alert.severity} size="md" animated={isCritical} />
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {alert.type}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <h3 className="font-bold text-base text-white font-display mb-2 flex items-center gap-2">
        <ShieldAlert
          className={`w-5 h-5 shrink-0 ${isCritical ? 'text-rose-400 animate-pulse' : 'text-orange-400'}`}
        />
        {alert.title}
      </h3>

      <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-3">
        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="font-semibold text-slate-200">{alert.location}</span>
      </div>

      {/* Recommended Action Protocol Box */}
      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs mb-4 leading-relaxed">
        <span className="font-bold text-amber-400 block mb-1">Recommended Response Action:</span>
        <p className="text-slate-300">"{alert.recommendedAction}"</p>
      </div>

      {/* Footer Info & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-white">{alert.affectedPopulation.toLocaleString()}</strong> citizens
          </span>
          <span>
            Probability: <strong className="text-rose-400">{alert.probabilityPct}%</strong>
          </span>
        </div>

        {alert.acknowledged ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle className="w-3.5 h-3.5" /> Acknowledged
          </span>
        ) : (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5" /> Acknowledge Alert
          </button>
        )}
      </div>
    </div>
  );
};
