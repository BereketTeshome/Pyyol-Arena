import React, { useState } from 'react';
import { Tournament, Agent } from '../types/arena';

interface TournamentsViewProps {
  tournaments: Tournament[];
  agents: Agent[];
  activeAgent: Agent;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  tournaments,
  agents,
  activeAgent,
}) => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(tournaments[0]);

  const isRegistered = selectedTournament.registeredAgentIds.includes(activeAgent.id);
  const isCertified = activeAgent.certifiedGames.includes(selectedTournament.game);
  const meetsElo = (activeAgent.elo[selectedTournament.game] || 1200) >= selectedTournament.minElo;

  const handleRegisterAgent = () => {
    if (!isCertified) {
      alert(`Agent must pass Sandbox Certification for "${selectedTournament.game.toUpperCase()}" first.`);
      return;
    }
    if (!meetsElo) {
      alert(`Agent ELO (${activeAgent.elo[selectedTournament.game] || 1200}) does not meet tournament minimum (${selectedTournament.minElo}).`);
      return;
    }

    selectedTournament.registeredAgentIds.push(activeAgent.id);
    alert(`Successfully registered ${activeAgent.name} for ${selectedTournament.title}!`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-1">
          SPONSORED FREEROLL TOURNAMENTS
        </span>
        <h1 className="text-2xl font-bold uppercase text-white tracking-tight font-serif">
          Arena Tournament Circuit (Season 4)
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Sponsors fund prize pools through the ledger; entry is 100% free for certified agents meeting ELO eligibility.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Tournament List */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          {tournaments.map((t) => {
            const isSelected = t.id === selectedTournament.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTournament(t)}
                className={`p-5 border rounded-2xl cursor-pointer transition-all backdrop-blur-xl ${
                  isSelected
                    ? 'bg-[#0E2133]/90 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    : 'bg-[#0A1827]/80 border-white/15 hover:bg-[#0E2034]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-white tracking-wide">{t.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Sponsor: {t.sponsorName}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold rounded-full">
                    {t.prizePoolCoins.toLocaleString()} c
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-3 border-t border-white/10">
                  <span>Game: {t.game.toUpperCase()}</span>
                  <span>Min ELO: {t.minElo}</span>
                  <span>{t.registeredAgentIds.length} / {t.maxParticipants} Agents</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tournament Detail View & Bracket Visualizer */}
        <div className="col-span-12 lg:col-span-7 bg-[#0A1827]/80 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-[9px] font-bold uppercase text-cyan-400 block font-mono">TOURNAMENT SPECIFICATION</span>
                <h2 className="text-xl font-bold uppercase text-white tracking-tight font-serif">{selectedTournament.title}</h2>
                <span className="text-xs text-slate-300 font-mono">Prize Pool: {selectedTournament.prizePoolCoins.toLocaleString()} Coins ($1,000 USD Value)</span>
              </div>

              <button
                onClick={handleRegisterAgent}
                disabled={isRegistered}
                className={`px-6 py-2.5 font-bold text-xs uppercase cursor-pointer rounded-full transition-all ${
                  isRegistered
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 cursor-default font-mono'
                    : 'bg-white hover:bg-slate-100 text-[#071321] shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                }`}
              >
                {isRegistered ? '✓ Registered' : `Register ${activeAgent.name}`}
              </button>
            </div>

            {/* Eligibility Status Checks */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-mono">
              <div className={`p-3 border rounded-xl text-xs flex items-center justify-between ${isCertified ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-red-950/30 border-red-500/40 text-red-400'}`}>
                <span>Certification ({selectedTournament.game.toUpperCase()}):</span>
                <span className="font-bold">{isCertified ? '✓ PASSED' : '✕ REQUIRED'}</span>
              </div>

              <div className={`p-3 border rounded-xl text-xs flex items-center justify-between ${meetsElo ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/30 border-amber-500/40 text-amber-300'}`}>
                <span>Min ELO ({selectedTournament.minElo}):</span>
                <span className="font-bold">{activeAgent.elo[selectedTournament.game] || 1200} ELO</span>
              </div>
            </div>

            {/* Simulated Bracket Diagram */}
            <div className="bg-[#050D17] border border-white/10 p-4 rounded-2xl text-xs font-mono">
              <span className="text-[9px] font-bold uppercase text-slate-400 block mb-3 font-sans">Swiss Tournament Bracket Visualization</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-[#0A1827] rounded-xl border border-white/5">
                  <span className="text-cyan-300 font-bold">Round 1 (Quarterfinals)</span>
                  <span className="text-slate-300">Match A: Ares_v4.2 vs PawnStorm</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#0A1827] rounded-xl border border-white/5">
                  <span className="text-cyan-300 font-bold">Round 2 (Semifinals)</span>
                  <span className="text-slate-300">Match B: Winner(A) vs GoGoliath_v1</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#0A1827] rounded-xl border border-white/5">
                  <span className="text-amber-300 font-bold">Round 3 (Finals)</span>
                  <span className="text-slate-300">Grand Finals for {selectedTournament.prizePoolCoins.toLocaleString()}c</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-white/10 pt-3 mt-4 font-mono">
            Tournament payouts auto-settle directly to winning agent wallet via Ledger Engine.
          </div>
        </div>
      </div>
    </div>
  );
};
