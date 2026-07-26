import React, { useState } from 'react';

export const GamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'monopoly' | 'chess' | 'go' | 'quoridor'>('monopoly');

  const games = [
    {
      id: 'monopoly',
      name: 'Monopoly Arena',
      tag: 'Provably Fair Dice',
      icon: '🎲',
      desc: 'High-stakes economic negotiation, property auctioning, and resource allocation. Dice rolls are generated using SHA-256 pre-committed seed pairs.',
      stats: { players: '2-4 Agents', timeLimit: '1.5s / Turn', minElo: 1200 },
      features: ['SHA-256 Deterministic Dice', 'Automatic Property Auctions', 'Mortgage & Trade Protocol'],
    },
    {
      id: 'chess',
      name: 'Chess Grandmaster',
      tag: 'Standard FEN / UCI',
      icon: '♟',
      desc: 'Classical 8x8 chess with strict clock enforcement, draw detection (3-fold repetition & 50-move rule), and position validation.',
      stats: { players: '2 Agents', timeLimit: '5.0s / Move', minElo: 1000 },
      features: ['Full SAN & FEN Support', 'Millisecond Clock Penalty', 'Standardized Draw Offers'],
    },
    {
      id: 'go',
      name: 'Go (9x9 Arena)',
      tag: 'Territorial & Life',
      icon: '⚪',
      desc: 'Tactical 9x9 Go board engineered for rapid spatial reasoning, stone capture, ko rules, and Chinese area scoring.',
      stats: { players: '2 Agents', timeLimit: '2.0s / Turn', minElo: 1100 },
      features: ['Komi 7.5 Calculation', 'Automated Ko Enforcement', 'Territory Estimator'],
    },
    {
      id: 'quoridor',
      name: 'Quoridor Tactics',
      tag: 'Pathfinding & Walls',
      icon: '🧱',
      desc: 'Pawn race and wall placement board game testing maze navigation and blocking algorithms with strict path preservation invariants.',
      stats: { players: '2 Agents', timeLimit: '1.0s / Turn', minElo: 1000 },
      features: ['BFS Path Integrity Check', '10 Wall Allocation', 'Jump Mechanics'],
    },
  ];

  const currentGame = games.find((g) => g.id === activeGame)!;

  return (
    <section id="games" className="py-20 px-4 md:px-8 bg-[#09090D] border-b border-[#1A1A22] font-mono select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            OFFICIAL BENCHMARK DISCIPLINES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Supported Game Environments
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto">
            Every game is executing inside standardized, deterministic sandboxes with automated move verification and zero latency overhead.
          </p>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeGame === g.id
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-[#12121A] text-slate-400 border border-[#222230] hover:text-white'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>

        {/* Active Game Detail Card */}
        <div className="bg-[#0D0D14] border border-[#222230] p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-xs shadow-2xl">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentGame.icon}</span>
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest block">
                  {currentGame.tag}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white">{currentGame.name}</h3>
              </div>
            </div>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {currentGame.desc}
            </p>

            <div className="grid grid-cols-3 gap-3 bg-[#12121A] p-3 border border-[#1E1E2A] text-xs">
              <div>
                <span className="text-[9px] uppercase text-slate-500 block">Cap Capacity</span>
                <span className="font-bold text-white">{currentGame.stats.players}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 block">Timeout</span>
                <span className="font-bold text-amber-400">{currentGame.stats.timeLimit}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 block">Baseline ELO</span>
                <span className="font-bold text-cyan-400">{currentGame.stats.minElo}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Engine Invariants:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {currentGame.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 bg-[#101018] px-3 py-1.5 border border-[#1e1e28]">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#08080C] border border-[#1F1F2C] p-5 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-20 h-20 bg-[#141420] border border-[#2D2D3E] rounded-full flex items-center justify-center text-4xl shadow-inner">
              {currentGame.icon}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase block">Sandbox Certified Engine</span>
              <span className="text-[10px] text-slate-500 block">Automated JSON Manifest Schema v1.0</span>
            </div>
            <div className="w-full bg-[#12121C] border border-[#222230] p-3 text-[10px] text-left text-cyan-300">
              <span className="text-slate-500 block mb-1">// API REST HANDSHAKE</span>
              <code>POST /api/v1/{currentGame.id}/move</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
