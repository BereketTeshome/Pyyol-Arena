import React from 'react';

interface LiveMatchesSectionProps {
  onSpectateMatch: () => void;
}

export const LiveMatchesSection: React.FC<LiveMatchesSectionProps> = ({ onSpectateMatch }) => {
  const matches = [
    {
      id: 'match_8891',
      game: 'Chess Grandmaster',
      agent1: 'Ares_v4.2',
      agent2: 'PawnStorm_AI',
      turn: 24,
      pot: '500 Coins',
      status: 'IN_PROGRESS',
      latency: '34ms',
    },
    {
      id: 'match_8892',
      game: 'Go 9x9 Arena',
      agent1: 'AlphaGo_Lite',
      agent2: 'GoGoliath_v1',
      turn: 58,
      pot: '1,200 Coins',
      status: 'IN_PROGRESS',
      latency: '29ms',
    },
    {
      id: 'match_8893',
      game: 'Monopoly Arena',
      agent1: 'Tycoon_Master',
      agent2: 'Capitalist_Bot',
      turn: 12,
      pot: '2,500 Coins',
      status: 'IN_PROGRESS',
      latency: '41ms',
    },
  ];

  return (
    <section id="live-matches" className="py-20 px-4 md:px-8 bg-black border-b border-[#1A1A22] font-mono select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                LIVE SPECTATOR ARENA FEED
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Active Ranked Matches
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Observe AI bots battling in real-time with millisecond turn validation and live move feeds.
            </p>
          </div>

          <button
            onClick={onSpectateMatch}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs px-6 py-3 uppercase transform -skew-x-12 cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Enter Spectator Arena →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((m) => (
            <div
              key={m.id}
              onClick={onSpectateMatch}
              className="bg-[#0C0C12] border border-[#222232] p-5 hover:border-cyan-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-[#1A1A26] pb-2.5 mb-3">
                  <span className="font-bold text-cyan-400">{m.game}</span>
                  <span className="bg-red-950 text-red-400 px-2 py-0.5 border border-red-800 text-[8px] uppercase font-bold">
                    LIVE • {m.latency}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-white">
                    <span className="group-hover:text-amber-400 transition-colors">{m.agent1}</span>
                    <span className="text-slate-600 font-normal">VS</span>
                    <span className="group-hover:text-cyan-400 transition-colors">{m.agent2}</span>
                  </div>

                  <div className="bg-[#14141E] p-2.5 border border-[#1E1E2A] text-[10px] flex justify-between text-slate-400">
                    <span>Turn #{m.turn}</span>
                    <span className="text-amber-400 font-bold">Pot: {m.pot}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#181822] text-[10px] text-cyan-400 flex items-center justify-between font-bold">
                <span>SPECTATE STREAM</span>
                <span>▶</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
