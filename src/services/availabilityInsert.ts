import type { SupabaseClient } from "@supabase/supabase-js";

// Types for availability slot inserts
export interface AvailabilitySlotInsert {
  teacher_id: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  duration: number;   // minutes
  lesson_type: string;
  is_available: boolean;
  is_booked?: boolean;
  // Allow extra props to pass-through without causing TS errors
  [key: string]: any;
}

// Normalize to 30/60 minutes
const to30or60 = (d: number): 30 | 60 => (d >= 55 ? 60 : 30);
// Normalize to 25/55 minutes
const to25or55 = (d: number): 25 | 55 => (d >= 55 ? 55 : 25);

function mapDurations<T extends AvailabilitySlotInsert>(slots: T[], mapper: (d: number) => number): T[] {
  return slots.map((s) => ({ ...s, duration: mapper(Number(s.duration)) })) as T[];
}

function isDurationConstraintError(error: any): boolean {
  const code = error?.code || error?.details?.code;
  const msg = String(error?.message || "").toLowerCase();
  return code === "23514" || msg.includes("duration") || msg.includes("check constraint");
}

/**
 * Tries to insert availability slots and automatically retries with the alternate
 * duration family (30/60 <-> 25/55) if a duration check constraint is hit.
 */
export async function insertAvailabilitySlotsWithFallback(
  client: SupabaseClient,
  slots: AvailabilitySlotInsert[]
) {
  // First try as-is
  let { error } = await client.from("teacher_availability").insert(slots);
  if (!error) return;

  // If duration constraint triggers, try 30/60 mapping first, then 25/55
  if (isDurationConstraintError(error)) {
    // Attempt 30/60
    const slots3060 = mapDurations(slots, to30or60);
    const attempt3060 = await client.from("teacher_availability").insert(slots3060);
    if (!attempt3060.error) return;

    // Attempt 25/55
    const slots2555 = mapDurations(slots, to25or55);
    const attempt2555 = await client.from("teacher_availability").insert(slots2555);
    if (!attempt2555.error) return;

    // If still failing, throw the last error
    throw attempt2555.error;
  }

  // Non-duration error
  throw error;
}
