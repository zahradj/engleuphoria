import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Target, Users, ArrowLeft, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const CurriculumGeneration = () => {
  const navigate = useNavigate();

  const curriculumOptions = [
    {
      id: 'a1-basics',
      title: 'A1 English Basics',
      level: 'A1',
      modules: 6,
      lessons: 24,
      description: 'Perfect for absolute beginners. Learn greetings, introductions, basic vocabulary, and simple conversations.',
      topics: ['Greetings & Introductions', 'Numbers & Colors', 'Family & Friends', 'Daily Routines', 'Food & Drinks', 'Basic Questions'],
      estimatedTime: '3-4 months',
      color: 'bg-green-500'
    },
    {
      id: 'a2-elementary',
      title: 'A2 Elementary Skills',
      level: 'A2',
      modules: 8,
      lessons: 32,
      description: 'Build on your foundation with more complex grammar and vocabulary for everyday situations.',
      topics: ['Past & Future Tenses', 'Describing Places', 'Shopping & Money', 'Travel & Transport', 'Health & Body', 'Hobbies & Interests'],
      estimatedTime: '4-5 months',
      color: 'bg-blue-500'
    },
    {
      id: 'b1-intermediate',
      title: 'B1 Intermediate Communication',
      level: 'B1',
      modules: 10,
      lessons: 40,
      description: 'Develop fluency in more complex topics and start expressing opinions and ideas clearly.',
      topics: ['Complex Grammar', 'Work & Career', 'Technology', 'Environment', 'Culture & Society', 'Problem Solving'],
      estimatedTime: '5-6 months',
      color: 'bg-orange-500'
    }
  ];

  const sampleLessons = [
    {
      title: 'A1 M1 L1: Greetings & Introductions',
      description: 'Learn to greet people and introduce yourself with confidence',
      level: 'A1',
      duration: '30 min',
      activities: ['Interactive Dialogues', 'Vocabulary Cards', 'Speaking Practice', 'Mini Quiz'],
      available: true,
      route: ''
    },
    {
      title: 'A1 M1 L2: Numbers & Age',
      description: 'Master numbers 1-100 and talk about your age',
      level: 'A1',
      duration: '25 min',
      activities: ['Number Games', 'Age Practice', 'Listening Exercise', 'Review Quiz'],
      available: false
    },
    {
      title: 'A2 M1 L1: Past Tense Stories',
      description: 'Learn to tell stories about what happened yesterday',
      level: 'A2',
      duration: '35 min',
      activities: ['Story Building', 'Grammar Practice', 'Timeline Activities', 'Speaking Tasks'],
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Curriculum Generation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized learning paths powered by AI, designed for your specific level and goals
            </p>
          </div>
        </div>

        {/* Curriculum Options */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {curriculumOptions.map((curriculum) => (
            <Card key={curriculum.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={cn("text-white", curriculum.color)}>
                    {curriculum.level}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {curriculum.estimatedTime}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {curriculum.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {curriculum.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {curriculum.modules} modules
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {curriculum.lessons} lessons
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {curriculum.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {curriculum.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{curriculum.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Curriculum
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sample Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Try Sample Lessons
            </CardTitle>
            <p className="text-muted-foreground">
              Experience our interactive lessons before committing to a full curriculum
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleLessons.map((lesson) => (
                <Card key={lesson.title} className={cn(
                  "transition-all duration-200",
                  lesson.available 
                    ? "hover:shadow-md cursor-pointer border-primary/20" 
                    : "opacity-60 cursor-not-allowed"
                )}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={lesson.available ? "default" : "secondary"}>
                          {lesson.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {lesson.duration}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-1">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {lesson.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Activities:</p>
                        <div className="flex flex-wrap gap-1">
                          {lesson.activities.map((activity) => (
                            <Badge key={activity} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        disabled={!lesson.available}
                        onClick={() => lesson.available && navigate(lesson.route)}
                      >
                        {lesson.available ? 'Try Lesson' : 'Coming Soon'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurriculumGeneration;