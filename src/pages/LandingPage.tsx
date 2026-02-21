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
  IntelligenceSection,
  TrustBarSection,
  AmbassadorSection
} from '@/components/landing';

export default function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <NavHeader />
      <HeroSection />
      <BentoGridSection />
      <IntelligenceSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <TrustBarSection />
      <AmbassadorSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
