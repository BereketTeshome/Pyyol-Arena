import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Play,
  Pause,
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
  Maximize2,
  Minimize2,
  X,
  RotateCcw,
} from 'lucide-react';
import { GameType } from '../types/arena';
import { createInitialChessState, makeChessMove } from '../services/gameEngines/chessEngine';
import { createInitialGoState, makeGoMove } from '../services/gameEngines/goEngine';
import { createInitialQuoridorState, makeQuoridorMove } from '../services/gameEngines/quoridorEngine';
import { createInitialMonopolyState, makeMonopolyTurn, MONOPOLY_SPACES } from '../services/gameEngines/monopolyEngine';

interface LiveMatchesViewProps {
  onEnterDashboard?: () => void;
  onOpenArenaWithMatch?: (matchId: string) => void;
}

interface MatchItem {
  id: string;
  game: GameType;
  gameTitle: string;
  agent1: string;
  agent1Elo: number;
  agent2: string;
  agent2Elo: number;
  turn: number;
  potCoins: number;
  status: string;
  latency: string;
  lastMove: string;
  boardPreview: string;
  viewerCount: number;
}

export const LiveMatchesView: React.FC<LiveMatchesViewProps> = ({
  onEnterDashboard,
  onOpenArenaWithMatch,
}) => {
  const [selectedGame, setSelectedGame] = useState<'all' | GameType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalMatch, setActiveModalMatch] = useState<MatchItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(24);
  const [matchLogs, setMatchLogs] = useState<string[]>([]);

  // Engine States for Live Modal Simulation
  const [chessState, setChessState] = useState(createInitialChessState());
  const [goState, setGoState] = useState(createInitialGoState());
  const [quoridorState, setQuoridorState] = useState(createInitialQuoridorState('Ares_v4.2', 'PawnStorm_AI'));
  const [monopolyState, setMonopolyState] = useState(createInitialMonopolyState('Tycoon_Master', 'Capitalist_Bot'));

  const liveMatches: MatchItem[] = [
    {
      id: 'match_chess_8891',
      game: 'chess',
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
      game: 'go',
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
      game: 'monopoly',
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
      game: 'quoridor',
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
      game: 'chess',
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
      game: 'go',
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

  const handleOpenLiveModal = (match: MatchItem) => {
    setActiveModalMatch(match);
    setIsPlaying(true);
    setCurrentTurn(match.turn);
    setChessState(createInitialChessState());
    setGoState(createInitialGoState());
    setQuoridorState(createInitialQuoridorState(match.agent1, match.agent2));
    setMonopolyState(createInitialMonopolyState(match.agent1, match.agent2));
    setMatchLogs([
      `[00:00:00] BROADCAST ESTABLISHED: ${match.gameTitle}`,
      `[00:00:01] MATCH SEED: 0x8a9b7c... HMAC Verified`,
      `[00:00:02] TURN #${match.turn}: ${match.lastMove}`,
    ]);
  };

  const handleCloseModal = () => {
    setActiveModalMatch(null);
    setIsFullscreen(false);
  };

  const stepNextTurn = () => {
    if (!activeModalMatch) return;
    const game = activeModalMatch.game;
    setCurrentTurn(prev => prev + 1);

    if (game === 'chess') {
      const turnColor = chessState.turn;
      const moveStr = turnColor === 'white' ? 'e2e4' : 'e7e5';
      setChessState(makeChessMove(chessState, moveStr));
      setMatchLogs(prev => [`[TURN ${currentTurn}] ${turnColor === 'white' ? activeModalMatch.agent1 : activeModalMatch.agent2} evaluated ${moveStr}`, ...prev]);
    } else if (game === 'go') {
      const moveStr = 'E5';
      setGoState(makeGoMove(goState, moveStr));
      setMatchLogs(prev => [`[TURN ${currentTurn}] Stone played at ${moveStr} (Latency 22ms)`, ...prev]);
    } else if (game === 'quoridor') {
      setQuoridorState(makeQuoridorMove(quoridorState, 'MOVE'));
      setMatchLogs(prev => [`[TURN ${currentTurn}] Pawn advanced towards goal line`, ...prev]);
    } else if (game === 'monopoly') {
      const nextState = makeMonopolyTurn(monopolyState);
      setMonopolyState(nextState);
      setMatchLogs(prev => [nextState.logs[nextState.logs.length - 1] || `[TURN ${currentTurn}] Dice rolled`, ...prev]);
    }
  };

  useEffect(() => {
    if (!isPlaying || !activeModalMatch) return;
    const timer = setInterval(() => {
      stepNextTurn();
    }, 1500 / playbackSpeed);
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, activeModalMatch, currentTurn]);

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
            onClick={() => handleOpenLiveModal(m)}
            className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 text-white border border-cyan-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer group transition-all relative overflow-hidden"
          >
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
                Watch Stream ({m.viewerCount} watching)
              </span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-400 text-[#071321] shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* GAMEY LIVE SPECTATOR STREAM MODAL */}
      <AnimatePresence>
        {activeModalMatch && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 select-none font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-gradient-to-br from-[#061d28] via-[#0b384d] to-[#04151f] border border-cyan-400/50 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col overflow-hidden text-white transition-all ${
                isFullscreen ? 'fixed inset-2 md:inset-4 z-50' : 'w-full max-w-5xl max-h-[92vh]'
              }`}
            >
              {/* Top Modal Broadcast Header */}
              <div className="bg-[#03111c] px-6 py-4 border-b border-cyan-500/30 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-mono font-bold">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    LIVE ARENA STREAM
                  </span>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-serif text-white">
                      {activeModalMatch.gameTitle}
                    </h2>
                    <p className="text-xs text-slate-300 font-mono">
                      {activeModalMatch.agent1} vs {activeModalMatch.agent2} • Pot: {activeModalMatch.potCoins.toLocaleString()} Coins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer border border-white/15"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="p-2.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer border border-red-500/30"
                    title="Close Spectator Stream"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Spectator Body: Board Simulator + Stream Feed */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-12 gap-6">
                {/* Visual Game Board Simulation Stage */}
                <div className="col-span-12 lg:col-span-8 bg-[#03111c]/90 border border-cyan-500/30 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden shadow-2xl">
                  {/* Playback Control Bar */}
                  <div className="w-full flex flex-wrap justify-between items-center mb-4 bg-[#082233] p-3 rounded-2xl border border-white/10 font-mono text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-[#071321] font-bold uppercase text-[10px] rounded-full cursor-pointer shadow-md transition-all flex items-center gap-1"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isPlaying ? 'Pause Stream' : 'Resume'}</span>
                      </button>
                      <button
                        onClick={stepNextTurn}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] rounded-full cursor-pointer border border-white/15 transition-all"
                      >
                        Step Turn +1
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">Speed:</span>
                      {[0.5, 1, 2, 5].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                            playbackSpeed === spd
                              ? 'bg-cyan-400 text-[#071321] border-cyan-300 font-bold'
                              : 'bg-[#03111c] text-slate-400 border-white/10'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CHESS BOARD SIMULATOR */}
                  {activeModalMatch.game === 'chess' && (
                    <div className="flex flex-col items-center">
                      <div className="grid grid-cols-8 gap-0.5 border-4 border-cyan-500/30 bg-[#050D17] p-2 rounded-2xl shadow-2xl">
                        {chessState.board.map((row, rIdx) =>
                          row.map((cell, cIdx) => {
                            const isDark = (rIdx + cIdx) % 2 === 1;
                            return (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-lg md:text-xl font-bold rounded-lg ${
                                  isDark ? 'bg-[#0E2133]' : 'bg-[#091524]'
                                }`}
                              >
                                {cell ? (
                                  <span className={cell.startsWith('w') ? 'text-cyan-300' : 'text-amber-300 font-extrabold'}>
                                    {cell === 'wP' ? '♟' : cell === 'wR' ? '♜' : cell === 'wN' ? '♞' : cell === 'wB' ? '♝' : cell === 'wQ' ? '♛' : cell === 'wK' ? '♚' :
                                     cell === 'bP' ? '♟' : cell === 'bR' ? '♜' : cell === 'bN' ? '♞' : cell === 'bB' ? '♝' : cell === 'bQ' ? '♛' : '♚'}
                                  </span>
                                ) : null}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="mt-3 flex gap-6 font-mono text-xs text-slate-300">
                        <span>Turn: {chessState.turn.toUpperCase()}</span>
                        <span>Full Move: {currentTurn}</span>
                        <span>Eval: +0.8</span>
                      </div>
                    </div>
                  )}

                  {/* GO BOARD SIMULATOR */}
                  {activeModalMatch.game === 'go' && (
                    <div className="flex flex-col items-center">
                      <div className="grid grid-cols-9 gap-1 border-4 border-cyan-500/30 bg-[#0A1827] p-3 rounded-2xl shadow-2xl">
                        {goState.grid.map((row, rIdx) =>
                          row.map((cell, cIdx) => (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#050D17] border border-white/10 flex items-center justify-center rounded-lg"
                            >
                              {cell === 'B' && <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
                              {cell === 'W' && <div className="w-5 h-5 rounded-full bg-slate-200 shadow-md" />}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="mt-3 flex gap-6 font-mono text-xs text-slate-300">
                        <span>Territory Control: B+4.5</span>
                        <span>Turn #{currentTurn}</span>
                      </div>
                    </div>
                  )}

                  {/* MONOPOLY BOARD SIMULATOR */}
                  {activeModalMatch.game === 'monopoly' && (
                    <div className="w-full flex flex-col items-center space-y-4">
                      <div className="w-full grid grid-cols-4 sm:grid-cols-7 gap-2 p-3 bg-[#050D17] border border-white/15 rounded-2xl">
                        {MONOPOLY_SPACES.slice(0, 14).map((space) => {
                          const p1Here = monopolyState.players[0].position === space.id;
                          const p2Here = monopolyState.players[1].position === space.id;
                          return (
                            <div
                              key={space.id}
                              className="p-2 bg-[#0A1827] border border-white/10 rounded-xl text-[8px] font-mono flex flex-col justify-between min-h-[55px]"
                            >
                              <div className="font-bold text-slate-200 truncate">{space.name}</div>
                              <div className="text-slate-400">{space.cost ? `$${space.cost}` : ''}</div>
                              <div className="flex gap-1 mt-1">
                                {p1Here && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />}
                                {p2Here && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-4 bg-[#050D17] p-3 rounded-2xl border border-white/15 font-mono text-xs w-full justify-between">
                        <div>
                          <span className="text-slate-400 block text-[9px]">SEED DICE ROLL:</span>
                          <span className="text-cyan-300 font-bold text-base">
                            [{monopolyState.lastDiceRoll[0]}, {monopolyState.lastDiceRoll[1]}]
                          </span>
                        </div>
                        <span className="text-xs text-slate-300 font-bold">
                          Cash: P1 (${monopolyState.players[0].cash}) vs P2 (${monopolyState.players[1].cash})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* QUORIDOR BOARD SIMULATOR */}
                  {activeModalMatch.game === 'quoridor' && (
                    <div className="flex flex-col items-center">
                      <div className="grid grid-cols-9 gap-1 border-4 border-cyan-500/30 bg-[#0A1827] p-3 rounded-2xl shadow-2xl">
                        {Array(9).fill(0).map((_, rIdx) =>
                          Array(9).fill(0).map((_, cIdx) => {
                            const isP1 = quoridorState.players[0].pawnPos[0] === rIdx && quoridorState.players[0].pawnPos[1] === cIdx;
                            const isP2 = quoridorState.players[1].pawnPos[0] === rIdx && quoridorState.players[1].pawnPos[1] === cIdx;
                            return (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-[#050D17] border border-white/10 flex items-center justify-center relative rounded-lg"
                              >
                                {isP1 && <div className="w-5 h-5 rounded-full bg-cyan-400 border border-white shadow-[0_0_8px_#22d3ee]" />}
                                {isP2 && <div className="w-5 h-5 rounded-full bg-amber-400 border border-white shadow-[0_0_8px_#f59e0b]" />}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="mt-3 flex gap-6 font-mono text-xs text-slate-300">
                        <span>Walls Remaining: P1 ({quoridorState.players[0].wallsRemaining}) • P2 ({quoridorState.players[1].wallsRemaining})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Live Move Feed & Agent Telemetry */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 font-mono text-xs">
                  {/* Head to Head Card */}
                  <div className="bg-[#03111c] border border-cyan-500/20 p-4 rounded-2xl space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                      Active Competitors
                    </span>
                    <div className="flex justify-between items-center bg-[#082233] p-3 rounded-xl border border-white/10">
                      <div>
                        <div className="font-bold text-white text-sm">{activeModalMatch.agent1}</div>
                        <div className="text-[10px] text-teal-300 font-bold">{activeModalMatch.agent1Elo} ELO</div>
                      </div>
                      <span className="text-slate-400 font-bold">VS</span>
                      <div className="text-right">
                        <div className="font-bold text-white text-sm">{activeModalMatch.agent2}</div>
                        <div className="text-[10px] text-cyan-300 font-bold">{activeModalMatch.agent2Elo} ELO</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Stream Event Log */}
                  <div className="flex-1 bg-[#03111c] border border-cyan-500/20 p-4 rounded-2xl flex flex-col min-h-[220px]">
                    <div className="border-b border-white/10 pb-2 mb-2 flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-300 uppercase">Live Event Stream</span>
                      <span className="text-cyan-300">{activeModalMatch.latency} latency</span>
                    </div>
                    <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[220px] text-[10px] pr-1">
                      {matchLogs.map((log, i) => (
                        <div key={i} className="text-slate-300 border-b border-white/5 pb-1">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

