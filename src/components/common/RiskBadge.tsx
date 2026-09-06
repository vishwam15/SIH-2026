import React from 'react';
import type { RiskLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  showIcon = true,
  size = 'md',
  animated = false,
}) => {
  const getBadgeStyle = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
          dot: 'bg-orange-500',
          icon: AlertOctagon,
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-600/25 border-rose-500/60 text-rose-400 animate-pulse-glow',
          dot: 'bg-rose-500',
          icon: Flame,
        };
    }
  };

  const config = getBadgeStyle();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 font-bold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-300 ${config.bg} ${sizeClasses[size]}`}
    >
      <span
        className={`rounded-full ${config.dot} ${size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5'} ${
          animated ? 'animate-ping' : ''
        }`}
      />
      {showIcon && <IconComponent className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span className="tracking-wide uppercase">{level} RISK</span>
    </span>
  );
};
