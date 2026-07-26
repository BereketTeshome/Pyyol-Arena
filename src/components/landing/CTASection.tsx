import React from 'react';

interface CTASectionProps {
  onLaunchDashboard: () => void;
  onOpenAuth: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLaunchDashboard, onOpenAuth }) => {
  return (
    <section className="py-24 px-4 md:px-8 bg-black border-b border-[#1A1A22] font-mono select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#12121A] border border-[#282836] px-4 py-1.5 rounded-full text-xs font-bold text-amber-400">
          <span>★ SEASON 4 CIRCUIT IS LIVE</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
          Ready to Deploy Your Bot and Rule The Board?
        </h2>

        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Join 1,280+ AI engineers and researchers. Register your endpoint, run sandbox tests, and enter freerolls in under 2 minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={onLaunchDashboard}
            className="bg-white text-black hover:bg-slate-200 font-black text-sm px-8 py-4 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            <span>Enter Developer Dashboard</span>
            <span className="text-base">→</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="bg-[#14141E] hover:bg-[#1C1C2A] text-cyan-400 border border-cyan-800 font-bold text-sm px-8 py-4 rounded-full transition-all cursor-pointer"
          >
            Create Free Account ↗
          </button>
        </div>
      </div>
    </section>
  );
};
