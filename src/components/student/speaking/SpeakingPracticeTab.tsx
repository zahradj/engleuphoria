
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SpeakingProgress, SpeakingScenario } from '@/types/speaking';
import { speakingPracticeService } from '@/services/speakingPracticeService';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  MessageCircle, 
  Image, 
  HelpCircle, 
  Trophy, 
  Flame,
  Clock,
  Star,
  PlayCircle
} from 'lucide-react';
import { PracticeSession } from './PracticeSession';
import { SpeakingStats } from './SpeakingStats';

export const SpeakingPracticeTab = () => {
  const [progress, setProgress] = useState<SpeakingProgress | null>(null);
  const [scenarios, setScenarios] = useState<SpeakingScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario | null>(null);
  const [activeMode, setActiveMode] = useState<'menu' | 'practice'>('menu');
  const [todaysSpeakingTime, setTodaysSpeakingTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProgress();
    loadScenarios();
    loadTodaysSpeakingTime();
  }, []);

  const loadUserProgress = async () => {
    try {
      const userProgress = await speakingPracticeService.getUserProgress('current-user-id');
      if (!userProgress) {
        const newProgress = await speakingPracticeService.initializeProgress('current-user-id');
        setProgress(newProgress);
      } else {
        setProgress(userProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadScenarios = async () => {
    try {
      const allScenarios = await speakingPracticeService.getScenarios();
      setScenarios(allScenarios);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    }
  };

  const loadTodaysSpeakingTime = async () => {
    try {
      const time = await speakingPracticeService.getTodaysSpeakingTime('current-user-id');
      setTodaysSpeakingTime(time);
    } catch (error) {
      console.error('Error loading today\'s speaking time:', error);
    }
  };

  const handleStartPractice = (scenario: SpeakingScenario) => {
    setSelectedScenario(scenario);
    setActiveMode('practice');
  };

  const handleSessionComplete = async (sessionData: any) => {
    await loadUserProgress();
    await loadTodaysSpeakingTime();
    setActiveMode('menu');
    setSelectedScenario(null);
    
    toast({
      title: "Great job! 🎉",
      description: `You earned ${sessionData.xp_earned} XP for completing "${sessionData.scenario_name}"!`
    });
  };

  const getPracticeTypeScenarios = (type: string) => {
    return scenarios.filter(s => s.type === type);
  };

  if (activeMode === 'practice' && selectedScenario) {
    return (
      <PracticeSession
        scenario={selectedScenario}
        onComplete={handleSessionComplete}
        onBack={() => setActiveMode('menu')}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🎙️ AI Speaking Practice
        </h1>
        <p className="text-gray-600 mt-2">Practice your English with our friendly AI assistant!</p>
      </div>

      {/* Stats Overview */}
      <SpeakingStats 
        progress={progress}
        todaysSpeakingTime={todaysSpeakingTime}
      />

      {/* Practice Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role Play */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-blue-700">🎭 Role Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Practice real-life conversations like ordering food or meeting new people
            </p>
            <div className="space-y-2">
              {getPracticeTypeScenarios('role_play').slice(0, 3).map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  className="w-full justify-between text-left"
                  onClick={() => handleStartPractice(scenario)}
                >
                  <span>{scenario.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{scenario.cefr_level}</Badge>
                    <PlayCircle className="h-4 w-4" />
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Picture Talk */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Image className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-700">🧠 Picture Talk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Describe pictures and practice your vocabulary and speaking skills
            </p>
            <div className="space-y-2">
              {getPracticeTypeScenarios('picture_talk').slice(0, 3).map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  className="w-full justify-between text-left"
                  onClick={() => handleStartPractice(scenario)}
                >
                  <span>{scenario.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{scenario.cefr_level}</Badge>
                    <PlayCircle className="h-4 w-4" />
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Random Questions */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-xl text-purple-700">❓ Random Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Answer fun questions about yourself, your day, and your interests
            </p>
            <div className="space-y-2">
              {getPracticeTypeScenarios('random_questions').slice(0, 3).map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  className="w-full justify-between text-left"
                  onClick={() => handleStartPractice(scenario)}
                >
                  <span>{scenario.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{scenario.cefr_level}</Badge>
                    <PlayCircle className="h-4 w-4" />
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenge */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Trophy className="h-5 w-5" />
            Daily Speaking Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">Speak for 5 minutes today to earn bonus XP!</p>
              <div className="flex items-center gap-2 mt-2">
                <Progress 
                  value={Math.min((todaysSpeakingTime / 300) * 100, 100)} 
                  className="w-48" 
                />
                <span className="text-sm text-gray-600">
                  {Math.floor(todaysSpeakingTime / 60)}m / 5m
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">+50 XP</div>
              <div className="text-sm text-gray-600">Bonus Reward</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
