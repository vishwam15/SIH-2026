import React, { useState } from 'react';
import type { PageId } from '../types';
import { KineticBackgroundCanvas } from '../components/landing/KineticBackgroundCanvas';
import {
  AnimatedFloodCanvas,
  AnimatedLandslideCanvas,
  AnimatedEvacuationCanvas,
} from '../components/landing/AnimatedModuleCanvases';
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
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 p-[2px] shadow-[0_0_25px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
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
                const el = document.getElementById('acquisition');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold bg-transparent border-none cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Acquisition Portal
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
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              {/* Spinning Rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-rose-500/30 animate-spin-reverse pointer-events-none" />

              {/* Glass Card Container */}
              <div className="relative z-20 w-full h-[460px] rounded-3xl glass-card p-6 flex flex-col justify-between animate-float-slow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" /> TELEMETRY MESH HUD
                  </span>
                  <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                    FREQ: 915 MHz RF
                  </div>
                </div>

                {/* Telemetry Display Box */}
                <div className="relative w-full h-52 mt-4 mb-3 rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.2)] bg-black/90 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">URBAN FLOOD RISK</span>
                    <span className="text-cyan-400 font-bold">78% CRITICAL</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Water Crest Level:</span>
                      <span className="text-blue-400 font-bold font-mono">2.35 meters</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full w-[78%] animate-pulse" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono">
                    <div>
                      <span className="text-gray-400 block">RAIN FALL</span>
                      <span className="text-cyan-300 font-bold">125 mm/h</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">LANDSLIDE RISK</span>
                      <span className="text-amber-400 font-bold">85% ALERT</span>
                    </div>
                  </div>

                  {/* Icon Overlay Badge */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/15 shadow-lg">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <Radio className="w-4 h-4 text-rose-400" />
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-display font-black text-sm text-white tracking-widest uppercase">NDMA REAL-TIME TELEMETRY NODE: NDMA-GRID-X9</h4>
                  <p className="text-xs text-cyan-400 font-bold mt-1">Vector Mesh Locked • Stability: 99.8%</p>
                </div>

                <div className="p-3.5 mt-2 rounded-2xl bg-black/80 border border-cyan-500/30 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                      <Activity className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Hydrodynamic Telemetry</div>
                      <div className="text-[10px] text-gray-400">Active Live Telemetry Sync</div>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-cyan-400 text-black">ONLINE</span>
                </div>
              </div>
            </div>
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

      {/* 5. FEATURE SHOWCASE (3 MODULES WITH ANIMATED VIDEO CANVASES - Flood.png, Landslide.png, evacuation.png) */}
      <section id="showcase" className="py-28 max-w-7xl mx-auto px-6 space-y-36 relative bg-black/50 backdrop-blur-md rounded-[40px] mt-20 border border-white/10 shadow-2xl z-10">

        {/* Module 01: Urban Flood Recon (Animated Flood.png Video Canvas) */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 group cursor-pointer" onClick={() => onNavigate('flood')}>
            <div className="relative rounded-3xl overflow-hidden glass-card p-2 group-hover:border-cyan-400 transition-all duration-500 shadow-[0_0_25px_#00f2fe] group-hover:shadow-[0_0_40px_#00f2fe] transform group-hover:scale-[1.03]">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-cyan-500/40">
                <AnimatedFloodCanvas className="w-full h-full transition-all duration-500 group-hover:blur-[1px]" />
                
                {/* Default Telemetry Badge */}
                <div className="absolute bottom-4 left-4 px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-400 text-xs font-extrabold text-cyan-400 flex items-center gap-2 shadow-[0_0_15px_#00F0FF]">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" /> Urban Inundation Telemetry
                </div>

                {/* Hover Reveal Overlay Tooltip */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-black/90 backdrop-blur-md border border-cyan-400 text-xs font-black text-cyan-300 shadow-[0_0_25px_#00f2fe] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 z-20">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Urban Flood Recon Engine: Active</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              Module 01 // Municipal Safety
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none drop-shadow-md">
              URBAN FLOOD <br />RECON ENGINE.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed font-medium">
              Hydrodynamic stormwater drain monitoring, ultrasonic river crest measurement, and flood inundation risk prediction over time.
            </p>
            <button
              onClick={() => onNavigate('flood')}
              className="px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore Flood Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Module 02: Mountain Landslide (Animated Landslide.png Video Canvas) */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              Module 02 // Terrain Telemetry
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none drop-shadow-md">
              LANDSLIDE SLOPE <br />INSTABILITY GUARD.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed font-medium">
              TDR soil moisture saturation, MEMS dual-axis ground inclinometers, and micro-seismic slope collapse early warning.
            </p>
            <button
              onClick={() => onNavigate('landslide')}
              className="px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore Landslide Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 group cursor-pointer" onClick={() => onNavigate('landslide')}>
            <div className="relative rounded-3xl overflow-hidden glass-card-pink p-2 group-hover:border-amber-400 transition-all duration-500 shadow-[0_0_25px_#f59e0b] group-hover:shadow-[0_0_40px_#f59e0b] transform group-hover:scale-[1.03]">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-amber-500/40">
                <AnimatedLandslideCanvas className="w-full h-full transition-all duration-500 group-hover:blur-[1px]" />
                
                {/* Default Telemetry Badge */}
                <div className="absolute bottom-4 left-4 px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-amber-400 text-xs font-extrabold text-amber-400 flex items-center gap-2 shadow-[0_0_15px_#F59E0B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" /> Slope Movement Active
                </div>

                {/* Hover Reveal Overlay Tooltip */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-black/90 backdrop-blur-md border border-amber-400 text-xs font-black text-amber-300 shadow-[0_0_25px_#f59e0b] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 z-20">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Landslide Instability Guard: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module 03: Safe Route Evacuation (Animated evacuation.png Video Canvas) */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 group cursor-pointer" onClick={() => onNavigate('routes')}>
            <div className="relative rounded-3xl overflow-hidden glass-card p-2 group-hover:border-emerald-400 transition-all duration-500 shadow-[0_0_25px_#10b981] group-hover:shadow-[0_0_40px_#10b981] transform group-hover:scale-[1.03]">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-emerald-500/40">
                <AnimatedEvacuationCanvas className="w-full h-full transition-all duration-500 group-hover:blur-[1px]" />
                
                {/* Default Telemetry Badge */}
                <div className="absolute bottom-4 left-4 px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-400 text-xs font-extrabold text-emerald-400 flex items-center gap-2 shadow-[0_0_15px_#10B981]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" /> GIS Evacuation Routing
                </div>

                {/* Hover Reveal Overlay Tooltip */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-black/90 backdrop-blur-md border border-emerald-400 text-xs font-black text-emerald-300 shadow-[0_0_25px_#10b981] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Safe Evacuation Route Dispatch: Active</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              Module 03 // Citizen Relief
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none drop-shadow-md">
              SAFE EVACUATION <br />ROUTE DISPATCH.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed font-medium">
              Real-time open street maps marking dangerous waterlogged roads in red and safe shelter evacuation routes in green.
            </p>
            <button
              onClick={() => onNavigate('routes')}
              className="px-6 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <span>Find Evacuation Routes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </section>

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

      {/* 7. ACQUISITION & PRICING MATRIX */}
      <section id="acquisition" className="py-32 relative overflow-hidden bg-[#030008]/90 backdrop-blur-3xl border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-4xl sm:text-6xl text-white mb-6 tracking-tight drop-shadow-lg">
              ACQUIRE THE <span className="animate-neon-text">FUTURE.</span>
            </h2>
            <p className="text-gray-300 text-lg font-medium">
              DisasterShield AI is available for municipal deployment, state emergency fleet integration, or full corporate IP buyout.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Tier 1: Fleet Lease */}
            <div className="glass-card p-10 rounded-[30px] flex flex-col h-full hover:-translate-y-2 transition-transform shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/40 text-xs font-black uppercase tracking-widest w-fit mb-6">
                Municipal Fleet Leasing
              </div>
              <h3 className="text-3xl font-display font-black text-white mb-2">Fleet Lease</h3>
              <div className="text-4xl font-black text-cyan-400 mb-6">$250,000 <span className="text-base text-gray-400 font-medium">/ per region</span></div>
              <p className="text-gray-400 text-sm mb-8 flex-grow">
                Ideal for municipal flood defense during monsoon seasons. Full turnkey telemetry deployment managed by our field operations team.
              </p>
              <button onClick={() => onNavigate('login')} className="w-full py-4 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-cyan-500/50 text-white font-bold text-center transition-all cursor-pointer">
                Initiate Lease
              </button>
            </div>

            {/* Tier 2: State Setup */}
            <div className="glass-card-pink p-10 rounded-[30px] flex flex-col h-full transform lg:scale-105 border-rose-500 relative shadow-[0_0_50px_rgba(255,0,127,0.2)]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-lg">
                Recommended Choice
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/40 text-xs font-black uppercase tracking-widest w-fit mb-6 mt-2">
                State Disaster Authority
              </div>
              <h3 className="text-3xl font-display font-black text-white mb-2">State Authority Setup</h3>
              <div className="text-4xl font-black text-rose-400 mb-6">$3,500,000 <span className="text-base text-gray-400 font-medium">/ setup</span></div>
              <p className="text-gray-400 text-sm mb-8 flex-grow">
                Includes 26 NDMA Real-Time Telemetry Nodes, airborne hazard surveillance platforms, and a 1-year Command OS SaaS License.
              </p>
              <button onClick={() => onNavigate('login')} className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-black text-center transition-all shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:scale-105 cursor-pointer">
                Procure Authority Setup
              </button>
            </div>

            {/* Tier 3: IP Buyout */}
            <div className="glass-card p-10 rounded-[30px] flex flex-col h-full hover:-translate-y-2 transition-transform shadow-[0_0_30px_rgba(139,92,246,0.1)]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-black uppercase tracking-widest w-fit mb-6">
                Corporate M&A
              </div>
              <h3 className="text-3xl font-display font-black text-white mb-2">Buy Startup IP</h3>
              <div className="text-4xl font-black text-purple-400 mb-6">$15,000,000 <span className="text-base text-gray-400 font-medium">/ buyout</span></div>
              <p className="text-gray-400 text-sm mb-8 flex-grow">
                Full corporate buyout. Gain 100% ownership of DisasterShield AI pending patents, telemetry OS codebase, and hardware schematics.
              </p>
              <button onClick={() => onNavigate('login')} className="w-full py-4 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-purple-400/50 text-white font-bold text-center transition-all cursor-pointer">
                Discuss Acquisition
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-16 border-t border-white/10 bg-black/95 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3 font-display font-black text-white text-xl tracking-tight">
              <Shield className="w-6 h-6 text-cyan-400" />
              DISASTER<span className="text-cyan-400">SHIELD</span> AI INC.
            </div>
            <div className="text-xs text-cyan-400 font-black uppercase tracking-wider">
              All Patents Pending © 2026 • SIH Hackathon Edition
            </div>
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
