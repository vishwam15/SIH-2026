import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Radio, Shield, Save, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [floodThreshold, setFloodThreshold] = useState(75);
  const [landslideThreshold, setLandslideThreshold] = useState(60);
  const [telemetryIntervalSec, setTelemetryIntervalSec] = useState(5);
  const [audioSiren, setAudioSiren] = useState(true);
  const [smsEvacuationAlerts, setSmsEvacuationAlerts] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              <SettingsIcon className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-display">
              Command System Settings
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure emergency hazard thresholds, IoT telemetry polling, and notification siren rules
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? 'Settings Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Threshold Configuration Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" /> Automatic Hazard Alert Threshold Rules
        </h3>

        {/* Flood Threshold Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Flood Warning Trigger Threshold</span>
            <span className="text-cyan-400 font-bold">{floodThreshold}% Water Risk</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={floodThreshold}
            onChange={(e) => setFloodThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Landslide Threshold Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Landslide Warning Trigger Threshold</span>
            <span className="text-amber-400 font-bold">{landslideThreshold}% Slope Saturation</span>
          </div>
          <input
            type="range"
            min="40"
            max="90"
            value={landslideThreshold}
            onChange={(e) => setLandslideThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* IoT Stream Configuration */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400" /> IoT Sensor Sampling Polling
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Live Stream Interval</h4>
            <p className="text-[11px] text-slate-400">Frequency of telemetry packet updates</p>
          </div>
          <select
            value={telemetryIntervalSec}
            onChange={(e) => setTelemetryIntervalSec(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
          >
            <option value={1}>Every 1 Second (High Priority)</option>
            <option value={5}>Every 5 Seconds (Standard)</option>
            <option value={15}>Every 15 Seconds (Eco Mode)</option>
          </select>
        </div>
      </div>

      {/* Notification Rules */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-400" /> Dispatch & Broadcast Channels
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Command Center Audio Siren</h4>
            <p className="text-[11px] text-slate-400">Play high-decibel siren on Critical alerts</p>
          </div>
          <button
            onClick={() => setAudioSiren(!audioSiren)}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${
              audioSiren ? 'bg-blue-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                audioSiren ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <h4 className="text-xs font-bold text-white">Citizen Evacuation Auto-SMS Broadcast</h4>
            <p className="text-[11px] text-slate-400">Send geo-targeted SMS warning to nearby mobile towers</p>
          </div>
          <button
            onClick={() => setSmsEvacuationAlerts(!smsEvacuationAlerts)}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${
              smsEvacuationAlerts ? 'bg-emerald-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                smsEvacuationAlerts ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
