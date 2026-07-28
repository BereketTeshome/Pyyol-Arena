import React, { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coinsBalance: number;
  userHandle: string;
  onOpenBuyCoins: () => void;
  onGoToLanding?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  coinsBalance,
  userHandle,
  onOpenBuyCoins,
  onGoToLanding,
  onToggleMobileSidebar,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'sandbox', label: 'Sandbox' },
    { id: 'arena', label: 'Arena' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'wallet', label: 'Wallet & Ledger' },
    { id: 'events', label: 'Antifraud & Bus' },
  ];

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col shrink-0 select-none z-30 font-mono">
      {/* Main Header Bar */}
      <header className="h-14 flex items-center justify-between px-3 md:px-6 border-b border-[#22222C] bg-[#0A0A0E]">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          {/* Mobile Bot Rail Toggle */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 rounded bg-[#181824] border border-[#2A2A38] text-white hover:text-cyan-400 cursor-pointer flex items-center gap-1 text-xs"
              title="Toggle Agent Sidebar"
            >
              <span className="text-[9px] font-bold text-slate-300">Bots Rail</span>
            </button>
          )}

          {/* Landing Page Button */}
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="text-[10px] uppercase font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 sm:px-2.5 py-1 border border-white/20 cursor-pointer rounded transition-all shrink-0"
              title="Return to Landing Page"
            >
              <span className="sm:hidden">← Landing</span>
              <span className="hidden sm:inline">← Landing Page</span>
            </button>
          )}

          {/* Logo (P icon removed) */}
          <div 
            onClick={() => handleTabSelect('dashboard')} 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <span className="text-xs font-black tracking-widest uppercase text-white font-sans hidden xs:inline">
              Agent Arena
            </span>
          </div>

          {/* Desktop Tab Navigation (Clean text + crisp white underline on active) */}
          <nav className="hidden lg:flex gap-1 xl:gap-2 ml-2 h-14 items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`text-[11px] uppercase font-extrabold tracking-wider transition-colors cursor-pointer px-3 py-4 relative whitespace-nowrap h-full flex items-center justify-center ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Coins & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenBuyCoins}
            className="flex items-center gap-1.5 bg-[#14141E] hover:bg-[#1C1C2A] px-2.5 py-1 border border-[#2D2D3E] rounded transition-all cursor-pointer shadow-sm"
            title="Click to Buy Coins / Manage Wallet"
          >
            <span className="text-slate-400 text-[10px] hidden sm:inline">COINS:</span>
            <span className="text-amber-300 font-bold text-xs">{coinsBalance.toLocaleString()} c</span>
            <span className="text-[9px] bg-amber-400 text-black font-black px-1.5 py-0.2 rounded uppercase ml-0.5 shadow-[0_0_6px_rgba(251,191,36,0.5)]">
              + Buy
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-300 font-bold">{userHandle}</span>
          </div>

          <div className="w-7 h-7 bg-white text-black rounded-full border border-white flex items-center justify-center text-[10px] font-black shadow-md shrink-0">
            {userHandle.slice(1, 3).toUpperCase()}
          </div>

          {/* Mobile Navigation Drawer Trigger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden px-2 py-1.5 rounded bg-white/10 border border-white/20 text-white hover:bg-white/20 cursor-pointer text-xs font-bold ml-1"
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </header>

      {/* Sub-Header Horizontal Touch Nav Strip for Mobile & Tablet (lg:hidden) */}
      <div className="lg:hidden bg-[#0D0D14] border-b border-[#222230] px-3 flex items-center gap-3 overflow-x-auto no-scrollbar shadow-inner h-10">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer px-2 py-2 relative whitespace-nowrap shrink-0 h-full flex items-center ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dropdown Mobile Navigation Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0F18] border-b border-[#28283A] p-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-[#202030] pb-1">
            Arena Navigation
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`p-2.5 rounded text-xs font-extrabold uppercase flex items-center justify-between cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-white/15 text-white border-white border-b-2 font-black'
                      : 'bg-[#161622] text-slate-300 border-[#262638] hover:bg-[#1C1C2A] hover:text-white'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,1)]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#202030] flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>User: <strong className="text-white">{userHandle}</strong></span>
            <span>Balance: <strong className="text-amber-300">{coinsBalance.toLocaleString()} c</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};


