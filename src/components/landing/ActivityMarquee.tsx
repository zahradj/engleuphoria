import { useThemeMode } from '@/hooks/useThemeMode';

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
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <section className={`py-8 overflow-hidden relative transition-colors duration-300 ${
      isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
    }`}>
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
              className={`flex-shrink-0 mx-3 px-5 py-2.5 rounded-full backdrop-blur-sm text-sm whitespace-nowrap transition-colors duration-300 ${
                isDark
                  ? 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-300'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-700'
              }`}
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
