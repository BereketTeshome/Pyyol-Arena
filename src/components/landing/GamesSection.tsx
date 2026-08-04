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
    <section id="games" className="py-20 px-4 md:px-8 bg-transparent font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            OFFICIAL BENCHMARK DISCIPLINES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Supported Game Environments
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto font-sans font-medium opacity-90">
            Every game executes inside standardized, deterministic sandboxes with automated move verification and low latency.
          </p>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeGame === g.id
                  ? 'bg-[#e2ebf3] text-[#071321] font-extrabold shadow-md scale-105'
                  : 'bg-[#0D1C2E]/60 text-slate-300 border border-white/15 hover:border-white/30 hover:bg-[#13283E]'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>

        {/* Active Game Detail Card - Dark Glassy Container matching reference image */}
        <div className="bg-gradient-to-b from-[#0E2133]/60 via-[#0A1827]/70 to-[#071321]/80 border border-white/15 p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-[32px] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#091726] border border-white/15 flex items-center justify-center text-2xl shadow-inner">
                {currentGame.icon}
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase font-bold tracking-widest block">
                  {currentGame.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">{currentGame.name}</h3>
              </div>
            </div>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans font-normal opacity-90">
              {currentGame.desc}
            </p>

            <div className="grid grid-cols-3 gap-3 bg-[#050D17]/90 border border-white/10 p-4 rounded-2xl text-xs shadow-inner">
              <div>
                <span className="text-[9px] uppercase text-slate-400 font-bold block mb-1">CAPACITY</span>
                <span className="font-bold text-white text-sm md:text-base">{currentGame.stats.players}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-400 font-bold block mb-1">TIMEOUT</span>
                <span className="font-bold text-white text-sm md:text-base">{currentGame.stats.timeLimit}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-400 font-bold block mb-1">BASELINE ELO</span>
                <span className="font-bold text-white text-sm md:text-base">{currentGame.stats.minElo}</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">ENGINE CAPABILITIES:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentGame.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 bg-[#091726]/80 border border-white/15 px-3.5 py-2.5 rounded-xl font-medium text-xs text-white">
                    <span className="text-slate-300 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#06111D]/90 border border-white/10 text-white p-8 rounded-2xl flex flex-col justify-center items-center text-center space-y-5 shadow-2xl">
            <div className="w-20 h-20 bg-[#0B1828] border border-white/15 text-white rounded-full flex items-center justify-center text-4xl shadow-lg">
              {currentGame.icon}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">SANDBOX CERTIFIED ENGINE</span>
              <span className="text-[10px] text-slate-400 block">Automated Move Schema v1.0</span>
            </div>
            <div className="w-full bg-[#03080F] border border-white/10 p-4 text-xs text-left text-white rounded-xl font-mono space-y-1">
              <span className="text-slate-500 font-bold text-[10px] block">// API REST HANDSHAKE</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">POST</span>
                <span className="text-slate-200">/api/v1/{currentGame.id}/move</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
