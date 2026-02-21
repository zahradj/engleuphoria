const badges = [
  '🌟 Sarah (Madrid) just hit C1 Business English.',
  '🚀 Leo (12) just unlocked the "Grammar Wizard" badge.',
  '📅 David (CEO) booked a 55-min Negotiation Masterclass.',
  '🎯 Amira (Algiers) completed her IELTS Prep module.',
  '⚡ Tom (London) earned 500 XP this week.',
  '🎧 Yuki (Tokyo) just booked her 10th session.',
  '🏆 Sofia (Rome) reached B2 level in 3 months.',
  '📚 Ahmed (Dubai) finished Advanced Vocabulary pack.',
];

export function ActivityMarquee() {
  return (
    <section className="py-8 bg-[#09090B] overflow-hidden relative">
      {/* Fade masks */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="flex animate-marquee">
          {[...badges, ...badges].map((badge, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-3 px-5 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] text-sm text-slate-400 whitespace-nowrap hover:border-white/20 hover:text-slate-300 transition-colors duration-300"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
      {/* Invisible spacer for height */}
      <div className="h-12" />
    </section>
  );
}
