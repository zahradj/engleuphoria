
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Plus } from "lucide-react";

interface TeacherApplicationFormProps {
  onSubmissionSuccess: (applicationId: string) => void;
}

interface Reference {
  name: string;
  relationship: string;
  email: string;
  phone: string;
}

export const TeacherApplicationForm: React.FC<TeacherApplicationFormProps> = ({ onSubmissionSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [references, setReferences] = useState<Reference[]>([
    { name: '', relationship: '', email: '', phone: '' }
  ]);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    nationality: '',
    
    // Professional Information
    education: '',
    certifications: [] as string[],
    teachingExperienceYears: 0,
    previousRoles: '',
    skills: [] as string[],
    languagesSpoken: [] as string[],
    
    // ESL Specific
    eslCertification: '',
    teachingMethodology: '',
    ageGroupsExperience: [] as string[],
    
    // Application Materials
    coverLetter: '',
    portfolioUrl: '',
    
    // Preferences
    availability: '',
    preferredAgeGroups: [] as string[],
    preferredSchedule: '',
    salaryExpectation: 0
  });

  const certificationOptions = [
    'TEFL', 'TESOL', 'CELTA', 'DELTA', 'Trinity TESOL', 'Cambridge CELTA', 'Other'
  ];

  const skillOptions = [
    'Grammar Instruction', 'Conversation Practice', 'Phonics', 'Business English',
    'Academic English', 'Test Preparation', 'Young Learners', 'Adult Education',
    'Online Teaching', 'Curriculum Development'
  ];

  const languageOptions = [
    'English (Native)', 'English (Fluent)', 'Spanish', 'French', 'German', 
    'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese', 'Other'
  ];

  const ageGroupOptions = [
    '4-6 years', '7-9 years', '10-12 years', '13-15 years', '16-18 years', 'Adults'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleReferenceChange = (index: number, field: keyof Reference, value: string) => {
    setReferences(prev => prev.map((ref, i) => 
      i === index ? { ...ref, [field]: value } : ref
    ));
  };

  const addReference = () => {
    if (references.length < 3) {
      setReferences(prev => [...prev, { name: '', relationship: '', email: '', phone: '' }]);
    }
  };

  const removeReference = (index: number) => {
    if (references.length > 1) {
      setReferences(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadCV = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('teacher-applications')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('teacher-applications')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading CV:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload CV if provided
      let cvUrl = null;
      if (cvFile) {
        cvUrl = await uploadCV(cvFile);
        if (!cvUrl) {
          throw new Error('Failed to upload CV');
        }
      }

      // Prepare application data
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.dateOfBirth || null,
        nationality: formData.nationality,
        education: formData.education,
        certifications: formData.certifications,
        teaching_experience_years: formData.teachingExperienceYears,
        previous_roles: formData.previousRoles,
        skills: formData.skills,
        languages_spoken: formData.languagesSpoken,
        esl_certification: formData.eslCertification,
        teaching_methodology: formData.teachingMethodology,
        age_groups_experience: formData.ageGroupsExperience,
        cv_url: cvUrl,
        cover_letter: formData.coverLetter,
        portfolio_url: formData.portfolioUrl,
        availability: formData.availability,
        preferred_age_groups: formData.preferredAgeGroups,
        preferred_schedule: formData.preferredSchedule,
        salary_expectation: formData.salaryExpectation || null,
        professional_references: references.filter(ref => ref.name && ref.email)
      };

      const { data, error } = await supabase
        .from('teacher_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and get back to you within 3-5 business days.",
      });

      onSubmissionSuccess(data.id);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Background */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="education">Education Background *</Label>
            <Textarea
              id="education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="List your degrees, institutions, and graduation years..."
              required
              rows={3}
            />
          </div>

          <div>
            <Label>Certifications</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={cert}
                    checked={formData.certifications.includes(cert)}
                    onCheckedChange={() => handleArrayChange('certifications', cert)}
                  />
                  <Label htmlFor={cert} className="text-sm">{cert}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="teachingExperienceYears">Years of Teaching Experience *</Label>
            <Input
              id="teachingExperienceYears"
              type="number"
              min="0"
              value={formData.teachingExperienceYears}
              onChange={(e) => handleInputChange('teachingExperienceYears', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="previousRoles">Previous Teaching Roles</Label>
            <Textarea
              id="previousRoles"
              value={formData.previousRoles}
              onChange={(e) => handleInputChange('previousRoles', e.target.value)}
              placeholder="Describe your previous teaching positions, institutions, and responsibilities..."
              rows={3}
            />
          </div>

          <div>
            <Label>Teaching Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={() => handleArrayChange('skills', skill)}
                  />
                  <Label htmlFor={skill} className="text-sm">{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Languages Spoken</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={formData.languagesSpoken.includes(language)}
                    onCheckedChange={() => handleArrayChange('languagesSpoken', language)}
                  />
                  <Label htmlFor={language} className="text-sm">{language}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESL Specific */}
      <Card>
        <CardHeader>
          <CardTitle>ESL Teaching Expertise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="eslCertification">ESL Certification</Label>
            <Input
              id="eslCertification"
              value={formData.eslCertification}
              onChange={(e) => handleInputChange('eslCertification', e.target.value)}
              placeholder="e.g., TEFL, TESOL, CELTA"
            />
          </div>

          <div>
            <Label htmlFor="teachingMethodology">Teaching Methodology</Label>
            <Textarea
              id="teachingMethodology"
              value={formData.teachingMethodology}
              onChange={(e) => handleInputChange('teachingMethodology', e.target.value)}
              placeholder="Describe your teaching approach and methodologies..."
              rows={3}
            />
          </div>

          <div>
            <Label>Age Groups Experience</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {ageGroupOptions.map((age) => (
                <div key={age} className="flex items-center space-x-2">
                  <Checkbox
                    id={age}
                    checked={formData.ageGroupsExperience.includes(age)}
                    onCheckedChange={() => handleArrayChange('ageGroupsExperience', age)}
                  />
                  <Label htmlFor={age} className="text-sm">{age}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Application Materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cv">CV/Resume Upload</Label>
            <div className="mt-2">
              <input
                type="file"
                id="cv"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="cv"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
              >
                {cvFile ? (
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2">
                      {cvFile.name}
                    </Badge>
                    <p className="text-sm text-gray-500">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload CV/Resume</p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX (Max 10MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              placeholder="Tell us why you want to teach with EnglEuphoria and what makes you a great ESL teacher..."
              required
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="portfolioUrl">Portfolio/Website URL</Label>
            <Input
              id="portfolioUrl"
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
              placeholder="https://"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="availability">Availability</Label>
            <Textarea
              id="availability"
              value={formData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              placeholder="Describe your available days and hours (include timezone)..."
              rows={2}
            />
          </div>

          <div>
            <Label>Preferred Age Groups to Teach</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {ageGroupOptions.map((age) => (
                <div key={age} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pref-${age}`}
                    checked={formData.preferredAgeGroups.includes(age)}
                    onCheckedChange={() => handleArrayChange('preferredAgeGroups', age)}
                  />
                  <Label htmlFor={`pref-${age}`} className="text-sm">{age}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="preferredSchedule">Preferred Schedule</Label>
            <Select onValueChange={(value) => handleInputChange('preferredSchedule', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select preferred schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time (25+ hours/week)</SelectItem>
                <SelectItem value="part-time">Part-time (10-24 hours/week)</SelectItem>
                <SelectItem value="casual">Casual (Under 10 hours/week)</SelectItem>
                <SelectItem value="flexible">Flexible - as needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="salaryExpectation">Salary Expectation (USD/hour)</Label>
            <Input
              id="salaryExpectation"
              type="number"
              min="0"
              step="0.50"
              value={formData.salaryExpectation}
              onChange={(e) => handleInputChange('salaryExpectation', parseFloat(e.target.value) || 0)}
              placeholder="15.00"
            />
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Professional References
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReference}
              disabled={references.length >= 3}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Reference
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {references.map((reference, index) => (
            <div key={index} className="p-4 border rounded-lg relative">
              {references.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeReference(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <h4 className="font-medium mb-3">Reference {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`ref-name-${index}`}>Name</Label>
                  <Input
                    id={`ref-name-${index}`}
                    value={reference.name}
                    onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`ref-relationship-${index}`}>Relationship</Label>
                  <Input
                    id={`ref-relationship-${index}`}
                    value={reference.relationship}
                    onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                    placeholder="e.g., Former Supervisor, Colleague"
                  />
                </div>
                <div>
                  <Label htmlFor={`ref-email-${index}`}>Email</Label>
                  <Input
                    id={`ref-email-${index}`}
                    type="email"
                    value={reference.email}
                    onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`ref-phone-${index}`}>Phone</Label>
                  <Input
                    id={`ref-phone-${index}`}
                    value={reference.phone}
                    onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
        >
          {loading ? 'Submitting Application...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
};
