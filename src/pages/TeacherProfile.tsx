import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Globe, ArrowLeft, Play, MessageCircle, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  video_url: string;
  profile_image_url?: string;
  specializations: string[];
  accent?: string;
  languages_spoken: string[];
  years_experience: number;
  rating: number;
  total_reviews: number;
  hourly_rate_dzd: number;
  hourly_rate_eur: number;
  timezone: string;
}

export const TeacherProfile = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  const fetchTeacher = async () => {
    try {
      const { data, error } = await supabase.rpc('get_approved_teachers');
      
      if (error) throw error;
      
      const teacherData = data.find((t: Teacher) => t.user_id === teacherId);
      if (teacherData) {
        setTeacher(teacherData);
      } else {
        throw new Error('Teacher not found');
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
      toast({
        title: "Error loading teacher",
        description: "Please try again later",
        variant: "destructive",
      });
      navigate('/discover-teachers');
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url: string): string => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*#|.*\/videos\/)?([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  const handleBookLesson = () => {
    navigate(`/student/book-lesson?teacherId=${teacherId}`);
  };

  const handleWatchVideo = () => {
    if (teacher?.video_url) {
      window.open(teacher.video_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading teacher profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Teacher Not Found</h1>
          <Button onClick={() => navigate('/discover-teachers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/discover-teachers')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Teachers
      </Button>

      <div className="space-y-8">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={teacher.profile_image_url} />
                <AvatarFallback className="text-2xl">
                  {teacher.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">{teacher.full_name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">{teacher.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({teacher.total_reviews} reviews)</span>
                  </div>
                  {teacher.accent && (
                    <Badge variant="secondary" className="ml-4">
                      <Globe className="w-4 h-4 mr-1" />
                      {teacher.accent}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 border rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-semibold">{teacher.years_experience} Years</div>
                    <div className="text-sm text-muted-foreground">Experience</div>
                  </div>
                  
                  <div className="text-center p-3 border rounded-lg">
                    <MessageCircle className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-semibold">{teacher.total_reviews}</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{teacher.hourly_rate_dzd}</div>
                    <div className="text-sm text-muted-foreground">DZD per hour</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleBookLesson} size="lg" className="flex-1 md:flex-none">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Lesson
                  </Button>
                  {teacher.video_url && (
                    <Button variant="outline" onClick={handleWatchVideo} size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Intro
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About {teacher.full_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {teacher.bio}
              </p>

              {teacher.specializations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Teaching Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {teacher.languages_spoken.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Languages Spoken</h4>
                  <p className="text-muted-foreground">
                    {teacher.languages_spoken.join(', ')}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Timezone</h4>
                <p className="text-muted-foreground">{teacher.timezone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Introduction Video */}
          {teacher.video_url && (
            <Card>
              <CardHeader>
                <CardTitle>Introduction Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={getEmbedUrl(teacher.video_url)}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`${teacher.full_name} Introduction Video`}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reviews Section (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Student Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Reviews will be displayed here once available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};