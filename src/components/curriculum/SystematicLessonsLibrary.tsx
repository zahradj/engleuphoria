import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Target, 
  Search, 
  Filter,
  ChevronRight,
  Users,
  CheckCircle,
  Presentation
} from 'lucide-react';

interface LessonContent {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  module_number: number;
  lesson_number: number;
  duration_minutes: number;
  learning_objectives: string[];
  vocabulary_focus: string[];
  grammar_focus: string[];
  slides_content: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SystematicLessonsLibraryProps {
  onContentUpdate?: () => void;
}

export function SystematicLessonsLibrary({ onContentUpdate }: SystematicLessonsLibraryProps) {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('is_active', true)
        .order('module_number', { ascending: true })
        .order('lesson_number', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lessons. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  const openInClassroom = (lesson: LessonContent) => {
    // Store lesson data and open classroom
    localStorage.setItem('currentLessonContent', JSON.stringify(lesson));
    window.open(`/oneonone-classroom-new?roomId=lesson-${lesson.id}&role=teacher&name=Teacher&userId=teacher-1&lessonMode=true`, '_blank');
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || lesson.cefr_level === levelFilter;
    const matchesModule = moduleFilter === 'all' || lesson.module_number.toString() === moduleFilter;
    
    return matchesSearch && matchesLevel && matchesModule;
  });

  const lessonsWithSlides = filteredLessons.filter(lesson => 
    lesson.slides_content && Object.keys(lesson.slides_content).length > 0
  );

  const lessonsWithoutSlides = filteredLessons.filter(lesson => 
    !lesson.slides_content || Object.keys(lesson.slides_content).length === 0
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-8">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">Systematic ESL Lessons</h2>
          <p className="text-muted-foreground">
            Structured curriculum lessons with interactive slides ready for classroom use.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search lessons by title or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>Module {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{filteredLessons.length}</div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{lessonsWithSlides.length}</div>
                <div className="text-sm text-muted-foreground">With Slides</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Presentation className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{lessonsWithoutSlides.length}</div>
                <div className="text-sm text-muted-foreground">Need Slides</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{lessonsWithSlides.length * 22}</div>
                <div className="text-sm text-muted-foreground">Total Slides</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const hasSlides = lesson.slides_content && Object.keys(lesson.slides_content).length > 0;
          const slideCount = hasSlides ? lesson.slides_content?.slides?.length || 22 : 0;

          return (
            <Card key={lesson.id} className={`transition-all duration-200 hover:shadow-lg ${
              hasSlides ? 'border-green-200 bg-green-50/30' : 'border-orange-200 bg-orange-50/30'
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg line-clamp-2 mb-1">
                      {lesson.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lesson.topic}
                    </p>
                  </div>
                  <Badge variant={hasSlides ? "default" : "secondary"}>
                    {lesson.cefr_level}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Module {lesson.module_number}, Lesson {lesson.lesson_number}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.duration_minutes}min
                  </span>
                </div>

                {/* Slides Status */}
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Presentation className={`h-4 w-4 ${hasSlides ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm">
                      {hasSlides ? `${slideCount} Slides Ready` : 'No Slides Yet'}
                    </span>
                  </div>
                  {hasSlides && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>

                {/* Learning Objectives */}
                {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Learning Objectives:</div>
                    <div className="space-y-1">
                      {lesson.learning_objectives.slice(0, 2).map((objective, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                          <ChevronRight className="h-3 w-3" />
                          {objective}
                        </div>
                      ))}
                      {lesson.learning_objectives.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{lesson.learning_objectives.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {hasSlides && (
                    <Button
                      onClick={() => openInClassroom(lesson)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Use in Classroom
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {lessons.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Lessons Available</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your lesson library is empty. Please contact your administrator to add lessons to the curriculum.
            </p>
          </CardContent>
        </Card>
      )}

      {filteredLessons.length === 0 && lessons.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Search size={48} className="mx-auto mb-2 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600">No lessons found</h3>
            <p className="text-gray-500">Try adjusting your search filters to find lessons.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}