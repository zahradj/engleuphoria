

## Plan: Home Mission Content Library with Dynamic Email Injection

This plan adds a `unit_missions` table to store per-unit Home Mission content, then wires it into the mastery report email so each parent receives a personalized, unit-specific activity.

---

### Step 1 — Create `unit_missions` Table

**Migration**: New table linking mission content to curriculum units.

```text
unit_missions (
  id UUID PK DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES curriculum_units(id) NOT NULL UNIQUE,
  mission_text TEXT NOT NULL,
  mission_tip TEXT,
  goal_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

RLS: Readable by all authenticated users. Insert/update restricted to admin/teacher roles.

### Step 2 — Seed Initial Mission Data

**Insert** the three Home Missions for Units 1–3 (Animals, Family, Toys/Objects) by looking up the matching `unit_id` from `curriculum_units`.

### Step 3 — Fetch Mission in `sendMasteryReport.ts`

**Modify**: `src/utils/sendMasteryReport.ts`

After fetching unit info, query `unit_missions` by `unit_id`. Pass the `mission_text` (combined with `mission_tip`) as the `homeActivity` field in `templateData`. This replaces the current empty string, making the Home Mission section in the email populate automatically.

```text
// New fetch after unit info
const { data: mission } = await supabase
  .from('unit_missions')
  .select('mission_text, mission_tip, goal_description')
  .eq('unit_id', unitId)
  .single();

// In templateData:
homeActivity: mission
  ? `${mission.mission_text}${mission.mission_tip ? ' ' + mission.mission_tip : ''}`
  : '',
```

### Step 4 — No Template Changes Needed

The existing `unit-mastery-report.tsx` email template already has a "Home Activity Mission" section that renders when `homeActivity` is provided. No email template modifications required.

---

### Summary

| Area | Action |
|------|--------|
| Migration | Create `unit_missions` table with RLS |
| Data | Seed 3 unit missions (Animals, Family, Toys) |
| `sendMasteryReport.ts` | Fetch mission and inject into `homeActivity` |
| Email template | No changes — existing section handles it |

### Files to Modify
- `src/utils/sendMasteryReport.ts`

### Database Changes
- Create `unit_missions` table (migration)
- Insert 3 seed rows (insert tool)

