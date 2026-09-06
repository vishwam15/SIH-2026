import React, { useState } from 'react';
import type { PageId, UserRole } from '../types';
import { ArrowLeft, ArrowRight, UserPlus } from 'lucide-react';

interface SignupPageProps {
  users: any[];
  onSignupSuccess: (user: any) => void;
  onNavigate: (page: PageId) => void;
}

const roleOptions: { id: UserRole; label: string; badge: string }[] = [
  { id: 'admin', label: 'Admin', badge: 'System Control' },
  { id: 'authority', label: 'Disaster Authority', badge: 'Command' },
  { id: 'response', label: 'Response Team', badge: 'Operations' },
  { id: 'field', label: 'Field Officer', badge: 'Field Ops' },
  { id: 'citizen', label: 'Citizen', badge: 'Community' },
];

export const SignupPage: React.FC<SignupPageProps> = ({ users, onSignupSuccess, onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [department, setDepartment] = useState('Community Safety');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setError('Please fill all required fields.');
      return;
    }

    const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      email: email.toLowerCase(),
      password,
      role,
      department: department || 'General Operations',
      phone,
    };

    onSignupSuccess(newUser);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      <div className="mb-6 flex items-center justify-between max-w-xl w-full z-10">
        <button
          onClick={() => onNavigate('login')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="flex items-center gap-2">
          <img src="/SIHLOGO.png" alt="SIH Logo" className="w-8 h-8 rounded-lg object-cover border border-emerald-500/20 bg-slate-900" />
          <span className="text-sm font-black text-white font-display">
            Disaster<span className="text-emerald-400">Shield</span> AI
          </span>
        </div>
      </div>

      <div className="glass-panel bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-xl w-full space-y-6 shadow-2xl z-10 relative">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
            <UserPlus className="w-3.5 h-3.5" /> New Account Registration
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display mt-3">Create your operational profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="Full name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="Minimum 6 chars"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Phone (Optional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Select Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    role === option.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-black">{option.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{option.badge}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Department / Unit</label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Department"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-1/3 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
