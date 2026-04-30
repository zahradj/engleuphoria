import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Eye, Rocket, Search, BookOpen, Loader2 } from 'lucide-react';
import { AssignLessonModal } from './AssignLessonModal';
import { useNavigate } from 'react-router-dom';

interface AiLesson {
  id: string;
  title: string | null;
  topic: string;
  level: string;
  age_range: string | null;
  status: string | null;
  created_at: string;
  script: any;
}

const hubFromAgeRange = (ageRange: string | null): { label: string; color: string } => {
  if (!ageRange) return { label: 'General', color: 'bg-muted text-muted-foreground' };
  const lower = ageRange.toLowerCase();
  if (lower.includes('kid') || lower.includes('5') || lower.includes('6') || lower.includes('7') || lower.includes('8') || lower.includes('9') || lower.includes('playground'))
    return { label: 'Playground', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' };
  if (lower.includes('teen') || lower.includes('10') || lower.includes('11') || lower.includes('12') || lower.includes('13') || lower.includes('14') || lower.includes('academy'))
    return { label: 'Academy', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' };
  return { label: 'Success Hub', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' };
};

export const TeacherLessonLibrary: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [assignLesson, setAssignLesson] = useState<AiLesson | null>(null);

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['teacher-lessons-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_lessons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data && data.length > 0 ? data : null) as AiLesson[] | null;
    },
    enabled: !!user?.id,
  });

  const DUMMY_LESSONS: AiLesson[] = [
    { id: 'dummy-1', title: 'Present Simple Mastery', topic: 'Grammar', level: 'A2', age_range: 'academy', status: 'published', created_at: new Date().toISOString(), script: [{},{},{},{},{},{}] },
    { id: 'dummy-2', title: 'Business Negotiations', topic: 'Speaking', level: 'B2', age_range: 'professional', status: 'published', created_at: new Date().toISOString(), script: [{},{},{},{},{},{},{},{}] },
    { id: 'dummy-3', title: 'Animal Friends', topic: 'Vocabulary', level: 'Pre-A1', age_range: 'playground', status: 'published', created_at: new Date().toISOString(), script: [{},{},{},{},{}] },
    { id: 'dummy-4', title: 'Past Tense Adventures', topic: 'Grammar', level: 'B1', age_range: 'academy', status: 'published', created_at: new Date().toISOString(), script: [{},{},{},{},{},{},{}] },
  ];

  const displayLessons = lessons || DUMMY_LESSONS;

  const filtered = displayLessons.filter(l =>
    (l.title || l.topic).toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">📚 My Lesson Library</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {lessons?.length || 0} lessons created
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {search ? 'No lessons match your search.' : 'No lessons yet. Create one in the Content Creator Studio!'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(lesson => {
            const hub = hubFromAgeRange(lesson.age_range);
            const slideCount = Array.isArray(lesson.script) ? lesson.script.length : 0;

            return (
              <Card
                key={lesson.id}
                className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                {/* Thumbnail placeholder */}
                <div className="h-36 bg-gradient-to-br from-primary/10 via-accent/5 to-muted flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary/40" />
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-2 text-sm">
                      {lesson.title || lesson.topic}
                    </h3>
                    <Badge variant="secondary" className={`shrink-0 text-xs ${hub.color}`}>
                      {hub.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Level: {lesson.level}</span>
                    <span>•</span>
                    <span>{slideCount} slides</span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created {new Date(lesson.created_at).toLocaleDateString()}
                  </p>
                </CardContent>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => navigate(`/content-creator?edit=${lesson.id}`)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setAssignLesson(lesson)}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    Assign
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Assign Modal */}
      {assignLesson && (
        <AssignLessonModal
          lesson={assignLesson}
          onClose={() => setAssignLesson(null)}
        />
      )}
    </div>
  );
};
