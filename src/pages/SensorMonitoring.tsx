import React, { useState } from 'react';
import type { SensorData } from '../types';
import {
  Radio,
  Battery,
  Search,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface SensorMonitoringProps {
  sensors: SensorData[];
}

export const SensorMonitoring: React.FC<SensorMonitoringProps> = ({
  sensors,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSensors = sensors.filter((s) => {
    const matchesType = filterType === 'all' || s.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sensorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Radio className="w-6 h-6" />
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
              NDMA Real-Time Telemetry Nodes 📡
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry stream from NDMA ultrasonic, rain gauge, TDR, tilt, and seismic edge nodes
          </p>
        </div>

        {/* System Telemetry Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Online: <strong className="text-emerald-400">24/26</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Offline: <strong className="text-rose-400">1</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Warnings: <strong className="text-amber-400">1</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sensor ID, location name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['all', 'flood', 'rain', 'water level', 'soil', 'tilt'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl uppercase font-extrabold text-[11px] transition ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sensors Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Sensor ID</th>
                <th className="p-4">Sensor Name & Location</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Battery</th>
                <th className="p-4">Latest Reading</th>
                <th className="p-4">Last Telemetry</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSensors.map((sensor) => (
                <tr
                  key={sensor.id}
                  onClick={() => setSelectedSensor(sensor)}
                  className="hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="p-4 font-mono font-bold text-blue-400">{sensor.sensorId}</td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{sensor.name}</span>
                    <span className="text-[11px] text-slate-400">{sensor.locationName}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {sensor.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        sensor.status === 'ONLINE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : sensor.status === 'WARNING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          sensor.status === 'ONLINE'
                            ? 'bg-emerald-400 animate-pulse'
                            : sensor.status === 'WARNING'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      {sensor.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-300">
                      <Battery className="w-4 h-4 text-emerald-400" />
                      {sensor.batteryLevelPct}%
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-white text-sm">
                    {sensor.latestReading}
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">{sensor.lastUpdated}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSensor(sensor);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold hover:bg-blue-600 hover:text-white transition"
                    >
                      View Chart &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Detailed Modal / Panel for Selected Sensor */}
      {selectedSensor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-white/10 bg-slate-900/95 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedSensor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {selectedSensor.name} ({selectedSensor.sensorId})
                </h3>
                <p className="text-xs text-slate-400">{selectedSensor.locationName}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase block">Latest Telemetry</span>
                <span className="text-base font-extrabold text-white">
                  {selectedSensor.latestReading}
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase block">Battery Level</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {selectedSensor.batteryLevelPct}%
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 uppercase block">Node Status</span>
                <span className="text-base font-extrabold text-blue-400">
                  {selectedSensor.status}
                </span>
              </div>
            </div>

            {/* Recharts History Chart for Sensor */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                Recent 1-Hour Telemetry History
              </h4>
              <div className="h-48 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedSensor.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Sensor Reading"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSensor(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
