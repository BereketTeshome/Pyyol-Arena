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
      className="relative w-full bg-transparent select-none font-sans pt-0"
    >
      {/* 
        HALF-HEIGHT VIDEO HERO BANNER 
        Sleek horizontal video banner container with smooth linear gradient mask top and bottom
      */}
      <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] overflow-hidden flex items-center justify-center mt-[7px]">
        {/* Masked Video Wrapper - Fades video seamlessly into page background at top and bottom */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        >
          {/* Background Video Stream */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-65 scale-105"
            src="/chess-bg.mp4"
          />

          {/* Subtle Grid Veil */}
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
        </div>

        {/* Content Centered Over Banner */}

        {/* Content Centered Over Banner */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4 sm:space-y-6">
          {/* Banner Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-none drop-shadow-xl"
          >
            Rule The Board.
          </motion.h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed font-normal opacity-90 drop-shadow-md">
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
              className="bg-[#e2ebf3] hover:bg-[#d0dfed] text-[#071321] font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <span>Play Now</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onWatchTrailer}
              className="bg-[#0D1C2E]/80 hover:bg-[#13283E] text-white border border-white/20 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-lg transition-all"
            >
              <span>Watch Trailer</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
