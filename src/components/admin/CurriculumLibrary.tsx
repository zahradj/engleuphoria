import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Library,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  BookOpen,
  Layers,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { LessonPreview } from "./generator/LessonPreview";
import { LessonEditorPage } from "./editor/LessonEditorPage";

interface CurriculumLesson {
  id: string;
  title: string;
  description: string | null;
  target_system: string;
  difficulty_level: string;
  content: any;
  is_published: boolean;
  sequence_order: number | null;
  unit_id: string | null;
  level_id: string | null;
  created_at: string;
  unit?: {
    id: string;
    title: string;
    unit_number: number;
  } | null;
}

interface CurriculumUnit {
  id: string;
  title: string;
  unit_number: number;
}

export const CurriculumLibrary = () => {
  const queryClient = useQueryClient();
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewLesson, setPreviewLesson] = useState<CurriculumLesson | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Fetch lessons with unit info
  const { data: lessons = [], isLoading: isLoadingLessons } = useQuery({
    queryKey: ["curriculum-lessons-library"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("curriculum_lessons")
        .select(`
          *,
          unit:curriculum_units(id, title, unit_number)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CurriculumLesson[];
    },
  });

  // Fetch units for filter
  const { data: units = [] } = useQuery({
    queryKey: ["curriculum-units-filter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("curriculum_units")
        .select("id, title, unit_number")
        .order("unit_number", { ascending: true });

      if (error) throw error;
      return data as CurriculumUnit[];
    },
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("curriculum_lessons")
        .update({ is_published: !isPublished })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-lessons-library"] });
      toast.success("Lesson status updated");
    },
    onError: () => {
      toast.error("Failed to update lesson status");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("curriculum_lessons")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-lessons-library"] });
      toast.success("Lesson deleted");
    },
    onError: () => {
      toast.error("Failed to delete lesson");
    },
  });

  // Filter lessons
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSystem = systemFilter === "all" || lesson.target_system === systemFilter;
    const matchesUnit = unitFilter === "all" || lesson.unit_id === unitFilter;
    const matchesSearch =
      !searchQuery ||
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSystem && matchesUnit && matchesSearch;
  });

  const getSystemLabel = (system: string) => {
    switch (system) {
      case "kids":
        return "Kids";
      case "teen":
      case "teens":
        return "Teens";
      case "adult":
      case "adults":
        return "Adults";
      default:
        return system;
    }
  };

  const getSystemColor = (system: string) => {
    switch (system) {
      case "kids":
        return "bg-green-100 text-green-700";
      case "teen":
      case "teens":
        return "bg-purple-100 text-purple-700";
      case "adult":
      case "adults":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // If editing a lesson, show the editor
  if (editingLessonId) {
    return (
      <LessonEditorPage
        lessonId={editingLessonId}
        onBack={() => setEditingLessonId(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            Lesson Library
          </h1>
          <p className="text-muted-foreground">
            Manage and organize AI-generated curriculum lessons
          </p>
        </div>
        <Button onClick={() => window.location.hash = "#ai-generator"}>
          <Plus className="h-4 w-4 mr-2" />
          Generate New Lesson
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* System Tabs */}
            <Tabs value={systemFilter} onValueChange={setSystemFilter} className="flex-shrink-0">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="kids">Kids</TabsTrigger>
                <TabsTrigger value="teen">Teens</TabsTrigger>
                <TabsTrigger value="adult">Adults</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Unit Filter */}
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    Unit {unit.unit_number}: {unit.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      {isLoadingLessons ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredLessons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No lessons found</p>
            <p className="text-sm">
              {searchQuery || systemFilter !== "all" || unitFilter !== "all"
                ? "Try adjusting your filters"
                : "Generate your first lesson to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    {/* Unit & Lesson Number */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {lesson.unit ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          Unit {lesson.unit.unit_number}
                        </Badge>
                      ) : null}
                      {lesson.sequence_order && (
                        <span>Lesson {lesson.sequence_order}</span>
                      )}
                    </div>
                    <CardTitle className="text-base truncate">
                      {lesson.title || "Untitled Lesson"}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPreviewLesson(lesson)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingLessonId(lesson.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: lesson.id,
                            isPublished: lesson.is_published,
                          })
                        }
                      >
                        {lesson.is_published ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {lesson.description || "No description"}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getSystemColor(lesson.target_system)}>
                    {getSystemLabel(lesson.target_system)}
                  </Badge>
                  <Badge variant="outline">{lesson.difficulty_level}</Badge>
                  {lesson.is_published ? (
                    <Badge className="bg-green-100 text-green-700">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewLesson} onOpenChange={() => setPreviewLesson(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {previewLesson?.title || "Lesson Preview"}
            </DialogTitle>
          </DialogHeader>
          {previewLesson?.content && (
            <LessonPreview
              data={previewLesson.content}
              system={previewLesson.target_system}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
