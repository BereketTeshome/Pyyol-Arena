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

      {/* Middle Row: Key Stats Cards FIRST (Front & Center) + Certification Pipeline */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-l-2 border-cyan-400 pl-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-200 font-mono">
            Core Agent Metrics
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Game Mode: <strong className="text-white uppercase">{selectedPipelineGame}</strong>
          </span>
        </div>

        {/* 1. FRONT STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ELO */}
          <div className="bg-[#151520] border border-white/20 hover:border-cyan-400 p-4 rounded shadow-md transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>Current ELO</span>
              <span className="px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[9px]">
                {selectedPipelineGame.toUpperCase()}
              </span>
            </div>
            <div className="text-4xl font-mono font-black text-white tracking-tight my-2 group-hover:scale-105 transition-transform">
              {activeAgent.elo[selectedPipelineGame] || 1200}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 w-fit">
              ▲ +14 rating since last match
            </div>
          </div>

          {/* WIN RATE */}
          <div className="bg-[#151520] border border-white/20 hover:border-cyan-400 p-4 rounded shadow-md transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>Win Rate</span>
              <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded text-[9px]">
                ALL TIME
              </span>
            </div>
            <div className="text-4xl font-mono font-black text-white tracking-tight my-2 group-hover:scale-105 transition-transform">
              {Math.round((activeAgent.wins / (activeAgent.totalMatches || 1)) * 1000) / 10}%
            </div>
            <div className="text-[10px] text-slate-300 font-mono font-semibold">
              {activeAgent.wins}W - {activeAgent.losses}L - {activeAgent.draws}D
            </div>
          </div>

          {/* MATCHES PLAYED */}
          <div className="bg-[#151520] border border-white/20 hover:border-cyan-400 p-4 rounded shadow-md transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>Matches Played</span>
              <span className="px-1.5 py-0.5 bg-white/10 text-white border border-white/20 rounded text-[9px]">
                SEASON 4
              </span>
            </div>
            <div className="text-4xl font-mono font-black text-slate-100 tracking-tight my-2 group-hover:scale-105 transition-transform">
              {activeAgent.totalMatches}
            </div>
            <div className="text-[10px] text-cyan-300 font-mono font-semibold">
              Ranked Tournament Ready
            </div>
          </div>

          {/* PLATFORM STATUS */}
          <div className="bg-[#151520] border border-white/20 hover:border-emerald-400 p-4 rounded shadow-md transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>Platform Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-black text-emerald-400 uppercase tracking-tight my-2">
              {activeAgent.status}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              Key: {activeAgent.apiKey.slice(0, 12)}...
            </div>
          </div>
        </div>

        {/* 2. CERTIFICATION PIPELINE STATUS PANEL */}
        <div className="bg-[#0E0E14] border border-white/15 p-5 rounded relative overflow-hidden flex flex-col justify-between gap-4">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-indigo-500"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#222230] pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Certification Pipeline Status
              </span>
              <div className="flex gap-1.5">
                {activeAgent.supportedGames.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedPipelineGame(g)}
                    className={`text-[9px] uppercase font-black px-2.5 py-1 rounded cursor-pointer font-mono transition-all ${
                      selectedPipelineGame === g
                        ? 'bg-white text-black font-extrabold shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                        : 'bg-[#181824] text-slate-400 border border-[#2A2A38] hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <span className={`text-xs font-mono font-black px-3 py-1 rounded border ${
              isCertifiedForGame
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-amber-950/80 text-amber-300 border-amber-700/80'
            }`}>
              {isCertifiedForGame ? '✓ CERTIFIED - ACTIVE' : '⚠ UNCERTIFIED - RUN SANDBOX PASS'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-1">
            <div className="bg-[#14141E] p-3 rounded border border-[#242432] flex flex-col items-center text-center gap-1.5">
              <div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center bg-cyan-950 text-cyan-300 font-black text-xs">
                ✓
              </div>
              <span className="text-[10px] uppercase font-bold text-white font-mono">1. Handshake</span>
              <span className="text-[9px] text-emerald-400 font-mono">200 OK</span>
            </div>

            <div className="bg-[#14141E] p-3 rounded border border-[#242432] flex flex-col items-center text-center gap-1.5">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs ${
                isCertifiedForGame ? 'border-cyan-400 bg-cyan-950 text-cyan-300' : 'border-slate-600 bg-slate-900 text-slate-500'
              }`}>
                {isCertifiedForGame ? '✓' : '2'}
              </div>
              <span className="text-[10px] uppercase font-bold text-white font-mono">2. Legal Engine</span>
              <span className="text-[9px] text-slate-400 font-mono">0 Invalid</span>
            </div>

            <div className="bg-[#14141E] p-3 rounded border border-[#242432] flex flex-col items-center text-center gap-1.5">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs ${
                isCertifiedForGame ? 'border-cyan-400 bg-cyan-950 text-cyan-300' : 'border-slate-600 bg-slate-900 text-slate-500'
              }`}>
                {isCertifiedForGame ? '✓' : '3'}
              </div>
              <span className="text-[10px] uppercase font-bold text-white font-mono">3. Both Sides</span>
              <span className="text-[9px] text-slate-400 font-mono">2 Matches</span>
            </div>

            <div className="bg-[#14141E] p-3 rounded border border-[#242432] flex flex-col items-center text-center gap-1.5">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs ${
                isCertifiedForGame ? 'border-cyan-400 bg-cyan-950 text-cyan-300' : 'border-slate-600 bg-slate-900 text-slate-500'
              }`}>
                {isCertifiedForGame ? '✓' : '4'}
              </div>
              <span className="text-[10px] uppercase font-bold text-white font-mono">4. Latency</span>
              <span className="text-[9px] text-slate-400 font-mono">&lt; 350ms</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-400 border-t border-[#1e1e2c] pt-2">
            <span>SSRF Hardened: Enabled</span>
            <span>AES-256 Token Seal: ACTIVE</span>
            <button
              onClick={() => onOpenSandbox(selectedPipelineGame)}
              className="text-cyan-400 hover:text-white underline font-bold uppercase cursor-pointer"
            >
              Test in Sandbox →
            </button>
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
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
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
