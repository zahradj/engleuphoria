import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeMode } from '@/hooks/useThemeMode';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import { 
  HeroSection, 
  BentoGridSection, 
  FooterSection,
  NavHeader,
  PricingSection,
  HowItWorksSection,
  TestimonialsSection,
  ContactSection,
  IntelligenceSection,
  TrustBarSection,
  AmbassadorSection,
  ActivityMarquee
} from '@/components/landing';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'}`}>
      <NavHeader />
      <HeroSection />
      <BentoGridSection />
      <ActivityMarquee />
      <IntelligenceSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <TrustBarSection />
      <AmbassadorSection />
      <ContactSection />
      <FooterSection />

      {/* Floating Bottom-Center Mood Toggle */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center justify-center rounded-full backdrop-blur-xl px-2 py-2 transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/80 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.3)]'
          : 'bg-white/80 border border-slate-200 shadow-[0_0_30px_rgba(251,191,36,0.3)]'
      }`}>
        <ThemeModeToggle className={isDark
          ? 'text-white/80 hover:text-white hover:bg-white/10'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        } />
      </div>
    </main>
  );
}
