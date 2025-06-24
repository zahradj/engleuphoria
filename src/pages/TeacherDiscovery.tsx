
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Play, MessageCircle, Clock, Globe, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeacherProfile {
  id: string;
  user_id: string;
  bio: string;
  specializations: string[];
  accent: string;
  languages_spoken: string[];
  intro_video_url: string;
  profile_image_url: string;
  hourly_rate_dzd: number;
  hourly_rate_eur: number;
  years_experience: number;
  rating: number;
  total_reviews: number;
  is_available: boolean;
  timezone: string;
  full_name?: string;
}

// Mock data for teachers since Supabase isn't connected
const mockTeachers: TeacherProfile[] = [
  {
    id: "1",
    user_id: "teacher1",
    bio: "Experienced English teacher with a passion for helping students achieve fluency through interactive lessons.",
    specializations: ["Business English", "Conversation", "Grammar"],
    accent: "American",
    languages_spoken: ["English", "Spanish"],
    intro_video_url: "",
    profile_image_url: "",
    hourly_rate_dzd: 2500,
    hourly_rate_eur: 15,
    years_experience: 8,
    rating: 4.9,
    total_reviews: 127,
    is_available: true,
    timezone: "EST",
    full_name: "Sarah Johnson"
  },
  {
    id: "2",
    user_id: "teacher2",
    bio: "Native British speaker specializing in IELTS preparation and academic English.",
    specializations: ["IELTS Prep", "Academic English", "Pronunciation"],
    accent: "British",
    languages_spoken: ["English", "French"],
    intro_video_url: "",
    profile_image_url: "",
    hourly_rate_dzd: 2800,
    hourly_rate_eur: 18,
    years_experience: 6,
    rating: 4.8,
    total_reviews: 95,
    is_available: true,
    timezone: "GMT",
    full_name: "James Wilson"
  },
  {
    id: "3",
    user_id: "teacher3",
    bio: "Specialized in teaching children and teenagers with fun, engaging methods.",
    specializations: ["Kids English", "Conversation", "Grammar"],
    accent: "Australian",
    languages_spoken: ["English"],
    intro_video_url: "",
    profile_image_url: "",
    hourly_rate_dzd: 2200,
    hourly_rate_eur: 13,
    years_experience: 5,
    rating: 4.7,
    total_reviews: 78,
    is_available: true,
    timezone: "AEST",
    full_name: "Emma Davis"
  }
];

const TeacherDiscovery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedAccent, setSelectedAccent] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, selectedSpecialization, selectedAccent]);

  const fetchTeachers = async () => {
    try {
      // Using mock data instead of Supabase for now
      setTeachers(mockTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: "Error",
        description: "Failed to load teachers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(teacher =>
        teacher.specializations.includes(selectedSpecialization)
      );
    }

    if (selectedAccent) {
      filtered = filtered.filter(teacher =>
        teacher.accent === selectedAccent
      );
    }

    setFilteredTeachers(filtered);
  };

  const handleBookTeacher = (teacherId: string) => {
    toast({
      title: "Booking Feature",
      description: "Teacher booking will be available soon!",
    });
  };

  const handleWatchIntro = (videoUrl: string) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      toast({
        title: "Video Unavailable",
        description: "This teacher hasn't uploaded an intro video yet.",
      });
    }
  };

  const getSpecializations = () => {
    const allSpecs = teachers.flatMap(t => t.specializations);
    return [...new Set(allSpecs)];
  };

  const getAccents = () => {
    const allAccents = teachers.map(t => t.accent).filter(Boolean);
    return [...new Set(allAccents)];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect English Teacher
          </h1>
          <p className="text-gray-600 mb-6">
            Browse our qualified teachers and book your next lesson
          </p>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specializations</SelectItem>
                  {getSpecializations().map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAccent} onValueChange={setSelectedAccent}>
                <SelectTrigger>
                  <SelectValue placeholder="Accent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Accents</SelectItem>
                  {getAccents().map(accent => (
                    <SelectItem key={accent} value={accent}>{accent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("");
                  setSelectedAccent("");
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={teacher.profile_image_url} />
                    <AvatarFallback>
                      {teacher.full_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{teacher.full_name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{teacher.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({teacher.total_reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-3 h-3" />
                      <span>{teacher.accent}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {teacher.bio || "Experienced English teacher ready to help you succeed!"}
                </p>

                <div className="flex flex-wrap gap-1">
                  {teacher.specializations.slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {teacher.specializations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.specializations.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {teacher.years_experience} years exp.
                  </span>
                  <span className="font-semibold text-purple-600">
                    {teacher.hourly_rate_dzd.toLocaleString()} DZD/hour
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleWatchIntro(teacher.intro_video_url)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Watch Intro
                  </Button>
                  
                  <Button
                    size="sm"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleBookTeacher(teacher.user_id)}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Book Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No teachers found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialization("");
                setSelectedAccent("");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDiscovery;
