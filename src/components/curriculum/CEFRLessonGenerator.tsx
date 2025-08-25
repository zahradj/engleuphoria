import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Palette, Users, Clock, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface CEFRColorTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

interface CEFRLessonParams {
  level: string;
  module: number;
  lesson: number;
  topic: string;
  ageGroup: string;
  duration: number;
  customRequirements?: string;
}

interface GeneratedLesson {
  meta: {
    title: string;
    level: string;
    age_band: string;
    duration_min: number;
    module: number;
    lesson: number;
    visual_style: string;
    color_theme: CEFRColorTheme;
  };
  objectives: string[];
  blueprint: Array<{
    slot: string;
    time: number;
    mode: string;
    visual: string;
    animation: string;
    colors: { bg: string; text: string };
  }>;
  activities: Array<{
    id: string;
    type: string;
    targets: string[];
    items: Array<{
      prompt_img: string;
      answer: string;
    }>;
    animations: { correct: string; wrong: string };
    colors: { correct: string; wrong: string };
  }>;
  assets: Array<{
    id: string;
    type: string;
    prompt: string;
    style: string;
  }>;
  assessment: {
    quiz: {
      visual: string;
      animation: string;
      colors: { primary: string; secondary: string };
    };
  };
  export: {
    scorm12: boolean;
    h5p: boolean;
    html_slides: boolean;
  };
}

const CEFR_COLOR_THEMES: Record<string, CEFRColorTheme> = {
  'Pre-A1': {
    primary: '#FFB6C1',
    secondary: '#FFC0CB',
    background: '#FFF0F5',
    text: '#8B0000'
  },
  'A1': {
    primary: '#6CC24A',
    secondary: '#6DB7E3',
    background: '#F3FAF0',
    text: '#2D5016'
  },
  'A1+': {
    primary: '#50C878',
    secondary: '#87CEEB',
    background: '#F0FFF0',
    text: '#006400'
  },
  'A2': {
    primary: '#FF8C00',
    secondary: '#FFD700',
    background: '#FFF8DC',
    text: '#B8860B'
  },
  'A2+': {
    primary: '#FF7F50',
    secondary: '#F0E68C',
    background: '#FFFACD',
    text: '#8B4513'
  },
  'B1': {
    primary: '#4682B4',
    secondary: '#20B2AA',
    background: '#F0F8FF',
    text: '#191970'
  },
  'B1+': {
    primary: '#5F9EA0',
    secondary: '#48D1CC',
    background: '#E0FFFF',
    text: '#2F4F4F'
  },
  'B2': {
    primary: '#9370DB',
    secondary: '#DA70D6',
    background: '#F8F0FF',
    text: '#4B0082'
  },
  'B2+': {
    primary: '#8A2BE2',
    secondary: '#DDA0DD',
    background: '#E6E6FA',
    text: '#6A0DAD'
  },
  'C1': {
    primary: '#191970',
    secondary: '#C0C0C0',
    background: '#F5F5F5',
    text: '#000080'
  },
  'C2': {
    primary: '#FFD700',
    secondary: '#000000',
    background: '#FFFEF0',
    text: '#8B4513'
  }
};

const AGE_GROUPS = [
  'Kids 4-7',
  'Kids 6-9', 
  'Kids 8-11',
  'Tweens 9-13',
  'Teens 12-15',
  'Teens 13-16',
  'Young Adults 16-25',
  'Adults 25-50',
  'Professional Adults 30+'
];

const LESSON_TOPICS = [
  'Greetings & Introductions',
  'Family & Friends',
  'Colors & Shapes',
  'Numbers & Counting',
  'Food & Drinks',
  'Animals & Pets',
  'Body Parts & Health',
  'Clothes & Fashion',
  'Home & Furniture',
  'School & Education',
  'Sports & Hobbies',
  'Travel & Transportation',
  'Weather & Seasons',
  'Shopping & Money',
  'Work & Professions',
  'Technology & Communication',
  'Environment & Nature',
  'Culture & Traditions'
];

