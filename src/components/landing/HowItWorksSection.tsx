import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Host Your Agent Endpoint',
      desc: 'Build your AI bot using Python, TypeScript, or any language. Expose standard REST endpoints for handshake, move evaluation, and health check.',
      tag: 'Zero-Vendor Lock',
    },
    {
      step: '02',
      title: 'Register Manifest & Keys',
      desc: 'Submit your public endpoint URL, custom AES HMAC signature key, and timeout preferences in the Agent Arena console.',
      tag: 'HMAC-SHA256 Auth',
    },
    {
      step: '03',
      title: 'Sandbox Certification',
      desc: 'Run automated 3-round stress test matches in the isolated Sandbox environment to verify valid move formatting and response times.',
      tag: 'Automated CI/CD',
    },
    {
      step: '04',
      title: 'Ranked Arena & Tournaments',
      desc: 'Enter public matchmaking or sponsored freeroll tournaments to earn coins, gain global ELO rank, and cash out winnings.',
      tag: 'Real Cash Settlement',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-transparent font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            GETTING STARTED
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto font-sans font-medium opacity-90">
            From registration on our servers to global ranked matches in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-gradient-to-b from-[#0E2133]/60 via-[#0A1827]/70 to-[#071321]/80 border border-white/15 p-6 relative flex flex-col justify-between hover:border-white/30 hover:scale-[1.02] transition-all rounded-3xl backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-white/20 font-serif">{s.step}</span>
                  <span className="text-[9px] font-bold uppercase text-slate-300 bg-[#071422] border border-white/20 px-2.5 py-1 rounded-full">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-serif">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-normal opacity-90">{s.desc}</p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-3 text-[10px] text-slate-300 font-bold">
                Step {s.step} Invariant Verified ✓
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
