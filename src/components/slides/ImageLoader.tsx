import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLoaderProps {
  prompt: string;
  alt: string;
  onLoad?: (url: string) => void;
  className?: string;
  generateImage: (prompt: string) => Promise<string | null>;
}

export function ImageLoader({ prompt, alt, onLoad, className, generateImage }: ImageLoaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setError(true);
        setLoading(false);
      }
    }, 15000); // 15 second timeout

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    generateImage(prompt)
      .then(url => {
        if (mounted && url) {
          setImageUrl(url);
          setLoading(false);
          setProgress(100);
          onLoad?.(url);
        } else if (mounted) {
          setError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [prompt, generateImage, onLoad]);

  return (
    <div className={cn('relative rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm', className)}>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-12 h-12 text-primary mb-4" />
            </motion.div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Creating your image...</p>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center max-w-xs">
              ✨ {prompt}
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-100 to-pink-100"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ImageIcon className="w-20 h-20 text-primary/60 mb-4" />
            </motion.div>
            <p className="text-lg font-semibold text-primary mb-2">🎨 Imagine This!</p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              {prompt}
            </p>
          </motion.div>
        )}

        {imageUrl && !loading && (
          <motion.img
            key="image"
            src={imageUrl}
            alt={alt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
