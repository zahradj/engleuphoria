import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  Play, 
  Clock, 
  Target, 
  Brain,
  Users,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { contentLibraryService } from '@/services/ai/contentLibraryService';
import SystematicCurriculumGenerator from './SystematicCurriculumGenerator';

interface K12LessonLibraryProps {
  onSelectLesson?: (lesson: any) => void;
  isClassroomMode?: boolean;
}

export const K12LessonLibrary: React.FC<K12LessonLibraryProps> = ({
  onSelectLesson,
  isClassroomMode = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['k12-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('systematic_lessons')
        .select('*, curriculum_levels(name, cefr_level)')
        .not('status', 'eq', 'archived')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredLessons = lessons?.filter(lesson => {
    const matchesSearch = searchTerm === '' || 
      lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || 
      lesson.curriculum_levels?.cefr_level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  }) || [];

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const generateSlides = async (lessonId: string) => {
    setIsGenerating(lessonId);
    console.log('🎨 Starting slide generation for lesson:', lessonId);
    try {
      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: { 
          content_id: lessonId,
          content_type: 'systematic_lesson',
          generate_20_slides: true
        }
      });

      console.log('🎨 Slide generation response:', { data, error });

      if (error) throw error;

      // Slides are saved by the edge function into slides_content; reflect in local DB to be safe
      if (data?.slides) {
        const slidesPayload = data.slides;
        const { error: updateError } = await supabase
          .from('systematic_lessons')
          .update({ 
            slides_content: slidesPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', lessonId);
        if (updateError) throw updateError;

        // Also add to Content Library for easy access
        const lesson = lessons?.find(l => l.id === lessonId);
        const libraryItem = {
          id: `slides-${lessonId}-${Date.now()}`,
          title: `${(slidesPayload?.metadata?.CEFR || lesson?.curriculum_levels?.cefr_level || '')} | ${lesson?.title || 'Lesson'} – Slides`,
          type: 'slides',
          topic: lesson?.topic || 'Interactive Lesson',
          level: lesson?.curriculum_levels?.cefr_level || 'A1',
          duration: lesson?.estimated_duration || 30,
          content: JSON.stringify(slidesPayload),
          metadata: {
            generatedAt: new Date().toISOString(),
            model: 'gpt-4o-mini',
            isAIGenerated: true,
            slideCount: slidesPayload?.total_slides || slidesPayload?.slides?.length || 0,
            lessonId: lessonId
          }
        } as any;
        
        contentLibraryService.addToLibrary(libraryItem);
      }

      toast({
        title: "22-Slide Systematic Curriculum Generated! 🎉",
        description: `Created ${data?.slides?.slides?.length || 0} comprehensive slides covering all core skills. Available on whiteboard now.`
      });
    } catch (error) {
      console.error('Failed to generate slides:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate 20-slide deck. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      A1: 'bg-emerald-100 text-emerald-700',
      A2: 'bg-blue-100 text-blue-700',
      B1: 'bg-amber-100 text-amber-700',
      B2: 'bg-orange-100 text-orange-700',
      C1: 'bg-red-100 text-red-700',
      C2: 'bg-purple-100 text-purple-700'
    };
    return colors[level as keyof typeof colors] || 'bg-neutral-100 text-neutral-700';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading K12 lessons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Systematic Curriculum Platform
          </h2>
          <p className="text-muted-foreground">
            Complete K12 ESL curriculum with 308 interactive lessons
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {lessons?.length || 0} Generated Lessons
        </Badge>
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Lesson Library
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Curriculum Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredLessons.length} interactive lessons for young learners
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search lessons by title or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-foreground"
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {lesson.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lesson.topic}
                      </p>
                    </div>
                    {lesson.curriculum_levels?.cefr_level && (
                      <Badge className={`ml-2 ${getLevelColor(lesson.curriculum_levels.cefr_level)}`}>
                        {lesson.curriculum_levels.cefr_level}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Lesson Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.estimated_duration || 30} min</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>Level {lesson.difficulty_level || 1}</span>
                      </div>
                    </div>

                    {/* Learning Objective */}
                    {lesson.learning_objective && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.learning_objective}
                      </p>
                    )}

                    {/* Communication Outcome */}
                    {lesson.communication_outcome && (
                      <div className="flex items-start gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground line-clamp-2">
                          {lesson.communication_outcome}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => onSelectLesson?.({
                          ...lesson,
                          type: 'systematic_lesson',
                          level: lesson.curriculum_levels?.cefr_level,
                          slides_content: lesson.slides_content,
                          id: lesson.id
                        })} 
                        size="sm" 
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {isClassroomMode ? 'Start Lesson' : 'View Lesson'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => generateSlides(lesson.id)}
                        disabled={isGenerating === lesson.id}
                        title="Generate 20-slide interactive deck"
                      >
                        {isGenerating === lesson.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No lessons found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedLevel !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Lessons will appear here once generated'
                }
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="generator" className="mt-6">
          <SystematicCurriculumGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};