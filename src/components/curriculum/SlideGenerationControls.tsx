import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Presentation, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Download,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SlideGenerationControlsProps {
  onSlidesGenerated?: () => void;
}

export function SlideGenerationControls({ onSlidesGenerated }: SlideGenerationControlsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<{
    total: number;
    completed: number;
    current: string;
    errors: string[];
  } | null>(null);
  
  const { toast } = useToast();

  const generateAllSlides = async () => {
    try {
      setIsGenerating(true);
      setProgress(0);
      setGenerationStatus({
        total: 0,
        completed: 0,
        current: 'Initializing...',
        errors: []
      });

        toast({
          title: "Starting 20-Slide Generation",
          description: "Creating comprehensive 20-slide lessons with AI-generated images...",
        });

      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: { batch_generate: true }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setProgress(100);
        setGenerationStatus(prev => prev ? {
          ...prev,
          completed: data.generated_count,
          total: data.total_processed,
          current: 'Complete!'
        } : null);

        toast({
          title: "20-Slide Lessons Generated Successfully! 🎉",
          description: `Created ${data.generated_count * 20} slides with AI-generated images for ${data.generated_count} lessons.`,
        });

        onSlidesGenerated?.();
      } else {
        throw new Error(data.error || 'Generation failed');
      }

    } catch (error) {
      console.error('Slide generation error:', error);
      toast({
        title: "Generation Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSingleSlide = async (contentId: string) => {
    try {
      toast({
        title: "Generating Slides",
        description: "Creating 22 interactive slides with OpenAI...",
      });

      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: { 
          content_id: contentId,
          content_type: 'systematic_lesson',
          generate_20_slides: true
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        toast({
          title: "Slides Generated! 🎨",
          description: `Created ${data.slides?.total_slides || 22} interactive slides.`,
        });
        onSlidesGenerated?.();
      }
    } catch (error) {
      console.error('Single slide generation error:', error);
      toast({
        title: "Generation Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGenerateMissingSlides = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Finding Lessons",
        description: "Scanning for lessons without slides...",
      });

      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: { batch_generate: true }
      });

      if (error) throw new Error(error.message);

      if (data.success) {
        toast({
          title: "Missing Slides Generated! 🎉",
          description: `Generated slides for ${data.generated_count} lessons.`,
        });
        onSlidesGenerated?.();
      }
    } catch (error) {
      console.error('Batch generation error:', error);
      toast({
        title: "Generation Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Presentation className="h-5 w-5 text-primary" />
          20-Slide AI Lesson Generator
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            OpenAI Enhanced
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate comprehensive 20-slide interactive lessons with OpenAI-generated images, gamified activities, and rich educational content.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isGenerating && !generationStatus && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <PlayCircle className="h-4 w-4 text-green-600" />
                <span>20 Interactive Slides per Lesson</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span>AI-Generated Images</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Comprehensive Activities</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={generateAllSlides}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                <Presentation className="h-4 w-4 mr-2" />
                Generate 22-Slide Lessons for All
              </Button>
              
              <Button 
                onClick={handleGenerateMissingSlides}
                disabled={isGenerating}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Missing Slides Only
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium">Generating 20-slide lessons with AI images...</span>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            {generationStatus && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress: {generationStatus.completed}/{generationStatus.total}</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {generationStatus.current}
                </p>
              </div>
            )}
          </div>
        )}

        {generationStatus && !isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Generation Complete!</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  {generationStatus.completed} Lessons
                </Badge>
                <span>Slides Created</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {generationStatus.completed * 20} Slides
                </Badge>
                <span>Total Slides</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                  {generationStatus.completed * 15} Images
                </Badge>
                <span>AI Generated</span>
              </div>
            </div>

            {generationStatus.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {generationStatus.errors.length} items had issues
                  </span>
                </div>
                <div className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
                  {generationStatus.errors.slice(0, 3).map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                  {generationStatus.errors.length > 3 && (
                    <div>... and {generationStatus.errors.length - 3} more</div>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setGenerationStatus(null);
                setProgress(0);
              }}
              variant="outline"
              size="sm"
            >
              Reset
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Generation time: ~5-8 minutes per 20-slide lesson</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}