import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useHeroTheme } from '@/contexts/HeroThemeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const TeacherApplicationForm = () => {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const { theme } = useHeroTheme();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    experience: '',
    certifications: '',
    motivation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: 'Application Submitted!',
      description: "We'll review your application and get back to you within 5 business days.",
    });
    setFormData({ fullName: '', email: '', phone: '', country: '', experience: '', certifications: '', motivation: '' });
    setIsSubmitting(false);
  };

  const inputClasses = `transition-colors duration-300 ${
    isDark
      ? 'bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
  }`;

  return (
    <section id="application-form" className={`py-24 md:py-32 transition-colors duration-300 ${
      isDark ? 'bg-[#09090B]' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border transition-colors duration-300 ${
            isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Start Your Journey</span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Apply Now
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Start your teaching journey with Engleuphoria
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-8 space-y-6 transition-colors duration-300 ${
            isDark
              ? 'bg-slate-900/60 border border-white/5'
              : 'bg-slate-50 border border-slate-200/60'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Full Name *</Label>
              <Input id="fullName" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={inputClasses} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Email *</Label>
              <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClasses} placeholder="john@example.com" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Phone Number</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClasses} placeholder="+1 234 567 8900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Country of Residence *</Label>
              <Input id="country" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className={inputClasses} placeholder="United States" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Teaching Experience *</Label>
            <Textarea id="experience" required value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={`min-h-[100px] ${inputClasses}`} placeholder="Describe your teaching experience..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Certifications</Label>
            <Input id="certifications" value={formData.certifications} onChange={(e) => setFormData({ ...formData, certifications: e.target.value })} className={inputClasses} placeholder="TEFL, CELTA, TESOL, etc." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Why do you want to teach with us? *</Label>
            <Textarea id="motivation" required value={formData.motivation} onChange={(e) => setFormData({ ...formData, motivation: e.target.value })} className={`min-h-[100px] ${inputClasses}`} placeholder="Tell us why you're passionate about teaching..." />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
            style={{ background: `linear-gradient(to right, ${theme.cssFrom}, ${theme.cssTo})` }}
          >
            {isSubmitting ? 'Submitting...' : (
              <>
                Submit Application
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default TeacherApplicationForm;
