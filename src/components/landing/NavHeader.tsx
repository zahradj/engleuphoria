import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, Home, DollarSign, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import logoDark from '@/assets/logo-dark.png';

export function NavHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logoDark} alt="EnglEuphoria" className="w-10 h-10 object-contain bg-white/90 rounded-xl p-1" />
              <span className="text-2xl font-bold text-white">
                EnglEuphoria
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/about"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                About
              </Link>
              <button
                onClick={scrollToPricing}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Pricing
              </button>
              <Link
                to="/for-teachers"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <GraduationCap className="w-4 h-4" />
                Become a Teacher
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeModeToggle className="text-white/80 hover:text-white hover:bg-white/10" />
              <Link to="/login">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/student-signup">
                <Button className="bg-white text-slate-900 hover:bg-white/90 font-semibold shadow-lg">
                  Sign Up Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white/80 hover:text-white z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-white/10 z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <img src={logoDark} alt="EnglEuphoria" className="w-8 h-8 object-contain bg-white/90 rounded-lg p-0.5" />
                    <span className="text-xl font-bold text-white">EnglEuphoria</span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <Link
                    to="/about"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Info className="w-5 h-5" />
                    About
                  </Link>
                  <button
                    onClick={scrollToPricing}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                  >
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </button>
                  <Link
                    to="/for-teachers"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Become a Teacher
                  </Link>
                </nav>

                {/* Theme Toggle */}
                <div className="py-4 border-t border-white/10">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-white/60 text-sm">Theme</span>
                    <ThemeModeToggle className="text-white/80 hover:text-white hover:bg-white/10" />
                  </div>
                </div>

                {/* Auth Buttons */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <Link to="/login" onClick={closeMobileMenu} className="block">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/student-signup" onClick={closeMobileMenu} className="block">
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-semibold">
                      Sign Up Free
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
