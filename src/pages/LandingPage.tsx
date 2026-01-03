import { HeroSection, BentoGridSection, FooterSection } from '@/components/landing';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <HeroSection />
      <BentoGridSection />
      <FooterSection />
    </main>
  );
}
