import React, { useMemo, useState } from 'react';
import { Ambulance, CheckCircle2, MapPinned, Radio, Siren } from 'lucide-react';
import type { UserRole } from '../../types';

type LiveUnit = { userId: string; role?: string; lat: number; lng: number; timestamp?: string };

type RescueCoordinationPanelProps = {
  userRole: UserRole;
  liveLocations: LiveUnit[];
  activeSos: LiveUnit[];
  onDispatch?: (sos: LiveUnit, responder: LiveUnit) => void;
};

const responderRoles = ['field', 'field_officer', 'response', 'response_team', 'authority', 'admin'];
const safeLat = (item: any) => {
  const v = Number(item?.lat ?? item?.latitude);
  return Number.isFinite(v) ? v : 19.076;
};

const safeLng = (item: any) => {
  const v = Number(item?.lng ?? item?.longitude);
  return Number.isFinite(v) ? v : 72.877;
};

const distanceKm = (a: any, b: any) => {
  const aLat = safeLat(a);
  const aLng = safeLng(a);
  const bLat = safeLat(b);
  const bLng = safeLng(b);
  const latDistance = (aLat - bLat) * 111;
  const lngDistance = (aLng - bLng) * 111 * Math.cos((aLat * Math.PI) / 180);
  const d = Math.sqrt(latDistance ** 2 + lngDistance ** 2);
  return Number.isFinite(d) ? d : 0;
};

const roleName = (role?: string) => ({
  field: 'Field Officer',
  field_officer: 'Field Officer',
  response: 'Response Team',
  response_team: 'Response Team',
  authority: 'Authority',
  admin: 'Admin',
  citizen: 'Citizen',
}[role || ''] || role || 'Unit');

export const RescueCoordinationPanel: React.FC<RescueCoordinationPanelProps> = ({
  userRole,
  liveLocations,
  activeSos,
  onDispatch,
}) => {
  const [dispatched, setDispatched] = useState<Record<string, boolean>>({});
  const visible = ['admin', 'authority', 'response', 'field'].includes(userRole);
  const responders = useMemo(
    () => liveLocations.filter((unit) => responderRoles.includes(unit.role || '')),
    [liveLocations]
  );
  if (!visible) return null;

  return (
    <section className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-rose-300" />
            <h2 className="font-display text-base font-extrabold text-white">Live Rescue Coordination</h2>
            <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-2 py-1 text-[10px] font-bold text-rose-200">
              {activeSos.length} ACTIVE SOS
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Nearest officer/response unit is selected automatically. The red dashed route is drawn on the live map.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-300">
          <Radio className="h-3.5 w-3.5 animate-pulse" /> Live location feed
        </div>
      </div>

      {activeSos.length === 0 ? (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-500">
          No active SOS incidents. Citizens who press SOS will appear here instantly.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {activeSos.map((sos) => {
            const sosLat = safeLat(sos);
            const sosLng = safeLng(sos);
            const nearest = responders
              .filter((unit) => unit.userId !== sos.userId)
              .sort((a, b) => distanceKm(a, sos) - distanceKm(b, sos))[0];
            const isDispatched = Boolean(dispatched[sos.userId]);
            const dist = nearest ? distanceKm(nearest, sos) : 0;

            return (
              <div key={sos.userId} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-300">
                      <Siren className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-white">Citizen SOS · {sos.userId}</div>
                      <div className="text-[10px] text-slate-500">
                        {sos.timestamp ? new Date(sos.timestamp).toLocaleTimeString() : 'Just now'} · CRITICAL
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-300 font-mono">
                    {sosLat.toFixed(4)}, {sosLng.toFixed(4)}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-800 p-2">
                    <div className="text-[10px] uppercase text-slate-500">Nearest unit</div>
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-200">
                      <Ambulance className="h-3.5 w-3.5" />
                      {nearest ? `${roleName(nearest.role)} · ${nearest.userId}` : 'Waiting for live unit'}
                    </div>
                    {nearest && (
                      <div className="mt-1 text-[10px] text-slate-500 font-mono">
                        {dist.toFixed(2)} km away
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-800 p-2">
                    <div className="text-[10px] uppercase text-slate-500">Rescue path</div>
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-cyan-200">
                      <MapPinned className="h-3.5 w-3.5" />
                      OSRM route + fallback
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">Updates as units move</div>
                  </div>
                </div>

                {nearest && (
                  <button
                    type="button"
                    disabled={isDispatched}
                    onClick={() => {
                      setDispatched((current) => ({ ...current, [sos.userId]: true }));
                      onDispatch?.(sos, nearest);
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-extrabold text-white disabled:bg-emerald-700 transition cursor-pointer"
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Unit dispatched
                      </>
                    ) : (
                      'Dispatch nearest rescue unit'
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
