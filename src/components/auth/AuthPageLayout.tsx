import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import logoDark from '@/assets/logo-dark.png';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'teacher' | 'student';
  backLink?: { to: string; label: string };
  showProgress?: React.ReactNode;
}

export function AuthPageLayout({
  children,
  title,
  subtitle,
  icon: Icon,
  variant = 'default',
  backLink = { to: '/', label: 'Back to Home' },
  showProgress
}: AuthPageLayoutProps) {
  const getVariantColors = () => {
    switch (variant) {
      case 'teacher':
        return {
          iconGradient: 'from-emerald-400 to-teal-500',
          titleGradient: 'from-emerald-500 to-teal-600',
        };
      case 'student':
        return {
          iconGradient: 'from-violet-400 to-purple-500',
          titleGradient: 'from-violet-500 to-purple-600',
        };
      default:
        return {
          iconGradient: 'from-indigo-500 to-purple-600',
          titleGradient: 'from-indigo-500 to-purple-600',
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Subtle background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-200/30 to-transparent dark:from-purple-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-tr from-indigo-200/30 to-transparent dark:from-indigo-900/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 p-4 sm:p-6 flex items-center justify-between">
        <Link
          to={backLink.to}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{backLink.label}</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoDark} alt="EnglEuphoria" className="w-7 h-7 object-contain bg-white/90 dark:bg-white/90 rounded-lg p-0.5" />
            <span className="text-base font-bold text-foreground">EnglEuphoria</span>
          </Link>
          <ThemeModeToggle className="text-muted-foreground hover:text-foreground hover:bg-muted" />
        </div>
      </header>

      {/* Form area */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {showProgress && <div className="mb-4">{showProgress}</div>}

          {/* Card */}
          <div className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-black/20">
            {/* Subtle top border glow */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

            {/* Header */}
            <div className="text-center mb-6">
              {Icon && (
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5, delay: 0.1 }}
                    className={`w-14 h-14 bg-gradient-to-br ${colors.iconGradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </motion.div>
                </div>
              )}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-2xl font-bold bg-gradient-to-r ${colors.titleGradient} bg-clip-text text-transparent`}
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground mt-2 text-sm"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {children}
            </motion.div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
