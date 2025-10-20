import { supabase } from '@/integrations/supabase/client';

export interface CertificateData {
  studentName: string;
  lessonTitle: string;
  completionDate: string;
  score: number;
  stars: number;
}

class CertificateService {
  async generateCertificate(data: CertificateData): Promise<string | null> {
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-certificate', {
        body: data
      });

      if (error) {
        console.error('Certificate generation error:', error);
        return null;
      }

      return result?.certificateUrl || null;
    } catch (error) {
      console.error('Error generating certificate:', error);
      return null;
    }
  }

  downloadCertificate(certificateUrl: string, studentName: string) {
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = `${studentName.replace(/\s+/g, '_')}_certificate.png`;
    link.click();
  }

  shareCertificate(certificateUrl: string, studentName: string) {
    if (navigator.share) {
      navigator.share({
        title: `${studentName}'s English Certificate`,
        text: `${studentName} completed an English lesson!`,
        url: certificateUrl
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(certificateUrl);
      alert('Certificate link copied to clipboard!');
    }
  }
}

export const certificateService = new CertificateService();
