import { supabase } from "@/integrations/supabase/client";

interface BatchSlotData {
  teacher_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  lesson_type: string;
  is_available: boolean;
  is_booked: boolean;
}

class BatchAvailabilityService {
  /**
   * Creates multiple availability slots in a single batch operation
   * Optimized for performance with minimal database queries
   */
  async createBatchSlots(
    teacherId: string,
    dates: Date[],
    times: string[],
    duration: 25 | 55
  ): Promise<void> {
    const slots: BatchSlotData[] = [];

    // Generate all slot combinations
    for (const date of dates) {
      for (const time of times) {
        const [hours, minutes] = time.split(':').map(Number);
        
        const startDateTime = new Date(date);
        startDateTime.setHours(hours, minutes, 0, 0);
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + duration);

        slots.push({
          teacher_id: teacherId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          duration,
          lesson_type: 'free_slot',
          is_available: true,
          is_booked: false
        });
      }
    }

    // Single batch insert with conflict handling
    const { data, error } = await supabase
      .from('teacher_availability')
      .insert(slots)
      .select();

    if (error) {
      // Check if it's a duplicate key error
      if (error.code === '23505') {
        // Some slots already exist, try inserting one by one to find which ones work
        const results = await this.insertSlotsIndividually(slots);
        if (results.failed > 0) {
          console.warn(`${results.failed} slots already existed and were skipped`);
        }
        return;
      }
      throw error;
    }
  }

  /**
   * Fallback method to insert slots individually when batch insert fails
   * Returns count of successful and failed insertions
   */
  private async insertSlotsIndividually(
    slots: BatchSlotData[]
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const slot of slots) {
      const { error } = await supabase
        .from('teacher_availability')
        .insert(slot);

      if (error) {
        if (error.code === '23505') {
          failed++; // Duplicate, skip
        } else {
          throw error; // Real error, throw it
        }
      } else {
        success++;
      }
    }

    return { success, failed };
  }

  /**
   * Counts available slots for a teacher in a given date range
   */
  async countAvailableSlots(
    teacherId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    let query = supabase
      .from('teacher_availability')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', teacherId)
      .eq('is_available', true)
      .eq('is_booked', false);

    if (startDate) {
      query = query.gte('start_time', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('start_time', endDate.toISOString());
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }

  /**
   * Gets the next available slot for a teacher
   */
  async getNextAvailableSlot(teacherId: string): Promise<Date | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('teacher_availability')
      .select('start_time')
      .eq('teacher_id', teacherId)
      .eq('is_available', true)
      .eq('is_booked', false)
      .gte('start_time', now)
      .order('start_time', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No results
      throw error;
    }

    return data ? new Date(data.start_time) : null;
  }

  /**
   * Deletes multiple slots in batch
   */
  async deleteBatchSlots(slotIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('teacher_availability')
      .delete()
      .in('id', slotIds);

    if (error) throw error;
  }
}

export const batchAvailabilityService = new BatchAvailabilityService();