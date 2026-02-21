import { Check, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const pricingPlans = [
  {
    name: '25-Minute Focused Quest',
    duration: '25 minutes',
    price: 7.5,
    pricePerMinute: '0.30',
    description: 'A focused burst of learning — perfect for kids and busy schedules',
    features: [
      'One-on-one with native speaker',
      'Personalized lesson plan',
      'Homework & resources',
      'Progress tracking',
    ],
    popular: false,
    priceNote: null,
  },
  {
    name: '55-Minute Deep Dive',
    duration: '55 minutes',
    price: 15,
    pricePerMinute: '0.27',
    description: 'Our signature deep-dive session for comprehensive mastery',
    features: [
      'One-on-one with native speaker',
      'Personalized lesson plan',
      'Homework & resources',
      'Progress tracking',
      'Extended conversation practice',
      'In-depth grammar review',
    ],
    popular: true,
    priceNote: 'Academy: €15 · Professional: €20',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in Your{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Future
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the lesson length that works best for you. No subscriptions, no hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-amber-500/20 to-orange-600/10 border-2 border-amber-500/50'
                  : 'bg-slate-800/50 border border-slate-700/50'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/30">
                    <Sparkles className="w-4 h-4" />
                    Best Value
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{plan.duration}</span>
                </div>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">€{plan.price}</span>
                  <span className="text-slate-400">/lesson</span>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  €{plan.pricePerMinute} per minute
                </p>
                {plan.priceNote && (
                  <p className="text-amber-400/80 text-xs mt-1 font-medium">
                    {plan.priceNote}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-amber-500/20' : 'bg-slate-700'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-amber-400' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link to="/student-signup">
                <Button
                  className={`w-full py-6 text-lg font-semibold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-slate-500 mt-12"
        >
          All prices in EUR. First lesson includes a free assessment.
        </motion.p>
      </div>
    </section>
  );
}
