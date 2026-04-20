import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Smartphone, Apple, Zap, WifiOff, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

export function AppDownloadSection() {
  const features = [
    { icon: Zap, label: 'Instant access' },
    { icon: WifiOff, label: 'Works offline' },
    { icon: Bell, label: 'Smart reminders' },
  ];

  return (
    <section id="download-app" className="relative py-24 px-4 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-emerald-500/10 dark:from-orange-500/5 dark:via-purple-500/5 dark:to-emerald-500/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-emerald-500/20 blur-3xl rounded-full" />

      <div className="relative container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Logo + Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-64 h-[520px] rounded-[3rem] bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 shadow-2xl ring-1 ring-white/10">
                <div className="w-full h-full rounded-[2.4rem] bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-emerald-500/20 backdrop-blur-xl flex flex-col items-center justify-center gap-6 p-6">
                  <AnimatedLogo size="lg" />
                  <div className="text-center">
                    <p className="text-white font-bold text-xl">Engleuphoria</p>
                    <p className="text-white/70 text-xs mt-1">Learn English. Anywhere.</p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl" />
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Download className="w-3.5 h-3.5" />
              MOBILE APP
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Take Engleuphoria <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">everywhere</span> you go
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Install the app on your phone in one tap. Practice English, join live lessons, and track your streak — even on the bus.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="h-14 px-6 text-base shadow-lg">
                <Link to="/install">
                  <Download className="w-5 h-5 mr-2" />
                  Install the App
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-6 text-base">
                <Link to="/install">
                  <Apple className="w-5 h-5 mr-2" />
                  iOS & Android Guide
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              Works on iPhone, Android, tablets, and desktop. No app store needed.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
