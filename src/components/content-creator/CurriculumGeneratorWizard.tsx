import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Wand2, ChevronDown, ChevronRight, Save, BookOpen, GraduationCap, Edit2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GeneratedUnit {
  unitNumber: number;
  title: string;
  lessons: GeneratedLesson[];
}

interface GeneratedLesson {
  lessonNumber: number;
  title: string;
  objectives: string[];
  grammarFocus: string;
  vocabularyTheme: string;
}

interface CurriculumConfig {
  level: string;
  ageGroup: string;
  unitCount: number;
  lessonsPerUnit: number;
}

const LEVELS = [
  { value: 'beginner', label: 'Beginner (Pre-A1/A1)' },
  { value: 'elementary', label: 'Elementary (A2)' },
  { value: 'pre-intermediate', label: 'Pre-Intermediate (A2+/B1)' },
  { value: 'intermediate', label: 'Intermediate (B1/B2)' },
];

const AGE_GROUPS = [
  { value: 'kids', label: 'Kids (5-10)' },
  { value: 'teens', label: 'Teens (11-17)' },
  { value: 'adults', label: 'Adults (18+)' },
];

interface CurriculumGeneratorWizardProps {
  onCurriculumGenerated?: (ctx: { system: string; level: string; ageGroup: string }) => void;
}

