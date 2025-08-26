import { useState } from 'react';
import { SlideMaster } from '@/components/slides/SlideMaster';
import { a1M1L1Greetings } from '@/data/lessons/a1-m1-l1-greetings';
import { ActivityResult } from '@/types/slides';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function A1GreetingsLesson() {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentSlide = a1M1L1Greetings.slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === a1M1L1Greetings.slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigate('/curriculum-generation');
      return;
    }
    setCurrentSlideIndex(prev => prev + 1);
    setSelectedOptions([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setSelectedOptions([]);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions([optionId]);
    
    if (currentSlide.options) {
      const selectedOption = currentSlide.options.find(opt => opt.id === optionId);
      const correct = selectedOption?.isCorrect || currentSlide.correct === optionId;
      setIsCorrect(correct);
      setShowFeedback(true);
    }
  };

  const handleActivityResult = (result: ActivityResult) => {
    console.log('Activity result:', result);
    setIsCorrect(result.correct);
    setShowFeedback(true);
  };

  return (
    <div className="min-h-screen theme-a1 bg-background">
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/curriculum-generation')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Curriculum
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              A1 - Module 1 - Lesson 1: Greetings & Introductions
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Duration: {a1M1L1Greetings.durationMin} minutes</span>
              <span>•</span>
              <span>CEFR Level: {a1M1L1Greetings.metadata.CEFR}</span>
              <span>•</span>
              <span>Slide {currentSlideIndex + 1} of {a1M1L1Greetings.slides.length}</span>
            </div>
          </div>

          <SlideMaster
            slide={currentSlide}
            currentSlide={currentSlideIndex}
            totalSlides={a1M1L1Greetings.slides.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onOptionSelect={handleOptionSelect}
            onActivityResult={handleActivityResult}
            selectedOptions={selectedOptions}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />
        </div>
      </div>
    </div>
  );
}