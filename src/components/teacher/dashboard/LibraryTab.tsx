import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Save, Eye, Edit, Trash2, Clock, Users, Target } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  topic: string;
  cefrLevel: string;
  duration: number;
  learningObjectives: string[];
  vocabularyFocus: string[];
  grammarFocus: string[];
  description: string;
  difficultyLevel: string;
  createdAt: Date;
  status: 'draft' | 'published';
}

export const LibraryTab = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    cefrLevel: 'A1',
    duration: 60,
    learningObjectives: '',
    vocabularyFocus: '',
    grammarFocus: '',
    description: '',
    difficultyLevel: 'beginner'
  });

  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const difficultyLevels = ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced'];

  const resetForm = () => {
    setFormData({
      title: '',
      topic: '',
      cefrLevel: 'A1',
      duration: 60,
      learningObjectives: '',
      vocabularyFocus: '',
      grammarFocus: '',
      description: '',
      difficultyLevel: 'beginner'
    });
    setShowCreateForm(false);
    setEditingLesson(null);
  };

  const handleSaveLesson = () => {
    if (!formData.title || !formData.topic) {
      toast.error("Please fill in required fields");
      return;
    }

    const lessonData: Lesson = {
      id: editingLesson?.id || `lesson_${Date.now()}`,
      title: formData.title,
      topic: formData.topic,
      cefrLevel: formData.cefrLevel,
      duration: formData.duration,
      learningObjectives: formData.learningObjectives.split(',').map(obj => obj.trim()).filter(obj => obj),
      vocabularyFocus: formData.vocabularyFocus.split(',').map(word => word.trim()).filter(word => word),
      grammarFocus: formData.grammarFocus.split(',').map(grammar => grammar.trim()).filter(grammar => grammar),
      description: formData.description,
      difficultyLevel: formData.difficultyLevel,
      createdAt: editingLesson?.createdAt || new Date(),
      status: 'draft'
    };

    if (editingLesson) {
      setLessons(lessons.map(lesson => lesson.id === editingLesson.id ? lessonData : lesson));
      toast.success("Lesson updated successfully");
    } else {
      setLessons([...lessons, lessonData]);
      toast.success("Lesson created successfully");
    }

    resetForm();
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      topic: lesson.topic,
      cefrLevel: lesson.cefrLevel,
      duration: lesson.duration,
      learningObjectives: lesson.learningObjectives.join(', '),
      vocabularyFocus: lesson.vocabularyFocus.join(', '),
      grammarFocus: lesson.grammarFocus.join(', '),
      description: lesson.description,
      difficultyLevel: lesson.difficultyLevel
    });
    setShowCreateForm(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    toast.success("Lesson deleted successfully");
  };

  const handlePublishLesson = (lessonId: string) => {
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, status: lesson.status === 'published' ? 'draft' : 'published' as const }
        : lesson
    ));
    const lesson = lessons.find(l => l.id === lessonId);
    toast.success(`Lesson ${lesson?.status === 'published' ? 'unpublished' : 'published'} successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lesson Library</h2>
          <p className="text-muted-foreground">Create and manage your custom lessons</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Lesson
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter lesson title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Enter lesson topic"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cefrLevel">CEFR Level</Label>
                <Select 
                  value={formData.cefrLevel} 
                  onValueChange={(value) => setFormData({ ...formData, cefrLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cefrLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                  min="15"
                  max="180"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select 
                  value={formData.difficultyLevel} 
                  onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this lesson covers..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningObjectives">Learning Objectives (comma separated)</Label>
              <Textarea
                id="learningObjectives"
                value={formData.learningObjectives}
                onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                placeholder="Students will be able to..., Students will learn..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vocabularyFocus">Vocabulary Focus (comma separated)</Label>
                <Textarea
                  id="vocabularyFocus"
                  value={formData.vocabularyFocus}
                  onChange={(e) => setFormData({ ...formData, vocabularyFocus: e.target.value })}
                  placeholder="family, house, colors..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grammarFocus">Grammar Focus (comma separated)</Label>
                <Textarea
                  id="grammarFocus"
                  value={formData.grammarFocus}
                  onChange={(e) => setFormData({ ...formData, grammarFocus: e.target.value })}
                  placeholder="present simple, articles, prepositions..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSaveLesson} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingLesson ? 'Update Lesson' : 'Save Lesson'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {lessons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-muted rounded-full">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No lessons yet</h3>
                  <p className="text-muted-foreground">Create your first lesson to get started</p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Your First Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{lesson.title}</h3>
                        <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                        <Badge variant="outline">{lesson.cefrLevel}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{lesson.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {lesson.duration} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {lesson.difficultyLevel}
                        </div>
                      </div>

                      {lesson.learningObjectives.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Learning Objectives:</p>
                          <div className="flex flex-wrap gap-1">
                            {lesson.learningObjectives.slice(0, 3).map((objective, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {objective}
                              </Badge>
                            ))}
                            {lesson.learningObjectives.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{lesson.learningObjectives.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4">
                        {lesson.vocabularyFocus.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Vocabulary:</p>
                            <div className="flex flex-wrap gap-1">
                              {lesson.vocabularyFocus.slice(0, 3).map((word, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {word}
                                </Badge>
                              ))}
                              {lesson.vocabularyFocus.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{lesson.vocabularyFocus.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {lesson.grammarFocus.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Grammar:</p>
                            <div className="flex flex-wrap gap-1">
                              {lesson.grammarFocus.slice(0, 3).map((grammar, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {grammar}
                                </Badge>
                              ))}
                              {lesson.grammarFocus.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{lesson.grammarFocus.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditLesson(lesson)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={lesson.status === 'published' ? 'secondary' : 'default'}
                        onClick={() => handlePublishLesson(lesson.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        {lesson.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};