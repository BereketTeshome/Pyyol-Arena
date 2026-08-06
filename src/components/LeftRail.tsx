import React, { useState } from 'react';
import { Agent } from '../types/arena';
import { ChevronLeft, ChevronRight, X, Plus, Bot, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface LeftRailProps {
  agents: Agent[];
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenRegisterModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onOpenRegisterModal,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

        {/* Info Note on Verification */}
        {!isCollapsed && (
          <div className="px-3 py-2 bg-cyan-950/40 border-b border-cyan-500/20 text-[9px] font-mono text-cyan-200/90 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
            <span>Only Sandbox-Verified agents can play ranked games.</span>
          </div>
        )}

        {/* Agents List Section */}
        <div className="flex-1 p-2.5 overflow-y-auto space-y-2">
          {agents.map((agent) => {
            const isSelected = agent.id === activeAgentId;
            const initials = agent.name.slice(0, 2).toUpperCase();
            const isVerified = agent.certifiedGames.length > 0 || agent.status === 'active';

            if (isCollapsed) {
              return (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  title={`${agent.name} - ${isVerified ? 'Verified Sandbox' : 'Unverified (Requires Sandbox Pass)'}`}
                  className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center mx-auto transition-all cursor-pointer relative border ${
                    isSelected
                      ? 'bg-[#0d3448] text-white font-bold border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'bg-[#082233] text-slate-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-xs font-bold">{initials}</span>
                  <span
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-[#071321] ${
                      isVerified ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'
                    }`}
                  />
                </button>
              );
            }

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`p-2 px-2.5 rounded-xl flex flex-col gap-1 group cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0d3448] to-[#072433] text-white border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)] font-bold'
                    : 'bg-[#082233]/80 text-slate-300 border-white/10 hover:bg-[#0c3149] hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-cyan-200 font-bold' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {agent.name}
                    </span>
                  </div>

                  {/* Verification Status Badge */}
                  {isVerified ? (
                    <span className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50 shrink-0">
                      <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                      Unverified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className={isSelected ? 'text-cyan-300/80' : 'text-slate-400'}>
                    {agent.modelName || 'Gemini Agent'}
                  </span>
                  <span className="text-slate-400">
                    {agent.certifiedGames.length > 0 ? `${agent.certifiedGames.length} Game(s)` : 'No pass'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Register Agent Button moved to bottom footer */}
        <div className="p-3 border-t border-white/10 bg-[#03111c]">
          <button
            onClick={onOpenRegisterModal}
            className={`w-full border border-dashed border-cyan-400/50 hover:border-cyan-300 py-2.5 text-[10px] uppercase font-bold text-cyan-200 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-2xl shadow-lg ${
              isCollapsed ? 'px-0' : 'px-3'
            }`}
            title="Register New Agent"
          >
            <Plus className="w-4 h-4 text-cyan-300 shrink-0" />
            {!isCollapsed && <span>+ Register Agent</span>}
          </button>
        </div>
      </aside>
    </>
  );
};



