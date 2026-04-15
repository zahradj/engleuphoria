import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Loader2, CheckCircle, Sparkles, Link2, AlertTriangle, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudentBookingCalendar } from './StudentBookingCalendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '@/hooks/useThemeMode';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { mergeAdjacentSlots, MergedSlot } from '@/utils/slotMerger';

interface TimeSlot {
  id: string;
  teacherId: string;
  teacherName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isAvailable: boolean;
}

type HubType = 'playground' | 'academy' | 'professional';

interface BookMyClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentClass?: string;
  studentLevel?: HubType;
}

const HUB_CONFIG = {
  playground: {
    label: 'Playground',
    duration: 30,
    icon: '🌈',
    headerBg: 'from-amber-400 via-orange-400 to-red-400',
    description: 'Quick 30-minute fun sessions — half price!',
    bookLabel: 'Book a Class',
  },
  academy: {
    label: 'Academy Hub',
    duration: 60,
    icon: '📘',
    headerBg: 'from-indigo-800 via-blue-800 to-purple-800',
    description: 'Deep 60-minute learning sessions',
    bookLabel: 'Book a Slot',
  },
  professional: {
    label: 'Success Hub',
    duration: 60,
    icon: '🎯',
    headerBg: 'from-emerald-700 via-green-700 to-teal-600',
    description: 'Professional 60-minute coaching',
    bookLabel: 'Schedule a Session',
  },
};

