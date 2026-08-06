import React, { useState } from 'react';
import { Tournament, Agent, GameType } from '../types/arena';
import { Trophy, Plus, ShieldCheck, UserCheck, Users, Gamepad2, Coins, Calendar, X } from 'lucide-react';

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
  const [tournamentsList, setTournamentsList] = useState<Tournament[]>(tournaments);
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(tournaments[0] || tournamentsList[0]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Tournament Form State
  const [title, setTitle] = useState('');
  const [game, setGame] = useState<GameType>('monopoly');
  const [prizePool, setPrizePool] = useState<number>(50000);
  const [sponsorName, setSponsorName] = useState('Cogix Arena DAO');
  const [creatorHandle, setCreatorHandle] = useState('@beki (Tournament Host Pass)');
  const [minElo, setMinElo] = useState<number>(1400);
  const [maxParticipants, setMaxParticipants] = useState<number>(16);
  const [playersPerMatch, setPlayersPerMatch] = useState<number>(4);

  const isRegistered = selectedTournament?.registeredAgentIds.includes(activeAgent.id);
  const isCertified = activeAgent.certifiedGames.includes(selectedTournament?.game);
  const meetsElo = (activeAgent.elo[selectedTournament?.game] || 1200) >= (selectedTournament?.minElo || 0);

  const handleRegisterAgent = () => {
    if (!selectedTournament) return;
    if (!isCertified) {
      alert(`Agent must pass Sandbox Certification for "${selectedTournament.game.toUpperCase()}" first.`);
      return;
    }
    if (!meetsElo) {
      alert(`Agent ELO (${activeAgent.elo[selectedTournament.game] || 1200}) does not meet tournament minimum (${selectedTournament.minElo}).`);
      return;
    }

    const updated = {
      ...selectedTournament,
      registeredAgentIds: [...selectedTournament.registeredAgentIds, activeAgent.id],
    };

    setTournamentsList(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTournament(updated);
    alert(`Successfully registered ${activeAgent.name} for ${selectedTournament.title}!`);
  };

  const handleGameChange = (newGame: GameType) => {
    setGame(newGame);
    if (newGame === 'chess' || newGame === 'go') {
      setPlayersPerMatch(2);
    } else if (newGame === 'quoridor') {
      setPlayersPerMatch(4);
    } else if (newGame === 'monopoly') {
      setPlayersPerMatch(4);
    }
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTourn: Tournament = {
      id: 'tourn_' + Date.now().toString().slice(-5),
      title: title.toUpperCase(),
      game,
      prizePoolCoins: prizePool,
      sponsorName: sponsorName || 'Cogix Sponsor',
      createdBy: creatorHandle || 'Admin (Cogix)',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      status: 'UPCOMING',
      minElo,
      registeredAgentIds: [],
      maxParticipants,
      maxPlayersPerMatch: playersPerMatch,
    };

    setTournamentsList([newTourn, ...tournamentsList]);
    setSelectedTournament(newTourn);
    setShowCreateModal(false);
    setTitle('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 gap-6 font-sans bg-gradient-to-br from-[#061d28] via-[#0b384d] to-[#04151f] text-white select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/15 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono">
              COGIX OFFICIAL & HOST PASS CIRCUITS
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Tournament Circuit
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans mt-1">
            Browse active cups or host your own multi-player tournament across Chess, Go, Quoridor, and Monopoly.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-[#071321] font-bold text-xs px-6 py-3 rounded-full cursor-pointer transition-all shadow-lg flex items-center gap-2 uppercase tracking-wide shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Host Tournament</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Tournament List */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-1 mb-1">
            <span>ACTIVE CIRCUITS ({tournamentsList.length})</span>
            <span>FILTER BY GAME</span>
          </div>

          {tournamentsList.map((t) => {
            const isSelected = selectedTournament && t.id === selectedTournament.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTournament(t)}
                className={`p-5 border rounded-2xl cursor-pointer transition-all backdrop-blur-xl relative space-y-3 ${
                  isSelected
                    ? 'bg-[#0E2133]/95 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                    : 'bg-[#0A1827]/80 border-white/15 hover:bg-[#0E2034]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-white tracking-wide">{t.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-cyan-300 font-mono mt-0.5">
                      <span>Sponsor: {t.sponsorName}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold rounded-full">
                    {t.prizePoolCoins.toLocaleString()} c
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-300 pt-2 border-t border-white/10">
                  <span className="bg-white/10 px-2.5 py-1 rounded-md text-white font-bold">
                    🎮 {t.game.toUpperCase()} ({t.maxPlayersPerMatch || (t.game === 'monopoly' || t.game === 'quoridor' ? 4 : 2)}P)
                  </span>
                  <span className="text-slate-400">Host: <strong className="text-slate-200">{t.createdBy || 'Admin (Cogix)'}</strong></span>
                  <span className="text-cyan-300 font-bold">{t.registeredAgentIds.length} / {t.maxParticipants} Bots</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tournament Detail View */}
        {selectedTournament && (
          <div className="col-span-12 lg:col-span-7 bg-[#0A1827]/90 border border-white/15 p-6 md:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-cyan-400 font-mono mb-1">
                    <span>TOURNAMENT SPECIFICATION</span>
                    <span>•</span>
                    <span className="text-slate-400">Created by {selectedTournament.createdBy || 'Admin (Cogix)'}</span>
                  </div>
                  <h2 className="text-2xl font-bold uppercase text-white tracking-tight font-serif">
                    {selectedTournament.title}
                  </h2>
                  <span className="text-xs text-slate-300 font-mono">
                    Prize Pool: <strong>{selectedTournament.prizePoolCoins.toLocaleString()} Coins</strong> (${(selectedTournament.prizePoolCoins * 0.01).toFixed(2)} USD)
                  </span>
                </div>

                <button
                  onClick={handleRegisterAgent}
                  disabled={isRegistered}
                  className={`px-6 py-3 font-bold text-xs uppercase cursor-pointer rounded-full transition-all shrink-0 ${
                    isRegistered
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 cursor-default font-mono'
                      : 'bg-white hover:bg-slate-100 text-[#071321] shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  {isRegistered ? '✓ Bot Registered' : `Register ${activeAgent.name}`}
                </button>
              </div>

              {/* Tournament Config Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#050D17] border border-white/10 rounded-2xl space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Game & Format</span>
                  <span className="text-white font-bold block uppercase">{selectedTournament.game} ({selectedTournament.maxPlayersPerMatch || (selectedTournament.game === 'monopoly' ? 4 : 2)} Players / Match)</span>
                </div>

                <div className="p-3 bg-[#050D17] border border-white/10 rounded-2xl space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Organizer / Host</span>
                  <span className="text-cyan-300 font-bold block truncate">{selectedTournament.createdBy || 'Admin (Cogix)'}</span>
                </div>

                <div className="p-3 bg-[#050D17] border border-white/10 rounded-2xl space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Min ELO Required</span>
                  <span className="text-amber-300 font-bold block">{selectedTournament.minElo} ELO</span>
                </div>
              </div>

              {/* Eligibility Checks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className={`p-3 border rounded-2xl text-xs flex items-center justify-between ${isCertified ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-red-950/30 border-red-500/40 text-red-400'}`}>
                  <span>Certification ({selectedTournament.game.toUpperCase()}):</span>
                  <span className="font-bold">{isCertified ? '✓ PASSED' : '✕ REQUIRED'}</span>
                </div>

                <div className={`p-3 border rounded-2xl text-xs flex items-center justify-between ${meetsElo ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/30 border-amber-500/40 text-amber-300'}`}>
                  <span>Min ELO ({selectedTournament.minElo}):</span>
                  <span className="font-bold">{activeAgent.elo[selectedTournament.game] || 1200} ELO</span>
                </div>
              </div>

              {/* Bracket / Match Queue Diagram */}
              <div className="bg-[#050D17] border border-white/10 p-4 rounded-2xl text-xs font-mono space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
                  Tournament Match Bracket & Lobby Structure
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-[#0A1827] rounded-xl border border-white/5">
                    <span className="text-cyan-300 font-bold">Stage 1: Qualifiers</span>
                    <span className="text-slate-300">
                      {selectedTournament.maxPlayersPerMatch || 2} Bots / Match • Swiss Group Phase
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#0A1827] rounded-xl border border-white/5">
                    <span className="text-cyan-300 font-bold">Stage 2: Semifinals</span>
                    <span className="text-slate-300">Top Seed Elimination Rounds</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#0A1827] rounded-xl border border-white/5">
                    <span className="text-amber-300 font-bold">Grand Finals</span>
                    <span className="text-slate-300">Winner Takes {selectedTournament.prizePoolCoins.toLocaleString()}c Ledger Payout</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-3 font-mono flex justify-between">
              <span>Host Pass Subscription Verified</span>
              <span>All Ledger Payouts Auto-Distributed</span>
            </div>
          </div>
        )}
      </div>

      {/* Host Custom Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0A1827] border border-white/20 w-full max-w-lg p-6 md:p-8 rounded-3xl relative text-slate-200 shadow-2xl backdrop-blur-2xl space-y-6">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold uppercase text-cyan-400 font-mono block mb-1">
                TOURNAMENT PRICING & HOST PASS PERKS
              </span>
              <h2 className="text-xl font-bold uppercase text-white font-serif">
                Create Custom Tournament
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Set up an official tournament with custom player limits, entry stakes, and prize pool.
              </p>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Tournament Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COGIX MONOPOLY MASTERS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050D17] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Game Discipline
                  </label>
                  <select
                    value={game}
                    onChange={(e) => handleGameChange(e.target.value as GameType)}
                    className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="monopoly">Monopoly</option>
                    <option value="chess">Chess</option>
                    <option value="go">Go (9x9)</option>
                    <option value="quoridor">Quoridor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Players per Match
                  </label>
                  {game === 'monopoly' ? (
                    <select
                      value={playersPerMatch}
                      onChange={(e) => setPlayersPerMatch(parseInt(e.target.value))}
                      className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                    >
                      {[2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} Players per match</option>
                      ))}
                    </select>
                  ) : game === 'quoridor' ? (
                    <select
                      value={playersPerMatch}
                      onChange={(e) => setPlayersPerMatch(parseInt(e.target.value))}
                      className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                    >
                      <option value={2}>2 Players (1v1)</option>
                      <option value={4}>4 Players (4-Way Maze)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="2 Players (Fixed 1v1)"
                      className="w-full bg-[#050D17] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-400 font-bold"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Prize Pool (Coins)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={prizePool}
                    onChange={(e) => setPrizePool(parseInt(e.target.value) || 10000)}
                    className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-emerald-300 font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Min ELO Eligibility
                  </label>
                  <input
                    type="number"
                    step={50}
                    value={minElo}
                    onChange={(e) => setMinElo(parseInt(e.target.value) || 1200)}
                    className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Host / Creator Handle
                </label>
                <input
                  type="text"
                  required
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  className="w-full bg-[#050D17] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-[#071321] font-bold uppercase text-xs rounded-full cursor-pointer transition-all shadow-lg mt-2"
              >
                Publish & Launch Tournament Circuit →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
