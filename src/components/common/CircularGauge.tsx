import React from 'react';
import type { RiskLevel } from '../../types';
import { RiskBadge } from './RiskBadge';

interface CircularGaugeProps {
  value: number; // 0 to 100
  title: string;
  subtitle?: string;
  riskLevel: RiskLevel;
  size?: number; // width/height in px
  strokeWidth?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  title,
  subtitle,
  riskLevel,
  size = 220,
  strokeWidth = 14,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getColor = () => {
    switch (riskLevel) {
      case 'LOW':
        return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' };
      case 'MODERATE':
        return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
      case 'HIGH':
        return { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' };
      case 'CRITICAL':
        return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' };
    }
  };

  const { stroke, glow } = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Outer Glow Ring */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ background: stroke }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0px 0px 8px ${glow})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-4xl font-black tracking-tight text-white font-display">
            {value}%
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-0.5">
            {title}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
        <RiskBadge level={riskLevel} size="md" animated={riskLevel === 'CRITICAL'} />
        {subtitle && <p className="text-xs text-slate-400 max-w-[200px]">{subtitle}</p>}
      </div>
    </div>
  );
};
