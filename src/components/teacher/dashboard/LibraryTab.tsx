import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, BookOpen, Clock, Target, Users, Play, Eye, Sparkles, Gamepad2, Zap, TrendingUp, Star } from "lucide-react";
import { CURRICULUM_STRUCTURE, CEFRLevel, Unit, LessonContent } from "@/data/curriculum/curriculumStructure";
import { SlidePreviewModal } from "@/components/teacher/preview/SlidePreviewModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import helloImage from "@/assets/lessons/unit-0-lesson-1/hello-greeting.png";
import spidermanImage from "@/assets/lessons/unit-0-lesson-1/spiderman-intro.png";

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
  return <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5 border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Lesson Library
              </h2>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Professional curriculum organized by CEFR levels
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-semibold">{CURRICULUM_STRUCTURE.reduce((total, level) => total + level.units.reduce((unitTotal, unit) => unitTotal + unit.lessons.length, 0), 0)}</span>
              <span className="text-muted-foreground">Total Lessons</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs">Updated Weekly</span>
            </Badge>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Button variant={selectedLevel === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedLevel("all")} className="whitespace-nowrap">
                All
              </Button>
              {CURRICULUM_STRUCTURE.map(level => <Button key={level.level} variant={selectedLevel === level.level ? "default" : "outline"} size="sm" onClick={() => setSelectedLevel(level.level)} className="whitespace-nowrap text-xs sm:text-sm">
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      {expandedLevels.includes(level.level) ? <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" /> : <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <CardTitle className="text-base sm:text-lg">{level.title}</CardTitle>
                          <Badge className={`${getLevelColor(level.level)} w-fit`}>
                            {level.level}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{level.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground pl-7 sm:pl-0">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">{level.units.length} Units</span>
                        <span className="sm:hidden">{level.units.length}U</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">{level.units.reduce((total, unit) => total + unit.lessons.length, 0)} Lessons</span>
                        <span className="sm:hidden">{level.units.reduce((total, unit) => total + unit.lessons.length, 0)}L</span>
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
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                  {expandedUnits.includes(unit.id) ? <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /> : <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-sm sm:text-base">{unit.title}</h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{unit.description}</p>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-1 w-fit ml-6 sm:ml-0">
                                  <Users className="h-3 w-3" />
                                  <span className="text-xs">{unit.lessons.length}</span>
                                </Badge>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="grid gap-4">
                                 {unit.lessons.map((lesson, index) => {
                                   // Determine if this is the new Unit 0 Lesson 1
                                   const isNewLesson = unit.id === 'unit-0' && index === 0;
                                   const lessonImage = isNewLesson ? helloImage : null;
                                   
                                   return (
                                     <Card 
                                       key={lesson.id} 
                                       className="group border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                                     >
                                       <CardContent className="p-0">
                                         <div className="flex flex-col sm:flex-row gap-4">
                                           {/* Thumbnail Section */}
                                           {lessonImage && (
                                             <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-primary/10 to-purple-500/10 overflow-hidden">
                                               <img 
                                                 src={lessonImage} 
                                                 alt={lesson.title}
                                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                               />
                                               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                               <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur">
                                                 <Sparkles className="h-3 w-3 mr-1" />
                                                 New
                                               </Badge>
                                             </div>
                                           )}
                                           
                                           {/* Content Section */}
                                           <div className="flex-1 p-4 sm:p-5">
                                             <div className="flex flex-col h-full">
                                               {/* Header */}
                                               <div className="flex-1">
                                                 <div className="flex flex-wrap items-center gap-2 mb-3">
                                                   <Badge variant="outline" className="text-xs font-semibold">
                                                     Lesson {index + 1}
                                                   </Badge>
                                                   
                                                   {isNewLesson && (
                                                     <>
                                                       <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                                         <Gamepad2 className="h-3 w-3 mr-1" />
                                                         Gamified
                                                       </Badge>
                                                       <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                                         <Zap className="h-3 w-3 mr-1" />
                                                         Interactive
                                                       </Badge>
                                                       <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                                                         <Star className="h-3 w-3 mr-1" />
                                                         Popular
                                                       </Badge>
                                                     </>
                                                   )}
                                                 </div>
                                                 
                                                 <h5 className="font-bold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
                                                   {lesson.title}
                                                 </h5>
                                                 
                                                 <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                                                   {lesson.description}
                                                 </p>

                                                 {/* Stats Row */}
                                                 <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 flex-wrap">
                                                   <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                                     <Clock className="h-3.5 w-3.5 text-primary" />
                                                     <span className="font-medium">{lesson.duration}m</span>
                                                   </div>
                                                   <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                                     <Target className="h-3.5 w-3.5 text-purple-600" />
                                                     <span className="font-medium">{lesson.skills.length} skills</span>
                                                   </div>
                                                   <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                                     <BookOpen className="h-3.5 w-3.5 text-green-600" />
                                                     <span className="font-medium">{lesson.vocabulary.length} words</span>
                                                   </div>
                                                   {isNewLesson && (
                                                     <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                                                       <Zap className="h-3.5 w-3.5 text-amber-600" />
                                                       <span className="font-medium text-amber-700 dark:text-amber-500">180 XP</span>
                                                     </div>
                                                   )}
                                                 </div>

                                                 {/* Objectives */}
                                                 {lesson.objectives.length > 0 && (
                                                   <div className="mb-4">
                                                     <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                                       <Target className="h-3 w-3" />
                                                       Learning Objectives:
                                                     </p>
                                                     <div className="flex flex-wrap gap-1.5">
                                                       {lesson.objectives.slice(0, 3).map((objective, idx) => (
                                                         <Badge 
                                                           key={idx} 
                                                           variant="secondary" 
                                                           className="text-xs font-normal hover:bg-secondary/80 transition-colors"
                                                         >
                                                           {objective}
                                                         </Badge>
                                                       ))}
                                                       {lesson.objectives.length > 3 && (
                                                         <Badge variant="outline" className="text-xs">
                                                           +{lesson.objectives.length - 3} more
                                                         </Badge>
                                                       )}
                                                     </div>
                                                   </div>
                                                 )}
                                               </div>

                                               {/* Action Buttons */}
                                               <div className="flex gap-2 mt-auto pt-2">
                                                 <Button 
                                                   onClick={() => previewSlides(lesson)} 
                                                   size="sm" 
                                                   variant="outline"
                                                   className="flex-1 sm:flex-none hover:bg-muted"
                                                 >
                                                   <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                   <span>Preview</span>
                                                 </Button>
                                                 <Button 
                                                   onClick={() => startLesson(lesson)} 
                                                   size="sm" 
                                                   className="flex-1 sm:flex-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                                                   disabled={isLoadingLesson}
                                                 >
                                                   <Play className="h-3.5 w-3.5 mr-1.5" />
                                                   <span className="font-semibold">{isLoadingLesson ? 'Loading...' : 'Start Lesson'}</span>
                                                 </Button>
                                               </div>
                                             </div>
                                           </div>
                                         </div>
                                       </CardContent>
                                     </Card>
                                   );
                                 })}
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