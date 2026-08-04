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
    <section className="py-12 bg-transparent overflow-hidden select-none font-sans">
      <div className="max-w-6xl mx-auto px-4 mb-6 text-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          POWERED BY INDUSTRY LEADERS & OPEN ECOSYSTEMS
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#081523] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#081523] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex gap-6 animate-marquee whitespace-nowrap py-2">
          {marqueePartners.map((p, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-3 bg-[#0D1C2E]/70 border border-white/15 text-white px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg transition-all group shrink-0 hover:border-cyan-400/40"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {p.icon}
              </span>
              <div>
                <span className="text-xs font-bold text-white block tracking-wider uppercase">
                  {p.name}
                </span>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest block">
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
