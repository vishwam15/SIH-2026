import React from 'react';
import type { LandslideMetrics, PageId } from '../types';
import { CircularGauge } from '../components/common/CircularGauge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { Mountain, CloudRain, Thermometer, Activity, Compass } from 'lucide-react';

interface LandslideIntelligenceProps {
  metrics: LandslideMetrics;
  onNavigate: (page: PageId) => void;
}

export const LandslideIntelligence: React.FC<LandslideIntelligenceProps> = ({
  metrics,
  onNavigate,
}) => {
  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Mountain className="w-6 h-6" />
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
              Landslide Intelligence ⛰️
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Slope pore water pressure, MEMS tilt vector tracking, and micro-seismic acoustic monitoring
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-prediction')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
        >
          <Activity className="w-4 h-4" /> AI Risk Engine &rarr;
        </button>
      </div>

      {/* Top Grid: Circular Gauge & Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Circular Risk Score Gauge (Col 4) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-amber-500/30 flex flex-col items-center justify-center text-center">
          <CircularGauge
            value={metrics.overallRiskPct}
            title="LANDSLIDE RISK SCORE"
            subtitle="Calculated via XGBoost Spatial-Terrain Model"
            riskLevel={metrics.riskLevel}
            size={230}
          />
        </div>

        {/* 5 Monitor Metrics Cards Grid (Col 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Metric 1: Rainfall 24h Accumulation */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">24h Cumulative Rain</span>
              <CloudRain className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-white font-display">
                {metrics.rainfallAccumulation24hMm}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">mm</span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">● Exceeds 200mm Critical Limit</span>
          </div>

          {/* Metric 2: Soil Moisture Saturation */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Soil Moisture Saturation</span>
              <Thermometer className="w-5 h-5 text-amber-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-amber-400 font-display">
                {metrics.soilMoisturePct}%
              </span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">● Pore Water Pressure High</span>
          </div>

          {/* Metric 3: Ground Tilt Vector */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Ground Tilt Vector</span>
              <Compass className="w-5 h-5 text-purple-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-white font-display">
                +{metrics.groundTiltDegrees}°
              </span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">● MEMS Inclinometer Shift</span>
          </div>

          {/* Metric 4: Ground Vibration */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Ground Micro Vibration</span>
              <Activity className="w-5 h-5 text-rose-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-white font-display">
                {metrics.groundVibrationHz}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">Hz</span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">● Acoustic Tremors Detected</span>
          </div>

          {/* Metric 5: Terrain Slope Risk */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Terrain Slope Inclination</span>
              <Mountain className="w-5 h-5 text-amber-400" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-display">
                {metrics.terrainSlopeDegrees}° Slope
              </span>
              <span className="text-xs text-slate-300">Unstable Escarpment Topography</span>
            </div>
            <span className="text-[11px] text-slate-400">Ghatkopar Sector 3 & Mumbra Ridge hill clusters</span>
          </div>
        </div>
      </div>

      {/* Landslide Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Soil Moisture Trend */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              🌱 Soil Moisture Saturation Trend (%)
            </h3>
            <span className="text-xs text-slate-400">TDR Telemetry</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.soilMoistureTrend}>
                <defs>
                  <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Area
                  type="monotone"
                  dataKey="moisturePct"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fill="url(#soilGradient)"
                  name="Moisture %"
                />
                <Line
                  type="monotone"
                  dataKey="criticalThreshold"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  name="Saturation Limit (80%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Ground Movement & Vibration */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              📐 Ground Tilt Vector vs Acoustic Vibration
            </h3>
            <span className="text-xs text-slate-400">Inclinometer / Seismic</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.groundMovementTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="tiltDeg"
                  stroke="#c084fc"
                  strokeWidth={3}
                  name="Ground Tilt (°)"
                />
                <Line
                  type="monotone"
                  dataKey="vibration"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  name="Seismic Vibration (Hz)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
