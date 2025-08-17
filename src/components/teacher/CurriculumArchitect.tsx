import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { curriculumService, type CurriculumLevel, type SystematicLesson } from '@/services/curriculumService';
import { 
  BookOpen, 
  Target, 
  Zap, 
  Trophy, 
  Users, 
  ChevronRight,
  Play,
  Plus,
  Settings,
  BarChart3,
  Sparkles
} from 'lucide-react';

export default function CurriculumArchitect() {
  const [curriculumLevels, setCurriculumLevels] = useState<CurriculumLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [lessons, setLessons] = useState<SystematicLesson[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  // Form state for lesson generation
  const [lessonForm, setLessonForm] = useState({
    topic: '',
    grammar_focus: '',
    vocabulary_set: '',
    communication_outcome: '',
    lesson_objectives: '',
    estimated_duration: 45
  });

  useEffect(() => {
    loadCurriculumLevels();
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      loadLessonsForLevel(selectedLevel);
    }
  }, [selectedLevel]);

  const loadCurriculumLevels = async () => {
    try {
      const levels = await curriculumService.getCurriculumLevels();
      setCurriculumLevels(levels);
      if (levels.length > 0) {
        setSelectedLevel(levels[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load curriculum levels",
        variant: "destructive"
      });
    }
  };

  const loadLessonsForLevel = async (levelId: string) => {
    try {
      const levelLessons = await curriculumService.getLessonsForLevel(levelId);
      setLessons(levelLessons);
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to load lessons",
        variant: "destructive"
      });
    }
  };

  const generateFullCurriculum = async () => {
    if (!selectedLevel) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const level = curriculumLevels.find(l => l.id === selectedLevel);
      if (!level) return;

      const topics = curriculumService.getCEFRTopics(level.cefr_level);
      const totalLessons = topics.length;

      toast({
        title: "Curriculum Generation Started",
        description: `Generating ${totalLessons} systematic lessons for ${level.name}...`
      });

      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        const lessonNumber = i + 1;
        
        // Generate lesson objectives and grammar focus based on topic and level
        const objectives = generateLessonObjectives(topic, level.cefr_level);
        const grammarFocus = generateGrammarFocus(topic, level.cefr_level);
        const vocabularySet = generateVocabularySet(topic, level.cefr_level);
        const communicationOutcome = generateCommunicationOutcome(topic, level.cefr_level);

        try {
          const { data, error } = await supabase.functions.invoke('curriculum-generator', {
            body: {
              curriculum_level_id: selectedLevel,
              lesson_number: lessonNumber,
              topic,
              cefr_level: level.cefr_level,
              grammar_focus: grammarFocus,
              vocabulary_set: vocabularySet,
              communication_outcome: communicationOutcome,
              lesson_objectives: objectives,
              estimated_duration: 45
            }
          });

          if (error) {
            console.error(`Failed to generate lesson ${lessonNumber}:`, error);
            continue;
          }

          setGenerationProgress(Math.round(((i + 1) / totalLessons) * 100));
          
          // Add a small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`Error generating lesson ${lessonNumber}:`, error);
        }
      }

      // Reload lessons
      await loadLessonsForLevel(selectedLevel);
      
      toast({
        title: "Curriculum Generated!",
        description: `Successfully generated ${totalLessons} lessons for ${level.name}`,
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate full curriculum",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateSingleLesson = async () => {
    if (!selectedLevel || !lessonForm.topic) return;

    setIsGenerating(true);

    try {
      const level = curriculumLevels.find(l => l.id === selectedLevel);
      const nextLessonNumber = lessons.length + 1;

      const { data, error } = await supabase.functions.invoke('curriculum-generator', {
        body: {
          curriculum_level_id: selectedLevel,
          lesson_number: nextLessonNumber,
          topic: lessonForm.topic,
          cefr_level: level?.cefr_level,
          grammar_focus: lessonForm.grammar_focus,
          vocabulary_set: lessonForm.vocabulary_set.split(',').map(v => v.trim()),
          communication_outcome: lessonForm.communication_outcome,
          lesson_objectives: lessonForm.lesson_objectives.split(',').map(o => o.trim()),
          estimated_duration: lessonForm.estimated_duration
        }
      });

      if (error) throw error;

      toast({
        title: "Lesson Generated!",
        description: `"${lessonForm.topic}" lesson created successfully`,
      });

      // Reset form and reload lessons
      setLessonForm({
        topic: '',
        grammar_focus: '',
        vocabulary_set: '',
        communication_outcome: '',
        lesson_objectives: '',
        estimated_duration: 45
      });
      
      await loadLessonsForLevel(selectedLevel);

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate lesson",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions for generating curriculum content
  const generateLessonObjectives = (topic: string, level: string) => {
    const objectives = [
      `Understand and use vocabulary related to ${topic.toLowerCase()}`,
      `Apply grammar structures in context of ${topic.toLowerCase()}`,
      `Communicate effectively about ${topic.toLowerCase()}`
    ];
    return objectives;
  };

  const generateGrammarFocus = (topic: string, level: string) => {
    const grammarMap: Record<string, string> = {
      'Pre-A1': 'Present simple, Basic word order',
      'A1': 'Present simple, Past simple, Basic questions',
      'A2': 'Present perfect, Comparatives, Future forms',
      'B1': 'Past continuous, Conditionals, Modal verbs',
      'B2': 'Present perfect continuous, Passive voice, Reported speech',
      'C1': 'Advanced conditionals, Mixed tenses, Complex structures',
      'C2': 'Subtle grammar distinctions, Advanced structures'
    };
    return grammarMap[level] || 'Grammar structures';
  };

  const generateVocabularySet = (topic: string, level: string) => {
    // This would typically be more sophisticated
    return [`${topic} vocabulary`, 'Key terms', 'Common expressions'];
  };

  const generateCommunicationOutcome = (topic: string, level: string) => {
    return `Students will be able to discuss and express ideas about ${topic.toLowerCase()} confidently`;
  };

  const selectedLevelData = curriculumLevels.find(l => l.id === selectedLevel);
  const completedLessons = lessons.filter(l => l.status === 'published').length;
  const targetLessons = selectedLevelData?.target_lessons || 50;
  const progressPercentage = Math.round((completedLessons / targetLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Curriculum Architect
        </h1>
        <p className="text-muted-foreground">
          Build a complete systematic English curriculum with 296+ interactive lessons across all CEFR levels
        </p>
      </div>

      {/* Level Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            CEFR Level Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select CEFR Level" />
              </SelectTrigger>
              <SelectContent>
                {curriculumLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.cefr_level} - {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedLevelData && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold">{selectedLevelData.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLevelData.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{completedLessons}/{targetLessons}</div>
                  <div className="text-sm text-muted-foreground">Lessons</div>
                </div>
              </div>
            )}
            
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generating Curriculum...</span>
                <span className="text-sm text-muted-foreground">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Curriculum</TabsTrigger>
          <TabsTrigger value="lessons">Manage Lessons</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Curriculum Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Full Curriculum Generation
                </CardTitle>
                <CardDescription>
                  Generate complete systematic curriculum with ~50 lessons for the selected level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>What will be generated:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline">Interactive Slides</Badge>
                    <Badge variant="outline">Gamified Activities</Badge>
                    <Badge variant="outline">Speaking Practice</Badge>
                    <Badge variant="outline">Grammar Focus</Badge>
                    <Badge variant="outline">Vocabulary Sets</Badge>
                    <Badge variant="outline">Review Quizzes</Badge>
                  </div>
                </div>
                <Button 
                  onClick={generateFullCurriculum}
                  disabled={!selectedLevel || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Complete Curriculum
                </Button>
              </CardContent>
            </Card>

            {/* Single Lesson Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Single Lesson Creation
                </CardTitle>
                <CardDescription>
                  Create individual lessons with custom parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Lesson Topic</Label>
                  <Input
                    id="topic"
                    value={lessonForm.topic}
                    onChange={(e) => setLessonForm(prev => ({...prev, topic: e.target.value}))}
                    placeholder="e.g., Greetings & Introductions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grammar">Grammar Focus</Label>
                  <Input
                    id="grammar"
                    value={lessonForm.grammar_focus}
                    onChange={(e) => setLessonForm(prev => ({...prev, grammar_focus: e.target.value}))}
                    placeholder="e.g., Present simple tense"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vocabulary">Vocabulary (comma-separated)</Label>
                  <Input
                    id="vocabulary"
                    value={lessonForm.vocabulary_set}
                    onChange={(e) => setLessonForm(prev => ({...prev, vocabulary_set: e.target.value}))}
                    placeholder="hello, goodbye, please, thank you"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outcome">Communication Outcome</Label>
                  <Textarea
                    id="outcome"
                    value={lessonForm.communication_outcome}
                    onChange={(e) => setLessonForm(prev => ({...prev, communication_outcome: e.target.value}))}
                    placeholder="Students will be able to greet people and introduce themselves"
                    rows={2}
                  />
                </div>
                <Button 
                  onClick={generateSingleLesson}
                  disabled={!lessonForm.topic || isGenerating}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Lesson
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Lesson {lesson.lesson_number}</Badge>
                        <h3 className="font-semibold">{lesson.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📚 {lesson.grammar_focus}</span>
                        <span>🎯 {lesson.vocabulary_set?.length || 0} words</span>
                        <span>⏱️ {lesson.estimated_duration}min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                        {lesson.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Lessons</p>
                    <p className="text-2xl font-bold">{lessons.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{progressPercentage}%</p>
                  </div>
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold">{Math.round((lessons.length * 45) / 60)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}