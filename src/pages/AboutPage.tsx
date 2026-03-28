import { MissionHeader, PhilosophyPanels, TeamGrid, AboutCTA } from '@/components/about';
import { FooterSection } from '@/components/landing';
import NavHeader from '@/components/landing/NavHeader';
import { HeroThemeProvider } from '@/contexts/HeroThemeContext';

const AboutPage = () => {
  return (
    <HeroThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <NavHeader />
        <MissionHeader />
        <PhilosophyPanels />
        <TeamGrid />
        <AboutCTA />
        <FooterSection />
      </div>
    </HeroThemeProvider>
  );
};

export default AboutPage;
