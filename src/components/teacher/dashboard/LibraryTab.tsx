import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, BookOpen, Clock, Target, Users, Play, Eye } from "lucide-react";
import { CURRICULUM_STRUCTURE, CEFRLevel, Unit, LessonContent } from "@/data/curriculum/curriculumStructure";
import { SlidePreviewModal } from "@/components/teacher/preview/SlidePreviewModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const LibraryTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLevels, setExpandedLevels] = useState<string[]>([]);
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [previewLesson, setPreviewLesson] = useState<{ slides: any[], title: string } | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const toggleLevel = (level: string) => {
    setExpandedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };
  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => prev.includes(unitId) ? prev.filter(u => u !== unitId) : [...prev, unitId]);
  };
  const filteredLevels = CURRICULUM_STRUCTURE.filter(level => {
    if (selectedLevel !== "all" && level.level !== selectedLevel) return false;
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return level.title.toLowerCase().includes(searchLower) || level.description.toLowerCase().includes(searchLower) || level.units.some(unit => unit.title.toLowerCase().includes(searchLower) || unit.lessons.some(lesson => lesson.title.toLowerCase().includes(searchLower) || lesson.description.toLowerCase().includes(searchLower)));
  });
  const getLevelColor = (level: string) => {
    const colors = {
      'Pre-Starter': 'bg-purple-100 text-purple-800 border-purple-200',
      'A1': 'bg-green-100 text-green-800 border-green-200',
      'A2': 'bg-blue-100 text-blue-800 border-blue-200',
      'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'B2': 'bg-orange-100 text-orange-800 border-orange-200',
      'C1': 'bg-red-100 text-red-800 border-red-200',
      'C2': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  const startLesson = async (lesson: LessonContent) => {
    setIsLoadingLesson(true);
    try {
      // Fetch lesson slides from database
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .ilike('title', `%${lesson.title}%`)
        .maybeSingle();

      if (error) throw error;

      if (!data || !data.slides_content) {
        toast({
          title: "No Slides Found",
          description: "This lesson doesn't have slides yet.",
          variant: "destructive",
        });
        return;
      }

      // Store lesson data in localStorage for the viewer
      localStorage.setItem('currentLesson', JSON.stringify({
        lessonId: data.id,
        title: data.title,
        slides: data.slides_content,
      }));

      // Navigate to lesson viewer
      navigate('/lesson-viewer');
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const previewSlides = async (lesson: LessonContent) => {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('slides_content, title')
        .ilike('title', `%${lesson.title}%`)
        .maybeSingle();

      if (error) throw error;

      if (data?.slides_content?.slides) {
        setPreviewLesson({
          slides: data.slides_content.slides,
          title: data.title,
        });
      } else {
        toast({
          title: "No Slides",
          description: "This lesson doesn't have slides to preview.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error previewing slides:', error);
      toast({
        title: "Error",
        description: "Failed to preview slides.",
        variant: "destructive",
      });
    }
  };
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lesson Library</h2>
          <p className="text-muted-foreground">Browse lessons organized by CEFR levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {CURRICULUM_STRUCTURE.reduce((total, level) => total + level.units.reduce((unitTotal, unit) => unitTotal + unit.lessons.length, 0), 0)} Total Lessons
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              
            </div>
            <div className="flex gap-2">
              <Button variant={selectedLevel === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedLevel("all")}>
                All Levels
              </Button>
              {CURRICULUM_STRUCTURE.map(level => <Button key={level.level} variant={selectedLevel === level.level ? "default" : "outline"} size="sm" onClick={() => setSelectedLevel(level.level)} className="hidden sm:inline-flex">
                  {level.level}
                </Button>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Structure */}
      <div className="space-y-4">
        {filteredLevels.map(level => <Card key={level.level} className="overflow-hidden">
            <Collapsible open={expandedLevels.includes(level.level)} onOpenChange={() => toggleLevel(level.level)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedLevels.includes(level.level) ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                      <div>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{level.title}</CardTitle>
                          <Badge className={getLevelColor(level.level)}>
                            {level.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {level.units.length} Units
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {level.units.reduce((total, unit) => total + unit.lessons.length, 0)} Lessons
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {level.units.map(unit => <Card key={unit.id} className="border-l-4 border-l-primary/20">
                        <Collapsible open={expandedUnits.includes(unit.id)} onOpenChange={() => toggleUnit(unit.id)}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {expandedUnits.includes(unit.id) ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                  <div>
                                    <h4 className="font-semibold text-base">{unit.title}</h4>
                                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {unit.lessons.length} Lessons
                                </Badge>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="grid gap-3">
                                {unit.lessons.map((lesson, index) => <Card key={lesson.id} className="border border-border/50 hover:border-border transition-colors">
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs">
                                              Lesson {index + 1}
                                            </Badge>
                                            <h5 className="font-medium">{lesson.title}</h5>
                                          </div>
                                          
                                          <p className="text-sm text-muted-foreground mb-3">
                                            {lesson.description}
                                          </p>

                                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {lesson.duration} min
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Target className="h-3 w-3" />
                                              {lesson.skills.length} skills
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <BookOpen className="h-3 w-3" />
                                              {lesson.vocabulary.length} vocabulary
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            {lesson.objectives.length > 0 && <div>
                                                <p className="text-xs font-medium text-muted-foreground mb-1">Objectives:</p>
                                                <div className="flex flex-wrap gap-1">
                                                  {lesson.objectives.slice(0, 2).map((objective, idx) => <Badge key={idx} variant="secondary" className="text-xs">
                                                      {objective}
                                                    </Badge>)}
                                                  {lesson.objectives.length > 2 && <Badge variant="outline" className="text-xs">
                                                      +{lesson.objectives.length - 2} more
                                                    </Badge>}
                                                </div>
                                              </div>}
                                          </div>
                                        </div>

                                        <div className="ml-4 flex gap-2">
                                          <Button 
                                            onClick={() => previewSlides(lesson)} 
                                            size="sm" 
                                            variant="outline"
                                            className="flex items-center gap-2"
                                          >
                                            <Eye className="h-3 w-3" />
                                            Preview
                                          </Button>
                                          <Button 
                                            onClick={() => startLesson(lesson)} 
                                            size="sm" 
                                            className="flex items-center gap-2"
                                            disabled={isLoadingLesson}
                                          >
                                            <Play className="h-3 w-3" />
                                            {isLoadingLesson ? 'Loading...' : 'Start'}
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>)}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>)}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>)}
      </div>

      {filteredLevels.length === 0 && <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
              </div>
              <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setSelectedLevel("all");
          }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>}

      {/* Preview Modal */}
      {previewLesson && (
        <SlidePreviewModal
          open={!!previewLesson}
          onOpenChange={(open) => !open && setPreviewLesson(null)}
          slides={previewLesson.slides}
          lessonTitle={previewLesson.title}
        />
      )}
    </div>;
};