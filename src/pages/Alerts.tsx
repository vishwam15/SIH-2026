import React, { useState } from 'react';
import type { EmergencyAlert } from '../types';
import { AlertCard } from '../components/alerts/AlertCard';
import { ShieldAlert, Filter, CheckCircle2, Bell } from 'lucide-react';

interface AlertsProps {
  alerts: EmergencyAlert[];
  onAcknowledge: (id: string) => void;
}

export const Alerts: React.FC<AlertsProps> = ({ alerts, onAcknowledge }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'flood' | 'landslide' | 'critical' | 'resolved'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'flood') return alert.type === 'FLOOD';
    if (activeFilter === 'landslide') return alert.type === 'LANDSLIDE';
    if (activeFilter === 'critical') return alert.severity === 'CRITICAL';
    if (activeFilter === 'resolved') return alert.acknowledged;
    return true;
  });

  const activeCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
              Emergency Alert Operations Center 🚨
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated multi-hazard flash warnings broadcasted to Municipal Operations & Citizen Evacuation Apps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
            <Bell className="w-4 h-4" /> {activeCount} Unacknowledged Siren Alerts
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 uppercase font-extrabold text-[11px]">Filter Category:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: `All Alerts (${alerts.length})` },
            { id: 'critical', label: 'Critical Only' },
            { id: 'flood', label: 'Flood Warnings' },
            { id: 'landslide', label: 'Landslide Warnings' },
            { id: 'resolved', label: 'Acknowledged' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl border uppercase font-extrabold text-[11px] transition ${
                activeFilter === tab.id
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Alert Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
          ))
        ) : (
          <div className="col-span-2 glass-panel p-12 rounded-2xl border border-white/10 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-white">No active alerts matching filter</h3>
            <p className="text-xs text-slate-400 mt-1">All clear in selected hazard category</p>
          </div>
        )}
      </div>
    </div>
  );
};
