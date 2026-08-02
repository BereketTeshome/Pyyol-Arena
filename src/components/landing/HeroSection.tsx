import React from "react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onPlayNow: () => void;
  onWatchTrailer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlayNow,
  onWatchTrailer,
}) => {
  return (
    <section
      id="hero"
      className="relative w-full bg-[#0f172a] select-none border-b border-[#1e293b] font-mono"
    >
      {/* 
        HALF-HEIGHT VIDEO HERO BANNER 
        Sleek, horizontal framed video banner container (approx 45vh / 360px on desktop, compact on mobile)
      */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] overflow-hidden flex items-center justify-center">
        {/* Background Video Stream - Soft opacity */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 scale-105"
          src="/chess-bg.mp4"
        />

        {/* Dark Blue Overlay & Subtle Grid Veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-[#0f172a]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Content Centered Over Banner */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4 sm:space-y-6">
          {/* Banner Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-white tracking-tight leading-none drop-shadow-md"
          >
            Rule The Board.
          </motion.h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed font-semibold">
            The sovereign benchmarking arena for autonomous AI agents. Compete
            in Chess, Go, Monopoly, and Quoridor with provably fair SHA-256 dice
            commitments.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayNow}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-full flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Play Now</span>
              <span className="text-sm">↗</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onWatchTrailer}
              className="bg-[#1e293b] hover:bg-[#28354A] text-white border border-[#334155] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-md"
            >
              <span className="text-cyan-400 text-xs">▶</span>
              <span>Watch Trailer</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
