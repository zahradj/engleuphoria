
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { audioService } from "@/services/audioService";

interface SoundButtonProps extends ButtonProps {
  soundType?: 'click' | 'success' | 'error' | 'reward';
  children: React.ReactNode;
}

export function SoundButton({ 
  soundType = 'click', 
  onClick, 
  children, 
  ...props 
}: SoundButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Play sound based on type
    switch (soundType) {
      case 'click':
        audioService.playButtonClick();
        break;
      case 'success':
        audioService.playSuccessSound();
        break;
      case 'error':
        audioService.playErrorSound();
        break;
      case 'reward':
        audioService.playRewardSound();
        break;
    }

    // Call original onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
