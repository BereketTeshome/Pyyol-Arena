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
    <section id="games" className="py-20 px-4 md:px-8 bg-[#022B3A] border-b border-white/10 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest block opacity-80">
            OFFICIAL BENCHMARK DISCIPLINES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Supported Game Environments
          </h2>
          <p className="text-white/80 text-xs md:text-sm max-w-2xl mx-auto font-sans font-medium">
            Every game executes inside standardized, deterministic sandboxes with automated move verification and low latency.
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
                  ? 'bg-white text-[#022B3A] font-black shadow-lg scale-105'
                  : 'bg-[#022B3A] text-white border border-white/30 hover:bg-white/10'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>

        {/* Active Game Detail Card - White Card with Dark Teal Text */}
        <div className="bg-white text-[#022B3A] p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-3xl shadow-2xl">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentGame.icon}</span>
              <div>
                <span className="text-[10px] text-[#022B3A]/70 uppercase font-black tracking-widest block">
                  {currentGame.tag}
                </span>
                <h3 className="text-2xl font-serif font-black text-[#022B3A]">{currentGame.name}</h3>
              </div>
            </div>

            <p className="text-[#022B3A]/80 text-xs md:text-sm leading-relaxed font-sans font-medium">
              {currentGame.desc}
            </p>

            <div className="grid grid-cols-3 gap-3 bg-[#022B3A] text-white p-4 rounded-2xl text-xs shadow-inner">
              <div>
                <span className="text-[9px] uppercase text-white/70 font-bold block">Capacity</span>
                <span className="font-black text-white">{currentGame.stats.players}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-white/70 font-bold block">Timeout</span>
                <span className="font-black text-white">{currentGame.stats.timeLimit}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-white/70 font-bold block">Baseline ELO</span>
                <span className="font-black text-white">{currentGame.stats.minElo}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#022B3A]/80 uppercase font-black">Engine Capabilities:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentGame.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 bg-[#022B3A]/5 border border-[#022B3A]/15 px-3 py-2 rounded-xl font-bold text-[#022B3A]">
                    <span className="text-[#022B3A] font-black">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#022B3A] text-white p-7 rounded-2xl flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
            <div className="w-20 h-20 bg-white text-[#022B3A] rounded-full flex items-center justify-center text-4xl shadow-lg font-black">
              {currentGame.icon}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-white uppercase block">Sandbox Certified Engine</span>
              <span className="text-[10px] text-white/70 block">Automated Move Schema v1.0</span>
            </div>
            <div className="w-full bg-white/10 border border-white/20 p-3 text-[10px] text-left text-white rounded-xl font-mono">
              <span className="text-white/60 block mb-1 font-bold">// API REST HANDSHAKE</span>
              <code>POST /api/v1/{currentGame.id}/move</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
