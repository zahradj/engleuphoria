import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw, Library } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LevelFilter } from './LevelFilter';
import { AgeGroupTabs } from './AgeGroupTabs';
import { LessonLibraryGrid } from './LessonLibraryGrid';
import { AddLessonModal } from './AddLessonModal';
import { LessonPreviewModal } from './LessonPreviewModal';

interface Lesson {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  age_group: string;
  sequence_number: number | null;
  duration_minutes: number | null;
  status: string;
  learning_objectives: string[] | null;
  created_at: string;
}

export const CurriculumLibrary: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState('Pre-A1');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('5-7');
  const [searchQuery, setSearchQuery] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [nextSequence, setNextSequence] = useState(1);

  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('interactive_lessons')
        .select('id, title, topic, cefr_level, age_group, sequence_number, duration_minutes, status, learning_objectives, created_at')
        .eq('cefr_level', selectedLevel)
        .eq('age_group', selectedAgeGroup)
        .order('sequence_number', { ascending: true, nullsFirst: false });

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,topic.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLessons(data || []);
      
      // Calculate next sequence number
      const maxSeq = Math.max(0, ...(data || []).map(l => l.sequence_number || 0));
      setNextSequence(maxSeq + 1);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to fetch lessons');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLevel, selectedAgeGroup, searchQuery]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handlePreview = (lesson: Lesson) => {
    setPreviewLesson(lesson);
  };

  const handleEdit = (lesson: Lesson) => {
    // Navigate to lesson editor
    window.open(`/admin?tab=interactive-lessons&edit=${lesson.id}`, '_blank');
  };

  const lessonCount = lessons.length;
  const publishedCount = lessons.filter(l => l.status === 'published').length;
  const draftCount = lessons.filter(l => l.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Library className="h-6 w-6" />
            Curriculum Library
          </h1>
          <p className="text-muted-foreground">
            Manage and organize lessons by level and age group
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{lessonCount}</div>
            <p className="text-xs text-muted-foreground">Total Lessons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600">{draftCount}</div>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filter */}
        <Card className="lg:w-56 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <LevelFilter 
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
            />
          </CardContent>
        </Card>

        {/* Main Area */}
        <div className="flex-1 space-y-4">
          {/* Age Group Tabs */}
          <AgeGroupTabs
            selectedAgeGroup={selectedAgeGroup}
            onAgeGroupChange={setSelectedAgeGroup}
          />

          {/* Search and Refresh */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchLessons}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Lesson Grid */}
          <LessonLibraryGrid
            lessons={lessons}
            isLoading={isLoading}
            onPreview={handlePreview}
            onEdit={handleEdit}
          />
        </div>
      </div>

      {/* Modals */}
      <AddLessonModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        selectedLevel={selectedLevel}
        selectedAgeGroup={selectedAgeGroup}
        nextSequence={nextSequence}
        onSuccess={fetchLessons}
      />

      <LessonPreviewModal
        open={!!previewLesson}
        onOpenChange={(open) => !open && setPreviewLesson(null)}
        lesson={previewLesson}
      />
    </div>
  );
};
