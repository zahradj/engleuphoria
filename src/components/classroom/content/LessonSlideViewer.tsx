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

  const renderSlideContent = (slide: any, isActive: boolean) => {
    const baseClassName = `h-full flex flex-col justify-center p-6 transition-all duration-500 ${isActive ? 'animate-fade-in' : ''}`;
    const content = slide && slide.content ? slide.content : {};
    const sTitle = (slide && (slide.title || (content && content.title))) || title || 'Lesson';
    const sType = (slide && slide.type) || 'default';
    
    switch (sType) {
      case 'title':
        return (
          <div className={`${baseClassName} slide-monochrome text-foreground`}>
            <div className="text-center space-y-4">
              <div className="animate-bounce-light">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-brand-800">{content.title || sTitle}</h1>
                <h2 className="text-lg md:text-xl font-medium opacity-90 text-brand-600">{content.subtitle || "A2 Elementary English Lesson"}</h2>
              </div>
              <div className="flex items-center justify-center space-x-3 mt-6">
                <Badge className="bg-brand-500 text-white border-brand-600 px-3 py-1.5 text-sm">
                  <Clock size={14} className="mr-1.5" />
                  45 minutes
                </Badge>
                <Badge className="bg-brand-500 text-white border-brand-600 px-3 py-1.5 text-sm">
                  <Target size={14} className="mr-1.5" />
                  A2 Level
                </Badge>
              </div>
            </div>
          </div>
        );
      
      case 'objectives':
        return (
          <div className={`${baseClassName} slide-accent overflow-y-auto`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-800 mb-3">🎯 Today's Goals</h2>
              <p className="text-lg text-brand-600">What we'll achieve together!</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 flex-1">
              {(content.objectives || []).map((objective: string, index: number) => (
                <Card key={index} className="p-4 border-2 border-brand-300 bg-surface hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="text-base font-medium text-foreground">{objective}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'vocabulary':
        return (
          <div className={`${baseClassName} bg-gradient-to-br from-teacher/10 to-teacher-accent/10`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">{content.sectionTitle || "📚 Vocabulary"}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {(content.items || []).map((item: any, index: number) => (
                <Card 
                  key={index} 
                  className="p-4 text-center glass-subtle hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => toast.success(`${item.emoji || "📝"} ${item.text || item.word || item.verb} ${item.time ? `- ${item.time}` : ""}`)}
                >
                  <div className="text-3xl mb-3">{item.emoji || "📝"}</div>
                  <div className="text-lg font-semibold mb-2">{item.text || item.word || item.verb}</div>
                  {item.time && <Badge variant="secondary" className="text-xs">{item.time}</Badge>}
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
              <h2 className="text-4xl font-bold text-primary mb-4">{content.activityTitle || "🎯 Practice Activity"}</h2>
              <p className="text-xl text-muted-foreground">{content.instructions || "Complete the activity below!"}</p>
            </div>
            <Card className="p-8 glass-subtle">
              <div className="text-center space-y-6">
                <div className="text-2xl font-semibold text-primary">
                  {content.question || content.prompt || "Practice time!"}
                </div>
                {content.options && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {content.options.map((option: any, index: number) => (
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
                {content.content && (
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
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
              <p className="text-xl text-muted-foreground">{content.instructions || "Practice speaking!"}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 glass-subtle">
                <h3 className="text-2xl font-bold mb-4 text-center text-secondary">Scenario</h3>
                <div className="bg-primary/10 p-4 rounded-lg mb-4">
                  <p className="text-lg">{content.scenario || "Practice conversation with your partner"}</p>
                </div>
                {content.roles && (
                  <div className="space-y-3">
                    {content.roles.map((role: string, index: number) => (
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
                  {(content.phrases || []).map((phrase: string, index: number) => (
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
                <p className="text-xl text-muted-foreground">{content.message || "You've completed the lesson!"}</p>
              </div>
              {content.achievements && (
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  {content.achievements.map((achievement: string, index: number) => (
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
              <h2 className="text-4xl font-bold text-primary mb-4">{sTitle}</h2>
            </div>
            {content.content && (
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
            )}
            {content.text && (
              <div className="text-lg leading-relaxed">{content.text}</div>
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
    <div className={`${className} h-full flex flex-col`}>
      {/* Slide Content - Takes full height */}
      <div className="flex-1 h-full">
        <div className="h-full w-full">
          {renderSlideContent(slides[currentSlide], true)}
        </div>
      </div>

      {/* Navigation Controls - Fixed at bottom of page */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-primary scale-125' : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
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