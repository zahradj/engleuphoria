import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target, Clock, Zap } from 'lucide-react';
import { BulkCurriculumGenerator } from './BulkCurriculumGenerator';

export const CurriculumGenerationPanel = () => {
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const curriculumLevels = [
    {
      level: 'A1',
      name: 'Beginner Foundation',
      weeks: 12,
      lessonsPerWeek: 4,
      totalLessons: 48,
      totalPages: 960,
      description: 'Basic sentence patterns and core vocabulary',
      color: 'bg-green-100 text-green-800',
      themes: [
        'Introductions & Greetings', 'Family & Friends', 'Daily Routines', 'Food & Drinks',
        'Home & Housing', 'Shopping & Money', 'Transportation', 'Health & Body',
        'Work & Jobs', 'Hobbies & Interests', 'Weather & Seasons', 'Time & Dates'
      ]
    },
    {
      level: 'A2',
      name: 'Elementary Building',
      weeks: 14,
      lessonsPerWeek: 4,
      totalLessons: 56,
      totalPages: 1120,
      description: 'Past experiences and future plans',
      color: 'bg-blue-100 text-blue-800',
      themes: [
        'Personal Information', 'Travel & Holidays', 'Education & Learning', 'Technology',
        'Sports & Activities', 'Entertainment', 'Relationships', 'Clothing & Fashion',
        'City Life', 'Countries & Cultures', 'Past Experiences', 'Future Plans',
        'Opinions & Preferences', 'Problems & Solutions'
      ]
    },
    {
      level: 'B1',
      name: 'Intermediate Development',
      weeks: 16,
      lessonsPerWeek: 3,
      totalLessons: 48,
      totalPages: 960,
      description: 'Real-world communication contexts',
      color: 'bg-yellow-100 text-yellow-800',
      themes: [
        'Career Development', 'Environmental Issues', 'Media & News', 'Social Issues',
        'Health & Lifestyle', 'Art & Culture', 'Business & Economy', 'Communication',
        'Innovation & Technology', 'Global Challenges', 'Personal Growth', 'Community',
        'Ethics & Values', 'Science & Discovery', 'Adventure & Risk', 'Traditions'
      ]
    },
    {
      level: 'B2',
      name: 'Upper Intermediate',
      weeks: 18,
      lessonsPerWeek: 3,
      totalLessons: 54,
      totalPages: 1080,
      description: 'Professional and academic communication',
      color: 'bg-orange-100 text-orange-800',
      themes: [
        'Professional Communication', 'Leadership & Management', 'Critical Thinking',
        'Research & Analysis', 'Presentation Skills', 'Negotiation', 'Project Management',
        'Cross-cultural Communication', 'Innovation Strategies', 'Quality Management',
        'Risk Assessment', 'Team Dynamics', 'Change Management', 'Customer Relations',
        'Market Analysis', 'Strategic Planning', 'Performance Evaluation', 'Conflict Resolution'
      ]
    },
    {
      level: 'C1',
      name: 'Advanced Proficiency',
      weeks: 20,
      lessonsPerWeek: 2,
      totalLessons: 40,
      totalPages: 800,
      description: 'Sophisticated language use and complex thoughts',
      color: 'bg-red-100 text-red-800',
      themes: [
        'Academic Writing', 'Research Methodology', 'Advanced Grammar', 'Literature Analysis',
        'Philosophical Discussions', 'Scientific Communication', 'Legal Language',
        'Political Discourse', 'Economic Theory', 'Advanced Presentation',
        'Thesis Development', 'Critical Analysis', 'Complex Argumentation',
        'Abstract Concepts', 'Advanced Vocabulary', 'Stylistic Variation',
        'Discourse Analysis', 'Advanced Listening', 'Professional Writing', 'Fluency Development'
      ]
    },
    {
      level: 'C2',
      name: 'Mastery Level',
      weeks: 24,
      lessonsPerWeek: 2,
      totalLessons: 48,
      totalPages: 960,
      description: 'Native-like fluency and precision',
      color: 'bg-purple-100 text-purple-800',
      themes: [
        'Mastery of Nuance', 'Advanced Literature', 'Complex Academic Texts',
        'Professional Expertise', 'Cultural Sophistication', 'Advanced Rhetoric',
        'Specialized Terminology', 'Expert Communication', 'Advanced Discourse',
        'Precision & Accuracy', 'Cultural Fluency', 'Advanced Pragmatics',
        'Sociolinguistic Competence', 'Advanced Phonology', 'Stylistic Mastery',
        'Expert Reading', 'Advanced Writing', 'Fluent Speaking', 'Native-like Listening',
        'Cultural Integration', 'Advanced Grammar', 'Idiomatic Mastery', 'Register Variation'
      ]
    }
  ];

  const selectedLevelData = curriculumLevels.find(level => level.level === selectedLevel);

  const handleGenerateLevel = async () => {
    if (!selectedLevelData) return;
    
    setIsGenerating(true);
    setProgress(0);

    // Simulate level generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            A-Z Curriculum Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="complete" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="complete" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Complete Generation
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Custom Level
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="complete" className="mt-6">
              <BulkCurriculumGenerator />
            </TabsContent>
            
            <TabsContent value="custom" className="mt-6 space-y-6">
              {/* Level Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {curriculumLevels.map((level) => (
                  <Card 
                    key={level.level}
                    className={`cursor-pointer transition-all ${
                      selectedLevel === level.level ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedLevel(level.level)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className={level.color}>{level.level}</Badge>
                        <span className="text-sm font-medium">{level.totalLessons}</span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{level.name}</h4>
                      <p className="text-xs text-muted-foreground">{level.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Level Details */}
              {selectedLevelData && (
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Badge className={selectedLevelData.color}>
                            {selectedLevelData.level}
                          </Badge>
                          {selectedLevelData.name}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-xl font-bold text-primary">{selectedLevelData.weeks}</div>
                            <div className="text-sm text-muted-foreground">Weeks</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-xl font-bold text-primary">{selectedLevelData.totalLessons}</div>
                            <div className="text-sm text-muted-foreground">Lessons</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-xl font-bold text-primary">{selectedLevelData.totalPages}</div>
                            <div className="text-sm text-muted-foreground">Pages</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-xl font-bold text-primary">{selectedLevelData.lessonsPerWeek}</div>
                            <div className="text-sm text-muted-foreground">Per Week</div>
                          </div>
                        </div>

                        {isGenerating && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Generating {selectedLevelData.level} curriculum...</span>
                              <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={progress} />
                          </div>
                        )}

                        <Button
                          onClick={handleGenerateLevel}
                          disabled={isGenerating}
                          className="w-full mt-4"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <Clock className="h-4 w-4 mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Generate {selectedLevelData.level} Curriculum
                            </>
                          )}
                        </Button>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Curriculum Themes</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {selectedLevelData.themes.map((theme, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <span className="text-sm">{theme}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};