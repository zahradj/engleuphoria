import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Plus, Edit, Trash2, Eye, Presentation } from 'lucide-react';
import { toast } from 'sonner';
import { SlideDeckManager } from '@/components/curriculum/SlideDeckManager';

interface LessonContent {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  difficulty_level: string;
  module_number: number;
  lesson_number: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  learning_objectives?: string[];
}

export const LibraryManager = () => {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonContent | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingLesson, setViewingLesson] = useState<LessonContent | null>(null);
  const [isSlideDeckOpen, setIsSlideDeckOpen] = useState(false);
  const [managingLessonId, setManagingLessonId] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    topic: '',
    cefr_level: 'A1',
    difficulty_level: 'beginner',
    module_number: 1,
    lesson_number: 1,
    duration_minutes: 60,
    learning_objectives: '',
  });

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .order('module_number', { ascending: true })
        .order('lesson_number', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async () => {
    try {
      const { error } = await supabase
        .from('lessons_content')
        .insert({
          title: newLesson.title,
          topic: newLesson.topic,
          cefr_level: newLesson.cefr_level,
          difficulty_level: newLesson.difficulty_level,
          module_number: newLesson.module_number,
          lesson_number: newLesson.lesson_number,
          duration_minutes: newLesson.duration_minutes,
          learning_objectives: newLesson.learning_objectives.split(',').map(obj => obj.trim()),
          slides_content: {},
          is_active: true,
        });

      if (error) throw error;
      
      toast.success('Lesson created successfully');
      setIsCreateOpen(false);
      setNewLesson({
        title: '',
        topic: '',
        cefr_level: 'A1',
        difficulty_level: 'beginner',
        module_number: 1,
        lesson_number: 1,
        duration_minutes: 60,
        learning_objectives: '',
      });
      fetchLessons();
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson');
    }
  };

  const toggleLessonStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lessons_content')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Lesson ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchLessons();
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast.error('Failed to update lesson');
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const { error } = await supabase
        .from('lessons_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Lesson deleted successfully');
      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  };

  const openEditDialog = (lesson: LessonContent) => {
    setEditingLesson(lesson);
    setNewLesson({
      title: lesson.title,
      topic: lesson.topic,
      cefr_level: lesson.cefr_level,
      difficulty_level: lesson.difficulty_level,
      module_number: lesson.module_number,
      lesson_number: lesson.lesson_number,
      duration_minutes: lesson.duration_minutes,
      learning_objectives: lesson.learning_objectives?.join(', ') || '',
    });
    setIsEditOpen(true);
  };

  const updateLesson = async () => {
    if (!editingLesson) return;

    try {
      const { error } = await supabase
        .from('lessons_content')
        .update({
          title: newLesson.title,
          topic: newLesson.topic,
          cefr_level: newLesson.cefr_level,
          difficulty_level: newLesson.difficulty_level,
          module_number: newLesson.module_number,
          lesson_number: newLesson.lesson_number,
          duration_minutes: newLesson.duration_minutes,
          learning_objectives: newLesson.learning_objectives.split(',').map(obj => obj.trim()),
        })
        .eq('id', editingLesson.id);

      if (error) throw error;
      
      toast.success('Lesson updated successfully');
      setIsEditOpen(false);
      setEditingLesson(null);
      setNewLesson({
        title: '',
        topic: '',
        cefr_level: 'A1',
        difficulty_level: 'beginner',
        module_number: 1,
        lesson_number: 1,
        duration_minutes: 60,
        learning_objectives: '',
      });
      fetchLessons();
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
    }
  };

  const openViewDialog = (lesson: LessonContent) => {
    setViewingLesson(lesson);
    setIsViewOpen(true);
  };

  const openSlideDeckManager = (lessonId: string) => {
    setManagingLessonId(lessonId);
    setIsSlideDeckOpen(true);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-muted-foreground">Loading library...</div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Classroom Library
            </CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Lesson</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                        placeholder="Lesson title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Topic</label>
                      <Input
                        value={newLesson.topic}
                        onChange={(e) => setNewLesson({...newLesson, topic: e.target.value})}
                        placeholder="Lesson topic"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">CEFR Level</label>
                      <Select value={newLesson.cefr_level} onValueChange={(value) => setNewLesson({...newLesson, cefr_level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1</SelectItem>
                          <SelectItem value="A2">A2</SelectItem>
                          <SelectItem value="B1">B1</SelectItem>
                          <SelectItem value="B2">B2</SelectItem>
                          <SelectItem value="C1">C1</SelectItem>
                          <SelectItem value="C2">C2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={newLesson.difficulty_level} onValueChange={(value) => setNewLesson({...newLesson, difficulty_level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Duration (min)</label>
                      <Input
                        type="number"
                        value={newLesson.duration_minutes}
                        onChange={(e) => setNewLesson({...newLesson, duration_minutes: parseInt(e.target.value) || 60})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Module Number</label>
                      <Input
                        type="number"
                        value={newLesson.module_number}
                        onChange={(e) => setNewLesson({...newLesson, module_number: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Lesson Number</label>
                      <Input
                        type="number"
                        value={newLesson.lesson_number}
                        onChange={(e) => setNewLesson({...newLesson, lesson_number: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Learning Objectives (comma-separated)</label>
                    <Textarea
                      value={newLesson.learning_objectives}
                      onChange={(e) => setNewLesson({...newLesson, learning_objectives: e.target.value})}
                      placeholder="Objective 1, Objective 2, Objective 3"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createLesson} disabled={!newLesson.title || !newLesson.topic}>
                      Create Lesson
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module.Lesson</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No lessons found
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        {lesson.module_number}.{lesson.lesson_number}
                      </TableCell>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>{lesson.topic}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lesson.cefr_level}</Badge>
                      </TableCell>
                      <TableCell>{lesson.duration_minutes}min</TableCell>
                      <TableCell>
                        <Badge variant={lesson.is_active ? "default" : "secondary"}>
                          {lesson.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(lesson.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => openViewDialog(lesson)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openSlideDeckManager(lesson.id)}>
                            <Presentation className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(lesson)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={lesson.is_active ? "secondary" : "default"}
                            size="sm"
                            onClick={() => toggleLessonStatus(lesson.id, lesson.is_active)}
                          >
                            {lesson.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteLesson(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                  placeholder="Lesson title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Topic</label>
                <Input
                  value={newLesson.topic}
                  onChange={(e) => setNewLesson({...newLesson, topic: e.target.value})}
                  placeholder="Lesson topic"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">CEFR Level</label>
                <Select value={newLesson.cefr_level} onValueChange={(value) => setNewLesson({...newLesson, cefr_level: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={newLesson.difficulty_level} onValueChange={(value) => setNewLesson({...newLesson, difficulty_level: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Duration (min)</label>
                <Input
                  type="number"
                  value={newLesson.duration_minutes}
                  onChange={(e) => setNewLesson({...newLesson, duration_minutes: parseInt(e.target.value) || 60})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Module Number</label>
                <Input
                  type="number"
                  value={newLesson.module_number}
                  onChange={(e) => setNewLesson({...newLesson, module_number: parseInt(e.target.value) || 1})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Lesson Number</label>
                <Input
                  type="number"
                  value={newLesson.lesson_number}
                  onChange={(e) => setNewLesson({...newLesson, lesson_number: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Learning Objectives (comma-separated)</label>
              <Textarea
                value={newLesson.learning_objectives}
                onChange={(e) => setNewLesson({...newLesson, learning_objectives: e.target.value})}
                placeholder="Objective 1, Objective 2, Objective 3"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateLesson} disabled={!newLesson.title || !newLesson.topic}>
                Update Lesson
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Lesson Details</DialogTitle>
          </DialogHeader>
          {viewingLesson && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-sm font-medium">{viewingLesson.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Topic</label>
                  <p className="text-sm">{viewingLesson.topic}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CEFR Level</label>
                  <Badge variant="outline">{viewingLesson.cefr_level}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                  <p className="text-sm capitalize">{viewingLesson.difficulty_level}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-sm">{viewingLesson.duration_minutes} minutes</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Module</label>
                  <p className="text-sm">{viewingLesson.module_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lesson</label>
                  <p className="text-sm">{viewingLesson.lesson_number}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={viewingLesson.is_active ? "default" : "secondary"} className="ml-2">
                  {viewingLesson.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Learning Objectives</label>
                <div className="mt-1">
                  {viewingLesson.learning_objectives && viewingLesson.learning_objectives.length > 0 ? (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {viewingLesson.learning_objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No learning objectives defined</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(viewingLesson.created_at).toLocaleString()}</p>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Slide Deck Manager Dialog */}
      <Dialog open={isSlideDeckOpen} onOpenChange={setIsSlideDeckOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Lesson Slides</DialogTitle>
          </DialogHeader>
          {managingLessonId && (
            <SlideDeckManager 
              lessonId={managingLessonId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};