import React, { useState } from 'react';
import type { UserRole, PageId } from '../types';
import {
  Shield,
  Building2,
  Truck,
  Wrench,
  Key,
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  users: any[];
  onLoginSuccess: (user: any) => void;
  onNavigate: (page: PageId | 'signup') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ users, onLoginSuccess, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('authority');
  const [email, setEmail] = useState('authority@disastershield.gov');
  const [password, setPassword] = useState('authority123');
  const [securityToken, setSecurityToken] = useState('SEC-CLEARANCE-99482');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const roles: {
    id: UserRole;
    title: string;
    icon: any;
    description: string;
    levelBadge: string;
    levelColor: string;
  }[] = [
    {
      id: 'admin',
      title: 'Admin',
      icon: Shield,
      description: 'Manages system users, global sensors, locations, and infrastructure settings.',
      levelBadge: 'LEVEL 4 — MAXIMUM SYSTEM ADMIN',
      levelColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    },
    {
      id: 'authority',
      title: 'Disaster Authority',
      icon: Building2,
      description: 'Monitors flood/landslide hazards and dispatches official public alerts.',
      levelBadge: 'LEVEL 3 — DISASTER AUTHORITY CLEARANCE',
      levelColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    },
    {
      id: 'response',
      title: 'Response Team',
      icon: Truck,
      description: 'Views critical hazard maps, live alerts, and safe evacuation routes.',
      levelBadge: 'LEVEL 2 — EMERGENCY RESPONSE FIELD',
      levelColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    },
    {
      id: 'field',
      title: 'Field Officer',
      icon: Wrench,
      description: 'Monitors IoT hardware node health, battery status, and telemetry calibration.',
      levelBadge: 'LEVEL 1 — IOT TELEMETRY MAINTAINER',
      levelColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
    {
      id: 'citizen',
      title: 'Citizen',
      icon: ShieldAlert,
      description: 'Receives public warnings, checks safe evacuation routes, and tracks neighborhood hazard status.',
      levelBadge: 'LEVEL 0 — COMMUNITY SAFETY ACCESS',
      levelColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
  ];

  const activeRoleConfig = roles.find((r) => r.id === selectedRole) || roles[1];
  const requiresToken = selectedRole === 'admin' || selectedRole === 'authority';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    const matchedUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password &&
        user.role === selectedRole
    );

    setTimeout(() => {
      setIsSubmitting(false);

      if (!matchedUser) {
        const fallbackUser = users.find(
          (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
        );

        if (fallbackUser) {
          setLoginError('This account belongs to a different role. Please choose the correct role.');
          return;
        }

        setLoginError('Invalid credentials. Use a valid saved user or create a new account.');
        return;
      }

      onLoginSuccess(matchedUser);
      onNavigate('dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Cyber Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      {/* Top Header Link */}
      <div className="mb-6 flex items-center justify-between max-w-lg w-full z-10">
        <button
          onClick={() => onNavigate('landing')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Experience
        </button>

        <div className="flex items-center gap-2">
          <img src="/SIHLOGO.png" alt="SIH Logo" className="w-8 h-8 rounded-lg object-cover border border-emerald-500/20 bg-slate-900" />
          <span className="text-sm font-black text-white font-display">
            Disaster<span className="text-emerald-400">Shield</span> AI
          </span>
        </div>
      </div>

      {/* STEP 2: Centered Glassmorphic Login Card */}
      <div className="glass-panel bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-lg w-full space-y-6 shadow-2xl z-10 relative">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white font-display">Role-Based System Authentication</h2>
          <p className="text-xs text-slate-400">Select active command role to generate access token</p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 hover:text-white transition"
          >
            Create Account
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clearance Level</span>
          <span
            className={`inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${activeRoleConfig.levelColor}`}
          >
            {activeRoleConfig.levelBadge}
          </span>
        </div>

        {/* Interactive 4-Role Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Select Operational Command Role:
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-xs font-extrabold font-display">{r.title}</span>
                </button>
              );
            })}
          </div>

          {/* Role Description Card */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-emerald-400 block mb-0.5">{activeRoleConfig.title} Duties:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">{activeRoleConfig.description}</p>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Officer ID */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Officer ID / Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="officer@disastershield.gov"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dynamic Security Clearance Token (Only for Admin & Disaster Authority) */}
          {requiresToken && (
            <div className="space-y-1 animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-emerald-400 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Security Clearance Token
                </label>
                <span className="text-[10px] text-slate-500">Required for {activeRoleConfig.title}</span>
              </div>
              <input
                type="text"
                required
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                placeholder="SEC-CLEARANCE-XXXXX"
              />
            </div>
          )}

          {loginError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200">
              {loginError}
            </div>
          )}

          {/* Submission & Cancel Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="w-1/3 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Authenticating System...</span>
              ) : (
                <>
                  <span>Authenticate System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
