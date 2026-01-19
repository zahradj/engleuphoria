import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumUnit {
  id: string;
  title: string;
  unit_number: number;
  cefr_level: string;
  age_group: string;
}

interface CurriculumLesson {
  id: string;
  title: string;
  target_system: string;
  sequence_order: number | null;
  unit_id: string | null;
  difficulty_level: string;
  is_published: boolean | null;
}

interface LessonPickerProps {
  system: string;
  onSelectLesson: (lesson: CurriculumLesson | null, unit: CurriculumUnit | null, isNew: boolean) => void;
  selectedLessonId?: string | null;
}

export const LessonPicker: React.FC<LessonPickerProps> = ({
  system,
  onSelectLesson,
  selectedLessonId,
}) => {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  // Fetch units
  const { data: units = [] } = useQuery({
    queryKey: ["curriculum-units", system],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("curriculum_units")
        .select("id, title, unit_number, cefr_level, age_group")
        .order("unit_number", { ascending: true });

      if (error) throw error;
      return data as CurriculumUnit[];
    },
  });

  // Fetch lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["curriculum-lessons-picker", system],
    queryFn: async () => {
      let query = supabase
        .from("curriculum_lessons")
        .select("id, title, target_system, sequence_order, unit_id, difficulty_level, is_published")
        .order("sequence_order", { ascending: true });

      if (system) {
        query = query.eq("target_system", system);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CurriculumLesson[];
    },
  });

  // Filter units by system
  const filteredUnits = units.filter((unit) => {
    if (system === "kids") {
      return unit.age_group.includes("4-7") || unit.age_group.includes("6-9") || unit.age_group.includes("8-11") || unit.age_group.includes("10-13");
    }
    if (system === "teens") {
      return unit.age_group.includes("10-13") || unit.age_group.includes("12-15") || unit.age_group.includes("14-17") || unit.age_group.includes("16+");
    }
    return unit.age_group.includes("16+") || unit.age_group.includes("18+");
  });

  // Group lessons by unit
  const lessonsByUnit = lessons.reduce((acc, lesson) => {
    const unitId = lesson.unit_id || "unassigned";
    if (!acc[unitId]) acc[unitId] = [];
    acc[unitId].push(lesson);
    return acc;
  }, {} as Record<string, CurriculumLesson[]>);

  // Lessons without a unit
  const unassignedLessons = lessonsByUnit["unassigned"] || [];

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  };

  const getNextLessonNumber = (unitId: string) => {
    const unitLessons = lessonsByUnit[unitId] || [];
    if (unitLessons.length === 0) return 1;
    const maxOrder = Math.max(...unitLessons.map((l) => l.sequence_order || 0));
    return maxOrder + 1;
  };

  const handleAddLesson = (unit: CurriculumUnit) => {
    onSelectLesson(null, unit, true);
  };

  const handleSelectLesson = (lesson: CurriculumLesson) => {
    const unit = units.find((u) => u.id === lesson.unit_id) || null;
    onSelectLesson(lesson, unit, false);
  };

  return (
    <div className="border rounded-lg bg-card">
      <div className="p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Lesson Picker</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select a lesson to regenerate or add new
        </p>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-2 space-y-1">
          {/* Units with lessons */}
          {filteredUnits.map((unit) => {
            const unitLessons = lessonsByUnit[unit.id] || [];
            const isExpanded = expandedUnits.has(unit.id);

            return (
              <Collapsible
                key={unit.id}
                open={isExpanded}
                onOpenChange={() => toggleUnit(unit.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 px-2"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 shrink-0" />
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">
                        Unit {unit.unit_number}: {unit.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {unitLessons.length} lesson{unitLessons.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {unit.cefr_level}
                    </Badge>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="pl-6 space-y-1 mt-1">
                  {unitLessons.map((lesson) => (
                    <Button
                      key={lesson.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start h-auto py-2 px-2",
                        selectedLessonId === lesson.id && "bg-primary/10 border-primary"
                      )}
                      onClick={() => handleSelectLesson(lesson)}
                    >
                      <FileText className="h-3.5 w-3.5 mr-2 shrink-0 text-muted-foreground" />
                      <div className="flex-1 text-left truncate">
                        <span className="text-xs font-medium">
                          {lesson.sequence_order}. {lesson.title}
                        </span>
                      </div>
                      <RefreshCw className="h-3 w-3 ml-2 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </Button>
                  ))}

                  {/* Add new lesson button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto py-2 px-2 text-primary hover:text-primary border border-dashed border-primary/30 hover:border-primary/50"
                    onClick={() => handleAddLesson(unit)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-2 shrink-0" />
                    <span className="text-xs">
                      Add Lesson {getNextLessonNumber(unit.id)}
                    </span>
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {/* Unassigned lessons section */}
          {unassignedLessons.length > 0 && (
            <Collapsible
              open={expandedUnits.has("unassigned")}
              onOpenChange={() => toggleUnit("unassigned")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-2 px-2 text-muted-foreground"
                >
                  {expandedUnits.has("unassigned") ? (
                    <ChevronDown className="h-4 w-4 mr-2 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2 shrink-0" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">Unassigned Lessons</div>
                    <div className="text-xs">
                      {unassignedLessons.length} lesson{unassignedLessons.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="pl-6 space-y-1 mt-1">
                {unassignedLessons.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start h-auto py-2 px-2",
                      selectedLessonId === lesson.id && "bg-primary/10"
                    )}
                    onClick={() => handleSelectLesson(lesson)}
                  >
                    <FileText className="h-3.5 w-3.5 mr-2 shrink-0 text-muted-foreground" />
                    <div className="flex-1 text-left truncate">
                      <span className="text-xs font-medium">{lesson.title}</span>
                    </div>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {filteredUnits.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No units found for this system</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
