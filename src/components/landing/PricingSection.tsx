import { useState } from 'react';
import { Check, Sparkles, Clock, Tag, Shield, Cpu, UserCheck, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  { icon: Cpu, text: 'AI-Powered Curriculum' },
  { icon: UserCheck, text: 'Verified Native Teachers' },
];

export function PricingSection() {
  const [level, setLevel] = useState<AudienceLevel>('playground');
  const perSession = level === 'professional' ? 20 : 15;

  return (
    <section id="pricing" className="py-24 bg-[#09090B] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 font-display">
            Session Credit{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Packs
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">
            Buy credits, book sessions. No subscriptions, no hidden fees. All sessions are 55 minutes.
          </p>

          {/* 2-Way Toggle */}
          <div className="inline-flex items-center bg-white/[0.04] backdrop-blur-xl rounded-full p-1.5 border border-white/[0.08]">
            {([
              { key: 'playground' as const, label: '🎨 Playground & Academy' },
              { key: 'professional' as const, label: '💼 Professional' },
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLevel(opt.key)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  level === opt.key
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="text-slate-600 text-sm mt-3">
            Base rate: <span className="text-indigo-400 font-semibold">€{perSession}</span> per 55-minute session
          </p>
        </motion.div>

        {/* Pack Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packTiers.map((pack, index) => {
            const price = pack.price[level];
            const originalPrice = pack.originalPrice[level];
            const hasDiscount = pack.savings > 0;
            const packName = pack.name[level];

            return (
              <motion.div
                key={packName}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative rounded-3xl p-7 flex flex-col backdrop-blur-xl transition-all duration-500 ${
                  pack.isMastery
                    ? 'bg-white/[0.06] border border-white/[0.08] scale-[1.03]'
                    : pack.popular
                      ? 'bg-white/[0.05] border border-amber-500/20'
                      : 'bg-white/[0.04] border border-white/[0.08]'
                } hover:bg-white/[0.08]`}
              >
                {/* Animated gradient border for Mastery */}
                {pack.isMastery && (
                  <div className="absolute -inset-[1px] rounded-3xl overflow-hidden pointer-events-none">
                    <div
                      className="absolute inset-[-50%] animate-gradient-rotate"
                      style={{
                        background: 'conic-gradient(from 0deg, #6366f1, #10b981, #f59e0b, #6366f1)',
                        opacity: 0.4,
                      }}
                    />
                    <div className="absolute inset-[1px] rounded-3xl bg-[#09090B]" />
                  </div>
                )}

                {/* Savings Badge */}
                {hasDiscount && (
                  <div className="absolute -top-3 right-4 z-10">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white ${
                      pack.isMastery
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500'
                    }`}>
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
                    <h3 className="text-xl font-bold text-white mb-1 font-display">{packName}</h3>
                    <p className="text-slate-500 text-sm">{pack.label}</p>
                  </div>

                  {/* Sessions count */}
                  <div className="mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-slate-400 text-sm font-medium">
                      {pack.sessions} × 55-min sessions
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-extrabold text-white font-display ${pack.isMastery ? 'text-5xl' : 'text-4xl'}`}>
                        €{price}
                      </span>
                      {hasDiscount && (
                        <span className="text-slate-600 line-through text-lg">€{originalPrice}</span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      €{(price / pack.sessions).toFixed(2)} per session
                    </p>
                  </div>

                  {/* Value Bullets */}
                  <div className="space-y-2 mb-5 pb-5 border-b border-white/[0.06]">
                    {valueBullets.map((bullet) => {
                      const BulletIcon = bullet.icon;
                      return (
                        <div key={bullet.text} className="flex items-center gap-2.5">
                          <BulletIcon className="w-3.5 h-3.5 text-indigo-400/60 flex-shrink-0" />
                          <span className="text-slate-400 text-xs font-medium">{bullet.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center bg-white/[0.06]">
                          <Check className={`w-2.5 h-2.5 ${
                            pack.isMastery ? 'text-indigo-400' : pack.popular ? 'text-amber-400' : 'text-slate-500'
                          }`} />
                        </div>
                        <span className="text-slate-400 text-sm">{feature}</span>
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
                            : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                      }`}
                    >
                      Start Your Journey
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cancellation Policy */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-12"
        >
          <div className="backdrop-blur-xl bg-white/[0.04] rounded-2xl border border-white/[0.08] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Our Fair Cancellation Policy</h4>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/10">
                <p className="text-emerald-400 font-semibold mb-1">✅ Free Cancellation</p>
                <p className="text-slate-500">24+ hours before class — credit fully refunded</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/10">
                <p className="text-amber-400 font-semibold mb-1">⚠️ Late Cancellation</p>
                <p className="text-slate-500">Less than 24 hours — credit kept as teacher fee</p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                <p className="text-slate-300 font-semibold mb-1">📅 Expiry</p>
                <p className="text-slate-500">Credits expire 6 months after purchase</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center text-slate-600 mt-8 text-sm"
        >
          All prices in EUR. First lesson includes a free assessment.
        </motion.p>
      </div>
    </section>
  );
}
