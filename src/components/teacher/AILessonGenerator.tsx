import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, FileText, Presentation, Brain, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface AILessonData {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  age_group: string;
  duration_minutes: number;
  generation_status: string;
  created_at: string;
  artifacts: Array<{
    id: string;
    artifact_type: string;
    title: string;
    content?: string;
    file_type: string;
  }>;
}

export function AILessonGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLessons, setGeneratedLessons] = useState<AILessonData[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [cefrLevel, setCefrLevel] = useState('A2');
  const [ageGroup, setAgeGroup] = useState('9-10');
  const [duration, setDuration] = useState(45);
  const [objectives, setObjectives] = useState('');
  const [activities, setActivities] = useState('');

  useEffect(() => {
    fetchGeneratedLessons();
    
    // Set up real-time subscription for lesson updates
    const channel = supabase
      .channel('ai-lesson-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_lessons',
          filter: `teacher_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('📡 Lesson update received:', payload);
          fetchGeneratedLessons();
          
          if (payload.eventType === 'UPDATE' && payload.new.generation_status === 'completed') {
            toast({
              title: "Lesson Generated! ✨",
              description: `"${payload.new.title}" is ready with slides, worksheet, quiz, and teacher guide.`,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  const fetchGeneratedLessons = async () => {
    if (!user?.id) return;
    
    try {
      const { data: lessons, error } = await supabase
        .from('ai_lessons')
        .select(`
          *,
          artifacts:ai_lesson_artifacts(*)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGeneratedLessons(lessons || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!user?.id || !title || !topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-multigen', {
        body: {
          teacher_id: user.id,
          title,
          topic,
          cefr_level: cefrLevel,
          age_group: ageGroup,
          duration_minutes: duration,
          objectives: objectives.split('\n').filter(o => o.trim()),
          activities: activities.split('\n').filter(a => a.trim())
        }
      });

      if (error) throw error;

      toast({
        title: "Generation Started! 🚀",
        description: "Your lesson materials are being generated. This takes 2-3 minutes.",
        duration: 5000,
      });

      // Clear form
      setTitle('');
      setTopic('');
      setObjectives('');
      setActivities('');
      
      // Refresh the list
      fetchGeneratedLessons();

    } catch (error) {
      console.error('Error generating lesson:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to start lesson generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'generating':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Loader2 className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePreviewArtifact = (artifact: any) => {
    // Create blob and open in new tab for preview
    const blob = new Blob([artifact.content], { 
      type: artifact.file_type === 'html' ? 'text/html' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Lesson Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Professions and Jobs"
              />
            </div>
            
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Different professions, job descriptions"
              />
            </div>
            
            <div>
              <Label htmlFor="cefr">CEFR Level</Label>
              <Select value={cefrLevel} onValueChange={setCefrLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 - Beginner</SelectItem>
                  <SelectItem value="A2">A2 - Elementary</SelectItem>
                  <SelectItem value="B1">B1 - Intermediate</SelectItem>
                  <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="age">Age Group</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-8">6-8 years</SelectItem>
                  <SelectItem value="9-10">9-10 years</SelectItem>
                  <SelectItem value="11-12">11-12 years</SelectItem>
                  <SelectItem value="13-15">13-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="objectives">Learning Objectives (one per line)</Label>
            <Textarea
              id="objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Learn 10 job vocabulary words&#10;Use 'What does a [job] do?' structure&#10;Practice relative clauses with who/that"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="activities">Activities (one per line)</Label>
            <Textarea
              id="activities"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Matching jobs to descriptions&#10;Role-play job interviews&#10;Fill in the blanks with job vocabulary"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !title || !topic}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Materials...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate All Materials
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : generatedLessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No lessons generated yet. Create your first AI-powered lesson above!
            </div>
          ) : (
            <div className="space-y-4">
              {generatedLessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{lesson.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {lesson.topic} • {lesson.cefr_level} • {lesson.age_group} years • {lesson.duration_minutes} min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(lesson.generation_status)}
                      <Badge className={getStatusColor(lesson.generation_status)}>
                        {lesson.generation_status}
                      </Badge>
                    </div>
                  </div>
                  
                  {lesson.generation_status === 'completed' && lesson.artifacts.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {lesson.artifacts.map((artifact) => (
                        <Button
                          key={artifact.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewArtifact(artifact)}
                          className="flex items-center gap-2"
                        >
                          {artifact.artifact_type === 'slides' && <Presentation className="h-4 w-4" />}
                          {artifact.artifact_type === 'worksheet' && <FileText className="h-4 w-4" />}
                          {artifact.artifact_type === 'quiz' && <Brain className="h-4 w-4" />}
                          {artifact.artifact_type === 'teacher_guide' && <BookOpen className="h-4 w-4" />}
                          {artifact.artifact_type === 'slides' && 'Slides'}
                          {artifact.artifact_type === 'worksheet' && 'Worksheet'}
                          {artifact.artifact_type === 'quiz' && 'Quiz'}
                          {artifact.artifact_type === 'teacher_guide' && 'Guide'}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {lesson.generation_status === 'generating' && (
                    <div className="flex items-center gap-2 text-blue-600 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating slides, worksheet, quiz, and teacher guide...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}