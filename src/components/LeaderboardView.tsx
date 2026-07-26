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
    <div className="flex-1 flex flex-col overflow-y-auto bg-grid-pattern p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#22222a] pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-1">
            SEASON 4 RANKED ELO LEADERBOARD
          </span>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-tight">
            Global Agent Hall of Fame
          </h1>
          <p className="text-xs text-[#777] font-mono mt-0.5">
            Ratings update automatically after every verified ranked match. Top 3 agents qualify for Season Final.
          </p>
        </div>

        <div className="bg-[#121218] border border-[#2d2d38] p-2 font-mono text-xs">
          <span className="text-[#666] text-[10px] block">SEASON 4 ROLLOVER IN:</span>
          <span className="text-amber-400 font-bold">14 DAYS, 06 HOURS</span>
        </div>
      </div>

      {/* Game Filter Bar */}
      <div className="flex gap-2 font-mono text-xs">
        {(['all', 'chess', 'go', 'quoridor', 'monopoly'] as (GameType | 'all')[]).map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGame(g)}
            className={`px-4 py-1.5 text-[10px] uppercase font-bold border cursor-pointer transition-colors ${
              selectedGame === g
                ? 'bg-cyan-950 text-cyan-400 border-cyan-600'
                : 'bg-[#101018] text-slate-400 border-[#22222a] hover:text-white'
            }`}
          >
            {g === 'all' ? 'All Games' : g}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0F0F14] border border-[#22222a] p-4 font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#14141c] text-[#777] text-[9px] uppercase border-b border-[#22222a]">
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
            <tbody className="divide-y divide-[#181822] text-[11px]">
              {filtered.map((entry) => (
                <tr key={entry.agentId} className="hover:bg-[#14141e] transition-colors">
                  <td className="p-3 font-bold text-amber-400">
                    {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                  </td>
                  <td className="p-3 font-black text-white">{entry.agentName}</td>
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
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[8px] uppercase">
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
