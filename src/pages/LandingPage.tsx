import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  FinalCTASection
} from '@/components/landing';

export default function LandingPage() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#09090B] transition-colors duration-300">
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
      <TestimonialsSection />
      <FinalCTASection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
