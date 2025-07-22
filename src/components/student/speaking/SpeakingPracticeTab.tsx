
import React, { useState, useEffect } from 'react';
import { SpeakingProgress, SpeakingScenario } from '@/types/speaking';
import { speakingPracticeService } from '@/services/speakingPracticeService';
import { isSupabaseConfigured } from '@/lib/supabase';
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
import { LiveAIConversation } from './LiveAIConversation';
import { SpeakingGoals } from './SpeakingGoals';

export const SpeakingPracticeTab = () => {
  const [progress, setProgress] = useState<SpeakingProgress | null>(null);
  const [scenarios, setScenarios] = useState<SpeakingScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario | null>(null);
  const [activeMode, setActiveMode] = useState<'menu' | 'practice' | 'live_ai'>('menu');
  const [todaysSpeakingTime, setTodaysSpeakingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSpeakingPracticeData();
  }, []);

  const loadSpeakingPracticeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we're in demo mode
      const demoMode = !isSupabaseConfigured();
      setIsDemoMode(demoMode);
      
      if (demoMode) {
        console.log('Running in demo mode - using mock data');
      }
      
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
      // Use level-based scenario retrieval if user has progress
      const levelBasedScenarios = progress 
        ? await speakingPracticeService.getStudentAppropriateScenarios()
        : await speakingPracticeService.getScenarios();
      
      setScenarios(levelBasedScenarios);
      
      if (levelBasedScenarios.length === 0) {
        console.warn('No appropriate speaking scenarios found for current level');
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
      // Fallback to all scenarios if level-based fails
      try {
        const fallbackScenarios = await speakingPracticeService.getScenarios();
        setScenarios(fallbackScenarios);
      } catch (fallbackError) {
        throw error;
      }
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

  const handleStartPractice = (scenario: SpeakingScenario, isLiveChat = false) => {
    setSelectedScenario(scenario);
    setActiveMode(isLiveChat ? 'live_ai' : 'practice');
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

  if (activeMode === 'live_ai') {
    return (
      <LiveAIConversation
        scenario={selectedScenario}
        onComplete={handleSessionComplete}
        onBack={() => setActiveMode('menu')}
      />
    );
  }

  const practiceModesConfig = [
    {
      title: '🎙️ Live AI Chat',
      icon: MessageCircle,
      description: 'Have real-time conversations with AI tutors adapted to your level',
      scenarios: scenarios, // All scenarios for live chat
      borderColor: 'hover:border-red-300',
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-700',
      isLiveChat: true
    },
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

      {isDemoMode && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You're currently using demo mode. Your progress is saved locally and AI features may be limited.
          </AlertDescription>
        </Alert>
      )}

      <SpeakingStats 
        progress={progress}
        todaysSpeakingTime={todaysSpeakingTime}
      />

      <SpeakingGoals progress={progress} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            isLiveChat={mode.isLiveChat}
            onStartPractice={handleStartPractice}
          />
        ))}
      </div>

      <DailyChallenge todaysSpeakingTime={todaysSpeakingTime} />
    </div>
  );
};
