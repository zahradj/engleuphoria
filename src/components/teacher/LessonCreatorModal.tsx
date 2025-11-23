import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useGenerateInteractiveLesson } from '@/hooks/useGenerateInteractiveLesson';
import { ChevronRight, ChevronLeft, Loader2, Sparkles, Target, Book, Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onLessonCreated: () => void;
}

const ACTIVITY_OPTIONS = [
  { id: 'matching', label: 'Matching Pairs', description: 'Match words to images or definitions' },
  { id: 'dragdrop', label: 'Drag & Drop', description: 'Drag items to correct categories' },
  { id: 'spinning_wheel', label: 'Spinning Wheel', description: 'Random selection game with prizes' },
  { id: 'sorting', label: 'Sorting', description: 'Sort items into labeled boxes' },
  { id: 'quiz', label: 'Multiple Choice', description: 'Answer questions with 4 options' },
  { id: 'sentence_builder', label: 'Sentence Builder', description: 'Arrange words to form sentences' },
];

export function LessonCreatorModal({ open, onClose, onLessonCreated }: LessonCreatorModalProps) {
  const [step, setStep] = useState(1);
  const { generateLesson, isGenerating } = useGenerateInteractiveLesson();
  const { toast } = useToast();

  // Step 1: Basic Info
  const [topic, setTopic] = useState('');
  const [cefrLevel, setCefrLevel] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [duration, setDuration] = useState(30);

  // Step 2: Learning Content
  const [vocabularyList, setVocabularyList] = useState<string[]>([]);
  const [vocabularyInput, setVocabularyInput] = useState('');
  const [grammarFocus, setGrammarFocus] = useState<string[]>([]);
  const [grammarInput, setGrammarInput] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [objectiveInput, setObjectiveInput] = useState('');

  // Step 3: Activities
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const resetForm = () => {
    setStep(1);
    setTopic('');
    setCefrLevel('');
    setAgeGroup('');
    setDuration(30);
    setVocabularyList([]);
    setVocabularyInput('');
    setGrammarFocus([]);
    setGrammarInput('');
    setLearningObjectives([]);
    setObjectiveInput('');
    setSelectedActivities([]);
  };

  const handleClose = () => {
    if (!isGenerating) {
      resetForm();
      onClose();
    }
  };

  const addVocabulary = () => {
    if (vocabularyInput.trim()) {
      setVocabularyList([...vocabularyList, vocabularyInput.trim()]);
      setVocabularyInput('');
    }
  };

  const addGrammar = () => {
    if (grammarInput.trim()) {
      setGrammarFocus([...grammarFocus, grammarInput.trim()]);
      setGrammarInput('');
    }
  };

  const addObjective = () => {
    if (objectiveInput.trim()) {
      setLearningObjectives([...learningObjectives, objectiveInput.trim()]);
      setObjectiveInput('');
    }
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const canProceedStep1 = topic && cefrLevel && ageGroup && duration > 0;
  const canProceedStep2 = vocabularyList.length >= 5 && grammarFocus.length >= 1 && learningObjectives.length >= 2;
  const canProceedStep3 = selectedActivities.length >= 3;

  const handleGenerate = async () => {
    try {
      const lesson = await generateLesson({
        topic,
        cefrLevel,
        ageGroup,
        duration,
        vocabularyList,
        grammarFocus,
        learningObjectives,
        selectedActivities
      });

      if (lesson) {
        resetForm();
        onLessonCreated();
        toast({
          title: 'Success!',
          description: 'Your lesson is ready to use.',
        });
      }
    } catch (error) {
      // Error toast is handled in the hook
      console.error('Generation failed:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Interactive Lesson
          </DialogTitle>
          <DialogDescription>
            Step {step} of 4: {
              step === 1 ? 'Basic Information' :
              step === 2 ? 'Learning Content' :
              step === 3 ? 'Interactive Activities' :
              'Review & Generate'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Lesson Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Family Members, Daily Routines, Food & Drinks"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cefr">CEFR Level *</Label>
                  <Select value={cefrLevel} onValueChange={setCefrLevel}>
                    <SelectTrigger id="cefr">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-A1">Pre-A1 (Beginner)</SelectItem>
                      <SelectItem value="A1">A1 (Elementary)</SelectItem>
                      <SelectItem value="A2">A2 (Pre-Intermediate)</SelectItem>
                      <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                      <SelectItem value="B2">B2 (Upper-Intermediate)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age">Age Group *</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger id="age">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-7">5-7 years (Early Learners)</SelectItem>
                      <SelectItem value="8-11">8-11 years (Kids)</SelectItem>
                      <SelectItem value="12-14">12-14 years (Young Teens)</SelectItem>
                      <SelectItem value="15-17">15-17 years (Teens)</SelectItem>
                      <SelectItem value="18+">18+ years (Adults)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="90"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Learning Content */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Vocabulary Words * (min. 5)
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter a word"
                    value={vocabularyInput}
                    onChange={(e) => setVocabularyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addVocabulary()}
                  />
                  <Button type="button" onClick={addVocabulary}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {vocabularyList.map((word, idx) => (
                    <Badge key={idx} variant="secondary">
                      {word}
                      <button
                        onClick={() => setVocabularyList(vocabularyList.filter((_, i) => i !== idx))}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Grammar Focus * (min. 1)
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="e.g., Present Simple, Plural Nouns"
                    value={grammarInput}
                    onChange={(e) => setGrammarInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addGrammar()}
                  />
                  <Button type="button" onClick={addGrammar}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {grammarFocus.map((item, idx) => (
                    <Badge key={idx} variant="secondary">
                      {item}
                      <button
                        onClick={() => setGrammarFocus(grammarFocus.filter((_, i) => i !== idx))}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Learning Objectives * (min. 2)</Label>
                <div className="flex gap-2 mt-2">
                  <Textarea
                    placeholder="e.g., Students will be able to identify family members"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    rows={2}
                  />
                  <Button type="button" onClick={addObjective}>Add</Button>
                </div>
                <div className="space-y-2 mt-3">
                  {learningObjectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-muted p-2 rounded">
                      <span className="text-xs text-muted-foreground mt-1">{idx + 1}.</span>
                      <span className="flex-1 text-sm">{obj}</span>
                      <button
                        onClick={() => setLearningObjectives(learningObjectives.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Activities */}
          {step === 3 && (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Select Activities * (min. 3)
              </Label>
              <p className="text-sm text-muted-foreground">
                Choose the types of interactive activities for this lesson
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ACTIVITY_OPTIONS.map((activity) => (
                  <div
                    key={activity.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedActivities.includes(activity.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedActivities.includes(activity.id)}
                        onCheckedChange={() => toggleActivity(activity.id)}
                      />
                      <div>
                        <div className="font-medium">{activity.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <span className="font-semibold">Topic:</span> {topic}
                </div>
                <div>
                  <span className="font-semibold">Level:</span> {cefrLevel} | {ageGroup} | {duration} min
                </div>
                <div>
                  <span className="font-semibold">Vocabulary:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vocabularyList.map((word, idx) => (
                      <Badge key={idx} variant="outline">{word}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Grammar:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {grammarFocus.map((item, idx) => (
                      <Badge key={idx} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Activities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedActivities.map((id, idx) => (
                      <Badge key={idx} variant="outline">
                        {ACTIVITY_OPTIONS.find(a => a.id === id)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Ready to generate!</strong> The AI will create 20 interactive screens with complete content including vocabulary definitions, grammar explanations, activities, quizzes, and more.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
            disabled={isGenerating}
          >
            {step === 1 ? 'Cancel' : (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            )}
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Lesson
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
