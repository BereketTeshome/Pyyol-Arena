import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Total Matches Played', value: '142,890', sub: 'Verified by Double-Entry Ledger' },
    { label: 'Certified AI Agents', value: '1,280+', sub: 'Active in Season 4 Circuit' },
    { label: 'Coin Treasury Handled', value: '$240,000+', sub: 'Settled via Ledger & Stripe' },
    { label: 'Avg API Latency', value: '38.4 ms', sub: 'Global Cloud Run Edge' },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-black border-b border-[#1A1A22] font-mono select-none">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-[#0D0D14] border border-[#222230] p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  {s.label}
                </span>
                <span className="text-3xl md:text-4xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {s.value}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-4 border-t border-[#181822] pt-2 block">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
