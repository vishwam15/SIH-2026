import React, { useEffect, useState } from 'react';
import { Camera, CheckCircle2, Save, Upload, UserRound, X } from 'lucide-react';
import type { UserRole } from '../types';

type ProfileProps = {
  user: any;
  onSave: (profile: any) => void;
};

const roleIsStaff = (role: UserRole) => role !== 'citizen';

export const Profile: React.FC<ProfileProps> = ({ user, onSave }) => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const names = (user?.fullName || '').trim().split(/\s+/);
    setForm({
      firstName: user?.firstName || names[0] || '',
      lastName: user?.lastName || names.slice(1).join(' '),
      email: user?.email || '',
      phone: user?.phone || '',
      photoUrl: user?.photoUrl || '',
      governmentId: user?.governmentId || '',
      department: user?.department || '',
      designation: user?.designation || '',
      dateOfBirth: user?.dateOfBirth || '',
      homeAddress: user?.homeAddress || '',
      emergencyContactName: user?.emergencyContactName || '',
      emergencyContactPhone: user?.emergencyContactPhone || '',
      bloodGroup: user?.bloodGroup || '',
      householdSize: user?.householdSize || 1,
      mobilityNeeds: user?.mobilityNeeds || false,
      assignedZone: user?.assignedZone || '',
      shiftTiming: user?.shiftTiming || '',
      vehicleUnitId: user?.vehicleUnitId || '',
    });
  }, [user]);

  const update = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }));
  const staff = roleIsStaff(user?.role as UserRole);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => update('photoUrl', reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ ...form, fullName: `${form.firstName} ${form.lastName}`.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400';
  const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400';

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6 p-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><UserRound className="h-6 w-6 text-cyan-400" /><h1 className="font-display text-2xl font-extrabold text-white">My Profile</h1></div>
          <p className="mt-1 text-xs text-slate-400">Keep identity, contact, and emergency details ready for safe dispatch.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-extrabold text-slate-950" type="submit">
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}{saved ? 'Saved' : 'Save Profile'}
        </button>
      </div>

      <section className="glass-panel rounded-2xl border border-white/10 p-6">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-950 text-cyan-300">
            {form.photoUrl ? <img src={form.photoUrl} alt="Profile" className="h-full w-full object-cover" /> : <Camera className="h-7 w-7" />}
          </div>
          <div><h2 className="font-bold text-white">Identity & contact</h2><p className="text-xs text-slate-400">Upload a JPG, PNG, or WEBP image up to 2 MB.</p></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className={labelClass}>First name</span><input className={inputClass} value={form.firstName || ''} onChange={(e) => update('firstName', e.target.value)} required /></label>
          <label><span className={labelClass}>Last name</span><input className={inputClass} value={form.lastName || ''} onChange={(e) => update('lastName', e.target.value)} /></label>
          <label><span className={labelClass}>Email</span><input className={inputClass} type="email" value={form.email || ''} readOnly /></label>
          <label><span className={labelClass}>Phone number</span><input className={inputClass} type="tel" value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" required /></label>
          <div className="md:col-span-2">
            <span className={labelClass}>Profile photo</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3 py-2.5 text-xs font-bold text-cyan-200 hover:bg-cyan-400/20">
                <Upload className="h-4 w-4" /> Upload image
                <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoUpload} />
              </label>
              {form.photoUrl && <button type="button" onClick={() => update('photoUrl', '')} className="inline-flex items-center gap-1 rounded-xl border border-rose-400/30 px-3 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-400/10"><X className="h-4 w-4" /> Remove</button>}
              <span className="text-[11px] text-slate-500">Stored as an image data URL for the demo.</span>
            </div>
          </div>
          {staff && <label><span className={labelClass}>Government / employee ID</span><input className={inputClass} value={form.governmentId || ''} onChange={(e) => update('governmentId', e.target.value)} placeholder="NDMA-STAFF-001" /></label>}
          <label><span className={labelClass}>Department</span><input className={inputClass} value={form.department || ''} onChange={(e) => update('department', e.target.value)} /></label>
          <label><span className={labelClass}>Designation</span><input className={inputClass} value={form.designation || ''} onChange={(e) => update('designation', e.target.value)} /></label>
          <label><span className={labelClass}>Date of birth (optional)</span><input className={inputClass} type="date" value={form.dateOfBirth || ''} onChange={(e) => update('dateOfBirth', e.target.value)} /></label>
        </div>
      </section>

      <section className="glass-panel rounded-2xl border border-white/10 p-6">
        <h2 className="mb-5 font-bold text-white">Location & emergency information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2"><span className={labelClass}>Home address / area</span><textarea className={inputClass} rows={2} value={form.homeAddress || ''} onChange={(e) => update('homeAddress', e.target.value)} /></label>
          <label><span className={labelClass}>Emergency contact name</span><input className={inputClass} value={form.emergencyContactName || ''} onChange={(e) => update('emergencyContactName', e.target.value)} /></label>
          <label><span className={labelClass}>Emergency contact phone</span><input className={inputClass} type="tel" value={form.emergencyContactPhone || ''} onChange={(e) => update('emergencyContactPhone', e.target.value)} /></label>
          <label><span className={labelClass}>Blood group</span><select className={inputClass} value={form.bloodGroup || ''} onChange={(e) => update('bloodGroup', e.target.value)}><option value="">Select</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group}>{group}</option>)}</select></label>
        </div>
      </section>

      {user?.role === 'citizen' ? (
        <section className="glass-panel rounded-2xl border border-amber-400/20 p-6">
          <h2 className="mb-5 font-bold text-white">Citizen evacuation details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label><span className={labelClass}>Household size</span><input className={inputClass} type="number" min="1" value={form.householdSize || 1} onChange={(e) => update('householdSize', Number(e.target.value))} /></label>
            <label className="flex items-center gap-3 self-end rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"><input type="checkbox" checked={Boolean(form.mobilityNeeds)} onChange={(e) => update('mobilityNeeds', e.target.checked)} /> Dependents with mobility issues</label>
          </div>
        </section>
      ) : (
        <section className="glass-panel rounded-2xl border border-purple-400/20 p-6">
          <h2 className="mb-5 font-bold text-white">Officer deployment details</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <label><span className={labelClass}>Assigned zone / sector</span><input className={inputClass} value={form.assignedZone || ''} onChange={(e) => update('assignedZone', e.target.value)} /></label>
            <label><span className={labelClass}>Shift timing</span><input className={inputClass} value={form.shiftTiming || ''} onChange={(e) => update('shiftTiming', e.target.value)} placeholder="08:00 - 16:00" /></label>
            <label><span className={labelClass}>Vehicle / unit ID</span><input className={inputClass} value={form.vehicleUnitId || ''} onChange={(e) => update('vehicleUnitId', e.target.value)} /></label>
          </div>
        </section>
      )}
    </form>
  );
};
