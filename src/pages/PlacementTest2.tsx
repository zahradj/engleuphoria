import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  Trophy,
  BookOpen,
  Star,
  Sparkles
} from 'lucide-react';

interface Question {
  id: number;
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  points: number;
  category: 'grammar' | 'vocabulary' | 'reading' | 'writing';
}

interface TestResult {
  score: number;
  totalPoints: number;
  cefrLevel: string;
  breakdown: {
    grammar: number;
    vocabulary: number;
    reading: number;
    writing: number;
  };
  recommendations: string[];
}

const advancedQuestions: Question[] = [
  // A1 Level
  { id: 1, type: 'multiple-choice', question: 'I _____ from Spain.', options: ['am', 'is', 'are', 'be'], correctAnswer: 0, cefrLevel: 'A1', points: 1, category: 'grammar' },
  { id: 2, type: 'multiple-choice', question: 'She _____ a teacher.', options: ['am', 'is', 'are', 'be'], correctAnswer: 1, cefrLevel: 'A1', points: 1, category: 'grammar' },
  { id: 3, type: 'multiple-choice', question: 'What is the plural of "child"?', options: ['childs', 'children', 'childes', 'childen'], correctAnswer: 1, cefrLevel: 'A1', points: 1, category: 'vocabulary' },
  
  // A2 Level
  { id: 4, type: 'multiple-choice', question: 'Yesterday, I _____ to the cinema.', options: ['go', 'went', 'gone', 'going'], correctAnswer: 1, cefrLevel: 'A2', points: 2, category: 'grammar' },
  { id: 5, type: 'multiple-choice', question: 'I _____ living in this city for three years.', options: ['am', 'have been', 'was', 'will be'], correctAnswer: 1, cefrLevel: 'A2', points: 2, category: 'grammar' },
  { id: 6, type: 'multiple-choice', question: 'Choose the correct comparative: "This book is _____ than that one."', options: ['good', 'better', 'best', 'gooder'], correctAnswer: 1, cefrLevel: 'A2', points: 2, category: 'vocabulary' },
  
  // B1 Level
  { id: 7, type: 'multiple-choice', question: 'If I _____ you, I would accept the job.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2, cefrLevel: 'B1', points: 3, category: 'grammar' },
  { id: 8, type: 'multiple-choice', question: 'The book _____ I read last week was fascinating.', options: ['what', 'which', 'who', 'where'], correctAnswer: 1, cefrLevel: 'B1', points: 3, category: 'grammar' },
  { id: 9, type: 'multiple-choice', question: 'She has been working here _____ 2015.', options: ['for', 'since', 'during', 'from'], correctAnswer: 1, cefrLevel: 'B1', points: 3, category: 'grammar' },
  { id: 10, type: 'multiple-choice', question: 'What does "break the ice" mean?', options: ['To destroy something', 'To start a conversation', 'To be very cold', 'To cancel plans'], correctAnswer: 1, cefrLevel: 'B1', points: 3, category: 'vocabulary' },
  
  // B2 Level
  { id: 11, type: 'multiple-choice', question: 'By this time next year, I _____ my degree.', options: ['complete', 'will complete', 'will have completed', 'am completing'], correctAnswer: 2, cefrLevel: 'B2', points: 4, category: 'grammar' },
  { id: 12, type: 'multiple-choice', question: 'Had I known about the meeting, I _____ attended.', options: ['would', 'will', 'would have', 'had'], correctAnswer: 2, cefrLevel: 'B2', points: 4, category: 'grammar' },
  { id: 13, type: 'multiple-choice', question: 'The proposal _____ by the committee last week.', options: ['is rejected', 'was rejected', 'rejected', 'has rejected'], correctAnswer: 1, cefrLevel: 'B2', points: 4, category: 'grammar' },
  { id: 14, type: 'multiple-choice', question: 'Which word means "to make something seem less important"?', options: ['Exaggerate', 'Minimize', 'Emphasize', 'Highlight'], correctAnswer: 1, cefrLevel: 'B2', points: 4, category: 'vocabulary' },
  
  // C1 Level
  { id: 15, type: 'multiple-choice', question: 'Scarcely _____ the door when the phone rang.', options: ['I had opened', 'had I opened', 'I opened', 'did I open'], correctAnswer: 1, cefrLevel: 'C1', points: 5, category: 'grammar' },
  { id: 16, type: 'multiple-choice', question: 'The research _____ new insights into the problem.', options: ['yielded', 'gave', 'provided', 'offered'], correctAnswer: 0, cefrLevel: 'C1', points: 5, category: 'vocabulary' },
  { id: 17, type: 'multiple-choice', question: 'Not only _____ the exam, but she also got the highest score.', options: ['she passed', 'did she pass', 'she did pass', 'passed she'], correctAnswer: 1, cefrLevel: 'C1', points: 5, category: 'grammar' },
  
  // C2 Level
  { id: 18, type: 'multiple-choice', question: 'The subtle _____ in his argument revealed deep philosophical understanding.', options: ['nuances', 'differences', 'changes', 'variations'], correctAnswer: 0, cefrLevel: 'C2', points: 6, category: 'vocabulary' },
  { id: 19, type: 'multiple-choice', question: 'Were it not for your assistance, the project _____ failed.', options: ['would have', 'will have', 'had', 'has'], correctAnswer: 0, cefrLevel: 'C2', points: 6, category: 'grammar' },
  { id: 20, type: 'multiple-choice', question: 'The author\'s prose is characterized by its _____ and economy of expression.', options: ['verbosity', 'prolixity', 'terseness', 'redundancy'], correctAnswer: 2, cefrLevel: 'C2', points: 6, category: 'vocabulary' },
];

export default function PlacementTest2() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(advancedQuestions.length).fill(-1));
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (testStarted && !testCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted]);

  useEffect(() => {
    setSelectedAnswer(answers[currentQuestion]);
  }, [currentQuestion, answers]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setTestStarted(true);
    toast({
      title: "Advanced Test Started!",
      description: "This comprehensive test will determine your precise CEFR level.",
    });
  };

  const saveAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (currentQuestion < advancedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = (): TestResult => {
    let score = 0;
    let totalPoints = 0;
    const breakdown = { grammar: 0, vocabulary: 0, reading: 0, writing: 0 };
    const categoryTotals = { grammar: 0, vocabulary: 0, reading: 0, writing: 0 };

    advancedQuestions.forEach((question, index) => {
      totalPoints += question.points;
      categoryTotals[question.category] += question.points;
      
      if (answers[index] === question.correctAnswer) {
        score += question.points;
        breakdown[question.category] += question.points;
      }
    });

    // Calculate percentage per category
    Object.keys(breakdown).forEach((key) => {
      const categoryKey = key as keyof typeof breakdown;
      breakdown[categoryKey] = Math.round((breakdown[categoryKey] / categoryTotals[categoryKey]) * 100);
    });

    const percentage = (score / totalPoints) * 100;
    
    let cefrLevel = '';
    let recommendations: string[] = [];

    if (percentage >= 90) {
      cefrLevel = 'C2';
      recommendations = [
        'Proficiency level! You have mastery of the language.',
        'Focus on specialized vocabulary in your field of interest',
        'Engage with complex academic and professional texts',
        'Practice nuanced expression and sophisticated argumentation'
      ];
    } else if (percentage >= 80) {
      cefrLevel = 'C1';
      recommendations = [
        'Advanced level! You can use English fluently and flexibly.',
        'Work on subtle language distinctions and stylistic nuances',
        'Engage with complex literature and academic writing',
        'Practice advanced discourse markers and cohesive devices'
      ];
    } else if (percentage >= 70) {
      cefrLevel = 'B2';
      recommendations = [
        'Upper-Intermediate! You can interact with native speakers fluently.',
        'Focus on complex grammar structures and idioms',
        'Practice detailed argument development',
        'Expand academic and professional vocabulary'
      ];
    } else if (percentage >= 55) {
      cefrLevel = 'B1';
      recommendations = [
        'Intermediate level! You can handle most everyday situations.',
        'Work on conditional sentences and passive voice',
        'Practice expressing opinions and giving reasons',
        'Build vocabulary for abstract topics'
      ];
    } else if (percentage >= 40) {
      cefrLevel = 'A2';
      recommendations = [
        'Elementary level! You can communicate in simple situations.',
        'Focus on past tenses and future forms',
        'Practice common phrasal verbs',
        'Expand everyday vocabulary'
      ];
    } else {
      cefrLevel = 'A1';
      recommendations = [
        'Beginner level! You\'re starting your journey.',
        'Focus on present simple and basic sentence structures',
        'Build fundamental vocabulary',
        'Practice simple conversations'
      ];
    }

    return { score, totalPoints, cefrLevel, breakdown, recommendations };
  };

  const completeTest = async () => {
    const testResult = calculateResult();
    setResult(testResult);
    setTestCompleted(true);
    
    // Save to database
    if (user?.id) {
      try {
        await supabase
          .from('student_profiles')
          .upsert({
            user_id: user.id,
            placement_test_2_score: testResult.score,
            placement_test_2_total: testResult.totalPoints,
            placement_test_2_completed_at: new Date().toISOString(),
            final_cefr_level: testResult.cefrLevel
          }, {
            onConflict: 'user_id'
          });

        toast({
          title: "Test Completed!",
          description: `Your CEFR level: ${testResult.cefrLevel}. Results saved successfully!`,
        });
      } catch (error) {
        console.error('Error saving test results:', error);
        toast({
          title: "Test Completed!",
          description: `Your CEFR level: ${testResult.cefrLevel}`,
        });
      }
    }
  };

  const progress = ((currentQuestion + 1) / advancedQuestions.length) * 100;
  const answeredQuestions = answers.filter(answer => answer !== -1).length;

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <div className="absolute top-6 left-6">
          <Logo size="medium" />
        </div>
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Full Adventure Test (A1→C2)
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Comprehensive CEFR placement test for precise level assessment
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Duration</p>
                    <p className="text-sm text-purple-700">Approximately 25-30 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Questions</p>
                    <p className="text-sm text-blue-700">{advancedQuestions.length} questions across all CEFR levels</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Star className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Assessment</p>
                    <p className="text-sm text-green-700">Precise CEFR level (A1, A2, B1, B2, C1, C2)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                <h4 className="font-medium text-purple-800 mb-2">What to Expect:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Progressive difficulty from A1 to C2</li>
                  <li>• Grammar, vocabulary, reading comprehension</li>
                  <li>• Detailed skill breakdown by category</li>
                  <li>• Personalized learning recommendations</li>
                </ul>
              </div>

              <Button 
                onClick={startTest}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Start Advanced Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (testCompleted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <div className="absolute top-6 left-6">
          <Logo size="medium" />
        </div>
        <div className="max-w-3xl mx-auto pt-10">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Assessment Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <Badge className="mb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl px-6 py-3">
                    CEFR Level: {result.cefrLevel}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Score: {result.score}/{result.totalPoints} ({Math.round((result.score / result.totalPoints) * 100)}%)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Grammar</p>
                    <p className="text-2xl font-bold text-blue-600">{result.breakdown.grammar}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-700 mb-1">Vocabulary</p>
                    <p className="text-2xl font-bold text-purple-600">{result.breakdown.vocabulary}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">Reading</p>
                    <p className="text-2xl font-bold text-green-600">{result.breakdown.reading || 0}%</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-700 mb-1">Writing</p>
                    <p className="text-2xl font-bold text-orange-600">{result.breakdown.writing || 0}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Your Learning Path</h3>
                <div className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => navigate('/student')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = advancedQuestions[currentQuestion];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="absolute top-6 left-6">
        <Logo size="medium" />
      </div>
      <div className="max-w-4xl mx-auto pt-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="text-sm">
              Question {currentQuestion + 1} of {advancedQuestions.length}
            </Badge>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                {question.cefrLevel} - {question.category}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {answeredQuestions} of {advancedQuestions.length} questions answered
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
              </div>

              <RadioGroup
                value={selectedAnswer.toString()}
                onValueChange={(value) => saveAnswer(parseInt(value))}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all hover:bg-gray-50 cursor-pointer ${
                      selectedAnswer === index 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => saveAnswer(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-left"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={nextQuestion}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {currentQuestion === advancedQuestions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
