import React, { useState, useEffect, useRef } from 'react';
import type { PageId } from '../../types';
import {
  CloudRain,
  Waves,
  Navigation,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';

interface DisasterProgressionTabsProps {
  onNavigate: (page: PageId) => void;
}

interface ProgressionStage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  poster: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  heading: string;
  description: string;
  impactQuote: string;
  stats: { label: string; value: string; color: string }[];
  actionLabel: string;
  targetPage: PageId;
}

export const DisasterProgressionTabs: React.FC<DisasterProgressionTabsProps> = ({ onNavigate }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stages: ProgressionStage[] = [
    {
      id: 'rain',
      step: 'STAGE 01',
      title: 'How Rain Hits',
      subtitle: 'Torrential Cloudburst & Inflow',
      videoSrc: '/rain.mp4',
      poster: '/Flood.png',
      accentColor: '#00F0FF',
      badgeBg: 'rgba(0, 240, 255, 0.1)',
      badgeBorder: 'rgba(0, 240, 255, 0.3)',
      badgeText: '#67e8f9',
      icon: CloudRain,
      heading: 'Severe Precipitation & Catchment Saturation',
      description:
        'Sudden, high-intensity monsoonal cloudbursts deposit catastrophic water volumes within minutes. Radar reflectivity spikes above 52 dBZ and precipitation rates surge past 125 mm/h, rapidly overwhelming natural soil absorption.',
      impactQuote:
        'Catchment infiltration thresholds exceeded within 15 minutes of cloudburst onset.',
      stats: [
        { label: 'Rainfall Rate', value: '142 mm/h', color: '#67e8f9' },
        { label: 'Cloudburst Lead', value: '0–30 min', color: '#38bdf8' },
        { label: 'Soil Saturation', value: '96% Infiltrated', color: '#f59e0b' },
      ],
      actionLabel: 'Analyze Rainfall Telemetry',
      targetPage: 'flood',
    },
    {
      id: 'flood',
      step: 'STAGE 02',
      title: 'Gets Flooded',
      subtitle: 'Drainage Overload & River Crest',
      videoSrc: '/flood.mp4',
      poster: '/Flood.png',
      accentColor: '#F43F5E',
      badgeBg: 'rgba(244, 63, 94, 0.1)',
      badgeBorder: 'rgba(244, 63, 94, 0.3)',
      badgeText: '#fda4af',
      icon: Waves,
      heading: 'Drainage Surcharge & Street Inundation',
      description:
        'As subterranean stormwater networks hit maximum capacity, hydraulic surcharge and backflow force floodwaters up through manholes and canals. Arterial roads, low-lying underpasses, and urban corridors become deeply submerged.',
      impactQuote:
        'Water crest heights reach 2.5+ meters, trapping civilian vehicles and cutting off neighborhoods.',
      stats: [
        { label: 'Peak Water Crest', value: '2.65 meters', color: '#f43f5e' },
        { label: 'Drainage Load', value: '100% Surcharge', color: '#fb7185' },
        { label: 'Submerged Arteries', value: '18 Corridors', color: '#f59e0b' },
      ],
      actionLabel: 'Inspect Urban Inundation',
      targetPage: 'flood',
    },
    {
      id: 'evacuation',
      step: 'STAGE 03',
      title: 'Evacuation Required',
      subtitle: 'Dynamic Life-Safety Corridors',
      videoSrc: '/evacuation.mp4',
      poster: '/evacuation.png',
      accentColor: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.1)',
      badgeBorder: 'rgba(16, 185, 129, 0.3)',
      badgeText: '#6ee7b7',
      icon: Navigation,
      heading: 'Autonomous Route Recalculation & Relief Dispatch',
      description:
        'Standard navigation routes fail because they route evacuees directly into submerged death traps. DRISHTI-AI executes real-time Dijkstra hazard-weighted re-routing to guide citizens along verified dry lifelines to designated relief shelters.',
      impactQuote:
        'Sub-second re-routing latency ensures zero civilian routing through critical flood hazard zones.',
      stats: [
        { label: 'Re-route Latency', value: '< 1.2s Dynamic', color: '#10b981' },
        { label: 'Safe Lifelines', value: '48 Clear Paths', color: '#34d399' },
        { label: 'Shelter Capacity', value: '12,500 Beds', color: '#a855f7' },
      ],
      actionLabel: 'Launch Safe Evacuation Route',
      targetPage: 'routes',
    },
  ];

  const currentStage = stages[activeStageIndex];

  // Running tab interval
  useEffect(() => {
    if (!isAutoPlaying) return;

    const DURATION = 9000; // 9 seconds per stage
    const INTERVAL = 100;
    const stepIncrement = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStageIndex((curr) => (curr + 1) % stages.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlaying, stages.length, activeStageIndex]);

  // When active stage changes, play video smoothly
  useEffect(() => {
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeStageIndex]);

  const handleSelectStage = (index: number) => {
    setActiveStageIndex(index);
    setProgress(0);
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      
      {/* Module Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-widest uppercase">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> DISASTER CASCADE SIMULATION
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          How Rain Hits. How It Floods. <span className="animate-neon-text">How Lives Are Saved.</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
          Follow the real-time disaster progression: from initial atmospheric cloudburst detection, to street-level drainage surcharge, and instant hazard-weighted evacuation dispatch.
        </p>
      </div>

      {/* 3 Running Tabs Controller */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stages.map((stage, idx) => {
          const isActive = activeStageIndex === idx;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              onClick={() => handleSelectStage(idx)}
              className={`relative rounded-2xl p-5 border transition-all cursor-pointer select-none overflow-hidden ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-400/80 shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                  : 'bg-black/50 border-white/10 hover:border-white/30 hover:bg-slate-900/40'
              }`}
            >
              {/* Running Progress Bar (Only visible on active tab) */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                  <div
                    className="h-full transition-all duration-100 ease-linear"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: stage.accentColor,
                      boxShadow: `0 0 10px ${stage.accentColor}`,
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase border"
                  style={{
                    backgroundColor: stage.badgeBg,
                    borderColor: stage.badgeBorder,
                    color: stage.badgeText,
                  }}
                >
                  {stage.step}
                </span>

                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4" style={{ color: stage.accentColor }} />
                  {isActive && (
                    <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: stage.accentColor }} />
                  )}
                </div>
              </div>

              <h4 className="font-display font-black text-lg text-white mb-1 flex items-center gap-2">
                {stage.title}
              </h4>
              <p className="text-xs text-slate-400 font-mono line-clamp-1">{stage.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Active Stage Showcase Panel */}
      <div className="rounded-[32px] bg-[#090b14]/90 border border-white/15 p-6 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Column: HTML5 Video Player */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/20 bg-black aspect-video group shadow-2xl">
            {/* Tactical Corner Brackets */}
            <div
              className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 pointer-events-none z-30"
              style={{ borderColor: currentStage.accentColor }}
            />
            <div
              className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 pointer-events-none z-30"
              style={{ borderColor: currentStage.accentColor }}
            />
            <div
              className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 pointer-events-none z-30"
              style={{ borderColor: currentStage.accentColor }}
            />
            <div
              className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 pointer-events-none z-30"
              style={{ borderColor: currentStage.accentColor }}
            />

            {/* Video Element */}
            <video
              ref={videoRef}
              key={currentStage.videoSrc}
              src={currentStage.videoSrc}
              poster={currentStage.poster}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Top Video Overlay Bar */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-2 uppercase">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: currentStage.accentColor }}
                />
                LIVE STAGE FEED: {currentStage.title}
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="p-2 rounded-lg bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying((prev) => !prev)}
                  className="p-2 rounded-lg bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition cursor-pointer"
                  title={isAutoPlaying ? 'Pause Auto-Progression' : 'Resume Auto-Progression'}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-3 left-3 z-30 pointer-events-none">
              <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 text-[10px] font-mono">
                STAGE ID: {currentStage.id.toUpperCase()}_0{activeStageIndex + 1} // AUTO-CYCLE ON
              </div>
            </div>
          </div>

          {/* Technical Info Column */}
          <div className="lg:col-span-5 space-y-5">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: currentStage.badgeBg,
                borderColor: currentStage.badgeBorder,
                color: currentStage.badgeText,
              }}
            >
              {React.createElement(currentStage.icon, { className: 'w-3.5 h-3.5' })}
              <span>{currentStage.step} // {currentStage.title}</span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              {currentStage.heading}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              {currentStage.description}
            </p>

            {/* Impact Quote Callout */}
            <div
              className="p-3.5 rounded-xl border bg-black/50 text-xs font-mono text-slate-200 border-l-4"
              style={{ borderLeftColor: currentStage.accentColor }}
            >
              "{currentStage.impactQuote}"
            </div>

            {/* Stage-Specific Key Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {currentStage.stats.map((stat, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase line-clamp-1">{stat.label}</span>
                  <strong className="text-xs sm:text-sm font-mono" style={{ color: stat.color }}>
                    {stat.value}
                  </strong>
                </div>
              ))}
            </div>

            {/* Direct Action Navigation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate(currentStage.targetPage)}
                className="w-full py-3.5 rounded-xl text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-102 cursor-pointer"
                style={{
                  backgroundColor: currentStage.accentColor,
                  boxShadow: `0 0 25px ${currentStage.accentColor}60`,
                }}
              >
                <span>{currentStage.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
