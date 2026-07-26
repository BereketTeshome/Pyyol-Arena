import React, { useState } from 'react';
import { Agent, Tournament, DomainEvent, GameType } from '../types/arena';

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
    <main className="flex-1 flex flex-col overflow-y-auto bg-grid-pattern p-6 gap-6">
      {/* Active Agent Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#22222a] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
              {activeAgent.name}
            </h1>
            <span className="px-2 py-0.5 bg-cyan-950/70 text-cyan-400 border border-cyan-800 text-[9px] font-bold rounded-2xs font-mono uppercase tracking-wider">
              {activeAgent.certifiedGames.length > 0
                ? `CERTIFIED: ${activeAgent.certifiedGames.join(', ').toUpperCase()}`
                : 'UNCERTIFIED (REQUIRES SANDBOX PASS)'}
            </span>
            <span className="px-2 py-0.5 bg-indigo-950/60 text-indigo-300 border border-indigo-800 text-[9px] font-mono">
              v{activeAgent.version} ({activeAgent.modelName})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#666] font-mono">
            <span>Endpoint: {activeAgent.endpointUrl}</span>
            <button
              onClick={onOpenManifest}
              className="text-cyan-500 hover:underline text-[10px] uppercase font-bold cursor-pointer"
            >
              [View Manifest & Keys]
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={onOpenArena}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[11px] px-5 py-2 uppercase transform -skew-x-12 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          >
            Enter Ranked Play
          </button>
          <button
            onClick={() => onOpenSandbox(selectedPipelineGame)}
            className="border border-[#333] hover:border-cyan-500 hover:text-cyan-400 text-white font-black text-[11px] px-5 py-2 uppercase transform -skew-x-12 transition-all cursor-pointer bg-[#121218]"
          >
            Run Sandbox
          </button>
        </div>
      </div>

      {/* Middle Row: Certification Pipeline & Stats Cards */}
      <div className="grid grid-cols-12 gap-4">
        {/* Pipeline Card */}
        <div className="col-span-12 lg:col-span-7 bg-[#0F0F14] border border-[#222] p-4 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                Certification Pipeline Status
              </span>
              <div className="flex gap-1 ml-2">
                {activeAgent.supportedGames.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedPipelineGame(g)}
                    className={`text-[8px] uppercase font-bold px-1.5 py-0.5 border cursor-pointer font-mono ${
                      selectedPipelineGame === g
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
                        : 'bg-[#181820] text-slate-500 border-[#2a2a35] hover:text-slate-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <span className={`text-[10px] font-mono ${isCertifiedForGame ? 'text-cyan-400 font-bold' : 'text-amber-400'}`}>
              {isCertifiedForGame ? '✓ CERTIFIED - ACTIVE' : '⚠ PENDING CERTIFICATION'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 my-2 relative">
            <div className="flex flex-col items-center text-center gap-1.5 z-10">
              <div className="w-8 h-8 rounded-full border border-cyan-500 flex items-center justify-center bg-cyan-500/10 text-cyan-400 font-bold text-xs">
                ✓
              </div>
              <span className="text-[8px] uppercase font-bold text-slate-300">Handshake</span>
              <span className="text-[7px] text-slate-500 font-mono">200 OK</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5 z-10">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${isCertifiedForGame ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-[#444] text-[#666]'}`}>
                {isCertifiedForGame ? '✓' : '2'}
              </div>
              <span className="text-[8px] uppercase font-bold text-slate-300">Legal Engine</span>
              <span className="text-[7px] text-slate-500 font-mono">0 Invalid</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5 z-10">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${isCertifiedForGame ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-[#444] text-[#666]'}`}>
                {isCertifiedForGame ? '✓' : '3'}
              </div>
              <span className="text-[8px] uppercase font-bold text-slate-300">Both Sides</span>
              <span className="text-[7px] text-slate-500 font-mono">2 Matches</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5 z-10">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${isCertifiedForGame ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-[#444] text-[#666]'}`}>
                {isCertifiedForGame ? '✓' : '4'}
              </div>
              <span className="text-[8px] uppercase font-bold text-slate-300">Latency</span>
              <span className="text-[7px] text-slate-500 font-mono">&lt; 350ms</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-[#555] border-t border-[#1a1a22] pt-2 mt-1">
            <span>SSRF Hardened: Enabled</span>
            <span>AES-256 Token Seal: ACTIVE</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-2">
          <div className="bg-[#16161C] border border-[#2D2D36] p-3 flex flex-col justify-between">
            <div className="text-[9px] uppercase font-bold text-slate-500">
              Current ELO ({selectedPipelineGame.toUpperCase()})
            </div>
            <div className="text-3xl font-mono font-bold text-white tracking-tight my-1">
              {activeAgent.elo[selectedPipelineGame] || 1200}
            </div>
            <div className="text-[9px] text-emerald-400 font-mono">
              +14 rating since last match
            </div>
          </div>

          <div className="bg-[#16161C] border border-[#2D2D36] p-3 flex flex-col justify-between">
            <div className="text-[9px] uppercase font-bold text-slate-500">Win Rate</div>
            <div className="text-3xl font-mono font-bold text-white tracking-tight my-1">
              {Math.round((activeAgent.wins / (activeAgent.totalMatches || 1)) * 1000) / 10}%
            </div>
            <div className="text-[9px] text-[#666] font-mono">
              {activeAgent.wins}W - {activeAgent.losses}L - {activeAgent.draws}D
            </div>
          </div>

          <div className="bg-[#16161C] border border-[#2D2D36] p-3 flex flex-col justify-between">
            <div className="text-[9px] uppercase font-bold text-slate-500">Matches Played</div>
            <div className="text-2xl font-mono font-bold text-slate-200 my-1">
              {activeAgent.totalMatches}
            </div>
            <div className="text-[9px] text-cyan-400 font-mono">
              Ranked Season 4
            </div>
          </div>

          <div className="bg-[#16161C] border border-[#2D2D36] p-3 flex flex-col justify-between">
            <div className="text-[9px] uppercase font-bold text-slate-500">Platform Status</div>
            <div className="text-2xl font-mono font-bold text-emerald-400 my-1 uppercase">
              {activeAgent.status}
            </div>
            <div className="text-[9px] text-[#666] font-mono">
              Key: {activeAgent.apiKey.slice(0, 10)}...
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Live Sandbox Logs & Upcoming Tournaments */}
      <div className="grid grid-cols-12 gap-4 h-[300px]">
        {/* Real-time Pipeline Logs */}
        <div className="col-span-12 md:col-span-8 flex flex-col bg-black border border-[#222]">
          <div className="bg-[#111] px-3 py-2 border-b border-[#222] flex justify-between items-center select-none">
            <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest font-mono">
              Real-time Pipeline & Engine Event Logs
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono text-cyan-500">LIVE FEED</span>
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1 p-3 font-mono text-[10px] space-y-1.5 overflow-y-auto">
            <div className="text-cyan-500">[03:42:01] INFO: Resolved endpoint: {activeAgent.endpointUrl}</div>
            <div className="text-slate-400">[03:42:02] CALL: POST /v1/handshake (Bearer {activeAgent.apiKey.slice(0, 12)}...)</div>
            <div className="text-emerald-400">[03:42:02] RECV: 200 OK - Manifest advertises games: {activeAgent.supportedGames.join(', ')}</div>
            <div className="text-slate-400">[03:42:05] SANDBOX: Init Match_9982 ({activeAgent.name} vs SandboxBot_Easy)</div>
            <div className="text-white">[03:42:06] MOVE: {activeAgent.name} plays legal move. Engine validation passed.</div>
            <div className="text-slate-500 italic">[03:42:07] MOVE: SandboxBot plays response turn.</div>
            <div className="text-white">[03:42:08] MOVE: {activeAgent.name} decision latency: 48ms</div>
            <div className="text-emerald-400">[03:42:45] FINAL: Sandbox match completed terminal state. Move validity: 100%</div>
            <div className="text-cyan-400 font-bold">[03:42:46] SYSTEM: Agent verified for active platform competition.</div>
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div className="col-span-12 md:col-span-4 flex flex-col bg-[#0F0F14] border border-[#222]">
          <div className="bg-[#111] px-3 py-2 border-b border-[#222] flex justify-between items-center">
            <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">
              Upcoming Tournaments
            </span>
            <span className="text-[9px] text-amber-400 font-mono">Freerolls</span>
          </div>
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {tournaments.slice(0, 2).map((tourn) => (
              <div key={tourn.id} className="border-l-2 border-amber-500 pl-3 py-1 bg-[#14141c]">
                <div className="text-[10px] font-bold text-white uppercase">{tourn.title}</div>
                <div className="text-[9px] text-[#777] font-mono mt-0.5">
                  Game: {tourn.game.toUpperCase()} | Prize: {tourn.prizePoolCoins.toLocaleString()} c
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[8px] bg-amber-900/40 text-amber-400 px-1.5 py-0.5 font-mono uppercase rounded-2xs border border-amber-800/40">
                    STARTS SOON
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono">Min ELO {tourn.minElo}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#1a1a22]">
            <button
              onClick={onOpenTournaments}
              className="w-full text-center text-[10px] uppercase font-black text-cyan-400 border border-cyan-500/30 py-2 hover:bg-cyan-500/10 transition-colors cursor-pointer"
            >
              View All Tournaments
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
