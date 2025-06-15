
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { WheelConfig, WheelSegment, SpinningWheelState } from "./types";
import { generateWheelContent, defaultWheelConfigs } from "./wheelContentGenerator";

export function useSpinningWheel() {
  const [state, setState] = useState<SpinningWheelState>({
    isSpinning: false,
    rotation: 0,
    selectedSegment: null,
    wheelConfig: defaultWheelConfigs[0],
    segments: [],
    score: 0
  });
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const updateSegments = useCallback((config: WheelConfig) => {
    const newSegments = generateWheelContent(config);
    setState(prev => ({
      ...prev,
      segments: newSegments,
      selectedSegment: null,
      rotation: 0
    }));
  }, []);

  const setWheelConfig = useCallback((config: WheelConfig) => {
    setState(prev => ({ ...prev, wheelConfig: config }));
    updateSegments(config);
  }, [updateSegments]);

  const spinWheel = useCallback(() => {
    if (state.isSpinning) return;
    
    setState(prev => ({ ...prev, isSpinning: true, selectedSegment: null }));
    
    // Generate random spin (3-8 full rotations + random angle)
    const spins = 3 + Math.random() * 5;
    const finalAngle = Math.random() * 360;
    const totalRotation = state.rotation + (spins * 360) + finalAngle;
    
    setState(prev => ({ ...prev, rotation: totalRotation }));
    
    // Calculate which segment was selected
    setTimeout(() => {
      const segmentAngle = 360 / state.wheelConfig.segments;
      const normalizedAngle = (360 - (totalRotation % 360) + 90) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const selectedSeg = state.segments[segmentIndex];
      
      setState(prev => ({
        ...prev,
        selectedSegment: selectedSeg,
        isSpinning: false,
        score: prev.score + 5
      }));
      
      toast({
        title: "Wheel Stopped! 🎯",
        description: `You got: ${selectedSeg?.content}`,
      });
    }, 3000);
  }, [state.isSpinning, state.rotation, state.wheelConfig.segments, state.segments, toast]);

  const resetWheel = useCallback(() => {
    setState(prev => ({
      ...prev,
      rotation: 0,
      selectedSegment: null,
      score: 0
    }));
  }, []);

  const generateNewContent = useCallback(() => {
    updateSegments(state.wheelConfig);
  }, [state.wheelConfig, updateSegments]);

  // Initialize segments on first load
  React.useEffect(() => {
    updateSegments(state.wheelConfig);
  }, []);

  return {
    state,
    wheelRef,
    wheelConfigs: defaultWheelConfigs,
    setWheelConfig,
    spinWheel,
    resetWheel,
    generateNewContent
  };
}
