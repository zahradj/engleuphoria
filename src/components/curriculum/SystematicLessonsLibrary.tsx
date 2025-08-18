import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Play, 
  Download, 
  Search, 
  Clock, 
  Target, 
  Sparkles,
  ExternalLink,
  FileText,
  Users,
  Presentation
} from 'lucide-react';
import { curriculumService, type SystematicLesson, type CurriculumLevel } from '@/services/curriculumService';
import { useToast } from '@/hooks/use-toast';
import { SlideGenerationControls } from './SlideGenerationControls';

interface SystematicLessonsLibraryProps {
  onSelectLesson?: (lesson: SystematicLesson) => void;
  onOpenInClassroom?: (lesson: SystematicLesson) => void;
  isClassroomMode?: boolean;
}

export function SystematicLessonsLibrary({ 
  onSelectLesson, 
  onOpenInClassroom, 
  isClassroomMode = false 
}: SystematicLessonsLibraryProps) {
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [allLessons, setAllLessons] = useState<SystematicLesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<SystematicLesson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLessonsData();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [searchTerm, selectedLevel, allLessons]);

  const loadLessonsData = async () => {
    try {
      const curriculumLevels = await curriculumService.getCurriculumLevels();
      setLevels(curriculumLevels);

      // Load all lessons from all levels
      let lessonsFromAllLevels: SystematicLesson[] = [];
      for (const level of curriculumLevels) {
        const levelLessons = await curriculumService.getLessonsForLevel(level.id);
        lessonsFromAllLevels.push(
          ...levelLessons.map(lesson => ({
            ...lesson,
            level_info: level
          }))
        );
      }

      // Auto-upgrade lessons to have long interactive slide decks (14+ slides)
      if (lessonsFromAllLevels.length > 0) {
        const lessonsNeedingUpgrade = lessonsFromAllLevels.filter(lesson => 
          !lesson.slides_content?.slides || 
          lesson.slides_content.slides.length < 12 ||
          !lesson.slides_content.version || 
          lesson.slides_content.version !== '2.0'
        );
        
        if (lessonsNeedingUpgrade.length > 0) {
          toast({
            title: 'Upgrading to Extended Slide Decks',
            description: `Converting ${lessonsNeedingUpgrade.length} lessons to 14-slide interactive format...`,
            duration: 5000
          });

          try {
            const { supabase } = await import('@/integrations/supabase/client');
            await supabase.functions.invoke('ai-slide-generator', {
              body: { batch_generate: true }
            });
            
            // Reload lessons after upgrade
            setTimeout(() => {
              loadLessonsData();
            }, 5000);
          } catch (error) {
            console.log('Slide upgrade in progress, will check later');
          }
        }
      }

      // If no lessons exist yet, generate the complete curriculum
      if (lessonsFromAllLevels.length === 0 && curriculumLevels.length > 0) {
        toast({
          title: 'Building Complete Curriculum',
          description: 'Generating 360+ systematic lessons across all CEFR levels. This may take a few minutes...'
        });

        try {
          // Call the enhanced curriculum generator
          const response = await fetch('/functions/v1/curriculum-generator', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'generate_full_curriculum',
              batchSize: 15
            })
          });

          if (!response.ok) {
            throw new Error('Failed to generate curriculum');
          }

          const result = await response.json();
          
          if (result.success) {
            toast({
              title: 'Curriculum Ready!',
              description: `Successfully generated ${result.total_generated} lessons. Reloading...`
            });

            // Reload lessons after generation
            lessonsFromAllLevels = [];
            for (const level of curriculumLevels) {
              const levelLessons = await curriculumService.getLessonsForLevel(level.id);
              lessonsFromAllLevels.push(
                ...levelLessons.map(lesson => ({
                  ...lesson,
                  level_info: level
                }))
              );
            }
          } else {
            throw new Error(result.error || 'Generation failed');
          }
        } catch (generationError) {
          console.error('Curriculum generation error:', generationError);
          toast({
            title: 'Generation Error',
            description: 'Failed to generate full curriculum. Creating sample lessons instead.',
            variant: 'destructive'
          });
          
          // Fallback: create minimal sample lessons
          const diffs: Record<string, number> = { 'Pre-A1': 1, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

          for (const level of curriculumLevels.slice(0, 2)) { // Only first 2 levels for samples
            const topics = curriculumService.getCEFRTopics(level.cefr_level) || [];
            const sampleCount = Math.min(4, topics.length || 4);

            for (let i = 0; i < sampleCount; i++) {
              const lessonNum = i + 1;
              const topic = topics[i] || `Core Topic ${lessonNum}`;
              const template = curriculumService.getLessonTemplate();

              await curriculumService.createSystematicLesson({
                curriculum_level_id: level.id,
                lesson_number: lessonNum,
                title: `${level.cefr_level} Lesson ${lessonNum}: ${topic}`,
                topic,
                grammar_focus: 'Basic Grammar',
                vocabulary_set: ['word1', 'word2', 'word3', 'word4', 'word5'],
                communication_outcome: `Talk about ${topic.toLowerCase()}`,
                lesson_objectives: [
                  `Understand key vocabulary about ${topic.toLowerCase()}`,
                  `Use simple structures to discuss ${topic.toLowerCase()}`
                ],
                slides_content: template,
                activities: [],
                gamified_elements: template?.gamification ?? {},
                is_review_lesson: lessonNum % 4 === 0,
                prerequisite_lessons: [],
                difficulty_level: diffs[level.cefr_level] ?? 1,
                estimated_duration: ['B1','B2','C1','C2'].includes(level.cefr_level) ? 60 : 45,
                status: 'published'
              });
            }
          }

          // Reload with samples
          lessonsFromAllLevels = [];
          for (const level of curriculumLevels) {
            const levelLessons = await curriculumService.getLessonsForLevel(level.id);
            lessonsFromAllLevels.push(
              ...levelLessons.map(lesson => ({
                ...lesson,
                level_info: level
              }))
            );
          }
        }
      }

      setAllLessons(lessonsFromAllLevels);
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load curriculum lessons',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const filterLessons = () => {
    let filtered = [...allLessons];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.grammar_focus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.communication_outcome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(lesson => lesson.curriculum_level_id === selectedLevel);
    }

    // Sort by level order and lesson number
    filtered.sort((a, b) => {
      const levelA = levels.find(l => l.id === a.curriculum_level_id);
      const levelB = levels.find(l => l.id === b.curriculum_level_id);
      
      if (levelA && levelB) {
        if (levelA.level_order !== levelB.level_order) {
          return levelA.level_order - levelB.level_order;
        }
      }
      
      return a.lesson_number - b.lesson_number;
    });

    setFilteredLessons(filtered);
  };

  const getLevelColor = (levelName: string) => {
    if (levelName.includes('A1') || levelName.includes('Pre-A1')) return 'bg-green-100 text-green-800';
    if (levelName.includes('A2')) return 'bg-green-200 text-green-900';
    if (levelName.includes('B1')) return 'bg-blue-100 text-blue-800';
    if (levelName.includes('B2')) return 'bg-blue-200 text-blue-900';
    if (levelName.includes('C1')) return 'bg-purple-100 text-purple-800';
    if (levelName.includes('C2')) return 'bg-purple-200 text-purple-900';
    return 'bg-gray-100 text-gray-800';
  };

  const handleLessonAction = (lesson: SystematicLesson) => {
    if (isClassroomMode && onOpenInClassroom) {
      // Convert lesson to whiteboard-compatible format
      const whiteboardLesson = {
        ...lesson,
        type: 'systematic_lesson',
        contentType: 'systematic_lesson',
        slides: lesson.slides_content?.slides || [],
        whiteboard_compatible: true,
        title: lesson.title,
        level: levels.find(l => l.id === lesson.curriculum_level_id)?.cefr_level || 'B1',
        topic: lesson.topic,
        duration: lesson.estimated_duration,
        metadata: {
          learning_objectives: lesson.lesson_objectives,
          grammar_focus: lesson.grammar_focus,
          vocabulary_set: lesson.vocabulary_set,
          communication_outcome: lesson.communication_outcome,
          estimated_duration: lesson.estimated_duration,
          difficulty_level: lesson.difficulty_level
        }
      };
      onOpenInClassroom(whiteboardLesson);
    } else if (onSelectLesson) {
      const whiteboardLesson = {
        ...lesson,
        type: 'systematic_lesson',
        contentType: 'systematic_lesson',
        slides: lesson.slides_content?.slides || [],
        whiteboard_compatible: true
      };
      onSelectLesson(whiteboardLesson);
    } else {
      // Default action - open in classroom
      const classroomUrl = `/classroom?roomId=unified-classroom-1&role=teacher&name=teacher&userId=teacher-1&lesson=${lesson.id}`;
      window.open(classroomUrl, '_blank');
    }
  };

  const downloadLesson = (lesson: SystematicLesson) => {
    // Create downloadable content
    const lessonContent = {
      title: lesson.title,
      topic: lesson.topic,
      level: levels.find(l => l.id === lesson.curriculum_level_id)?.cefr_level,
      duration: lesson.estimated_duration,
      objectives: lesson.lesson_objectives,
      grammar_focus: lesson.grammar_focus,
      vocabulary: lesson.vocabulary_set,
      communication_outcome: lesson.communication_outcome,
      slides: lesson.slides_content,
      activities: lesson.activities,
      gamification: lesson.gamified_elements
    };

    const blob = new Blob([JSON.stringify(lessonContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Lesson Downloaded",
      description: `${lesson.title} has been downloaded successfully`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading curriculum lessons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Systematic Curriculum Lessons
          </h2>
          <p className="text-muted-foreground">
            {allLessons.length} lessons across {levels.length} CEFR levels
          </p>
        </div>
      </div>

      {/* Slide Generation Controls */}
      <SlideGenerationControls onSlidesGenerated={loadLessonsData} />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search lessons by title, topic, or grammar focus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Levels</option>
          {levels.map(level => (
            <option key={level.id} value={level.id}>
              {level.cefr_level} - {level.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const level = levels.find(l => l.id === lesson.curriculum_level_id);
          const slidesCount = lesson.slides_content?.slides?.length || 0;
          const activitiesCount = lesson.activities?.length || 5;
          const hasExtendedSlides = slidesCount >= 12 && lesson.slides_content?.version === '2.0';
          
          return (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Lesson {lesson.lesson_number}
                    </span>
                  </div>
                  <Badge className={getStatusColor(lesson.status)} variant="secondary">
                    {lesson.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{lesson.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {level && (
                    <Badge className={getLevelColor(level.name)}>
                      {level.cefr_level}
                    </Badge>
                  )}
                  <Badge variant="outline">{lesson.topic}</Badge>
                  {lesson.is_review_lesson && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Review
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {lesson.grammar_focus && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Grammar:</span> {lesson.grammar_focus}
                    </p>
                  )}
                  {lesson.communication_outcome && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Outcome:</span> {lesson.communication_outcome}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lesson.estimated_duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Presentation className="h-3 w-3" />
                    {slidesCount} slides
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {activitiesCount} activities
                  </div>
                </div>

                {/* Enhanced Slides Status Indicator */}
                <div className="flex items-center gap-2 flex-wrap">
                  {hasExtendedSlides ? (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
                      ✨ Extended Interactive Slides ({slidesCount} slides)
                    </Badge>
                  ) : slidesCount > 0 ? (
                    <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs">
                      📊 Basic Slides ({slidesCount} slides) - Upgrading...
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-300 text-xs">
                      🔄 Generating Slides...
                    </Badge>
                  )}
                </div>

                {lesson.vocabulary_set && lesson.vocabulary_set.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {lesson.vocabulary_set.slice(0, 3).map((word: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {word}
                      </Badge>
                    ))}
                    {lesson.vocabulary_set.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{lesson.vocabulary_set.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleLessonAction(lesson)}
                  >
                    {isClassroomMode ? (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Use Lesson
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open in Classroom
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadLesson(lesson)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No lessons found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedLevel !== 'all' 
              ? 'Try adjusting your search criteria or filters'
              : 'No systematic lessons have been generated yet. Use the Curriculum Architect to create lessons.'
            }
          </p>
        </div>
      )}
    </div>
  );
}