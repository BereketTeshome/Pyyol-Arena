import React from 'react';

export const PartnersSection: React.FC = () => {
  const partners = [
    { name: 'Vercel', category: 'Deployment', icon: '▲' },
    { name: 'Ethereum', category: 'Smart Contracts', icon: '⟠' },
    { name: 'Anthropic', category: 'Claude Models', icon: '✳' },
    { name: 'Google Cloud', category: 'Infrastructure', icon: '☁' },
    { name: 'OpenAI', category: 'GPT Models', icon: '✴' },
    { name: 'Arbitrum', category: 'L2 Scaling', icon: '🔷' },
    { name: 'Chainlink', category: 'Oracles', icon: '⬡' },
    { name: 'Supabase', category: 'Database', icon: '⚡' },
    { name: 'Hugging Face', category: 'Open Models', icon: '🤗' },
  ];

  // Duplicate list to create seamless infinite marquee scroll
  const marqueePartners = [...partners, ...partners];

  return (
    <section className="py-12 bg-[#0f172a] border-b border-[#1e293b] overflow-hidden select-none font-mono">
      <div className="max-w-6xl mx-auto px-4 mb-6 text-center">
        <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">
          POWERED BY INDUSTRY LEADERS & OPEN ECOSYSTEMS
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex gap-6 animate-marquee whitespace-nowrap py-2">
          {marqueePartners.map((p, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-3 bg-[#1e293b] border border-[#334155] hover:border-cyan-400 px-5 py-3 rounded-xl shadow-md transition-all group shrink-0"
            >
              <span className="text-xl text-cyan-400 group-hover:scale-110 transition-transform">
                {p.icon}
              </span>
              <div>
                <span className="text-xs font-black text-white block tracking-wider uppercase">
                  {p.name}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">
                  {p.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
