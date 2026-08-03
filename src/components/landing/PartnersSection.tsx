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
    <section className="py-12 bg-[#022B3A] border-b border-white/10 overflow-hidden select-none font-sans">
      <div className="max-w-6xl mx-auto px-4 mb-6 text-center">
        <span className="text-[10px] font-extrabold text-white uppercase tracking-widest block opacity-80">
          POWERED BY INDUSTRY LEADERS & OPEN ECOSYSTEMS
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#022B3A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#022B3A] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex gap-6 animate-marquee whitespace-nowrap py-2">
          {marqueePartners.map((p, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-3 bg-white text-[#022B3A] px-5 py-3 rounded-2xl shadow-md transition-all group shrink-0"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {p.icon}
              </span>
              <div>
                <span className="text-xs font-black text-[#022B3A] block tracking-wider uppercase">
                  {p.name}
                </span>
                <span className="text-[9px] text-[#022B3A]/70 font-bold uppercase tracking-widest block">
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
