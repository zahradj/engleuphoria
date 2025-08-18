import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, Award, Clock, CheckCircle, Play, Target, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Slide {
  id: string;
  type: string;
  title: string;
  content: any;
}

interface LessonSlideViewerProps {
  slides: Slide[];
  title: string;
  className?: string;
}

export function LessonSlideViewer({ slides, title, className = "" }: LessonSlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const renderSlideContent = (slide: Slide, isActive: boolean) => {
    const baseClassName = `min-h-[600px] p-8 rounded-xl transition-all duration-500 ${isActive ? 'animate-fade-in' : ''}`;
    
    switch (slide.type) {
      case 'title':
        return (
          <div className={`${baseClassName} flex flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent text-white`}>
            <div className="text-center space-y-6">
              <div className="animate-bounce-light">
                <h1 className="text-5xl font-bold mb-4">{slide.content.title || title}</h1>
                <h2 className="text-2xl font-medium opacity-90">{slide.content.subtitle || "A2 Elementary English Lesson"}</h2>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-8">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Clock size={16} className="mr-2" />
                  45 minutes
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Target size={16} className="mr-2" />
                  A2 Level
                </Badge>
              </div>
            </div>
          </div>
        );
      
      case 'objectives':
        return (
          <div className={`${baseClassName} bg-gradient-to-br from-secondary/10 to-accent/10`}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary mb-4">🎯 Today's Goals</h2>
              <p className="text-xl text-muted-foreground">What we'll achieve together!</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {(slide.content.objectives || []).map((objective: string, index: number) => (
                <Card key={index} className="p-6 glass-subtle hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="text-lg font-medium">{objective}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'vocabulary':
        return (
          <div className={`${baseClassName} bg-gradient-to-br from-teacher/10 to-teacher-accent/10`}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary mb-4">{slide.content.sectionTitle || "📚 Vocabulary"}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(slide.content.items || []).map((item: any, index: number) => (
                <Card 
                  key={index} 
                  className="p-6 text-center glass-subtle hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => toast.success(`${item.emoji || "📝"} ${item.text || item.word || item.verb} ${item.time ? `- ${item.time}` : ""}`)}
                >
                  <div className="text-4xl mb-4">{item.emoji || "📝"}</div>
                  <div className="text-xl font-semibold mb-2">{item.text || item.word || item.verb}</div>
                  {item.time && <Badge variant="secondary">{item.time}</Badge>}
                  {item.definition && <p className="text-sm text-muted-foreground mt-2">{item.definition}</p>}
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'activity':
      case 'practice':
        return (
          <div className={`${baseClassName} bg-gradient-to-br from-mint/10 to-mint-light`}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary mb-4">{slide.content.activityTitle || "🎯 Practice Activity"}</h2>
              <p className="text-xl text-muted-foreground">{slide.content.instructions || "Complete the activity below!"}</p>
            </div>
            <Card className="p-8 glass-subtle">
              <div className="text-center space-y-6">
                <div className="text-2xl font-semibold text-primary">
                  {slide.content.question || slide.content.prompt || "Practice time!"}
                </div>
                {slide.content.options && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {slide.content.options.map((option: any, index: number) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="h-20 text-lg hover:bg-primary hover:text-white transition-all duration-300"
                        onClick={() => toast.success(`Great choice! ${typeof option === 'string' ? option : option.text}`)}
                      >
                        {typeof option === 'string' ? option : `${option.emoji || ""} ${option.text || option.label}`}
                      </Button>
                    ))}
                  </div>
                )}
                {slide.content.content && (
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: slide.content.content }} />
                )}
              </div>
            </Card>
          </div>
        );
      
      case 'speaking':
        return (
          <div className={`${baseClassName} bg-gradient-to-br from-mint/20 to-mint-light`}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary mb-4">🗣️ Speaking Practice</h2>
              <p className="text-xl text-muted-foreground">{slide.content.instructions || "Practice speaking!"}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 glass-subtle">
                <h3 className="text-2xl font-bold mb-4 text-center text-secondary">Scenario</h3>
                <div className="bg-primary/10 p-4 rounded-lg mb-4">
                  <p className="text-lg">{slide.content.scenario || "Practice conversation with your partner"}</p>
                </div>
                {slide.content.roles && (
                  <div className="space-y-3">
                    {slide.content.roles.map((role: string, index: number) => (
                      <div key={index} className="p-3 bg-white/50 rounded-lg">
                        <strong>Role {index + 1}:</strong> {role}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              <Card className="p-6 glass-subtle">
                <h3 className="text-2xl font-bold mb-4 text-center text-secondary">Useful Phrases</h3>
                <div className="space-y-3">
                  {(slide.content.phrases || []).map((phrase: string, index: number) => (
                    <div key={index} className="p-3 bg-primary/10 rounded-lg text-center">
                      <span className="font-medium">"{phrase}"</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      
      case 'conclusion':
        return (
          <div className={`${baseClassName} bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10`}>
            <div className="text-center">
              <div className="mb-8">
                <Trophy className="text-6xl text-amber-500 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-primary mb-4">🎉 Great Work!</h2>
                <p className="text-xl text-muted-foreground">{slide.content.message || "You've completed the lesson!"}</p>
              </div>
              {slide.content.achievements && (
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  {slide.content.achievements.map((achievement: string, index: number) => (
                    <Card key={index} className="p-6 glass-subtle">
                      <CheckCircle className="text-green-500 mx-auto mb-4" size={32} />
                      <p className="font-medium">{achievement}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`${baseClassName} bg-gradient-to-br from-secondary/5 to-accent/5`}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary mb-4">{slide.title}</h2>
            </div>
            {slide.content.content && (
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: slide.content.content }} />
            )}
            {slide.content.text && (
              <div className="text-lg leading-relaxed">{slide.content.text}</div>
            )}
          </div>
        );
    }
  };

  if (!slides || slides.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-muted-foreground">No slides available</h3>
          <p className="text-muted-foreground">This lesson doesn't have any slides to display.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col h-full`}>
      {/* Slide Content - Main scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full mx-auto">
          {renderSlideContent(slides[currentSlide], true)}
        </div>
      </div>

      {/* Navigation Controls - Fixed at bottom */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}