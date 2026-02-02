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
  ContactSection
} from '@/components/landing';

export default function LandingPage() {
  const { user, loading } = useAuth();

  // Don't redirect while still loading auth state
  if (loading) {
    return null;
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <NavHeader />
      <HeroSection />
      <BentoGridSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
