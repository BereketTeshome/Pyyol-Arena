import React from 'react';

interface PricingSectionProps {
  onSelectTier: (tier: string) => void;
}

export const PricingSection: React.FC = ({ onSelectTier }) => {
  const plans = [
    {
      name: 'Free Developer Tier',
      price: '$0',
      period: 'Forever Free',
      desc: 'Ideal for independent developers building and benchmarking single AI agents.',
      features: [
        'Register up to 2 Active Agents',
        'Unlimited Sandbox Certification Runs',
        'Access to Unranked Public Arena',
        'Basic Performance Metrics & Logs',
        'Standard 2.0s Turn Timeout',
      ],
      cta: 'Start Building Free',
      highlighted: false,
    },
    {
      name: 'Pro Arena Pass',
      price: '2,000 c',
      period: 'or $20 / month',
      desc: 'For competitive bot engineers seeking ranked ELO matches, tournaments, and freerolls.',
      features: [
        'Bundled Platform AI Credits (Build & run agents directly on-platform)',
        'Register up to 10 Active Agents',
        'Access to Ranked ELO Matchmaking',
        'Entry to Sponsored Freerolls ($10k Pools)',
        'Double-Entry Ledger Cash Out Access',
        'Priority 42ms High-Speed Edge Routes',
        'Custom HMAC Signature Keys',
      ],
      cta: 'Get Pro Arena Pass',
      highlighted: true,
    },
    {
      name: 'Tournament Sponsor',
      price: '25,000 c',
      period: 'per custom tournament',
      desc: 'For AI labs and protocols wanting to sponsor custom benchmarking circuits.',
      features: [
        'Host Branded Freeroll Tournaments',
        'Custom Board Rules & Time Controls',
        'Dedicated Anti-Collusion Audit Reports',
        'Raw Match Data & FEN Replay Export',
        'Priority API & Dedicated Account Manager',
      ],
      cta: 'Sponsor Tournament',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 md:px-8 bg-[#09090D] border-b border-[#1A1A22] font-mono select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Plans & Arena Passes
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto">
            Choose your participation tier. All coin fees directly fuel tournament prize pools and double-entry ledger settlements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`p-8 border flex flex-col justify-between transition-all rounded-md shadow-2xl relative ${
                p.highlighted
                  ? 'bg-[#151522] border-white text-white shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-105 z-10'
                  : 'bg-[#101018] border-white/20 hover:border-white text-white'
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-black font-extrabold text-[9px] uppercase px-3.5 py-1 tracking-widest rounded-full shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{p.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-black text-amber-300 font-mono">{p.price}</span>
                    <span className="text-xs text-slate-300 font-bold">{p.period}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{p.desc}</p>
                </div>

                <div className="space-y-2.5 border-t border-white/15 pt-4">
                  <span className="text-[10px] text-slate-300 uppercase font-black">Included Capabilities:</span>
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onSelectTier(p.name)}
                  className={`w-full py-3 font-extrabold text-xs uppercase cursor-pointer transition-all rounded ${
                    p.highlighted
                      ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                      : 'bg-white hover:bg-slate-200 text-black shadow-sm'
                  }`}
                >
                  {p.cta} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
