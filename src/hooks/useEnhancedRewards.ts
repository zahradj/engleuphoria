
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BadgeType, RewardHistory, XP_VALUES, BADGE_MILESTONES } from '@/components/classroom/oneonone/rewards/RewardSystem';

// Sound effect utility
const playSound = (type: 'xp' | 'star' | 'badge' | 'achievement') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createBeep = (frequency: number, duration: number, volume: number = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    switch (type) {
      case 'xp':
        // Simple ding for XP gain
        createBeep(800, 0.2);
        break;
      case 'star':
        // Magical star sound - ascending notes
        createBeep(523, 0.15); // C
        setTimeout(() => createBeep(659, 0.15), 100); // E
        setTimeout(() => createBeep(784, 0.2), 200); // G
        break;
      case 'badge':
        // Achievement fanfare
        createBeep(523, 0.2); // C
        setTimeout(() => createBeep(659, 0.2), 150); // E
        setTimeout(() => createBeep(784, 0.2), 300); // G
        setTimeout(() => createBeep(1047, 0.3), 450); // High C
        break;
      case 'achievement':
        // Celebration sound
        createBeep(698, 0.15); // F#
        setTimeout(() => createBeep(831, 0.15), 100); // G#
        setTimeout(() => createBeep(988, 0.2), 200); // B
        break;
    }
  } catch (error) {
    console.log('Audio not supported or blocked:', error);
  }
};

export function useEnhancedRewards(initialXP: number = 1250) {
  const [currentXP, setCurrentXP] = useState(initialXP);
  const [badges, setBadges] = useState<BadgeType[]>(BADGE_MILESTONES);
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [showRewardHistory, setShowRewardHistory] = useState(false);
  const { toast } = useToast();

  const awardXP = useCallback((
    amount: number, 
    reason: string, 
    awardedBy: string = 'Teacher',
    type: 'task' | 'star' | 'bonus' | 'milestone' = 'task'
  ) => {
    const newXP = currentXP + amount;
    setCurrentXP(newXP);

    // Play sound based on reward type
    if (type === 'star') {
      playSound('star');
    } else if (amount >= 25) {
      playSound('achievement');
    } else {
      playSound('xp');
    }

    // Add to history
    const newReward: RewardHistory = {
      id: Date.now().toString(),
      xpAmount: amount,
      reason,
      awardedBy,
      createdAt: new Date(),
      type
    };
    setRewardHistory(prev => [newReward, ...prev]);

    // Check for new badge unlocks
    const newlyUnlockedBadges = badges.filter(
      badge => !badge.unlocked && newXP >= badge.xpRequired
    );

    if (newlyUnlockedBadges.length > 0) {
      setBadges(prev => prev.map(badge => 
        newlyUnlockedBadges.some(newBadge => newBadge.id === badge.id)
          ? { ...badge, unlocked: true, unlockedAt: new Date() }
          : badge
      ));

      // Play badge unlock sound
      playSound('badge');

      // Show badge unlock celebration
      newlyUnlockedBadges.forEach(badge => {
        toast({
          title: "🏅 Badge Unlocked!",
          description: `You earned the "${badge.name}" badge!`,
          duration: 5000,
        });

        // Add milestone reward to history
        const milestoneReward: RewardHistory = {
          id: `milestone-${Date.now()}`,
          xpAmount: 0,
          reason: `Unlocked "${badge.name}" badge`,
          awardedBy: 'System',
          createdAt: new Date(),
          type: 'milestone'
        };
        setRewardHistory(prev => [milestoneReward, ...prev]);
      });
    }

    // Show XP gain toast
    toast({
      title: `+${amount} XP`,
      description: reason,
      duration: 3000,
    });

    // Show reward popup for significant gains
    if (amount >= XP_VALUES.STAR) {
      setShowRewardPopup(true);
      setTimeout(() => setShowRewardPopup(false), 3000);
    }

  }, [currentXP, badges, toast]);

  const awardStar = useCallback(() => {
    awardXP(XP_VALUES.STAR, 'Great work! Teacher awarded a star ⭐', 'Teacher', 'star');
  }, [awardXP]);

  const awardTask = useCallback((taskType: keyof typeof XP_VALUES, customReason?: string) => {
    const amount = XP_VALUES[taskType];
    const reason = customReason || `Completed ${taskType.toLowerCase().replace('_', ' ')}`;
    awardXP(amount, reason, 'Teacher', 'task');
  }, [awardXP]);

  const resetRewards = useCallback(() => {
    setCurrentXP(0);
    setBadges(BADGE_MILESTONES.map(badge => ({ ...badge, unlocked: false, unlockedAt: undefined })));
    setRewardHistory([]);
  }, []);

  return {
    currentXP,
    badges,
    rewardHistory,
    showRewardPopup,
    showRewardHistory,
    setShowRewardHistory,
    awardXP,
    awardStar,
    awardTask,
    resetRewards,
    // Helper getters
    currentLevel: Math.floor(currentXP / 100),
    xpInCurrentLevel: currentXP % 100,
    xpToNextLevel: 100 - (currentXP % 100),
    unlockedBadgesCount: badges.filter(b => b.unlocked).length,
    totalBadges: badges.length
  };
}
