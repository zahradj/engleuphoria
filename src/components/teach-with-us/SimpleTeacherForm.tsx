import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Ireland',
  'South Africa', 'Philippines', 'India', 'Germany', 'France',
  'Spain', 'Brazil', 'Mexico', 'Japan', 'South Korea', 'Other'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Portuguese',
  'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other'
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  yearsExperience: string;
  hasCertification: boolean;
  primaryLanguage: string;
  whyTeaching: string;
  cvFile: File | null;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  yearsExperience: '',
  hasCertification: false,
  primaryLanguage: '',
  whyTeaching: '',
  cvFile: null
};

const SimpleTeacherForm = forwardRef<HTMLDivElement>((_, ref) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const { toast } = useToast();

  const totalSteps = 4;

  const updateField = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.country) newErrors.country = 'Please select your country';
    }

    if (step === 2) {
      if (!formData.yearsExperience) newErrors.yearsExperience = 'Please enter years of experience';
      if (!formData.primaryLanguage) newErrors.primaryLanguage = 'Please select your primary language';
    }

    if (step === 3) {
      if (!formData.whyTeaching.trim()) newErrors.whyTeaching = 'Please tell us why you love teaching';
      else if (formData.whyTeaching.length < 50) {
        newErrors.whyTeaching = 'Please write at least 50 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file only.',
          variant: 'destructive'
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 10MB.',
          variant: 'destructive'
        });
        return;
      }
      updateField('cvFile', file);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      let cvUrl = null;

      // Upload CV if provided
      if (formData.cvFile) {
        const fileExt = formData.cvFile.name.split('.').pop();
        const fileName = `${Date.now()}-${formData.email.replace(/[^a-z0-9]/gi, '_')}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('teacher-applications')
          .upload(fileName, formData.cvFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('teacher-applications')
          .getPublicUrl(fileName);
        
        cvUrl = publicUrl;
      }

      // Insert application
      const { error } = await supabase.from('teacher_applications').insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        nationality: formData.country,
        teaching_experience_years: parseInt(formData.yearsExperience) || 0,
        esl_certification: formData.hasCertification ? 'Yes' : 'No',
        languages_spoken: [formData.primaryLanguage],
        cover_letter: formData.whyTeaching,
        cv_url: cvUrl,
        status: 'new',
        current_stage: 'application_received'
      });

      if (error) throw error;

      // Success!
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (error: unknown) {
      console.error('Application error:', error);
      toast({
        title: 'Application Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div ref={ref} className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <GlassCard className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-display font-bold text-white mb-4">
                Application Received!
              </h3>
              
              <p className="text-white/70 text-lg mb-8">
                Check your email for next steps. We typically respond within 3-5 business days.
              </p>

              <GlassButton
                onClick={() => window.location.href = '/'}
                className="bg-white/10 hover:bg-white/20"
              >
                Back to Home
              </GlassButton>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} id="application-form" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Start Your Application
          </h2>
          <p className="text-white/60 text-lg">
            It only takes a few minutes to apply
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <GlassCard className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Basics */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-display font-bold text-white mb-4">
                    The Basics
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white/80">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white/80">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label className="text-white/80">Country</Label>
                    <Select value={formData.country} onValueChange={(v) => updateField('country', v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Experience */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-display font-bold text-white mb-4">
                    Your Experience
                  </h3>

                  <div>
                    <Label htmlFor="experience" className="text-white/80">Years of Teaching Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsExperience}
                      onChange={(e) => updateField('yearsExperience', e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                      placeholder="e.g., 5"
                    />
                    {errors.yearsExperience && <p className="text-red-400 text-sm mt-1">{errors.yearsExperience}</p>}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="certification"
                      checked={formData.hasCertification}
                      onCheckedChange={(checked) => updateField('hasCertification', !!checked)}
                    />
                    <Label htmlFor="certification" className="text-white/80">
                      I have TEFL/TESOL certification
                    </Label>
                  </div>

                  <div>
                    <Label className="text-white/80">Primary Language</Label>
                    <Select value={formData.primaryLanguage} onValueChange={(v) => updateField('primaryLanguage', v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                        <SelectValue placeholder="Select your primary language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.primaryLanguage && <p className="text-red-400 text-sm mt-1">{errors.primaryLanguage}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 3: The Pitch */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-display font-bold text-white mb-4">
                    Tell Us About You
                  </h3>

                  <div>
                    <Label htmlFor="whyTeaching" className="text-white/80">
                      Why do you love teaching?
                    </Label>
                    <Textarea
                      id="whyTeaching"
                      value={formData.whyTeaching}
                      onChange={(e) => updateField('whyTeaching', e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 min-h-[150px]"
                      placeholder="Share your passion for teaching and what makes you a great educator..."
                    />
                    <div className="flex justify-between mt-1">
                      {errors.whyTeaching && <p className="text-red-400 text-sm">{errors.whyTeaching}</p>}
                      <p className="text-white/40 text-sm ml-auto">
                        {formData.whyTeaching.length} / 50 min characters
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Upload */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-display font-bold text-white mb-4">
                    Upload Your Resume
                  </h3>

                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      {formData.cvFile ? (
                        <div>
                          <p className="text-white font-medium">{formData.cvFile.name}</p>
                          <p className="text-white/60 text-sm mt-1">Click to change file</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-white/80">Click to upload your CV/Resume</p>
                          <p className="text-white/40 text-sm mt-1">PDF only, max 10MB (optional)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  <p className="text-white/50 text-sm text-center">
                    Don't have your CV ready? No problem! You can submit it later.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 1
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {currentStep < totalSteps ? (
                <GlassButton onClick={handleNext} className="bg-violet-500 hover:bg-violet-600">
                  Next
                  <ChevronRight className="w-5 h-5 ml-1" />
                </GlassButton>
              ) : (
                <GlassButton
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </GlassButton>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
});

SimpleTeacherForm.displayName = 'SimpleTeacherForm';

export default SimpleTeacherForm;
