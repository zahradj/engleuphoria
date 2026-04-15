import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Globe, Clock, Play, Zap, Filter, Video, ChevronRight, Sparkles, GraduationCap, Rocket, Sun } from 'lucide-react';
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
  _hubs?: string[];
}

type HubFilter = 'all' | 'playground' | 'academy' | 'professional';

// Hub-branded styling
const HUB_CARD_STYLES: Record<string, {
  border: string;
  bg: string;
  badgeBg: string;
  badgeText: string;
  badgeIcon: React.ReactNode;
  badgeLabel: string;
  ctaGradient: string;
}> = {
  Playground: {
    border: 'border-orange-400/40 hover:border-orange-500',
    bg: 'bg-gradient-to-br from-amber-50/80 to-orange-50/50',
    badgeBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
    badgeText: 'text-white',
    badgeIcon: <Sun className="h-3 w-3" />,
    badgeLabel: 'Playground Specialist',
    ctaGradient: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
  },
  Academy: {
    border: 'border-blue-400/40 hover:border-blue-500',
    bg: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50',
    badgeBg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    badgeText: 'text-white',
    badgeIcon: <GraduationCap className="h-3 w-3" />,
    badgeLabel: 'Academy Mentor',
    ctaGradient: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
  },
  Professional: {
    border: 'border-emerald-400/40 hover:border-emerald-500',
    bg: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/50',
    badgeBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    badgeText: 'text-white',
    badgeIcon: <Rocket className="h-3 w-3" />,
    badgeLabel: 'Success Coach',
    ctaGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
  },
  General: {
    border: 'border-border/40 hover:border-primary/30',
    bg: 'bg-card/60',
    badgeBg: 'bg-muted',
    badgeText: 'text-muted-foreground',
    badgeIcon: null,
    badgeLabel: 'Teacher',
    ctaGradient: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90',
  },
};

const FindTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Auto-set hub filter from URL param (e.g. /find-teacher?hub=playground)
  const initialHub = (searchParams.get('hub') as HubFilter) || 'all';
  const [hubFilter, setHubFilter] = useState<HubFilter>(initialHub);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_approved_teachers');
      if (error) throw error;

      const teacherList = (data as any[]) || [];
      if (teacherList.length > 0) {
        const teacherIds = teacherList.map(t => t.user_id);
        const { data: hubData } = await supabase
          .from('teacher_availability')
          .select('teacher_id, hub_specialty')
          .in('teacher_id', teacherIds)
          .not('hub_specialty', 'is', null)
          .limit(500);

        if (hubData) {
          const hubMap: Record<string, Set<string>> = {};
          hubData.forEach(h => {
            if (!hubMap[h.teacher_id]) hubMap[h.teacher_id] = new Set();
            if (h.hub_specialty) hubMap[h.teacher_id].add(h.hub_specialty);
          });
          teacherList.forEach(t => {
            (t as any)._hubs = hubMap[t.user_id] ? Array.from(hubMap[t.user_id]) : [];
          });
        }
      }

      setTeachers(teacherList);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTeacherHub = (teacher: TeacherProfile): string => {
    const hubs = (teacher as any)._hubs || [];
    if (hubs.includes('Playground')) return 'Playground';
    if (hubs.includes('Academy')) return 'Academy';
    if (hubs.includes('Professional')) return 'Professional';
    // Fallback: infer from specializations
    const specs = teacher.specializations?.join(' ').toLowerCase() || '';
    if (specs.includes('kid') || specs.includes('playground') || specs.includes('young')) return 'Playground';
    if (specs.includes('teen') || specs.includes('academy')) return 'Academy';
    if (specs.includes('adult') || specs.includes('professional') || specs.includes('business')) return 'Professional';
    return 'General';
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = !searchTerm ||
      t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.accent?.toLowerCase().includes(searchTerm.toLowerCase());

    const hubFilterMap: Record<string, string> = {
      playground: 'Playground',
      academy: 'Academy',
      professional: 'Professional',
    };

    const matchesHub = hubFilter === 'all' ||
      ((t as any)._hubs || []).includes(hubFilterMap[hubFilter]) ||
      getTeacherHub(t) === hubFilterMap[hubFilter];

    return matchesSearch && matchesHub;
  });

  const handleBookTeacher = (teacherUserId: string) => {
    setSelectedTeacherId(teacherUserId);
    setShowBookingModal(true);
  };

  const getStudentLevel = (): 'playground' | 'academy' | 'professional' => {
    if (hubFilter === 'playground') return 'playground';
    if (hubFilter === 'professional') return 'professional';
    return 'academy';
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
              <TabsTrigger value="playground">🎪 Playground</TabsTrigger>
              <TabsTrigger value="academy">📘 Academy</TabsTrigger>
              <TabsTrigger value="professional">🏆 Success</TabsTrigger>
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
                const hub = getTeacherHub(teacher);
                const style = HUB_CARD_STYLES[hub] || HUB_CARD_STYLES.General;

                return (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                  >
                    <Card className={cn(
                      "group relative overflow-hidden border-2 backdrop-blur-sm hover:shadow-lg transition-all duration-300",
                      style.border,
                      style.bg
                    )}>
                      {/* Hub Badge — top right */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md",
                          style.badgeBg,
                          style.badgeText
                        )}>
                          {style.badgeIcon}
                          {style.badgeLabel}
                        </div>
                      </div>

                      {/* Teacher Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className={cn("h-16 w-16 border-2", style.border)}>
                              <AvatarImage src={teacher.profile_image_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {teacher.full_name?.charAt(0) || 'T'}
                              </AvatarFallback>
                            </Avatar>
                            {teacher.is_available && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-20">
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
                          className={cn("text-white shadow-md gap-1.5", style.ctaGradient)}
                        >
                          Book Session <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Live indicator */}
                      {teacher.is_available && (
                        <div className="absolute top-12 right-3">
                          <Badge className="bg-emerald-500/90 text-white border-0 gap-1 text-xs animate-pulse">
                            <Zap className="h-3 w-3" /> Live
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
        studentLevel={getStudentLevel()}
      />
    </div>
  );
};

export default FindTeacher;
