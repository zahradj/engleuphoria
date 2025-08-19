import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateK12Curriculum } from '@/utils/generateCurriculum';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function CurriculumGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 1000);

      const data = await generateK12Curriculum();
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            1:1 Kids Program Curriculum Generator
          </h1>
          <p className="text-muted-foreground">
            Generate 324 interactive lessons across 4 CEFR levels for young learners
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Generation Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && !error && (
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? 'Generating Curriculum...' : 'Start K12 Curriculum Generation'}
              </Button>
            )}

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Generating lessons... {progress}%
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Generation Complete!</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{result.total_generated}</div>
                    <div className="text-sm text-muted-foreground">Lessons Created</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{result.levels_created}</div>
                    <div className="text-sm text-muted-foreground">CEFR Levels</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{result.modules_per_level}</div>
                    <div className="text-sm text-muted-foreground">Modules/Level</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{result.lessons_per_module}</div>
                    <div className="text-sm text-muted-foreground">Lessons/Module</div>
                  </div>
                </div>

                {result.errors && result.errors.length > 0 && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-semibold">Some Issues Occurred</span>
                    </div>
                    <div className="text-sm space-y-1">
                      {result.errors.slice(0, 5).map((error: string, index: number) => (
                        <div key={index} className="text-destructive/80">{error}</div>
                      ))}
                      {result.errors.length > 5 && (
                        <div className="text-destructive/60">
                          ...and {result.errors.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Generation Failed</span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}