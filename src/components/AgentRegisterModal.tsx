import React, { useState } from 'react';
import { Agent, GameType } from '../types/arena';

interface AgentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newAgent: Agent) => void;
}

export const AgentRegisterModal: React.FC<AgentRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [deploymentType, setDeploymentType] = useState<'managed_ai' | 'external_http'>('managed_ai');
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form State
  const [name, setName] = useState('');
  const [ownerHandle, setOwnerHandle] = useState('@beki');
  const [ownerEmail, setOwnerEmail] = useState('beki@pyyol.io');
  
  // Managed AI & Intelligence Decision State
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Flash');
  const [systemPrompt, setSystemPrompt] = useState(
    'Maximize territorial board control. Evaluate move depth and prioritize king safety in chess and high-yield property acquisitions in monopoly.'
  );
  const [decisionStrategy, setDecisionStrategy] = useState<'mcts' | 'heuristic' | 'chain_of_thought' | 'minimax'>('mcts');
  const [riskTolerance, setRiskTolerance] = useState<'aggressive' | 'balanced' | 'defensive' | 'risk_averse'>('balanced');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [contextMemoryWindow, setContextMemoryWindow] = useState<'last_5_turns' | 'full_game_fen' | 'opponent_profiling'>('full_game_fen');
  const [moveTimeoutMs, setMoveTimeoutMs] = useState<string>('1000ms');
  const [fallbackPolicy, setFallbackPolicy] = useState<'random_legal' | 'pass_turn' | 'safety_evasion'>('random_legal');

  // External HTTP State
  const [endpointUrl, setEndpointUrl] = useState('https://ares-bot-api.run.app/v1/move');
  const [hmacSecret, setHmacSecret] = useState('secret_hmac_' + Math.random().toString(36).substring(2, 10));

  // Games State
  const [supportedGames, setSupportedGames] = useState<GameType[]>(['chess', 'go', 'monopoly']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);

  if (!isOpen) return null;

  const toggleGame = (game: GameType) => {
    if (supportedGames.includes(game)) {
      if (supportedGames.length > 1) {
        setSupportedGames(supportedGames.filter(g => g !== game));
      }
    } else {
      setSupportedGames([...supportedGames, game]);
    }
  };

  const handleRegisterAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const apiKey = 'sk_arena_' + Math.random().toString(16).substring(2, 14);
      const isManaged = deploymentType === 'managed_ai';
      
      const newAgent: Agent = {
        id: 'agent_' + Date.now(),
        name: name.trim(),
        apiKey,
        ownerHandle: ownerHandle.startsWith('@') ? ownerHandle : '@' + ownerHandle,
        ownerEmail,
        endpointUrl: isManaged ? `https://arena-internal-ai.run.app/agents/${name.toLowerCase().replace(/\s+/g, '_')}` : endpointUrl,
        endpointSecretSealed: true,
        supportedGames: supportedGames.length > 0 ? supportedGames : ['chess'],
        certifiedGames: isManaged ? supportedGames : [], // Auto-certified for Managed AI platform agents
        modelName: isManaged ? selectedModel : 'External HTTP Bot',
        version: '1.0.0',
        elo: { chess: 1200, go: 1200, monopoly: 1200, quoridor: 1200 },
        totalMatches: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        status: isManaged ? 'active' : 'unverified',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };

      setCreatedAgent(newAgent);
      setIsSubmitting(false);
      setStep('success');
      onRegisterSuccess(newAgent);
    }, 1000);
  };

  const handleRegisterAnother = () => {
    setName('');
    setStep('form');
    setCreatedAgent(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono select-none">
      <div className="bg-[#0C0C12] border border-[#2A2A3C] w-full max-w-2xl rounded-lg shadow-2xl relative overflow-hidden text-slate-200 flex flex-col max-h-[90vh]">
        {/* Top Accent Glow Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 shrink-0" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#202030] flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base font-black text-white uppercase tracking-wider font-serif">
                Create & Register AI Agent
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Deploy autonomous game bots using Pro Pass AI Credits or external REST endpoints.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181824] hover:bg-[#252536] border border-[#2D2D40] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {step === 'form' && (
            <form onSubmit={handleRegisterAgent} className="p-5 sm:p-6 space-y-5">
              {/* Deployment Type Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                  1. Select Deployment Architecture
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeploymentType('managed_ai')}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                      deploymentType === 'managed_ai'
                        ? 'bg-[#151524] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-[#101018] border-[#222234] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase text-white">⚡ Managed AI Agent</span>
                      <span className="text-[9px] bg-amber-400 text-black font-black px-1.5 py-0.5 rounded">
                        Pro AI Credits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Build and run directly on-platform using bundled AI Credits (Gemini / Claude). Zero code required.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeploymentType('external_http')}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                      deploymentType === 'external_http'
                        ? 'bg-[#151524] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-[#101018] border-[#222234] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase text-white">🌐 External REST Endpoint</span>
                      <span className="text-[9px] bg-white/10 text-slate-300 font-bold px-1.5 py-0.5 rounded">
                        Self-Hosted
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Connect your custom hosted server (Python, Node.js, Go) via HMAC-secured HTTP endpoints.
                    </p>
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ares_v5_Master"
                    className="w-full bg-[#141420] border border-[#2A2A3C] rounded px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Owner Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerHandle}
                    onChange={(e) => setOwnerHandle(e.target.value)}
                    placeholder="@beki"
                    className="w-full bg-[#141420] border border-[#2A2A3C] rounded px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Conditional Fields based on Architecture */}
              {deploymentType === 'managed_ai' ? (
                <div className="space-y-3 bg-[#12121D] p-4 border border-[#222236] rounded-lg">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">
                      Model Architecture & Strategy Directives
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      10,000 AI Credits Included
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Gemini 2.5 Flash', 'Claude 3.5 Sonnet', 'Custom RL Policy'].map((model) => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => setSelectedModel(model)}
                        className={`p-2 text-xs font-bold rounded border cursor-pointer transition-all ${
                          selectedModel === model
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-extrabold'
                            : 'bg-[#181826] text-slate-400 border-[#28283C] hover:text-white'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      System Strategy Prompt
                    </label>
                    <textarea
                      rows={2}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className="w-full bg-[#181828] border border-[#28283C] rounded p-2.5 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none font-mono leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-[#12121D] p-4 border border-[#222236] rounded-lg">
                  <label className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider block">
                    Self-Hosted REST Endpoint Configuration
                  </label>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      HTTPS Move Endpoint URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      placeholder="https://my-bot.run.app/v1/move"
                      className="w-full bg-[#181828] border border-[#28283C] rounded px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      HMAC SHA-256 Secret Key
                    </label>
                    <input
                      type="text"
                      value={hmacSecret}
                      onChange={(e) => setHmacSecret(e.target.value)}
                      className="w-full bg-[#181828] border border-[#28283C] rounded px-3 py-2 text-xs text-amber-300 focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Supported Games Multi-Select */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2">
                  2. Target Game Disciplines
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { id: 'chess', label: '♟ Chess' },
                    { id: 'go', label: '⚪ Go 9x9' },
                    { id: 'monopoly', label: '🎲 Monopoly' },
                    { id: 'quoridor', label: '🧱 Quoridor' },
                  ] as { id: GameType; label: string }[]).map((g) => {
                    const isChecked = supportedGames.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGame(g.id)}
                        className={`p-2.5 rounded-md text-xs font-extrabold border cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                            : 'bg-[#12121D] text-slate-400 border-[#222234] hover:text-white'
                        }`}
                      >
                        <span>{g.label}</span>
                        <span className="text-[10px]">{isChecked ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Decision Making Engine & Strategy Settings */}
              <div className="space-y-3 bg-[#12121E] p-4 border border-[#242438] rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    3. Agent Decision Making & Policy Engine
                  </label>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30">
                    Engine Config
                  </span>
                </div>

                {/* Strategy Algorithm */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1.5">
                    Decision Strategy Algorithm
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {([
                      { id: 'mcts', name: 'MCTS Search' },
                      { id: 'heuristic', name: 'Heuristic Minimax' },
                      { id: 'chain_of_thought', name: 'Chain of Thought' },
                      { id: 'minimax', name: 'Alpha-Beta Depth 14' },
                    ] as const).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setDecisionStrategy(s.id)}
                        className={`p-2 text-[11px] font-bold rounded border cursor-pointer transition-all ${
                          decisionStrategy === s.id
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500 font-extrabold shadow-sm'
                            : 'bg-[#181826] text-slate-400 border-[#28283C] hover:text-white'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Risk Profile & Reasoning Depth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                      Risk Profile & Playstyle
                    </label>
                    <select
                      value={riskTolerance}
                      onChange={(e) => setRiskTolerance(e.target.value as any)}
                      className="w-full bg-[#181828] border border-[#28283C] rounded px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none font-mono"
                    >
                      <option value="aggressive">Aggressive (High Risk / High Reward)</option>
                      <option value="balanced">Balanced (Optimal ELO Maximizer)</option>
                      <option value="defensive">Defensive (Solid Position / Counter-attack)</option>
                      <option value="risk_averse">Strict Risk-Averse (Zero Sacrifice)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                      Turn Move Timeout Limit
                    </label>
                    <select
                      value={moveTimeoutMs}
                      onChange={(e) => setMoveTimeoutMs(e.target.value)}
                      className="w-full bg-[#181828] border border-[#28283C] rounded px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none font-mono"
                    >
                      <option value="500ms">500ms (Blitz Ultra Fast)</option>
                      <option value="1000ms">1,000ms (Standard Match Speed)</option>
                      <option value="2000ms">2,000ms (Deep Search Allowance)</option>
                      <option value="5000ms">5,000ms (Grandmaster Tournament)</option>
                    </select>
                  </div>
                </div>

                {/* Context Memory & Fallback Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                      Board History & Context Window
                    </label>
                    <select
                      value={contextMemoryWindow}
                      onChange={(e) => setContextMemoryWindow(e.target.value as any)}
                      className="w-full bg-[#181828] border border-[#28283C] rounded px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none font-mono"
                    >
                      <option value="full_game_fen">Full Game FEN & PGN Notation</option>
                      <option value="last_5_turns">Recent 5 Turns History</option>
                      <option value="opponent_profiling">Full History + Opponent Model Profiling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                      Timeout Fallback Protocol
                    </label>
                    <select
                      value={fallbackPolicy}
                      onChange={(e) => setFallbackPolicy(e.target.value as any)}
                      className="w-full bg-[#181828] border border-[#28283C] rounded px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none font-mono"
                    >
                      <option value="random_legal">Execute Best Fast Heuristic Legal Move</option>
                      <option value="safety_evasion">Priority King Evasion / Material Defense</option>
                      <option value="pass_turn">Pass Turn / Forfeit Turn</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3 border-t border-[#1C1C2A]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold uppercase text-slate-400 hover:text-white bg-[#141420] border border-[#222234] rounded cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 text-xs font-black uppercase text-black bg-white hover:bg-slate-200 rounded cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Building Agent...</span>
                  ) : (
                    <span>Deploy Agent →</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && createdAgent && (
            <div className="p-6 sm:p-8 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto text-2xl font-black shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                ✓
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-serif font-black text-white uppercase tracking-wide">
                  Agent Successfully Deployed
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {deploymentType === 'managed_ai'
                    ? `Agent "${createdAgent.name}" is now active and powered by Pro AI Credits.`
                    : `Agent "${createdAgent.name}" registered. Perform Sandbox certification to unlock ranked matches.`}
                </p>
              </div>

              <div className="bg-[#12121D] border border-[#242438] p-4 rounded-lg text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-[#202032] pb-2">
                  <span className="text-slate-400 font-bold">Agent Name:</span>
                  <span className="text-white font-extrabold">{createdAgent.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#202032] pb-2">
                  <span className="text-slate-400 font-bold">Owner Handle:</span>
                  <span className="text-cyan-300 font-extrabold">{createdAgent.ownerHandle}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#202032] pb-2">
                  <span className="text-slate-400 font-bold">API Key:</span>
                  <span className="text-amber-300 font-extrabold">{createdAgent.apiKey}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Status:</span>
                  <span className="text-emerald-400 font-black uppercase">● Active & Certified</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRegisterAnother}
                  className="py-3 bg-[#181826] hover:bg-[#222236] text-white border border-[#2D2D42] font-extrabold uppercase text-xs rounded cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span>+ Register Another Agent</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 bg-white hover:bg-slate-200 text-black font-black uppercase text-xs rounded cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  Close & View Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
