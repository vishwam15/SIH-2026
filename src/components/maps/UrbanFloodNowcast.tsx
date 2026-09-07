import React, { useMemo, useState } from 'react';
import { Circle, MapContainer, Marker, Popup } from 'react-leaflet';
import { AppMapTileLayer } from './AppMapTileLayer';
import L from 'leaflet';
import { CloudRain, Droplets, GitBranch, Gauge } from 'lucide-react';

export type NowcastStreet = {
  id: string;
  streetName: string;
  coordinates: { lat: number; lng: number };
  drainageNode: string;
  rainfallMmHr: number;
  peakDepthCm: number;
  peakRiskLevel: string;
  forecasts: { leadMinutes: number; waterDepthCm: number; riskLevel: string; drainageLoadPct: number }[];
};

export type UrbanNowcast = {
  generatedAt: string;
  model: string;
  dataSources: { rainfall: string; terrain: string; drainage: string };
  horizonMinutes: number;
  rainfallMmHr: number;
  streets: NowcastStreet[];
  drainage: { nodeId: string; streetName: string; predictedLoadPct: number; surcharge: boolean; backflowRisk: string }[];
  summary: { criticalStreetCount: number; highRiskStreetCount: number; surchargeNodeCount: number; maxDepthCm: number };
};

const riskColor = (risk: string) => risk === 'CRITICAL' ? '#ef4444' : risk === 'HIGH' ? '#f97316' : risk === 'MODERATE' ? '#f59e0b' : '#10b981';
const floodIcon = (risk: string) => L.divIcon({ className: 'nowcast-flood-pin', html: `<div style="width:22px;height:22px;border-radius:50%;background:${riskColor(risk)};border:3px solid #fff;box-shadow:0 0 16px ${riskColor(risk)};" />`, iconSize: [22, 22], iconAnchor: [11, 11] });

export const UrbanFloodNowcast: React.FC<{ nowcast: UrbanNowcast | null; mlPrediction?: any; loading?: boolean }> = ({ nowcast, mlPrediction, loading = false }) => {
  const [leadMinutes, setLeadMinutes] = useState(60);
  const selected = useMemo(() => nowcast?.streets.map((street) => ({ ...street, forecast: street.forecasts.find((item) => item.leadMinutes === leadMinutes) || street.forecasts[street.forecasts.length - 1] })), [nowcast, leadMinutes]);

  if (loading || !nowcast) return <div className="glass-panel rounded-2xl border border-cyan-500/20 p-6 text-sm text-slate-400">Running rainfall-runoff and drainage graph nowcast...</div>;

  return (
    <section className="space-y-4 rounded-2xl border border-cyan-500/25 bg-slate-950/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="flex items-center gap-2"><CloudRain className="h-5 w-5 text-cyan-400" /><h2 className="font-display text-lg font-extrabold text-white">Street-Level Flood Nowcast</h2><span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">0–3 HOUR WINDOW</span></div><p className="mt-1 text-xs text-slate-400">Coupled radar rainfall, DEM depression storage, and drainage-network capacity model.</p></div>
        <div className="flex gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1">{[0, 30, 60, 120, 180].map((step) => <button key={step} type="button" onClick={() => setLeadMinutes(step)} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${leadMinutes === step ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>{step === 0 ? 'Now' : `+${step}m`}</button>)}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-5"><div className="rounded-xl border border-slate-800 bg-slate-900 p-3"><span className="text-[10px] uppercase text-slate-500">Rainfall input</span><strong className="mt-1 block text-xl text-cyan-300">{nowcast.rainfallMmHr} mm/h</strong></div><div className="rounded-xl border border-slate-800 bg-slate-900 p-3"><span className="text-[10px] uppercase text-slate-500">Peak depth</span><strong className="mt-1 block text-xl text-rose-300">{nowcast.summary.maxDepthCm} cm</strong></div><div className="rounded-xl border border-slate-800 bg-slate-900 p-3"><span className="text-[10px] uppercase text-slate-500">High-risk streets</span><strong className="mt-1 block text-xl text-amber-300">{nowcast.summary.highRiskStreetCount + nowcast.summary.criticalStreetCount}</strong></div><div className="rounded-xl border border-slate-800 bg-slate-900 p-3"><span className="text-[10px] uppercase text-slate-500">Surcharge nodes</span><strong className="mt-1 block text-xl text-purple-300">{nowcast.summary.surchargeNodeCount}</strong></div><div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3"><span className="text-[10px] uppercase text-slate-500">ML flood score</span><strong className="mt-1 block text-xl text-cyan-300">{mlPrediction ? `${mlPrediction.risk_score}%` : '—'}</strong><span className="text-[10px] text-slate-500">{mlPrediction?.model || 'model offline'}</span></div></div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-xl border border-slate-800"><div className="h-[360px]"><MapContainer center={[19.076, 72.8777]} zoom={12} scrollWheelZoom style={{ height: '100%', width: '100%' }}><AppMapTileLayer defaultMode="dark" />{selected?.map((street) => <React.Fragment key={street.id}><Circle center={[street.coordinates.lat, street.coordinates.lng]} radius={450} pathOptions={{ color: riskColor(street.forecast.riskLevel), fillColor: riskColor(street.forecast.riskLevel), fillOpacity: 0.25, weight: 2 }} /><Marker position={[street.coordinates.lat, street.coordinates.lng]} icon={floodIcon(street.forecast.riskLevel)}><Popup><strong>{street.streetName}</strong><div>{street.forecast.waterDepthCm} cm at +{leadMinutes} minutes</div><div>{street.forecast.riskLevel} · drainage {street.forecast.drainageLoadPct}%</div></Popup></Marker></React.Fragment>)}</MapContainer></div></div>
        <div className="space-y-2"><h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><Droplets className="h-4 w-4 text-cyan-400" /> Street inundation projection</h3>{selected?.map((street) => <div key={street.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-white">{street.streetName}</span><span className="text-xs font-black" style={{ color: riskColor(street.forecast.riskLevel) }}>{street.forecast.waterDepthCm} cm</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full" style={{ width: `${Math.min(street.forecast.waterDepthCm / 40 * 100, 100)}%`, background: riskColor(street.forecast.riskLevel) }} /></div><div className="mt-1 flex justify-between text-[10px] text-slate-500"><span>{street.forecast.riskLevel}</span><span>{street.forecast.drainageLoadPct}% drain load</span></div></div>)}</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><GitBranch className="h-4 w-4 text-purple-400" /> Drainage graph & backflow</h3>{nowcast.drainage.map((node) => <div key={node.nodeId} className="flex items-center justify-between border-b border-white/5 py-2 text-xs last:border-0"><span className="text-slate-300">{node.nodeId} · {node.streetName}</span><span className={node.surcharge ? 'font-bold text-rose-300' : 'text-emerald-300'}>{node.surcharge ? `SURCHARGE ${node.predictedLoadPct}%` : `${node.predictedLoadPct}% load`}</span></div>)}</div><div className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><Gauge className="h-4 w-4 text-amber-400" /> Model provenance</h3><p className="text-xs leading-5 text-slate-400">Rainfall: <span className="text-slate-200">{nowcast.dataSources.rainfall}</span><br />Terrain: <span className="text-slate-200">{nowcast.dataSources.terrain}</span><br />Drainage: <span className="text-slate-200">{nowcast.dataSources.drainage}</span></p><p className="mt-3 text-[10px] text-slate-500">Generated {new Date(nowcast.generatedAt).toLocaleTimeString()}</p></div></div>
    </section>
  );
};
