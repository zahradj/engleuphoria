import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from 'react-beautiful-dnd';
import {
  GripVertical,
  Plus,
  Wand2,
  ExternalLink,
  Eye,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Clock,
  Image,
  Play,
  FileText,
  Shuffle
} from 'lucide-react';
import { Slide, SlideType, LessonSlides } from '@/types/slides';
import { lessonSlidesService } from '@/services/lessonSlidesService';

interface SlideDeckManagerProps {
  lessonId: string;
  initialSlides?: LessonSlides;
  onSlidesUpdate?: (slides: LessonSlides) => void;
  isTeacher?: boolean;
}

const slideTypeOptions: { value: SlideType; label: string; icon: React.ReactNode }[] = [
  { value: 'warmup', label: 'Warm-up', icon: <Play className="h-4 w-4" /> },
  { value: 'vocabulary_preview', label: 'Vocabulary Preview', icon: <FileText className="h-4 w-4" /> },
  { value: 'target_language', label: 'Target Language', icon: <FileText className="h-4 w-4" /> },
  { value: 'listening_comprehension', label: 'Listening', icon: <Play className="h-4 w-4" /> },
  { value: 'grammar_focus', label: 'Grammar Focus', icon: <FileText className="h-4 w-4" /> },
  { value: 'match', label: 'Matching Activity', icon: <Shuffle className="h-4 w-4" /> },
  { value: 'drag_drop', label: 'Drag & Drop', icon: <Shuffle className="h-4 w-4" /> },
  { value: 'cloze', label: 'Fill in the Blanks', icon: <FileText className="h-4 w-4" /> },
  { value: 'canva_embed', label: 'Canva Embed', icon: <Image className="h-4 w-4" /> },
  { value: 'canva_link', label: 'Canva Link', icon: <ExternalLink className="h-4 w-4" /> },
];

