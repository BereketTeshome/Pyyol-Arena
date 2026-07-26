import React, { useState, useEffect } from 'react';
import { Agent, GameType, SandboxCheckKey, SandboxCertificationRun } from '../types/arena';
import { runPerGameSandbox } from '../services/sandboxEngine';
import { GAME_CATALOG } from '../data/mockInitialData';

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
  const [mode, setMode] = useState<'endpoint' | 'engine'>('endpoint');
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
      mode,
      (logLine, currentChecks, isDone) => {
        setLogs(prev => [...prev, logLine]);
        if (currentChecks) setChecks(currentChecks as Record<SandboxCheckKey, boolean>);
        if (isDone) setIsRunning(false);
      }
    );

    setLastRun(runResult);
    if (runResult.status === 'passed') {
      onCertificationSuccess(agent.id, selectedGame);
    }
  };

  const isAlreadyCertified = agent.certifiedGames.includes(selectedGame);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-grid-pattern p-6 gap-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#22222a] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              PER-GAME CERTIFICATION ENGINE
            </span>
            {isAlreadyCertified && (
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold px-2 py-0.5 uppercase font-mono">
                ✓ CERTIFIED FOR {selectedGame.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-tight">
            Sandbox Test Suite: {agent.name}
          </h1>
          <p className="text-xs text-[#777] font-mono mt-0.5">
            Certification tests if an agent can play legal, complete games — skill is measured later by ranked ELO.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Selector */}
          <div className="flex bg-[#121218] border border-[#2d2d38] p-1">
            <button
              onClick={() => setMode('endpoint')}
              className={`px-3 py-1 text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                mode === 'endpoint' ? 'bg-cyan-500 text-black font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Endpoint Mode
            </button>
            <button
              onClick={() => setMode('engine')}
              className={`px-3 py-1 text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                mode === 'engine' ? 'bg-cyan-500 text-black font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Engine Mode
            </button>
          </div>

          <button
            onClick={handleStartSandbox}
            disabled={isRunning}
            className={`px-6 py-2 font-black text-xs uppercase transform -skew-x-12 cursor-pointer transition-all ${
              isRunning
                ? 'bg-amber-500 text-black animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isRunning ? 'Running Sandbox Match...' : 'Execute Sandbox Test →'}
          </button>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GAME_CATALOG.map((g) => {
          const isSelected = selectedGame === g.id;
          const isCert = agent.certifiedGames.includes(g.id);
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className={`p-3 border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#181822] border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-[#0E0E12] border-[#22222a] hover:bg-[#14141a]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold uppercase ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {g.name}
                </span>
                {isCert ? (
                  <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1 font-mono">
                    ✓ PASSED
                  </span>
                ) : (
                  <span className="text-[8px] text-slate-500 font-mono">UNTESTED</span>
                )}
              </div>
              <p className="text-[9px] text-[#666] line-clamp-1">{g.description}</p>
            </div>
          );
        })}
      </div>

      {/* 6-Point Certification Checklist Grid */}
      <div className="bg-[#0F0F14] border border-[#22222a] p-4">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block mb-3">
          Certification Standards (6 Criteria - Must Pass All 6)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {checkDetails.map((check) => {
            const passed = checks[check.key];
            return (
              <div
                key={check.key}
                className={`p-3 border flex items-start gap-3 transition-colors ${
                  passed
                    ? 'bg-emerald-950/20 border-emerald-800/80'
                    : 'bg-[#121218] border-[#22222a]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    passed
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                      : 'border-[#444] text-[#555]'
                  }`}
                >
                  {passed ? '✓' : '•'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold uppercase ${passed ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {check.label}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">{check.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Live Sandbox Terminal Output */}
      <div className="flex-1 flex flex-col bg-black border border-[#22222a] min-h-[260px] font-mono text-[10px]">
        <div className="bg-[#111116] px-3 py-2 border-b border-[#22222a] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-bold text-[#888] uppercase tracking-wider">
              Live Sandbox Runner Terminal Console ({selectedGame.toUpperCase()})
            </span>
          </div>
          <span className="text-[9px] text-[#555]">
            {logs.length} lines logged
          </span>
        </div>

        <div className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[320px] select-text bg-[#050507]">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic p-4 text-center">
              Click "Execute Sandbox Test" to launch live match certification against platform engine.
            </div>
          ) : (
            logs.map((line, i) => {
              let color = 'text-slate-300';
              if (line.includes('SYSTEM')) color = 'text-cyan-400 font-bold';
              else if (line.includes('CHECK PASSED')) color = 'text-emerald-400 font-bold';
              else if (line.includes('MOVE')) color = 'text-white';
              else if (line.includes('CERTIFICATE ISSUED')) color = 'text-cyan-300 font-black bg-cyan-950/60 p-1 border border-cyan-800';
              else if (line.includes('PROBE')) color = 'text-slate-400';
              
              return (
                <div key={i} className={color}>
                  {line}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
