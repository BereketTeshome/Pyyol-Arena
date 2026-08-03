import React, { useState } from 'react';
import { Agent, WalletLimits } from '../types/arena';

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
        className={`fixed lg:relative top-0 bottom-0 left-0 z-40 bg-[#0C0C12] border-r border-[#22222A] flex flex-col shrink-0 select-none transition-all duration-300 font-mono ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        {/* Header & Collapse Toggle */}
        <div className="p-3 border-b border-[#1E1E28] flex items-center justify-between bg-[#101018]">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-[10px] font-bold text-slate-200 tracking-wider uppercase">
                Registered Bots ({agents.length})
              </span>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded bg-[#1A1A26] border border-[#2A2A38] text-slate-300 hover:text-white hover:bg-cyan-950/60 transition-all cursor-pointer mx-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? '➔' : '⬅'}
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Agents List Section */}
        <div className="flex-1 p-2 overflow-y-auto space-y-1.5">
          {agents.map((agent) => {
            const isSelected = agent.id === activeAgentId;
            const initials = agent.name.slice(0, 2).toUpperCase();

            if (isCollapsed) {
              return (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  title={`${agent.name} (${agent.certifiedGames.join(', ') || 'Uncertified'})`}
                  className={`w-12 h-12 rounded flex flex-col items-center justify-center mx-auto transition-all cursor-pointer relative border ${
                    isSelected
                      ? 'bg-white text-black font-black border-cyan-400 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                      : 'bg-[#14141E] text-slate-300 border-[#222230] hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs font-bold">{initials}</span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-black" />
                  )}
                </button>
              );
            }

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`p-2.5 rounded flex items-center justify-between group cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-white text-black border-cyan-400 shadow-[0_0_15px_rgba(255,255,255,0.15)] font-bold'
                    : 'bg-[#12121A] text-slate-300 border-[#1E1E2A] hover:bg-[#181824] hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs truncate ${
                        isSelected ? 'text-black font-extrabold' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {agent.name}
                    </span>
                    {agent.certifiedGames.length > 0 && (
                      <span
                        className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold ${
                          isSelected
                            ? 'bg-black text-cyan-300 border border-black/20'
                            : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        }`}
                      >
                        {agent.certifiedGames.length}G
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-mono truncate ${
                      isSelected ? 'text-slate-700' : 'text-slate-500'
                    }`}
                  >
                    {agent.apiKey.slice(0, 14)}...
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isSelected ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-slate-400"></div>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={onOpenRegisterModal}
            className={`w-full mt-3 border border-dashed border-[#3A3A4A] hover:border-cyan-400 py-2.5 text-[10px] uppercase font-bold text-slate-400 hover:text-cyan-300 bg-[#12121A] hover:bg-[#1A1A28] transition-all cursor-pointer flex items-center justify-center gap-1 rounded ${
              isCollapsed ? 'px-0' : 'px-2'
            }`}
            title="Register New Agent"
          >
            <span>+</span>
            {!isCollapsed && <span>Register Agent</span>}
          </button>
        </div>

        {/* Financial Controls Footer */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-[#1E1E28] bg-[#0A0A10] space-y-2.5">
            <div className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
              Financial Risk Limits
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-400">Session Loss</span>
                  <span className="text-[10px] font-mono text-white font-bold">
                    {walletLimits.currentSessionLoss.toLocaleString()} / {walletLimits.sessionLossLimit.toLocaleString()} c
                  </span>
                </div>
                <div className="h-1.5 bg-[#181822] rounded-full overflow-hidden border border-[#282836]">
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
                <span className="font-mono text-amber-300 font-bold">
                  {walletLimits.maxBidPerMatch.toLocaleString()} c
                </span>
              </div>

              <button
                onClick={onOpenWalletModal}
                className="w-full bg-white text-black hover:bg-slate-200 border border-white font-extrabold text-[10px] uppercase py-1.5 transition-all cursor-pointer rounded shadow-[0_0_10px_rgba(255,255,255,0.15)]"
              >
                Manage Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-[#1E1E28] bg-[#0A0A10] flex flex-col items-center">
            <button
              onClick={onOpenWalletModal}
              className="w-10 h-10 rounded bg-white text-black font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-md"
              title="Manage Wallet Limits"
            >
              💳
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

