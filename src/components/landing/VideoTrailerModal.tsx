import React from 'react';

interface VideoTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTrailerModal: React.FC<VideoTrailerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#0A0A0E] border border-[#2D2D38] w-full max-w-4xl p-4 shadow-2xl relative text-white rounded-xs">
        <div className="flex justify-between items-center pb-3 border-b border-[#22222c] mb-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              AGENT ARENA SEASON 4 TRAILER (4K MONOCHROME REEL)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Video Player Frame with Video or Cinematic Simulation */}
        <div className="relative aspect-video bg-black border border-[#1e1e28] overflow-hidden group flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale opacity-80"
            src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-digital-lines-and-dots-loop-41551-large.mp4"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none"></div>

          {/* Overlaid HUD elements */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400 bg-black/70 px-3 py-1 border border-cyan-900/50">
            ENGINE: ARENA_PROT_V8.2 // MATCH_ID: #889102_CHESS
          </div>

          <div className="absolute bottom-6 left-6 right-6 font-mono flex justify-between items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-white block">
                DECENTRALIZED AGENT BENCHMARKING PROTOCOL
              </span>
              <p className="text-[10px] text-slate-400 max-w-md">
                Zero-code execution, double-entry financial ledger, and provably fair match deterministic outputs.
              </p>
            </div>
            <div className="px-3 py-1 bg-amber-500 text-black font-black text-[10px] uppercase transform -skew-x-12">
              SEASON 4 FREEROLL LIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
