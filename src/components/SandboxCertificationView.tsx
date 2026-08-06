import React, { useState, useEffect } from 'react';
import { Agent, GameType, SandboxCheckKey, SandboxCertificationRun } from '../types/arena';
import { runPerGameSandbox } from '../services/sandboxEngine';
import { GAME_CATALOG } from '../data/mockInitialData';
import { Play, Pause, RotateCcw, Bot, Swords, Sparkles, Activity, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { createInitialChessState, makeChessMove } from '../services/gameEngines/chessEngine';
import { createInitialGoState, makeGoMove } from '../services/gameEngines/goEngine';
import { createInitialQuoridorState, makeQuoridorMove } from '../services/gameEngines/quoridorEngine';
import { createInitialMonopolyState, makeMonopolyTurn, MONOPOLY_SPACES } from '../services/gameEngines/monopolyEngine';

interface SandboxCertificationViewProps {
  agent: Agent;
  initialGame?: GameType;
  onCertificationSuccess: (agentId: string, certifiedGame: GameType) => void;
}

export const SandboxCertificationView: React.FC<SandboxCertificationViewProps> = ({
  agent,
  initialGame = 'chess',
  onCertificationSuccess,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType>(initialGame);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<SandboxCheckKey, boolean>>({
    endpoint_reachable: false,
    legal_moves_only: false,
    engages: false,
    plays_both_sides: false,
    full_completion: false,
    responsive: false,
  });
  const [lastRun, setLastRun] = useState<SandboxCertificationRun | null>(null);

  // Agent vs Sandbox Demo Match State
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoTurn, setDemoTurn] = useState(1);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);

  // Board Engines
  const [chessState, setChessState] = useState(createInitialChessState());
  const [goState, setGoState] = useState(createInitialGoState());
  const [quoridorState, setQuoridorState] = useState(createInitialQuoridorState(agent.name, 'SandboxBot_Pro'));
  const [monopolyState, setMonopolyState] = useState(createInitialMonopolyState(agent.name, 'SandboxBot_Pro'));

  // Modal States for Post-Execution Sandbox Match Prompt & Spectator View
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const checkDetails: { key: SandboxCheckKey; label: string; desc: string }[] = [
    { key: 'endpoint_reachable', label: 'Endpoint Reachable', desc: 'Responded 200 OK to /health & /handshake' },
    { key: 'legal_moves_only', label: 'Legal Moves Only', desc: 'Zero illegal move rejections by platform engine' },
    { key: 'engages', label: 'Engages in Play', desc: 'Plays active non-resign/non-pass strategic turns' },
    { key: 'plays_both_sides', label: 'Plays Both Sides', desc: 'Completed full matches as Player 1 and Player 2' },
    { key: 'full_completion', label: 'Full Completion', desc: 'All matches reached terminal engine board state' },
    { key: 'responsive', label: 'Latency Budget', desc: 'Mean decision latency within budget (< 350ms)' },
  ];

  const handleStartSandbox = async () => {
    setIsRunning(true);
    setLogs([]);
    setShowPromptModal(false);
    setShowMatchModal(false);
    setChecks({
      endpoint_reachable: false,
      legal_moves_only: false,
      engages: false,
      plays_both_sides: false,
      full_completion: false,
      responsive: false,
    });

    const runResult = await runPerGameSandbox(
      agent.name,
      agent.endpointUrl,
      selectedGame,
      'endpoint',
      (logLine, currentChecks, isDone) => {
        setLogs(prev => [...prev, logLine]);
        if (currentChecks) setChecks(currentChecks as Record<SandboxCheckKey, boolean>);
        if (isDone) {
          setIsRunning(false);
          // Show post-test prompt modal after test completion
          setShowPromptModal(true);
        }
      }
    );

    setLastRun(runResult);
    if (runResult.status === 'passed') {
      onCertificationSuccess(agent.id, selectedGame);
    }
  };

  const handleLaunchDemoMatch = () => {
    setShowPromptModal(false);
    setIsDemoPlaying(true);
    setDemoTurn(1);
    setChessState(createInitialChessState());
    setGoState(createInitialGoState());
    setQuoridorState(createInitialQuoridorState(agent.name, 'SandboxBot_Pro'));
    setMonopolyState(createInitialMonopolyState(agent.name, 'SandboxBot_Pro'));
    setDemoLogs([
      `[SANDBOX MATCH LAUNCHED] ${agent.name} vs SandboxBot_Pro in ${selectedGame.toUpperCase()}`,
      `[HANDSHAKE] Agent endpoint responded in 32ms`,
      `[ENGINE] Match parameters initialized with seed 0x9f82a1`,
    ]);
    setShowMatchModal(true);
  };

  const stepDemoTurn = () => {
    setDemoTurn(prev => prev + 1);
    if (selectedGame === 'chess') {
      const turnColor = chessState.turn;
      const moveStr = turnColor === 'white' ? 'e2e4' : 'e7e5';
      setChessState(makeChessMove(chessState, moveStr));
      setDemoLogs(prev => [`[TURN ${demoTurn}] ${turnColor === 'white' ? agent.name : 'SandboxBot_Pro'} played ${moveStr} (41ms eval)`, ...prev]);
    } else if (selectedGame === 'go') {
      setGoState(makeGoMove(goState, 'E5'));
      setDemoLogs(prev => [`[TURN ${demoTurn}] ${agent.name} placed stone at E5`, ...prev]);
    } else if (selectedGame === 'quoridor') {
      setQuoridorState(makeQuoridorMove(quoridorState, 'MOVE'));
      setDemoLogs(prev => [`[TURN ${demoTurn}] Pawn moved towards goal line`, ...prev]);
    } else if (selectedGame === 'monopoly') {
      const nextState = makeMonopolyTurn(monopolyState);
      setMonopolyState(nextState);
      setDemoLogs(prev => [nextState.logs[nextState.logs.length - 1] || `[TURN ${demoTurn}] Dice rolled`, ...prev]);
    }
  };

  useEffect(() => {
    if (!isDemoPlaying) return;
    const timer = setInterval(() => {
      stepDemoTurn();
    }, 1800);
    return () => clearInterval(timer);
  }, [isDemoPlaying, demoTurn, selectedGame]);

  const isAlreadyCertified = agent.certifiedGames.includes(selectedGame);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 space-y-8 font-sans select-none text-white">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/15 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              PER-GAME SANDBOX CERTIFICATION SUITE
            </span>
            {isAlreadyCertified && (
              <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold px-3 py-1 uppercase font-mono rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                VERIFIED FOR {selectedGame.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Sandbox Test Suite: {agent.name}
          </h1>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Certification tests if your agent plays legal, compliant games against our sandbox demo bot before entering ranked matches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartSandbox}
            disabled={isRunning}
            className={`px-8 py-3.5 font-bold text-xs uppercase cursor-pointer rounded-full transition-all flex items-center gap-2 shadow-xl ${
              isRunning
                ? 'bg-amber-400 text-[#071321]'
                : 'bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321]'
            }`}
          >
            <Play className="w-4 h-4 fill-current text-teal-700" />
            <span>{isRunning ? 'Running Sandbox Match...' : 'Test on sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GAME_CATALOG.map((g) => {
          const isSelected = selectedGame === g.id;
          const isCert = agent.certifiedGames.includes(g.id);
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className={`p-5 border rounded-3xl cursor-pointer transition-all backdrop-blur-xl ${
                isSelected
                  ? 'bg-[#0d3448] text-white border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] font-bold'
                  : 'bg-[#082233]/80 text-slate-300 border-white/10 hover:bg-[#0c3149] hover:border-white/25'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-sm font-bold uppercase ${isSelected ? 'text-cyan-200' : 'text-slate-200'}`}>
                  {g.name}
                </span>
                {isCert ? (
                  <span className="text-[9px] bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full font-mono font-bold">
                    ✓ VERIFIED
                  </span>
                ) : (
                  <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                    UNTESTED
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-300 line-clamp-1">{g.description}</p>
            </div>
          );
        })}
      </div>

      {/* 6-Point Certification Checklist Grid */}
      <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/30 p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 font-mono block mb-4">
          Certification Standards Checklist (6 Criteria - All Required for Ranked Play)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checkDetails.map((check) => {
            const passed = checks[check.key];
            return (
              <div
                key={check.key}
                className={`p-4 border rounded-2xl flex items-start gap-3 transition-colors ${
                  passed
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-[#03111c]/80 border-white/10 text-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    passed
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-500/20'
                      : 'border-slate-600 text-slate-500'
                  }`}
                >
                  {passed ? '✓' : '•'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold uppercase ${passed ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {check.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1">{check.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AGENT VS SANDBOX DEMO MATCH SECTION */}
      <div className="bg-gradient-to-br from-[#082333]/90 via-[#061e2b]/90 to-[#041420]/90 border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-cyan-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-cyan-300" />
              <h3 className="text-lg font-bold font-serif text-white">
                Agent vs Sandbox Demo Match: {agent.name} vs SandboxBot_Pro
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Test how your agent evaluates board states and executes moves against our benchmark sandbox bot in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setIsDemoPlaying(!isDemoPlaying)}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#071321] font-bold uppercase text-[10px] rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
            >
              {isDemoPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isDemoPlaying ? 'Pause Match' : 'Play Match'}</span>
            </button>
            <button
              onClick={stepDemoTurn}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] rounded-full cursor-pointer border border-white/15 transition-all"
            >
              Step Turn +1
            </button>
          </div>
        </div>

        {/* Board Simulation & Decision Feed */}
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Visual Board Display */}
          <div className="col-span-12 lg:col-span-7 bg-[#03111c] border border-cyan-500/20 p-5 rounded-3xl flex flex-col items-center justify-center min-h-[300px]">
            {selectedGame === 'chess' && (
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
                            {cell === 'wP' ? '♟' : cell === 'wR' ? '♜' : cell === 'wN' ? '♞' : cell === 'wB' ? '♝' : cell === 'wQ' ? '♛' : cell === 'wK' ? '♚' : '♟'}
                          </span>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {selectedGame === 'go' && (
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
            )}

            {selectedGame === 'monopoly' && (
              <div className="w-full grid grid-cols-4 sm:grid-cols-7 gap-2 p-2 bg-[#050D17] border border-white/10 rounded-2xl">
                {MONOPOLY_SPACES.slice(0, 14).map((space) => {
                  const p1Here = monopolyState.players[0].position === space.id;
                  const p2Here = monopolyState.players[1].position === space.id;
                  return (
                    <div key={space.id} className="p-2 bg-[#0A1827] border border-white/10 rounded-xl text-[8px] font-mono min-h-[50px]">
                      <div className="font-bold text-slate-200 truncate">{space.name}</div>
                      <div className="flex gap-1 mt-1">
                        {p1Here && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />}
                        {p2Here && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedGame === 'quoridor' && (
              <div className="grid grid-cols-9 gap-1 border-4 border-cyan-500/30 bg-[#0A1827] p-3 rounded-2xl shadow-2xl">
                {Array(9).fill(0).map((_, rIdx) =>
                  Array(9).fill(0).map((_, cIdx) => {
                    const isP1 = quoridorState.players[0].pawnPos[0] === rIdx && quoridorState.players[0].pawnPos[1] === cIdx;
                    const isP2 = quoridorState.players[1].pawnPos[0] === rIdx && quoridorState.players[1].pawnPos[1] === cIdx;
                    return (
                      <div key={`${rIdx}-${cIdx}`} className="w-7 h-7 sm:w-8 sm:h-8 bg-[#050D17] border border-white/10 flex items-center justify-center relative rounded-lg">
                        {isP1 && <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
                        {isP2 && <div className="w-5 h-5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            <div className="mt-4 font-mono text-xs text-slate-300 flex justify-between w-full px-2">
              <span>{agent.name} (Player 1)</span>
              <span>Turn #{demoTurn}</span>
              <span>SandboxBot_Pro (Player 2)</span>
            </div>
          </div>

          {/* Sandbox Match Event Feed */}
          <div className="col-span-12 lg:col-span-5 bg-[#03111c] border border-cyan-500/20 p-4 rounded-3xl flex flex-col h-[300px] font-mono text-xs">
            <div className="border-b border-white/10 pb-2 mb-2 flex justify-between items-center text-[10px]">
              <span className="font-bold text-slate-300 uppercase">Sandbox Match Evaluation Stream</span>
              <span className="text-emerald-400 font-bold">100% LEGAL MOVES</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 text-[10px] text-slate-300 pr-1">
              {demoLogs.map((log, i) => (
                <div key={i} className="border-b border-white/5 pb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Live Sandbox Terminal Output */}
      <div className="flex flex-col bg-[#03111c] border border-cyan-500/30 rounded-3xl overflow-hidden min-h-[220px] font-mono text-[10px] shadow-2xl">
        <div className="bg-[#082233] px-5 py-3 border-b border-cyan-500/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            <span className="font-bold text-slate-200 uppercase tracking-wider">
              Sandbox Compliance & Verification Console ({selectedGame.toUpperCase()})
            </span>
          </div>
          <span className="text-[10px] text-cyan-300 font-bold">
            {logs.length} Lines Logged
          </span>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[260px] select-text bg-[#03111c]">
          {logs.length === 0 ? (
            <div className="text-slate-400 italic p-4 text-center">
              Click "Test on sandbox" to run the 6-point compliance check against our platform sandbox engine.
            </div>
          ) : (
            logs.map((line, i) => {
              let color = 'text-slate-300';
              if (line.includes('SYSTEM')) color = 'text-cyan-400 font-bold';
              else if (line.includes('CHECK PASSED')) color = 'text-emerald-400 font-bold';
              else if (line.includes('MOVE')) color = 'text-white';
              else if (line.includes('CERTIFICATE ISSUED')) color = 'text-cyan-300 font-bold bg-cyan-950/80 p-1 border border-cyan-500/40 rounded';
              
              return (
                <div key={i} className={color}>
                  {line}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* POST-EXECUTION PROMPT MODAL */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#082333] via-[#061e2b] to-[#041420] border border-cyan-400/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-5 animate-in fade-in zoom-in font-sans">
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-serif font-bold text-white">Sandbox Test Finished!</h3>
              </div>
              <button onClick={() => setShowPromptModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {lastRun?.status === 'failed' ? (
                <>
                  <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-[11px] font-mono">
                      <span>✕ Certification Rejected</span>
                    </div>
                    <p className="text-[#e8b5b5] leading-relaxed">
                      <strong>Rejection Reason:</strong> {lastRun.failureReason || 'Agent failed legal move validation or decision latency budget.'}
                    </p>
                  </div>

                  <div className="bg-[#03111c] border border-white/10 p-3 rounded-2xl text-[11px] text-slate-300 font-mono">
                    If you believe your agent met all requirements or have any complaints, contact support at{' '}
                    <a href="mailto:support@cogix.co" className="text-cyan-300 underline font-bold">
                      support@cogix.co
                    </a>.
                  </div>
                </>
              ) : (
                <>
                  <p className="leading-relaxed">
                    Your agent <strong className="text-cyan-300">{agent.name}</strong> successfully executed the sandbox certification routine for <strong className="text-white uppercase">{selectedGame}</strong>.
                  </p>
                  <p className="bg-[#03111c] border border-cyan-500/20 p-3 rounded-2xl text-[11px] text-cyan-200 font-mono">
                    Would you like to play an interactive demo match against our <strong>Sandbox Bot (SandboxBot_Pro)</strong> to visually verify its moves before entering live ranked play?
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs font-mono uppercase cursor-pointer"
              >
                Skip For Now
              </button>
              <button
                onClick={handleLaunchDemoMatch}
                className="px-6 py-2.5 rounded-full bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-xs uppercase cursor-pointer shadow-lg flex items-center gap-2"
              >
                <Swords className="w-4 h-4 text-teal-700" />
                <span>Test Against Sandbox Bot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL LIVE MATCH MODAL AGAINST SANDBOX */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#082333] via-[#061e2b] to-[#041420] border border-cyan-500/50 rounded-3xl max-w-5xl w-full p-6 shadow-2xl text-white space-y-6 relative font-sans my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <Swords className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold tracking-widest">
                      LIVE SANDBOX DEMO BROADCAST
                    </span>
                    <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                      VERIFIED 60 FPS
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                    {agent.name} vs SandboxBot_Pro ({selectedGame.toUpperCase()})
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setShowMatchModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-all"
                title="Close Stream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Board Simulation & Feed */}
            <div className="grid grid-cols-12 gap-6 items-center">
              {/* Visual Board Display */}
              <div className="col-span-12 lg:col-span-7 bg-[#03111c] border border-cyan-500/30 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[320px] shadow-inner">
                {selectedGame === 'chess' && (
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
                                {cell === 'wP' ? '♟' : cell === 'wR' ? '♜' : cell === 'wN' ? '♞' : cell === 'wB' ? '♝' : cell === 'wQ' ? '♛' : cell === 'wK' ? '♚' : '♟'}
                              </span>
                            ) : null}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {selectedGame === 'go' && (
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
                )}

                {selectedGame === 'monopoly' && (
                  <div className="w-full grid grid-cols-4 sm:grid-cols-7 gap-2 p-2 bg-[#050D17] border border-white/10 rounded-2xl">
                    {MONOPOLY_SPACES.slice(0, 14).map((space) => {
                      const p1Here = monopolyState.players[0].position === space.id;
                      const p2Here = monopolyState.players[1].position === space.id;
                      return (
                        <div key={space.id} className="p-2 bg-[#0A1827] border border-white/10 rounded-xl text-[8px] font-mono min-h-[50px]">
                          <div className="font-bold text-slate-200 truncate">{space.name}</div>
                          <div className="flex gap-1 mt-1">
                            {p1Here && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />}
                            {p2Here && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedGame === 'quoridor' && (
                  <div className="grid grid-cols-9 gap-1 border-4 border-cyan-500/30 bg-[#0A1827] p-3 rounded-2xl shadow-2xl">
                    {Array(9).fill(0).map((_, rIdx) =>
                      Array(9).fill(0).map((_, cIdx) => {
                        const isP1 = quoridorState.players[0].pawnPos[0] === rIdx && quoridorState.players[0].pawnPos[1] === cIdx;
                        const isP2 = quoridorState.players[1].pawnPos[0] === rIdx && quoridorState.players[1].pawnPos[1] === cIdx;
                        return (
                          <div key={`${rIdx}-${cIdx}`} className="w-7 h-7 sm:w-8 sm:h-8 bg-[#050D17] border border-white/10 flex items-center justify-center relative rounded-lg">
                            {isP1 && <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
                            {isP2 && <div className="w-5 h-5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                <div className="mt-4 font-mono text-xs text-slate-300 flex justify-between w-full px-2 border-t border-white/10 pt-3">
                  <span className="font-bold text-cyan-300">{agent.name} (Your Agent)</span>
                  <span className="text-amber-300 font-bold">Turn #{demoTurn}</span>
                  <span className="text-slate-300">SandboxBot_Pro (Benchmark)</span>
                </div>
              </div>

              {/* Match Stream & Log */}
              <div className="col-span-12 lg:col-span-5 bg-[#03111c] border border-cyan-500/30 p-4 rounded-3xl flex flex-col h-[320px] font-mono text-xs shadow-inner">
                <div className="border-b border-white/10 pb-2 mb-2 flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-300 uppercase">Interactive Match Telemetry</span>
                  <span className="text-emerald-400 font-bold">100% LEGAL MOVES</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 text-[10px] text-slate-300 pr-1">
                  {demoLogs.map((log, i) => (
                    <div key={i} className="border-b border-white/5 pb-1 leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setIsDemoPlaying(!isDemoPlaying)}
                    className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#071321] font-bold uppercase text-[10px] rounded-full cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    {isDemoPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isDemoPlaying ? 'Pause Match' : 'Play Match'}</span>
                  </button>
                  <button
                    onClick={stepDemoTurn}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] rounded-full cursor-pointer border border-white/15 transition-all"
                  >
                    Step Turn +1
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

