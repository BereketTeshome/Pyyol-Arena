import React, { useState } from 'react';
import { DomainEvent, Dispute } from '../types/arena';
import { INITIAL_DOMAIN_EVENTS, INITIAL_DISPUTES } from '../data/mockInitialData';

export const AntifraudEventsView: React.FC = () => {
  const [events] = useState<DomainEvent[]>(INITIAL_DOMAIN_EVENTS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);

  // Filtering & Search state
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CERTIFICATION' | 'MATCHES' | 'DISPUTES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJsonIds, setExpandedJsonIds] = useState<Record<string, boolean>>({});

  // Open Dispute Form
  const [matchId, setMatchId] = useState('');
  const [reason, setReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const toggleJsonExpand = (id: string) => {
    setExpandedJsonIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  // Filter logic
  const filteredEvents = events.filter((evt) => {
    // Category match
    if (selectedCategory === 'CERTIFICATION' && !evt.type.includes('CERTIFIED') && !evt.type.includes('SANDBOX')) {
      return false;
    }
    if (selectedCategory === 'MATCHES' && !evt.type.includes('MATCH')) {
      return false;
    }
    if (selectedCategory === 'DISPUTES' && !evt.type.includes('DISPUTE')) {
      return false;
    }

    // Search query match
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const typeMatch = evt.type.toLowerCase().includes(q);
    const payloadStr = JSON.stringify(evt.payload).toLowerCase();
    return typeMatch || payloadStr.includes(q);
  });

  const getEventIcon = (type: string) => {
    if (type.includes('CERTIFIED')) return '🛡️';
    if (type.includes('MATCH')) return '⚔️';
    if (type.includes('SETTLEMENT')) return '💰';
    if (type.includes('DISPUTE')) return '⚠️';
    return '⚡';
  };

  const getHumanDescription = (evt: DomainEvent) => {
    const p = evt.payload;
    if (evt.type === 'AGENT.CERTIFIED') {
      return `Agent ${p.agentName || 'Unknown'} achieved official certification for ${String(p.game || 'Chess').toUpperCase()}`;
    }
    if (evt.type === 'MATCH.FINISHED') {
      return `Match Completed: ${p.winner} defeated ${p.loser} in ${String(p.game || 'Chess').toUpperCase()}`;
    }
    if (evt.type === 'SETTLEMENT.ISSUED') {
      return `Payout Distributed: ${p.winner} awarded ${p.potCoins?.toLocaleString() || 0} Coins`;
    }
    return `Event trigger executed on event bus`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-grid-pattern p-4 md:p-6 gap-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#22222C] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-white text-black font-extrabold text-[9px] uppercase tracking-wider rounded">
              ANTIFRAUD AUDIT LOGS
            </span>
            <span className="text-xs text-emerald-400 font-bold">● LIVE EVENT STREAM</span>
          </div>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-tight">
            Transactional Domain Events
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time domain events broadcast by the outbox event bus for match outcomes, certifications, and disputes.
          </p>
        </div>

        <button
          onClick={() => setShowDisputeModal(true)}
          className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-5 py-2.5 uppercase cursor-pointer transition-all rounded shadow-[0_0_12px_rgba(239,68,68,0.3)] shrink-0"
        >
          + File Match Dispute
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-12 gap-6">
        {/* Domain Events Stream Column */}
        <div className="col-span-12 lg:col-span-8 bg-[#0E0E14] border border-white/15 p-4 md:p-5 rounded-md flex flex-col gap-4">
          
          {/* Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#222230] pb-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'CERTIFICATION', 'MATCHES', 'DISPUTES'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[9px] font-black uppercase px-2.5 py-1 rounded cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-black font-extrabold shadow-sm'
                      : 'bg-[#161622] text-slate-400 border border-[#282836] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search events, agents, match ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#161622] border border-[#2D2D3E] text-xs text-white px-3 py-1.5 rounded w-full sm:w-56 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Event Stream Cards List */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic text-xs bg-[#12121B] rounded border border-[#1E1E2A]">
                No domain events match the selected filter.
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const isExpanded = !!expandedJsonIds[evt.id];
                const humanDesc = getHumanDescription(evt);
                const icon = getEventIcon(evt.type);

                return (
                  <div
                    key={evt.id}
                    className="p-4 bg-[#14141E] border border-white/15 hover:border-cyan-400/60 rounded transition-all flex flex-col gap-2.5 group"
                  >
                    {/* Event Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{icon}</span>
                        <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-extrabold rounded uppercase">
                          {evt.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">ID: {evt.id}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                    </div>

                    {/* Human Headline */}
                    <div className="text-sm font-bold text-white font-sans tracking-wide">
                      {humanDesc}
                    </div>

                    {/* Structured Key-Value Property Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Object.entries(evt.payload).map(([key, val]) => (
                        <div
                          key={key}
                          className="bg-[#1A1A26] border border-[#2A2A38] px-2.5 py-1 rounded text-[10px] flex items-center gap-1.5"
                        >
                          <span className="text-slate-400 uppercase font-bold">{key}:</span>
                          <span className="text-white font-extrabold">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions: On-Chain Tag & Developer JSON Toggle */}
                    <div className="flex justify-between items-center border-t border-[#1E1E2A] pt-2 mt-1">
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                        ✓ VERIFIED IMMUTABLE ON-CHAIN
                      </span>

                      <button
                        onClick={() => toggleJsonExpand(evt.id)}
                        className="text-[9px] uppercase font-bold text-slate-400 hover:text-cyan-300 cursor-pointer"
                      >
                        {isExpanded ? '▲ Hide Dev JSON' : '▼ View Raw JSON'}
                      </button>
                    </div>

                    {/* Optional Developer JSON Inspector */}
                    {isExpanded && (
                      <div className="mt-2 p-3 bg-[#0A0A10] border border-[#222230] rounded text-[10px] text-cyan-300 font-mono overflow-x-auto">
                        <pre>{JSON.stringify(evt, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Anti-Collusion & Open Disputes Column */}
        <div className="col-span-12 lg:col-span-4 bg-[#0E0E14] border border-white/15 p-4 md:p-5 rounded-md flex flex-col gap-4">
          <div className="border-b border-[#222230] pb-2 flex justify-between items-center">
            <span className="text-xs font-black uppercase text-red-400 font-mono tracking-wider">
              Disputes & Collusion Panel
            </span>
            <span className="text-[9px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5 rounded font-bold">
              {disputes.length} OPEN
            </span>
          </div>

          <div className="space-y-3">
            {disputes.length === 0 ? (
              <div className="p-4 text-slate-500 italic text-xs bg-[#12121B] rounded border border-[#1E1E2A]">
                No active disputes currently flagged.
              </div>
            ) : (
              disputes.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 bg-[#18141D] border border-red-900/60 rounded space-y-2 hover:border-red-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xs font-mono">{d.id}</span>
                    <span className="px-2 py-0.5 bg-amber-400 text-black font-extrabold text-[9px] uppercase rounded">
                      {d.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 bg-[#0F0D14] p-2 rounded border border-red-950">
                    <strong className="text-red-300">Match ID:</strong> {d.matchId}
                    <p className="mt-1 text-slate-200">{d.reason}</p>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>Complainant: {d.complainantHandle}</span>
                    <span>{d.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#12121C] border border-white/20 w-full max-w-md p-6 relative rounded-md text-slate-200 shadow-2xl">
            <button
              onClick={() => setShowDisputeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-sm font-black uppercase text-red-400 mb-4 border-b border-[#282836] pb-2 font-mono">
              File Match Anomaly or Dispute
            </h2>
            <form onSubmit={handleOpenDispute} className="space-y-4 font-mono">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Match ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. match_chess_9982"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value)}
                  className="w-full bg-[#1A1A28] border border-[#2D2D3E] px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Dispute Reason / Evidence
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe timing anomaly, illegal move, or endpoint timeout..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#1A1A28] border border-[#2D2D3E] p-2.5 text-xs text-white rounded focus:outline-none focus:border-red-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase text-xs cursor-pointer rounded shadow-md transition-all"
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

