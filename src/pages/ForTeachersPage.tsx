import { NavHeader } from '@/components/landing/NavHeader';
import { FooterSection } from '@/components/landing/FooterSection';
import { HeroThemeProvider } from '@/contexts/HeroThemeContext';
import TeacherHero from '@/components/teachers/TeacherHero';
import TeacherBenefits from '@/components/teachers/TeacherBenefits';
import TeacherRequirements from '@/components/teachers/TeacherRequirements';
import TeacherProcess from '@/components/teachers/TeacherProcess';
import TeacherApplicationForm from '@/components/teachers/TeacherApplicationForm';

export default function ForTeachersPage() {
  return (
    <HeroThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <NavHeader />
        <TeacherHero />
        <TeacherBenefits />
        <TeacherRequirements />
        <TeacherProcess />
        <TeacherApplicationForm />
        <FooterSection />
      </div>
    </HeroThemeProvider>
  );
}