export function SlideDeckManager({ 
  lessonId, 
  initialSlides, 
  onSlidesUpdate, 
  isTeacher = true 
}: SlideDeckManagerProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides?.slides || []);
  const [lessonData, setLessonData] = useState<LessonSlides>(
    initialSlides || {
      version: '2.0',
      theme: 'default',
      slides: [],
      durationMin: 30,
      metadata: {
        CEFR: 'A1',
        module: 1,
        lesson: 1,
        targets: [],
        weights: { accuracy: 50, fluency: 50 }
      }
    }
  );
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const { toast } = useToast();

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order indexes
    const updatedSlides = items.map((slide, index) => ({
      ...slide,
      orderIndex: index
    }));

    setSlides(updatedSlides);
    saveSlides(updatedSlides);
  }, [slides]);

  const saveSlides = async (updatedSlides: Slide[]) => {
    try {
      const updatedLessonData = {
        ...lessonData,
        slides: updatedSlides,
        slideOrder: updatedSlides.map(s => s.id),
        lastModified: new Date().toISOString(),
        total_slides: updatedSlides.length
      };

      await lessonSlidesService.updateLessonSlides(lessonId, updatedLessonData);
      setLessonData(updatedLessonData);
      onSlidesUpdate?.(updatedLessonData);
      
      toast({
        title: "Slides Updated",
        description: "Slide order and content saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save slide changes",
        variant: "destructive"
      });
    }
  };

  const addNewSlide = (type: SlideType) => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type,
      prompt: "New slide prompt",
      instructions: "Add your instructions here",
      orderIndex: slides.length,
      duration: 120, // 2 minutes default
      isLocked: false
    };

    if (type === 'canva_embed' || type === 'canva_link') {
      newSlide.canvaDesignId = '';
      newSlide.canvaEmbedUrl = '';
      newSlide.canvaViewUrl = '';
    }

    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    setSelectedSlide(newSlide);
    setIsEditDialogOpen(true);
  };

  const generateAISlides = async () => {
    if (!generationPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a generation prompt",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // This would call your AI generation service
      const newSlides: Slide[] = [
        {
          id: `ai-slide-${Date.now()}`,
          type: 'vocabulary_preview',
          prompt: `AI Generated: ${generationPrompt}`,
          instructions: "This slide was generated by AI",
          orderIndex: slides.length
        }
      ];

      const updatedSlides = [...slides, ...newSlides];
      setSlides(updatedSlides);
      saveSlides(updatedSlides);
      setGenerationPrompt('');
      
      toast({
        title: "AI Slides Generated",
        description: `Generated ${newSlides.length} new slides`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI slides",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSlide = (updatedSlide: Slide) => {
    const updatedSlides = slides.map(slide =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    );
    setSlides(updatedSlides);
    saveSlides(updatedSlides);
    setIsEditDialogOpen(false);
    setSelectedSlide(null);
  };

  const deleteSlide = (slideId: string) => {
    const updatedSlides = slides.filter(slide => slide.id !== slideId);
    setSlides(updatedSlides);
    saveSlides(updatedSlides);
  };

  const toggleSlideLock = (slideId: string) => {
    const updatedSlides = slides.map(slide =>
      slide.id === slideId ? { ...slide, isLocked: !slide.isLocked } : slide
    );
    setSlides(updatedSlides);
    saveSlides(updatedSlides);
  };

  const getSlideIcon = (type: SlideType) => {
    const option = slideTypeOptions.find(opt => opt.value === type);
    return option?.icon || <FileText className="h-4 w-4" />;
  };

  const getSlideColor = (type: SlideType) => {
    const colorMap = {
      warmup: 'bg-green-100 text-green-800',
      vocabulary_preview: 'bg-blue-100 text-blue-800',
      grammar_focus: 'bg-purple-100 text-purple-800',
      match: 'bg-orange-100 text-orange-800',
      drag_drop: 'bg-red-100 text-red-800',
      cloze: 'bg-yellow-100 text-yellow-800',
      canva_embed: 'bg-pink-100 text-pink-800',
      canva_link: 'bg-indigo-100 text-indigo-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Slide Deck Manager</h3>
          <Badge variant="outline">{slides.length} slides</Badge>
        </div>
        
        {isTeacher && (
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slide
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Slide</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {slideTypeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      onClick={() => addNewSlide(option.value)}
                      className="h-auto p-3 flex-col gap-2"
                    >
                      {option.icon}
                      <span className="text-xs">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Generate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate AI Slides</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Textarea
                    placeholder="Describe what slides you want to generate..."
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                  />
                  <Button 
                    onClick={generateAISlides} 
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? "Generating..." : "Generate Slides"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Slide List with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {slides.map((slide, index) => (
                <Draggable
                  key={slide.id}
                  draggableId={slide.id}
                  index={index}
                  isDragDisabled={!isTeacher || slide.isLocked}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'shadow-lg' : ''} transition-shadow`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {isTeacher && (
                            <div
                              {...provided.dragHandleProps}
                              className="text-muted-foreground hover:text-foreground cursor-grab"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getSlideIcon(slide.type)}
                              <span className="font-medium truncate">{slide.prompt}</span>
                              <Badge className={getSlideColor(slide.type)}>
                                {slide.type.replace('_', ' ')}
                              </Badge>
                              {slide.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {slide.duration || 120}s
                              </span>
                              <span>#{index + 1}</span>
                            </div>
                          </div>
                          
                          {isTeacher && (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSlideLock(slide.id)}
                              >
                                {slide.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedSlide(slide);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSlide(slide.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Slide Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Slide</DialogTitle>
          </DialogHeader>
          {selectedSlide && (
            <SlideEditForm
              slide={selectedSlide}
              onSave={updateSlide}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedSlide(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Slide Edit Form Component
interface SlideEditFormProps {
  slide: Slide;
  onSave: (slide: Slide) => void;
  onCancel: () => void;
}

function SlideEditForm({ slide, onSave, onCancel }: SlideEditFormProps) {
  const [formData, setFormData] = useState(slide);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Slide Type</label>
        <Select
          value={formData.type}
          onValueChange={(value: SlideType) => 
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {slideTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Prompt</label>
        <Input
          value={formData.prompt}
          onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
          placeholder="Enter slide prompt..."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Instructions</label>
        <Textarea
          value={formData.instructions || ''}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          placeholder="Enter slide instructions..."
        />
      </div>

      {(formData.type === 'canva_embed' || formData.type === 'canva_link') && (
        <>
          <div>
            <label className="text-sm font-medium">Canva Design ID</label>
            <Input
              value={formData.canvaDesignId || ''}
              onChange={(e) => setFormData({ ...formData, canvaDesignId: e.target.value })}
              placeholder="Enter Canva design ID..."
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Canva View URL</label>
            <Input
              value={formData.canvaViewUrl || ''}
              onChange={(e) => setFormData({ ...formData, canvaViewUrl: e.target.value })}
              placeholder="Enter Canva view URL..."
            />
          </div>
        </>
      )}

      <div>
        <label className="text-sm font-medium">Duration (seconds)</label>
        <Input
          type="number"
          value={formData.duration || 120}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Slide
        </Button>
      </div>
    </div>
  );
}