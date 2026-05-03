# Hub-Specific AI Personas + Blueprints for Lesson Generation

The frontend already passes `target_hub` ("Playground" | "Academy" | "Success") to both `generate-blueprint` and `generate-ppp-slides`, and we already have `_shared/hubProfiles.ts` with per-hub pedagogy/safety rules. What's missing is an explicit **persona switch** + a **hub-specific slide blueprint template** baked into the LLM system prompt. We'll add those without changing the output JSON schema, so `<SlideRenderer />` keeps parsing the same `Slide[]` shape.

## Changes

### 1. `supabase/functions/_shared/hubProfiles.ts`
Extend `HubProfile` with two new fields and populate them for all three hubs:

- `personaPrompt: string` — identity, audience, tone, vocabulary register.
- `blueprintTemplate: string` — compact recommended slide flow for that hub.

Add helpers:
- `buildHubPersonaBlock(hub)` — returns `=== AI PERSONA ===\n{persona}\n\n=== RECOMMENDED BLUEPRINT ===\n{template}`.
- Update `buildSlideHubBlock` and `buildBlueprintHubBlock` to prepend the persona block.

Persona content (per spec):

- **Success (Professional)**: "You are a high-level Corporate Communications Coach. Audience: business professionals. Tone: authoritative, polished, peer-to-peer. Vocabulary: advanced business idioms, negotiation, management, hedging." Blueprint hint: Title → Executive Summary → Grammar Table → Business Case Study (split layout) → Roleplay Prompt → Production task.
- **Academy (Teens/Adults)**: "You are an engaging ESL teacher. Tone: encouraging, relatable, smart-but-not-childish." Blueprint hint: Title → Vocab 3D Flip Grid → Storybook Scene → Matching Game → Fill-in-the-Blank → Speaking discussion.
- **Playground (Kids)**: "You are a warm, playful kids' English coach. Tone: gentle, exclamatory, mascot-led." Blueprint hint: Title → Mascot intro → Flashcard vocab → Drag-and-Match with images → Sing/Say/Show mission.

Note: The 6-phase 20–25-slide structure in `generate-ppp-slides` is non-negotiable, so the hub blueprint is presented as a **slide-type emphasis guide** ("favor these slide_type values within the 6 phases for THIS hub"), not as a replacement for the 6 phases. This keeps the schema and renderer happy.

### 2. `supabase/functions/generate-ppp-slides/index.ts`
- Replace the existing `buildSlideHubBlock(resolvedHub, cefr_level)` call so the returned string now also includes the persona + blueprint template (handled inside the helper — no caller change required beyond importing the new helper if we split it). Single-line edit at the existing `hubBlock = buildSlideHubBlock(...)` site.
- No schema changes. JSON-mode contract, slide_type vocabulary, and validator stay as-is.

### 3. `supabase/functions/generate-blueprint/index.ts`
- Same: `buildBlueprintHubBlock` will now include the persona, so the blueprint planner reasons in-character from step one. No caller changes.

### 4. Frontend
- No changes required. `EmptyState.tsx` already sends `hub` and `target_hub` to both edge functions (verified at lines 159/160 and 201/202).

## Schema Integrity

- Output of `generate-ppp-slides` remains the same `Slide[]` with the existing `slide_type`, `interactive_data`, `lesson_phase`, etc. — so `SlideRenderer` / `DynamicSlideRenderer` parses everything identically.
- Persona/blueprint changes only influence **content style and slide-type emphasis**, never field names or structure.
- Existing server-side validator that drops malformed slides is untouched.

## Verification

After deploy:
1. Generate a Success-hub lesson → expect business case studies, hedging language, role_play / real_world_task as final boss.
2. Generate an Academy-hub lesson → expect mix of flip-card vocab, storybook reading, match_halves, fill_in_blanks.
3. Generate a Playground-hub lesson → expect mascot_speech-led intros, drag_and_match with thumbnails, sing/say/show final mission.
4. In all three cases the renderer must mount without errors (same JSON shape).

Files touched:
- `supabase/functions/_shared/hubProfiles.ts` (add persona + blueprint fields + helper)
- `supabase/functions/generate-ppp-slides/index.ts` (use updated hub block)
- `supabase/functions/generate-blueprint/index.ts` (use updated hub block)
