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
          lesson_id,
          lessons:lesson_id (
            id,
            title,
            student_id,
            users:student_id (full_name)
          )
        `)
        .eq('teacher_id', teacherId)
        .gte('start_time', startDate)
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedSlots: AvailabilitySlot[] = (data || []).map(slot => ({
        id: slot.id,
        teacherId: slot.teacher_id,
        startTime: new Date(slot.start_time),
        endTime: new Date(slot.end_time),
        duration: slot.duration as 30 | 60,
        isAvailable: slot.is_available,
        isBooked: slot.is_booked,
        lessonId: slot.lesson_id || undefined,
        lessonTitle: (slot.lessons as any)?.title,
        studentName: (slot.lessons as any)?.users?.full_name,
      }));

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
      toast({
        title: 'Failed to create slot',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
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

      for (const date of dates) {
        for (const time of times) {
          const [hours, minutes] = time.split(':').map(Number);
          const startTime = new Date(date);
          startTime.setHours(hours, minutes, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + duration);

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

      const { error } = await supabase
        .from('teacher_availability')
        .insert(slotsToCreate);

      if (error) throw error;

      toast({
        title: 'Bulk slots created',
        description: `Created ${slotsToCreate.length} availability slots`,
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
