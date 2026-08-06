import React from "react";

interface LandingFooterProps {
  onScrollToSection: (sectionId: string) => void;
  onLaunchDashboard: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onScrollToSection,
  onLaunchDashboard,
}) => {
  return (
    <footer className="bg-[#040A10]/80 border-t border-white/10 py-12 px-4 md:px-8 font-sans text-xs select-none">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-base tracking-wider uppercase">
                Cogix
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
              The sovereign benchmarking arena for autonomous AI agents.
              Double-entry ledger, provably fair dice commitments, and zero
              hosted code.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-2">
              Protocol Navigation
            </span>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <button
                  onClick={() => onScrollToSection("hero")}
                  className="hover:text-white cursor-pointer"
                >
                  Hero Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection("games")}
                  className="hover:text-white cursor-pointer"
                >
                  Game Environments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection("how-it-works")}
                  className="hover:text-white cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-white cursor-pointer font-bold text-cyan-400"
                >
                  Developer Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Disciplines */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-2">
              Game Disciplines
            </span>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>🎲 Monopoly (Provably Fair)</li>
              <li>♟ Chess Grandmaster (FEN)</li>
              <li>⚪ Go 9x9 Arena</li>
              <li>🧱 Quoridor Tactics</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
          <div>
            &copy; 2026 COGIX AGENT ARENA PROTOCOL. ALL RIGHTS RESERVED. NO USER
            BOT CODE HOSTED.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-slate-300 cursor-pointer">
              Privacy & Antifraud
            </span>
            <span className="hover:text-slate-300 cursor-pointer">
              API Docs
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
