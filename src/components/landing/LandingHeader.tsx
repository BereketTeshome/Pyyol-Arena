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

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Games', id: 'games' },
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
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl border-b border-[#1e293b] px-4 md:px-8 py-3 flex items-center justify-between font-mono select-none shadow-md">
      {/* Brand Logo */}
      <div
        onClick={() => handleNavClick('hero')}
        className="flex items-center gap-2.5 cursor-pointer group relative"
      >
        <div className="flex flex-col">
          <span className="text-base font-black tracking-widest text-white uppercase font-serif group-hover:text-cyan-400 transition-colors">
            Pyyol Arena
          </span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#1e293b] border border-[#334155] rounded-full px-4 py-1.5 shadow-md relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer z-10 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeLandingUnderline"
                  className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        <div className="h-4 w-[1px] bg-slate-700 mx-2" />

        <button
          onClick={onLaunchDashboard}
          className="relative px-3 py-1 text-xs font-black uppercase text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer z-10"
        >
          <span>Dashboard →</span>
        </button>
      </nav>

      {/* Control Tools & Auth Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenAuth('signup')}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-md"
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
            className="absolute top-full left-0 right-0 bg-[#0f172a]/95 backdrop-blur-2xl border-b border-[#1e293b] p-6 flex flex-col gap-4 shadow-2xl lg:hidden z-50 font-mono"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-[#1e293b] rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-[#1e293b] pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLaunchDashboard();
                }}
                className="w-full py-2.5 bg-[#1e293b] text-cyan-400 border border-[#334155] rounded-lg text-xs font-bold text-center"
              >
                Enter Dashboard →
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full py-2.5 bg-cyan-500 text-slate-950 rounded-lg text-xs font-black text-center"
              >
                Get Started ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

