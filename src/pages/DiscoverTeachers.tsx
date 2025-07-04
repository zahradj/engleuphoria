import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Play, Clock, Globe, Search, Users } from 'lucide-react';
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

export const DiscoverTeachers = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccent, setSelectedAccent] = useState('all');

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, selectedAccent]);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_approved_teachers');
      
      if (error) throw error;
      
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: "Error loading teachers",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedAccent !== 'all') {
      filtered = filtered.filter(teacher => 
        teacher.accent?.toLowerCase() === selectedAccent.toLowerCase()
      );
    }

    setFilteredTeachers(filtered);
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

  const handleBookTeacher = (teacherId: string, teacherName: string) => {
    toast({
      title: "Booking Request",
      description: `Booking system for ${teacherName} will be available soon!`,
    });
  };

  const uniqueAccents = [...new Set(teachers.map(t => t.accent).filter(Boolean))];

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading teachers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Our Teachers</h1>
        <p className="text-muted-foreground">
          Find the perfect English teacher for your learning journey
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, bio, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={selectedAccent}
            onChange={(e) => setSelectedAccent(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Accents</option>
            {uniqueAccents.map(accent => (
              <option key={accent} value={accent}>{accent}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={teacher.profile_image_url} />
                  <AvatarFallback>
                    {teacher.full_name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{teacher.full_name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{teacher.rating.toFixed(1)}</span>
                    <span>({teacher.total_reviews} reviews)</span>
                  </div>
                  {teacher.accent && (
                    <Badge variant="secondary" className="mt-1">
                      <Globe className="w-3 h-3 mr-1" />
                      {teacher.accent}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {teacher.bio}
              </p>

              {/* Specializations */}
              {teacher.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {teacher.specializations.slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {teacher.specializations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.specializations.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Experience & Price */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {teacher.years_experience} years exp.
                </div>
                <div className="font-semibold">
                  {teacher.hourly_rate_dzd} DZD/hr
                </div>
              </div>

              {/* Embedded Video */}
              {teacher.video_url && (
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
              )}

              {/* Languages */}
              {teacher.languages_spoken.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <strong>Languages:</strong> {teacher.languages_spoken.join(', ')}
                </div>
              )}

              {/* Book Button */}
              <Button 
                className="w-full" 
                onClick={() => handleBookTeacher(teacher.user_id, teacher.full_name)}
              >
                Book a Lesson
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
};