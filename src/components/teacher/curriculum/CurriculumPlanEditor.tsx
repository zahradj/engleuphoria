
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { CurriculumPlan, LessonPlan } from "@/types/curriculum";
import { Edit, Save, X, Plus, Trash } from "lucide-react";

interface CurriculumPlanEditorProps {
  plan: CurriculumPlan;
  onPlanUpdate: (plan: CurriculumPlan) => void;
}

export function CurriculumPlanEditor({ plan, onPlanUpdate }: CurriculumPlanEditorProps) {
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ week: number; lesson: number } | null>(null);

  const updateLesson = (weekIndex: number, lessonIndex: number, updates: Partial<LessonPlan>) => {
    const updatedPlan = { ...plan };
    updatedPlan.weeks[weekIndex].lessons[lessonIndex] = {
      ...updatedPlan.weeks[weekIndex].lessons[lessonIndex],
      ...updates
    };
    onPlanUpdate(updatedPlan);
  };

  const updateWeekTheme = (weekIndex: number, theme: string) => {
    const updatedPlan = { ...plan };
    updatedPlan.weeks[weekIndex].theme = theme;
    onPlanUpdate(updatedPlan);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Curriculum Plan Editor</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus size={14} className="mr-1" />
            Add Week
          </Button>
          <Button size="sm">
            <Save size={14} className="mr-1" />
            Save Changes
          </Button>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {plan.weeks.map((week, weekIndex) => (
          <AccordionItem key={weekIndex} value={`week-${weekIndex}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Badge variant="outline">Week {weekIndex + 1}</Badge>
                {editingWeek === weekIndex ? (
                  <Input
                    value={week.theme}
                    onChange={(e) => updateWeekTheme(weekIndex, e.target.value)}
                    onBlur={() => setEditingWeek(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingWeek(null)}
                    className="h-8 text-base font-medium"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingWeek(weekIndex);
                    }}
                  >
                    {week.theme}
                  </span>
                )}
                <Edit size={14} className="text-gray-400" />
              </div>
            </AccordionTrigger>
            
            <AccordionContent>
              <div className="space-y-4 pt-4">
                {week.lessons.map((lesson, lessonIndex) => (
                  <Card key={lessonIndex} className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">Lesson {lessonIndex + 1}</Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingLesson({ week: weekIndex, lesson: lessonIndex })}
                        >
                          <Edit size={12} />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash size={12} />
                        </Button>
                      </div>
                    </div>

                    {editingLesson?.week === weekIndex && editingLesson?.lesson === lessonIndex ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Objective</label>
                          <Textarea
                            value={lesson.objective}
                            onChange={(e) => updateLesson(weekIndex, lessonIndex, { objective: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">NLP Anchor</label>
                          <Textarea
                            value={lesson.nlpAnchor}
                            onChange={(e) => updateLesson(weekIndex, lessonIndex, { nlpAnchor: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Critical Thinking</label>
                          <Textarea
                            value={lesson.criticalThinking}
                            onChange={(e) => updateLesson(weekIndex, lessonIndex, { criticalThinking: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Homework</label>
                          <Textarea
                            value={lesson.homework}
                            onChange={(e) => updateLesson(weekIndex, lessonIndex, { homework: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setEditingLesson(null)}>
                            <Save size={12} className="mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingLesson(null)}>
                            <X size={12} className="mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Objective:</span>
                          <p className="text-sm">{lesson.objective}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">NLP Anchor:</span>
                          <p className="text-sm italic text-blue-700">{lesson.nlpAnchor}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Critical Thinking:</span>
                          <p className="text-sm">{lesson.criticalThinking}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Homework:</span>
                          <p className="text-sm">{lesson.homework}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Resources:</span>
                          {lesson.resources.map((resource, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {resource.type}: {resource.id}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-medium text-green-600">
                            XP Reward: {lesson.xpReward}
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
                
                <Button variant="outline" size="sm" className="w-full">
                  <Plus size={14} className="mr-1" />
                  Add Lesson
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
