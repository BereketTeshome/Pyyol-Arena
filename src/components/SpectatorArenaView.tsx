import React, { useState, useEffect } from 'react';
import { GameType, Agent, Match } from '../types/arena';
import { createInitialChessState, makeChessMove } from '../services/gameEngines/chessEngine';
import { createInitialGoState, makeGoMove } from '../services/gameEngines/goEngine';
import { createInitialQuoridorState, makeQuoridorMove } from '../services/gameEngines/quoridorEngine';
import { createInitialMonopolyState, makeMonopolyTurn, MONOPOLY_SPACES } from '../services/gameEngines/monopolyEngine';
import { globalLedger } from '../services/ledgerService';
import { Swords, Play, Pause, RotateCcw, ShieldCheck, Users, Zap, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface SpectatorArenaViewProps {
  agents: Agent[];
  activeAgent: Agent;
  onOpenProvablyFairModal: (seed: string) => void;
}

const COIN_TIERS = [100, 250, 500, 1000, 2000, 5000, 7500, 10000];

const CANDIDATE_OPPONENTS = [
  { handle: '@pawnstorm_bot', name: 'PawnStorm' },
  { handle: '@deep_stone_v9', name: 'GoGoliath_v1' },
  { handle: '@maze_runner', name: 'WallsMaster' },
  { handle: '@wall_street_ai', name: 'TycoonAI' },
  { handle: '@alpha_zero_x', name: 'AlphaZero_Refined' },
  { handle: '@zen_master', name: 'ZenTactics' },
];

export const SpectatorArenaView: React.FC<SpectatorArenaViewProps> = ({
  agents,
  activeAgent,
  onOpenProvablyFairModal,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType>('chess');
  const [selectedTier, setSelectedTier] = useState<number>(500);
  const [opponentId, setOpponentId] = useState<string>('agent_pawnstorm');
  const [monopolyPlayersCount, setMonopolyPlayersCount] = useState<number>(4);
  const [quoridorPlayersCount, setQuoridorPlayersCount] = useState<number>(4);
  
  // Playback & Game state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [matchLogs, setMatchLogs] = useState<string[]>([]);

  // Matchmaking State
  const [isMatchmaking, setIsMatchmaking] = useState<boolean>(false);
  const [matchmakingProgress, setMatchmakingProgress] = useState<number>(1);
  const [matchmakingTotalPlayers, setMatchmakingTotalPlayers] = useState<number>(2);
  const [matchmakingMessage, setMatchmakingMessage] = useState<string>('');
  const [matchmakingOpponentName, setMatchmakingOpponentName] = useState<string>('');

  // Engine States
  const [chessState, setChessState] = useState(createInitialChessState());
  const [goState, setGoState] = useState(createInitialGoState());
  const [quoridorState, setQuoridorState] = useState(createInitialQuoridorState(activeAgent.name, 'PawnStorm'));
  const [monopolyState, setMonopolyState] = useState(createInitialMonopolyState(activeAgent.name, 'PawnStorm'));

  const opponentAgent = agents.find(a => a.id === opponentId) || agents[1] || agents[0];

  useEffect(() => {
    resetMatch();
  }, [selectedGame, opponentId]);

  const resetMatch = () => {
    setIsPlaying(false);
    setIsMatchmaking(false);
    setCurrentTurn(1);
    setChessState(createInitialChessState());
    setGoState(createInitialGoState());
    setQuoridorState(createInitialQuoridorState(activeAgent.name, opponentAgent.name));
    setMonopolyState(createInitialMonopolyState(activeAgent.name, opponentAgent.name));
    setMatchLogs([`[00:00:01] MATCH INIT: ${activeAgent.name} vs ${opponentAgent.name} (${selectedGame.toUpperCase()})`]);
  };

  const stepNextTurn = () => {
    if (selectedGame === 'chess') {
      if (chessState.isGameOver) return;
      const turnColor = chessState.turn;
      const moveStr = turnColor === 'white' 
        ? (currentTurn % 2 === 1 ? 'e2e4' : 'g1f3')
        : (currentTurn % 2 === 1 ? 'e7e5' : 'b8c6');
      const nextState = makeChessMove(chessState, moveStr);
      setChessState(nextState);
      setMatchLogs(prev => [`[TURN ${currentTurn}] ${turnColor === 'white' ? activeAgent.name : opponentAgent.name} played ${moveStr.toUpperCase()}`, ...prev]);
    } else if (selectedGame === 'go') {
      if (goState.isGameOver) return;
      const moveStr = String.fromCharCode(65 + ((currentTurn * 2) % 8)) + (currentTurn % 8 + 1);
      const nextState = makeGoMove(goState, moveStr);
      setGoState(nextState);
      setMatchLogs(prev => [`[TURN ${currentTurn}] Stone placed at ${moveStr}`, ...prev]);
    } else if (selectedGame === 'quoridor') {
      if (quoridorState.isGameOver) return;
      const nextState = makeQuoridorMove(quoridorState, 'MOVE');
      setQuoridorState(nextState);
      setMatchLogs(prev => [`[TURN ${currentTurn}] Pawn advanced step towards goal line`, ...prev]);
    } else if (selectedGame === 'monopoly') {
      if (monopolyState.isGameOver) return;
      const nextState = makeMonopolyTurn(monopolyState);
      setMonopolyState(nextState);
      setMatchLogs(prev => [nextState.logs[nextState.logs.length - 1] || `[TURN ${currentTurn}] Monopoly turn completed`, ...prev]);
    }

    setCurrentTurn(prev => prev + 1);
  };

  // Playback loop
  useEffect(() => {
    if (!isPlaying || isMatchmaking) return;
    const interval = setInterval(() => {
      stepNextTurn();
    }, 1200 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, isMatchmaking, playbackSpeed, selectedGame, currentTurn, chessState, goState, quoridorState, monopolyState]);

  // Click PLAY button to trigger dynamic matchmaking simulation
  const handleStartPlayMatchmaking = () => {
    try {
      globalLedger.recordMatchStake(activeAgent.name, selectedTier);
    } catch (err: any) {
      // ignore ledger error if insufficient mock coins
    }

    resetMatch();
    setIsMatchmaking(true);

    const totalTarget = (selectedGame === 'monopoly' ? monopolyPlayersCount : (selectedGame === 'quoridor' ? quoridorPlayersCount : 2));
    setMatchmakingTotalPlayers(totalTarget);
    setMatchmakingProgress(1);
    setMatchmakingMessage(`Searching for online opponents on ${selectedTier}c tier...`);

    let currentCount = 1;
    const matchInterval = setInterval(() => {
      currentCount++;
      const candidate = CANDIDATE_OPPONENTS[Math.floor(Math.random() * CANDIDATE_OPPONENTS.length)];
      setMatchmakingOpponentName(candidate.name);

      if (totalTarget === 2) {
        setMatchmakingProgress(2);
        setMatchmakingMessage(`Opponent found: ${candidate.name} (${candidate.handle})! Initializing match...`);
        clearInterval(matchInterval);

        setTimeout(() => {
          setIsMatchmaking(false);
          setIsPlaying(true);
          setMatchLogs(prev => [
            `[MATCH STARTED] Live 1v1 match on ${selectedTier}c tier against ${candidate.name}`,
            ...prev,
          ]);
        }, 1200);
      } else {
        setMatchmakingProgress(currentCount);
        setMatchmakingMessage(`Waiting for players... ${currentCount}/${totalTarget} (${candidate.handle} joined queue)`);

        if (currentCount >= totalTarget) {
          clearInterval(matchInterval);
          setTimeout(() => {
            setMatchmakingMessage(`Queue full (${totalTarget}/${totalTarget}) — Match Started!`);
            setTimeout(() => {
              setIsMatchmaking(false);
              setIsPlaying(true);
              setMatchLogs(prev => [
                `[MATCH STARTED] ${totalTarget}-Player Ranked Match on ${selectedTier}c tier!`,
                ...prev,
              ]);
            }, 1000);
          }, 800);
        }
      }
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 gap-6 font-sans bg-gradient-to-br from-[#061d28] via-[#0b384d] to-[#04151f] text-white select-none">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/15 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 bg-cyan-500/20 rounded-full border border-cyan-400/40 text-cyan-300">
              <Swords className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono">
              RANKED MATCHMAKING & SPECTATOR ARENA
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
            {activeAgent.name} vs {opponentAgent.name}
          </h1>
        </div>

        {/* Tier Selector & Play Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Play Button - NO Hover Transform/Scale Effect as requested */}
          <button
            onClick={handleStartPlayMatchmaking}
            disabled={isMatchmaking}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-[#071321] font-extrabold text-sm uppercase rounded-full cursor-pointer shadow-xl transition-colors flex items-center justify-center gap-2 tracking-wider shrink-0"
          >
            {isMatchmaking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#071321]" />
                <span>Finding Match...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-[#071321]" />
                <span>Play ({selectedTier}c Tier)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Coin Tier Selector Row */}
      <div className="bg-[#082233]/90 border border-cyan-500/30 p-4 rounded-3xl backdrop-blur-2xl shadow-xl space-y-2">
        <div className="flex justify-between items-center font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
            Select Match Coin Stake Tier:
          </span>
          <span className="text-slate-400 text-[10px]">Active Stake: <strong className="text-emerald-400">{selectedTier} coins</strong></span>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono">
          {COIN_TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`py-2 px-1 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-colors ${
                selectedTier === tier
                  ? 'bg-cyan-400 text-[#071321] border-cyan-300 shadow-md'
                  : 'bg-[#041420] text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              {tier >= 1000 ? `${tier / 1000}k c` : `${tier}c`}
            </button>
          ))}
        </div>
      </div>

      {/* Game Selector & Player Count Rules */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex gap-2 font-mono text-xs">
          {(['chess', 'go', 'quoridor', 'monopoly'] as GameType[]).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGame(g)}
              className={`px-5 py-2.5 rounded-2xl border uppercase font-bold cursor-pointer transition-colors ${
                selectedGame === g
                  ? 'bg-cyan-950 text-cyan-200 border-cyan-400 shadow-md'
                  : 'bg-[#050D17] text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Monopoly & Quoridor player count selectors */}
        {selectedGame === 'monopoly' && (
          <div className="flex items-center gap-2 bg-[#050D17] border border-cyan-500/30 px-4 py-2 rounded-2xl font-mono text-xs">
            <span className="text-[10px] text-cyan-300 font-bold uppercase">Match Players (2–8):</span>
            {[2, 3, 4, 5, 6, 7, 8].map((count) => (
              <button
                key={count}
                onClick={() => setMonopolyPlayersCount(count)}
                className={`w-7 h-7 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  monopolyPlayersCount === count
                    ? 'bg-cyan-400 text-[#071321]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/20'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        )}

        {selectedGame === 'quoridor' && (
          <div className="flex items-center gap-2 bg-[#050D17] border border-cyan-500/30 px-4 py-2 rounded-2xl font-mono text-xs">
            <span className="text-[10px] text-cyan-300 font-bold uppercase">Match Players:</span>
            {[2, 4].map((count) => (
              <button
                key={count}
                onClick={() => setQuoridorPlayersCount(count)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  quoridorPlayersCount === count
                    ? 'bg-cyan-400 text-[#071321]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/20'
                }`}
              >
                {count} Players
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Matchmaking Queue Active Banner (If Matchmaking) */}
      {isMatchmaking && (
        <div className="p-6 bg-gradient-to-r from-cyan-950 via-[#082838] to-cyan-950 border border-cyan-400/60 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <Loader2 className="w-6 h-6 text-cyan-300 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <span>ONLINE MATCHMAKING IN PROGRESS</span>
                <span className="bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-md text-[10px]">{selectedTier}c TIER</span>
              </div>
              <h3 className="text-lg font-bold text-white font-serif mt-0.5">
                {matchmakingMessage}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#03111c] border border-white/15 px-5 py-3 rounded-2xl font-mono text-xs shrink-0">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Lobby Queue: <strong className="text-cyan-300">{matchmakingProgress} / {matchmakingTotalPlayers} Players</strong></span>
          </div>
        </div>
      )}

      {/* Main Board View & Live Logs */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Interactive Board View Container */}
        <div className="col-span-12 lg:col-span-8 bg-[#0A1827]/80 border border-white/15 p-4 md:p-6 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col items-center justify-center min-h-[420px] space-y-4">
          
          {/* Playback Controls */}
          <div className="w-full flex justify-between items-center bg-[#050D17] p-3 rounded-2xl border border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-1.5 bg-white text-[#071321] hover:bg-slate-100 font-bold uppercase text-[10px] rounded-full cursor-pointer shadow-md transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play Simulation'}
              </button>
              <button
                onClick={stepNextTurn}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] rounded-full cursor-pointer border border-white/15 transition-colors"
              >
                Step Turn +1
              </button>
              <button
                onClick={resetMatch}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold uppercase text-[10px] rounded-full cursor-pointer border border-white/15 transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[10px]">
              <span>Speed:</span>
              {[0.5, 1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-full border cursor-pointer font-bold ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500 text-[#071321] border-cyan-400'
                      : 'bg-[#0A1827] text-slate-400 border-white/10'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* CHESS BOARD */}
          {selectedGame === 'chess' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-8 gap-0.5 border-4 border-white/20 bg-[#050D17] p-2 rounded-2xl shadow-2xl">
                {chessState.board.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isDark = (rIdx + cIdx) % 2 === 1;
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-bold rounded-lg ${
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
                <span>Full Move: {chessState.fullMoveNumber}</span>
              </div>
            </div>
          )}

          {/* GO BOARD */}
          {selectedGame === 'go' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-9 gap-1 border-4 border-white/20 bg-[#0A1827] p-3 rounded-2xl shadow-2xl">
                {goState.grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="w-8 h-8 md:w-9 md:h-9 bg-[#050D17] border border-white/10 flex items-center justify-center rounded-lg"
                    >
                      {cell === 'B' && <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>}
                      {cell === 'W' && <div className="w-6 h-6 rounded-full bg-slate-200 shadow-md"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* QUORIDOR BOARD */}
          {selectedGame === 'quoridor' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-9 gap-1 border-4 border-white/20 bg-[#0A1827] p-3 rounded-2xl shadow-2xl">
                {Array(9).fill(0).map((_, rIdx) =>
                  Array(9).fill(0).map((_, cIdx) => {
                    const isP1 = quoridorState.players[0].pawnPos[0] === rIdx && quoridorState.players[0].pawnPos[1] === cIdx;
                    const isP2 = quoridorState.players[1].pawnPos[0] === rIdx && quoridorState.players[1].pawnPos[1] === cIdx;
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className="w-8 h-8 md:w-9 md:h-9 bg-[#050D17] border border-white/10 flex items-center justify-center relative rounded-lg"
                      >
                        {isP1 && <div className="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_#22d3ee]"></div>}
                        {isP2 && <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_10px_#f59e0b]"></div>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* MONOPOLY BOARD */}
          {selectedGame === 'monopoly' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 p-3 bg-[#050D17] border border-white/15 rounded-2xl">
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
                        {p1Here && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>}
                        {p2Here && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 bg-[#050D17] p-3 rounded-2xl border border-white/15 font-mono text-xs w-full justify-between">
                <div>
                  <span className="text-slate-400 block text-[9px]">LAST SEED DICE ROLL:</span>
                  <span className="text-cyan-300 font-bold text-base">
                    [{monopolyState.lastDiceRoll[0]}, {monopolyState.lastDiceRoll[1]}]
                  </span>
                </div>

                <button
                  onClick={() => onOpenProvablyFairModal(monopolyState.diceSeed)}
                  className="px-3.5 py-1.5 bg-white/10 text-white hover:bg-white/20 border border-white/15 text-[10px] font-bold uppercase rounded-full cursor-pointer transition-colors"
                >
                  Verify Seed HMAC ↗
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Stream Logs */}
        <div className="col-span-12 lg:col-span-4 bg-[#0A1827]/80 border border-white/15 p-5 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col h-[420px] font-mono text-xs space-y-3">
          <div className="border-b border-white/10 pb-3 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-slate-300 tracking-wider">
              Live Event Stream Log
            </span>
            <span className="text-[10px] text-cyan-400">{matchLogs.length} Events</span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-[11px] bg-[#050D17] p-3 rounded-2xl border border-white/10">
            {matchLogs.map((log, i) => (
              <div key={i} className="text-slate-300 border-b border-white/5 pb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
