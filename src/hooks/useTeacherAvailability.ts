import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AvailabilitySlot } from '@/components/teacher/calendar/modern/types';

export const useTeacherAvailability = (teacherId: string, weekDays: Date[]) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSlots = useCallback(async () => {
    if (!teacherId || weekDays.length === 0) return;

    try {
      setIsLoading(true);
      const startDate = weekDays[0].toISOString();
      const endDate = new Date(weekDays[weekDays.length - 1]);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('teacher_availability')
        .select(`
          id, 
          teacher_id, 
          start_time, 
          end_time, 
          duration, 
          is_available, 
          is_booked, 
          student_id, 
          lesson_id, 
          lesson_title,
          student_profiles:student_id (
            cefr_level,
            final_cefr_level,
            grade_level,
            user_id
          ),
          lessons:lesson_id (
            student_id
          )
        `)
        .eq('teacher_id', teacherId)
        .gte('start_time', startDate)
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('PostgREST error:', error);
        throw error;
      }

      // Fetch student emails for booked slots
      const studentIds = [...new Set((data || [])
        .map(slot => slot.student_id || (slot.lessons as any)?.student_id)
        .filter(Boolean) as string[])];

      let studentEmails: Record<string, string> = {};
      if (studentIds.length > 0) {
        // Get emails from users table via RPC or direct query
        const { data: profiles } = await supabase
          .from('student_profiles')
          .select('user_id')
          .in('user_id', studentIds);
        
        // Fetch auth users to get emails (using a service role query would be needed)
        // For now, we'll just use email domain or display names
        // This is a simplified approach since we can't access auth.users from client
        studentEmails = studentIds.reduce((acc, id) => {
          // We'll use the student email if available from other sources
          acc[id] = ''; // Placeholder, will be populated from available data
          return acc;
        }, {} as Record<string, string>);
      }

      const formattedSlots: AvailabilitySlot[] = (data || []).map(slot => {
        const studentProfile = slot.student_profiles as any;
        const actualStudentId = slot.student_id || (slot.lessons as any)?.student_id;
        
        return {
          id: slot.id,
          teacherId: slot.teacher_id,
          startTime: new Date(slot.start_time),
          endTime: new Date(slot.end_time),
          duration: slot.duration as 30 | 60,
          isAvailable: slot.is_available,
          isBooked: slot.is_booked,
          lessonId: slot.lesson_id || undefined,
          lessonTitle: slot.lesson_title || undefined,
          studentName: undefined,
          studentId: actualStudentId || undefined,
          studentCefrLevel: studentProfile?.cefr_level || undefined,
          studentEmail: studentEmails[actualStudentId] || `student${actualStudentId?.slice(0, 4)}`,
          studentGradeLevel: studentProfile?.grade_level || undefined,
          studentFinalCefrLevel: studentProfile?.final_cefr_level || undefined,
        };
      });

      setSlots(formattedSlots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: 'Error loading calendar',
        description: 'Failed to load availability slots',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, weekDays, toast]);

  // Store fetchSlots in a ref to avoid subscription recreation
  const fetchSlotsRef = useRef(fetchSlots);
  fetchSlotsRef.current = fetchSlots;

  // Initial fetch when dependencies change
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Real-time subscription - only recreate if teacherId changes
  useEffect(() => {
    const channel = supabase
      .channel(`teacher-calendar-${teacherId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_availability',
          filter: `teacher_id=eq.${teacherId}`,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchSlotsRef.current(); // Use ref to avoid subscription recreation
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teacherId]);

  const createSlot = async (date: Date, time: string, duration: 30 | 60) => {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + duration);

      // Check if slot already exists
      const { data: existingSlot } = await supabase
        .from('teacher_availability')
        .select('id, is_booked')
        .eq('teacher_id', teacherId)
        .eq('start_time', startTime.toISOString())
        .maybeSingle();

      if (existingSlot) {
        const status = existingSlot.is_booked ? 'booked' : 'available';
        toast({
          title: 'Slot already exists',
          description: `This time slot is already ${status}`,
          variant: 'default',
        });
        await fetchSlotsRef.current();
        return false;
      }

      const { error } = await supabase
        .from('teacher_availability')
        .insert({
          teacher_id: teacherId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration,
          is_available: true,
          is_booked: false,
        });

      if (error) throw error;

      toast({
        title: 'Slot created',
        description: `${duration}-minute slot added for ${time}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error creating slot:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        toast({
          title: 'Slot already exists',
          description: 'This time slot is already in your calendar',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to create slot',
          description: error.message || 'Please try again',
          variant: 'destructive',
        });
      }
      return false;
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: 'Slot deleted',
        description: 'Availability slot removed',
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting slot:', error);
      toast({
        title: 'Failed to delete slot',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createBulkSlots = async (dates: Date[], times: string[], duration: 30 | 60) => {
    try {
      const slotsToCreate = [];
      const skippedSlots = [];

      for (const date of dates) {
        for (const time of times) {
          const [hours, minutes] = time.split(':').map(Number);
          const startTime = new Date(date);
          startTime.setHours(hours, minutes, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + duration);

          // Check if slot already exists
          const { data: existingSlot } = await supabase
            .from('teacher_availability')
            .select('id')
            .eq('teacher_id', teacherId)
            .eq('start_time', startTime.toISOString())
            .maybeSingle();

          if (existingSlot) {
            skippedSlots.push(`${date.toLocaleDateString()} ${time}`);
            continue;
          }

          slotsToCreate.push({
            teacher_id: teacherId,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            duration,
            is_available: true,
            is_booked: false,
          });
        }
      }

      if (slotsToCreate.length === 0) {
        toast({
          title: 'No new slots',
          description: 'All selected slots already exist in your calendar',
          variant: 'default',
        });
        return false;
      }

      const { error } = await supabase
        .from('teacher_availability')
        .insert(slotsToCreate);

      if (error) throw error;

      const message = skippedSlots.length > 0
        ? `Created ${slotsToCreate.length} slots. Skipped ${skippedSlots.length} duplicates.`
        : `Created ${slotsToCreate.length} availability slots`;

      toast({
        title: 'Slots created',
        description: message,
      });

      return true;
    } catch (error: any) {
      console.error('Error creating bulk slots:', error);
      toast({
        title: 'Failed to create slots',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    slots,
    isLoading,
    createSlot,
    deleteSlot,
    createBulkSlots,
    refetch: fetchSlots,
  };
};