export const BookMyClassModal: React.FC<BookMyClassModalProps> = ({
  isOpen,
  onClose,
  accentClass,
  studentLevel = 'academy',
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { totalCredits, trialAvailable, loading: creditsLoading } = usePackageValidation(user?.id || null);
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  // Lock hub to the student's level — no switching allowed
  const selectedHub: HubType = studentLevel;
  const [rawSlots, setRawSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  const hasCredits = totalCredits > 0 || trialAvailable;
  const config = HUB_CONFIG[selectedHub];
  const slotDuration = config.duration;

  // Compute display slots based on hub selection
  const displaySlots: (TimeSlot & { sourceSlotIds?: string[] })[] = useMemo(() => {
    if (slotDuration === 30) {
      return rawSlots.map(s => ({ ...s, sourceSlotIds: [s.id] }));
    }
    // 60-min: merge adjacent 30-min slots
    return mergeAdjacentSlots(rawSlots);
  }, [rawSlots, slotDuration]);

  // Fetch available slots (always fetch raw 30-min slots)
  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .from('teacher_availability')
        .select('id, teacher_id, start_time, end_time, duration, is_available, is_booked, hub_specialty')
        .eq('is_available', true)
        .eq('is_booked', false)
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(120);

      if (error) throw error;

      if (data) {
        const teacherIds = [...new Set(data.map(s => s.teacher_id))];
        const { data: teachers } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', teacherIds);

        const teacherMap: Record<string, string> = {};
        teachers?.forEach(t => { teacherMap[t.id] = t.full_name || 'Teacher'; });

        const mapped: TimeSlot[] = data.map(s => ({
          id: s.id,
          teacherId: s.teacher_id,
          teacherName: teacherMap[s.teacher_id] || 'Teacher',
          startTime: new Date(s.start_time),
          endTime: new Date(s.end_time),
          duration: s.duration || 30,
          isAvailable: s.is_available && !s.is_booked,
        }));

        setRawSlots(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch availability slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setBooked(false);
      setMeetingLink(null);
      fetchSlots();
    }
  }, [isOpen, fetchSlots]);

  useEffect(() => {
    const handleChange = () => fetchSlots();
    window.addEventListener('availability-changed', handleChange);
    return () => window.removeEventListener('availability-changed', handleChange);
  }, [fetchSlots]);

  const handleBookSlot = async (slot: TimeSlot & { sourceSlotIds?: string[] }) => {
    if (!user?.id || booking) return;

    // Credit check at confirm time — show prompt instead of silently blocking
    if (!hasCredits) {
      toast({
        title: 'Credits required',
        description: 'You need credits to book this session. Redirecting to purchase...',
        variant: 'destructive',
      });
      setTimeout(() => {
        onClose();
        navigate('/student?tab=packages');
      }, 1500);
      return;
    }
    setBooking(true);

    const slotIds = slot.sourceSlotIds || [slot.id];

    try {
      // Atomic update: mark all source slots as booked
      for (const slotId of slotIds) {
        const { data: updated, error: updateError } = await supabase
          .from('teacher_availability')
          .update({ is_booked: true, student_id: user.id })
          .eq('id', slotId)
          .eq('is_booked', false)
          .eq('is_available', true)
          .select('id')
          .single();

        if (updateError || !updated) {
          // Rollback any previously marked slots
          for (const prevId of slotIds) {
            await supabase
              .from('teacher_availability')
              .update({ is_booked: false, student_id: null })
              .eq('id', prevId)
              .eq('student_id', user.id);
          }

          toast({
            title: 'Slot no longer available',
            description: "Oops! This slot was just taken. Please try another time.",
            variant: 'destructive',
          });
          await fetchSlots();
          setBooking(false);
          return;
        }
      }

      // Consume a credit (skip for trial bookings)
      let isTrial = false;
      if (trialAvailable) {
        isTrial = true;
      } else {
        await supabase.rpc('consume_credit', { p_student_id: user.id });
      }

      // Create a lesson record
      const lessonTitle = isTrial
        ? `Trial Lesson with ${slot.teacherName}`
        : `${config.label} Lesson with ${slot.teacherName}`;

      const { data: lessonRecord, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: lessonTitle,
          teacher_id: slot.teacherId,
          student_id: user.id,
          scheduled_at: slot.startTime.toISOString(),
          duration: slotDuration,
          status: 'scheduled',
          cost: 0,
        })
        .select('id, room_id, room_link')
        .single();

      if (lessonError) {
        console.error('Lesson creation failed:', lessonError);
      }

      // Update all availability slots with lesson reference
      if (lessonRecord) {
        for (const slotId of slotIds) {
          await supabase
            .from('teacher_availability')
            .update({ lesson_id: lessonRecord.id, lesson_title: lessonTitle })
            .eq('id', slotId);
        }
      }

      // Insert booking record with hub_type
      const hubTypeMap: Record<string, string> = {
        playground: 'playground',
        academy: 'academy',
        professional: 'professional',
      };
      const { data: bookingData, error: bookingError } = await supabase
        .from('class_bookings')
        .insert({
          student_id: user.id,
          teacher_id: slot.teacherId,
          scheduled_at: slot.startTime.toISOString(),
          duration: slotDuration,
          booking_type: isTrial ? 'trial' : 'standard',
          price_paid: 0,
          status: 'confirmed',
          lesson_id: lessonRecord?.id || null,
          hub_type: hubTypeMap[selectedHub] || 'academy',
        } as any)
        .select('session_id, meeting_link, classroom_id')
        .single();

      // Also insert into appointments table
      await supabase.from('appointments').insert({
        student_id: user.id,
        teacher_id: slot.teacherId,
        availability_id: slotIds[0],
        status: 'confirmed',
        hub_type: config.label,
        scheduled_at: slot.startTime.toISOString(),
        duration: slotDuration,
        meeting_link: bookingData?.meeting_link || null,
        lesson_id: lessonRecord?.id || null,
      });

      if (bookingError) {
        console.error('Booking insert failed:', bookingError);
        for (const slotId of slotIds) {
          await supabase
            .from('teacher_availability')
            .update({ is_booked: false, student_id: null })
            .eq('id', slotId);
        }
        toast({
          title: 'Booking failed',
          description: 'Could not complete booking. Please try again.',
          variant: 'destructive',
        });
        setBooking(false);
        return;
      }

      // 🎉 Success — use classroom_id-based link
      const classroomLink = (bookingData as any)?.classroom_id 
        ? `/classroom/${(bookingData as any).classroom_id}` 
        : bookingData?.meeting_link ?? null;
      setMeetingLink(classroomLink);
      setBooked(true);
      fireConfetti();

      toast({
        title: '🎉 Class booked!',
        description: `Success! Your ${slotDuration}-minute ${config.label} session has been booked.`,
      });

      setTimeout(() => {
        onClose();
        setBooked(false);
      }, 2500);
    } catch (err: any) {
      console.error('Booking error:', err);
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBooking(false);
    }
  };

  const fireConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#06b6d4', '#ec4899'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#06b6d4', '#ec4899'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
        {/* Film grain overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]">
          <svg width="100%" height="100%">
            <filter id="booking-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#booking-grain)" />
          </svg>
        </div>

        <div className={cn(
          "relative rounded-2xl overflow-hidden border",
          isDark
            ? "bg-background/80 backdrop-blur-xl border-white/10"
            : "bg-white/90 backdrop-blur-xl border-gray-200/50"
        )}>
          {/* Glass Gradient Header */}
          <div className={cn(
            "relative bg-gradient-to-r p-6 backdrop-blur-md",
            config.headerBg
          )}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl font-bold">
                <span className="text-2xl">{config.icon}</span>
                {config.bookLabel}
                {!creditsLoading && (
                  <Badge className={cn(
                    "ml-2 text-xs font-medium",
                    hasCredits
                      ? "bg-white/20 text-white border-white/30 hover:bg-white/30"
                      : "bg-red-500/30 text-white border-red-400/30"
                  )}>
                    <CreditCard className="w-3 h-3 mr-1" />
                    {trialAvailable ? '🎁 Free Trial Available' : `${totalCredits} credit${totalCredits !== 1 ? 's' : ''} remaining`}
                  </Badge>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </DialogTitle>
              <p className="text-white/80 text-sm mt-1">
                {config.description} • {slotDuration} minutes per session
              </p>
            </DialogHeader>
          </div>

          <div className="p-6">
            {/* Hub info (locked to student level) */}
            <div className="mb-5">
              <div className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium border inline-flex items-center gap-2",
                "bg-primary/10 text-primary border-primary/20"
              )}>
                <span>{config.icon}</span>
                {config.label} • {slotDuration} min sessions
              </div>
            </div>

            {/* No credits warning */}
            {!creditsLoading && !hasCredits && !booked && (
              <div className={cn(
                "mb-4 p-4 rounded-xl border flex items-start gap-3",
                isDark
                  ? "bg-red-500/10 border-red-500/20 backdrop-blur-sm"
                  : "bg-red-50/80 border-red-200/50"
              )}>
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-destructive">No credits available</p>
                  <p className="text-sm text-destructive/80 mt-1">
                    You need at least 1 credit to book a session. Purchase a credit pack to continue.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => { onClose(); navigate('/student?tab=packages'); }}
                >
                  Get Credits
                </Button>
              </div>
            )}

            {/* Trial banner */}
            {!creditsLoading && trialAvailable && !booked && (
              <div className={cn(
                "mb-4 p-4 rounded-xl border flex items-start gap-3",
                isDark
                  ? "bg-emerald-500/10 border-emerald-500/20 backdrop-blur-sm"
                  : "bg-emerald-50/80 border-emerald-200/50"
              )}>
                <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-700">🎁 Your First Lesson is Free!</p>
                  <p className="text-sm text-emerald-600/80 mt-1">
                    Book your free trial lesson at no cost. Pick a time and start learning!
                  </p>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {booked ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 blur-xl" />
                    <CheckCircle className="relative w-20 h-20 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground">Booking Confirmed! 🎉</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Your {slotDuration}-minute {config.label} session is booked.
                  </p>
                  {meetingLink && (
                    <div className={cn(
                      "w-full max-w-sm rounded-lg p-3 border",
                      isDark ? "bg-white/5 border-white/10" : "bg-muted/50 border-border"
                    )}>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        Your classroom link
                      </p>
                      <p className="text-sm font-mono text-foreground break-all">{meetingLink}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Keep up the great work!
                  </div>
                </motion.div>
              ) : loadingSlots ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 gap-4"
                >
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading available slots...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <StudentBookingCalendar
                    availableSlots={displaySlots}
                    onBookLesson={handleBookSlot}
                    isLoading={booking}
                  />

                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchSlots}
                      disabled={loadingSlots}
                      className="text-muted-foreground text-xs"
                    >
                      Refresh availability
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
