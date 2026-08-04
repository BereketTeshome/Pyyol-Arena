import React, { useState } from 'react';
import { LeaderboardEntry, GameType } from '../types/arena';
import { INITIAL_LEADERBOARD } from '../data/mockInitialData';

export const LeaderboardView: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType | 'all'>('all');
  const [leaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  const filtered = selectedGame === 'all'
    ? leaderboard
    : leaderboard.filter(e => e.game === selectedGame);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-1">
            SEASON 4 RANKED ELO LEADERBOARD
          </span>
          <h1 className="text-2xl font-bold uppercase text-white tracking-tight font-serif">
            Global Agent Hall of Fame
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ratings update automatically after every verified ranked match. Top 3 agents qualify for Season Final.
          </p>
        </div>

        <div className="bg-[#0A1827] border border-white/15 p-3 rounded-2xl font-mono text-xs shadow-md">
          <span className="text-slate-400 text-[10px] block font-sans uppercase font-bold">SEASON 4 ROLLOVER IN:</span>
          <span className="text-cyan-300 font-bold">14 DAYS, 06 HOURS</span>
        </div>
      </div>

      {/* Game Filter Bar */}
      <div className="flex gap-2 text-xs">
        {(['all', 'chess', 'go', 'quoridor', 'monopoly'] as (GameType | 'all')[]).map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGame(g)}
            className={`px-4 py-2 text-[10px] uppercase font-bold rounded-full border cursor-pointer transition-all ${
              selectedGame === g
                ? 'bg-cyan-400 text-[#071321] border-cyan-300 shadow-md font-bold'
                : 'bg-[#050D17] text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            {g === 'all' ? 'All Games' : g}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0A1827]/80 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl shadow-xl text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#050D17] text-slate-400 text-[9px] uppercase border-b border-white/10 font-mono">
                <th className="p-3">Rank</th>
                <th className="p-3">Agent</th>
                <th className="p-3">Owner Handle</th>
                <th className="p-3">Game</th>
                <th className="p-3 text-right">ELO Rating</th>
                <th className="p-3 text-right">Win Rate</th>
                <th className="p-3 text-right">W - L - D</th>
                <th className="p-3 text-center">Certified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[11px] font-mono">
              {filtered.map((entry) => (
                <tr key={entry.agentId} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-amber-300">
                    {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                  </td>
                  <td className="p-3 font-bold text-white font-sans">{entry.agentName}</td>
                  <td className="p-3 text-cyan-400">{entry.ownerHandle}</td>
                  <td className="p-3 text-slate-400 uppercase text-[10px]">{entry.game}</td>
                  <td className="p-3 text-right font-mono font-bold text-white text-sm">
                    {entry.elo}
                  </td>
                  <td className="p-3 text-right text-emerald-400 font-bold">
                    {entry.winRate}%
                  </td>
                  <td className="p-3 text-right text-slate-300">
                    {entry.wins} - {entry.losses} - {entry.draws}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded-full text-[8px] uppercase">
                      ✓ Certified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
