import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { HeroThemeProvider } from '@/contexts/HeroThemeContext';
import { 
  HeroSection, 
  BentoGridSection, 
  FooterSection,
  NavHeader,
  PricingSection,
  HowItWorksSection,
  TestimonialsSection,
  ContactSection,
  TrustBarSection,
  ActivityMarquee,
  CourseOfferingsSection,
  PersonalizedPathSection,
  GamificationSection,
  FinalCTASection,
  AppDownloadSection,
  CursorTrail,
  StickyMobileCTA,
  AutoLanguageToast
} from '@/components/landing';

export default function LandingPage() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <HeroThemeProvider>
      <main className="min-h-screen bg-white dark:bg-[#09090B] transition-colors duration-300">
        <CursorTrail />
        <NavHeader />
        <HeroSection />
        <TrustBarSection />
        <CourseOfferingsSection />
        <BentoGridSection />
        <ActivityMarquee />
        <HowItWorksSection />
        <PersonalizedPathSection />
        <GamificationSection />
        <PricingSection />
        <AppDownloadSection />
        <TestimonialsSection />
        <FinalCTASection />
        <ContactSection />
        <FooterSection />
        <StickyMobileCTA />
        <AutoLanguageToast />
      </main>
    </HeroThemeProvider>
  );
}