export const CurriculumGeneratorWizard: React.FC<CurriculumGeneratorWizardProps> = ({ onCurriculumGenerated }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<CurriculumConfig>({
    level: '',
    ageGroup: '',
    unitCount: 4,
    lessonsPerUnit: 3,
  });
  const [generatedUnits, setGeneratedUnits] = useState<GeneratedUnit[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openUnits, setOpenUnits] = useState<Set<number>>(new Set());
  const [editingLesson, setEditingLesson] = useState<{ unitIdx: number; lessonIdx: number } | null>(null);
  const [editBuffer, setEditBuffer] = useState<GeneratedLesson | null>(null);

  const canGenerate = config.level && config.ageGroup && config.unitCount > 0 && config.lessonsPerUnit > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setGeneratedUnits([]);

    try {
      const { data, error } = await supabase.functions.invoke('curriculum-expert-agent', {
        body: {
          mode: 'curriculum_structure',
          level: config.level,
          ageGroup: config.ageGroup,
          unitCount: config.unitCount,
          lessonsPerUnit: config.lessonsPerUnit,
        },
      });

      if (error) throw error;

      // Parse response - the edge function returns structured content
      const content = data?.content || data?.result || data;
      let parsed: GeneratedUnit[];

      if (typeof content === 'string') {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse curriculum structure from AI response');
        }
      } else if (Array.isArray(content)) {
        parsed = content;
      } else if (content?.units) {
        parsed = content.units;
      } else {
        // Generate fallback structure
        parsed = generateFallbackStructure();
      }

      // Normalize: ensure every unit has a lessons array with safe fields
      parsed = parsed.map((unit: any, i: number) => ({
        unitNumber: unit.unitNumber ?? unit.unit_number ?? i + 1,
        title: unit.title ?? `Unit ${i + 1}`,
        lessons: (unit.lessons ?? []).map((lesson: any, li: number) => ({
          lessonNumber: lesson.lessonNumber ?? lesson.lesson_number ?? li + 1,
          title: lesson.title ?? `Lesson ${li + 1}`,
          objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
          grammarFocus: lesson.grammarFocus ?? lesson.grammar_focus ?? '',
          vocabularyTheme: lesson.vocabularyTheme ?? lesson.vocabulary_theme ?? '',
        })),
      }));

      setGeneratedUnits(parsed);
      setOpenUnits(new Set(parsed.map((_, i) => i)));
      toast.success(`Generated ${parsed.length} units with lessons!`);
    } catch (err: any) {
      console.error('Curriculum generation error:', err);
      // Use fallback generation
      const fallback = generateFallbackStructure();
      setGeneratedUnits(fallback);
      setOpenUnits(new Set(fallback.map((_, i) => i)));
      toast.info('Generated curriculum structure (offline mode)');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackStructure = (): GeneratedUnit[] => {
    const levelThemes: Record<string, string[][]> = {
      beginner: [
        ['Greetings & Introductions', 'Saying Hello', 'Introducing Yourself', 'Asking Someone\'s Name', 'Classroom Language'],
        ['My Family & Friends', 'Family Members', 'Describing People', 'Talking About Friends', 'Family Activities'],
        ['Daily Routines', 'Morning Routine', 'At School', 'After School', 'Bedtime'],
        ['Food & Drink', 'Fruits & Vegetables', 'Meals of the Day', 'At the Restaurant', 'My Favourite Food'],
        ['Animals & Nature', 'Farm Animals', 'Wild Animals', 'Pets', 'In the Garden'],
        ['My Home', 'Rooms in the House', 'Furniture', 'My Bedroom', 'Household Chores'],
      ],
      elementary: [
        ['Hobbies & Interests', 'Sports & Games', 'Music & Art', 'Reading & Writing', 'Weekend Activities'],
        ['Travel & Transport', 'Getting Around', 'At the Airport', 'Holiday Plans', 'Giving Directions'],
        ['Health & Body', 'Parts of the Body', 'Feeling Unwell', 'At the Doctor', 'Healthy Habits'],
        ['Shopping & Money', 'At the Shop', 'Clothes Shopping', 'Comparing Prices', 'Pocket Money'],
        ['Weather & Seasons', 'Types of Weather', 'Four Seasons', 'Weather Forecast', 'Seasonal Activities'],
        ['Technology', 'Computers & Phones', 'The Internet', 'Social Media', 'Digital Safety'],
      ],
      'pre-intermediate': [
        ['Life Experiences', 'Memorable Moments', 'Achievements', 'Challenges', 'Future Goals'],
        ['The Environment', 'Climate Change', 'Recycling', 'Wildlife Conservation', 'Green Living'],
        ['Culture & Traditions', 'Festivals Around the World', 'Food Culture', 'Music & Dance', 'Cultural Differences'],
        ['Education & Careers', 'School Systems', 'Dream Jobs', 'Job Skills', 'Work Experience'],
        ['Media & Communication', 'News & Journalism', 'Advertising', 'Social Media Influence', 'Public Speaking'],
        ['Science & Innovation', 'Inventions', 'Space Exploration', 'Medical Science', 'Future Technology'],
      ],
      intermediate: [
        ['Global Issues', 'Poverty & Inequality', 'Migration', 'Human Rights', 'International Cooperation'],
        ['Business & Economics', 'Entrepreneurship', 'Marketing', 'Global Trade', 'Financial Literacy'],
        ['Literature & Arts', 'Famous Authors', 'Poetry Analysis', 'Film & Theatre', 'Art Movements'],
        ['Psychology & Society', 'Motivation', 'Social Behaviour', 'Cultural Identity', 'Stereotypes'],
        ['Advanced Communication', 'Debate Skills', 'Persuasive Writing', 'Academic Presentations', 'Negotiation'],
        ['Future & Innovation', 'AI & Robotics', 'Sustainable Cities', 'Space Colonization', 'Ethics in Technology'],
      ],
    };

    const themes = levelThemes[config.level] || levelThemes.beginner;
    const grammarByLevel: Record<string, string[]> = {
      beginner: ['be verbs', 'simple present', 'can/can\'t', 'this/that', 'plurals', 'prepositions'],
      elementary: ['past simple', 'comparatives', 'future (going to)', 'present continuous', 'some/any', 'modal verbs'],
      'pre-intermediate': ['present perfect', 'past continuous', 'first conditional', 'passive voice', 'relative clauses', 'reported speech'],
      intermediate: ['second conditional', 'past perfect', 'gerunds/infinitives', 'advanced passive', 'narrative tenses', 'mixed conditionals'],
    };

    const grammar = grammarByLevel[config.level] || grammarByLevel.beginner;

    return Array.from({ length: config.unitCount }, (_, ui) => {
      const themeSet = themes[ui % themes.length];
      return {
        unitNumber: ui + 1,
        title: `Unit ${ui + 1}: ${themeSet[0]}`,
        lessons: Array.from({ length: config.lessonsPerUnit }, (_, li) => ({
          lessonNumber: li + 1,
          title: themeSet[(li + 1) % themeSet.length] || `Lesson ${li + 1}`,
          objectives: [
            `Students will be able to use ${grammar[ui % grammar.length]} in context`,
            `Students will learn ${5 + li * 2} new vocabulary items`,
            `Students will practise speaking and listening skills`,
          ],
          grammarFocus: grammar[ui % grammar.length],
          vocabularyTheme: themeSet[0],
        })),
      };
    });
  };

  const toggleUnit = (idx: number) => {
    setOpenUnits((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const startEdit = (unitIdx: number, lessonIdx: number) => {
    setEditingLesson({ unitIdx, lessonIdx });
    setEditBuffer({ ...generatedUnits[unitIdx].lessons[lessonIdx] });
  };

  const cancelEdit = () => {
    setEditingLesson(null);
    setEditBuffer(null);
  };

  const saveEdit = () => {
    if (!editingLesson || !editBuffer) return;
    setGeneratedUnits((prev) =>
      prev.map((unit, ui) =>
        ui === editingLesson.unitIdx
          ? {
              ...unit,
              lessons: unit.lessons.map((lesson, li) =>
                li === editingLesson.lessonIdx ? editBuffer : lesson
              ),
            }
          : unit
      )
    );
    setEditingLesson(null);
    setEditBuffer(null);
    toast.success('Lesson updated');
  };

  const handleSaveToDB = async () => {
    if (generatedUnits.length === 0) return;
    setIsSaving(true);

    try {
      const targetSystem = config.ageGroup === 'kids'
        ? 'playground'
        : config.ageGroup === 'teens'
          ? 'academy'
          : 'professional';

      const unitCefrLevel = config.level === 'beginner'
        ? 'A1'
        : config.level === 'elementary'
          ? 'A2'
          : config.level === 'pre-intermediate'
            ? 'B1'
            : 'B2';

      const lessonDifficultyLevel = config.level === 'beginner' || config.level === 'elementary'
        ? 'beginner'
        : config.level === 'pre-intermediate'
          ? 'intermediate'
          : 'advanced';

      for (const unit of generatedUnits) {
        const { data: unitData, error: unitError } = await supabase
          .from('curriculum_units')
          .insert({
            title: unit.title,
            unit_number: unit.unitNumber,
            age_group: config.ageGroup,
            cefr_level: unitCefrLevel,
            learning_objectives: unit.lessons.flatMap(l => l.objectives || []),
            created_by: user?.id || null,
          })
          .select()
          .single();

        if (unitError) throw unitError;

        const lessonInserts = unit.lessons.map((lesson) => ({
          title: lesson.title,
          unit_id: unitData.id,
          target_system: targetSystem,
          difficulty_level: lessonDifficultyLevel,
          sequence_order: lesson.lessonNumber,
          duration_minutes: 30,
          created_by: user?.id || null,
          content: {
            objectives: lesson.objectives,
            grammarFocus: lesson.grammarFocus,
            vocabularyTheme: lesson.vocabularyTheme,
            cefrLevel: unitCefrLevel,
            sourceLevel: config.level,
          },
          is_published: false,
        }));

        const { error: lessonsError } = await supabase
          .from('curriculum_lessons')
          .insert(lessonInserts);

        if (lessonsError) throw lessonsError;
      }

      toast.success(`Saved ${generatedUnits.length} units and ${generatedUnits.reduce((sum, u) => sum + (u.lessons?.length || 0), 0)} lessons to database!`);
      onCurriculumGenerated?.({ system: targetSystem, level: config.level, ageGroup: config.ageGroup });
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('Failed to save curriculum: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          Curriculum Generator
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate a structured English learning curriculum with AI. Configure the parameters below and let AI create units, lessons, objectives, and grammar focus.
        </p>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration</CardTitle>
          <CardDescription>Set up the curriculum parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Student Level</Label>
              <Select value={config.level} onValueChange={(v) => setConfig((p) => ({ ...p, level: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Age Group</Label>
              <Select value={config.ageGroup} onValueChange={(v) => setConfig((p) => ({ ...p, ageGroup: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Units</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={config.unitCount}
                onChange={(e) => setConfig((p) => ({ ...p, unitCount: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Lessons per Unit</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={config.lessonsPerUnit}
                onChange={(e) => setConfig((p) => ({ ...p, lessonsPerUnit: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            size="lg"
            disabled={!canGenerate || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Curriculum...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Curriculum
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Curriculum Preview */}
      {generatedUnits.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Generated Curriculum</CardTitle>
              <CardDescription>
                {generatedUnits.length} units · {generatedUnits.reduce((s, u) => s + (u.lessons?.length || 0), 0)} lessons · Click to edit
              </CardDescription>
            </div>
            <Button onClick={handleSaveToDB} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" />Save to Database</>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {generatedUnits.map((unit, ui) => (
              <Collapsible key={ui} open={openUnits.has(ui)} onOpenChange={() => toggleUnit(ui)}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                  {openUnits.has(ui) ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">{unit.title}</span>
                  <Badge variant="secondary" className="ml-auto">{(unit.lessons || []).length} lessons</Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 mt-2 space-y-2">
                  {unit.lessons.map((lesson, li) => {
                    const isEditing = editingLesson?.unitIdx === ui && editingLesson?.lessonIdx === li;
                    return (
                      <div key={li} className="rounded-lg border border-border p-3">
                        {isEditing && editBuffer ? (
                          <div className="space-y-3">
                            <Input
                              value={editBuffer.title}
                              onChange={(e) => setEditBuffer({ ...editBuffer, title: e.target.value })}
                              className="font-medium"
                            />
                            <div className="space-y-1">
                              <Label className="text-xs">Grammar Focus</Label>
                              <Input
                                value={editBuffer.grammarFocus}
                                onChange={(e) => setEditBuffer({ ...editBuffer, grammarFocus: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Vocabulary Theme</Label>
                              <Input
                                value={editBuffer.vocabularyTheme}
                                onChange={(e) => setEditBuffer({ ...editBuffer, vocabularyTheme: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEdit}><Check className="h-3 w-3 mr-1" />Save</Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="h-3 w-3 mr-1" />Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm text-foreground">
                                  Lesson {lesson.lessonNumber}: {lesson.title}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Badge variant="outline" className="text-xs">🗣 {lesson.grammarFocus}</Badge>
                                <Badge variant="outline" className="text-xs">📚 {lesson.vocabularyTheme}</Badge>
                              </div>
                              {(lesson.objectives || []).length > 0 && (
                                <ul className="mt-2 text-xs text-muted-foreground space-y-0.5">
                                  {lesson.objectives.map((obj, oi) => (
                                    <li key={oi}>• {obj}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => startEdit(ui, li)}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
