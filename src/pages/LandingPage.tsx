import React, { useState } from 'react';
import type { PageId } from '../types';
import { KineticBackgroundCanvas } from '../components/landing/KineticBackgroundCanvas';
import { DynamicTelemetryHUD } from '../components/landing/DynamicTelemetryHUD';
import { DisasterProgressionTabs } from '../components/landing/DisasterProgressionTabs';
import { TopicVideoShowcase } from '../components/landing/TopicVideoShowcase';
import { ResilienceFrameworkSection } from '../components/landing/ResilienceFrameworkSection';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Waves,
  Mountain,
  Play,
  Radio,
  Compass,
  Zap,
  ChevronDown,
  Layers,
  Monitor,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // Parallax kinetic motion on scroll
  const yHero = useTransform(scrollY, [0, 600], [0, 70]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0.2]);

  return (
    <div className="relative min-h-screen bg-[#030008] text-white overflow-hidden selection:bg-[#00F0FF] selection:text-black">
      {/* 1. GLOBAL KINETIC BACKGROUND VIDEO CANVAS */}
      <KineticBackgroundCanvas activeMode="hybrid" />

      {/* Ambient Pulsing Background Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-cyan-600/20 rounded-full blur-[170px] animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[160px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030008]/40 via-[#030008]/60 to-[#030008]/90" />
      </div>

      {/* 2. GLASSMORPHIC NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/SIHLOGO.png"
              alt="SIH Logo"
              className="w-11 h-11 rounded-2xl object-cover border border-cyan-500/40 bg-black shadow-[0_0_25px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="font-display font-black text-2xl tracking-tight text-white flex items-center">
              DISASTER<span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">SHIELD</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">AI</span>
            </span>
          </div>

          {/* Navigation Links with Hover Dropdowns */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-300">
            {/* Dropdown 1: Tactical Modules */}
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveNavDropdown('modules')}
              onMouseLeave={() => setActiveNavDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2">
                <span>Tactical Modules</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </div>

              {activeNavDropdown === 'modules' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 w-64 bg-[#0d091a] border border-cyan-500/30 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 space-y-1"
                >
                  <div onClick={() => onNavigate('flood')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cyan-500/10 transition-colors">
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Urban Flood Intel</div>
                      <div className="text-[10px] text-gray-400">Hydrodynamic drain sensors</div>
                    </div>
                  </div>
                  <div onClick={() => onNavigate('landslide')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-500/10 transition-colors">
                    <Mountain className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Landslide Warning</div>
                      <div className="text-[10px] text-gray-400">MEMS inclination telemetry</div>
                    </div>
                  </div>
                  <div onClick={() => onNavigate('routes')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-500/10 transition-colors">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Evacuation Routes</div>
                      <div className="text-[10px] text-gray-400">GIS safe route routing</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Dropdown 2: Telemetry Core */}
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveNavDropdown('core')}
              onMouseLeave={() => setActiveNavDropdown(null)}
            >
              <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2">
                <span>Telemetry Core</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </div>

              {activeNavDropdown === 'core' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 w-64 bg-[#0d091a] border border-purple-500/30 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 space-y-1"
                >
                  <div onClick={() => onNavigate('sensors')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-500/10 transition-colors">
                    <Radio className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-bold text-white">IoT Node Hardware</div>
                      <div className="text-[10px] text-gray-400">26 Sensor nodes active</div>
                    </div>
                  </div>
                  <div onClick={() => onNavigate('ai-prediction')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cyan-500/10 transition-colors">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold text-white">AI Predictive Engine</div>
                      <div className="text-[10px] text-gray-400">99.8% Forecast accuracy</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('framework');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold bg-transparent border-none cursor-pointer"
            >
              <Layers className="w-4 h-4" /> Resilience Framework
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              LAUNCH PLATFORM
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative min-h-screen pt-32 pb-24 flex items-center justify-center z-10">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center mt-4">
          
          {/* Left Hero Column */}
          <motion.div
            style={{ y: yHero, opacity: opacityHero }}
            className="lg:col-span-7 text-left space-y-7"
          >
            {/* Pinging Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Zap className="w-4 h-4 animate-pulse text-cyan-300" />
              <span>AUTONOMOUS MULTI-HAZARD EARLY WARNING</span>
            </div>

            {/* Main Display Headline */}
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tighter">
              <span className="text-white block drop-shadow-md">DEPLOYING PROTECTION</span>
              <span className="animate-neon-text block mt-2">WHERE DISASTER STRIKES.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl font-medium leading-relaxed drop-shadow">
              DisasterShield AI predicts urban floods and mountain landslides before impact using NDMA Integrated Hazard Feeds, hydrodynamic stormwater telemetry, and MEMS ground inclination models.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(0,240,255,0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('login')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-extrabold text-base flex items-center gap-3 transition-all shadow-[0_0_35px_rgba(0,240,255,0.4)] group cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current text-black" />
                <span>Launch Operations Platform</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('dashboard')}
                className="px-7 py-4 rounded-xl bg-black/50 hover:bg-black/80 text-white border border-white/20 font-bold text-base backdrop-blur-md transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Live Dashboard Preview</span>
              </motion.button>
            </div>

            {/* 3 Tactical Stat Counters */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/15 max-w-lg">
              <div>
                <div className="text-3xl font-black font-display text-white drop-shadow">&lt; 30s</div>
                <div className="text-xs text-cyan-400 mt-1 uppercase font-black tracking-wider">Deploy Time</div>
              </div>
              <div>
                <div className="text-3xl font-black font-display text-amber-400 drop-shadow">99.8%</div>
                <div className="text-xs text-amber-400 mt-1 uppercase font-black tracking-wider">AI Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-black font-display text-emerald-400 drop-shadow">10,000+</div>
                <div className="text-xs text-emerald-400 mt-1 uppercase font-black tracking-wider">Lives Shielded</div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Column: Interactive Swarm HUD Box */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <DynamicTelemetryHUD />
          </div>

        </div>
      </section>

      {/* 4. INFINITE MARQUEE RIBBON */}
      <div className="relative w-full py-5 bg-gradient-to-r from-cyan-600 via-purple-600 to-rose-600 border-y border-white/20 z-20 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.4)]">
        <div className="flex whitespace-nowrap animate-marquee font-display font-black text-xl tracking-widest text-white uppercase">
          <span className="mx-6 flex items-center gap-4">NDMA INTEGRATED HAZARD FEEDS <Activity className="w-5 h-5 text-cyan-300" /></span>
          <span className="mx-6 flex items-center gap-4">URBAN FLOOD PREDICTION <Waves className="w-5 h-5 text-blue-300" /></span>
          <span className="mx-6 flex items-center gap-4">MOUNTAIN LANDSLIDE ALERTS <Mountain className="w-5 h-5 text-amber-300" /></span>
          <span className="mx-6 flex items-center gap-4">NDMA REAL-TIME TELEMETRY NODE <Radio className="w-5 h-5 text-rose-300" /></span>
          <span className="mx-6 flex items-center gap-4">NDMA INTEGRATED HAZARD FEEDS <Activity className="w-5 h-5 text-cyan-300" /></span>
          <span className="mx-6 flex items-center gap-4">URBAN FLOOD PREDICTION <Waves className="w-5 h-5 text-blue-300" /></span>
          <span className="mx-6 flex items-center gap-4">MOUNTAIN LANDSLIDE ALERTS <Mountain className="w-5 h-5 text-amber-300" /></span>
          <span className="mx-6 flex items-center gap-4">NDMA REAL-TIME TELEMETRY NODE <Radio className="w-5 h-5 text-rose-300" /></span>
        </div>
      </div>

      {/* 4.5 DISASTER PROGRESSION RUNNING TABS (rain.mp4 -> flood.mp4 -> evacuation.mp4) */}
      <DisasterProgressionTabs onNavigate={onNavigate} />

      {/* 5. TOPIC VIDEO SHOWCASE */}
      <TopicVideoShowcase onNavigate={onNavigate} />

      {/* 6. PLATFORM ARCHITECTURE MATRIX */}
      <section id="specs" className="py-28 bg-black/70 backdrop-blur-xl border-t border-white/10 relative mt-20 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white drop-shadow-md">One Platform. Infinite Protection.</h2>
            <p className="text-gray-300 text-lg font-medium">DisasterShield AI combines IoT hardware node monitoring with SaaS command software for emergency response teams.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl space-y-5 hover:border-cyan-400 hover:translate-y-[-6px] transition-all group shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_#00F0FF]">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Modular Sensor Telemetry</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Hardware node telemetry equipped with TDR soil moisture sensors, MEMS ground inclinometers, and rain gauges.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-5 hover:border-purple-400 hover:translate-y-[-6px] transition-all group shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shadow-[0_0_15px_#8B5CF6]">
                <Radio className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">NDMA Radio Telemetry Network</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Ultra-low latency RF mesh connecting NDMA Real-Time Telemetry Nodes to regional disaster authority command centers.
              </p>
            </div>

            <div className="glass-card-pink p-8 rounded-3xl space-y-5 hover:border-rose-400 hover:translate-y-[-6px] transition-all group shadow-[0_0_20px_rgba(255,0,127,0.1)]">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-400/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_#FF007F]">
                <Monitor className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Command OS (SaaS)</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Proprietary emergency command dashboard for live 3D GIS mapping, public broadcast alerts, and evacuation logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RESILIENCE FRAMEWORK & INTERACTIVE ANIMATORIES */}
      <ResilienceFrameworkSection onNavigate={onNavigate} />

      {/* 8. FOOTER */}
      <footer className="py-16 border-t border-white/10 bg-black/95 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3 font-display font-black text-white text-xl tracking-tight">
              <Shield className="w-6 h-6 text-cyan-400" />
              DISASTER<span className="text-cyan-400">SHIELD</span> AI INC.
            </div>
            <p className="text-xs text-cyan-300/90 font-mono tracking-wide">
              DRISHTI-AI • Autonomous Multi-Hazard Early Warning, Dynamic Evacuation & Urban Resilience System for SIH 2026
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-xs text-gray-400">
            <div>Designed & Built for Smart India Hackathon (SIH 2026)</div>
            <div className="text-slate-500">Autonomous Multi-Hazard Early Warning System</div>
          </div>

        </div>
      </footer>

    </div>
  );
};
