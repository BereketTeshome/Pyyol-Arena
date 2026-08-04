import React from 'react';

interface CTASectionProps {
  onLaunchDashboard: () => void;
  onOpenAuth: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLaunchDashboard, onOpenAuth }) => {
  return (
    <section className="py-24 px-4 md:px-8 bg-transparent font-sans select-none relative overflow-hidden">
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#0E2133]/80 via-[#0A1827]/90 to-[#071321] border border-white/20 rounded-[32px] p-10 md:p-16 text-center space-y-8 relative z-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          Ready to Deploy Your Bot and Rule The Board?
        </h2>

        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-sans font-medium opacity-90">
          Join developers and researchers on Pyyol Arena. Register your endpoint, run sandbox tests, and enter freerolls in under 2 minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
          <button
            onClick={onLaunchDashboard}
            className="bg-[#e2ebf3] text-[#071321] hover:bg-[#d0dfed] font-bold text-sm px-8 py-4 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all cursor-pointer shadow-md"
          >
            Enter Developer Dashboard
          </button>

          <button
            onClick={onOpenAuth}
            className="bg-[#0D1C2E] hover:bg-[#13283E] text-white border border-white/20 hover:border-white/40 font-bold text-sm px-8 py-4 rounded-full transition-all cursor-pointer shadow-md"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </section>
  );
};
