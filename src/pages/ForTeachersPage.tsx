import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Clock, 
  DollarSign, 
  BookOpen, 
  TrendingUp, 
  Globe, 
  Users,
  CheckCircle2,
  ArrowRight,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { NavHeader } from '@/components/landing/NavHeader';
import { FooterSection } from '@/components/landing/FooterSection';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { PageTransition } from '@/components/common/PageTransition';
import { useToast } from '@/hooks/use-toast';

const benefits = [
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Work from anywhere in the world and set your own teaching hours.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: DollarSign,
    title: 'Competitive Pay',
    description: 'Earn competitive rates per lesson with performance bonuses.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: BookOpen,
    title: 'Teaching Materials',
    description: 'Access our premium curriculum, lesson plans, and interactive resources.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: TrendingUp,
    title: 'Professional Growth',
    description: 'Ongoing training, certifications, and career development opportunities.',
    color: 'from-rose-500 to-pink-600'
  },
  {
    icon: Globe,
    title: 'Global Students',
    description: 'Connect with learners from around the world and make a real impact.',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    icon: Users,
    title: 'Supportive Community',
    description: 'Join a network of passionate educators who support each other.',
    color: 'from-indigo-500 to-violet-600'
  }
];

const requirements = [
  'Native or near-native English proficiency (C1/C2 level)',
  'Teaching certification (TEFL, TESOL, CELTA, or equivalent preferred)',
  'Bachelor\'s degree (any field)',
  'Reliable high-speed internet connection',
  'Experience with online teaching platforms (preferred)',
  'Passion for education and helping students succeed'
];

const applicationSteps = [
  { step: 1, title: 'Submit Application', description: 'Fill out the form below with your details' },
  { step: 2, title: 'Video Interview', description: 'Brief online interview with our team' },
  { step: 3, title: 'Demo Lesson', description: 'Conduct a short demo lesson' },
  { step: 4, title: 'Onboarding', description: 'Complete training and start teaching' }
];

export default function ForTeachersPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    experience: '',
    certifications: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 5 business days.",
    });
    
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      experience: '',
      certifications: '',
      motivation: ''
    });
    setIsSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950">
        <NavHeader />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 to-slate-950" />
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Join Our Teaching Team
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.1}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Transform Lives Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
                  Teaching
                </span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Join EnglEuphoria and inspire students worldwide. Enjoy flexible hours, 
                competitive pay, and the support you need to thrive.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white px-8 py-6 text-lg"
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </AnimatedSection>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Why Teach With Us?
              </h2>
              <p className="text-xl text-slate-400">
                Discover the benefits of joining the EnglEuphoria teaching team
              </p>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <AnimatedSection key={benefit.title} delay={index * 0.1}>
                  <motion.div
                    className="relative group p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm overflow-hidden"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} mb-4`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-slate-400">{benefit.description}</p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20 px-6 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Requirements
              </h2>
              <p className="text-xl text-slate-400">
                What we're looking for in our teachers
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-8">
                <ul className="space-y-4">
                  {requirements.map((req, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{req}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Application Process
              </h2>
              <p className="text-xl text-slate-400">
                Four simple steps to join our team
              </p>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-4 gap-6">
              {applicationSteps.map((step, index) => (
                <AnimatedSection key={step.step} delay={index * 0.15}>
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                    
                    {index < applicationSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent" />
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="application-form" className="py-20 px-6 bg-slate-900/50">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Apply Now
              </h2>
              <p className="text-xl text-slate-400">
                Start your teaching journey with EnglEuphoria
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl border border-white/10 p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-slate-900/50 border-white/10 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-900/50 border-white/10 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-slate-900/50 border-white/10 text-white"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-white">Country of Residence *</Label>
                    <Input
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="bg-slate-900/50 border-white/10 text-white"
                      placeholder="United States"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-white">Teaching Experience *</Label>
                  <Textarea
                    id="experience"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="bg-slate-900/50 border-white/10 text-white min-h-[100px]"
                    placeholder="Describe your teaching experience, including years of experience and types of students taught..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certifications" className="text-white">Certifications</Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className="bg-slate-900/50 border-white/10 text-white"
                    placeholder="TEFL, CELTA, TESOL, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motivation" className="text-white">Why do you want to teach with us? *</Label>
                  <Textarea
                    id="motivation"
                    required
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    className="bg-slate-900/50 border-white/10 text-white min-h-[100px]"
                    placeholder="Tell us why you're passionate about teaching and why you want to join EnglEuphoria..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white py-6 text-lg"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Application
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </AnimatedSection>
          </div>
        </section>

        <FooterSection />
      </div>
    </PageTransition>
  );
}
