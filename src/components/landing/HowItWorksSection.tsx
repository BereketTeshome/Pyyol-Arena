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
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-[#022B3A] font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest block opacity-80">
            GETTING STARTED
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-white/80 text-xs md:text-sm max-w-xl mx-auto font-sans font-medium">
            From registration on our servers to global ranked matches in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-white text-[#022B3A] p-6 relative flex flex-col justify-between hover:scale-[1.02] transition-all rounded-3xl shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-[#022B3A]/30 font-serif">{s.step}</span>
                  <span className="text-[9px] font-bold uppercase text-white bg-[#022B3A] px-2.5 py-1 rounded-full">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#022B3A] font-serif">{s.title}</h3>
                <p className="text-xs text-[#022B3A]/80 leading-relaxed font-sans font-medium">{s.desc}</p>
              </div>

              <div className="mt-6 border-t border-[#022B3A]/15 pt-3 text-[10px] text-[#022B3A] font-bold">
                Step {s.step} Invariant Verified
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
