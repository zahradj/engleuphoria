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

function isUniqueViolation(error: any): boolean {
  const code = error?.code || error?.details?.code;
  const msg = String(error?.message || "").toLowerCase();
  return code === "23505" || msg.includes("duplicate key") || msg.includes("unique constraint");
}

/**
 * Insert helper that:
 *  - Skips slots that already exist (unique idx on teacher_id + start_time WHERE is_booked=false)
 *  - Falls back across duration families (30/60 ↔ 25/55) when a CHECK constraint trips
 *
 * Uses upsert with `ignoreDuplicates: true` so re-saving a partially-existing schedule
 * never throws a "duplicate key value violates unique constraint" error.
 */
export async function insertAvailabilitySlotsWithFallback(
  client: SupabaseClient,
  slots: AvailabilitySlotInsert[]
) {
  if (!slots || slots.length === 0) return;

  const tryUpsert = async (rows: AvailabilitySlotInsert[]) =>
    client
      .from("teacher_availability")
      .upsert(rows, {
        onConflict: "teacher_id,start_time",
        ignoreDuplicates: true,
      });

  // First try as-is
  let { error } = await tryUpsert(slots);
  if (!error) return;

  // Duplicate slot — already inserted; treat as success.
  if (isUniqueViolation(error)) return;

  // Duration check constraint → try alternate duration families
  if (isDurationConstraintError(error)) {
    const slots3060 = mapDurations(slots, to30or60);
    const attempt3060 = await tryUpsert(slots3060);
    if (!attempt3060.error || isUniqueViolation(attempt3060.error)) return;

    const slots2555 = mapDurations(slots, to25or55);
    const attempt2555 = await tryUpsert(slots2555);
    if (!attempt2555.error || isUniqueViolation(attempt2555.error)) return;

    throw attempt2555.error;
  }

  throw error;
}
