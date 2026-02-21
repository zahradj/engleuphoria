import { useState } from 'react';
import { Check, Sparkles, Clock, Tag, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type StudentLevel = 'academy' | 'professional';

interface PackTier {
  name: string;
  label: string;
  sessions: number;
  price: Record<StudentLevel, number>;
  originalPrice: Record<StudentLevel, number>;
  savings: number;
  popular: boolean;
}

const packTiers: PackTier[] = [
  {
    name: 'Starter',
    label: 'Try it out',
    sessions: 5,
    price: { academy: 75, professional: 100 },
    originalPrice: { academy: 75, professional: 100 },
    savings: 0,
    popular: false,
  },
  {
    name: 'Value Pack',
    label: 'Most popular',
    sessions: 10,
    price: { academy: 145, professional: 195 },
    originalPrice: { academy: 150, professional: 200 },
    savings: 5,
    popular: true,
  },
  {
    name: 'Mastery Pack',
    label: 'Best value',
    sessions: 20,
    price: { academy: 290, professional: 390 },
    originalPrice: { academy: 300, professional: 400 },
    savings: 10,
    popular: false,
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

export function PricingSection() {
  const [level, setLevel] = useState<StudentLevel>('academy');

  const perSession = level === 'academy' ? 15 : 20;

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Session Credit{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Packs
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
            Buy credits, book sessions. No subscriptions, no hidden fees. All sessions are 55 minutes.
          </p>

          {/* Level Toggle */}
          <div className="inline-flex items-center gap-1 bg-slate-800/80 rounded-full p-1 border border-slate-700/50">
            <button
              onClick={() => setLevel('academy')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                level === 'academy'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🎓 Academy (Teens)
            </button>
            <button
              onClick={() => setLevel('professional')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                level === 'professional'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💼 Professional (Adults)
            </button>
          </div>

          <p className="text-slate-500 text-sm mt-3">
            Base rate: <span className="text-amber-400 font-semibold">€{perSession}</span> per 55-minute session
          </p>
        </motion.div>

        {/* Pack Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packTiers.map((pack, index) => {
            const price = pack.price[level];
            const originalPrice = pack.originalPrice[level];
            const hasDiscount = pack.savings > 0;

            return (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative rounded-2xl p-7 flex flex-col ${
                  pack.popular
                    ? 'bg-gradient-to-b from-amber-500/20 to-orange-600/10 border-2 border-amber-500/50 scale-[1.02]'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                {/* Savings Badge */}
                {hasDiscount && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/30 px-3 py-1 text-xs font-bold">
                      <Tag className="w-3 h-3 mr-1" />
                      Save €{pack.savings}
                    </Badge>
                  </div>
                )}

                {/* Popular badge */}
                {pack.popular && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg shadow-orange-500/30 px-3 py-1 text-xs font-bold">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-5 mt-2">
                  <h3 className="text-xl font-bold text-white mb-1">{pack.name}</h3>
                  <p className="text-slate-400 text-sm">{pack.label}</p>
                </div>

                {/* Sessions count */}
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 text-sm font-medium">
                    {pack.sessions} × 55-min sessions
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold text-white ${pack.sessions === 20 ? 'text-5xl' : 'text-4xl'}`}>
                      €{price}
                    </span>
                    {hasDiscount && (
                      <span className="text-slate-500 line-through text-lg">€{originalPrice}</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    €{(price / pack.sessions).toFixed(2)} per session
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        pack.popular ? 'bg-amber-500/20' : 'bg-slate-700'
                      }`}>
                        <Check className={`w-2.5 h-2.5 ${pack.popular ? 'text-amber-400' : 'text-slate-400'}`} />
                      </div>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/student-signup">
                  <Button
                    className={`w-full py-5 text-base font-semibold ${
                      pack.popular
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    Buy {pack.sessions} Credits
                  </Button>
                </Link>
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
          <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Our Fair Cancellation Policy</h4>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                <p className="text-emerald-400 font-semibold mb-1">✅ Free Cancellation</p>
                <p className="text-slate-400">24+ hours before class — credit fully refunded</p>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                <p className="text-amber-400 font-semibold mb-1">⚠️ Late Cancellation</p>
                <p className="text-slate-400">Less than 24 hours — credit kept as teacher fee</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                <p className="text-slate-300 font-semibold mb-1">📅 Expiry</p>
                <p className="text-slate-400">Credits expire 6 months after purchase</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center text-slate-500 mt-8 text-sm"
        >
          All prices in EUR. First lesson includes a free assessment.
        </motion.p>
      </div>
    </section>
  );
}
