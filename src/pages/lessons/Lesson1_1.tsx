import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Volume2, Award, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import lesson slide components
import { WarmUpSlide } from "@/components/lessons/lesson1_1/WarmUpSlide";
import { TopicIntroSlide } from "@/components/lessons/lesson1_1/TopicIntroSlide";
import { GreetingFlashcardsSlide } from "@/components/lessons/lesson1_1/GreetingFlashcardsSlide";
import { ListeningChallengeSlide } from "@/components/lessons/lesson1_1/ListeningChallengeSlide";
import { DialogueModelSlide } from "@/components/lessons/lesson1_1/DialogueModelSlide";
import { DragDropPracticeSlide } from "@/components/lessons/lesson1_1/DragDropPracticeSlide";
import { FillInGapSlide } from "@/components/lessons/lesson1_1/FillInGapSlide";
import { MatchingGameSlide } from "@/components/lessons/lesson1_1/MatchingGameSlide";
import { SpeakingDrillSlide } from "@/components/lessons/lesson1_1/SpeakingDrillSlide";
import { RolePlaySlide } from "@/components/lessons/lesson1_1/RolePlaySlide";
import { PhonicsSlide } from "@/components/lessons/lesson1_1/PhonicsSlide";
import { SpinWheelSlide } from "@/components/lessons/lesson1_1/SpinWheelSlide";
import { ListeningChooseSlide } from "@/components/lessons/lesson1_1/ListeningChooseSlide";
import { MatchingChallengeSlide } from "@/components/lessons/lesson1_1/MatchingChallengeSlide";
import { DialogueFillSlide } from "@/components/lessons/lesson1_1/DialogueFillSlide";
import { ReviewGameSlide } from "@/components/lessons/lesson1_1/ReviewGameSlide";
import { WrapUpSlide } from "@/components/lessons/lesson1_1/WrapUpSlide";

const TOTAL_SLIDES = 17;

const slideComponents = [
  WarmUpSlide,
  TopicIntroSlide,
  GreetingFlashcardsSlide,
  ListeningChallengeSlide,
  DialogueModelSlide,
  DragDropPracticeSlide,
  FillInGapSlide,
  MatchingGameSlide,
  SpeakingDrillSlide,
  RolePlaySlide,
  PhonicsSlide,
  SpinWheelSlide,
  ListeningChooseSlide,
  MatchingChallengeSlide,
  DialogueFillSlide,
  ReviewGameSlide,
  WrapUpSlide,
];

export function Lesson1_1() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;

  useEffect(() => {
    if (!lessonStarted) {
      setLessonStarted(true);
      setStartTime(new Date());
    }
  }, [lessonStarted]);

  const handleSlideComplete = (slideIndex: number, points = 10) => {
    setCompletedSlides(prev => new Set([...prev, slideIndex]));
    setScore(prev => prev + points);
    toast.success(`Great job! +${points} points`);
  };

  const nextSlide = () => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const CurrentSlideComponent = slideComponents[currentSlide];

  const isLastSlide = currentSlide === TOTAL_SLIDES - 1;
  const isFirstSlide = currentSlide === 0;

  const getDuration = () => {
    if (!startTime) return "0:00";
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/teacher")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">
                  📘 Lesson 1.1 – Greetings & Self-Introduction
                </h1>
                <p className="text-sm text-gray-600">
                  Unit 1: All About Me • Level: Restarter (Pre-A1/A1) • Duration: 30 minutes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {score} points
              </Badge>
              <Badge variant="secondary">
                ⏱️ {getDuration()}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Slide {currentSlide + 1} of {TOTAL_SLIDES}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 min-h-[500px]">
          <CurrentSlideComponent
            onComplete={() => handleSlideComplete(currentSlide)}
            onNext={nextSlide}
            isCompleted={completedSlides.has(currentSlide)}
          />
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={isFirstSlide}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentSlide
                    ? "bg-blue-600"
                    : completedSlides.has(i)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={isLastSlide}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Learning Objectives Panel */}
      <div className="max-w-4xl mx-auto mt-6">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            🎯 Learning Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${score >= 20 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>Greet others and say goodbye</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${score >= 40 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>Introduce themselves: My name is...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${score >= 60 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>Ask: What's your name?</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${score >= 80 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>Reply politely: Nice to meet you</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${score >= 100 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>Recognize and pronounce Aa words</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}