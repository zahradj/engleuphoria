import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Users, Clock, Award } from 'lucide-react';
import { studentProgressService, StudentLessonProgress, LessonContent } from '@/services/studentProgressService';

interface LibraryContentProps {
  onLessonSelect?: (lesson: LessonContent) => void;
}

export function LibraryContent({ onLessonSelect }: LibraryContentProps) {
  const [studentProgress, setStudentProgress] = useState<StudentLessonProgress | null>(null);
  const [availableLessons, setAvailableLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);

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
            {availableLessons.map((lesson) => (
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
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{lesson.topic}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration_minutes}m
                    </span>
                    <span>Module {lesson.module_number}</span>
                    <span>Lesson {lesson.lesson_number}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleSelectLesson(lesson)}
                >
                  Start
                </Button>
              </div>
            ))}
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
    </div>
  );
}