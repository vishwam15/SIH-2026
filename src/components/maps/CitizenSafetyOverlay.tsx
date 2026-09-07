import React from 'react';
import { AlertTriangle, MapPin, Phone, ShieldAlert, Siren } from 'lucide-react';

interface CitizenSafetyOverlayProps {
  shelterName?: string;
  distanceKm?: number;
  travelMinutes?: number;
  onTriggerSOS?: () => void;
}

export const CitizenSafetyOverlay: React.FC<CitizenSafetyOverlayProps> = ({
  shelterName = 'Community Relief Center',
  distanceKm = 2.4,
  travelMinutes = 14,
  onTriggerSOS,
}) => {
  const emergencyContacts = [
    { label: 'NDMA', value: '112' },
    { label: 'City Control', value: '1077' },
    { label: 'Disaster Helpline', value: '1800-123-999' },
  ];

  return (
    <div className="w-full rounded-2xl border border-rose-500/30 bg-slate-900/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.75)] p-5 text-white flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2 text-rose-400">
            <Siren className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-rose-300">Citizen Safety</p>
            <h3 className="text-sm font-black text-white">Emergency Response</h3>
          </div>
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          Live
        </span>
      </div>

      <button
        type="button"
        onClick={onTriggerSOS}
        className="w-full mb-4 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-3 py-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-rose-600/30 transition hover:brightness-110"
      >
        <span className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Trigger SOS
        </span>
      </button>

      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <MapPin className="w-4 h-4 text-emerald-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Nearest Shelter</span>
        </div>
        <div className="text-sm font-bold text-white">{shelterName}</div>
        <p className="text-[11px] text-slate-300 mt-1">
          {distanceKm} km away • {travelMinutes} min by safe route
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-4 h-4 text-cyan-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Emergency Contacts</span>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          {emergencyContacts.map((contact) => (
            <div key={contact.label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5">
              <span className="font-medium text-slate-300">{contact.label}</span>
              <span className="font-black text-white">{contact.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[10px] text-amber-200">
        <ShieldAlert className="w-3.5 h-3.5" />
        Safety check auto-validates active hazard layers before route guidance.
      </div>
    </div>
  );
};
