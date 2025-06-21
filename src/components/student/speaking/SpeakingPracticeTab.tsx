
import React, { useState, useEffect } from 'react';
import { SpeakingProgress, SpeakingScenario } from '@/types/speaking';
import { speakingPracticeService } from '@/services/speakingPracticeService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Image, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PracticeSession } from './PracticeSession';
import { SpeakingStats } from './SpeakingStats';
import { SpeakingHeader } from './components/SpeakingHeader';
import { PracticeModeCard } from './components/PracticeModeCard';
import { DailyChallenge } from './components/DailyChallenge';

export const SpeakingPracticeTab = () => {
  const [progress, setProgress] = useState<SpeakingProgress | null>(null);
  const [scenarios, setScenarios] = useState<SpeakingScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario | null>(null);
  const [activeMode, setActiveMode] = useState<'menu' | 'practice'>('menu');
  const [todaysSpeakingTime, setTodaysSpeakingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        setError('Please sign in to use the Speaking Practice feature.');
        return;
      }
      
      setIsAuthenticated(true);
      
      // Load data in parallel
      await Promise.all([
        loadUserProgress(),
        loadScenarios(),
        loadTodaysSpeakingTime()
      ]);
      
    } catch (err) {
      console.error('Error loading speaking practice data:', err);
      setError('Failed to load speaking practice data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const userProgress = await speakingPracticeService.getUserProgress();
      if (!userProgress) {
        const newProgress = await speakingPracticeService.initializeProgress();
        setProgress(newProgress);
      } else {
        setProgress(userProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Don't throw here, just log the error
    }
  };

  const loadScenarios = async () => {
    try {
      const allScenarios = await speakingPracticeService.getScenarios();
      setScenarios(allScenarios);
      
      if (allScenarios.length === 0) {
        console.warn('No speaking scenarios found in database');
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
      throw error;
    }
  };

  const loadTodaysSpeakingTime = async () => {
    try {
      const time = await speakingPracticeService.getTodaysSpeakingTime();
      setTodaysSpeakingTime(time);
    } catch (error) {
      console.error('Error loading today\'s speaking time:', error);
      // Don't throw here, just log the error
    }
  };

  const handleStartPractice = (scenario: SpeakingScenario) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start practicing.",
        variant: "destructive"
      });
      return;
    }
    
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading speaking practice...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <SpeakingHeader />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (activeMode === 'practice' && selectedScenario) {
    return (
      <PracticeSession
        scenario={selectedScenario}
        onComplete={handleSessionComplete}
        onBack={() => setActiveMode('menu')}
      />
    );
  }

  const practiceModesConfig = [
    {
      title: '🎭 Role Play',
      icon: MessageCircle,
      description: 'Practice real-life conversations like ordering food or meeting new people',
      scenarios: getPracticeTypeScenarios('role_play'),
      borderColor: 'hover:border-blue-300',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-700'
    },
    {
      title: '🧠 Picture Talk',
      icon: Image,
      description: 'Describe pictures and practice your vocabulary and speaking skills',
      scenarios: getPracticeTypeScenarios('picture_talk'),
      borderColor: 'hover:border-green-300',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-700'
    },
    {
      title: '❓ Random Questions',
      icon: HelpCircle,
      description: 'Answer fun questions about yourself, your day, and your interests',
      scenarios: getPracticeTypeScenarios('random_questions'),
      borderColor: 'hover:border-purple-300',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-700'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <SpeakingHeader />

      <SpeakingStats 
        progress={progress}
        todaysSpeakingTime={todaysSpeakingTime}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {practiceModesConfig.map((mode, index) => (
          <PracticeModeCard
            key={index}
            title={mode.title}
            icon={mode.icon}
            description={mode.description}
            scenarios={mode.scenarios}
            borderColor={mode.borderColor}
            iconBgColor={mode.iconBgColor}
            iconColor={mode.iconColor}
            titleColor={mode.titleColor}
            onStartPractice={handleStartPractice}
          />
        ))}
      </div>

      <DailyChallenge todaysSpeakingTime={todaysSpeakingTime} />
    </div>
  );
};
