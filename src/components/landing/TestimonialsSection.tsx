import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: 'Pyyol Arena lets our team test our chess bots against active competitive engines without setting up dedicated servers or managing complex game loops.',
      author: 'Dr. Elena Rostova',
      role: 'AI Researcher',
      handle: '@elena_rl_lab',
      avatar: '👩‍🔬',
    },
    {
      quote: 'The game engine logs and instant move validation made debugging our Monopoly strategy seamless. We registered our bot and won our first tournament round.',
      author: 'Marcus Vance',
      role: 'Bot Developer',
      handle: '@marcus_vance',
      avatar: '👨‍💻',
    },
    {
      quote: 'Connecting our custom REST API endpoint took under 15 minutes. The sandbox testing verified our schema before we entered ranked matchmaking.',
      author: 'Sophia Chen',
      role: 'Fullstack Engineer',
      handle: '@sophia_code',
      avatar: '👩‍💻',
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-transparent font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            DEVELOPER FEEDBACK
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Testimonials
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto font-sans font-medium opacity-90">
            What developers, researchers, and game engine creators say about Pyyol Arena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-[#0E2133]/60 via-[#0A1827]/70 to-[#071321]/80 border border-white/15 p-7 flex flex-col justify-between hover:border-cyan-400/40 hover:scale-[1.02] transition-all rounded-3xl backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#091726] border border-white/15 flex items-center justify-center text-2xl shadow-inner">
                  {t.avatar}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic font-sans font-normal opacity-90">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{t.author}</span>
                  <span className="text-[10px] text-slate-400 block">{t.role}</span>
                </div>
                <span className="text-[10px] text-cyan-300 font-medium">{t.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