export function CEFRLessonGenerator() {
  const [params, setParams] = useState<CEFRLessonParams>({
    level: 'A1',
    module: 1,
    lesson: 1,
    topic: '',
    ageGroup: '',
    duration: 30
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLesson | null>(null);

  const handleGenerate = async () => {
    if (!params.topic || !params.ageGroup) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const colorTheme = CEFR_COLOR_THEMES[params.level];
      const visualStyle = getVisualStyleForAge(params.ageGroup);

      const lesson: GeneratedLesson = {
        meta: {
          title: `${params.level}–Module ${params.module}–Lesson ${params.lesson}: ${params.topic}`,
          level: params.level,
          age_band: params.ageGroup.toLowerCase(),
          duration_min: params.duration,
          module: params.module,
          lesson: params.lesson,
          visual_style: visualStyle,
          color_theme: colorTheme
        },
        objectives: generateObjectives(params.level, params.topic),
        blueprint: generateBlueprint(params, colorTheme),
        activities: generateActivities(params.level, params.topic, colorTheme),
        assets: generateAssets(params.topic, visualStyle),
        assessment: {
          quiz: {
            visual: "star trophy with glowing effect",
            animation: "confetti explosion on success",
            colors: { primary: colorTheme.primary, secondary: colorTheme.secondary }
          }
        },
        export: {
          scorm12: true,
          h5p: true,
          html_slides: true
        }
      };

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setGeneratedLesson(lesson);
        setIsGenerating(false);
        toast.success('CEFR lesson generated successfully!');
      }, 500);

    } catch (error) {
      setIsGenerating(false);
      toast.error('Failed to generate lesson');
      console.error(error);
    }
  };

  const getVisualStyleForAge = (ageGroup: string): string => {
    if (ageGroup.includes('Kids')) return 'cartoon, playful, rounded shapes, bright colors';
    if (ageGroup.includes('Teens')) return 'modern, dynamic, geometric shapes, vibrant colors';
    return 'clean, professional, minimalist, sophisticated colors';
  };

  const generateObjectives = (level: string, topic: string): string[] => {
    const baseObjectives = {
      'A1': [`Students can identify basic ${topic.toLowerCase()} vocabulary`, `Students can use simple phrases about ${topic.toLowerCase()}`],
      'A2': [`Students can describe ${topic.toLowerCase()} in simple sentences`, `Students can ask and answer questions about ${topic.toLowerCase()}`],
      'B1': [`Students can discuss ${topic.toLowerCase()} preferences and opinions`, `Students can participate in conversations about ${topic.toLowerCase()}`],
      'B2': [`Students can express complex ideas about ${topic.toLowerCase()}`, `Students can analyze and compare different aspects of ${topic.toLowerCase()}`],
      'C1': [`Students can articulate nuanced views on ${topic.toLowerCase()}`, `Students can debate and justify positions related to ${topic.toLowerCase()}`],
      'C2': [`Students can demonstrate mastery of ${topic.toLowerCase()} discourse`, `Students can create sophisticated presentations about ${topic.toLowerCase()}`]
    };
    return baseObjectives[level] || baseObjectives['A1'];
  };

  const generateBlueprint = (params: CEFRLessonParams, colors: CEFRColorTheme) => [
    {
      slot: "Warm-up",
      time: Math.round(params.duration * 0.15),
      mode: "animated_character",
      visual: `engaging introduction to ${params.topic.toLowerCase()}`,
      animation: "fade-in with bounce effect",
      colors: { bg: colors.background, text: colors.text }
    },
    {
      slot: "Vocabulary Input",
      time: Math.round(params.duration * 0.25),
      mode: "visual_cards",
      visual: `illustrated vocabulary cards for ${params.topic.toLowerCase()}`,
      animation: "flip cards with sound effects",
      colors: { bg: colors.secondary, text: colors.text }
    },
    {
      slot: "Practice Activities",
      time: Math.round(params.duration * 0.4),
      mode: "interactive_games",
      visual: `drag-drop and matching games for ${params.topic.toLowerCase()}`,
      animation: "smooth transitions with feedback",
      colors: { bg: colors.primary, text: "white" }
    },
    {
      slot: "Assessment",
      time: Math.round(params.duration * 0.2),
      mode: "quiz_challenge",
      visual: "progress tracking with achievement badges",
      animation: "celebration effects for correct answers",
      colors: { bg: colors.background, text: colors.text }
    }
  ];

  const generateActivities = (level: string, topic: string, colors: CEFRColorTheme) => [
    {
      id: "activity01",
      type: "drag_match",
      targets: ["vocabulary", "pronunciation"],
      items: [
        { prompt_img: `${topic.toLowerCase()}_item1.png`, answer: "item1" },
        { prompt_img: `${topic.toLowerCase()}_item2.png`, answer: "item2" }
      ],
      animations: { correct: "bounce", wrong: "shake" },
      colors: { correct: colors.primary, wrong: "#ff4444" }
    }
  ];

  const generateAssets = (topic: string, style: string) => [
    {
      id: "img1",
      type: "image",
      prompt: `${style} illustration showing ${topic.toLowerCase()} themes`,
      style: "high quality, engaging, educational"
    },
    {
      id: "audio1", 
      type: "tts",
      prompt: `Clear pronunciation guide for ${topic.toLowerCase()} vocabulary`,
      style: "native speaker, clear articulation"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            CEFR Interactive Lesson Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">CEFR Level</Label>
              <Select value={params.level} onValueChange={(value) => setParams(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CEFR_COLOR_THEMES).map(level => (
                    <SelectItem key={level} value={level}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: CEFR_COLOR_THEMES[level].primary }}
                        />
                        {level}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={params.module}
                onChange={(e) => setParams(prev => ({ ...prev, module: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson">Lesson</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={params.lesson}
                onChange={(e) => setParams(prev => ({ ...prev, lesson: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Theme</Label>
              <Select value={params.topic} onValueChange={(value) => setParams(prev => ({ ...prev, topic: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TOPICS.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageGroup" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Age Group
              </Label>
              <Select value={params.ageGroup} onValueChange={(value) => setParams(prev => ({ ...prev, ageGroup: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Duration (minutes)
              </Label>
              <Select value={params.duration.toString()} onValueChange={(value) => setParams(prev => ({ ...prev, duration: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Custom Requirements (Optional)</Label>
            <Textarea
              placeholder="Add any specific requirements or focus areas..."
              value={params.customRequirements || ''}
              onChange={(e) => setParams(prev => ({ ...prev, customRequirements: e.target.value }))}
            />
          </div>

          {params.level && (
            <div className="p-4 rounded-lg border" style={{ backgroundColor: CEFR_COLOR_THEMES[params.level].background }}>
              <h3 className="font-semibold mb-2" style={{ color: CEFR_COLOR_THEMES[params.level].text }}>
                Preview: {params.level} Color Theme
              </h3>
              <div className="flex gap-2">
                <Badge style={{ backgroundColor: CEFR_COLOR_THEMES[params.level].primary, color: 'white' }}>
                  Primary
                </Badge>
                <Badge style={{ backgroundColor: CEFR_COLOR_THEMES[params.level].secondary, color: 'white' }}>
                  Secondary  
                </Badge>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating CEFR lesson...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !params.topic || !params.ageGroup}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Generate CEFR Lesson
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedLesson && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: generatedLesson.meta.color_theme.background }}
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: generatedLesson.meta.color_theme.text }}>
                  {generatedLesson.meta.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span><strong>Level:</strong> {generatedLesson.meta.level}</span>
                  <span><strong>Duration:</strong> {generatedLesson.meta.duration_min}min</span>
                  <span><strong>Age:</strong> {generatedLesson.meta.age_band}</span>
                  <span><strong>Style:</strong> {generatedLesson.meta.visual_style}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {generatedLesson.objectives.map((obj, idx) => (
                    <li key={idx} className="text-sm">{obj}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Lesson Blueprint:</h4>
                <div className="space-y-2">
                  {generatedLesson.blueprint.map((slot, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded border-l-4"
                      style={{ 
                        borderLeftColor: generatedLesson.meta.color_theme.primary,
                        backgroundColor: slot.colors.bg 
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{slot.slot}</span>
                        <Badge variant="outline">{slot.time}min</Badge>
                      </div>
                      <p className="text-sm mt-1" style={{ color: slot.colors.text }}>
                        {slot.visual}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Export as SCORM
                </Button>
                <Button variant="outline" className="flex-1">
                  Export as H5P
                </Button>
                <Button variant="outline" className="flex-1">
                  Export HTML Slides
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}