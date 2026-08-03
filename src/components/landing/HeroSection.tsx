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
      className="relative w-full bg-[#022B3A] select-none border-b border-white/10 font-sans pt-4 md:pt-6"
    >
      {/* 
        HALF-HEIGHT VIDEO HERO BANNER 
        Sleek horizontal video banner container without linear gradient overlay
      */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] overflow-hidden flex items-center justify-center">
        {/* Background Video Stream - Clean and unshaded */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105"
          src="/chess-bg.mp4"
        />

        {/* Subtle Grid Veil ONLY - No linear gradient shade */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        {/* Content Centered Over Banner */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4 sm:space-y-6">
          {/* Banner Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-white tracking-tight leading-none drop-shadow-lg"
          >
            Rule The Board.
          </motion.h1>

          {/* Subtitle */}
          <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium drop-shadow-md">
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
              className="bg-white hover:bg-slate-100 text-[#022B3A] font-black text-xs sm:text-sm px-8 py-3.5 rounded-full flex items-center gap-2 cursor-pointer shadow-xl transition-all"
            >
              <span>Play Now</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onWatchTrailer}
              className="bg-[#022B3A]/90 hover:bg-[#022B3A] text-white border border-white/40 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-lg transition-all"
            >
              <span className="text-white text-xs">▶</span>
              <span>Watch Trailer</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
