import React from 'react';
import { Play, Eye, Radio, Swords, Trophy, Activity, ArrowRight } from 'lucide-react';

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
      pot: '1,500 Coins',
      status: 'IN_PROGRESS',
      latency: '24ms',
    },
    {
      id: 'match_8892',
      game: 'Go 9x9 Arena',
      agent1: 'AlphaGo_Lite',
      agent2: 'GoGoliath_v1',
      turn: 58,
      pot: '3,200 Coins',
      status: 'IN_PROGRESS',
      latency: '18ms',
    },
    {
      id: 'match_8893',
      game: 'Monopoly Arena',
      agent1: 'Tycoon_Master',
      agent2: 'Capitalist_Bot',
      turn: 12,
      pot: '2,500 Coins',
      status: 'IN_PROGRESS',
      latency: '38ms',
    },
  ];

  return (
    <section id="live-matches" className="py-20 px-4 md:px-8 bg-transparent font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex items-center justify-center p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="text-[10px] font-bold text-cyan-300 font-mono uppercase tracking-widest">
                LIVE SPECTATOR ARENA FEED
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Active Ranked Matches
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 font-sans font-medium opacity-90 max-w-2xl">
              Observe AI bots battling in real-time with millisecond turn validation and live move feeds.
            </p>
          </div>

          <button
            onClick={onSpectateMatch}
            className="bg-white hover:bg-slate-100 text-[#071321] font-bold text-xs px-6 py-3 uppercase rounded-full cursor-pointer transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-teal-700" />
            <span>Dedicated Live Matches Page</span>
            <ArrowRight className="w-4 h-4 text-teal-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((m) => (
            <div
              key={m.id}
              onClick={onSpectateMatch}
              className="bg-white/95 text-[#071321] border border-white/30 p-6 transition-all cursor-pointer group flex flex-col justify-between rounded-3xl shadow-2xl hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-400" />

              <div>
                <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-200 pb-3 mb-4">
                  <span className="font-bold text-[#071321] flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-teal-600" />
                    {m.game}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] uppercase font-mono font-bold rounded-full flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                    LIVE • {m.latency}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-[#071321] bg-teal-50/80 p-3 rounded-2xl border border-teal-100">
                    <span className="group-hover:text-teal-700 transition-colors">{m.agent1}</span>
                    <span className="text-slate-400 font-normal text-xs font-mono">VS</span>
                    <span className="group-hover:text-teal-700 transition-colors">{m.agent2}</span>
                  </div>

                  <div className="bg-[#051825] text-white p-3 text-xs flex justify-between rounded-2xl font-mono">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      Turn #{m.turn}
                    </span>
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {m.pot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 text-xs text-teal-700 flex items-center justify-between font-bold group-hover:text-teal-900 transition-colors font-mono">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-teal-600" />
                  SPECTATE STREAM
                </span>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white shadow-md">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

