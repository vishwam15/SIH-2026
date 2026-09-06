import React from 'react';
import type { EmergencyAlert } from '../../types';
import { ShieldAlert, ChevronRight } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface QuickAlertsTickerProps {
  alerts: EmergencyAlert[];
  onViewAllAlerts: () => void;
}

export const QuickAlertsTicker: React.FC<QuickAlertsTickerProps> = ({
  alerts,
  onViewAllAlerts,
}) => {
  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const currentAlert = activeAlerts[0] || alerts[0];

  if (!currentAlert) return null;

  return (
    <div className="glass-panel p-3 px-4 rounded-xl border border-rose-500/30 bg-rose-950/20 flex flex-wrap items-center justify-between gap-3 text-xs mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white font-extrabold tracking-wider uppercase text-[10px] shrink-0 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" /> LIVE ALERT TICKER
        </span>

        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-white truncate">{currentAlert.title}</span>
          <span className="text-slate-400 hidden sm:inline">• {currentAlert.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <RiskBadge level={currentAlert.severity} size="sm" />
        <button
          onClick={onViewAllAlerts}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold transition"
        >
          View All ({alerts.length}) <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
