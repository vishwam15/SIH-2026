import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import type { RiskLevel } from '../../types';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isIncreaseBad?: boolean;
    label?: string;
  };
  riskLevel?: RiskLevel;
  badgeText?: string;
  subtext?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  iconColor = 'text-blue-400',
  trend,
  riskLevel,
  badgeText,
  subtext,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-blue-500/40 hover:bg-slate-800/80' : ''
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/50 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Main Value & Unit */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold text-white tracking-tight font-display">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>

      {/* Footer Info Row */}
      <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-white/5">
        {riskLevel ? (
          <RiskBadge level={riskLevel} size="sm" />
        ) : badgeText ? (
          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium">
            {badgeText}
          </span>
        ) : trend ? (
          <div className="flex items-center gap-1">
            {trend.value > 0 ? (
              <TrendingUp
                className={`w-3.5 h-3.5 ${
                  trend.isIncreaseBad ? 'text-rose-400' : 'text-emerald-400'
                }`}
              />
            ) : trend.value < 0 ? (
              <TrendingDown
                className={`w-3.5 h-3.5 ${
                  trend.isIncreaseBad ? 'text-emerald-400' : 'text-rose-400'
                }`}
              />
            ) : (
              <Minus className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span
              className={`font-semibold ${
                trend.value > 0
                  ? trend.isIncreaseBad
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
            </span>
            <span className="text-slate-400 ml-1">{trend.label || 'vs last hour'}</span>
          </div>
        ) : (
          <span className="text-slate-400">{subtext || 'Live telemetry'}</span>
        )}

        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>
    </div>
  );
};
