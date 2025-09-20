import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, BookOpen, Users, Clock, Trophy, Zap, Sparkles, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HelloAdventuresMigrator } from '@/components/teacher/curriculum/HelloAdventuresMigrator';

const CEFR_STATS = {
  'Pre-A1': { lessons: 35, modules: 7, color: 'bg-blue-500' },
  'A1': { lessons: 40, modules: 8, color: 'bg-green-500' },
  'A1+': { lessons: 40, modules: 8, color: 'bg-green-600' },
  'A2': { lessons: 45, modules: 9, color: 'bg-yellow-500' },
  'A2+': { lessons: 45, modules: 9, color: 'bg-yellow-600' },
  'B1': { lessons: 48, modules: 8, color: 'bg-orange-500' },
  'B1+': { lessons: 30, modules: 6, color: 'bg-orange-600' },
  'B2': { lessons: 25, modules: 5, color: 'bg-red-500' }
};

interface GenerationJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  total_items: number;
  processed_items: number;
  failed_items: number;
  progress_percentage: number;
  error_details?: string;
  started_at: string;
  completed_at?: string;
}

export default function SystematicCurriculumGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const { toast } = useToast();

  // Poll for job status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentJob && (currentJob.status === 'pending' || currentJob.status === 'running')) {
      interval = setInterval(async () => {
        const { data, error } = await supabase
          .from('content_generation_jobs')
          .select('*')
          .eq('id', currentJob.id)
          .single();

        if (!error && data) {
          setCurrentJob(data);
          
          if (data.status === 'completed') {
            setIsGenerating(false);
            toast({
              title: "Curriculum Generation Complete!",
              description: `Successfully generated ${data.processed_items} lessons across 8 CEFR levels.`,
              duration: 5000,
            });
          } else if (data.status === 'failed') {
            setIsGenerating(false);
            toast({
              title: "Generation Failed",
              description: data.error_details || "An error occurred during generation.",
              variant: "destructive",
            });
          }
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentJob, toast]);

  const handleStartGeneration = async () => {
    try {
      setIsGenerating(true);
      
      toast({
        title: "Starting Curriculum Generation",
        description: "Generating 308 systematic lessons across 8 CEFR levels...",
      });

      const { data, error } = await supabase.functions.invoke('ai-systematic-curriculum-batch');

      if (error) throw error;

      if (data.success) {
        // Fetch the created job
        const { data: jobData, error: jobError } = await supabase
          .from('content_generation_jobs')
          .select('*')
          .eq('id', data.job_id)
          .single();

        if (!jobError && jobData) {
          setCurrentJob(jobData);
        }
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('Error starting generation:', error);
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to start curriculum generation.",
        variant: "destructive",
      });
    }
  };

  const totalLessons = Object.values(CEFR_STATS).reduce((sum, stat) => sum + stat.lessons, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Systematic Curriculum Generator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate a complete systematic ESL curriculum with 308 interactive lessons across 8 CEFR levels.
          Each lesson includes 20-25 slides covering all core skills: grammar, reading, writing, listening, and speaking.
        </p>
      </div>

      {/* Hello Adventures Integration Alert */}
      <Alert className="border-purple-200 bg-purple-50">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Ready to enhance your curriculum?</p>
              <p className="text-sm mt-1">
                Import Hello Adventures lessons as a foundation for your Pre-A1 level content before generating the full systematic curriculum.
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 ml-4" />
          </div>
        </AlertDescription>
      </Alert>

      {/* Hello Adventures Quick Integration */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Sparkles className="w-5 h-5" />
            Hello Adventures Foundation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HelloAdventuresMigrator />
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalLessons}</div>
            <div className="text-sm text-muted-foreground">Total Lessons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">CEFR Levels</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">20-25</div>
            <div className="text-sm text-muted-foreground">Slides/Lesson</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Core Skills</div>
          </CardContent>
        </Card>
      </div>

      {/* CEFR Level Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>CEFR Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(CEFR_STATS).map(([level, stats]) => (
              <div key={level} className="text-center space-y-2">
                <Badge variant="outline" className="w-full justify-center">
                  {level}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {stats.lessons} lessons • {stats.modules} modules
                </div>
                <div className={`h-2 rounded-full ${stats.color} opacity-20`}></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {currentJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Generation Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Status: <Badge variant={currentJob.status === 'completed' ? 'default' : 'secondary'}>
                {currentJob.status}
              </Badge></span>
              <span>{currentJob.processed_items} / {currentJob.total_items} lessons</span>
            </div>
            <Progress value={currentJob.progress_percentage} className="w-full" />
            <div className="text-xs text-muted-foreground">
              {currentJob.failed_items > 0 && (
                <span className="text-destructive">Failed: {currentJob.failed_items} lessons</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Button */}
      <div className="text-center space-y-4">
        <Button
          onClick={handleStartGeneration}
          disabled={isGenerating}
          size="lg"
          className="w-full max-w-md"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Generating Curriculum...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Generate Complete Systematic Curriculum
            </>
          )}
        </Button>
        
        {!isGenerating && (
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            This will generate all 308 lessons with interactive content. 
            The process may take 10-15 minutes to complete.
          </p>
        )}
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Interactive Elements</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Drag & drop activities</li>
                <li>• Multiple-choice questions</li>
                <li>• Speaking prompts & dialogues</li>
                <li>• Role-play scenarios</li>
                <li>• Gamified challenges</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Skill Development</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Grammar with real communication</li>
                <li>• Reading comprehension tasks</li>
                <li>• Guided & free writing exercises</li>
                <li>• Listening for gist & detail</li>
                <li>• Accuracy & fluency practice</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}