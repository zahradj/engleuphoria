
import React, { useState, useEffect } from "react";
import { Star, Trophy, Award } from "lucide-react";

interface RewardAnimationProps {
  show: boolean;
  type: 'star' | 'trophy' | 'award';
  points: number;
  onComplete: () => void;
}

export function RewardAnimation({ show, type, points, onComplete }: RewardAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 300); // Wait for fade out
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show && !visible) return null;

  const IconComponent = type === 'star' ? Star : type === 'trophy' ? Trophy : Award;
  const colors = {
    star: 'from-yellow-400 to-orange-500',
    trophy: 'from-purple-400 to-pink-500',
    award: 'from-blue-400 to-cyan-500'
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-300 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="relative">
        {/* Main reward icon */}
        <div className={`
          w-32 h-32 rounded-full bg-gradient-to-br ${colors[type]} 
          flex items-center justify-center shadow-2xl
          ${visible ? 'animate-bounce' : ''}
        `}>
          <IconComponent size={64} className="text-white" />
        </div>
        
        {/* Points text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border-2 border-gray-200">
            <span className="font-bold text-lg text-gray-800">+{points} XP</span>
          </div>
        </div>
        
        {/* Sparkle effects */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-yellow-400 rounded-full ${
              visible ? 'animate-ping' : ''
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
    </div>
  );
}
