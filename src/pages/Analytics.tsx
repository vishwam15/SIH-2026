import React from 'react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, Award } from 'lucide-react';

export const Analytics: React.FC = () => {
  const monthlyRainfallData = [
    { month: 'May', rainfall: 45 },
    { month: 'Jun', rainfall: 280 },
    { month: 'Jul', rainfall: 620 },
    { month: 'Aug', rainfall: 540 },
    { month: 'Sep (FC)', rainfall: 380 },
  ];

  const historicalTrends = [
    { week: 'Wk 1', floodIncidents: 2, landslideEvents: 0, accuracy: 95.8 },
    { week: 'Wk 2', floodIncidents: 5, landslideEvents: 1, accuracy: 96.2 },
    { week: 'Wk 3', floodIncidents: 8, landslideEvents: 3, accuracy: 97.1 },
    { week: 'Wk 4', floodIncidents: 12, landslideEvents: 4, accuracy: 96.4 },
  ];

  const alertDistribution = [
    { name: 'Critical', value: 8, color: '#ef4444' },
    { name: 'High', value: 15, color: '#f97316' },
    { name: 'Moderate', value: 24, color: '#f59e0b' },
    { name: 'Low', value: 40, color: '#10b981' },
  ];

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
              System Analytics & Performance 📊
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical disaster prediction accuracy analytics, seasonal rainfall trends, and alert efficiency metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Average Model Accuracy: 96.4%
          </span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Monitored Sectors</span>
          <p className="text-3xl font-black text-white font-display mt-1">18</p>
          <span className="text-[10px] text-emerald-400 font-bold">Smart City Zones</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Disasters Predicted</span>
          <p className="text-3xl font-black text-cyan-400 font-display mt-1">34</p>
          <span className="text-[10px] text-cyan-400 font-bold">100% Zero Casualties</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Avg ML Accuracy</span>
          <p className="text-3xl font-black text-emerald-400 font-display mt-1">96.4%</p>
          <span className="text-[10px] text-emerald-400 font-bold">ResNet-LSTM Validated</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Alerts Issued</span>
          <p className="text-3xl font-black text-rose-400 font-display mt-1">87</p>
          <span className="text-[10px] text-slate-400">Siren & App Alerts</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/10 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Sensor Network Uptime</span>
          <p className="text-3xl font-black text-blue-400 font-display mt-1">99.8%</p>
          <span className="text-[10px] text-emerald-400 font-bold">Telemetry Reliability</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Monsoon Rainfall (mm) */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              🌧️ Monthly Monsoon Precipitation (mm)
            </h3>
            <span className="text-xs text-slate-400">Seasonal Comparison</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="rainfall" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Rainfall (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Historical Hazard Incident Trends & Accuracy */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              📈 Historical Hazard Events vs ML Model Accuracy
            </h3>
            <span className="text-xs text-slate-400">Weekly Performance</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="floodIncidents" stroke="#06b6d4" strokeWidth={3} name="Flood Events" />
                <Line type="monotone" dataKey="landslideEvents" stroke="#f59e0b" strokeWidth={3} name="Landslide Events" />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Alert Severity Distribution Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display">
              🚨 Emergency Alerts Distribution by Severity Class
            </h3>
            <span className="text-xs text-slate-400">87 Total Alerts</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {alertDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
