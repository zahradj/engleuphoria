import { useThemeMode } from '@/hooks/useThemeMode';

const badges = [
  { text: 'Sarah (Madrid) just hit C1 Business English.', emoji: '🌟', highlight: 'C1 Business English' },
  { text: 'Leo (12) just unlocked the "Grammar Wizard" badge.', emoji: '🚀', highlight: 'Grammar Wizard' },
  { text: 'David (CEO) booked a 55-min Negotiation Masterclass.', emoji: '📅', highlight: 'Negotiation Masterclass' },
  { text: 'Amira (Algiers) completed her IELTS Prep module.', emoji: '🎯', highlight: 'IELTS Prep' },
  { text: 'Tom (London) earned 500 XP this week.', emoji: '⚡', highlight: '500 XP' },
  { text: 'Yuki (Tokyo) just booked her 10th session.', emoji: '🎧', highlight: '10th session' },
  { text: 'Sofia (Rome) reached B2 level in 3 months.', emoji: '🏆', highlight: 'B2 level' },
  { text: 'Ahmed (Dubai) finished Advanced Vocabulary pack.', emoji: '📚', highlight: 'Advanced Vocabulary' },
];

function BadgeItem({ badge, isDark }: { badge: typeof badges[0]; isDark: boolean }) {
  const parts = badge.text.split(badge.highlight);

  return (
    <div
      className={`flex-shrink-0 mx-3 px-5 py-2.5 rounded-full backdrop-blur-sm text-sm whitespace-nowrap transition-all duration-300 ${
        isDark
          ? 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-300'
          : 'bg-white/80 border border-slate-200/60 text-slate-600 shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 hover:text-slate-700'
      }`}
    >
      {badge.emoji}{' '}
      {parts[0]}
      <span className={`font-semibold ${
        isDark
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400'
          : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600'
      }`}>
        {badge.highlight}
      </span>
      {parts[1]}
    </div>
  );
}

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
            <BadgeItem key={i} badge={badge} isDark={isDark} />
          ))}
        </div>
      </div>
      {/* Invisible spacer for height */}
      <div className="h-12" />
    </section>
  );
}
