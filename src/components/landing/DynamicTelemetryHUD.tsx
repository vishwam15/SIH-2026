import React, { useState, useEffect } from 'react';
import { Radio, Activity, Waves, Mountain, Radar, Zap, CheckCircle2 } from 'lucide-react';

interface DynamicTelemetryHUDProps {
  onExplore?: () => void;
}

export const DynamicTelemetryHUD: React.FC<DynamicTelemetryHUDProps> = () => {
  const [selectedNode, setSelectedNode] = useState<'flood' | 'landslide' | 'radar'>('flood');
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [tick, setTick] = useState(0);

  // Dynamic fluctuating metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Compute live oscillating values
  const sine1 = Math.sin(tick * 0.35);
  const sine2 = Math.cos(tick * 0.25);

  const floodWaterLevel = (2.35 + sine1 * 0.08).toFixed(2);
  const rainfallRate = Math.round(125 + sine2 * 6);
  const slopeTilt = (4.8 + sine1 * 0.3).toFixed(1);
  const soilSaturation = Math.round(78 + sine2 * 4);
  const radarEchoDbz = (48.5 + sine1 * 1.8).toFixed(1);
  const rfPingMs = Math.round(16 + Math.abs(sine1) * 6);

  const handlePing = () => {
    setIsPinging(true);
    setPingSuccess(false);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(false), 2500);
    }, 900);
  };

  // Generate dynamic waveform SVG points
  const points = Array.from({ length: 28 }, (_, i) => {
    const x = (i / 27) * 280;
    const wave = Math.sin(tick * 0.4 + i * 0.45) * 14 + Math.cos(tick * 0.2 + i * 0.3) * 6;
    const y = 30 + wave;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative w-full max-w-lg aspect-auto select-none">
      {/* Outer Rotating Radar Halo Rings */}
      <div className="absolute -inset-4 rounded-[40px] border border-cyan-500/20 animate-spin-slow pointer-events-none" />
      <div className="absolute -inset-8 rounded-[48px] border border-purple-500/15 animate-spin-reverse pointer-events-none" />

      {/* Main Tactical Glass Container */}
      <div className="relative z-20 w-full rounded-3xl bg-[#090b14]/90 border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(0,240,255,0.18)] backdrop-blur-2xl flex flex-col justify-between">
        
        {/* Futuristic Corner Brackets */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest font-mono">
              TELEMETRY MESH HUD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">FREQ: 915 MHz RF</span>
            <div className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold font-mono">
              {rfPingMs}ms
            </div>
          </div>
        </div>

        {/* Interactive Node Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 my-3.5 bg-black/60 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedNode('flood')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
              selectedNode === 'flood'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flood Node</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedNode('landslide')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
              selectedNode === 'landslide'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>Slope MEMS</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedNode('radar')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
              selectedNode === 'radar'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-purple-400" />
            <span>IMD Radar</span>
          </button>
        </div>

        {/* Dynamic Display Chamber */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/90 p-4 shadow-inner space-y-3">
          {/* Scanline Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,240,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.2) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Node Specific Live Stats */}
          {selectedNode === 'flood' && (
            <>
              <div className="flex items-center justify-between text-xs font-mono relative z-10">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" /> DRAINAGE CREST LEVEL
                </span>
                <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  CRITICAL 78%
                </span>
              </div>

              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono text-[11px]">Ultrasonic Inundation:</span>
                  <span className="text-cyan-300 font-extrabold font-mono text-sm">{floodWaterLevel} meters</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-cyan-500/20">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-rose-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(floodWaterLevel) * 35, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px] font-mono relative z-10">
                <div>
                  <span className="text-gray-400 block text-[10px]">RAIN INTENSITY</span>
                  <span className="text-cyan-300 font-extrabold">{rainfallRate} mm/h</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">DRAIN LOAD</span>
                  <span className="text-amber-400 font-extrabold">92% SURCHARGE</span>
                </div>
              </div>
            </>
          )}

          {selectedNode === 'landslide' && (
            <>
              <div className="flex items-center justify-between text-xs font-mono relative z-10">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" /> HILL SLOPE DISPLACEMENT
                </span>
                <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  ALERT LEVEL 2
                </span>
              </div>

              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono text-[11px]">MEMS Angular Shear:</span>
                  <span className="text-amber-300 font-extrabold font-mono text-sm">{slopeTilt}° Inclination</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-amber-500/20">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(slopeTilt) * 16, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px] font-mono relative z-10">
                <div>
                  <span className="text-gray-400 block text-[10px]">SOIL MOISTURE</span>
                  <span className="text-amber-300 font-extrabold">{soilSaturation}% SAT</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">SLIP ACCELERATION</span>
                  <span className="text-rose-400 font-extrabold">+0.14 g/sec²</span>
                </div>
              </div>
            </>
          )}

          {selectedNode === 'radar' && (
            <>
              <div className="flex items-center justify-between text-xs font-mono relative z-10">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Radar className="w-3.5 h-3.5 text-purple-400" /> DOPPLER WEATHER RADAR
                </span>
                <span className="text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                  DOPPLER SWEEP
                </span>
              </div>

              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono text-[11px]">Reflectivity Amplitude:</span>
                  <span className="text-purple-300 font-extrabold font-mono text-sm">{radarEchoDbz} dBZ</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-purple-500/20">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(radarEchoDbz) * 1.5, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px] font-mono relative z-10">
                <div>
                  <span className="text-gray-400 block text-[10px]">RADIAL VELOCITY</span>
                  <span className="text-purple-300 font-extrabold">24.2 m/s</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">CLOUDBURST RISK</span>
                  <span className="text-rose-400 font-extrabold">HIGH PROBABILITY</span>
                </div>
              </div>
            </>
          )}

          {/* Live Animated Oscilloscope Waveform */}
          <div className="pt-2 border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>LIVE SIGNAL TELEMETRY WAVEFORM</span>
              <span className="text-cyan-400">99.8% STABILITY</span>
            </div>
            <div className="h-12 w-full bg-black/60 rounded-lg overflow-hidden relative flex items-center border border-cyan-500/20">
              <svg className="w-full h-full" viewBox="0 0 280 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="url(#waveGrad)"
                  strokeWidth="2"
                  points={points}
                />
              </svg>

              {/* Live Spectrum Equalizer Bars in Corner */}
              <div className="absolute right-2 flex items-end gap-1 h-6">
                {[0.6, 0.9, 0.4, 1.0, 0.7, 0.3, 0.8, 0.5].map((h, idx) => {
                  const animatedH = Math.max(15, Math.sin(tick * 0.5 + idx) * 100 * h);
                  return (
                    <div
                      key={idx}
                      className="w-1 rounded-sm bg-cyan-400/80 transition-all duration-200"
                      style={{ height: `${animatedH}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Node Identifier & Coordinate Bar */}
        <div className="my-3 text-center">
          <div className="text-[11px] font-mono font-black text-white tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>NODE: NDMA-GRID-X9 [LAT 19.076° N / LON 72.877° E]</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
            Vector Mesh Synchronized • Packet Loss: 0.02%
          </div>
        </div>

        {/* Action Trigger & Telemetry Status Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Mesh Bus Active</div>
              <div className="text-[10px] text-slate-400 font-mono">Telemetry Node Online</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePing}
            disabled={isPinging}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              pingSuccess
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : isPinging
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 animate-pulse'
                : 'bg-cyan-400 hover:bg-cyan-300 text-black hover:scale-105 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            }`}
          >
            {pingSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> ACK 14ms
              </>
            ) : isPinging ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" /> Pinging...
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5" /> Ping Mesh
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
