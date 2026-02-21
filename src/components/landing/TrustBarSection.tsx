import { motion } from 'framer-motion';
import { Shield, Headphones, Brain } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';

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
    title: 'Certified Curriculum',
    description: 'CEFR-aligned, expertly crafted lesson plans.',
    accent: 'text-amber-400 bg-amber-500/10',
  },
];

export function TrustBarSection() {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <section className={`py-16 relative transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-[#FAFAFA]'}`}>
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
                className={`flex flex-col items-center text-center p-6 rounded-2xl backdrop-blur-xl transition-colors ${
                  isDark
                    ? 'bg-white/5 border border-white/10 hover:border-white/20'
                    : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl ${item.accent} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
