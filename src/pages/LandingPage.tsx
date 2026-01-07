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
