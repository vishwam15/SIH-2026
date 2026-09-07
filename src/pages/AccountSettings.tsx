import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, KeyRound, Languages, LockKeyhole, Save, ShieldCheck, Trash2 } from 'lucide-react';

type AccountSettingsProps = {
  user: any;
  sessionHistory?: { timestamp: string; role: string }[];
  onSave: (settings: any) => void;
  onDeactivate: () => void;
};

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user, sessionHistory = [], onSave, onDeactivate }) => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setForm({
      notifications: { sms: user?.settings?.notifications?.sms ?? true, email: user?.settings?.notifications?.email ?? true, push: user?.settings?.notifications?.push ?? true },
      language: user?.settings?.language || 'English',
      twoFactorEnabled: Boolean(user?.settings?.twoFactorEnabled),
    });
  }, [user]);

  const updateNotification = (key: string, value: boolean) => setForm((current: any) => ({ ...current, notifications: { ...current.notifications, [key]: value } }));
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ settings: form, ...(newPassword ? { password: newPassword } : {}) });
    setNewPassword('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400';

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-6 p-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><div className="flex items-center gap-2"><LockKeyhole className="h-6 w-6 text-cyan-400" /><h1 className="font-display text-2xl font-extrabold text-white">Account Settings</h1></div><p className="mt-1 text-xs text-slate-400">Control sign-in security, notifications, language, and account activity.</p></div>
        <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-extrabold text-slate-950" type="submit">{saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}{saved ? 'Saved' : 'Save Settings'}</button>
      </div>

      <section className="glass-panel space-y-5 rounded-2xl border border-white/10 p-6">
        <h2 className="flex items-center gap-2 font-bold text-white"><KeyRound className="h-4 w-4 text-amber-400" />Password & authentication</h2>
        <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">New password</span><input className={inputClass} type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" /></label>
        <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white"><span><span className="block font-bold">Two-factor authentication</span><span className="text-xs text-slate-400">Enable TOTP-ready protection for this account.</span></span><input className="h-5 w-5 accent-cyan-500" type="checkbox" checked={Boolean(form.twoFactorEnabled)} onChange={(e) => setForm({ ...form, twoFactorEnabled: e.target.checked })} /></label>
      </section>

      <section className="glass-panel space-y-4 rounded-2xl border border-white/10 p-6">
        <h2 className="flex items-center gap-2 font-bold text-white"><Bell className="h-4 w-4 text-rose-400" />Notification preferences</h2>
        {([['sms', 'SMS alerts'], ['email', 'Email alerts'], ['push', 'Push notifications']] as const).map(([key, label]) => <label key={key} className="flex items-center justify-between border-b border-white/5 py-3 text-sm text-white last:border-0"><span>{label}</span><input className="h-5 w-5 accent-cyan-500" type="checkbox" checked={Boolean(form.notifications?.[key])} onChange={(e) => updateNotification(key, e.target.checked)} /></label>)}
      </section>

      <section className="glass-panel space-y-4 rounded-2xl border border-white/10 p-6">
        <h2 className="flex items-center gap-2 font-bold text-white"><Languages className="h-4 w-4 text-emerald-400" />Language preference</h2>
        <select className={inputClass} value={form.language || 'English'} onChange={(e) => setForm({ ...form, language: e.target.value })}><option>English</option><option>Hindi</option><option>Marathi</option></select>
      </section>

      <section className="glass-panel rounded-2xl border border-white/10 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-white"><ShieldCheck className="h-4 w-4 text-cyan-400" />Session history</h2>
        <div className="space-y-2">{sessionHistory.length ? sessionHistory.map((session, index) => <div key={`${session.timestamp}-${index}`} className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-300"><span className="font-bold text-emerald-300">{index === 0 ? 'Current browser session' : 'Previous session'}</span><span className="ml-2 text-slate-500">{new Date(session.timestamp).toLocaleString()} · {session.role}</span></div>) : <div className="text-xs text-slate-500">No recorded sessions yet.</div>}</div>
      </section>

      <section className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-rose-200"><Trash2 className="h-4 w-4" />Deactivate account</h2>
        <p className="mb-4 text-xs text-slate-400">Sign out and remove this demo account from the active local session.</p>
        <button type="button" onClick={onDeactivate} className="rounded-xl border border-rose-500/40 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/10">Deactivate account</button>
      </section>
    </form>
  );
};
