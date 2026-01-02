import React, { useCallback } from 'react';
import { Upload, Image, Video, HelpCircle, Pencil, X, Plus, Check, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slide, SlideType, QuizOption, PollOption } from './types';
import { v4 as uuidv4 } from 'uuid';

interface EditorCanvasProps {
  slide: Slide | null;
  onUpdateSlide: (updates: Partial<Slide>) => void;
}

const slideTypes: { value: SlideType; label: string; icon: React.ElementType }[] = [
  { value: 'image', label: 'Static Image', icon: Image },
  { value: 'video', label: 'Video Embed', icon: Video },
  { value: 'quiz', label: 'Quiz (Multiple Choice)', icon: HelpCircle },
  { value: 'poll', label: 'Poll/Survey', icon: BarChart3 },
  { value: 'draw', label: 'Blank Whiteboard', icon: Pencil },
];

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ slide, onUpdateSlide }) => {
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateSlide({ imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [onUpdateSlide]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateSlide({ imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [onUpdateSlide]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const addQuizOption = () => {
    const newOption: QuizOption = {
      id: uuidv4(),
      text: '',
      isCorrect: false,
    };
    onUpdateSlide({
      quizOptions: [...(slide?.quizOptions || []), newOption],
    });
  };

  const updateQuizOption = (optionId: string, updates: Partial<QuizOption>) => {
    const updatedOptions = slide?.quizOptions?.map((opt) =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    onUpdateSlide({ quizOptions: updatedOptions });
  };

  const removeQuizOption = (optionId: string) => {
    const updatedOptions = slide?.quizOptions?.filter((opt) => opt.id !== optionId);
    onUpdateSlide({ quizOptions: updatedOptions });
  };

  const setCorrectAnswer = (optionId: string) => {
    const updatedOptions = slide?.quizOptions?.map((opt) => ({
      ...opt,
      isCorrect: opt.id === optionId,
    }));
    onUpdateSlide({ quizOptions: updatedOptions });
  };

  // Poll option handlers
  const addPollOption = () => {
    const newOption: PollOption = {
      id: uuidv4(),
      text: '',
    };
    onUpdateSlide({
      pollOptions: [...(slide?.pollOptions || []), newOption],
    });
  };

  const updatePollOption = (optionId: string, text: string) => {
    const updatedOptions = slide?.pollOptions?.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    onUpdateSlide({ pollOptions: updatedOptions });
  };

  const removePollOption = (optionId: string) => {
    const updatedOptions = slide?.pollOptions?.filter((opt) => opt.id !== optionId);
    onUpdateSlide({ pollOptions: updatedOptions });
  };

  if (!slide) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center text-muted-foreground">
          <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No Slide Selected</p>
          <p className="text-sm">Add a slide or select one to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="slide-title" className="text-xs text-muted-foreground">
              Slide Title
            </Label>
            <Input
              id="slide-title"
              value={slide.title || ''}
              onChange={(e) => onUpdateSlide({ title: e.target.value })}
              placeholder="Enter slide title..."
              className="mt-1"
            />
          </div>
          <div className="w-48">
            <Label className="text-xs text-muted-foreground">Slide Type</Label>
            <Select
              value={slide.type}
              onValueChange={(value: SlideType) => onUpdateSlide({ type: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {slideTypes.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6 overflow-auto">
        {slide.type === 'image' && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="h-full min-h-[400px] border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer relative overflow-hidden"
          >
            {slide.imageUrl ? (
              <>
                <img
                  src={slide.imageUrl}
                  alt="Slide content"
                  className="max-w-full max-h-full object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => onUpdateSlide({ imageUrl: undefined })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <label className="flex flex-col items-center cursor-pointer p-8">
                <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop image here or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PNG, JPG, GIF up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        )}

        {slide.type === 'video' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={slide.videoUrl || ''}
                onChange={(e) => onUpdateSlide({ videoUrl: e.target.value })}
                placeholder="Enter YouTube or MP4 URL..."
                className="mt-1"
              />
            </div>
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
              {slide.videoUrl ? (
                <iframe
                  src={slide.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Enter a video URL above to preview</p>
                </div>
              )}
            </div>
          </div>
        )}

        {slide.type === 'quiz' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <Label htmlFor="quiz-question">Question</Label>
              <Textarea
                id="quiz-question"
                value={slide.quizQuestion || ''}
                onChange={(e) => onUpdateSlide({ quizQuestion: e.target.value })}
                placeholder="Enter your quiz question..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label>Answer Options</Label>
              {slide.quizOptions?.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Button
                    variant={option.isCorrect ? 'default' : 'outline'}
                    size="icon"
                    className="shrink-0"
                    onClick={() => setCorrectAnswer(option.id)}
                  >
                    {option.isCorrect ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                    )}
                  </Button>
                  <Input
                    value={option.text}
                    onChange={(e) => updateQuizOption(option.id, { text: e.target.value })}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuizOption(option.id)}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addQuizOption} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            {/* Optional image for quiz */}
            <div>
              <Label>Question Image (Optional)</Label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="mt-2 h-48 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/20 cursor-pointer relative overflow-hidden"
              >
                {slide.imageUrl ? (
                  <>
                    <img
                      src={slide.imageUrl}
                      alt="Quiz visual"
                      className="max-w-full max-h-full object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => onUpdateSlide({ imageUrl: undefined })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Add image</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {slide.type === 'poll' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <Label htmlFor="poll-question">Poll Question</Label>
              <Textarea
                id="poll-question"
                value={slide.pollQuestion || ''}
                onChange={(e) => onUpdateSlide({ pollQuestion: e.target.value })}
                placeholder="Enter your poll question..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label>Answer Options (no correct answer)</Label>
              {slide.pollOptions?.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <Input
                    value={option.text}
                    onChange={(e) => updatePollOption(option.id, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePollOption(option.id)}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addPollOption} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4 inline mr-1" />
                Polls collect opinions without right/wrong answers. Results will be shown as a bar chart.
              </p>
            </div>
          </div>
        )}

        {slide.type === 'draw' && (
          <div className="h-full min-h-[400px] border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-white">
            <div className="text-center text-muted-foreground">
              <Pencil className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Blank Whiteboard</p>
              <p className="text-sm">
                This slide will show an empty canvas for drawing activities
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
