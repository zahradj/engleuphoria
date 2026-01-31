import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  GraduationCap, 
  Lightbulb, 
  Video, 
  Users,
  CheckCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedTeacherApplicationFormProps {
  onSubmissionSuccess: (applicationId: string) => void;
}

interface FormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  
  // Step 2: Bio & Education
  bio: string;
  educationLevel: string;
  educationDetails: string;
  teachingExperienceYears: number;
  eslCertifications: string;
  
  // Step 3: Teaching Philosophy
  teachingPhilosophy: string;
  teachingMethodology: string;
  classroomManagement: string;
  
  // Step 4: Video Introduction
  videoUrl: string;
  videoDescription: string;
  
  // Step 5: Preferences
  preferredAgeGroup: string;
  availability: string;
  timeZone: string;
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Bio & Education', icon: GraduationCap },
  { id: 3, title: 'Teaching Philosophy', icon: Lightbulb },
  { id: 4, title: 'Video Introduction', icon: Video },
  { id: 5, title: 'Preferences', icon: Users },
];

const ageGroupOptions = [
  { value: 'kids', label: 'Kids (4-11)', description: 'Young learners who need playful, interactive lessons' },
  { value: 'teens', label: 'Teens (12-17)', description: 'Teenagers who benefit from engaging, relevant content' },
  { value: 'adults', label: 'Adults (18+)', description: 'Adult learners focused on professional development' },
  { value: 'all', label: 'All Ages', description: 'Comfortable teaching any age group' },
];

export const EnhancedTeacherApplicationForm: React.FC<EnhancedTeacherApplicationFormProps> = ({ 
  onSubmissionSuccess 
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    bio: '',
    educationLevel: '',
    educationDetails: '',
    teachingExperienceYears: 0,
    eslCertifications: '',
    teachingPhilosophy: '',
    teachingMethodology: '',
    classroomManagement: '',
    videoUrl: '',
    videoDescription: '',
    preferredAgeGroup: '',
    availability: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email);
      case 2:
        return !!(formData.bio && formData.educationLevel);
      case 3:
        return !!(formData.teachingPhilosophy);
      case 4:
        return !!(formData.videoUrl);
      case 5:
        return !!(formData.preferredAgeGroup);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        bio: formData.bio,
        education_level: formData.educationLevel,
        education: formData.educationDetails,
        teaching_experience_years: formData.teachingExperienceYears,
        esl_certification: formData.eslCertifications,
        teaching_philosophy: formData.teachingPhilosophy,
        teaching_methodology: formData.teachingMethodology,
        classroom_management: formData.classroomManagement,
        video_url: formData.videoUrl,
        video_description: formData.videoDescription,
        target_age_group: formData.preferredAgeGroup,
        availability: formData.availability,
        time_zone: formData.timeZone,
        current_stage: 'application_submitted',
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('teacher_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Application Submitted! 🎉",
        description: "We'll review your application and contact you within 3-5 business days.",
      });

      onSubmissionSuccess(data.id);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Smith"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.smith@example.com"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="e.g., American, British"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="bio">Professional Bio *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Tell us about yourself and your teaching journey (150-300 words)
              </p>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="I am a passionate ESL educator with over 5 years of experience teaching students of all ages..."
                rows={5}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="educationLevel">Highest Education Level *</Label>
              <Input
                id="educationLevel"
                value={formData.educationLevel}
                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                placeholder="e.g., Bachelor's in Education, Master's in TESOL"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="educationDetails">Education Details</Label>
              <Textarea
                id="educationDetails"
                value={formData.educationDetails}
                onChange={(e) => handleInputChange('educationDetails', e.target.value)}
                placeholder="List your degrees, universities attended, and graduation years..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teachingExperience">Years of Teaching Experience</Label>
                <Input
                  id="teachingExperience"
                  type="number"
                  min="0"
                  value={formData.teachingExperienceYears}
                  onChange={(e) => handleInputChange('teachingExperienceYears', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="eslCertifications">ESL Certifications</Label>
                <Input
                  id="eslCertifications"
                  value={formData.eslCertifications}
                  onChange={(e) => handleInputChange('eslCertifications', e.target.value)}
                  placeholder="e.g., TEFL, TESOL, CELTA"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="teachingPhilosophy">Teaching Philosophy *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                What are your core beliefs about teaching and learning? (100-200 words)
              </p>
              <Textarea
                id="teachingPhilosophy"
                value={formData.teachingPhilosophy}
                onChange={(e) => handleInputChange('teachingPhilosophy', e.target.value)}
                placeholder="I believe that every student learns differently, and my role as a teacher is to adapt my approach to meet each student's unique needs..."
                rows={5}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="teachingMethodology">Teaching Methodology</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Describe your teaching methods and techniques
              </p>
              <Textarea
                id="teachingMethodology"
                value={formData.teachingMethodology}
                onChange={(e) => handleInputChange('teachingMethodology', e.target.value)}
                placeholder="I use a communicative approach that focuses on real-life scenarios and practical language use..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="classroomManagement">Classroom Management Style</Label>
              <p className="text-sm text-muted-foreground mb-2">
                How do you create an engaging and supportive learning environment?
              </p>
              <Textarea
                id="classroomManagement"
                value={formData.classroomManagement}
                onChange={(e) => handleInputChange('classroomManagement', e.target.value)}
                placeholder="I establish clear expectations while maintaining a positive, encouraging atmosphere..."
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Video className="h-12 w-12 mx-auto text-primary mb-3" />
                  <h3 className="font-semibold text-lg">Video Introduction</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit a 2-3 minute video introducing yourself and demonstrating your teaching style
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="videoUrl">Video URL *</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      YouTube, Vimeo, Google Drive, or Loom links accepted
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="videoDescription">Video Description</Label>
                    <Textarea
                      id="videoDescription"
                      value={formData.videoDescription}
                      onChange={(e) => handleInputChange('videoDescription', e.target.value)}
                      placeholder="Brief description of what you cover in your video..."
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">📹 Video Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Introduce yourself warmly and professionally</li>
                <li>• Demonstrate a brief teaching segment</li>
                <li>• Show your personality and teaching energy</li>
                <li>• Ensure good lighting and audio quality</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Preferred Age Group *</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select the age group you prefer to teach
              </p>
              <RadioGroup
                value={formData.preferredAgeGroup}
                onValueChange={(value) => handleInputChange('preferredAgeGroup', value)}
                className="grid gap-3"
              >
                {ageGroupOptions.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.preferredAgeGroup === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div>
                      <span className="font-medium">{option.label}</span>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                placeholder="e.g., Monday-Friday 9am-5pm EST, Weekends available"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="timeZone">Time Zone</Label>
              <Input
                id="timeZone"
                value={formData.timeZone}
                onChange={(e) => handleInputChange('timeZone', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isCompleted && "bg-green-500 text-white",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-2 hidden md:block",
                    isCurrent && "font-medium text-primary",
                    !isCurrent && "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-1 mx-2",
                    currentStep > step.id ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {currentStep < steps.length ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
