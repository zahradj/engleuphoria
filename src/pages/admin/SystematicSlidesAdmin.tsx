import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileSliders, Play, Settings, AlertCircle, Link2, ListOrdered, Move, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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

  // Canva attachment & slide reorder state
  const [canvaLessonId, setCanvaLessonId] = useState('');
  const [canvaLink, setCanvaLink] = useState('');
  const [reorderLessonId, setReorderLessonId] = useState('');
  type SlideListItem = { key: string; label: string; origIndex: number };
  const [slideItems, setSlideItems] = useState<SlideListItem[]>([]);
  const [isLoadingSlides, setIsLoadingSlides] = useState(false);

  const handleAttachCanva = async () => {
    if (!canvaLessonId || !canvaLink) {
      toast({ title: 'Missing data', description: 'Provide lesson ID and Canva URL', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('lessons_content').update({ canva_url: canvaLink }).eq('id', canvaLessonId);
    if (error) {
      console.error('Attach Canva error:', error);
      toast({ title: 'Attach failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Canva attached', description: 'Canva presentation linked to lesson.' });
      setCanvaLessonId('');
      setCanvaLink('');
    }
  };

  const handleLoadSlides = async () => {
    if (!reorderLessonId) {
      toast({ title: 'Missing lesson ID', description: 'Enter a lesson ID to load slides', variant: 'destructive' });
      return;
    }
    setIsLoadingSlides(true);
    const { data, error } = await supabase
      .from('lessons_content')
      .select('slides_content, slide_order, title')
      .eq('id', reorderLessonId)
      .maybeSingle();

    if (error) {
      console.error('Load slides error:', error);
      toast({ title: 'Load failed', description: error.message, variant: 'destructive' });
      setIsLoadingSlides(false);
      return;
    }

    const slides: any[] = data?.slides_content?.slides || [];
    let order: number[] | null = data?.slide_order || null;
    const baseItems: SlideListItem[] = slides.map((s, i) => ({
      key: (s?.id ? String(s.id) : `idx-${i}`),
      label: s?.title || s?.prompt || `Slide ${i + 1}`,
      origIndex: i,
    }));
    const orderedItems = order && order.length === baseItems.length
      ? order.map((origIdx) => baseItems[origIdx])
      : baseItems;
    setSlideItems(orderedItems);
    setIsLoadingSlides(false);
    toast({ title: 'Slides loaded', description: `${orderedItems.length} slides ready to reorder.` });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(slideItems);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setSlideItems(items);
  };

  const handleSaveOrder = async () => {
    if (!reorderLessonId || slideItems.length === 0) return;
    const newOrder = slideItems.map((item) => item.origIndex);
    const { error } = await supabase
      .from('lessons_content')
      .update({ slide_order: newOrder })
      .eq('id', reorderLessonId);
    if (error) {
      console.error('Save order error:', error);
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Order saved', description: 'Slide order updated successfully.' });
    }
  };

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

      {/* Canva Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Attach Canva Slides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="canva-lesson-id">Lesson ID</Label>
              <Input
                id="canva-lesson-id"
                placeholder="lesson uuid"
                value={canvaLessonId}
                onChange={(e) => setCanvaLessonId(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="canva-url">Canva URL</Label>
              <Input
                id="canva-url"
                placeholder="https://www.canva.com/design/..."
                value={canvaLink}
                onChange={(e) => setCanvaLink(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAttachCanva} className="gap-2">
            <Link2 className="h-4 w-4" />
            Attach Canva
          </Button>
        </CardContent>
      </Card>

      {/* Slide Reordering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5" />
            Reorder Slides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="reorder-lesson-id">Lesson ID</Label>
              <Input
                id="reorder-lesson-id"
                placeholder="lesson uuid"
                value={reorderLessonId}
                onChange={(e) => setReorderLessonId(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleLoadSlides} disabled={isLoadingSlides} variant="outline" className="gap-2">
                {isLoadingSlides ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Load Slides
              </Button>
            </div>
          </div>

          {slideItems.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Drag to reorder, then save.</div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="slides">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                      {slideItems.map((item, index) => (
                        <Draggable key={item.key} draggableId={item.key} index={index}>
                          {(dragProvided) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className="flex items-center justify-between p-3 bg-surface-2 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Move className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">{index + 1}. {item.label}</span>
                              </div>
                              <Badge variant="outline">#{item.origIndex + 1}</Badge>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Button onClick={handleSaveOrder} className="gap-2">
                <Save className="h-4 w-4" />
                Save Order
              </Button>
            </div>
          )}
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