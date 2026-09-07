import React, { useEffect, useState } from 'react';
import { Camera, CheckCircle2, CloudOff, FileWarning, MapPin, Send, Upload } from 'lucide-react';
import { DisasterShieldAPI } from '../services/api';

type FieldReportsProps = { user: any };
type Report = { id: string; reporterId: string; reporterRole: string; hazardType: string; description: string; coordinates: { lat: number; lng: number }; media?: { dataUrl?: string; fileName?: string; mimeType?: string }; reportedAt: string; synced?: boolean };
const QUEUE_KEY = 'drishti-field-report-queue';

export const FieldReports: React.FC<FieldReportsProps> = ({ user }) => {
  const [hazardType, setHazardType] = useState('flood');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [media, setMedia] = useState<Report['media']>();
  const [queue, setQueue] = useState<Report[]>(() => {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; }
  });
  const [status, setStatus] = useState('');
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
    return () => { window.removeEventListener('online', onlineHandler); window.removeEventListener('offline', offlineHandler); };
  }, []);

  useEffect(() => { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); }, [queue]);

  const captureLocation = () => {
    if (!navigator.geolocation) { setStatus('This browser does not support location.'); return; }
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
      setStatus('Location captured.');
    }, () => setStatus('Location permission is required to submit a geo-tagged report.'), { enableHighAccuracy: true, timeout: 10000 });
  };

  const chooseMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) { setStatus('Choose an image or video.'); return; }
    if (file.size > 600 * 1024) { setStatus('Keep attachments below 600 KB for offline storage.'); return; }
    const reader = new FileReader();
    reader.onload = () => setMedia({ dataUrl: String(reader.result), fileName: file.name, mimeType: file.type });
    reader.readAsDataURL(file);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!coordinates) { setStatus('Capture your location before submitting.'); return; }
    if (!description.trim()) { setStatus('Add a short description of the hazard.'); return; }
    const report: Report = { id: `report-${Date.now()}`, reporterId: user?.id || 'guest', reporterRole: user?.role || 'citizen', hazardType, description: description.trim(), coordinates, media, reportedAt: new Date().toISOString() };
    if (!online) {
      setQueue((current) => [report, ...current]);
      setDescription('');
      setMedia(undefined);
      setStatus('Saved offline. It will sync when connectivity returns.');
      return;
    }
    try {
      await DisasterShieldAPI.createFieldReport(report);
      setDescription(''); setMedia(undefined); setStatus('Report submitted to the command center.');
    } catch {
      setQueue((current) => [report, ...current]);
      setStatus('Network unavailable. Report saved offline for sync.');
    }
  };

  useEffect(() => {
    if (!online || queue.length === 0) return;
    const sync = async () => {
      const remaining: Report[] = [];
      for (const report of queue) {
        try { await DisasterShieldAPI.createFieldReport(report); } catch { remaining.push(report); }
      }
      setQueue(remaining);
      if (remaining.length < queue.length) setStatus('Offline reports synced to the command center.');
    };
    sync();
  }, [online, queue.length]);

  return <div className="mx-auto max-w-5xl space-y-6 p-6 pb-12">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><FileWarning className="h-6 w-6 text-amber-300" /><h1 className="font-display text-2xl font-extrabold text-white">Field Reports</h1></div><p className="mt-1 text-xs text-slate-400">Send geo-tagged flood, landslide, drainage, and road-blockage observations.</p></div><span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${online ? 'border-emerald-400/30 text-emerald-300' : 'border-amber-400/30 text-amber-300'}`}>{online ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CloudOff className="h-3.5 w-3.5" />}{online ? 'Online' : 'Offline mode'}</span></div>
    <form onSubmit={submit} className="glass-panel space-y-5 rounded-2xl border border-amber-400/20 p-6">
      <div className="grid gap-4 md:grid-cols-2"><label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Observation type</span><select value={hazardType} onChange={(e) => setHazardType(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"><option value="flood">Urban flooding / waterlogging</option><option value="landslide">Landslide / slope movement</option><option value="blocked-road">Blocked road</option><option value="drainage">Blocked drain / surcharge</option><option value="other">Other hazard</option></select></label><div><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</span><button type="button" onClick={captureLocation} className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3 py-2.5 text-xs font-bold text-cyan-100"><MapPin className="h-4 w-4" />{coordinates ? `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}` : 'Capture GPS location'}</button></div></div>
      <label><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</span><textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe depth, road condition, cracks, blockage, or people at risk..." className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400" /></label>
      <div className="flex flex-wrap items-center gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs font-bold text-slate-200"><Upload className="h-4 w-4 text-amber-300" /> Attach photo/video<input className="sr-only" type="file" accept="image/*,video/*" capture="environment" onChange={chooseMedia} /></label>{media && <span className="flex items-center gap-2 text-xs text-emerald-300"><Camera className="h-4 w-4" />{media.fileName}</span>}<button type="submit" className="ml-auto inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-slate-950"><Send className="h-4 w-4" /> Submit report</button></div>
      {status && <p className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">{status}</p>}
    </form>
    {queue.length > 0 && <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-amber-100"><strong>{queue.length} report{queue.length === 1 ? '' : 's'} waiting to sync.</strong> Keep this tab open or return when the network is available.</div>}
  </div>;
};
