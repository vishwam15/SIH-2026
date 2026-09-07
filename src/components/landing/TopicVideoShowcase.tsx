import React, { useState } from 'react';
import type { PageId } from '../../types';
import {
  Waves,
  Mountain,
  Navigation,
  ArrowRight,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface TopicVideoShowcaseProps {
  onNavigate: (page: PageId) => void;
}

export const TopicVideoShowcase: React.FC<TopicVideoShowcaseProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'flood' | 'landslide' | 'routes'>('all');

  return (
    <section id="showcase" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-black uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> TACTICAL DISASTER DOMAINS
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Targeted Telemetry. <span className="animate-neon-text">Instant Response.</span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
          Autonomous multi-hazard defense combining hydrodynamic flood sensors, geotechnical slope inclinometers, and hazard-weighted dynamic evacuation algorithms.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {[
          { id: 'all', label: 'All Operations' },
          { id: 'flood', label: 'Urban Flood Nowcasting', icon: Waves },
          { id: 'landslide', label: 'Landslide Instability', icon: Mountain },
          { id: 'routes', label: 'Safe Evacuation Corridors', icon: Navigation },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-black/50 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Showcase Cards List - Side-by-Side Permanent Layout, No Hidden Sliding */}
      <div className="space-y-16">
        
        {/* ========================================================================= */}
        {/* TOPIC 1: URBAN FLOOD INUNDATION NOWCASTING (rain.mp4 / flood.mp4)         */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'flood') && (
          <div className="rounded-[32px] bg-[#090b14]/85 border border-cyan-500/30 p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(0,240,255,0.08)] backdrop-blur-xl hover:border-cyan-400/60 transition-all duration-300">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Visual Column (Video Player) */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-black aspect-video group">
                {/* Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

                {/* Video Component */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/Flood.png"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src="/rain.mp4" type="video/mp4" />
                  <source src="/flood.mp4" type="video/mp4" />
                  {/* Fallback image */}
                  <img src="/Flood.png" alt="Urban Flood Telemetry" className="w-full h-full object-cover" />
                </video>

                {/* Video Badges Overlay */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-extrabold flex items-center gap-1.5 uppercase">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Urban Inundation Stream
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 z-20">
                  <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 text-[10px] font-mono">
                    HUD RECON: ACTIVE
                  </div>
                </div>
              </div>

              {/* Technical Information Column */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Waves className="w-3.5 h-3.5" /> HYDROLOGICAL INTELLIGENCE // NOWCASTING
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Urban Flood Reconnaissance & Drainage Surcharge Graph
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Real-time coupling of high-resolution radar precipitation rates with digital elevation model (DEM) depression storage. The system continuously models stormwater drain surcharge nodes to project street inundation depths across 0–180 minute forward windows.
                </p>

                {/* Live Tactical Spec Chips */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Peak Water Crest</span>
                    <strong className="text-sm font-mono text-cyan-300">2.35 meters</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Drainage Load</span>
                    <strong className="text-sm font-mono text-rose-400">92% Surcharge</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Lead Time Window</span>
                    <strong className="text-sm font-mono text-amber-300">0–3 Hours</strong>
                  </div>
                </div>

                {/* Key Bullet Points */}
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Ultrasonic river crest depth telemetry synchronized over LoRa mesh</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Automated cloudburst threshold triggers (&gt;100 mm/h) with micro-basin alerts</span>
                  </li>
                </ul>

                {/* Action Trigger */}
                <button
                  type="button"
                  onClick={() => onNavigate('flood')}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 cursor-pointer"
                >
                  <span>Explore Flood Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOPIC 2: MOUNTAIN LANDSLIDE SLOPE GUARD (flood.mp4 / landslide.mp4)       */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'landslide') && (
          <div className="rounded-[32px] bg-[#090b14]/85 border border-amber-500/30 p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(245,158,11,0.08)] backdrop-blur-xl hover:border-amber-400/60 transition-all duration-300">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Technical Information Column (Left in alternating layout) */}
              <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Mountain className="w-3.5 h-3.5" /> GEOTECHNICAL RESILIENCE // SLOPE GUARD
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Mountain Landslide & Geological Slope Instability Guard
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Early detection of catastrophic slope failures using Time-Domain Reflectometry (TDR) volumetric soil saturation and MEMS dual-axis ground inclinometers. Machine learning algorithms analyze pore-water pressure and micro-seismic tremors to forecast shear collapse hours in advance.
                </p>

                {/* Live Tactical Spec Chips */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Soil Saturation</span>
                    <strong className="text-sm font-mono text-amber-300">84% Volumetric</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Angular Tilt</span>
                    <strong className="text-sm font-mono text-rose-400">4.8° Shear Axis</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Micro-Seismic</span>
                    <strong className="text-sm font-mono text-emerald-300">12.4 Hz Baseline</strong>
                  </div>
                </div>

                {/* Key Bullet Points */}
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Automated hill highway traffic barricade triggers during critical saturation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>XGBoost susceptibility classification trained on historical landslide datasets</span>
                  </li>
                </ul>

                {/* Action Trigger */}
                <button
                  type="button"
                  onClick={() => onNavigate('landslide')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 cursor-pointer"
                >
                  <span>Explore Landslide Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Column (Video Player) */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-amber-500/40 bg-black aspect-video group order-1 lg:order-2">
                {/* Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400 z-20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400 z-20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 z-20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 z-20 pointer-events-none" />

                {/* Video Component */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/Landslide.png"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src="/flood.mp4" type="video/mp4" />
                  <source src="/rain.mp4" type="video/mp4" />
                  {/* Fallback image */}
                  <img src="/Landslide.png" alt="Landslide Slope Guard" className="w-full h-full object-cover" />
                </video>

                {/* Video Badges Overlay */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-mono font-extrabold flex items-center gap-1.5 uppercase">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Slope Telemetry Feed
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 z-20">
                  <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 text-[10px] font-mono">
                    ALERT LEVEL 2: ACTIVE
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOPIC 3: DYNAMIC SAFE EVACUATION CORRIDORS (evacuation.mp4)               */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'routes') && (
          <div className="rounded-[32px] bg-[#090b14]/85 border border-emerald-500/30 p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-xl hover:border-emerald-400/60 transition-all duration-300">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Visual Column (Video Player) */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-black aspect-video group">
                {/* Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400 z-20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400 z-20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400 z-20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400 z-20 pointer-events-none" />

                {/* Video Component */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/evacuation.png"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src="/evacuation.mp4" type="video/mp4" />
                  <source src="/evacution.mp4" type="video/mp4" />
                  {/* Fallback image */}
                  <img src="/evacuation.png" alt="Safe Route Evacuation" className="w-full h-full object-cover" />
                </video>

                {/* Video Badges Overlay */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-extrabold flex items-center gap-1.5 uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Corridor Dispatch Live
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 z-20">
                  <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 text-[10px] font-mono">
                    DIJKSTRA ENGINE: OPTIMAL
                  </div>
                </div>
              </div>

              {/* Technical Information Column */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Navigation className="w-3.5 h-3.5" /> LIFE-SAFETY LOGISTICS // ROUTE CORRIDORS
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Dynamic Hazard-Weighted Evacuation Routing & Dispatch
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Unlike traditional navigation apps that direct evacuees into submerged streets, DRISHTI-AI runs dynamic Dijkstra algorithms that actively recalculate edge weights based on real-time water levels and road hazards. Citizens are directed along guaranteed safe corridors to community shelters.
                </p>

                {/* Live Tactical Spec Chips */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Re-route Latency</span>
                    <strong className="text-sm font-mono text-emerald-300">&lt; 1.2 Seconds</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Active Lifelines</span>
                    <strong className="text-sm font-mono text-cyan-300">48 Safe Routes</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Shelter Capacity</span>
                    <strong className="text-sm font-mono text-purple-300">12,500 Beds</strong>
                  </div>
                </div>

                {/* Key Bullet Points */}
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Continuous path penalty updates avoid waterlogged underpasses and road blockades</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct WebSocket dispatch to NDRF response units for vulnerable citizen evacuation</span>
                  </li>
                </ul>

                {/* Action Trigger */}
                <button
                  type="button"
                  onClick={() => onNavigate('routes')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 cursor-pointer"
                >
                  <span>Find Evacuation Routes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
