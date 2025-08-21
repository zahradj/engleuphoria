import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LessonGeneratorModal } from './LessonGeneratorModal';
import { Search, Plus, Play, Clock, Target, BookOpen, Filter } from 'lucide-react';

interface LessonContent {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  module_number: number;
  lesson_number: number;
  slides_content: any;
  learning_objectives: string[];
  vocabulary_focus: string[];
  grammar_focus: string[];
  duration_minutes: number;
  created_at: string;
}

export function InteractiveLessonsLibrary() {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showGenerator, setShowGenerator] = useState(false);
  const { toast } = useToast();

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "Error Loading Lessons",
        description: "Failed to load lessons from the library.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || lesson.cefr_level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const openLessonViewer = (lesson: LessonContent) => {
    // Store lesson data in localStorage for the viewer
    localStorage.setItem('currentLesson', JSON.stringify({
      lessonId: lesson.id,
      title: lesson.title,
      slides: lesson.slides_content
    }));
    
    // Open in new tab/window
    window.open('/lesson-viewer', '_blank');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Interactive Lessons Library</h2>
          <p className="text-muted-foreground">
            AI-generated ESL lessons with interactive slides
          </p>
        </div>
        <Button onClick={() => setShowGenerator(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Generate New Lesson
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons by title or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
            <SelectItem value="C2">C2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{lessons.length}</div>
          <div className="text-sm text-muted-foreground">Total Lessons</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {lessons.reduce((sum, lesson) => sum + (lesson.slides_content?.slides?.length || 0), 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Slides</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {new Set(lessons.map(l => l.cefr_level)).size}
          </div>
          <div className="text-sm text-muted-foreground">CEFR Levels</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {Math.round(lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0) / 60)}h
          </div>
          <div className="text-sm text-muted-foreground">Total Content</div>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No Lessons Found</h3>
              <p className="text-muted-foreground">
                {lessons.length === 0 
                  ? "Start by generating your first interactive lesson."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
            {lessons.length === 0 && (
              <Button onClick={() => setShowGenerator(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Generate First Lesson
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                  </div>
                  <Badge variant="secondary">{lesson.cefr_level}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.duration_minutes}min
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {lesson.slides_content?.slides?.length || 0} slides
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Module {lesson.module_number}</span>
                    <span className="text-muted-foreground"> • Lesson {lesson.lesson_number}</span>
                  </div>
                  
                  {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Target className="h-3 w-3" />
                        Objectives
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {lesson.learning_objectives.slice(0, 2).join(', ')}
                        {lesson.learning_objectives.length > 2 && '...'}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => openLessonViewer(lesson)}
                  className="w-full"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Lesson
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Generator Modal */}
      <LessonGeneratorModal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        onLessonGenerated={fetchLessons}
      />
    </div>
  );
}