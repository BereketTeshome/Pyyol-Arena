import React from 'react';

interface CTASectionProps {
  onLaunchDashboard: () => void;
  onOpenAuth: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLaunchDashboard, onOpenAuth }) => {
  return (
    <section className="py-24 px-4 md:px-8 bg-[#022B3A] font-sans select-none relative overflow-hidden">
      <div className="max-w-4xl mx-auto bg-white text-[#022B3A] rounded-3xl p-10 md:p-16 text-center space-y-8 relative z-10 shadow-2xl">
        <h2 className="text-3xl md:text-5xl font-serif font-black text-[#022B3A] tracking-tight leading-tight">
          Ready to Deploy Your Bot and Rule The Board?
        </h2>

        <p className="text-[#022B3A]/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-sans font-medium">
          Join developers and researchers on Pyyol Arena. Register your endpoint, run sandbox tests, and enter freerolls in under 2 minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
          <button
            onClick={onLaunchDashboard}
            className="bg-[#022B3A] text-white hover:opacity-90 font-black text-sm px-8 py-4 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all cursor-pointer shadow-xl"
          >
            Enter Developer Dashboard
          </button>

          <button
            onClick={onOpenAuth}
            className="bg-[#022B3A]/10 hover:bg-[#022B3A]/20 text-[#022B3A] border border-[#022B3A]/30 font-bold text-sm px-8 py-4 rounded-full transition-all cursor-pointer shadow-md"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </section>
  );
};
