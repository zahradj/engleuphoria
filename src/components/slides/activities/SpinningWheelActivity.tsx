import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { audioService } from "@/services/audioService";

interface SpinningWheelActivityProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

interface WheelSegment {
  id: string;
  text: string;
  color: string;
}

export function SpinningWheelActivity({ slide, slideNumber, onNext }: SpinningWheelActivityProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segments: WheelSegment[] = slide.wheelSegments || [
    { id: "1", text: "What's your favorite food?", color: "#FF6B6B" },
    { id: "2", text: "Describe your best friend", color: "#4ECDC4" },
    { id: "3", text: "Talk about your family", color: "#45B7D1" },
    { id: "4", text: "What do you like to do?", color: "#96CEB4" },
    { id: "5", text: "Tell us about your pet", color: "#FFEAA7" },
    { id: "6", text: "What's your dream job?", color: "#DDA0DD" },
  ];

  const segmentAngle = 360 / segments.length;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    audioService.playButtonClick();

    const spins = 5 + Math.random() * 3;
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + extraDegrees;

    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const selectedIndex = Math.floor(((360 - normalizedRotation + segmentAngle / 2) % 360) / segmentAngle);
      setSelectedSegment(segments[selectedIndex]);
      setIsSpinning(false);
      
      audioService.playCelebrationSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 3000);
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-secondary/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">
          Slide {slideNumber}: {slide.prompt || "Spin the Wheel!"}
        </h2>
      </div>

      {slide.instructions && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-muted-foreground">{slide.instructions}</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-80 h-80">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <motion.div
            ref={wheelRef}
            className="relative w-full h-full rounded-full shadow-2xl overflow-hidden border-8 border-primary"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{ transformOrigin: "center center" }}
          >
            {segments.map((segment, index) => {
              const startAngle = index * segmentAngle;
              const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 50 * Math.cos(((startAngle + segmentAngle) * Math.PI) / 180);
              const y2 = 50 + 50 * Math.sin(((startAngle + segmentAngle) * Math.PI) / 180);
              const largeArc = segmentAngle > 180 ? 1 : 0;

              return (
                <div
                  key={segment.id}
                  className="absolute inset-0"
                  style={{
                    clipPath: `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`,
                    background: segment.color,
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `rotate(${startAngle + segmentAngle / 2}deg)`,
                      transformOrigin: "50% 50%",
                    }}
                  >
                    <p className="text-white font-bold text-sm px-2 text-center transform translate-y-[-60%]">
                      {segment.text}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background border-4 border-primary shadow-lg" />
          </motion.div>
        </div>

        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          size="lg"
          className="px-8 py-6 text-lg font-bold"
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel! 🎡"}
        </Button>

        <AnimatePresence>
          {selectedSegment && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="p-6 bg-primary/10 border-2 border-primary rounded-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-2">Your Challenge:</h3>
              <p className="text-lg">{selectedSegment.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {onNext && (
          <Button
            onClick={onNext}
            variant="outline"
            size="lg"
            className="mt-4"
          >
            Continue →
          </Button>
        )}
      </div>
    </Card>
  );
}
