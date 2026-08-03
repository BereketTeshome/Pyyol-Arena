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
    <div className="sticky top-0 z-50 w-full flex justify-center px-2 sm:px-4 pt-0 select-none font-sans pointer-events-none pb-0">
      {/* 
        iPhone Notch / Dynamic Island Floating Navbar
        No explicit border lines, white box shadow for edge definition, close fit to hero video
      */}
      <header className="pointer-events-auto bg-[#022B3A]/95 backdrop-blur-md text-white rounded-b-2xl md:rounded-b-[28px] px-5 md:px-8 py-2.5 flex items-center justify-between gap-4 md:gap-8 shadow-[0_6px_24px_rgba(255,255,255,0.18)] max-w-5xl w-full transition-all">
        {/* Brand Name - No "P" logo */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <span className="text-base md:text-lg font-black tracking-tight text-white font-serif group-hover:opacity-90 transition-opacity">
            Pyyol Arena
          </span>
        </div>

        {/* Navigation Bar Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-white/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors cursor-pointer relative py-1 hover:text-white ${
                  isActive ? 'text-white font-bold' : 'text-white/80'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="notchActiveIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}

          <button
            onClick={onLaunchDashboard}
            className="text-white/80 hover:text-white transition-colors cursor-pointer font-semibold"
          >
            Dashboard
          </button>
        </nav>

        {/* Right CTA Button - White pill button, dark teal text, NO emoji */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenAuth('signup')}
            className="bg-white hover:bg-slate-100 text-[#022B3A] font-black text-xs px-5 py-2.5 rounded-full cursor-pointer shadow-md transition-all"
          >
            Get Started
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-white/80 hover:text-white cursor-pointer focus:outline-none ml-1"
          >
            <span className="text-lg">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-[#022B3A] text-white rounded-2xl p-5 flex flex-col gap-3 shadow-2xl lg:hidden z-50 font-sans"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left px-3 py-2 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-white/20 pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLaunchDashboard();
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold text-center transition-all"
              >
                Enter Dashboard
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full py-2 bg-white text-[#022B3A] rounded-lg text-xs font-black text-center transition-all"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

