import React, { useState } from 'react';
import { DomainEvent, Dispute } from '../types/arena';
import { INITIAL_DOMAIN_EVENTS, INITIAL_DISPUTES } from '../data/mockInitialData';

export const AntifraudEventsView: React.FC = () => {
  const [events] = useState<DomainEvent[]>(INITIAL_DOMAIN_EVENTS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);

  // Open Dispute Form
  const [matchId, setMatchId] = useState('');
  const [reason, setReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId.trim() || !reason.trim()) return;

    const newDisp: Dispute = {
      id: 'disp_' + Date.now().toString().slice(-4),
      matchId,
      complainantHandle: '@dev_quantum_01',
      reason,
      status: 'OPEN',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setDisputes([newDisp, ...disputes]);
    setShowDisputeModal(false);
    setMatchId('');
    setReason('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-grid-pattern p-6 gap-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#22222a] pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            PLATFORM BUS & ANTIFRAUD AUDIT LOGS
          </span>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-tight">
            Transactional Domain Events & Disputes
          </h1>
          <p className="text-xs text-[#777] mt-0.5">
            The outbox event bus broadcasts immutable domain events for match completion, certification, and disputes.
          </p>
        </div>

        <button
          onClick={() => setShowDisputeModal(true)}
          className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 font-black text-xs px-5 py-2 uppercase transform -skew-x-12 cursor-pointer transition-all"
        >
          + File Match Dispute
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Domain Event Bus Stream */}
        <div className="col-span-12 lg:col-span-7 bg-[#0F0F14] border border-[#22222a] p-4 flex flex-col">
          <div className="flex justify-between items-center border-b border-[#22222a] pb-2 mb-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Domain Event Bus Stream
            </span>
            <span className="text-[9px] text-cyan-400">OUTBOX BUS ACTIVE</span>
          </div>

          <div className="space-y-2 text-xs">
            {events.map((evt) => (
              <div key={evt.id} className="p-3 bg-[#12121b] border border-[#22222a] flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold uppercase text-[10px]">{evt.type}</span>
                  <span className="text-[9px] text-slate-500">{evt.timestamp}</span>
                </div>
                <div className="text-[11px] text-slate-300 bg-[#09090d] p-2 border border-[#1e1e28]">
                  <pre>{JSON.stringify(evt.payload, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disputes & Collusion Detection */}
        <div className="col-span-12 lg:col-span-5 bg-[#0F0F14] border border-[#22222a] p-4 flex flex-col">
          <div className="border-b border-[#22222a] pb-2 mb-3">
            <span className="text-[10px] font-bold uppercase text-red-400">
              Anti-Collusion & Open Disputes Panel
            </span>
          </div>

          <div className="space-y-3">
            {disputes.length === 0 ? (
              <div className="text-slate-500 italic text-xs">No active disputes opened.</div>
            ) : (
              disputes.map((d) => (
                <div key={d.id} className="p-3 bg-[#16141c] border border-red-900/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xs">{d.id} ({d.matchId})</span>
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 text-[9px] font-bold uppercase">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">{d.reason}</p>
                  <span className="text-[9px] text-slate-500 block">Complainant: {d.complainantHandle}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0F0F14] border border-[#2D2D36] w-full max-w-md p-6 relative text-slate-200">
            <button
              onClick={() => setShowDisputeModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-sm font-bold uppercase text-red-400 mb-4 border-b border-[#222] pb-2">
              File Match Anomaly or Dispute
            </h2>
            <form onSubmit={handleOpenDispute} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Match ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. match_chess_9982"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2A2A36] px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Dispute Reason / Evidence
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe timing anomaly, illegal move, or endpoint timeout..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2A2A36] p-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs transform -skew-x-12 cursor-pointer"
              >
                Submit Official Dispute →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
