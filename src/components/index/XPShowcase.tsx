
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Trophy, Gift, Zap, Crown, Heart } from "lucide-react";

export const XPShowcase = () => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedXP(1250);
      setTimeout(() => setShowReward(true), 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const badges = [
    { icon: Star, name: "First Star", color: "text-yellow-500", unlocked: true },
    { icon: Trophy, name: "Great Student", color: "text-orange-500", unlocked: true },
    { icon: Crown, name: "Word Master", color: "text-purple-500", unlocked: true },
    { icon: Heart, name: "Helper", color: "text-pink-500", unlocked: false },
    { icon: Zap, name: "Speed Reader", color: "text-blue-500", unlocked: false },
    { icon: Gift, name: "Bonus Hunter", color: "text-green-500", unlocked: false }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200 px-4 py-2">
            ⭐ Rewards & Progress
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Kids Love Learning with
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Stars & Badges!</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every lesson, quiz, and activity earns XP points and unlocks exciting rewards that keep kids motivated
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Interactive XP Demo */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Student Progress</h3>
                <Badge className="bg-blue-100 text-blue-700">Level {Math.floor(animatedXP / 100)}</Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Total XP</span>
                  <span>{animatedXP} / 1300</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(animatedXP / 1300) * 100}%` }}
                  ></div>
                </div>
              </div>

              {showReward && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border border-yellow-200 animate-bounce">
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <div>
                      <div className="font-semibold text-yellow-800">Reward Unlocked!</div>
                      <div className="text-sm text-yellow-700">Great work completing today's lesson!</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Achievement Badges</h3>
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className={`text-center p-3 rounded-lg transition-all duration-300 ${badge.unlocked ? 'bg-gray-50 scale-105' : 'bg-gray-100 opacity-50'}`}>
                    <badge.icon className={`h-8 w-8 mx-auto mb-2 ${badge.unlocked ? badge.color : 'text-gray-400'}`} />
                    <div className={`text-xs font-medium ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Earn Stars for Every Lesson</h4>
                  <p className="text-gray-600 text-sm">Complete activities and get instant star rewards that make learning addictive!</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Unlock Achievement Badges</h4>
                  <p className="text-gray-600 text-sm">Reach milestones and unlock special badges that show off learning progress!</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Level Up Your English</h4>
                  <p className="text-gray-600 text-sm">Watch XP points grow and advance through levels just like a video game!</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Surprise Rewards</h4>
                  <p className="text-gray-600 text-sm">Special bonuses and surprises keep the learning journey exciting!</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
              Try Rewards System Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
