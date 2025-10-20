import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download, Share2, ArrowRight } from 'lucide-react';
import { certificateService, CertificateData } from '@/services/certificateService';
import { useToast } from '@/hooks/use-toast';

interface CelebrationSlideProps {
  stars: number;
  score: number;
  studentName: string;
  lessonTitle: string;
  confetti?: boolean;
  finalScore?: boolean;
  nextLesson?: string;
  onNext?: () => void;
}

export function CelebrationSlide({
  stars = 5,
  score = 0,
  studentName,
  lessonTitle,
  confetti = true,
  finalScore = true,
  nextLesson,
  onNext
}: CelebrationSlideProps) {
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCertificate = async () => {
    setIsGenerating(true);
    
    const certificateData: CertificateData = {
      studentName,
      lessonTitle,
      completionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      score,
      stars
    };

    const url = await certificateService.generateCertificate(certificateData);
    
    if (url) {
      setCertificateUrl(url);
      toast({
        title: "Certificate Ready! 🎉",
        description: "Your certificate has been generated successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 p-8 relative overflow-hidden">
      {/* Confetti Animation */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FF6B35', '#4ECDC4', '#FFE66D', '#95E1D3'][i % 4]
              }}
              initial={{ y: -20, opacity: 1 }}
              animate={{
                y: 600,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity
              }}
            />
          ))}
        </div>
      )}

      {/* Trophy Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="text-9xl"
      >
        🏆
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold text-center text-primary"
      >
        Amazing Work, {studentName}!
      </motion.h1>

      {/* Stars Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2 text-6xl"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            {i < stars ? '⭐' : '☆'}
          </motion.span>
        ))}
      </motion.div>

      {/* Score */}
      {finalScore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="text-2xl text-muted-foreground">Final Score</p>
          <p className="text-6xl font-bold text-accent">{score.toLocaleString()}</p>
          <p className="text-xl text-muted-foreground mt-2">points</p>
        </motion.div>
      )}

      {/* Achievement Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-full text-2xl font-bold"
      >
        🌟 Friend Maker Achievement Unlocked!
      </motion.div>

      {/* Certificate Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="flex gap-4"
      >
        {!certificateUrl ? (
          <Button
            onClick={generateCertificate}
            disabled={isGenerating}
            size="lg"
            className="gap-2 text-xl h-14 px-8"
          >
            {isGenerating ? '🎨 Creating...' : '🎓 Get Your Certificate'}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => certificateService.downloadCertificate(certificateUrl, studentName)}
              size="lg"
              variant="outline"
              className="gap-2 text-xl h-14 px-8"
            >
              <Download className="h-6 w-6" />
              Download
            </Button>
            <Button
              onClick={() => certificateService.shareCertificate(certificateUrl, studentName)}
              size="lg"
              className="gap-2 text-xl h-14 px-8"
            >
              <Share2 className="h-6 w-6" />
              Share with Parents
            </Button>
          </>
        )}
      </motion.div>

      {/* Next Lesson Button */}
      {nextLesson && onNext && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Button
            onClick={onNext}
            size="lg"
            className="gap-2 text-xl h-14 px-8"
          >
            Next Lesson: {nextLesson}
            <ArrowRight className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
