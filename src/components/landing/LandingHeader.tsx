import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingHeaderProps {
  onLaunchDashboard: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onScrollToSection: (sectionId: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLaunchDashboard,
  onOpenAuth,
  onScrollToSection,
}) => {
  const [activeTab, setActiveTab] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Games', id: 'games' },
    { label: 'Workflow', id: 'workflow' },
    { label: 'Live Matches', id: 'live-matches' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onScrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-[#1A1A26] px-4 md:px-8 py-3 flex items-center justify-between font-mono select-none">
      {/* Brand Logo with Ambient Pulsing Glow */}
      <div
        onClick={() => handleNavClick('hero')}
        className="flex items-center gap-2.5 cursor-pointer group relative"
      >
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
          className="w-8 h-8 bg-white text-black font-black text-sm flex items-center justify-center font-serif shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10"
        >
          P
        </motion.div>
        <div className="flex flex-col">
          <span className="text-base font-black tracking-widest text-white uppercase font-serif group-hover:text-cyan-300 transition-colors">
            Pyyol Arena
          </span>
          <span className="text-[8px] text-cyan-400 font-bold tracking-widest uppercase -mt-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></span>
            Agent Protocol
          </span>
        </div>
      </div>

      {/* Futuristic Floating Pill Navigation Bar with Animated Hover Slider */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#0E0E16]/90 border border-[#222234] rounded-full p-1.5 shadow-[0_0_25px_rgba(0,0,0,0.8)] relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-amber-500/10 to-emerald-500/10 blur-md pointer-events-none" />

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-4 py-1.5 text-[11px] font-bold rounded-full transition-colors cursor-pointer z-10 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-[#1E1E2E] border border-cyan-500/40 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}

        <div className="h-4 w-[1px] bg-[#222232] mx-1" />

        <button
          onClick={onLaunchDashboard}
          className="relative px-4 py-1.5 text-[11px] font-extrabold text-cyan-400 hover:text-white group flex items-center gap-1.5 cursor-pointer z-10"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">
            Dashboard →
          </span>
        </button>
      </nav>

      {/* Control Tools & Auth Actions */}
      <div className="flex items-center gap-3">
        {/* Audio / Ambient Video Sound Toggle Control */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[#12121B] border border-[#262638] text-slate-400 hover:text-white hover:border-slate-500 text-xs cursor-pointer transition-all"
          title={isMuted ? 'Unmute Ambient Video Audio' : 'Mute Video Audio'}
        >
          {isMuted ? '🔇' : '🔊'}
        </motion.button>

        <button
          onClick={() => onOpenAuth('login')}
          className="hidden sm:block text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
        >
          Sign In
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenAuth('signup')}
          className="bg-white text-black hover:bg-slate-200 font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        >
          <span>Get Started</span>
          <span className="text-sm">↗</span>
        </motion.button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer focus:outline-none"
        >
          <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Animated Slide Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[#0A0A10]/95 backdrop-blur-2xl border-b border-[#222234] p-6 flex flex-col gap-4 shadow-2xl lg:hidden z-50 font-mono"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-[#161622] rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-[#1C1C2A] pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLaunchDashboard();
                }}
                className="w-full py-2.5 bg-[#141420] text-cyan-400 border border-cyan-800 rounded-lg text-xs font-bold text-center"
              >
                Enter Dashboard →
              </button>

              <div className="flex justify-between items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="flex-1 py-2 bg-[#12121A] text-slate-300 rounded-lg text-xs font-bold text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="flex-1 py-2 bg-white text-black rounded-lg text-xs font-black text-center"
                >
                  Get Started ↗
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

