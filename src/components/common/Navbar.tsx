import React, { useState } from 'react';
import type { PageId, UserRole } from '../../types';
import {
  Bell,
  User,
  Radio,
  Menu,
  Volume2,
  VolumeX,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  activeAlertCount: number;
  isSimulatingLive: boolean;
  onToggleSimulateLive: () => void;
  onToggleSidebar?: () => void;
  userRole?: UserRole;
  userEmail?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage: _currentPage,
  onNavigate,
  activeAlertCount,
  isSimulatingLive,
  onToggleSimulateLive,
  onToggleSidebar,
  userRole = 'authority',
  userEmail,
  onLogout,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'System Admin';
      case 'authority':
        return 'Disaster Authority';
      case 'response':
        return 'Emergency Response';
      case 'field':
        return 'Field Officer';
      case 'citizen':
        return 'Citizen Safety';
      default:
        return 'Command Ops';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between">
      {/* Left: Brand Logo & Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            src="/SIHLOGO.png"
            alt="SIH Logo"
            className="h-9 w-9 rounded-lg object-cover border border-slate-700 bg-slate-900 shadow-md shadow-sky-500/10"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white font-display">
                Disaster<span className="text-blue-400">Shield</span> AI
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                SIH 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: System Status Indicator Bar */}
      <div className="hidden md:flex items-center gap-3 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 text-[11px]">AI Server: <strong className="text-emerald-400">ONLINE</strong></span>
        </div>
        <span className="text-slate-700">•</span>
        <span className="text-[11px] text-slate-400">Latency: <strong className="text-slate-200">24ms</strong></span>
        <span className="text-slate-700">•</span>
        <span className="text-[11px] text-slate-400">ML Accuracy: <strong className="text-cyan-400">96.4%</strong></span>
      </div>

      {/* Right Controls & Role Profile */}
      <div className="flex items-center gap-2">
        {/* Live IoT Stream Simulator Button */}
        <button
          onClick={onToggleSimulateLive}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
            isSimulatingLive
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle Simulated IoT Sensor Telemetry Stream"
        >
          <Radio className={`w-3.5 h-3.5 ${isSimulatingLive ? 'animate-pulse text-emerald-400' : ''}`} />
          <span className="hidden sm:inline text-[11px]">
            {isSimulatingLive ? 'Live Stream Active' : 'Simulate IoT'}
          </span>
        </button>

        {/* Audio Mute Siren */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          title={soundEnabled ? 'Siren Audio Enabled' : 'Siren Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-slate-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => onNavigate('alerts')}
          className="relative p-1.5 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          title="Emergency Alerts Center"
        >
          <Bell className="w-4 h-4" />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white">
              {activeAlertCount}
            </span>
          )}
        </button>

        {/* Role Profile & Login/Logout Action */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-[11px] font-bold text-slate-200 leading-none">{getRoleLabel()}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">{userEmail || 'eoc.admin@sih2026.gov'}</p>
          </div>

          <button
            onClick={() => {
              if (onLogout) onLogout();
              onNavigate('login');
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            title="Switch Role / Login"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
