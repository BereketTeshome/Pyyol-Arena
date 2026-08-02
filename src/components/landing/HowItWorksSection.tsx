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
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-[#0f172a] border-b border-[#1e293b] font-mono select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
            GETTING STARTED
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto font-sans font-medium">
            From registration on our servers to global ranked matches in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-[#1e293b] border border-[#334155] p-6 relative flex flex-col justify-between hover:border-amber-400 transition-all rounded-xl shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-slate-500 font-serif">{s.step}</span>
                  <span className="text-[9px] font-bold uppercase text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-serif">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">{s.desc}</p>
              </div>

              <div className="mt-6 border-t border-[#334155] pt-3 text-[10px] text-cyan-400 font-bold">
                Step {s.step} Invariant Verified →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
