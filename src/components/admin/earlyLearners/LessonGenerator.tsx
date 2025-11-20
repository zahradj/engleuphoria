import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGenerateLesson } from '@/hooks/useGenerateLesson';
import { Loader2, CheckCircle, AlertCircle, Sparkles, Brain, Volume2, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { multimediaService } from '@/services/earlyLearners/multimediaService';

type WizardStep = 'input' | 'generating' | 'preview' | 'multimedia' | 'complete';

export function LessonGenerator() {
  const [step, setStep] = useState<WizardStep>('input');
  const [formData, setFormData] = useState({
    topic: '',
    phonicsFocus: '',
    lessonNumber: 1,
    difficultyLevel: 'beginner' as const,
    learningObjectives: [] as string[]
  });
  const [multimediaProgress, setMultimediaProgress] = useState(0);
  const [isGeneratingMultimedia, setIsGeneratingMultimedia] = useState(false);
  
  const { generateLesson, isGenerating, lesson, progress, error, resetLesson } = useGenerateLesson();
  
  const handleGenerate = async () => {
    setStep('generating');
    try {
      await generateLesson(formData);
      setStep('preview');
    } catch (error) {
      console.error('Generation failed:', error);
      setStep('input');
    }
  };
  
  const handleGenerateMultimedia = async () => {
    if (!lesson?.multimedia) return;
    
    setStep('multimedia');
    setIsGeneratingMultimedia(true);
    
    try {
      const imagePrompts = lesson.multimedia.images || [];
      const audioScripts = lesson.multimedia.audioFiles || [];
      
      if (imagePrompts.length === 0 && audioScripts.length === 0) {
        console.warn('No multimedia assets to generate');
        setStep('complete');
        return;
      }
      
      console.log(`Starting multimedia generation: ${imagePrompts.length} images, ${audioScripts.length} audio files`);
      
      // Start generation in background
      const resultsPromise = multimediaService.generateAllAssets(
        lesson.id,
        imagePrompts,
        audioScripts
      );
      
      // Poll progress every 2 seconds
      const progressInterval = setInterval(async () => {
        try {
          const progress = await multimediaService.getProgress(lesson.id);
          setMultimediaProgress(progress.progress);
          console.log(`Multimedia progress: ${progress.progress}% (${progress.complete}/${progress.total})`);
        } catch (err) {
          console.error('Failed to fetch progress:', err);
        }
      }, 2000);
      
      // Wait for completion
      await resultsPromise;
      clearInterval(progressInterval);
      
      setMultimediaProgress(100);
      console.log('Multimedia generation complete');
      setStep('complete');
    } catch (error) {
      console.error('Multimedia generation failed:', error);
      setStep('preview');
    } finally {
      setIsGeneratingMultimedia(false);
    }
  };
  
  const handleStartNew = () => {
    resetLesson();
    setStep('input');
    setMultimediaProgress(0);
    setFormData({
      topic: '',
      phonicsFocus: '',
      lessonNumber: formData.lessonNumber + 1,
      difficultyLevel: 'beginner',
      learningObjectives: []
    });
  };
  
  const getStepIndex = (currentStep: WizardStep): number => {
    const steps = ['input', 'generating', 'preview', 'multimedia', 'complete'];
    return steps.indexOf(currentStep);
  };
  
  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        {[
          { label: 'Input', icon: Brain },
          { label: 'Generate', icon: Sparkles },
          { label: 'Preview', icon: CheckCircle },
          { label: 'Multimedia', icon: ImageIcon },
          { label: 'Complete', icon: CheckCircle }
        ].map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isActive = getStepIndex(step) === index;
          const isComplete = getStepIndex(step) > index;
          
          return (
            <div key={stepItem.label} className="flex items-center">
              <div className={`flex flex-col items-center ${index < 4 ? 'mr-4' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isComplete ? 'bg-green-500 text-white' :
                  isActive ? 'bg-primary text-primary-foreground' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs font-medium">{stepItem.label}</span>
              </div>
              {index < 4 && (
                <div className={`h-1 w-12 ${
                  isComplete ? 'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 'input' && 'Lesson Details'}
            {step === 'generating' && 'Generating Lesson...'}
            {step === 'preview' && 'Review Lesson'}
            {step === 'multimedia' && 'Generating Multimedia...'}
            {step === 'complete' && 'Lesson Complete!'}
          </CardTitle>
          <CardDescription>
            {step === 'input' && 'Enter the lesson parameters to generate a complete interactive lesson'}
            {step === 'generating' && 'AI is creating your comprehensive lesson with all 7 components'}
            {step === 'preview' && 'Review the generated lesson structure and content'}
            {step === 'multimedia' && 'Generating images and audio for all lesson activities'}
            {step === 'complete' && 'Your lesson is ready to use with students!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Input Step */}
          {step === 'input' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Topic</Label>
                  <Input 
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="e.g., Animals, Family, Colors"
                  />
                </div>
                
                <div>
                  <Label>Phonics Focus</Label>
                  <Input 
                    value={formData.phonicsFocus}
                    onChange={(e) => setFormData({...formData, phonicsFocus: e.target.value})}
                    placeholder="e.g., Short 'a' sound (/a/)"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Lesson Number</Label>
                  <Input 
                    type="number"
                    min="1"
                    value={formData.lessonNumber}
                    onChange={(e) => setFormData({...formData, lessonNumber: parseInt(e.target.value) || 1})}
                  />
                </div>
                
                <div>
                  <Label>Difficulty Level</Label>
                  <Select 
                    value={formData.difficultyLevel}
                    onValueChange={(value: any) => setFormData({...formData, difficultyLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate} 
                className="w-full"
                disabled={!formData.topic || !formData.phonicsFocus || isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Complete Lesson
              </Button>
            </div>
          )}
          
          {/* Generating Step */}
          {step === 'generating' && (
            <div className="text-center py-12">
              <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Generating Your Lesson...</h3>
              <p className="text-muted-foreground mb-4">This may take 30-60 seconds</p>
              <Progress value={progress} className="max-w-md mx-auto" />
            </div>
          )}
          
          {/* Preview Step */}
          {step === 'preview' && lesson && (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Topic: {lesson.topic}</Badge>
                  <Badge variant="secondary">Phonics: {lesson.phonicsFocus}</Badge>
                  <Badge variant="secondary">Duration: {lesson.durationMinutes || 30} min</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {lesson.components && Object.entries(lesson.components).map(([key, component]: [string, any]) => (
                  <Card key={key}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h4 className="font-semibold capitalize mb-2">{key}</h4>
                        <p className="text-2xl font-bold text-primary">
                          {component?.activities?.length || 
                           component?.targetWords?.length || 
                           component?.duringReading?.length || 
                           component?.whileListening?.length || 
                           '✓'}
                        </p>
                        <p className="text-xs text-muted-foreground">activities</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert>
                <ImageIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Multimedia Assets:</strong> {lesson.multimedia?.totalImages || 0} images, {lesson.multimedia?.totalAudioFiles || 0} audio files ready to generate
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('input')}>
                  Edit Details
                </Button>
                <Button onClick={handleGenerateMultimedia} className="flex-1">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Multimedia Assets
                </Button>
              </div>
            </div>
          )}
          
          {/* Multimedia Generation Step */}
          {step === 'multimedia' && (
            <div className="py-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <ImageIcon className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generating Multimedia Assets...</h3>
                <p className="text-muted-foreground">Creating images and audio for your lesson</p>
              </div>
              
              <Progress value={multimediaProgress} className="max-w-md mx-auto" />
              
              <p className="text-center text-muted-foreground">
                {multimediaProgress}% complete
              </p>
            </div>
          )}
          
          {/* Complete Step */}
          {step === 'complete' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Lesson Ready!</h3>
              <p className="text-muted-foreground mb-6">
                All content and multimedia assets have been generated successfully.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleStartNew}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Next Lesson
                </Button>
                <Button variant="outline" onClick={() => setStep('input')}>
                  View Lessons
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
