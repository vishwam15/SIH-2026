import React from 'react';
import type { FloodMetrics, PageId } from '../types';
import { CircularGauge } from '../components/common/CircularGauge';
import { DrainageStressCard } from '../components/dashboard/DrainageStressCard';
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
  BarChart,
  Bar,
} from 'recharts';
import { Waves, CloudRain, Droplets, ArrowDown, Clock, Activity } from 'lucide-react';

interface FloodIntelligenceProps {
  metrics: FloodMetrics;
  onNavigate: (page: PageId) => void;
}

export const FloodIntelligence: React.FC<FloodIntelligenceProps> = ({
  metrics,
  onNavigate,
}) => {
  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Waves className="w-6 h-6" />
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
              Urban Flood Intelligence 🌊
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Catchment basin hydraulic telemetry, drainage load stress, and flood inundation forecasting
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-prediction')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
        >
          <Activity className="w-4 h-4" /> AI Prediction Breakdown &rarr;
        </button>
      </div>

      {/* Main Top Grid: Circular Risk Gauge & Live Data Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Circular Gauge Card (Col 4) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-center text-center">
          <CircularGauge
            value={metrics.overallRiskPct}
            title="FLOOD RISK SCORE"
            subtitle="Calculated via ResNet-LSTM rainfall-runoff model"
            riskLevel={metrics.riskLevel}
            size={230}
          />
        </div>

        {/* Live Data Cards Grid (Col 8 - 5 metrics) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Rainfall Intensity */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Rainfall Intensity</span>
              <CloudRain className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-white font-display">
                {metrics.rainfallIntensityMmHr}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">mm/hr</span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">● Torrential Downpour</span>
          </div>

          {/* Card 2: Water Level */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Water Level</span>
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-white font-display">
                {metrics.waterLevelM}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">m / {metrics.waterLevelMaxM}m max</span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">● 81% Maximum Depth</span>
          </div>

          {/* Card 3: Drainage Capacity */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Drainage Load</span>
              <Waves className="w-5 h-5 text-purple-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-rose-400 font-display">
                {metrics.drainageCapacityPct}%
              </span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">● Overload Risk Active</span>
          </div>

          {/* Card 4: Water Flow */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Water Discharge Flow</span>
              <ArrowDown className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-white font-display">
                {metrics.waterFlowRateM3s}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">m³/s</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">● 6 Dewatering Turbines Active</span>
          </div>

          {/* Card 5: Predicted Flood Time */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Predicted Flood Inundation Window</span>
              <Clock className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400 font-display">
                ~{metrics.predictedFloodTimeHours} Hours
              </span>
              <span className="text-xs text-slate-300">estimated until crest point</span>
            </div>
            <span className="text-[11px] text-slate-400">Precautionary barriers advised for Andheri & Kurla zones</span>
          </div>
        </div>
      </div>

      {/* Special Section: Drainage Intelligence Stress Analysis */}
      <DrainageStressCard
        capacityPct={100}
        currentLoadPct={metrics.drainageCapacityPct}
        flowRateM3s={metrics.waterFlowRateM3s}
        status="OVERLOAD RISK"
      />

      {/* Flood Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Rainfall Last 24 Hours */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              🌧️ Rainfall Intensity & Forecast (mm/hr)
            </h3>
            <span className="text-xs text-slate-400">Hourly Telemetry</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.hourlyRainfall}>
                <defs>
                  <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
                  dataKey="rainfall"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#rainGradient)"
                  name="Rainfall (mm/h)"
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  name="Danger Limit (50mm/h)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Water Level Trend */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              🌊 Water Level Trend vs Threshold Limits (meters)
            </h3>
            <span className="text-xs text-slate-400">Ultrasonic Telemetry</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.waterLevelTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="currentLevel"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Current Water Level (m)"
                />
                <Line
                  type="monotone"
                  dataKey="warningLevel"
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  name="Warning Mark (1.8m)"
                />
                <Line
                  type="monotone"
                  dataKey="dangerLevel"
                  stroke="#ef4444"
                  strokeDasharray="2 2"
                  name="Danger Mark (2.5m)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Drainage Capacity Usage */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              📊 Drainage Capacity Load vs Capacity
            </h3>
            <span className="text-xs text-slate-400">Pumping Channel Telemetry</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.drainageStressHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="loadPct" fill="#f97316" radius={[4, 4, 0, 0]} name="Current Load %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Flood Risk Prediction Over Time */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              🤖 Flood Risk Prediction Over Time (%)
            </h3>
            <span className="text-xs text-slate-400">AI Predictive Model</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.riskPredictionTrend}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                  dataKey="floodRisk"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#riskGradient)"
                  name="Flood Risk %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
