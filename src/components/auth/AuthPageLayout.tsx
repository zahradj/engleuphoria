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
          accentColor: 'emerald'
        };
      case 'student':
        return {
          iconGradient: 'from-violet-400 to-purple-500',
          titleGradient: 'from-violet-500 to-purple-600',
          accentColor: 'violet'
        };
      default:
        return {
          iconGradient: 'from-primary to-purple-500',
          titleGradient: 'from-primary to-purple-600',
          accentColor: 'primary'
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-pink-100/30 dark:from-purple-900/20 dark:to-pink-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-teal-200/40 to-cyan-100/30 dark:from-teal-900/20 dark:to-cyan-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-100/30 to-purple-100/20 dark:from-violet-900/10 dark:to-purple-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to={backLink.to} 
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{backLink.label}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoDark} alt="EnglEuphoria" className="w-8 h-8 object-contain bg-white/90 dark:bg-white/90 rounded-lg p-0.5" />
              <span className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">
                EnglEuphoria
              </span>
            </Link>
            <ThemeModeToggle className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Optional Progress Indicator */}
          {showProgress && <div className="mb-4">{showProgress}</div>}

          {/* Clean Card */}
          <div className="relative bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
            {/* Header */}
            <div className="text-center mb-6">
              {Icon && (
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
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
                  className="text-slate-500 dark:text-slate-400 mt-2 text-sm"
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

          {/* Footer text */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
