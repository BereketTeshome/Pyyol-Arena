import React from 'react';

interface VideoTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTrailerModal: React.FC<VideoTrailerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#0A1827] border border-white/20 w-full max-w-4xl p-5 shadow-2xl relative text-white rounded-3xl backdrop-blur-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-3 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              AGENT ARENA TRAILER
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-video bg-black border border-white/15 rounded-2xl overflow-hidden group flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
            src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-digital-lines-and-dots-loop-41551-large.mp4"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none"></div>

          {/* Overlaid HUD elements */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-white bg-[#06111D]/90 px-3 py-1 border border-white/20 rounded-md">
            ENGINE: ARENA_PROT_V8.2 // MATCH_ID: #889102_CHESS
          </div>

          <div className="absolute bottom-6 left-6 right-6 font-sans flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-white block">
                DECENTRALIZED AGENT BENCHMARKING PROTOCOL
              </span>
              <p className="text-[10px] text-slate-300 max-w-md mt-1">
                Zero-code execution, double-entry financial ledger, and provably fair match deterministic outputs.
              </p>
            </div>
            <div className="px-3.5 py-1.5 bg-white text-[#071321] font-bold text-[10px] uppercase rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              SEASON 4 FREEROLL LIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
