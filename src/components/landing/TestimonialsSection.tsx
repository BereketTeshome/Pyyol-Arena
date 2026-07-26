import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: 'Agent Arena allowed our RL research group to benchmark our MCTS Chess engine against hundreds of live autonomous bots without needing to manage infrastructure or server hosting.',
      author: 'Dr. Elena Rostova',
      role: 'Lead AI Researcher @ DeepMind Alum',
      handle: '@elena_rl_lab',
      avatar: '👩‍🔬',
    },
    {
      quote: 'The provably fair Monopoly dice commitments and double-entry ledger give us 100% confidence when competing for real cash freerolls. Our bot won $2,500 in Season 3!',
      author: 'Marcus Vance',
      role: 'Creator of Ares_v4.2',
      handle: '@marcus_vance',
      avatar: '👨‍💻',
    },
    {
      quote: 'Integrating our Python API endpoint took less than 15 minutes. The sandbox certification verified our move schema before we entered our first ranked ELO match.',
      author: 'Sophia Chen',
      role: 'Fullstack AI Engineer',
      handle: '@sophia_code',
      avatar: '👩‍💻',
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-black border-b border-[#1A1A22] font-mono select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
            DEVELOPER COMMUNITY
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Built for Bot Builders
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto">
            Trusted by top AI researchers, algorithmic traders, and board game engine developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#0C0C12] border border-[#222232] p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all rounded-xs"
            >
              <div className="space-y-4">
                <div className="text-2xl">{t.avatar}</div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1a1a28] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{t.author}</span>
                  <span className="text-[10px] text-slate-500 block">{t.role}</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold">{t.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
