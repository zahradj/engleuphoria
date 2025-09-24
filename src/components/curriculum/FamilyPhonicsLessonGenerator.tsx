import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  Users, 
  Volume2, 
  Gamepad2, 
  Clock, 
  Target,
  Loader2,
  CheckCircle,
  Star
} from 'lucide-react';

interface FamilyPhonicsLessonGeneratorProps {
  onLessonGenerated?: () => void;
}

export function FamilyPhonicsLessonGenerator({ onLessonGenerated }: FamilyPhonicsLessonGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);
  const { toast } = useToast();

  const FAMILY_PHONICS_PROMPT = `🎨 Generate 22 interactive slides for Pre-Starter Lesson 2: Family & Phonics (Aa, Bb).

🎯 Lesson Info
Level: Pre-Starter (ages 4–7)
Duration: ~30 minutes
Focus: Family vocabulary (mom, dad, brother, sister, baby, grandma, grandpa) + Phonics Aa & Bb
Skills: Listening, speaking, phonics, recognition, simple sentences
Style: Bright, kid-friendly, gamified, large visuals, minimal text
Gamification: Drag & Drop, Spin Wheel, Flip Cards, Matching, Sound Buttons, Role-Play Badge

📚 Slide Breakdown:

🔹 Warm-Up (Slides 1–3)
1. Hello Song / Chant Slide – clickable sound button
2. Review Slide – "Yes/No/Thank you" flashbacks from Lesson 1
3. Family Picture Prompt – teacher asks: "Who is this?"

🔹 Vocabulary: Family (Slides 4–8)
4. Flashcards – mom, dad, sister, brother, baby, grandma, grandpa
5. Drag & Drop Game – match words under family member pictures
6. Spin & Say Wheel – spin → student says word
7. Role-Play Prompt – "This is my ___." (student chooses card)
8. Quick Quiz – "Who is this?" → choose correct family word

🔹 Phonics Focus: Aa & Bb (Slides 9–13)
9. Big Letters "Aa" & "Bb" with sound buttons
10. Aa words: apple, ant, arm (images + sound)
11. Bb words: ball, bat, bag (images + sound)  
12. Sound Hunt Game – click sound → drag to A or B basket
13. Match Game – Match Aa/Bb pictures to letters

🔹 Practice Mix (Slides 14–18)
14. Sentence Builder – "B is for Brother / Baby. A is for Apple."
15. Guessing Game – sound plays /æ/ or /b/ → student points to correct picture
16. Family + Phonics Role-Play – "This is my brother. He has a ball."
17. Interactive Dialogue – student fills blanks: "This is my ___."
18. Spin Wheel Mix – family + phonics words shuffled

🔹 Wrap-Up (Slides 19–22)
19. Speed Round – teacher flashes cards, student shouts word
20. Chant Slide – "A-a-apple, B-b-ball, Brother, Sister, Family all!" (with audio)
21. Mini-Quiz – pick correct family/phonics word (multiple-choice)
22. Badge / Reward Slide – "You did it! Family Star!"

🎮 Gamification Elements:
- Drag & Drop: Family & phonics matching
- Spin Wheel: Random family/phonics word → say aloud
- Flip Cards: Reveal family members or Aa/Bb words
- Sound Buttons: Aa = /æ/, Bb = /b/
- Role-Play Badge: Earn after completing "This is my brother/sister."

Create comprehensive, interactive slides that are classroom-ready and engaging for young learners.`;

  const handleGenerateLesson = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 8, 90));
      }, 1000);

      toast({
        title: "Creating Family & Phonics Lesson",
        description: "Generating 22 interactive slides with custom prompt...",
      });

      // First, create the lesson entry in the database
      const lessonData = {
        title: "Family & Phonics (Aa, Bb)",
        topic: "Family vocabulary + Phonics Aa & Bb", 
        cefr_level: "Pre-Starter",
        module_number: 1,
        lesson_number: 2,
        duration_minutes: 30,
        learning_objectives: [
          "Students can identify and name family members",
          "Students can recognize and pronounce letters Aa and Bb",
          "Students can use simple sentences with family vocabulary",
          "Students can match phonics sounds to letters"
        ],
        vocabulary_focus: ["mom", "dad", "brother", "sister", "baby", "grandma", "grandpa", "apple", "ant", "arm", "ball", "bat", "bag"],
        grammar_focus: ["This is my...", "Letter recognition", "Basic sentence structure"],
        difficulty_level: "beginner",
        metadata: {
          target_age: "4-7 years",
          custom_prompt: true,
          phonics_focus: "Aa, Bb",
          gamification: ["Drag & Drop", "Spin Wheel", "Sound Buttons", "Role-Play"],
          lesson_type: "family_phonics"
        }
      };

      const { data: lessonResponse, error: lessonError } = await supabase
        .from('lessons_content')
        .insert(lessonData)
        .select()
        .single();

      if (lessonError) {
        throw new Error(`Failed to create lesson: ${lessonError.message}`);
      }

      // Generate slides using the AI with custom prompt
      const { data: slidesResponse, error: slidesError } = await supabase.functions.invoke('ai-slide-generator', {
        body: {
          action: 'generate_full_deck',
          lesson_data: {
            ...lessonResponse,
            custom_prompt: FAMILY_PHONICS_PROMPT,
            enrich_media: true // Generate real images
          },
          slide_count: 22
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (slidesError) {
        throw new Error(slidesError.message);
      }

      if (!slidesResponse.success) {
        throw new Error(slidesResponse.error || 'Generation failed');
      }

      // Update the lesson with generated slides
      const { error: updateError } = await supabase
        .from('lessons_content')
        .update({ 
          slides_content: slidesResponse.slides,
          updated_at: new Date().toISOString()
        })
        .eq('id', lessonResponse.id);

      if (updateError) {
        console.warn('Failed to update lesson with slides:', updateError.message);
      }

      setGeneratedLesson({
        ...lessonResponse,
        slides_content: slidesResponse.slides
      });

      toast({
        title: "Family & Phonics Lesson Complete! 🎉",
        description: `Created 22 interactive slides with family vocabulary and Aa/Bb phonics.`,
      });

      onLessonGenerated?.();

    } catch (error) {
      console.error('Family phonics lesson generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGenerator = () => {
    setGeneratedLesson(null);
    setProgress(0);
  };

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-pink-600" />
          Family & Phonics Lesson Generator
          <Badge variant="secondary" className="bg-pink-100 text-pink-700">
            Pre-Starter
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate the complete "Family & Phonics (Aa, Bb)" lesson with 22 interactive slides, 
          designed specifically for ages 4–7 with gamified activities.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isGenerating && !generatedLesson && (
          <div className="space-y-4">
            {/* Lesson Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Learning Focus
                </h4>
                <div className="flex flex-wrap gap-1">
                  {["Family Members", "Letters Aa & Bb", "Phonics Sounds", "Simple Sentences"].map(focus => (
                    <Badge key={focus} variant="outline" className="text-xs">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-green-600" />
                  Interactive Elements
                </h4>
                <div className="flex flex-wrap gap-1">
                  {["Drag & Drop", "Spin Wheel", "Sound Buttons", "Role-Play"].map(element => (
                    <Badge key={element} variant="outline" className="text-xs">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Lesson Structure Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">22-Slide Structure:</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">Warm-Up</div>
                  <div className="text-blue-600">3 slides</div>
                </div>
                <div className="p-2 bg-green-50 rounded border border-green-200">
                  <div className="font-medium text-green-700">Family Vocab</div>
                  <div className="text-green-600">5 slides</div>
                </div>
                <div className="p-2 bg-purple-50 rounded border border-purple-200">
                  <div className="font-medium text-purple-700">Phonics Aa & Bb</div>
                  <div className="text-purple-600">5 slides</div>
                </div>
                <div className="p-2 bg-orange-50 rounded border border-orange-200">
                  <div className="font-medium text-orange-700">Practice & Wrap-up</div>
                  <div className="text-orange-600">9 slides</div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerateLesson}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Family & Phonics Lesson
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
              <span className="text-sm font-medium">Creating 22 interactive slides...</span>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Volume2 className="h-3 w-3 text-blue-600" />
                <span>Adding sound buttons</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-3 w-3 text-green-600" />
                <span>Creating drag & drop games</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-purple-600" />
                <span>Generating family content</span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              This may take 60-90 seconds to complete
            </div>
          </div>
        )}

        {generatedLesson && !isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Family & Phonics Lesson Generated!</span>
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">{generatedLesson.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-green-700 font-medium">Slides:</span>
                  <div className="text-green-600">{generatedLesson.slides_content?.slides?.length || 22} interactive slides</div>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Duration:</span>
                  <div className="text-green-600">{generatedLesson.duration_minutes} minutes</div>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Level:</span>
                  <div className="text-green-600">{generatedLesson.cefr_level}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium">Vocabulary Included:</h5>
              <div className="flex flex-wrap gap-1">
                {generatedLesson.vocabulary_focus?.map((word: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {word}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={resetGenerator}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Generate Another Lesson
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}