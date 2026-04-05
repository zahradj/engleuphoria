import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Globe, Clock, Play, Zap, Filter, Video, ChevronRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { BookMyClassModal } from '@/components/student/BookMyClassModal';
import { cn } from '@/lib/utils';

interface TeacherProfile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  video_url: string | null;
  profile_image_url: string | null;
  specializations: string[] | null;
  accent: string | null;
  languages_spoken: string[] | null;
  years_experience: number | null;
  rating: number | null;
  total_reviews: number | null;
  hourly_rate_eur: number | null;
  timezone: string | null;
  is_available: boolean;
}

type HubFilter = 'all' | 'playground' | 'academy' | 'professional';

const FindTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hubFilter, setHubFilter] = useState<HubFilter>('all');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_approved_teachers');
      if (error) throw error;
      setTeachers((data as any[]) || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = !searchTerm ||
      t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.accent?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHub = hubFilter === 'all' ||
      t.specializations?.some(s => s.toLowerCase().includes(hubFilter));

    return matchesSearch && matchesHub;
  });

  const handleBookTeacher = (teacherUserId: string) => {
    setSelectedTeacherId(teacherUserId);
    setShowBookingModal(true);
  };

  const getHubBadge = (specializations: string[] | null) => {
    if (!specializations) return null;
    const joined = specializations.join(' ').toLowerCase();
    if (joined.includes('kid') || joined.includes('playground') || joined.includes('young')) return 'Playground';
    if (joined.includes('teen') || joined.includes('academy')) return 'Academy';
    if (joined.includes('adult') || joined.includes('professional') || joined.includes('business')) return 'Professional';
    return 'General';
  };

  const hubBadgeColor = (hub: string) => {
    switch (hub) {
      case 'Playground': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Academy': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Professional': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackNavigation />

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
            Find Your Perfect Teacher
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our expert educators, watch their intro videos, and book your first session
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, specialization, or accent..."
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
            />
          </div>
          <Tabs value={hubFilter} onValueChange={(v) => setHubFilter(v as HubFilter)}>
            <TabsList className="bg-card/50 border border-border/30">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="playground">🎮 Kids</TabsTrigger>
              <TabsTrigger value="academy">📚 Teens</TabsTrigger>
              <TabsTrigger value="professional">💼 Adults</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Teacher Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-80 animate-pulse bg-card/30" />
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No teachers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTeachers.map((teacher, i) => {
                const hub = getHubBadge(teacher.specializations);
                return (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                  >
                    <Card className="group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                      {/* Teacher Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-primary/20">
                              <AvatarImage src={teacher.profile_image_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {teacher.full_name?.charAt(0) || 'T'}
                              </AvatarFallback>
                            </Avatar>
                            {teacher.is_available && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-foreground truncate">{teacher.full_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {teacher.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-medium text-foreground">{teacher.rating.toFixed(1)}</span>
                                  <span className="text-xs text-muted-foreground">({teacher.total_reviews})</span>
                                </div>
                              )}
                            </div>
                            {hub && (
                              <Badge variant="outline" className={cn("mt-2 text-xs", hubBadgeColor(hub))}>
                                {hub} Expert
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="px-6 pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {teacher.bio || 'Passionate English teacher ready to help you succeed.'}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="px-6 pb-4 flex flex-wrap gap-2">
                        {teacher.accent && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Globe className="h-3 w-3" /> {teacher.accent}
                          </Badge>
                        )}
                        {teacher.years_experience && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Clock className="h-3 w-3" /> {teacher.years_experience}y exp
                          </Badge>
                        )}
                        {teacher.video_url && (
                          <Badge variant="secondary" className="text-xs gap-1 text-indigo-400 border-indigo-500/20">
                            <Video className="h-3 w-3" /> Intro Video
                          </Badge>
                        )}
                      </div>

                      {/* Languages */}
                      {teacher.languages_spoken && teacher.languages_spoken.length > 0 && (
                        <div className="px-6 pb-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs text-muted-foreground">Speaks:</span>
                            {teacher.languages_spoken.slice(0, 3).map(lang => (
                              <Badge key={lang} variant="outline" className="text-xs px-1.5 py-0 h-5">
                                {lang}
                              </Badge>
                            ))}
                            {teacher.languages_spoken.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{teacher.languages_spoken.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="px-6 pb-6 flex items-center justify-between">
                        {teacher.hourly_rate_eur && (
                          <span className="text-lg font-bold text-foreground">
                            €{teacher.hourly_rate_eur}<span className="text-xs text-muted-foreground font-normal">/hr</span>
                          </span>
                        )}
                        <Button
                          onClick={() => handleBookTeacher(teacher.user_id)}
                          size="sm"
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-md shadow-primary/20 gap-1.5"
                        >
                          Book Session <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Live indicator */}
                      {teacher.is_available && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-emerald-500/90 text-white border-0 gap-1 text-xs animate-pulse">
                            <Zap className="h-3 w-3" /> Live Now
                          </Badge>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookMyClassModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedTeacherId(null);
        }}
      />
    </div>
  );
};

export default FindTeacher;
