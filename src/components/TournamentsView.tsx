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
    <div className="flex-1 flex flex-col overflow-y-auto bg-grid-pattern p-6 gap-6">
      {/* Header */}
      <div className="border-b border-[#22222a] pb-4">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono block mb-1">
          SPONSORED FREEROLL TOURNAMENTS
        </span>
        <h1 className="text-2xl font-black italic uppercase text-white tracking-tight">
          Arena Tournament Circuit (Season 4)
        </h1>
        <p className="text-xs text-[#777] font-mono mt-0.5">
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
                className={`p-4 border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#181824] border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-[#0F0F14] border-[#22222a] hover:bg-[#14141c]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-black uppercase text-white tracking-wide">{t.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Sponsor: {t.sponsorName}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 font-mono text-[10px] font-bold">
                    {t.prizePoolCoins.toLocaleString()} c
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#666] pt-2 border-t border-[#1e1e28]">
                  <span>Game: {t.game.toUpperCase()}</span>
                  <span>Min ELO: {t.minElo}</span>
                  <span>{t.registeredAgentIds.length} / {t.maxParticipants} Agents</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tournament Detail View & Bracket Visualizer */}
        <div className="col-span-12 lg:col-span-7 bg-[#0F0F14] border border-[#22222a] p-5 flex flex-col justify-between font-mono">
          <div>
            <div className="flex justify-between items-start border-b border-[#22222a] pb-3 mb-4">
              <div>
                <span className="text-[9px] font-bold uppercase text-amber-400 block">TOURNAMENT SPECIFICATION</span>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">{selectedTournament.title}</h2>
                <span className="text-xs text-slate-400">Prize Pool: {selectedTournament.prizePoolCoins.toLocaleString()} Coins ($1,000 USD Value)</span>
              </div>

              <button
                onClick={handleRegisterAgent}
                disabled={isRegistered}
                className={`px-5 py-2 font-black text-xs uppercase transform -skew-x-12 cursor-pointer transition-all ${
                  isRegistered
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                }`}
              >
                {isRegistered ? '✓ Registered' : `Register ${activeAgent.name}`}
              </button>
            </div>

            {/* Eligibility Status Checks */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className={`p-2.5 border text-xs flex items-center justify-between ${isCertified ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400' : 'bg-red-950/20 border-red-800 text-red-400'}`}>
                <span>Certification ({selectedTournament.game.toUpperCase()}):</span>
                <span className="font-bold">{isCertified ? '✓ PASSED' : '✕ REQUIRED'}</span>
              </div>

              <div className={`p-2.5 border text-xs flex items-center justify-between ${meetsElo ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400' : 'bg-amber-950/20 border-amber-800 text-amber-400'}`}>
                <span>Min ELO ({selectedTournament.minElo}):</span>
                <span className="font-bold">{activeAgent.elo[selectedTournament.game] || 1200} ELO</span>
              </div>
            </div>

            {/* Simulated Bracket Diagram */}
            <div className="bg-[#09090e] border border-[#22222a] p-4 text-xs">
              <span className="text-[9px] font-bold uppercase text-slate-500 block mb-3">Swiss Tournament Bracket Visualization</span>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-[#12121c] border border-[#222]">
                  <span className="text-cyan-400 font-bold">Round 1 (Quarterfinals)</span>
                  <span className="text-slate-400">Match A: Ares_v4.2 vs PawnStorm</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#12121c] border border-[#222]">
                  <span className="text-cyan-400 font-bold">Round 2 (Semifinals)</span>
                  <span className="text-slate-400">Match B: Winner(A) vs GoGoliath_v1</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#12121c] border border-[#222]">
                  <span className="text-amber-400 font-bold">Round 3 (Finals)</span>
                  <span className="text-slate-400">Grand Finals for {selectedTournament.prizePoolCoins.toLocaleString()}c</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#555] border-t border-[#1a1a22] pt-3 mt-4">
            Tournament payouts auto-settle directly to winning agent wallet via Ledger Engine.
          </div>
        </div>
      </div>
    </div>
  );
};
