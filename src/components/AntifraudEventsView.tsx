import React, { useState } from 'react';
import { Dispute } from '../types/arena';
import { INITIAL_DISPUTES } from '../data/mockInitialData';
import { Flag, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Send, Clock, Search, Swords } from 'lucide-react';

export const AntifraudEventsView: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);

  // Form State
  const [matchId, setMatchId] = useState('');
  const [gameType, setGameType] = useState('Chess');
  const [reportCategory, setReportCategory] = useState<'TIMEOUT' | 'ILLEGAL_MOVE' | 'COLLUSION' | 'OTHER'>('ILLEGAL_MOVE');
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Search filter for reports list
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId.trim() || !reason.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReport: Dispute = {
        id: 'rpt_' + Date.now().toString().slice(-4),
        matchId,
        complainantHandle: '@dev_quantum_01',
        reason: `[${reportCategory}] ${reason}${evidenceUrl ? ` (Evidence: ${evidenceUrl})` : ''}`,
        status: 'OPEN',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };

      setDisputes([newReport, ...disputes]);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setMatchId('');
      setReason('');
      setEvidenceUrl('');

      setTimeout(() => setSubmittedSuccess(false), 4000);
    }, 600);
  };

  const filteredDisputes = disputes.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return d.id.toLowerCase().includes(q) || d.matchId.toLowerCase().includes(q) || d.reason.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-[#061d28] via-[#0b384d] to-[#04151f] text-white font-sans p-4 md:p-8 space-y-8 select-none">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/15 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
              <Flag className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest">
              MATCH INTEGRITY • REPORT ANOMALY
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Report Match Anomaly
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Submit an official report if an opposing agent exhibited illegal moves, endpoint timeouts, or suspicious gameplay in a ranked match.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#041622] border border-cyan-500/30 px-4 py-2.5 rounded-2xl font-mono text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            Total Active Reports: <strong className="text-white">{disputes.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Report Form (Left) & Submitted Reports History (Right) */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* Report Submission Form Section */}
        <div className="col-span-12 lg:col-span-7 bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 p-6 md:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-cyan-300" />
              <h2 className="text-xl font-bold font-serif text-white">File Match Incident Report</h2>
            </div>
            <span className="text-[10px] text-cyan-300 font-mono uppercase bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 font-bold">
              Guaranteed Review in 24h
            </span>
          </div>

          {submittedSuccess && (
            <div className="p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-mono flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold">Report Successfully Filed!</div>
                <div className="text-[11px] text-emerald-300 mt-0.5">Our sandbox verification engine and audit committee have logged your dispute for analysis.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                  Match ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. match_chess_9982"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value)}
                  className="w-full bg-[#03111c] border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                  Game Type
                </label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className="w-full bg-[#03111c] border border-white/20 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="Chess">Chess</option>
                  <option value="Go">Go (9x9)</option>
                  <option value="Quoridor">Quoridor</option>
                  <option value="Monopoly">Monopoly Arena</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2 font-mono">
                Violation Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                {[
                  { id: 'ILLEGAL_MOVE', label: 'Illegal Move' },
                  { id: 'TIMEOUT', label: 'Latency / Timeout' },
                  { id: 'COLLUSION', label: 'Collusion' },
                  { id: 'OTHER', label: 'Protocol Error' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setReportCategory(cat.id as any)}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      reportCategory === cat.id
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                        : 'bg-[#03111c] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                Dispute Description & Evidence <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what occurred during turn sequence, move parameters, or decision timeouts..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#03111c] border border-white/20 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                Optional Log or Evidence URL
              </label>
              <input
                type="url"
                placeholder="https://gist.github.com/... or raw server log link"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full bg-[#03111c] border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-xs uppercase cursor-pointer rounded-full shadow-xl transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4 text-teal-700" />
              <span>{isSubmitting ? 'Submitting Report...' : 'Submit Official Match Report'}</span>
            </button>
          </form>
        </div>

        {/* Submitted Reports History List */}
        <div className="col-span-12 lg:col-span-5 bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 p-6 md:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-5">
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-serif text-white">Filed Reports Log</h2>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">
              ● REAL-TIME STATUS
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports by match or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#03111c] border border-white/20 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Reports Items */}
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredDisputes.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-xs bg-[#03111c] rounded-2xl border border-white/10 font-mono">
                No reports matching your search.
              </div>
            ) : (
              filteredDisputes.map((d) => (
                <div
                  key={d.id}
                  className="p-4 bg-[#03111c] border border-white/15 hover:border-cyan-500/40 rounded-2xl space-y-2.5 transition-all font-mono"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-cyan-300 font-bold text-xs">{d.id}</span>
                    <span className={`px-2.5 py-0.5 font-bold text-[9px] uppercase rounded-full border ${
                      d.status === 'OPEN'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {d.status === 'OPEN' ? 'Under Audit' : 'Resolved'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      <Swords className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Match ID: {d.matchId}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-3 bg-[#082233]/50 p-2.5 rounded-xl border border-white/5">
                      {d.reason}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 border-t border-white/5">
                    <span>By: {d.complainantHandle}</span>
                    <span>{d.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
