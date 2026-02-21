import { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { Check, Sparkles, Clock, Tag, Shield, Cpu, UserCheck, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '@/hooks/useThemeMode';

type AudienceLevel = 'playground' | 'professional';

interface PackTier {
  name: Record<AudienceLevel, string>;
  label: string;
  sessions: number;
  price: Record<AudienceLevel, number>;
  originalPrice: Record<AudienceLevel, number>;
  savings: number;
  popular: boolean;
  isMastery: boolean;
}

const packTiers: PackTier[] = [
  {
    name: { playground: 'Explorer', professional: 'Pro' },
    label: 'Try it out',
    sessions: 5,
    price: { playground: 75, professional: 100 },
    originalPrice: { playground: 75, professional: 100 },
    savings: 0,
    popular: false,
    isMastery: false,
  },
  {
    name: { playground: 'Achiever', professional: 'Executive' },
    label: 'Most popular',
    sessions: 10,
    price: { playground: 145, professional: 195 },
    originalPrice: { playground: 150, professional: 200 },
    savings: 5,
    popular: true,
    isMastery: false,
  },
  {
    name: { playground: 'Mastery', professional: 'Global Leader' },
    label: 'Best value',
    sessions: 20,
    price: { playground: 290, professional: 390 },
    originalPrice: { playground: 300, professional: 400 },
    savings: 10,
    popular: false,
    isMastery: true,
  },
];

const features = [
  'One-on-one with native speaker',
  'Personalized lesson plan',
  'Homework & resources',
  'Progress tracking',
  'Free cancellation (24h+)',
  'Credits valid for 6 months',
];

const valueBullets = [
  { icon: Timer, text: '55-Min Sessions' },
  { icon: Cpu, text: 'Adaptive Curriculum' },
  { icon: UserCheck, text: 'Verified Native Teachers' },
];

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform('rotateY(0deg) rotateX(0deg)');
  };

  return { ref, transform, handleMouseMove, handleMouseLeave };
}

