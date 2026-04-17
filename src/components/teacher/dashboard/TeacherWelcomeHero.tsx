import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Users, TrendingUp } from 'lucide-react';
import logoImage from '@/assets/engleuphoria-logo.png';

interface TeacherWelcomeHeroProps {
  teacherName: string;
  hubLabel?: string;
  todayLessons?: number;
  totalStudents?: number;
  weeklyHours?: number;
}

/**
 * A bespoke welcome hero for the teacher dashboard.
 * Editorial layout with a soft aurora background, the real EnglEuphoria logo
 * and at-a-glance stats. Designed to feel original — not the usual purple-gradient SaaS hero.
 */
export const TeacherWelcomeHero: React.FC<TeacherWelcomeHeroProps> = ({
  teacherName,
  hubLabel = 'Educator',
  todayLessons = 0,
  totalStudents = 0,
  weeklyHours = 0
}) => {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const firstName = teacherName.split(' ')[0] || teacherName;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background via-background to-muted/40 mb-6"
    >
      {/* Aurora blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 w-[26rem] h-[26rem] rounded-full bg-accent/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-8 items-center px-6 sm:px-10 py-8">
        {/* Logo medallion */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent blur-md opacity-30" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center p-3">
            <img
              src={logoImage}
              alt="EnglEuphoria"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Greeting */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            {hubLabel}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {greeting}, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{firstName}</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Your classroom is ready. Inspire one student today, and you've already changed the world a little.
          </p>
        </div>

        {/* Stat strip */}
        <div className="flex lg:flex-col gap-3 lg:gap-2">
          <Stat icon={Calendar} label="Today" value={todayLessons} suffix={todayLessons === 1 ? 'lesson' : 'lessons'} />
          <Stat icon={Users} label="Students" value={totalStudents} />
          <Stat icon={TrendingUp} label="This week" value={weeklyHours} suffix={weeklyHours === 1 ? 'hour' : 'hours'} />
        </div>
      </div>
    </motion.section>
  );
};

const Stat: React.FC<{ icon: React.ElementType; label: string; value: number; suffix?: string }> = ({
  icon: Icon, label, value, suffix
}) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card/70 backdrop-blur border border-border/60 min-w-[150px]">
    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      <Icon className="w-4 h-4" />
    </div>
    <div className="leading-tight">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className="text-lg font-bold text-foreground">
        {value}{suffix && <span className="text-xs font-medium text-muted-foreground ml-1">{suffix}</span>}
      </div>
    </div>
  </div>
);
