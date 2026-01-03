import { Link } from 'react-router-dom';
import { MissionHeader, PhilosophyPanels, TeamGrid, AboutCTA } from '@/components/about';
import { FooterSection } from '@/components/landing';
import logoDark from '@/assets/logo-dark.png';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoDark} alt="Engleuphoria" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white/70 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link to="/about" className="text-white font-semibold text-sm">
              About
            </Link>
            <Link to="/teach-with-us" className="text-white/70 hover:text-white transition-colors text-sm">
              Teach With Us
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Mission Header */}
      <MissionHeader />

      {/* Philosophy Panels */}
      <PhilosophyPanels />

      {/* Team Grid */}
      <TeamGrid />

      {/* CTA Section */}
      <AboutCTA />

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default AboutPage;
