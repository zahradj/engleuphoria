import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  BookOpen, 
  Clock, 
  Target, 
  Award,
  CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CurrentLessonCardProps {
  lesson: {
    id: string;
    title: string;
    topic: string;
    module_number: number;
    lesson_number: number;
    cefr_level: string;
    learning_objectives: string[];
    duration_minutes: number;
    difficulty_level: string;
  } | null;
  progress?: {
    currentWeek: number;
    currentLesson: number;
    totalLessons: number;
    completionPercentage: number;
  };
  loading?: boolean;
}

export function CurrentLessonCard({ lesson, progress, loading }: CurrentLessonCardProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="border border-border bg-white shadow-card">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!lesson) {
    return (
      <Card className="border border-border bg-white shadow-card">
        <CardHeader className="bg-gradient-to-r from-sky-blue/20 to-lavender/20 border-b border-border-light">
          <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-sky-blue-dark" />
            Start Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-text-muted mb-6">
            Take the placement test to get started with personalized lessons
          </p>
          <Button 
            onClick={() => navigate('/placement-test')}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Take Placement Test
            <Target className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = progress?.completionPercentage || 0;
  const xpReward = lesson.duration_minutes * 10;

  return (
    <Card className="border border-border bg-white shadow-card overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-sky-blue via-lavender to-mint-green border-b border-border-light">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white text-sky-blue-dark border-sky-blue">
                {lesson.cefr_level}
              </Badge>
              <Badge variant="outline" className="bg-white/50">
                Lesson {lesson.lesson_number}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-text mb-1">
              {lesson.title}
            </CardTitle>
            <p className="text-text-muted">{lesson.topic}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-peach-dark" />
                <span className="text-sm font-semibold text-text">{xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Progress Bar */}
        {progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Module {lesson.module_number} Progress
              </span>
              <span className="text-text font-medium">
                {progress.currentLesson} of {progress.totalLessons} lessons
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Learning Objectives */}
        <div>
          <h4 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-sky-blue-dark" />
            Learning Objectives
          </h4>
          <ul className="space-y-2">
            {lesson.learning_objectives.slice(0, 3).map((objective, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
                <CheckCircle className="h-4 w-4 text-mint-green-dark mt-0.5 flex-shrink-0" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lesson Info */}
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2 bg-surface-soft px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration_minutes} minutes</span>
          </div>
          <Badge 
            variant="outline" 
            className={
              lesson.difficulty_level === 'easy' 
                ? 'bg-success-bg text-success border-success' 
                : lesson.difficulty_level === 'medium'
                ? 'bg-warning-bg text-warning border-warning'
                : 'bg-destructive-bg text-destructive border-destructive'
            }
          >
            {lesson.difficulty_level}
          </Badge>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => navigate(`/lesson/${lesson.id}`)}
          className="w-full bg-gradient-to-r from-sky-blue-dark to-mint-green-dark text-white hover:opacity-90 shadow-lg py-6 text-base font-semibold"
        >
          Continue Learning
          <Play className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
