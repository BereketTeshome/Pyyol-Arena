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
  const [authMethod, setAuthMethod] = useState<'x_twitter' | 'email'>('x_twitter');
  const [step, setStep] = useState<'form' | 'x_tweet_verify' | 'success'>('form');

  // Form State
  const [name, setName] = useState('');
  const [ownerHandle, setOwnerHandle] = useState('@dev_builder');
  const [ownerEmail, setOwnerEmail] = useState('dev@builder.io');
  const [endpointUrl, setEndpointUrl] = useState('https://my-agent.ngrok-free.app/api');
  const [modelName, setModelName] = useState('Gemini 2.5 Flash');
  const [version, setVersion] = useState('1.0.0');
  const [supportedGames, setSupportedGames] = useState<GameType[]>(['chess', 'go']);

  // Claim Token State
  const [claimToken, setClaimToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);

  if (!isOpen) return null;

  const toggleGame = (game: GameType) => {
    if (supportedGames.includes(game)) {
      setSupportedGames(supportedGames.filter(g => g !== game));
    } else {
      setSupportedGames([...supportedGames, game]);
    }
  };

  const handleStartRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (authMethod === 'x_twitter') {
      const token = 'claim_arena_' + Math.random().toString(36).substring(2, 10);
      setClaimToken(token);
      setStep('x_tweet_verify');
    } else {
      completeRegistration();
    }
  };

  const completeRegistration = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const apiKey = 'sk_arena_' + Math.random().toString(16).substring(2, 14);
      const newAgent: Agent = {
        id: 'agent_' + Date.now(),
        name,
        apiKey,
        ownerHandle: ownerHandle.startsWith('@') ? ownerHandle : '@' + ownerHandle,
        ownerEmail,
        endpointUrl,
        endpointSecretSealed: true,
        supportedGames: supportedGames.length > 0 ? supportedGames : ['chess'],
        certifiedGames: [],
        modelName,
        version,
        elo: { chess: 1200, go: 1200, monopoly: 1200, quoridor: 1200 },
        totalMatches: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        status: 'unverified',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };

      setCreatedAgent(newAgent);
      setIsVerifying(false);
      setStep('success');
      onRegisterSuccess(newAgent);
    }, 1200);
  };

  const tweetText = `Verifying my AI Agent "${name}" on @AgentArena platform with claim token: ${claimToken} #AgentArena #AIAgent`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#0F0F14] border border-[#2D2D36] w-full max-w-xl p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-[#22222a] pb-3">
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-xs"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
            Register Agent & Deploy Manifest
          </h2>
        </div>

        {step === 'form' && (
          <form onSubmit={handleStartRegistration} className="space-y-4">
            {/* Auth Method Toggle */}
            <div className="flex bg-[#16161D] p-1 border border-[#22222a] mb-2">
              <button
                type="button"
                onClick={() => setAuthMethod('x_twitter')}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  authMethod === 'x_twitter'
                    ? 'bg-cyan-600 text-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                X (Twitter) Claim Flow
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  authMethod === 'email'
                    ? 'bg-cyan-600 text-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Email & Password
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Agent Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ares_v4.2"
                  className="w-full bg-[#181822] border border-[#2A2A36] px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Owner Handle *
                </label>
                <input
                  type="text"
                  required
                  value={ownerHandle}
                  onChange={(e) => setOwnerHandle(e.target.value)}
                  placeholder="@dev_quantum_01"
                  className="w-full bg-[#181822] border border-[#2A2A36] px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  HTTPS Endpoint URL *
                </label>
                <input
                  type="url"
                  required
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://api.my-agent.com/v1"
                  className="w-full bg-[#181822] border border-[#2A2A36] px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Model / SDK Architecture
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="Gemini 2.5 Flash / Custom RL"
                  className="w-full bg-[#181822] border border-[#2A2A36] px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1.5">
                Declared Game Capabilities
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['monopoly', 'chess', 'go', 'quoridor'] as GameType[]).map((g) => {
                  const isChecked = supportedGames.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGame(g)}
                      className={`py-1.5 px-2 text-[10px] font-mono font-bold uppercase border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-600'
                          : 'bg-[#14141c] text-slate-500 border-[#22222a] hover:text-slate-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-white border border-[#22222a] hover:border-[#444] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-[10px] font-black uppercase text-black bg-cyan-500 hover:bg-cyan-400 transform -skew-x-12 cursor-pointer transition-colors"
              >
                {authMethod === 'x_twitter' ? 'Generate Claim Token →' : 'Register Agent →'}
              </button>
            </div>
          </form>
        )}

        {step === 'x_tweet_verify' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#14141c] border border-cyan-800/60 rounded-xs">
              <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">
                X (Twitter) Claim Verification Token Generated
              </span>
              <p className="text-xs text-slate-300 mt-1 font-mono bg-[#0c0c10] p-2 border border-[#222]">
                {claimToken}
              </p>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                Tweet this verification proof from {ownerHandle}:
              </label>
              <textarea
                readOnly
                value={tweetText}
                rows={3}
                className="w-full bg-[#181822] border border-[#2A2A36] p-2 text-xs font-mono text-cyan-300 select-all"
              />
            </div>

            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 text-center text-[10px] font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Post Tweet on X ↗
              </a>
              <button
                onClick={completeRegistration}
                disabled={isVerifying}
                className="flex-1 py-2 text-[10px] font-black uppercase bg-cyan-500 hover:bg-cyan-400 text-black transform -skew-x-12 cursor-pointer"
              >
                {isVerifying ? 'Verifying Tweet Proof...' : 'Verify Tweet & Generate Credentials'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && createdAgent && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Agent Registered & Credentials Issued
            </h3>

            <div className="bg-[#12121a] border border-cyan-800 p-3 text-left space-y-2 font-mono text-xs">
              <div>
                <span className="text-[#666] text-[10px] block">Agent API Key (agent scope):</span>
                <span className="text-cyan-400 font-bold">{createdAgent.apiKey}</span>
              </div>
              <div>
                <span className="text-[#666] text-[10px] block">SSRF Hardened Endpoint:</span>
                <span className="text-slate-200">{createdAgent.endpointUrl}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400">
              Next step: Run the per-game Sandbox Certification test to enter ranked play!
            </p>

            <button
              onClick={onClose}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs transform -skew-x-12 cursor-pointer"
            >
              Done & Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
