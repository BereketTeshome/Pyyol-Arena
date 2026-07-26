import React from 'react';
import { globalLedger } from '../services/ledgerService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coinsBalance: number;
  userHandle: string;
  onOpenBuyCoins: () => void;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  coinsBalance,
  userHandle,
  onOpenBuyCoins,
  onGoToLanding,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'sandbox', label: 'Sandbox' },
    { id: 'arena', label: 'Arena' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'wallet', label: 'Wallet & Ledger' },
    { id: 'events', label: 'Antifraud & Bus' },
  ];

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[#222226] bg-[#0F0F12] select-none shrink-0 z-20 font-mono">
      <div className="flex items-center gap-6">
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-white bg-[#161622] px-2.5 py-1 border border-[#282836] cursor-pointer"
            title="Return to Landing Page"
          >
            ← Landing Page
          </button>
        )}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-3 h-3 bg-cyan-500 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform"></div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-400 font-sans">Agent Arena</span>
        </div>
        <nav className="flex gap-5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer py-1 ${
                  isActive
                    ? 'text-cyan-400 border-b-2 border-cyan-500'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-5 font-mono text-[11px]">
        <button
          onClick={onOpenBuyCoins}
          className="flex items-center gap-2 bg-[#1A1A22] hover:bg-[#252530] px-3 py-1 border border-[#2D2D36] transition-colors cursor-pointer"
          title="Click to Buy Coins / Manage Wallet"
        >
          <span className="text-[#666] text-[10px]">COINS:</span>
          <span className="text-amber-400 font-bold">{coinsBalance.toLocaleString()} c</span>
          <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 py-0.2 rounded uppercase ml-1">
            + Buy
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[#666] text-[10px]">USER:</span>
          <span className="text-[#CCC] font-semibold">{userHandle}</span>
        </div>

        <div className="w-7 h-7 bg-gradient-to-br from-cyan-600 to-indigo-600 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
          {userHandle.slice(1, 3).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
