import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useThemeMode } from '@/hooks/useThemeMode';
import logoDark from '@/assets/logo-dark.png';

export function NavHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Courses', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Testimonials', id: 'testimonials' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? isDark
              ? 'bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.05]'
              : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logoDark}
                alt="EnglEuphoria"
                className="w-9 h-9 object-contain bg-white/90 rounded-xl p-0.5"
              />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                EnglEuphoria
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/for-teachers"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Teach With Us
              </Link>
            </nav>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-3">
              <div className={isDark
                ? '[&_button]:text-white/70 [&_button]:hover:text-white [&_button]:hover:bg-white/10 [&_button]:border-white/20'
                : '[&_button]:text-slate-500 [&_button]:hover:text-slate-900 [&_button]:hover:bg-slate-100 [&_button]:border-slate-200'
              }>
                <LanguageSwitcher />
              </div>
              <Link to="/login">
                <Button variant="ghost" className={`text-sm font-medium ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}>
                  Log In
                </Button>
              </Link>
              <Link to="/student-signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-6 shadow-lg shadow-indigo-500/20 rounded-xl">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 ${isDark ? 'text-white/80' : 'text-slate-600'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden ${
                isDark ? 'bg-[#09090B] border-l border-white/10' : 'bg-white border-l border-slate-200'
              }`}
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-10">
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-2 rounded-xl ${isDark ? 'text-white/60 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex-1 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-left font-medium transition-colors ${
                        isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  ))}
                  <Link
                    to="/for-teachers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-left font-medium transition-colors ${
                      isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Teach With Us
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                </nav>

                <div className={`space-y-3 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between px-4 mb-3">
                    <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Language</span>
                    <LanguageSwitcher />
                  </div>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button variant="outline" className={`w-full ${
                      isDark ? 'border-white/20 text-white' : 'border-slate-200 text-slate-700'
                    }`}>
                      Log In
                    </Button>
                  </Link>
                  <Link to="/student-signup" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
