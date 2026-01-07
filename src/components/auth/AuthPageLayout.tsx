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

const blobVariants = {
  animate: {
    x: [0, 30, -20, 0],
    y: [0, -40, 20, 0],
    scale: [1, 1.1, 0.95, 1],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

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
          iconGradient: 'from-emerald-500 to-blue-500',
          titleGradient: 'from-emerald-400 to-blue-400',
          blob1: 'from-emerald-500/20 to-teal-500/15',
          blob2: 'from-blue-500/20 to-cyan-500/15',
          blob3: 'from-violet-500/15 to-purple-500/10'
        };
      case 'student':
        return {
          iconGradient: 'from-violet-500 to-pink-500',
          titleGradient: 'from-violet-400 to-pink-400',
          blob1: 'from-violet-500/20 to-purple-500/15',
          blob2: 'from-pink-500/20 to-rose-500/15',
          blob3: 'from-blue-500/15 to-cyan-500/10'
        };
      default:
        return {
          iconGradient: 'from-violet-500 to-emerald-500',
          titleGradient: 'from-violet-400 to-emerald-400',
          blob1: 'from-blue-500/20 to-cyan-500/15',
          blob2: 'from-violet-500/20 to-purple-500/15',
          blob3: 'from-emerald-500/15 to-teal-500/10'
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={blobVariants}
          animate="animate"
          className={`absolute top-20 left-20 w-96 h-96 bg-gradient-to-r ${colors.blob1} rounded-full mix-blend-screen dark:mix-blend-screen filter blur-3xl opacity-60 dark:opacity-100`}
        />
        <motion.div
          variants={blobVariants}
          animate="animate"
          style={{ animationDelay: '5s' }}
          className={`absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r ${colors.blob2} rounded-full mix-blend-screen dark:mix-blend-screen filter blur-3xl opacity-60 dark:opacity-100`}
        />
        <motion.div
          variants={blobVariants}
          animate="animate"
          style={{ animationDelay: '10s' }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r ${colors.blob3} rounded-full mix-blend-screen dark:mix-blend-screen filter blur-3xl opacity-40 dark:opacity-100`}
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to={backLink.to} 
            className="flex items-center gap-2 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{backLink.label}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoDark} alt="EnglEuphoria" className="w-8 h-8 object-contain bg-white/90 dark:bg-white/90 rounded-lg p-0.5" />
              <span className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">
                EnglEuphoria
              </span>
            </Link>
            <ThemeModeToggle className="text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Optional Progress Indicator */}
          {showProgress && <div className="mb-4">{showProgress}</div>}

          {/* Glass Card */}
          <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-2xl">
            {/* Card glow effects */}
            <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute -z-10 bottom-0 right-0 w-[60%] h-[60%] bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-2xl" />

            {/* Header */}
            <div className="text-center mb-6">
              {Icon && (
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                    className={`w-16 h-16 bg-gradient-to-r ${colors.iconGradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              )}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl font-bold bg-gradient-to-r ${colors.titleGradient} bg-clip-text text-transparent`}
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-600 dark:text-slate-400 mt-2"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
