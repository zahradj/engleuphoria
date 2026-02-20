import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StudentBookingCalendar } from './StudentBookingCalendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface TimeSlot {
  id: string;
  teacherId: string;
  teacherName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isAvailable: boolean;
}

interface BookMyClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Accent color for the modal header (defaults to purple) */
  accentClass?: string;
  studentLevel?: 'playground' | 'academy' | 'professional';
}

export const BookMyClassModal: React.FC<BookMyClassModalProps> = ({
  isOpen,
  onClose,
  accentClass,
  studentLevel = 'academy',
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  // Fetch available slots
  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .from('teacher_availability')
        .select(`
          id,
          teacher_id,
          start_time,
          end_time,
          duration,
          is_available,
          is_booked
        `)
        .eq('is_available', true)
        .eq('is_booked', false)
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(60);

      if (error) throw error;

      if (data) {
        // Fetch teacher names
        const teacherIds = [...new Set(data.map((s) => s.teacher_id))];
        const { data: teachers } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', teacherIds);

        const teacherMap: Record<string, string> = {};
        teachers?.forEach((t) => { teacherMap[t.id] = t.full_name || 'Teacher'; });

        const mapped: TimeSlot[] = data.map((s) => ({
          id: s.id,
          teacherId: s.teacher_id,
          teacherName: teacherMap[s.teacher_id] || 'Teacher',
          startTime: new Date(s.start_time),
          endTime: new Date(s.end_time),
          duration: s.duration || 25,
          isAvailable: s.is_available && !s.is_booked,
        }));

        setSlots(mapped);
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
      fetchSlots();
    }
  }, [isOpen, fetchSlots]);

  // Listen for real-time availability changes
  useEffect(() => {
    const handleChange = () => fetchSlots();
    window.addEventListener('availability-changed', handleChange);
    return () => window.removeEventListener('availability-changed', handleChange);
  }, [fetchSlots]);

  const handleBookSlot = async (slot: TimeSlot) => {
    if (!user?.id || booking) return;
    setBooking(true);

    try {
      // Atomic update: mark slot as booked only if still available (prevents double booking)
      const { data: updated, error: updateError } = await supabase
        .from('teacher_availability')
        .update({ is_booked: true })
        .eq('id', slot.id)
        .eq('is_booked', false)
        .eq('is_available', true)
        .select('id')
        .single();

      if (updateError || !updated) {
        toast({
          title: 'Slot no longer available',
          description: 'Someone just booked this slot. Please choose another time.',
          variant: 'destructive',
        });
        await fetchSlots();
        setBooking(false);
        return;
      }

      // Insert booking record into class_bookings
      const { error: bookingError } = await supabase
        .from('class_bookings')
        .insert({
          student_id: user.id,
          teacher_id: slot.teacherId,
          scheduled_at: slot.startTime.toISOString(),
          duration: slot.duration,
          booking_type: 'standard',
          price_paid: 0,
          status: 'confirmed',
        });

      if (bookingError) {
        console.error('Booking insert failed:', bookingError);
        // Revert the slot if booking insert fails
        await supabase
          .from('teacher_availability')
          .update({ is_booked: false })
          .eq('id', slot.id);

        toast({
          title: 'Booking failed',
          description: 'Could not complete booking. Please try again.',
          variant: 'destructive',
        });
        setBooking(false);
        return;
      }

      // 🎉 Success — fire confetti
      setBooked(true);
      fireConfetti();

      toast({
        title: '🎉 Class booked!',
        description: 'Check your email for a reminder 1 hour before the session.',
      });

      // Close modal after 2.5 seconds
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
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#06b6d4', '#ec4899'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#06b6d4', '#ec4899'],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  };

  const levelConfig = {
    playground: { label: 'Book a Class', icon: '🌈', headerBg: 'from-pink-500 to-purple-500' },
    academy: { label: 'Book a Slot', icon: '⚡', headerBg: 'from-purple-600 to-cyan-500' },
    professional: { label: 'Schedule a Session', icon: '📅', headerBg: 'from-emerald-500 to-teal-500' },
  };

  const config = levelConfig[studentLevel];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${config.headerBg} p-6 rounded-t-lg`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white text-xl font-bold">
              <span className="text-2xl">{config.icon}</span>
              {config.label}
              <button
                onClick={onClose}
                className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </DialogTitle>
            <p className="text-white/80 text-sm mt-1">
              Choose a date and time that works best for you
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {booked ? (
              /* ✅ Success state */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <CheckCircle className="w-20 h-20 text-emerald-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground">Booking Confirmed! 🎉</h3>
                <p className="text-muted-foreground max-w-sm">
                  Your class is booked. You'll receive an email reminder 1 hour before the session.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Keep up the great work!
                </div>
              </motion.div>
            ) : loadingSlots ? (
              /* ⏳ Loading state */
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
              /* 📅 Calendar */
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <StudentBookingCalendar
                  availableSlots={slots}
                  onBookLesson={handleBookSlot}
                  isLoading={booking}
                />

                {/* Refresh button */}
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchSlots}
                    disabled={loadingSlots}
                    className="text-muted-foreground text-xs"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Refresh availability
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
