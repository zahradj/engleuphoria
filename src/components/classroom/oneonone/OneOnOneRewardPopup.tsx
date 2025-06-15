
import React from "react";
import { Card } from "@/components/ui/card";

interface OneOnOneRewardPopupProps {
  isVisible: boolean;
}

export function OneOnOneRewardPopup({ isVisible }: OneOnOneRewardPopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
      <Card className="p-6 text-center bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300">
        <div className="text-4xl mb-2">🌟</div>
        <h3 className="font-bold text-lg text-orange-800">Excellent Work!</h3>
        <p className="text-orange-700">+50 XP Earned!</p>
      </Card>
    </div>
  );
}
