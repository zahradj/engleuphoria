import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Home,
  Sparkles,
  Zap
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6"
        >
          <Logo size="medium" />
        </motion.div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto pt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-xl">
              <CardHeader className="text-center space-y-6 pb-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="mx-auto relative"
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-3xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-14 w-14 text-primary-foreground" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="h-8 w-8 text-primary" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-3">
                    English Adventure Test
                  </CardTitle>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Complete placement test from A1 → C2. Earn badges and discover your perfect level!
                  </p>
                </motion.div>
              </CardHeader>
              
              <CardContent className="space-y-8 pt-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid md:grid-cols-3 gap-4"
                >
                  {[
                    { icon: Clock, title: "Duration", value: "25 minutes", color: "primary" },
                    { icon: Trophy, title: "25 Questions", value: "All skill areas", color: "secondary" },
                    { icon: Star, title: "5 Badges", value: "Earn as you progress", color: "accent" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`flex items-center gap-3 p-5 bg-${item.color}/5 rounded-xl border border-${item.color}/20 shadow-sm hover:shadow-md transition-all`}
                    >
                      <div className={`p-2 bg-${item.color}/10 rounded-lg`}>
                        <item.icon className={`h-6 w-6 text-${item.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 rounded-2xl border-2 border-primary/20"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    What You'll Get:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      { icon: "✨", text: "Your precise CEFR level (A1-C2)" },
                      { icon: "🎯", text: "Strengths and areas for improvement" },
                      { icon: "📚", text: "Personalized curriculum recommendations" },
                      { icon: "🏆", text: "Achievement badges for motivation" }
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-3 text-sm font-medium"
                      >
                        <span className="text-2xl">{benefit.icon}</span>
                        <span>{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    onClick={startTest}
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:to-secondary/80 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Start English Adventure
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (testCompleted && cefrResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 left-6"
        >
          <Logo size="medium" />
        </motion.div>
        
        {/* Celebration confetti effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: Math.random() * 720,
                opacity: 0
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity
              }}
              className={`absolute w-3 h-3 rounded-full ${
                i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'
              }`}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto pt-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-xl">
              <CardHeader className="text-center space-y-6 pb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                  transition={{ 
                    scale: { type: "spring", stiffness: 200, damping: 15 },
                    rotate: { delay: 0.3, duration: 0.5 }
                  }}
                  className="mx-auto relative"
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <Trophy className="h-14 w-14 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-3 -right-3"
                  >
                    <Sparkles className="h-10 w-10 text-yellow-500" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
                    Congratulations! 🎉
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">You've completed the English Adventure Test!</p>
                </motion.div>
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
          </motion.div>
        </div>
      </div>
    );
  }

  // Main Test Interface
  const slide = placementTest2.slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Logo size="small" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Exit Test
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div
              key={currentSlide}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Badge variant="outline" className="text-sm font-semibold px-4 py-2 bg-primary/5 border-primary/20">
                Question {currentSlide + 1} of {placementTest2.slides.length}
              </Badge>
            </motion.div>
            
            <div className="flex items-center gap-6">
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
              </motion.div>
              
              <div className="flex gap-2 bg-card p-2 rounded-lg border shadow-sm">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: badge.earned ? [0, 1.3, 1] : 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <badge.icon
                      className={`h-5 w-5 transition-all ${
                        badge.earned 
                          ? 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' 
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Progress value={progress} className="h-3 shadow-sm" />
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-primary to-secondary rounded-full opacity-50 blur-sm"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SlideMaster
              slide={slide}
              currentSlide={currentSlide}
              totalSlides={placementTest2.slides.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onOptionSelect={handleOptionSelect}
              onActivityResult={handleActivityResult}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}