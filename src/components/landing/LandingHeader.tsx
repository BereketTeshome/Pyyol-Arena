import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles } from 'lucide-react';

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
    { label: 'AI Benchmarks', id: 'model-benchmarks' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onScrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center select-none font-sans pointer-events-none pt-0">
      {/* 
        iPhone Notch Drop Down Floating Navbar
        Hanging directly from the top edge over the video with no background bar behind it
      */}
      <header className="pointer-events-auto bg-gradient-to-r from-[#082233]/65 via-[#041724]/55 to-[#082233]/65 backdrop-blur-xl text-white rounded-b-3xl md:rounded-b-[2rem] px-6 md:px-9 py-2.5 flex items-center justify-between gap-4 md:gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)] max-w-4xl w-full transition-all mt-0">
        {/* Brand Name - No Icon */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center cursor-pointer group shrink-0"
        >
          <span className="text-base md:text-xl font-bold tracking-tight text-white font-serif group-hover:opacity-90 transition-opacity">
            Pyyol Arena
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors cursor-pointer relative py-1 hover:text-white ${
                  isActive ? 'text-white font-bold' : 'text-slate-300'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="notchActiveIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#e2ebf3] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}

          {/* Dashboard Link - No Icon */}
          <button
            onClick={onLaunchDashboard}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer font-semibold"
          >
            Dashboard
          </button>
        </nav>

        {/* Right Action Button - Soft Muted Off-White Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenAuth('signup')}
            className="bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-xs px-5 py-2.5 rounded-full cursor-pointer shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Get Started</span>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-white/80 hover:text-white cursor-pointer focus:outline-none ml-1"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-[#062030] text-white border border-white/20 rounded-3xl p-5 flex flex-col gap-3 shadow-2xl lg:hidden z-50 font-sans backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left px-3 py-2 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all"
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
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center"
              >
                Enter Dashboard
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full py-2 bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Get Started</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



