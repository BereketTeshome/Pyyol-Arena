import React, { useState } from 'react';
import { Agent, WalletLimits } from '../types/arena';
import { ChevronLeft, ChevronRight, X, Plus, Wallet, ShieldAlert, Bot } from 'lucide-react';

interface LeftRailProps {
  agents: Agent[];
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenRegisterModal: () => void;
  walletLimits: WalletLimits;
  onOpenWalletModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onOpenRegisterModal,
  walletLimits,
  onOpenWalletModal,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const lossPercent = Math.min(
    100,
    Math.round((walletLimits.currentSessionLoss / walletLimits.sessionLossLimit) * 100)
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:relative top-0 bottom-0 left-0 z-40 bg-[#051825]/95 backdrop-blur-2xl border-r border-white/15 flex flex-col shrink-0 select-none transition-all duration-300 font-sans text-white ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        {/* Header & Collapse Toggle */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#03111c]">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase font-mono">
                Registered Bots ({agents.length})
              </span>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-xl bg-white/10 border border-white/20 text-slate-200 hover:text-white hover:bg-white/20 transition-all cursor-pointer mx-auto text-xs"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Agents List Section */}
        <div className="flex-1 p-2.5 overflow-y-auto space-y-2">
          {agents.map((agent) => {
            const isSelected = agent.id === activeAgentId;
            const initials = agent.name.slice(0, 2).toUpperCase();

            if (isCollapsed) {
              return (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  title={`${agent.name} (${agent.certifiedGames.join(', ') || 'Uncertified'})`}
                  className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center mx-auto transition-all cursor-pointer relative border ${
                    isSelected
                      ? 'bg-[#0d3448] text-white font-bold border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'bg-[#082233] text-slate-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-xs font-bold">{initials}</span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-[#071321]" />
                  )}
                </button>
              );
            }

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`p-3 rounded-2xl flex items-center justify-between group cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0d3448] to-[#072433] text-white border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] font-bold'
                    : 'bg-[#082233]/80 text-slate-300 border-white/10 hover:bg-[#0c3149] hover:border-white/25'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs truncate ${
                        isSelected ? 'text-cyan-200 font-bold' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {agent.name}
                    </span>
                    {agent.certifiedGames.length > 0 && (
                      <span
                        className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isSelected
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/50'
                            : 'bg-[#03111c] text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {agent.certifiedGames.length}G
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-mono truncate ${
                      isSelected ? 'text-cyan-300/80' : 'text-slate-400'
                    }`}
                  >
                    {agent.apiKey.slice(0, 14)}...
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isSelected ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-300"></div>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={onOpenRegisterModal}
            className={`w-full mt-3 border border-dashed border-white/25 hover:border-cyan-300 py-2.5 text-[10px] uppercase font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-2xl ${
              isCollapsed ? 'px-0' : 'px-2'
            }`}
            title="Register New Agent"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-300" />
            {!isCollapsed && <span>Register Agent</span>}
          </button>
        </div>

        {/* Financial Controls Footer */}
        {!isCollapsed ? (
          <div className="p-3.5 border-t border-white/10 bg-[#03111c] space-y-3 font-mono">
            <div className="text-[9px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-300" />
              <span>Financial Risk Limits</span>
            </div>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-400">Session Loss</span>
                  <span className="text-[10px] font-mono text-white font-bold">
                    {walletLimits.currentSessionLoss.toLocaleString()} / {walletLimits.sessionLossLimit.toLocaleString()} c
                  </span>
                </div>
                <div className="h-1.5 bg-[#082233] rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      lossPercent > 80 ? 'bg-red-500' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${lossPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Max Bid / Match</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {walletLimits.maxBidPerMatch.toLocaleString()} c
                </span>
              </div>

              <button
                onClick={onOpenWalletModal}
                className="w-full bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-[10px] uppercase py-2.5 transition-all cursor-pointer rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-teal-700" />
                <span>Manage Wallet</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-white/10 bg-[#03111c] flex flex-col items-center">
            <button
              onClick={onOpenWalletModal}
              className="w-10 h-10 rounded-xl bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-xs flex items-center justify-center cursor-pointer shadow-md"
              title="Manage Wallet Limits"
            >
              <Wallet className="w-4 h-4 text-teal-700" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};


