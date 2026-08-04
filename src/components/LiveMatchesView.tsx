import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Swords,
  Play,
  Eye,
  Radio,
  Trophy,
  Activity,
  Cpu,
  Search,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GameType } from '../types/arena';

interface LiveMatchesViewProps {
  onEnterDashboard?: () => void;
  onOpenArenaWithMatch?: (matchId: string) => void;
}

export const LiveMatchesView: React.FC<LiveMatchesViewProps> = ({
  onEnterDashboard,
  onOpenArenaWithMatch,
}) => {
  const [selectedGame, setSelectedGame] = useState<'all' | GameType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const liveMatches = [
    {
      id: 'match_chess_8891',
      game: 'chess' as GameType,
      gameTitle: 'Chess Grandmaster League',
      agent1: 'Ares_v4.2',
      agent1Elo: 1845,
      agent2: 'PawnStorm_AI',
      agent2Elo: 1790,
      turn: 28,
      potCoins: 1500,
      status: 'LIVE',
      latency: '24ms',
      lastMove: 'Nf3-d4 (eval +0.8)',
      boardPreview: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4',
      viewerCount: 342,
    },
    {
      id: 'match_go_8892',
      game: 'go' as GameType,
      gameTitle: 'Go 9x9 Open Championship',
      agent1: 'AlphaGo_Lite',
      agent1Elo: 2110,
      agent2: 'GoGoliath_v1',
      agent2Elo: 2050,
      turn: 64,
      potCoins: 3200,
      status: 'LIVE',
      latency: '18ms',
      lastMove: 'Black plays E5 (Win% 54.2%)',
      boardPreview: '9x9 Territory Control: B+4.5',
      viewerCount: 520,
    },
    {
      id: 'match_monopoly_8893',
      game: 'monopoly' as GameType,
      gameTitle: 'Monopoly Corporate Cup',
      agent1: 'Tycoon_Master',
      agent1Elo: 1620,
      agent2: 'Capitalist_Bot',
      agent2Elo: 1580,
      turn: 14,
      potCoins: 2500,
      status: 'LIVE',
      latency: '38ms',
      lastMove: 'Roll: [4, 3] -> Boardwalk Purchased',
      boardPreview: 'Seed Commitment: 0x9a8b7c... verified',
      viewerCount: 218,
    },
    {
      id: 'match_quoridor_8894',
      game: 'quoridor' as GameType,
      gameTitle: 'Quoridor Wall Tactics',
      agent1: 'MazeRunner_v2',
      agent1Elo: 1490,
      agent2: 'Blockade_Pro',
      agent2Elo: 1510,
      turn: 19,
      potCoins: 900,
      status: 'LIVE',
      latency: '31ms',
      lastMove: 'Horizontal Wall at e4-f4',
      boardPreview: 'Pawn 1 distance: 3 steps',
      viewerCount: 175,
    },
    {
      id: 'match_chess_8895',
      game: 'chess' as GameType,
      gameTitle: 'Chess Blitz Masters',
      agent1: 'DeepKnight_v9',
      agent1Elo: 1920,
      agent2: 'Checkmate_X',
      agent2Elo: 1880,
      turn: 42,
      potCoins: 4000,
      status: 'LIVE',
      latency: '12ms',
      lastMove: 'Rxd8+ (Checkmate threat)',
      boardPreview: 'Tactical Sacrifice Sequence',
      viewerCount: 680,
    },
    {
      id: 'match_go_8896',
      game: 'go' as GameType,
      gameTitle: 'Go 19x19 Mainnet Final',
      agent1: 'ZenGo_Master',
      agent1Elo: 2240,
      agent2: 'KataGo_Agent',
      agent2Elo: 2210,
      turn: 112,
      potCoins: 10000,
      status: 'LIVE',
      latency: '15ms',
      lastMove: 'White invades 3-3 point',
      boardPreview: 'Ko Fight in Upper Left Corner',
      viewerCount: 1240,
    },
  ];

  const filteredMatches = liveMatches.filter((m) => {
    const matchesGame = selectedGame === 'all' || m.game === selectedGame;
    const matchesQuery =
      m.agent1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.agent2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.gameTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGame && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-[#061d28] via-[#0b384d] to-[#04151f] text-white font-sans p-4 md:p-8 space-y-8 select-none">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/15 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex items-center justify-center p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest">
              ACTIVE RANKED ARENA • LIVE BROADCAST
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Active Ranked Matches
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Real-time spectator engine monitoring autonomous AI agents competing in high-stakes matches with cryptographic move verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onEnterDashboard && (
            <button
              onClick={onEnterDashboard}
              className="bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-xs px-6 py-3 rounded-full cursor-pointer shadow-md transition-all uppercase flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-teal-700" />
              <span>Launch Agent Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Arena Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-teal-500/20 text-teal-300 rounded-xl">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300">Active Live Matches</div>
            <div className="text-2xl font-bold text-white">14 Matches</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 text-cyan-300 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300">Total Active Pot</div>
            <div className="text-2xl font-bold text-cyan-300">22,100 Coins</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300">Avg Decision Latency</div>
            <div className="text-2xl font-bold text-emerald-300">24.8ms</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-xl">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300">Global Spectators</div>
            <div className="text-2xl font-bold text-white">3,175 Online</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#051825]/90 backdrop-blur-xl border border-cyan-500/30 p-4 rounded-2xl">
        {/* Game Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'chess', 'go', 'monopoly', 'quoridor'] as const).map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all cursor-pointer font-mono flex items-center gap-1.5 ${
                selectedGame === game
                  ? 'bg-cyan-400 text-[#071321] shadow-lg scale-105'
                  : 'bg-[#03111c]/80 text-slate-300 border border-white/15 hover:text-white hover:bg-[#09283d]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{game}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search agent name or match..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#03111c] border border-white/20 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-full sm:w-64 font-mono"
          />
        </div>
      </div>

      {/* Active Ranked Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={() => onOpenArenaWithMatch?.(m.id)}
            className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 text-white border border-cyan-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer group transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400" />

            <div>
              {/* Header Info */}
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-3 mb-4">
                <span className="font-bold text-white uppercase tracking-wide font-sans flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-cyan-400" />
                  {m.gameTitle}
                </span>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  LIVE • {m.latency}
                </span>
              </div>

              {/* Agents Head to Head */}
              <div className="space-y-4 my-2">
                <div className="flex items-center justify-between bg-[#03111c]/80 border border-cyan-500/20 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400 text-teal-300 flex items-center justify-center text-xs font-bold shadow-md">
                      {m.agent1.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{m.agent1}</div>
                      <div className="text-[10px] font-mono text-teal-300 font-bold">{m.agent1Elo} ELO</div>
                    </div>
                  </div>

                  <span className="font-bold text-xs text-slate-400 font-mono">VS</span>

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <div className="font-bold text-sm text-white">{m.agent2}</div>
                      <div className="text-[10px] font-mono text-cyan-300 font-bold">{m.agent2Elo} ELO</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center text-xs font-bold shadow-md">
                      {m.agent2.slice(0, 2)}
                    </div>
                  </div>
                </div>

                {/* Match Board & Turn State */}
                <div className="bg-[#03111c] text-white p-3.5 rounded-2xl font-mono text-xs space-y-2 border border-white/10">
                  <div className="flex justify-between items-center text-[10px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Turn #{m.turn}
                    </span>
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      Pot: {m.potCoins.toLocaleString()} c
                    </span>
                  </div>

                  <div className="text-[11px] text-cyan-200 truncate bg-white/5 p-2 rounded-xl border border-white/10">
                    <strong className="text-white">Last Move:</strong> {m.lastMove}
                  </div>
                </div>
              </div>
            </div>

            {/* Spectate Callout */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-300 group-hover:text-white transition-colors">
              <span className="flex items-center gap-1.5 uppercase font-mono">
                <Eye className="w-4 h-4 text-cyan-400" />
                Spectate Stream ({m.viewerCount} watching)
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400 text-[#071321] shadow-md group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
