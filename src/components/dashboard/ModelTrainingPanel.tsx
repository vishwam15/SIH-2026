import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, FileUp, Loader2, UploadCloud } from 'lucide-react';
import { DisasterShieldAPI } from '../../services/api';
import type { UserRole } from '../../types';

type ModelTrainingPanelProps = { userRole: UserRole; authToken?: string };

const featureColumns = {
  flood: ['rainfall_mm_hr', 'water_level_m', 'drainage_capacity_pct', 'imperviousness_pct', 'elevation_m'],
  landslide: ['rainfall_24h_mm', 'soil_moisture_pct', 'slope_angle_deg', 'ground_tilt_deg', 'vibration_hz'],
};

const parseCsv = (text: string) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    return Object.fromEntries(headers.map((header, index) => [header, Number.isNaN(Number(values[index])) || values[index] === '' ? values[index] : Number(values[index])]));
  });
};

export const ModelTrainingPanel: React.FC<ModelTrainingPanelProps> = ({ userRole, authToken }) => {
  const [hazard, setHazard] = useState<'flood' | 'landslide'>('flood');
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [training, setTraining] = useState(false);

  if (userRole !== 'admin' && userRole !== 'authority') return null;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus('');
    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text);
      const nextRecords = Array.isArray(parsed) ? parsed : parsed.records;
      if (!Array.isArray(nextRecords)) throw new Error('JSON must be an array of records or { records: [...] }');
      setRecords(nextRecords);
      setFileName(file.name);
      setMetrics(null);
      setStatus(`${nextRecords.length} rows loaded. Check the required columns, then train.`);
    } catch (error) {
      setRecords([]);
      setFileName('');
      setStatus(error instanceof Error ? error.message : 'Could not read this file.');
    }
  };

  const train = async () => {
    if (!authToken) {
      setStatus('Authenticated backend session required. Sign in through the backend account before training.');
      return;
    }
    setTraining(true);
    setStatus('Training Random Forest, Logistic Regression, and XGBoost...');
    try {
      const response = await DisasterShieldAPI.trainModel(hazard, records, authToken, {
        sourceFileName: fileName,
        sourceType: fileName.toLowerCase().endsWith('.json') ? 'JSON' : 'CSV',
        provenance: 'SOURCE UNVERIFIED - operator upload; verify source before production use',
      });
      setMetrics(response.metrics);
      setStatus(`Training complete from ${fileName}. The best model is now ${response.metrics.selected}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Training failed.');
    } finally {
      setTraining(false);
    }
  };

  return (
    <section className="glass-panel space-y-4 rounded-2xl border border-purple-400/25 bg-purple-500/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-purple-300" /><h2 className="font-display text-base font-extrabold text-white">AI / ML Model Training</h2><span className="rounded-full border border-purple-400/30 px-2 py-1 text-[10px] font-bold text-purple-200">{userRole === 'admin' ? 'ADMIN' : 'AUTHORITY'}</span></div><p className="mt-1 text-xs text-slate-400">Upload verified rainfall, water-level, terrain, drainage, soil, or landslide records to retrain the local model.</p></div>
        <select value={hazard} onChange={(event) => { setHazard(event.target.value as 'flood' | 'landslide'); setMetrics(null); }} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-white"><option value="flood">Flood model</option><option value="landslide">Landslide model</option></select>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400"><div className="mb-2 font-bold text-slate-200">Required feature columns</div><div className="flex flex-wrap gap-1.5">{featureColumns[hazard].map((column) => <code key={column} className="rounded bg-slate-800 px-2 py-1 text-[10px] text-cyan-200">{column}</code>)}<code className="rounded bg-slate-800 px-2 py-1 text-[10px] text-amber-200">label (required)</code></div></div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-xs font-bold text-cyan-100 hover:bg-cyan-400/20"><FileUp className="h-4 w-4" /> Choose CSV / JSON<input className="sr-only" type="file" accept=".csv,.json,text/csv,application/json" onChange={handleFile} /></label>
      </div>
      {fileName && <div className="flex items-center gap-2 text-xs text-slate-300"><UploadCloud className="h-4 w-4 text-emerald-300" />{fileName} · {records.length} rows</div>}
      <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={training || records.length < 20} onClick={train} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">{training ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />} Train model</button><span className="text-xs text-slate-400">Minimum 20 rows with both risk classes.</span></div>
      {status && <p className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">{status}</p>}
      {metrics && <div className="grid gap-2 sm:grid-cols-4">{['random_forest', 'logistic_regression', 'xgboost'].filter((name) => metrics[name]).map((name) => <div key={name} className={`rounded-xl border p-3 ${metrics.selected === name ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-slate-800 bg-slate-950'}`}><div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">{metrics.selected === name && <CheckCircle2 className="h-3 w-3 text-emerald-300" />}{name.replace('_', ' ')}</div><div className="mt-1 text-sm font-black text-white">F1 {Math.round(metrics[name].f1 * 100)}%</div><div className="text-[10px] text-slate-500">Accuracy {Math.round(metrics[name].accuracy * 100)}%</div></div>)}</div>}
    </section>
  );
};
