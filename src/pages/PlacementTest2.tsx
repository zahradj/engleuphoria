import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { SlideMaster } from '@/components/slides/SlideMaster';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { placementTest2 } from '@/data/placement/placementTest2';
import { ActivityResult } from '@/types/slides';
import { 
  Clock, 
  Trophy,
  BookOpen,
  Star,
  Award,
  Target,
  ChevronRight,
  Home
} from 'lucide-react';

interface CEFRResult {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  percentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendedStart: string;
}

interface Badge {
  id: string;
  name: string;
  icon: React.ElementType;
  earned: boolean;
}

export default function PlacementTest2() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [results, setResults] = useState<ActivityResult[]>([]);
  const [cefrResult, setCefrResult] = useState<CEFRResult | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [badges, setBadges] = useState<Badge[]>([
    { id: 'listening', name: 'Listening Star', icon: Star, earned: false },
    { id: 'reading', name: 'Reading Explorer', icon: BookOpen, earned: false },
    { id: 'grammar', name: 'Grammar & Vocab Master', icon: Target, earned: false },
    { id: 'writing', name: 'Writing Hero', icon: Trophy, earned: false },
    { id: 'advanced', name: 'Advanced Champion', icon: Award, earned: false }
  ]);

  // Timer
  useEffect(() => {
    if (testStarted && !testCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setTestStarted(true);
    toast({
      title: "Test Started! 🚀",
      description: "Take your time and do your best. Earn badges as you progress!",
    });
  };

  const calculateCEFRLevel = (results: ActivityResult[]): CEFRResult => {
    let totalScore = 0;
    let maxScore = results.length;
    
    // Calculate score
    results.forEach(result => {
      if (result.correct) totalScore++;
    });
    
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    // Determine CEFR level based on adaptive scoring
    let level: CEFRResult['level'];
    let recommendedStart: string;
    
    if (percentage < 25) {
      level = 'A1';
      recommendedStart = 'A1, Module 1 - Basic Vocabulary';
    } else if (percentage < 40) {
      level = 'A2';
      recommendedStart = 'A2, Module 1 - Elementary Grammar';
    } else if (percentage < 60) {
      level = 'B1';
      recommendedStart = 'B1, Module 2 - Daily Life';
    } else if (percentage < 75) {
      level = 'B2';
      recommendedStart = 'B2, Module 1 - Intermediate Skills';
    } else if (percentage < 90) {
      level = 'C1';
      recommendedStart = 'C1, Module 1 - Advanced Communication';
    } else {
      level = 'C2';
      recommendedStart = 'C2, Module 1 - Mastery Level';
    }
    
    // Analyze strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    const listeningCorrect = results.filter(r => r.tags.includes('listening_skill') && r.correct).length;
    const listeningTotal = results.filter(r => r.tags.includes('listening_skill')).length;
    if (listeningTotal > 0 && (listeningCorrect / listeningTotal) > 0.7) {
      strengths.push('Listening');
    } else if (listeningTotal > 0) {
      weaknesses.push('Listening');
    }
    
    const readingCorrect = results.filter(r => r.tags.includes('reading_skill') && r.correct).length;
    const readingTotal = results.filter(r => r.tags.includes('reading_skill')).length;
    if (readingTotal > 0 && (readingCorrect / readingTotal) > 0.7) {
      strengths.push('Reading');
    } else if (readingTotal > 0) {
      weaknesses.push('Reading');
    }
    
    const grammarCorrect = results.filter(r => r.tags.includes('grammar_skill') && r.correct).length;
    const grammarTotal = results.filter(r => r.tags.includes('grammar_skill')).length;
    if (grammarTotal > 0 && (grammarCorrect / grammarTotal) > 0.7) {
      strengths.push('Grammar & Vocabulary');
    } else if (grammarTotal > 0) {
      weaknesses.push('Grammar & Vocabulary');
    }
    
    return {
      level,
      percentage,
      strengths: strengths.length > 0 ? strengths : ['Basic Communication'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['None identified'],
      recommendedStart
    };
  };

  const awardBadges = (slideIndex: number) => {
    const newBadges = [...badges];
    
    // Award badges at specific milestones
    if (slideIndex === 5) { // After listening section
      newBadges[0].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Listening Star - Great job with the listening exercises!",
      });
    } else if (slideIndex === 9) { // After reading section
      newBadges[1].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Reading Explorer - Excellent reading comprehension!",
      });
    } else if (slideIndex === 15) { // After grammar section
      newBadges[2].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Grammar & Vocab Master - Outstanding language skills!",
      });
    } else if (slideIndex === 19) { // After writing section
      newBadges[3].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Writing Hero - Impressive writing abilities!",
      });
    } else if (slideIndex === 23) { // After advanced section
      newBadges[4].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Advanced Champion - You've mastered advanced English!",
      });
    }
    
    setBadges(newBadges);
  };

  const handleNext = () => {
    if (currentSlide < placementTest2.slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      setShowFeedback(false);
      setIsCorrect(false);
      
      // Award badges at milestones
      awardBadges(nextSlide);
    } else {
      // Test completed
      const cefrResult = calculateCEFRLevel(results);
      setCefrResult(cefrResult);
      setTestCompleted(true);
      
      toast({
        title: "🎉 Test Complete!",
        description: `Your CEFR Level: ${cefrResult.level}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    const slide = placementTest2.slides[currentSlide];
    setSelectedOptions(prev => ({
      ...prev,
      [slide.id]: optionId
    }));

    // For MCQ slides, automatically trigger activity result
    if (slide.type === 'accuracy_mcq' && slide.options) {
      const selectedOption = slide.options.find(opt => opt.id === optionId);
      const isCorrect = selectedOption?.isCorrect || false;
      
      const result: ActivityResult = {
        itemId: slide.id,
        correct: isCorrect,
        timeMs: 0,
        attempts: 1,
        tags: [slide.type],
        cefr: 'unknown'
      };
      
      handleActivityResult(result);
    }
  };

  const handleActivityResult = (result: ActivityResult) => {
    const slideId = placementTest2.slides[currentSlide].id;
    const slideType = placementTest2.slides[currentSlide].type;
    
    // Add contextual tags based on slide type and position
    const tags: string[] = [slideType];
    if (currentSlide >= 2 && currentSlide <= 4) tags.push('listening_skill');
    if (currentSlide >= 5 && currentSlide <= 8) tags.push('reading_skill');
    if (currentSlide >= 9 && currentSlide <= 14) tags.push('grammar_skill', 'vocabulary_skill');
    if (currentSlide >= 15 && currentSlide <= 18) tags.push('writing_skill');
    if (currentSlide >= 19) tags.push('advanced_skill');
    
    const newResult: ActivityResult = {
      ...result,
      itemId: slideId,
      tags,
      cefr: 'unknown' // Will be determined after completion
    };
    
    setResults(prev => [...prev, newResult]);
    setShowFeedback(true);
    setIsCorrect(result.correct);
  };

  const restartTest = () => {
    setCurrentSlide(0);
    setTestStarted(false);
    setTestCompleted(false);
    setTimeElapsed(0);
    setResults([]);
    setCefrResult(null);
    setSelectedOptions({});
    setShowFeedback(false);
    setIsCorrect(false);
    setBadges(prev => prev.map(badge => ({ ...badge, earned: false })));
  };

  const progress = ((currentSlide + 1) / placementTest2.slides.length) * 100;

  // Welcome Screen
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="absolute top-6 left-6">
          <Logo size="medium" />
        </div>
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                English Adventure Test 🚀
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Complete placement test from A1 → C2. Earn badges and discover your perfect level!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">25 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg">
                  <Trophy className="h-6 w-6 text-secondary" />
                  <div>
                    <p className="font-medium">25 Questions</p>
                    <p className="text-sm text-muted-foreground">All skill areas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg">
                  <Star className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-medium">5 Badges</p>
                    <p className="text-sm text-muted-foreground">Earn as you progress</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  What You'll Get:
                </h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>✨ Your precise CEFR level (A1-C2)</li>
                  <li>🎯 Strengths and areas for improvement</li>
                  <li>📚 Personalized curriculum recommendations</li>
                  <li>🏆 Achievement badges for motivation</li>
                </ul>
              </div>

              <Button 
                onClick={startTest}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                Start English Adventure 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (testCompleted && cefrResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="absolute top-6 left-6">
          <Logo size="medium" />
        </div>
        <div className="max-w-4xl mx-auto pt-10">
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                🎉 Congratulations!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* CEFR Level */}
              <div className="text-center">
                <div className="inline-block p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/20">
                  <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-2xl px-6 py-3">
                    CEFR Level: {cefrResult.level}
                  </Badge>
                  <p className="text-lg text-muted-foreground">
                    Score: {cefrResult.percentage}% • Time: {formatTime(timeElapsed)}
                  </p>
                </div>
              </div>

              {/* Badges Earned */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Badges Earned 🏆</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        badge.earned
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                          : 'bg-muted/30 border-muted'
                      }`}
                    >
                      <badge.icon 
                        className={`h-8 w-8 mx-auto mb-2 ${
                          badge.earned ? 'text-yellow-600' : 'text-muted-foreground'
                        }`} 
                      />
                      <p className={`text-sm font-medium ${
                        badge.earned ? 'text-yellow-800' : 'text-muted-foreground'
                      }`}>
                        {badge.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">💪 Strengths:</h4>
                  <ul className="space-y-2">
                    {cefrResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-700">🎯 Focus Areas:</h4>
                  <ul className="space-y-2">
                    {cefrResult.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Recommended Start:
                </h4>
                <p className="text-lg font-medium text-primary">{cefrResult.recommendedStart}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={restartTest}
                  className="flex-1"
                >
                  Take Again
                </Button>
                <Button 
                  onClick={() => navigate('/student')}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Start Learning <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="px-4"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Test Interface
  const slide = placementTest2.slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="absolute top-6 left-6">
        <Logo size="medium" />
      </div>
      
      {/* Header */}
      <div className="max-w-4xl mx-auto pt-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="text-sm">
              Question {currentSlide + 1} of {placementTest2.slides.length}
            </Badge>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
              <div className="flex gap-1">
                {badges.slice(0, 3).map((badge, index) => (
                  <badge.icon 
                    key={index}
                    className={`h-5 w-5 ${
                      badge.earned ? 'text-yellow-500' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Slide Content */}
        <SlideMaster
          slide={slide}
          currentSlide={currentSlide}
          totalSlides={placementTest2.slides.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onOptionSelect={handleOptionSelect}
          onActivityResult={handleActivityResult}
          selectedOptions={selectedOptions[slide.id] ? [selectedOptions[slide.id]] : []}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
        />
      </div>
    </div>
  );
}