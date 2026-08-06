import React, { useState } from 'react';
import { Agent, Tournament, DomainEvent, GameType } from '../types/arena';
import {
  Trophy,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Swords,
  Play,
  Key,
  Terminal,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Cpu,
} from 'lucide-react';

interface DashboardViewProps {
  activeAgent: Agent;
  tournaments: Tournament[];
  domainEvents: DomainEvent[];
  onOpenSandbox: (game: GameType) => void;
  onOpenArena: () => void;
  onOpenManifest: () => void;
  onOpenTournaments: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeAgent,
  tournaments,
  domainEvents,
  onOpenSandbox,
  onOpenArena,
  onOpenManifest,
  onOpenTournaments,
}) => {
  const [selectedPipelineGame, setSelectedPipelineGame] = useState<GameType>(
    activeAgent.certifiedGames[0] || activeAgent.supportedGames[0] || 'chess'
  );

  const isCertifiedForGame = activeAgent.certifiedGames.includes(selectedPipelineGame);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 gap-6 font-sans bg-gradient-to-br from-[#061d28] via-[#0b384d] to-[#04151f] text-white select-none">
      {/* Active Agent Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/15 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-serif flex items-center gap-2.5">
              <Cpu className="w-8 h-8 text-cyan-300" />
              <span>{activeAgent.name}</span>
            </h1>
            <span className="px-3 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold rounded-full font-mono uppercase tracking-wider backdrop-blur-md">
              {activeAgent.certifiedGames.length > 0
                ? `CERTIFIED: ${activeAgent.certifiedGames.join(', ').toUpperCase()}`
                : 'UNCERTIFIED (REQUIRES SANDBOX PASS)'}
            </span>
            <span className="px-3 py-1 bg-teal-900/40 text-teal-200 border border-teal-500/30 text-[10px] font-mono rounded-full">
              v{activeAgent.version} ({activeAgent.modelName})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span>Endpoint: {activeAgent.endpointUrl}</span>
            <button
              onClick={onOpenManifest}
              className="text-cyan-300 hover:text-white underline text-[10px] uppercase font-bold cursor-pointer flex items-center gap-1"
            >
              <Key className="w-3 h-3" />
              <span>[View Manifest & Keys]</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={onOpenArena}
            className="bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-xs px-6 py-3 rounded-full cursor-pointer shadow-md transition-all uppercase flex items-center gap-2"
          >
            <Swords className="w-4 h-4 text-teal-700" />
            <span>Enter Ranked Play</span>
          </button>
          <button
            onClick={() => onOpenSandbox(selectedPipelineGame)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs px-6 py-3 rounded-full cursor-pointer backdrop-blur-xl shadow-lg transition-all uppercase flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-cyan-300" />
            <span>Run Sandbox</span>
          </button>
        </div>
      </div>

      {/* Core Agent Metrics - Dark Teal Glass Cards */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-l-4 border-cyan-400 pl-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            Core Agent Metrics
          </span>
          <span className="text-xs text-slate-300 font-mono">
            Game Mode: <strong className="text-cyan-300 uppercase">{selectedPipelineGame}</strong>
          </span>
        </div>

        {/* 1. FRONT STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ELO */}
          <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 backdrop-blur-xl p-5 rounded-3xl shadow-xl transition-all flex flex-col justify-between group hover:border-cyan-400/60">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-300">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Current ELO
              </span>
              <span className="px-2.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 rounded-full text-[10px] font-mono font-bold">
                {selectedPipelineGame.toUpperCase()}
              </span>
            </div>
            <div className="text-4xl font-mono font-bold text-cyan-300 tracking-tight my-3">
              {activeAgent.elo[selectedPipelineGame] || 1200}
            </div>
            <div className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 w-fit flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>+14 rating since last match</span>
            </div>
          </div>

          {/* WIN RATE */}
          <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 backdrop-blur-xl p-5 rounded-3xl shadow-xl transition-all flex flex-col justify-between group hover:border-cyan-400/60">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-300">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Win Rate
              </span>
              <span className="px-2.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 rounded-full text-[10px] font-mono font-bold">
                ALL TIME
              </span>
            </div>
            <div className="text-4xl font-mono font-bold text-white tracking-tight my-3">
              {Math.round((activeAgent.wins / (activeAgent.totalMatches || 1)) * 1000) / 10}%
            </div>
            <div className="text-[10px] text-slate-300 font-mono font-medium">
              {activeAgent.wins}W - {activeAgent.losses}L - {activeAgent.draws}D
            </div>
          </div>

          {/* MATCHES PLAYED */}
          <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 backdrop-blur-xl p-5 rounded-3xl shadow-xl transition-all flex flex-col justify-between group hover:border-cyan-400/60">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-300">
              <span className="flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-teal-400" />
                Matches Played
              </span>
              <span className="px-2.5 py-0.5 bg-teal-950/80 text-teal-300 border border-teal-500/40 rounded-full text-[10px] font-mono font-bold">
                SEASON 4
              </span>
            </div>
            <div className="text-4xl font-mono font-bold text-white tracking-tight my-3">
              {activeAgent.totalMatches}
            </div>
            <div className="text-[10px] text-teal-300 font-mono font-bold">
              Ranked Tournament Ready
            </div>
          </div>

          {/* PLATFORM STATUS */}
          <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 backdrop-blur-xl p-5 rounded-3xl shadow-xl transition-all flex flex-col justify-between group hover:border-cyan-400/60">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Platform Status
              </span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </div>
            <div className="text-3xl font-mono font-bold text-emerald-400 uppercase tracking-tight my-3">
              {activeAgent.status}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              Key: {activeAgent.apiKey.slice(0, 12)}...
            </div>
          </div>
        </div>

        {/* 2. CERTIFICATION PIPELINE STATUS PANEL */}
        <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 p-6 rounded-3xl text-white backdrop-blur-2xl shadow-xl relative overflow-hidden flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                Certification Pipeline Status
              </span>
              <div className="flex gap-1.5">
                {activeAgent.supportedGames.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedPipelineGame(g)}
                    className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full cursor-pointer font-mono transition-all ${
                      selectedPipelineGame === g
                        ? 'bg-cyan-400 text-[#071321] font-bold shadow-md'
                        : 'bg-[#03111c] text-slate-300 border border-white/15 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
              isCertifiedForGame
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              {isCertifiedForGame ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CERTIFIED - ACTIVE</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>UNCERTIFIED - RUN SANDBOX PASS</span>
                </>
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-1 font-mono">
            <div className="bg-[#03111c]/90 border border-cyan-500/20 p-4 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <div className="w-8 h-8 rounded-full border border-teal-400 flex items-center justify-center bg-teal-500/20 text-teal-300 font-bold text-xs shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] uppercase font-bold text-white">1. Handshake</span>
              <span className="text-[10px] text-emerald-400 font-bold">200 OK</span>
            </div>

            <div className="bg-[#03111c]/90 border border-cyan-500/20 p-4 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                isCertifiedForGame ? 'bg-teal-500/20 text-emerald-400 border border-teal-400 shadow-sm' : 'bg-white/5 text-slate-400 border border-white/10'
              }`}>
                {isCertifiedForGame ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-[10px] uppercase font-bold text-white">2. Legal Engine</span>
              <span className="text-[10px] text-slate-300">0 Invalid</span>
            </div>

            <div className="bg-[#03111c]/90 border border-cyan-500/20 p-4 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                isCertifiedForGame ? 'bg-teal-500/20 text-emerald-400 border border-teal-400 shadow-sm' : 'bg-white/5 text-slate-400 border border-white/10'
              }`}>
                {isCertifiedForGame ? <CheckCircle2 className="w-4 h-4" /> : '3'}
              </div>
              <span className="text-[10px] uppercase font-bold text-white">3. Both Sides</span>
              <span className="text-[10px] text-slate-300">2 Matches</span>
            </div>

            <div className="bg-[#03111c]/90 border border-cyan-500/20 p-4 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                isCertifiedForGame ? 'bg-teal-500/20 text-emerald-400 border border-teal-400 shadow-sm' : 'bg-white/5 text-slate-400 border border-white/10'
              }`}>
                {isCertifiedForGame ? <CheckCircle2 className="w-4 h-4" /> : '4'}
              </div>
              <span className="text-[10px] uppercase font-bold text-white">4. Latency</span>
              <span className="text-[10px] text-slate-300">&lt; 350ms</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-400 border-t border-white/10 pt-3">
            <span>SSRF Hardened: Enabled</span>
            <span>AES-256 Token Seal: ACTIVE</span>
            <button
              onClick={() => onOpenSandbox(selectedPipelineGame)}
              className="text-cyan-300 hover:text-white underline font-bold uppercase cursor-pointer flex items-center gap-1"
            >
              <span>Test in Sandbox</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Area: Agent Performance Analytics & Upcoming Tournaments */}
      <div className="grid grid-cols-12 gap-4">
        {/* Useful Developer Performance & Decision Analytics */}
        <div className="col-span-12 md:col-span-8 flex flex-col bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-xl text-white">
          <div className="bg-[#03111c] px-5 py-3 border-b border-cyan-500/20 flex justify-between items-center select-none">
            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-300" />
              Agent Performance & Decision Analytics
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              HEALTH: 100% OPERATIONAL
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Key Quality Indicators */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-[#03111c]/90 p-3 rounded-2xl border border-white/10">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Avg Decision Speed</div>
                <div className="text-xl font-bold text-cyan-300 mt-1">42ms</div>
                <div className="text-[8px] text-emerald-400 mt-0.5">Below 350ms budget</div>
              </div>
              <div className="bg-[#03111c]/90 p-3 rounded-2xl border border-white/10">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Move Legality Rate</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">100%</div>
                <div className="text-[8px] text-slate-400 mt-0.5">0 Engine Rejections</div>
              </div>
              <div className="bg-[#03111c]/90 p-3 rounded-2xl border border-white/10">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Timeout Rate</div>
                <div className="text-xl font-bold text-white mt-1">0.0%</div>
                <div className="text-[8px] text-teal-300 mt-0.5">Optimal Async Loop</div>
              </div>
            </div>

            {/* Recent Match Decision Summary */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold font-mono text-slate-300 tracking-wider block">
                Recent Ranked Match Evaluations
              </span>
              <div className="space-y-2 font-mono text-xs">
                <div className="bg-[#03111c]/80 p-3 rounded-xl border border-cyan-500/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-white">VICTORY vs PawnStorm</span>
                    <span className="text-[10px] text-slate-400">({selectedPipelineGame.toUpperCase()})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      +18 ELO
                    </span>
                    <span className="text-[10px] text-slate-400">42 moves • Avg 38ms</span>
                  </div>
                </div>

                <div className="bg-[#03111c]/80 p-3 rounded-xl border border-cyan-500/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-white">VICTORY vs GoGoliath_v1</span>
                    <span className="text-[10px] text-slate-400">(GO 9x9)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      +22 ELO
                    </span>
                    <span className="text-[10px] text-slate-400">64 turns • Avg 48ms</span>
                  </div>
                </div>

                <div className="bg-[#03111c]/80 p-3 rounded-xl border border-cyan-500/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="font-bold text-white">DRAW vs Checkmate_X</span>
                    <span className="text-[10px] text-slate-400">({selectedPipelineGame.toUpperCase()})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      +0 ELO
                    </span>
                    <span className="text-[10px] text-slate-400">58 moves • Avg 31ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div className="col-span-12 md:col-span-4 flex flex-col bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-xl text-white">
          <div className="bg-[#03111c] px-5 py-3 border-b border-cyan-500/20 flex justify-between items-center">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-cyan-300" />
              Upcoming Tournaments
            </span>
            <span className="text-[10px] text-cyan-300 font-mono font-bold">Freerolls</span>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {tournaments.slice(0, 2).map((tourn) => (
              <div key={tourn.id} className="border-l-4 border-cyan-400 pl-3 py-2 bg-[#03111c]/80 rounded-r-2xl border border-cyan-500/20">
                <div className="text-xs font-bold text-white uppercase">{tourn.title}</div>
                <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                  Game: {tourn.game.toUpperCase()} | Prize: {tourn.prizePoolCoins.toLocaleString()} c
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[9px] bg-cyan-950/80 text-cyan-300 px-2.5 py-0.5 font-mono uppercase rounded-full font-bold border border-cyan-500/40">
                    STARTS SOON
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Min ELO {tourn.minElo}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10">
            <button
              onClick={onOpenTournaments}
              className="w-full text-center text-[10px] uppercase font-bold text-[#071321] bg-[#e2ebf3] hover:bg-[#d0dfed] py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
            >
              <span>View All Tournaments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

