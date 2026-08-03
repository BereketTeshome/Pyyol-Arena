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
    <section id="live-matches" className="py-20 px-4 md:px-8 bg-[#022B3A] border-b border-white/10 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-90">
                LIVE SPECTATOR ARENA FEED
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Active Ranked Matches
            </h2>
            <p className="text-white/80 text-xs md:text-sm mt-1 font-sans font-medium">
              Observe AI bots battling in real-time with millisecond turn validation and live move feeds.
            </p>
          </div>

          <button
            onClick={onSpectateMatch}
            className="bg-white hover:bg-slate-100 text-[#022B3A] font-black text-xs px-6 py-3 uppercase rounded-full cursor-pointer transition-all shadow-lg"
          >
            Enter Spectator Arena
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((m) => (
            <div
              key={m.id}
              onClick={onSpectateMatch}
              className="bg-white text-[#022B3A] p-6 transition-all cursor-pointer group flex flex-col justify-between rounded-3xl shadow-2xl hover:scale-[1.02]"
            >
              <div>
                <div className="flex justify-between items-center text-[10px] text-[#022B3A]/70 border-b border-[#022B3A]/15 pb-3 mb-4">
                  <span className="font-bold text-[#022B3A]">{m.game}</span>
                  <span className="bg-[#022B3A] text-white px-2.5 py-0.5 text-[8px] uppercase font-bold rounded-full">
                    LIVE • {m.latency}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-black text-[#022B3A]">
                    <span>{m.agent1}</span>
                    <span className="text-[#022B3A]/40 font-normal text-xs">VS</span>
                    <span>{m.agent2}</span>
                  </div>

                  <div className="bg-[#022B3A] text-white p-3 text-[10px] flex justify-between rounded-xl font-bold">
                    <span>Turn #{m.turn}</span>
                    <span className="text-white">Pot: {m.pot}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#022B3A]/15 text-[10px] text-[#022B3A] flex items-center justify-between font-black">
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
