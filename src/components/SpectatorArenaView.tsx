import React, { useState, useEffect } from 'react';
import { GameType, Agent, Match } from '../types/arena';
import { createInitialChessState, makeChessMove, toAlgebraicSquare } from '../services/gameEngines/chessEngine';
import { createInitialGoState, makeGoMove } from '../services/gameEngines/goEngine';
import { createInitialQuoridorState, makeQuoridorMove } from '../services/gameEngines/quoridorEngine';
import { createInitialMonopolyState, makeMonopolyTurn, MONOPOLY_SPACES } from '../services/gameEngines/monopolyEngine';
import { globalLedger } from '../services/ledgerService';

interface SpectatorArenaViewProps {
  agents: Agent[];
  activeAgent: Agent;
  onOpenProvablyFairModal: (seed: string) => void;
}

export const SpectatorArenaView: React.FC<SpectatorArenaViewProps> = ({
  agents,
  activeAgent,
  onOpenProvablyFairModal,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType>('chess');
  const [opponentId, setOpponentId] = useState<string>('agent_pawnstorm');
  const [potCoins, setPotCoins] = useState<number>(1000);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [matchLogs, setMatchLogs] = useState<string[]>([]);

  // Engine States
  const [chessState, setChessState] = useState(createInitialChessState());
  const [goState, setGoState] = useState(createInitialGoState());
  const [quoridorState, setQuoridorState] = useState(createInitialQuoridorState(activeAgent.name, 'PawnStorm'));
  const [monopolyState, setMonopolyState] = useState(createInitialMonopolyState(activeAgent.name, 'PawnStorm'));

  const opponentAgent = agents.find(a => a.id === opponentId) || agents[1] || agents[0];

  // Reset match engine when game or opponent changes
  useEffect(() => {
    resetMatch();
  }, [selectedGame, opponentId]);

  const resetMatch = () => {
    setIsPlaying(false);
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

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      stepNextTurn();
    }, 1200 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, selectedGame, currentTurn, chessState, goState, quoridorState, monopolyState]);

  const handleStartRankedMatch = () => {
    try {
      globalLedger.recordMatchStake(activeAgent.name, potCoins / 2);
      resetMatch();
      setIsPlaying(true);
      setMatchLogs(prev => [`[MATCH STAKE] Ledger debited ${potCoins / 2} coins for match pot ${potCoins}c`, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Ledger error staking match');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              LIVE ARENA SPECTATOR & MATCH RUNNER
            </span>
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold px-2.5 py-0.5 uppercase rounded-full">
              POT: {potCoins.toLocaleString()} COINS
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase text-white tracking-tight font-serif">
            {activeAgent.name} vs {opponentAgent.name}
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            className="bg-[#050D17] border border-white/15 rounded-xl px-4 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>vs {a.name} ({a.ownerHandle})</option>
            ))}
          </select>

          <button
            onClick={handleStartRankedMatch}
            className="bg-white hover:bg-slate-100 text-[#071321] font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] uppercase"
          >
            Stake & Launch Match ({potCoins / 2}c)
          </button>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {(['chess', 'go', 'quoridor', 'monopoly'] as GameType[]).map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGame(g)}
            className={`px-4 py-2 text-[10px] font-mono font-bold uppercase cursor-pointer rounded-full border transition-all ${
              selectedGame === g
                ? 'bg-white text-[#071321] border-white shadow-md'
                : 'bg-[#050D17] text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Main Board View Area & Stats */}
      <div className="grid grid-cols-12 gap-6">
        {/* Interactive Board View Container */}
        <div className="col-span-12 lg:col-span-8 bg-[#0A1827]/80 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col items-center justify-center min-h-[420px]">
          {/* Playback Control Bar */}
          <div className="w-full flex justify-between items-center mb-4 bg-[#050D17] p-3 rounded-2xl border border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-1.5 bg-white text-[#071321] hover:bg-slate-100 font-bold uppercase text-[10px] rounded-full cursor-pointer shadow-md transition-all"
              >
                {isPlaying ? 'Pause' : 'Play Match'}
              </button>
              <button
                onClick={stepNextTurn}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] rounded-full cursor-pointer border border-white/15 transition-all"
              >
                Step Turn +1
              </button>
              <button
                onClick={resetMatch}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold uppercase text-[10px] rounded-full cursor-pointer border border-white/15 transition-all"
              >
                Reset
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
                      ? 'bg-cyan-500 text-[#071321] border-cyan-400 font-bold'
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
                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-bold transition-all rounded-lg ${
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
                {chessState.isCheck && <span className="text-red-400 font-bold">CHECK!</span>}
              </div>
            </div>
          )}

          {/* GO BOARD (9x9) */}
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
              <div className="mt-3 flex gap-6 font-mono text-xs text-slate-300">
                <span>Next Stone: {goState.turn === 'B' ? 'CYAN' : 'WHITE'}</span>
                <span>Captures: Cyan ({goState.captures.B}) - White ({goState.captures.W})</span>
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
              <div className="mt-3 flex gap-6 font-mono text-xs text-slate-300">
                <span>P1 Walls: {quoridorState.players[0].wallsRemaining}</span>
                <span>P2 Walls: {quoridorState.players[1].wallsRemaining}</span>
              </div>
            </div>
          )}

          {/* MONOPOLY BOARD */}
          {selectedGame === 'monopoly' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="w-full grid grid-cols-4 md:grid-cols-7 gap-2 p-3 bg-[#050D17] border border-white/15 rounded-2xl">
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
                  className="px-3.5 py-1.5 bg-white/10 text-white hover:bg-white/20 border border-white/15 text-[10px] font-bold uppercase rounded-full cursor-pointer transition-all"
                >
                  Verify Seed HMAC ↗
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Move Stream Log Side Panel */}
        <div className="col-span-12 lg:col-span-4 bg-[#0A1827]/80 border border-white/15 p-5 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col h-[420px] font-mono text-xs">
          <div className="border-b border-white/10 pb-3 mb-3 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-slate-300 tracking-wider">
              Live Game Event Stream
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
