import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Search, Filter, Clock, Users, Star, Eye, Play, UserPlus } from "lucide-react";
import { LessonCreatorModal } from "./lesson-creator/LessonCreatorModal";
import { useLibraryLessons } from "@/hooks/useLibraryLessons";
import { AgeGroup, CEFRLevel } from "@/types/curriculumExpert";
import { interactiveLessonProgressService } from "@/services/interactiveLessonProgressService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const LibraryTab = () => {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | "all">("all");
  const [selectedAge, setSelectedAge] = useState<AgeGroup | "all">("all");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const { lessons, isLoading, fetchLessons } = useLibraryLessons();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch with filters when they change
  useEffect(() => {
    fetchLessons({
      cefrLevel: selectedLevel,
      ageGroup: selectedAge,
      searchQuery
    });
  }, [selectedLevel, selectedAge, searchQuery]);

  // Fetch teacher's students
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('lessons')
        .select('student_id, student:users!lessons_student_id_fkey(id, email, user_metadata)')
        .eq('teacher_id', user.id);
      
      if (data) {
        const uniqueStudents = Array.from(
          new Map(data.map((item: any) => [
            item.student_id, 
            { 
              id: item.student_id, 
              name: item.student?.[0]?.user_metadata?.full_name || item.student?.[0]?.email?.split('@')[0] || 'Student'
            }
          ])).values()
        );
        setStudents(uniqueStudents);
      }
    };
    fetchStudents();
  }, [user?.id]);

  const handleAssignToStudent = async (lessonId: string, studentId: string) => {
    try {
      await interactiveLessonProgressService.assignLessonToStudent(
        lessonId,
        studentId,
        user?.id || ''
      );
      
      const studentName = students.find(s => s.id === studentId)?.name;
      toast({
        title: "Lesson Assigned!",
        description: `Lesson has been assigned to ${studentName}`,
      });
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Could not assign lesson. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Lesson Library
          </h2>
          <p className="text-muted-foreground mt-2">Browse and create interactive ESL lessons</p>
        </div>
        <Button 
          onClick={() => setIsCreatorOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Lesson
        </Button>
      </div>

      {/* Student Selection & Filters */}
      <Card>
        <CardContent className="pt-6">
          {/* Student Selector for Assignment */}
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedStudent || undefined} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select student to assign..." />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStudent && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Assigning to: {students.find(s => s.id === selectedStudent)?.name}
              </Badge>
            )}
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedLevel} onValueChange={(val) => setSelectedLevel(val as CEFRLevel | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="CEFR Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Pre-A1">Pre-A1</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAge} onValueChange={(val) => setSelectedAge(val as AgeGroup | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="5-7">5-7 years</SelectItem>
                <SelectItem value="8-11">8-11 years</SelectItem>
                <SelectItem value="12-14">12-14 years</SelectItem>
                <SelectItem value="15-17">15-17 years</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedLevel("all");
              setSelectedAge("all");
            }}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Loading lessons...</p>
        </div>
      ) : lessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No lessons found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedLevel !== "all" || selectedAge !== "all" 
                ? "Try adjusting your filters" 
                : "Create your first lesson to get started"}
            </p>
            <Button onClick={() => setIsCreatorOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {lesson.topic}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {lesson.screens_data?.length || 0} screens
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{lesson.age_group}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{lesson.cefr_level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.duration_minutes} min</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      size="sm"
                      onClick={() => window.location.href = `/interactive-lesson/${lesson.id}?mode=preview`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => window.location.href = `/interactive-lesson/${lesson.id}?mode=classroom`}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Use Lesson
                    </Button>
                    {selectedStudent && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignToStudent(lesson.id, selectedStudent);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lesson Creator Modal */}
      <LessonCreatorModal 
        open={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onLessonCreated={() => fetchLessons({
          cefrLevel: selectedLevel,
          ageGroup: selectedAge,
          searchQuery
        })}
      />
    </div>
  );
};
