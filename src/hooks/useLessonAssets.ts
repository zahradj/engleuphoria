import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AssetCache {
  images: Map<string, string>;
  audio: Map<string, string>;
}

export function useLessonAssets() {
  const [cache, setCache] = useState<AssetCache>({
    images: new Map(),
    audio: new Map(),
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = useCallback(async (prompt: string): Promise<string | null> => {
    // Check cache first
    if (cache.images.has(prompt)) {
      return cache.images.get(prompt)!;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-image', {
        body: { prompt }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setCache(prev => ({
          ...prev,
          images: new Map(prev.images).set(prompt, data.imageUrl)
        }));
        return data.imageUrl;
      }

      return null;
    } catch (error) {
      console.error('Error generating image:', error);
      if (error instanceof Error && error.message.includes('402')) {
        toast({
          title: "Payment Required",
          description: "Please add credits to your Lovable AI workspace.",
          variant: "destructive",
        });
      } else if (error instanceof Error && error.message.includes('429')) {
        toast({
          title: "Rate Limit",
          description: "Too many requests. Please wait a moment.",
          variant: "destructive",
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache.images, toast]);

  const generateAudio = useCallback(async (text: string): Promise<string | null> => {
    // Check cache first
    if (cache.audio.has(text)) {
      return cache.audio.get(text)!;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-audio', {
        body: { text }
      });

      if (error) throw error;

      if (data?.text) {
        // Use browser's speech synthesis as fallback
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
        
        setCache(prev => ({
          ...prev,
          audio: new Map(prev.audio).set(text, data.text)
        }));
        return data.text;
      }

      return null;
    } catch (error) {
      console.error('Error generating audio:', error);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      return text;
    } finally {
      setLoading(false);
    }
  }, [cache.audio]);

  return {
    generateImage,
    generateAudio,
    loading,
    cache,
  };
}