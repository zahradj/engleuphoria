import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
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

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-lg border-b border-white/10 shadow-lg'
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
              to="/teacher-signup"
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
                Student Login
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
            className="md:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/98 backdrop-blur-lg border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link
                to="/about"
                className="text-white/80 hover:text-white py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <button
                onClick={scrollToPricing}
                className="text-white/80 hover:text-white py-2 font-medium text-left"
              >
                Pricing
              </button>
              <Link
                to="/teacher-signup"
                className="flex items-center gap-2 text-white/80 hover:text-white py-2 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <GraduationCap className="w-4 h-4" />
                Become a Teacher
              </Link>
              <div className="flex items-center gap-2 py-2">
                <span className="text-white/60 text-sm">Theme:</span>
                <ThemeModeToggle className="text-white/80 hover:text-white hover:bg-white/10" />
              </div>
              <hr className="border-white/10" />
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-white/80 hover:text-white hover:bg-white/10">
                  Student Login
                </Button>
              </Link>
              <Link to="/student-signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
