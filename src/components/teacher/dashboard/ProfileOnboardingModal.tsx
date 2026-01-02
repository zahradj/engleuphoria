import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Upload, 
  Video, 
  FileCheck, 
  AlertCircle, 
  Loader2,
  Camera,
  GraduationCap
} from 'lucide-react';

interface ProfileOnboardingModalProps {
  teacherId: string;
  teacherName: string;
  onComplete: () => void;
}

export const ProfileOnboardingModal: React.FC<ProfileOnboardingModalProps> = ({
  teacherId,
  teacherName,
  onComplete
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCerts, setUploadingCerts] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: '',
    videoUrl: '',
    profileImageUrl: '',
    certificateUrls: [] as string[]
  });

  const getEmbedUrl = (url: string): string | null => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

    const vimeoRegex = /(?:vimeo\.com\/)(?:.*#|.*\/videos\/)?([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return null;
  };

  const isValidVideoUrl = formData.videoUrl ? getEmbedUrl(formData.videoUrl) !== null : false;
  const videoPreview = formData.videoUrl ? getEmbedUrl(formData.videoUrl) : null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${teacherId}/profile.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('teacher-certificates')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('teacher-certificates')
        .getPublicUrl(data.path);

      setFormData(prev => ({ ...prev, profileImageUrl: publicUrl }));
      toast({ title: 'Photo uploaded successfully' });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({ title: 'Failed to upload photo', variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCerts(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${teacherId}/certs/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('teacher-certificates')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('teacher-certificates')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        certificateUrls: [...prev.certificateUrls, ...uploadedUrls]
      }));
      toast({ title: `${uploadedUrls.length} certificate(s) uploaded` });
    } catch (error) {
      console.error('Error uploading certificates:', error);
      toast({ title: 'Failed to upload certificates', variant: 'destructive' });
    } finally {
      setUploadingCerts(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.bio.trim()) {
      toast({ title: 'Bio is required', variant: 'destructive' });
      return;
    }

    if (!formData.videoUrl.trim() || !isValidVideoUrl) {
      toast({ title: 'Valid YouTube or Vimeo URL is required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('teacher_profiles')
        .upsert({
          user_id: teacherId,
          bio: formData.bio,
          video_url: formData.videoUrl,
          profile_image_url: formData.profileImageUrl || null,
          certificate_urls: formData.certificateUrls,
          profile_complete: true,
          profile_approved_by_admin: false,
          can_teach: false,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Profile submitted for review!',
        description: 'Our team will review your profile and notify you once approved.'
      });
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Failed to save profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const canSubmit = formData.bio.trim() && formData.videoUrl.trim() && isValidVideoUrl;

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl">Complete Your Profile</DialogTitle>
              <DialogDescription>
                Set up your teacher profile to get started
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={formData.profileImageUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {getInitials(teacherName)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                {uploadingPhoto ? (
                  <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-primary-foreground" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
              </label>
            </div>
            <div>
              <p className="font-medium">{teacherName}</p>
              <p className="text-sm text-muted-foreground">Upload a professional photo</p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Bio / Introduction *
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell students about your teaching experience, qualifications, and what makes you a great teacher..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">{formData.bio.length}/500 characters</p>
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Introduction Video URL *
            </Label>
            <Input
              id="video"
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Record a 2-3 minute introduction video to help students get to know you
            </p>
            
            {formData.videoUrl && !isValidVideoUrl && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please provide a valid YouTube or Vimeo URL</AlertDescription>
              </Alert>
            )}

            {videoPreview && (
              <div className="border rounded-lg overflow-hidden mt-2">
                <iframe
                  src={videoPreview}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allowFullScreen
                  title="Video Preview"
                />
              </div>
            )}
          </div>

          {/* Certificates */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Certificates & Documents (Optional)
            </Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleCertificateUpload}
                disabled={uploadingCerts}
                className="hidden"
                id="cert-upload"
              />
              <label htmlFor="cert-upload" className="cursor-pointer">
                {uploadingCerts ? (
                  <Loader2 className="w-8 h-8 mx-auto text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload certificates (PDF, JPG, PNG)
                </p>
              </label>
            </div>
            
            {formData.certificateUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.certificateUrls.map((_, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                    <FileCheck className="w-3 h-3 text-green-500" />
                    Certificate {index + 1}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !canSubmit}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Profile for Review'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