export function PricingSection() {
  const [level, setLevel] = useState<AudienceLevel>('playground');
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const perSession = level === 'professional' ? 20 : 15;

  return (
    <section id="pricing" className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'
    }`}>
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
        isDark ? 'from-indigo-500/5 via-transparent to-transparent' : 'from-amber-500/[0.03] via-transparent to-transparent'
      }`} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            isDark
              ? 'bg-white/[0.04] border border-white/[0.08] text-indigo-400'
              : 'bg-white border border-slate-200 text-indigo-600 shadow-sm'
          }`}>
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </span>
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-display transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Session Credit{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Packs
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto mb-8 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Buy credits, book sessions. No subscriptions, no hidden fees. All sessions are 55 minutes.
          </p>

          {/* 2-Way Toggle */}
          <div className={`inline-flex items-center backdrop-blur-xl rounded-full p-1.5 ${
            isDark
              ? 'bg-white/[0.04] border border-white/[0.08]'
              : 'bg-slate-100 border border-slate-200'
          }`}>
            {([
              { key: 'playground' as const, label: '🎨 Playground & Academy', cursor: 'playground' },
              { key: 'professional' as const, label: '💼 Professional', cursor: 'professional' },
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLevel(opt.key)}
                data-cursor={opt.cursor}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  level === opt.key
                    ? isDark
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'bg-white text-slate-900 shadow-md'
                    : isDark
                      ? 'text-slate-500 hover:text-slate-300'
                      : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className={`text-sm mt-3 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
            Base rate: <span className={`font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>€{perSession}</span> per 55-minute session
          </p>
        </motion.div>

        {/* Pack Cards with perspective */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" style={{ perspective: '1200px' }}>
          {packTiers.map((pack, index) => (
            <PricingCard key={pack.label} pack={pack} index={index} level={level} isDark={isDark} />
          ))}
        </div>

        {/* Cancellation Policy */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-12"
        >
          <div className={`backdrop-blur-xl rounded-2xl p-5 transition-colors duration-300 ${
            isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Fair Cancellation Policy</h4>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/10">
                <p className="text-emerald-400 font-semibold mb-1">✅ Free Cancellation</p>
                <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>24+ hours before class — credit fully refunded</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/10">
                <p className="text-amber-400 font-semibold mb-1">⚠️ Late Cancellation</p>
                <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>Less than 24 hours — credit kept as teacher fee</p>
              </div>
              <div className={`rounded-xl p-3 border ${isDark ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>📅 Expiry</p>
                <p className={isDark ? 'text-slate-500' : 'text-slate-500'}>Credits expire 6 months after purchase</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={`text-center mt-8 text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
        >
          All prices in EUR. First lesson includes a free assessment.
        </motion.p>
      </div>
    </section>
  );
}

function PricingCard({ pack, index, level, isDark }: { pack: PackTier; index: number; level: AudienceLevel; isDark: boolean }) {
  const { ref, transform, handleMouseMove, handleMouseLeave } = useTilt();
  const price = pack.price[level];
  const originalPrice = pack.originalPrice[level];
  const hasDiscount = pack.savings > 0;
  const packName = pack.name[level];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ transform, transition: 'transform 0.3s ease' }}
      className={`relative rounded-3xl p-7 flex flex-col backdrop-blur-xl transition-all duration-500 ${
        pack.isMastery
          ? isDark
            ? 'bg-white/[0.06] border border-white/[0.08] scale-[1.03]'
            : 'bg-white border border-slate-200 scale-[1.03] shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
          : pack.popular
            ? isDark
              ? 'bg-white/[0.05] border border-amber-500/20'
              : 'bg-white border border-amber-300/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
            : isDark
              ? 'bg-white/[0.04] border border-white/[0.08]'
              : 'bg-white border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
      } ${isDark ? 'hover:bg-white/[0.08]' : 'hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]'}`}
    >
      {/* Border Beam for Mastery card */}
      {pack.isMastery && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
            <div
              className="h-full w-1/3 animate-border-beam"
              style={{
                background: isDark
                  ? 'linear-gradient(90deg, transparent, #6366f1, #10b981, transparent)'
                  : 'linear-gradient(90deg, transparent, #4f46e5, #059669, transparent)',
              }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
            <div
              className="h-full w-1/3 animate-border-beam"
              style={{
                background: isDark
                  ? 'linear-gradient(90deg, transparent, #f59e0b, #6366f1, transparent)'
                  : 'linear-gradient(90deg, transparent, #d97706, #4f46e5, transparent)',
                animationDelay: '1s',
                animationDirection: 'reverse',
              }}
            />
          </div>
        </div>
      )}

      {/* Savings Badge — Holographic Shimmer */}
      {hasDiscount && (
        <div className="absolute -top-3 right-4 z-10">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white animate-shimmer"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(110deg, #f97316, #fbbf24, rgba(255,255,255,0.5), #f97316, #fbbf24)'
                : 'linear-gradient(110deg, #4f46e5, #6366f1, rgba(255,255,255,0.6), #4f46e5, #6366f1)',
              backgroundSize: '300% 100%',
            }}
          >
            🔥 Save €{pack.savings}
          </span>
        </div>
      )}

      {/* Popular badge */}
      {pack.popular && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg shadow-orange-500/20 px-3 py-1 text-xs font-bold">
            <Sparkles className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1">
        <div className="mb-5 mt-2">
          <h3 className={`text-xl font-bold mb-1 font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>{packName}</h3>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{pack.label}</p>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {pack.sessions} × 55-min sessions
          </span>
        </div>

        {/* Price — Flip Animation */}
        <div className="mb-5" style={{ perspective: '600px' }}>
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${packName}-${price}`}
                className={`font-extrabold font-display ${pack.isMastery ? 'text-5xl' : 'text-4xl'} ${isDark ? 'text-white' : 'text-slate-900'}`}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                €{price}
              </motion.span>
            </AnimatePresence>
            {hasDiscount && (
              <span className={`line-through text-lg ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>€{originalPrice}</span>
            )}
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            €{(price / pack.sessions).toFixed(2)} per session
          </p>
        </div>

        {/* Value Bullets */}
        <div className={`space-y-2 mb-5 pb-5 border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
          {valueBullets.map((bullet) => {
            const BulletIcon = bullet.icon;
            return (
              <div key={bullet.text} className="flex items-center gap-2.5">
                <BulletIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-indigo-400/60' : 'text-indigo-500/60'}`} />
                <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{bullet.text}</span>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5">
              <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isDark ? 'bg-white/[0.06]' : 'bg-slate-100'}`}>
                <Check className={`w-2.5 h-2.5 ${
                  pack.isMastery
                    ? isDark ? 'text-indigo-400' : 'text-indigo-600'
                    : pack.popular
                      ? isDark ? 'text-amber-400' : 'text-amber-600'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                }`} />
              </div>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to="/student-signup">
          <Button
            className={`w-full py-5 text-base font-semibold transition-all duration-300 rounded-xl ${
              pack.isMastery
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg animate-glow-pulse'
                : pack.popular
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg'
                  : isDark
                    ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
            }`}
          >
            Start Your Journey
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
