
import React, { useState, useEffect } from 'react';
import { SpeakingProgress, SpeakingScenario } from '@/types/speaking';
import { speakingPracticeService } from '@/services/speakingPracticeService';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Image, 
  HelpCircle
} from 'lucide-react';
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
