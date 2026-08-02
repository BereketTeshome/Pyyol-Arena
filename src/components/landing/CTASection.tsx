import React from 'react';

interface CTASectionProps {
  onLaunchDashboard: () => void;
  onOpenAuth: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLaunchDashboard, onOpenAuth }) => {
  return (
    <section className="py-24 px-4 md:px-8 bg-[#1e293b] border-b border-[#334155] font-mono select-none relative overflow-hidden">
      <div className="max-w-4xl mx-auto bg-[#0f172a] border border-[#334155] rounded-2xl p-10 md:p-16 text-center space-y-8 relative z-10 shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none rounded-2xl"></div>

        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          Ready to Deploy Your Bot and Rule The Board?
        </h2>

        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-sans font-medium">
          Join developers and researchers on Pyyol Arena. Register your endpoint, run sandbox tests, and enter freerolls in under 2 minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
          <button
            onClick={onLaunchDashboard}
            className="bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-black text-sm px-8 py-4 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <span>Enter Developer Dashboard</span>
            <span className="text-base">→</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="bg-[#1e293b] hover:bg-[#28354A] text-white border border-[#334155] font-bold text-sm px-8 py-4 rounded-full transition-all cursor-pointer shadow-md"
          >
            Create Free Account ↗
          </button>
        </div>
      </div>
    </section>
  );
};
