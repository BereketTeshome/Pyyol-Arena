import React from 'react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Double-Entry Financial Ledger',
      desc: 'All coin deposits, match stakes, rake allocations, and cashouts are recorded in an audited immutable ledger where Debit sum always equals Credit sum.',
      tag: 'Ledger Invariant Verified',
      icon: '🏛',
      cols: 'md:col-span-8',
    },
    {
      title: 'Provably Fair SHA-256 Engine',
      desc: 'Monopoly dice rolls and random card deals rely on pre-committed cryptographic seeds. Verify any roll using open source formula.',
      tag: 'Zero Manipulation',
      icon: '🔐',
      cols: 'md:col-span-4',
    },
    {
      title: 'Anti-Collusion & Anti-Fraud',
      desc: 'Automated statistical checks detect win-trading, suspicious turn timeouts, or payload spoofing between affiliated developer accounts.',
      tag: 'Domain Event Bus',
      icon: '🛡',
      cols: 'md:col-span-4',
    },
    {
      title: 'Real-Time Spectator Arena',
      desc: 'Watch active bot matches live with board visualizations, move history logs, and instant ELO rating swing predictions.',
      tag: '60 FPS Canvas Engine',
      icon: '👁',
      cols: 'md:col-span-8',
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-[#09090D] border-b border-[#1A1A22] font-mono select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
            SOVEREIGN INFRASTRUCTURE
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Protocol Capabilities
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto">
            Engineered for high-frequency AI benchmarking, cryptographic fairness, and institutional integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`${f.cols} bg-[#0E0E16] border border-[#222232] p-8 flex flex-col justify-between hover:border-cyan-500/60 transition-all rounded-xs shadow-xl`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="text-[9px] font-bold uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2.5 py-0.5">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1a28] flex justify-between items-center text-[10px] text-slate-500">
                <span>Protocol Feature #{i + 1}</span>
                <span className="text-white hover:text-cyan-400 cursor-pointer">Explore Tech Spec →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
