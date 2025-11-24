import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Award, Play } from "lucide-react";
import { interactiveLessonProgressService, type LessonWithProgress } from '@/services/interactiveLessonProgressService';
import { ProgressRing } from '@/components/ui/ProgressRing';

interface CleanStudentDashboardProps {
  studentName: string;
  studentProfile?: any;
  studentId: string;
}

export const CleanStudentDashboard = ({ studentName, studentProfile, studentId }: CleanStudentDashboardProps) => {
  const [currentLesson, setCurrentLesson] = useState<LessonWithProgress | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentLesson = async () => {
      const lessons = await interactiveLessonProgressService.getStudentLessonLibrary(studentId);
      const inProgress = lessons.find(l => l.progress?.lesson_status === 'in_progress');
      setCurrentLesson(inProgress || null);
    };
    fetchCurrentLesson();
  }, [studentId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {studentName}!</h2>
        <p className="text-muted-foreground">Track your learning progress and achievements</p>
      </div>

      {/* Current Lesson in Progress Card */}
      {currentLesson && (
        <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{currentLesson.lesson.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentLesson.lesson.topic}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Progress: </span>
                    <span className="font-semibold text-primary">
                      {currentLesson.progress?.completion_percentage}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Slides: </span>
                    <span className="font-semibold">
                      {currentLesson.progress?.completed_slides}/{currentLesson.progress?.total_slides}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing 
                  percentage={currentLesson.progress?.completion_percentage || 0} 
                  size={80}
                  strokeWidth={6}
                />
                <Button 
                  size="lg"
                  onClick={() => navigate(`/interactive-lesson/${currentLesson.lesson.id}?mode=student&studentId=${studentId}`)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Start your learning journey</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Keep practicing!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Unlock achievements</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
