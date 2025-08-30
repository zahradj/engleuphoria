import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileSliders, Play, Settings, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProcessingDetail {
  id: string;
  title: string;
  status: 'inserted' | 'skipped' | 'failed';
  error?: string;
}

interface ProcessingResult {
  processed: number;
  inserted: number;
  skipped: number;
  failed: number;
  details: ProcessingDetail[];
}

export const SystematicSlidesAdmin = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    level_index: undefined as number | undefined,
    module_from: undefined as number | undefined,
    module_to: undefined as number | undefined,
    lesson_from: undefined as number | undefined,
    lesson_to: undefined as number | undefined,
    topic_like: '',
    limit: 20
  });
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handlePreview = async () => {
    try {
      setIsGenerating(true);
      setResult(null);

      const { data, error } = await supabase.functions.invoke('ai-systematic-slides-batch', {
        body: {
          ...filters,
          limit: 1,
          dryRun: true
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Preview Generated",
        description: data.message,
      });

      console.log('Preview result:', data);
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Preview Failed",
        description: error instanceof Error ? error.message : "Failed to generate preview",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchGeneration = async () => {
    try {
      setIsGenerating(true);
      setResult(null);
      setProgress(0);

      const { data, error } = await supabase.functions.invoke('ai-systematic-slides-batch', {
        body: {
          ...filters,
          dryRun: false
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setResult(data);
      setProgress(100);

      toast({
        title: "Batch Generation Completed",
        description: `Generated slides for ${data.inserted} lessons. ${data.skipped} skipped, ${data.failed} failed.`,
        variant: data.failed > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Batch generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate slides",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inserted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Generated</Badge>;
      case 'skipped':
        return <Badge variant="outline">Skipped</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileSliders className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Systematic ESL Slides Generator</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Generation Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="level">CEFR Level</Label>
              <Select
                value={filters.level_index?.toString() || ""}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    level_index: value ? parseInt(value) : undefined 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  {cefrLevels.map((level, index) => (
                    <SelectItem key={level} value={index.toString()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="module_from">Module From</Label>
              <Input
                type="number"
                placeholder="1"
                value={filters.module_from || ''}
                onChange={(e) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    module_from: e.target.value ? parseInt(e.target.value) : undefined 
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="module_to">Module To</Label>
              <Input
                type="number"
                placeholder="10"
                value={filters.module_to || ''}
                onChange={(e) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    module_to: e.target.value ? parseInt(e.target.value) : undefined 
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="lesson_from">Lesson From</Label>
              <Input
                type="number"
                placeholder="1"
                value={filters.lesson_from || ''}
                onChange={(e) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    lesson_from: e.target.value ? parseInt(e.target.value) : undefined 
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="lesson_to">Lesson To</Label>
              <Input
                type="number"
                placeholder="30"
                value={filters.lesson_to || ''}
                onChange={(e) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    lesson_to: e.target.value ? parseInt(e.target.value) : undefined 
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="limit">Limit</Label>
              <Input
                type="number"
                placeholder="20"
                value={filters.limit}
                onChange={(e) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    limit: parseInt(e.target.value) || 20 
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="topic">Topic Contains</Label>
            <Input
              placeholder="e.g., Daily Routines, Grammar"
              value={filters.topic_like}
              onChange={(e) => 
                setFilters(prev => ({ ...prev, topic_like: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handlePreview}
              disabled={isGenerating}
              variant="outline"
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Preview (1 lesson)
            </Button>

            <Button
              onClick={handleBatchGeneration}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSliders className="h-4 w-4" />
              )}
              Generate Batch
            </Button>
          </div>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generating slides...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-surface-2 rounded-lg">
                <div className="text-2xl font-bold text-primary">{result.processed}</div>
                <div className="text-sm text-muted-foreground">Processed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.inserted}</div>
                <div className="text-sm text-muted-foreground">Generated</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{result.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {result.details.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold mb-2">Detailed Results</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {result.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-surface-2 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{detail.title}</div>
                        {detail.error && (
                          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            {detail.error}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(detail.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};