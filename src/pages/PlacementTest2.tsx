import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { placementTest2 } from '@/data/placement/placementTest2';
import { ActivityResult } from '@/types/slides';
import { WelcomeScreen } from '@/components/placement-test/WelcomeScreen';
import { ResultsScreen } from '@/components/placement-test/ResultsScreen';
import { TestInterface } from '@/components/placement-test/TestInterface';
import { Star, BookOpen, Target, Trophy, Award } from 'lucide-react';

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
    
    results.forEach(result => {
      if (result.correct) totalScore++;
    });
    
    const percentage = Math.round((totalScore / maxScore) * 100);
    
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
    
    if (slideIndex === 5) {
      newBadges[0].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Listening Star - Great job with the listening exercises!",
      });
    } else if (slideIndex === 9) {
      newBadges[1].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Reading Explorer - Excellent reading comprehension!",
      });
    } else if (slideIndex === 15) {
      newBadges[2].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Grammar & Vocab Master - Outstanding language skills!",
      });
    } else if (slideIndex === 19) {
      newBadges[3].earned = true;
      toast({
        title: "🎖️ Badge Earned!",
        description: "Writing Hero - Impressive writing abilities!",
      });
    } else if (slideIndex === 23) {
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
      awardBadges(nextSlide);
    } else {
      const cefrResult = calculateCEFRLevel(results);
      setCefrResult(cefrResult);
      setTestCompleted(true);
      
      toast({
        title: "🎉 Test Complete!",
        description: `Your CEFR Level: ${cefrResult.level}`,
      });
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
      cefr: 'unknown'
    };
    
    setResults(prev => [...prev, newResult]);
    setShowFeedback(true);
    setIsCorrect(result.correct);
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

  const goHome = () => {
    navigate('/');
  };

  const progress = ((currentSlide + 1) / placementTest2.slides.length) * 100;

  if (!testStarted) {
    return <WelcomeScreen onStart={startTest} />;
  }

  if (testCompleted && cefrResult) {
    return (
      <ResultsScreen
        cefrResult={cefrResult}
        badges={badges}
        timeElapsed={timeElapsed}
        onRestart={restartTest}
        onGoHome={goHome}
      />
    );
  }

  const slide = placementTest2.slides[currentSlide];

  return (
    <TestInterface
      slide={slide}
      currentSlide={currentSlide}
      totalSlides={placementTest2.slides.length}
      progress={progress}
      timeElapsed={timeElapsed}
      badges={badges}
      selectedOptions={Object.keys(selectedOptions).map(key => selectedOptions[key])}
      showFeedback={showFeedback}
      isCorrect={isCorrect}
      onNext={handleNext}
      onActivityResult={handleActivityResult}
      onOptionSelect={handleOptionSelect}
    />
  );
}
