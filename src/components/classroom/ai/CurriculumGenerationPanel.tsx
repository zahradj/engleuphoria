import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Clock, 
  Users, 
  TrendingUp,
  Zap,
  Download,
  Play,
  CheckCircle
} from 'lucide-react';
import { curriculumGenerationService, CurriculumLevel, GeneratedCurriculum } from '@/services/curriculumGenerationService';
import { toast } from 'sonner';

interface CurriculumGenerationPanelProps {
  onCurriculumGenerated?: (curriculum: GeneratedCurriculum) => void;
}

export function CurriculumGenerationPanel({ onCurriculumGenerated }: CurriculumGenerationPanelProps) {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedCurriculum, setGeneratedCurriculum] = useState<GeneratedCurriculum | null>(null);

  const curriculumLevels = [
    {
      level: 'A1' as const,
      name: 'Foundation Builder',
      description: 'Basic sentence construction & simple conversations',
      weeks: 12,
      lessons: 48,
      pages: 960,
      hours: 72,
      color: 'bg-green-500',
      features: ['Basic Grammar', 'Essential Vocabulary', 'Simple Conversations']
    },
    {
      level: 'A2' as const,
      name: 'Skill Developer',
      description: 'Expanding communication & building confidence',
      weeks: 14,
      lessons: 56,
      pages: 1120,
      hours: 84,
      color: 'bg-blue-500',
      features: ['Past/Future Tenses', 'Opinion Expression', 'Storytelling']
    },
    {
      level: 'B1' as const,
      name: 'Confident Communicator',
      description: 'Independent communication in most situations',
      weeks: 16,
      lessons: 48,
      pages: 960,
      hours: 96,
      color: 'bg-purple-500',
      features: ['Complex Grammar', 'Professional Language', 'Problem Solving']
    },
    {
      level: 'B2' as const,
      name: 'Fluent Speaker',
      description: 'Advanced fluency with sophisticated expression',
      weeks: 18,
      lessons: 54,
      pages: 1080,
      hours: 108,
      color: 'bg-orange-500',
      features: ['Advanced Structures', 'Presentations', 'Negotiations']
    },
    {
      level: 'C1' as const,
      name: 'Advanced Master',
      description: 'Near-native proficiency with academic excellence',
      weeks: 20,
      lessons: 40,
      pages: 800,
      hours: 120,
      color: 'bg-red-500',
      features: ['Academic Mastery', 'Leadership Communication', 'Cultural Nuance']
    },
    {
      level: 'C2' as const,
      name: 'Language Master',
      description: 'Complete mastery with native-level sophistication',
      weeks: 24,
      lessons: 48,
      pages: 960,
      hours: 144,
      color: 'bg-indigo-500',
      features: ['Native Proficiency', 'Thought Leadership', 'Creative Expression']
    }
  ];

  const neuroscientificFeatures = [
    { icon: Brain, name: 'Spaced Repetition', description: 'Optimal memory consolidation' },
    { icon: Zap, name: 'Attention Optimization', description: '7-segment lesson structure' },
    { icon: Target, name: 'Motor Activation', description: 'Physical vocabulary gestures' },
    { icon: Users, name: 'Social Learning', description: 'Peer interaction triggers' },
    { icon: TrendingUp, name: 'Emotional Engagement', description: 'Personal connection activities' },
    { icon: BookOpen, name: 'Pattern Recognition', description: 'Structured repetition system' }
  ];

  const handleGenerateCurriculum = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep('Initializing neuroscientific content engine...');

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 10, step: 'Analyzing neuroscientific principles...' },
        { progress: 25, step: 'Generating week-by-week content structure...' },
        { progress: 40, step: 'Creating 20-page lesson templates...' },
        { progress: 55, step: 'Optimizing attention span patterns...' },
        { progress: 70, step: 'Building conversation progression maps...' },
        { progress: 85, step: 'Implementing memory consolidation triggers...' },
        { progress: 95, step: 'Finalizing curriculum integration...' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(step.progress);
        setGenerationStep(step.step);
      }

      // Generate the actual curriculum
      const curriculum = await curriculumGenerationService.generateCompleteCurriculum(selectedLevel);
      
      setGenerationProgress(100);
      setGenerationStep('Complete!');
      setGeneratedCurriculum(curriculum);
      
      if (onCurriculumGenerated) {
        onCurriculumGenerated(curriculum);
      }

      toast.success(`${selectedLevel} Curriculum Generated Successfully!`, {
        description: `${curriculum.totalPages} pages of neuroscience-enhanced content ready.`
      });

    } catch (error) {
      console.error('❌ Curriculum generation failed:', error);
      toast.error('Failed to generate curriculum', {
        description: 'Please try again or contact support if the issue persists.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedLevelData = curriculumLevels.find(cl => cl.level === selectedLevel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">AI Curriculum Generator</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create complete A-Z English curriculums using neuroscientific principles for maximum engagement and retention. 
          Each curriculum contains hundreds of pages of optimized content.
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Curriculum</TabsTrigger>
          <TabsTrigger value="features">Neuroscience Features</TabsTrigger>
          <TabsTrigger value="preview">Preview Content</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Level Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Select Curriculum Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {curriculumLevels.map((level) => (
                  <Card 
                    key={level.level}
                    className={`cursor-pointer transition-all ${
                      selectedLevel === level.level 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedLevel(level.level)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className={level.color + ' text-white'}>
                          {level.level}
                        </Badge>
                        {selectedLevel === level.level && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      
                      <h3 className="font-semibold mb-1">{level.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Weeks:</span>
                          <span className="font-medium">{level.weeks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lessons:</span>
                          <span className="font-medium">{level.lessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pages:</span>
                          <span className="font-medium">{level.pages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Study Time:</span>
                          <span className="font-medium">{level.hours}h</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        {level.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs mr-1">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Level Details */}
          {selectedLevelData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {selectedLevelData.name} - Detailed Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{selectedLevelData.weeks}</div>
                    <div className="text-sm text-muted-foreground">Weeks</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{selectedLevelData.lessons}</div>
                    <div className="text-sm text-muted-foreground">Lessons</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{selectedLevelData.pages}</div>
                    <div className="text-sm text-muted-foreground">Pages</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{selectedLevelData.hours}h</div>
                    <div className="text-sm text-muted-foreground">Study Time</div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    This curriculum will generate <strong>{selectedLevelData.pages} pages</strong> of 
                    neuroscience-enhanced content designed for optimal learning and retention.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Generate Complete Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{generationStep}</span>
                    <span className="text-sm text-muted-foreground">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}

              <Button 
                onClick={handleGenerateCurriculum} 
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Generating {selectedLevel} Curriculum...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate {selectedLevel} Curriculum ({selectedLevelData?.pages} Pages)
                  </>
                )}
              </Button>

              {generatedCurriculum && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Curriculum Generated Successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    {generatedCurriculum.totalPages} pages of neuroscience-enhanced content ready for use.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Curriculum
                    </Button>
                    <Button size="sm" variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Content Library
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Neuroscientific Learning Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {neuroscientificFeatures.map((feature, idx) => (
                  <Card key={idx} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <feature.icon className="w-6 h-6 text-primary" />
                        <h3 className="font-semibold">{feature.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>20-Page Lesson Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Pages 1-3: Hook & Introduction (3 min)</h4>
                    <p className="text-sm text-muted-foreground">Primacy effect activation with surprising facts and personal connections</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pages 4-8: Vocabulary Building (7 min)</h4>
                    <p className="text-sm text-muted-foreground">Motor cortex activation through physical gestures and movements</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pages 9-12: Grammar in Context (6 min)</h4>
                    <p className="text-sm text-muted-foreground">Pattern recognition enhancement with structured repetition</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pages 13-16: Practice & Application (8 min)</h4>
                    <p className="text-sm text-muted-foreground">Social learning activation through peer interaction</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pages 17-19: Conversation Focus (4 min)</h4>
                    <p className="text-sm text-muted-foreground">Emotional engagement through personal storytelling</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Page 20: Assessment & Consolidation (2 min)</h4>
                    <p className="text-sm text-muted-foreground">Recency effect utilization for memory locking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Content Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Page 1 Example - A1 Level "Self & Family"</h4>
                <div className="text-sm space-y-2">
                  <p><strong>🌟 DAY 1: DISCOVER SELF & FAMILY!</strong></p>
                  <p><strong>BRAIN TEASER:</strong> Did you know that the average person has 7.5 conversations per day with family members?</p>
                  <p><strong>TODAY'S MISSION:</strong> Build 5 perfect sentences about your family and have 2 real conversations!</p>
                  <p><strong>NEUROTIP:</strong> Your brain learns 40% faster when emotionally engaged. Let's make this personal!</p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Page 5 Example - Vocabulary with Motor Activation</h4>
                <div className="text-sm space-y-2">
                  <p><strong>📚 VOCABULARY POWERHOUSE</strong></p>
                  <p><strong>METHOD:</strong> See it ➜ Say it ➜ Move it ➜ Use it</p>
                  <p><strong>WORD 1:</strong> Family [Gesture: Arms in circle embrace]</p>
                  <p><strong>MEMORY HOOK:</strong> "My family surrounds me with love"</p>
                  <p><strong>USE IT:</strong> "In my life, family is important because they support me"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}