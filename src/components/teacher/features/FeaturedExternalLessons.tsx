import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelloAdventuresIntegration } from './HelloAdventuresIntegration';
import { LessonImportDialog } from './LessonImportDialog';
import { lessonAnalytics } from '@/services/lessonAnalyticsService';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  ExternalLink, 
  Clock, 
  Users, 
  Music,
  Globe,
  Sparkles,
  ChevronRight,
  Download,
  Zap,
  Gamepad2,
  Volume2,
  UserRound
} from 'lucide-react';

interface FeaturedExternalLessonsProps {
  onImportLesson?: (lessonData: any) => void;
}

interface FeaturedLesson {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  level: string;
  ageGroup: string;
  topics: string[];
  featured: boolean;
  comingSoon: boolean;
  slides?: number;
  hasGamefication?: boolean;
  hasAudio?: boolean;
  hasCharacters?: boolean;
}

export function FeaturedExternalLessons({ onImportLesson }: FeaturedExternalLessonsProps) {
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<FeaturedLesson | null>(null);

  const handlePreview = (lesson: FeaturedLesson) => {
    window.open(lesson.url, '_blank');
    lessonAnalytics.trackLessonPreview(lesson.id, lesson.title, lesson.url);
    toast({
      title: "Opening Lesson Preview",
      description: "Launching in new tab..."
    });
  };

  const handleImport = (lesson: FeaturedLesson) => {
    setSelectedLesson(lesson);
    lessonAnalytics.trackImportDialogOpened(lesson.id, lesson.title);
  };

  const featuredLessons: FeaturedLesson[] = [
    {
      id: 'ppp-greetings-perfect',
      title: "⭐ Perfect PPP Greetings Lesson",
      description: "Complete 30-minute interactive lesson using PPP methodology with 23 engaging slides, gamification, and character dialogues. Includes warm-up, presentation, practice, and production phases.",
      url: "https://lovable.dev/projects/3ad1c0d6-0d3d-47a9-b320-b09d2745911e?magic_link=mc_96cce660-30b1-4e5f-bd34-90ebd6d21a34",
      duration: "30 min",
      level: "A1-A2",
      ageGroup: "6-12 years",
      topics: ["Greetings", "PPP Method", "Speaking", "Listening", "Interactive Games"],
      featured: true,
      comingSoon: false,
      slides: 23,
      hasGamefication: true,
      hasAudio: true,
      hasCharacters: true
    }
  ];

  const otherFeaturedLessons: FeaturedLesson[] = [
    {
      id: 'colors-adventure',
      title: "🌈 Colors Adventure",
      description: "Learn colors through interactive games and songs",
      url: "https://example.com/colors-lesson",
      duration: "25 min",
      level: "A1",
      ageGroup: "3-7 years",
      topics: ["Colors", "Vocabulary", "Songs"],
      featured: true,
      comingSoon: true
    },
    {
      id: 'numbers-fun',
      title: "🔢 Numbers 1-10 Fun",
      description: "Count and play with numbers through interactive activities",
      url: "https://example.com/numbers-lesson",
      duration: "20 min", 
      level: "A1",
      ageGroup: "4-8 years",
      topics: ["Numbers", "Counting", "Games"],
      featured: true,
      comingSoon: true
    },
    {
      id: 'family-time',
      title: "👨‍👩‍👧‍👦 My Family",
      description: "Learn family member vocabulary and relationships",
      url: "https://example.com/family-lesson",
      duration: "30 min",
      level: "A1",
      ageGroup: "5-10 years", 
      topics: ["Family", "Relationships", "Vocabulary"],
      featured: true,
      comingSoon: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Featured External Lessons
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Ready-to-use interactive lessons from our partner educators. 
          Preview, import, and customize for your classroom.
        </p>
      </div>

      {/* Top Featured Lesson - Perfect PPP Greetings */}
      {featuredLessons.map((lesson) => (
        <div key={lesson.id} className="relative">
          <div className="absolute -top-4 left-4 z-10 flex gap-2">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg animate-pulse">
              ⭐ Most Popular
            </Badge>
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg">
              ✅ Ready to Use
            </Badge>
            {lesson.slides && (
              <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 shadow-lg">
                {lesson.slides} Slides
              </Badge>
            )}
          </div>

          <Card className="border-2 border-primary/20 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-sm font-semibold">
                      {lesson.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {lesson.title}
                  </CardTitle>
                  <p className="text-text-muted leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              {/* Quick Info Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="font-semibold">{lesson.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Age Group</div>
                    <div className="font-semibold">{lesson.ageGroup}</div>
                  </div>
                </div>
                {lesson.slides && (
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Slides</div>
                      <div className="font-semibold">{lesson.slides}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Music className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Method</div>
                    <div className="font-semibold">PPP</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {lesson.hasGamefication && (
                  <Badge variant="outline" className="border-primary/30 bg-primary/5">
                    <Gamepad2 className="h-3 w-3 mr-1" />
                    Gamification
                  </Badge>
                )}
                {lesson.hasAudio && (
                  <Badge variant="outline" className="border-primary/30 bg-primary/5">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Audio Included
                  </Badge>
                )}
                {lesson.hasCharacters && (
                  <Badge variant="outline" className="border-primary/30 bg-primary/5">
                    <UserRound className="h-3 w-3 mr-1" />
                    Characters
                  </Badge>
                )}
                {lesson.topics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="border-accent/30 bg-accent/5">
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => handlePreview(lesson)}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg text-base h-12"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Open Lesson Now
                </Button>
                <Button 
                  onClick={() => handleImport(lesson)}
                  variant="outline"
                  className="flex-1 border-2 border-primary/30 hover:bg-primary/10 text-base h-12"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Import Instructions
                </Button>
              </div>

              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Pro Tip:</strong> Click "Import Instructions" to learn how to use this lesson directly, 
                  remix it for customization, or embed it in your LMS. Perfect for both in-person and online teaching!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Hello Adventures - Also Featured */}
      <div className="relative">
        <div className="absolute -top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0 shadow-lg">
            🎵 Interactive Song Lesson
          </Badge>
        </div>
        <HelloAdventuresIntegration />
      </div>

      {/* Coming Soon Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h3 className="text-xl font-semibold">Coming Soon</h3>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            More Lessons
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherFeaturedLessons.map((lesson) => (
            <Card 
              key={lesson.id} 
              className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-75"
            >
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60 z-10 flex items-center justify-center">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                  Coming Soon
                </Badge>
              </div>

              <div className="absolute top-3 right-3">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {lesson.level}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {lesson.title}
                </CardTitle>
                <p className="text-sm text-text-muted line-clamp-2">
                  {lesson.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick Info */}
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{lesson.ageGroup}</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-1">
                  {lesson.topics.slice(0, 3).map((topic, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-primary/20"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 opacity-50 cursor-not-allowed" 
                    disabled
                  >
                    Get Notified
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Browse More */}
      <Card className="border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
        <CardContent className="py-8 text-center">
          <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Want to Add Your Own Lesson?</h3>
          <p className="text-text-muted mb-4 max-w-md mx-auto">
            Share your creative lessons with the community and get featured in our library
          </p>
          <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
            Submit Your Lesson
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Import Dialog */}
      {selectedLesson && (
        <LessonImportDialog
          open={!!selectedLesson}
          onOpenChange={(open) => !open && setSelectedLesson(null)}
          lessonUrl={selectedLesson.url}
          lessonTitle={selectedLesson.title}
        />
      )}
    </div>
  );
}