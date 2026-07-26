import React from 'react';
import { Agent, WalletLimits } from '../types/arena';

interface LeftRailProps {
  agents: Agent[];
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenRegisterModal: () => void;
  walletLimits: WalletLimits;
  onOpenWalletModal: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onOpenRegisterModal,
  walletLimits,
  onOpenWalletModal,
}) => {
  const lossPercent = Math.min(
    100,
    Math.round((walletLimits.currentSessionLoss / walletLimits.sessionLossLimit) * 100)
  );

  return (
    <aside className="w-64 border-r border-[#222226] flex flex-col bg-[#0C0C10] shrink-0 select-none overflow-y-auto">
      {/* Agents Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-bold text-[#666] tracking-wider uppercase">Registered Agents</span>
          <span className="text-[9px] font-mono text-cyan-500/80">{agents.length} Active</span>
        </div>

        <div className="space-y-1.5">
          {agents.map((agent) => {
            const isSelected = agent.id === activeAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`p-2.5 flex items-center justify-between group cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#1A1A22] border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'bg-transparent hover:bg-[#14141A] border-transparent hover:border-[#2D2D36]'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>
                      {agent.name}
                    </span>
                    {agent.certifiedGames.length > 0 && (
                      <span className="text-[8px] px-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-2xs font-mono shrink-0">
                        {agent.certifiedGames.length}G
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-[#555] font-mono truncate">
                    {agent.apiKey.slice(0, 14)}...
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isSelected ? (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]"></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-slate-500"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="w-full mt-4 border border-dashed border-[#333] hover:border-cyan-500/60 py-2.5 text-[10px] uppercase font-bold text-[#666] hover:text-cyan-400 bg-transparent hover:bg-[#121218] transition-all cursor-pointer"
        >
          + Register Agent
        </button>
      </div>

      {/* Financial Controls Section */}
      <div className="mt-auto p-4 border-t border-[#222226] bg-[#0E0E12]">
        <div className="text-[9px] font-bold text-[#666] tracking-wider uppercase mb-3">
          Financial Controls
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-[#888]">Session Loss Limit</span>
              <span className="text-[10px] font-mono text-slate-300">
                {walletLimits.currentSessionLoss.toLocaleString()} / {walletLimits.sessionLossLimit.toLocaleString()} c
              </span>
            </div>
            <div className="h-1.5 bg-[#1A1A22] rounded-full overflow-hidden border border-[#222]">
              <div
                className={`h-full transition-all duration-300 ${
                  lossPercent > 80 ? 'bg-red-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${lossPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#888]">Max Bid / Match</span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold">
              {walletLimits.maxBidPerMatch.toLocaleString()} c
            </span>
          </div>

          <button
            onClick={onOpenWalletModal}
            className="w-full bg-[#1F1F26] hover:bg-[#2A2A33] border border-[#333] hover:border-slate-500 text-[10px] uppercase py-2 font-bold text-slate-200 transition-colors cursor-pointer"
          >
            Manage Wallet
          </button>
        </div>
      </div>
    </aside>
  );
};
