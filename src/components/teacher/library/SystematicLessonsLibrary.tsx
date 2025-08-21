
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Search, 
  Filter, 
  Plus, 
  Eye,
  FileText,
  Clock,
  Users,
  Target,
  RefreshCw
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { contentLibraryService } from '@/services/ai/contentLibraryService';

interface SystematicLesson {
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
  difficulty_level: string;
  slides_content: any;
  is_active: boolean;
  created_at: string;
  metadata?: any;
}

export const SystematicLessonsLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  
  const [isSeeding, setIsSeeding] = useState(false);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Clear cached content on component mount
  useEffect(() => {
    console.log('🧹 Clearing cached content library...');
    contentLibraryService.clearLibrary();
  }, []);

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['systematic-lessons', selectedLevel],
    queryFn: async () => {
      console.log('📚 Fetching systematic lessons from database...');
      
      let query = supabase
        .from('lessons_content')
        .select('*')
        .eq('is_active', true)
        .order('module_number')
        .order('lesson_number');

      if (selectedLevel !== 'all') {
        query = query.eq('cefr_level', selectedLevel);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching lessons:', error);
        throw error;
      }

      console.log(`📖 Found ${data?.length || 0} lessons in database`);
      return data as SystematicLesson[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const refreshLibrary = () => {
    console.log('🔄 Manually refreshing library...');
    queryClient.invalidateQueries({ queryKey: ['systematic-lessons'] });
  };

  const handleSeedLessons = async () => {
    setIsSeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-lesson-generator', {
        body: { action: 'seed_420_lessons' }
      });

      if (error) throw error;

      toast({
        title: "Lessons Seeded Successfully!",
        description: `${data.stats.inserted} lessons created across 7 CEFR levels (${data.stats.skipped} duplicates skipped)`,
      });

      refreshLibrary();
    } catch (error) {
      console.error('Error seeding lessons:', error);
      toast({
        title: "Seeding Failed",
        description: error.message || "Failed to seed lessons. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGenerateAllSlides = async () => {
    setIsGeneratingSlides(true);
    try {
      // Get lessons without slides
      const { data: lessonsNeedingSlides } = await supabase
        .from('lessons_content')
        .select('id, title')
        .eq('is_active', true)
        .or('slides_content.is.null,slides_content.eq.{}');

      if (!lessonsNeedingSlides?.length) {
        toast({
          title: "No Lessons Need Slides",
          description: "All lessons already have slides generated.",
        });
        setIsGeneratingSlides(false);
        return;
      }

      toast({
        title: "Generating Slides",
        description: `Starting slide generation for ${lessonsNeedingSlides.length} lessons. This may take several minutes...`,
      });

      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: { 
          batch_generate: true,
          lesson_ids: lessonsNeedingSlides.map(l => l.id).slice(0, 50) // Limit to 50 lessons to avoid timeout
        }
      });

      if (error) throw error;

      toast({
        title: "Slide Generation Complete!",
        description: `Successfully generated slides for multiple lessons.`,
      });

      refreshLibrary();
    } catch (error) {
      console.error('Error generating slides:', error);
      toast({
        title: "Slide Generation Failed",
        description: error.message || "Failed to generate slides. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueLevels = [...new Set(lessons.map(l => l.cefr_level))];

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <Book className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Failed to Load Library
              </h3>
              <p className="text-muted-foreground mb-4">
                {error.message || 'Something went wrong while loading the lesson library.'}
              </p>
              <Button onClick={refreshLibrary} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Systematic Lessons Library</h1>
          <p className="text-muted-foreground">
            420 systematic ESL lessons across 7 levels (A1-C2), 30 minutes each
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSeedLessons} 
            disabled={isSeeding}
            variant="default" 
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isSeeding ? 'Seeding...' : 'Seed 420 Lessons'}
          </Button>
          <Button 
            onClick={handleGenerateAllSlides} 
            disabled={isGeneratingSlides || lessons.length === 0}
            variant="secondary" 
            size="sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isGeneratingSlides ? 'Generating...' : 'Generate Slides for All'}
          </Button>
          <Button onClick={refreshLibrary} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search lessons by title or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Levels</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                {uniqueLevels.filter(level => !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="h-8 bg-muted rounded w-full mt-4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Lessons Available</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {lessons.length === 0 
                  ? "The systematic lessons library is currently empty. Lessons will be available once the curriculum is populated."
                  : "No lessons match your current search criteria. Try adjusting your filters or search terms."
                }
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {lesson.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {lesson.cefr_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lesson.difficulty_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Module {lesson.module_number}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lesson.topic}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration_minutes}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{lesson.learning_objectives?.length || 0} objectives</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={() => {
                      toast({
                        title: "Preview Available Soon",
                        description: "Lesson preview functionality will be available in the next update."
                      });
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs bg-teacher hover:bg-teacher-dark"
                    onClick={() => {
                      toast({
                        title: "Use in Classroom",
                        description: "Lesson classroom integration coming soon!"
                      });
                    }}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
