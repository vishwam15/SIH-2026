import React from 'react';
import type {
  DashboardStats,
  MapZone,
  SensorData,
  EmergencyAlert,
  PageId,
  UserRole,
} from '../types';
import { StatCard } from '../components/common/StatCard';
import { QuickAlertsTicker } from '../components/dashboard/QuickAlertsTicker';
import { MultiHazardMap } from '../components/maps/MultiHazardMap';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  Waves,
  Radio,
  ShieldAlert,
  Activity,
  Layers,
  Shield,
  Building2,
  Truck,
  Wrench,
  Bell,
  Navigation,
  Award,
  CloudRain,
  Thermometer,
  Wind,
  Globe,
} from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
  zones: MapZone[];
  sensors: SensorData[];
  alerts: EmergencyAlert[];
  onNavigate: (page: PageId) => void;
  onSelectZone: (zone: MapZone) => void;
  userRole?: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  zones,
  sensors,
  alerts,
  onNavigate,
  onSelectZone,
  userRole = 'authority',
}) => {
  const criticalZones = zones.filter(
    (z) => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH'
  );

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'System Admin';
      case 'authority':
        return 'Disaster Management Authority';
      case 'response':
        return 'Emergency Response Team';
      case 'field':
        return 'Field Maintenance Officer';
      default:
        return 'Disaster Authority';
    }
  };

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Role-Tailored Action Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {userRole === 'admin' ? (
              <Shield className="w-6 h-6" />
            ) : userRole === 'authority' ? (
              <Building2 className="w-6 h-6" />
            ) : userRole === 'response' ? (
              <Truck className="w-6 h-6 text-rose-400" />
            ) : (
              <Wrench className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-white font-display">
                Logged in as: <span className="text-emerald-400">{getRoleTitle()}</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Active Clearance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Role-tailored command dashboard shortcuts & hazard dispatch tools
            </p>
          </div>
        </div>

        {/* Dynamic Quick Actions per Selected Role */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          {userRole === 'authority' && (
            <>
              <button
                onClick={() => onNavigate('alerts')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4" /> Dispatch Public Alert
              </button>
              <button
                onClick={() => onNavigate('flood')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
              >
                <Waves className="w-4 h-4" /> Flood Models
              </button>
            </>
          )}

          {userRole === 'response' && (
            <>
              <button
                onClick={() => onNavigate('routes')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4" /> Safe Routes & Shelters
              </button>
              <button
                onClick={() => onNavigate('alerts')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" /> View Emergency Alerts
              </button>
            </>
          )}

          {userRole === 'field' && (
            <>
              <button
                onClick={() => onNavigate('sensors')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <Radio className="w-4 h-4" /> Telemetry Calibration
              </button>
              <button
                onClick={() => onNavigate('sensors')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-1.5"
              >
                <Wrench className="w-4 h-4 text-amber-400" /> Battery Health
              </button>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <button
                onClick={() => onNavigate('settings')}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" /> Configure Threshold Rules
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-1.5"
              >
                <Activity className="w-4 h-4 text-cyan-400" /> System Audit Logs
              </button>
            </>
          )}
        </div>
      </div>

      {/* Real-Time Multi-Stream Satellite & Environmental Telemetry Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Live Multi-Stream Telemetry Mesh
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Open-Meteo & GloFAS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mumbai Catchment (19.0760° N, 72.8777° E) • Real-time meteorological & hydrological synchronization
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Precipitation:</span>
            <span className="font-extrabold text-white font-mono">{stats.currentRainfallMmHr.toFixed(1)} mm/hr</span>
          </div>

          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Temp / Humidity:</span>
            <span className="font-extrabold text-white font-mono">{stats.temperatureC ?? 28.5}°C / {stats.humidityPct ?? 84}%</span>
          </div>

          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">River Discharge:</span>
            <span className="font-extrabold text-cyan-300 font-mono">{stats.riverDischargeM3s ?? 142.0} m³/s</span>
          </div>

          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Wind className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">Wind:</span>
            <span className="font-extrabold text-white font-mono">{stats.windSpeedKmh ?? 15} km/h</span>
          </div>
        </div>
      </div>

      {/* Quick Alert Banner */}
      <QuickAlertsTicker alerts={alerts} onViewAllAlerts={() => onNavigate('alerts')} />

      {/* STEP 3: 4 KPI Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Disasters Predicted */}
        <StatCard
          title="Disasters Predicted"
          value="34"
          badgeText="ZERO CASUALTIES"
          icon={ShieldAlert}
          iconColor="text-emerald-400"
          subtext="100% Impact Avoidance"
          onClick={() => onNavigate('ai-prediction')}
        />

        {/* KPI 2: Avg Model Accuracy */}
        <StatCard
          title="Avg Model Accuracy"
          value="96.4%"
          badgeText="VALIDATED"
          icon={Award}
          iconColor="text-cyan-400"
          subtext="ResNet-LSTM & XGBoost"
          onClick={() => onNavigate('ai-prediction')}
        />

        {/* KPI 3: Active Alerts */}
        <StatCard
          title="Active Alerts"
          value="87"
          riskLevel="CRITICAL"
          icon={Bell}
          iconColor="text-rose-400"
          subtext="Siren & App Broadcasts"
          onClick={() => onNavigate('alerts')}
        />

        {/* KPI 4: Sensor Network Uptime */}
        <StatCard
          title="Sensor Network Uptime"
          value="99.8%"
          badgeText="RELIABLE"
          icon={Radio}
          iconColor="text-emerald-400"
          subtext="24 IoT Hardware Nodes Live"
          onClick={() => onNavigate('sensors')}
        />
      </div>

      {/* Interactive Leaflet Map Section with City Geocoding Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Interactive Multi-Hazard Map & Nominatim Geocoder
          </h2>
          <span className="text-xs text-slate-400">
            Floating City Search (`absolute top-4 left-4 z-[1000]`)
          </span>
        </div>

        <MultiHazardMap
          zones={zones}
          sensors={sensors}
          onSelectLocation={onSelectZone}
          height="540px"
        />
      </div>

      {/* Bottom Grid: Sector Priority Table & Sensor Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Table (Col 8) */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              High Risk Priority Sectors ({criticalZones.length})
            </h3>
            <button
              onClick={() => onNavigate('flood')}
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              Full Flood Intelligence &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Sector Name</th>
                  <th className="p-3">Hazard Type</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Rainfall</th>
                  <th className="p-3">Water Level</th>
                  <th className="p-3">Inundation / Slope Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {criticalZones.map((zone) => (
                  <tr
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    className="hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="p-3 font-semibold text-white">{zone.name}</td>
                    <td className="p-3">
                      <span className="capitalize text-slate-300 font-medium">{zone.type}</span>
                    </td>
                    <td className="p-3">
                      <RiskBadge level={zone.riskLevel} size="sm" />
                    </td>
                    <td className="p-3 font-bold text-cyan-400">{zone.rainfallMmHr} mm/h</td>
                    <td className="p-3 font-bold text-blue-400">{zone.waterLevelM} m</td>
                    <td className="p-3">
                      <span className="font-extrabold text-rose-400">
                        {zone.type === 'flood' ? zone.floodRiskPct : zone.landslideRiskPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NDMA Integrated Hazard Feeds (Col 4) */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400" />
              NDMA Integrated Hazard Feeds
            </h3>
            <button
              onClick={() => onNavigate('sensors')}
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {sensors.slice(0, 4).map((sensor) => (
              <div
                key={sensor.id}
                onClick={() => onNavigate('sensors')}
                className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{sensor.name}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      sensor.status === 'ONLINE'
                        ? 'text-emerald-400'
                        : sensor.status === 'WARNING'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    ● {sensor.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">{sensor.locationName}</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-cyan-400">{sensor.latestReading}</span>
                  <span className="text-slate-500">{sensor.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
