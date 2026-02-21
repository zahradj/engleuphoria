import { motion } from 'framer-motion';
import { Shield, Headphones, Brain } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Powered by Stripe with bank-level encryption.',
    accent: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    icon: Headphones,
    title: '24-Hour Support',
    description: 'Dedicated help whenever you need it.',
    accent: 'text-indigo-400 bg-indigo-500/10',
  },
  {
    icon: Brain,
    title: 'Certified AI Curriculum',
    description: 'CEFR-aligned, AI-powered lesson plans.',
    accent: 'text-amber-400 bg-amber-500/10',
  },
];

export function TrustBarSection() {
  return (
    <section className="py-16 bg-slate-950 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className={`p-3 rounded-xl ${item.accent} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
