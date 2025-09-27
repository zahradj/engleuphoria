import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Users, Clock, Award, RotateCcw } from 'lucide-react';
import { studentProgressService, StudentLessonProgress, LessonContent } from '@/services/studentProgressService';
import { LessonRegistry, LessonCompletionData } from '@/services/lessonRegistry';
import { LessonManager } from './LessonManager';

interface LibraryContentProps {
  onLessonSelect?: (lesson: LessonContent) => void;
  onAwardPoints?: (points: number, reason: string) => void;
}

export function LibraryContent({ onLessonSelect, onAwardPoints }: LibraryContentProps) {
  const [studentProgress, setStudentProgress] = useState<StudentLessonProgress | null>(null);
  const [availableLessons, setAvailableLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{moduleNumber: number, lessonNumber: number, title: string} | null>(null);
  const [studentId, setStudentId] = useState<string>('demo-student-123');

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      
      // Extract student ID from context
      const studentId = studentProgressService.extractStudentIdFromContext();
      
      if (studentId) {
        // Get student progress
        const progress = await studentProgressService.getStudentProgress(studentId);
        setStudentProgress(progress);

        // Get current lesson if progress exists
        if (progress) {
          const lesson = await studentProgressService.getLessonContent(
            progress.current_week, 
            progress.current_lesson
          );
          setCurrentLesson(lesson);
        }
      }

      // Get all available lessons
      const lessons = await studentProgressService.getAllLessons();
      setAvailableLessons(lessons);
      
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLesson = () => {
    if (currentLesson && onLessonSelect) {
      onLessonSelect(currentLesson);
    }
  };

  const handleSelectLesson = (lesson: LessonContent) => {
    if (onLessonSelect) {
      onLessonSelect(lesson);
    }
  };

  const handleStartLesson = (moduleNumber: number, lessonNumber: number, title: string) => {
    setSelectedLesson({ moduleNumber, lessonNumber, title });
  };

  const handleLessonComplete = (data: LessonCompletionData) => {
    // Award XP points
    const staticLesson = LessonRegistry.getLesson(data.moduleNumber, data.lessonNumber);
    const xpReward = staticLesson?.xpReward || 15;
    
    onAwardPoints?.(xpReward, `Completed Module ${data.moduleNumber}, Lesson ${data.lessonNumber}`);
    
    // Refresh progress data
    loadLibraryData();
    setSelectedLesson(null);
  };

  // Extract student context from URL for teacher mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get('userId');
    const explicitStudentId = urlParams.get('studentId');
    
    if (explicitStudentId) {
      setStudentId(explicitStudentId);
    } else if (userIdParam?.includes('teacher')) {
      // Teacher viewing student progress - use demo student for now
      setStudentId('demo-student-123');
    } else {
      setStudentId(userIdParam || 'demo-student-123');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Student Progress Section */}
      {studentProgress && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Student Progress</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{studentProgress.completion_percentage}%</span>
              </div>
              <Progress value={studentProgress.completion_percentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Week:</span>
                <div className="font-medium">Week {studentProgress.current_week}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Current Lesson:</span>
                <div className="font-medium">Lesson {studentProgress.current_lesson}</div>
              </div>
            </div>

            {currentLesson && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{currentLesson.title}</h4>
                    <p className="text-xs text-muted-foreground">{currentLesson.topic}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleContinueLesson}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Lesson Library Section */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Lesson Library</h3>
        </div>

        {availableLessons.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No lessons available</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {availableLessons.map((lesson) => {
              const moduleNum = lesson.module_number || 1;
              const lessonNum = lesson.lesson_number || 1;
              const isStaticLesson = LessonRegistry.hasStaticLesson(moduleNum, lessonNum);
              const staticMeta = LessonRegistry.getLesson(moduleNum, lessonNum);
              
              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{lesson.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {lesson.cefr_level}
                      </Badge>
                      {isStaticLesson && (
                        <Badge variant="default" className="text-xs">Interactive</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{lesson.topic}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {staticMeta?.estimatedDuration || lesson.duration_minutes}m
                      </span>
                      <span>Module {moduleNum}</span>
                      <span>Lesson {lessonNum}</span>
                      {staticMeta && (
                        <Badge variant="outline" className="text-xs">
                          +{staticMeta.xpReward} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSelectLesson(lesson)}
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleSelectLesson(lesson)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Award className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse by CEFR Level
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Clock className="h-4 w-4 mr-2" />
            Recent Lessons
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Award className="h-4 w-4 mr-2" />
            Student Achievements
          </Button>
        </div>
      </Card>

      {/* Lesson Manager Modal */}
      {selectedLesson && (
        <LessonManager
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          moduleNumber={selectedLesson.moduleNumber}
          lessonNumber={selectedLesson.lessonNumber}
          lessonTitle={selectedLesson.title}
          studentId={studentId}
          onComplete={handleLessonComplete}
          onFullscreen={(moduleNumber, lessonNumber) => {
            // TODO: Integrate with UnifiedContentViewer for fullscreen mode
            console.log('Fullscreen lesson requested:', moduleNumber, lessonNumber);
          }}
        />
      )}
    </div>
  );
}