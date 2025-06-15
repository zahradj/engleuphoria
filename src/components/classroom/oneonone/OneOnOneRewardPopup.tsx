
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Award, Sparkles } from "lucide-react";

interface OneOnOneRewardPopupProps {
  isVisible: boolean;
  rewardType?: 'star' | 'badge' | 'level' | 'achievement';
  rewardAmount?: number;
  rewardTitle?: string;
  rewardDescription?: string;
}

export function OneOnOneRewardPopup({ 
  isVisible, 
  rewardType = 'star',
  rewardAmount = 50,
  rewardTitle = "Excellent Work!",
  rewardDescription = "Keep up the great progress!"
}: OneOnOneRewardPopupProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible && !showAnimation) return null;

  const getRewardIcon = () => {
    switch (rewardType) {
      case 'star':
        return <Star className="h-12 w-12 text-yellow-500 animate-pulse" />;
      case 'badge':
        return <Trophy className="h-12 w-12 text-purple-500 animate-bounce" />;
      case 'level':
        return <Award className="h-12 w-12 text-blue-500 animate-pulse" />;
      case 'achievement':
        return <Sparkles className="h-12 w-12 text-green-500 animate-spin" />;
      default:
        return <Star className="h-12 w-12 text-yellow-500 animate-pulse" />;
    }
  };

  const getGradientColors = () => {
    switch (rewardType) {
      case 'star':
        return 'from-yellow-100 via-orange-100 to-red-100 border-yellow-300';
      case 'badge':
        return 'from-purple-100 via-pink-100 to-purple-100 border-purple-300';
      case 'level':
        return 'from-blue-100 via-cyan-100 to-blue-100 border-blue-300';
      case 'achievement':
        return 'from-green-100 via-emerald-100 to-green-100 border-green-300';
      default:
        return 'from-yellow-100 via-orange-100 to-red-100 border-yellow-300';
    }
  };

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
      showAnimation ? 'animate-scale-in opacity-100' : 'animate-scale-out opacity-0'
    }`}>
      <Card className={`p-8 text-center bg-gradient-to-br ${getGradientColors()} border-2 shadow-2xl max-w-sm`}>
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          <div className="mb-4 flex justify-center">
            {getRewardIcon()}
          </div>
          
          <h3 className="font-bold text-xl text-gray-800 mb-2">{rewardTitle}</h3>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge className="bg-white/80 text-gray-800 text-lg px-3 py-1 shadow-sm">
              +{rewardAmount} XP
            </Badge>
          </div>
          
          <p className="text-gray-700 text-sm font-medium">{rewardDescription}</p>
          
          {/* Progress indicator */}
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < 3 ? 'bg-yellow-400' : 'bg-gray-300'
                  } animate-pulse`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
