

# Phase 6: "Three Worlds" Dashboard Polish + Just-in-Time Content

## Summary

This upgrade enhances the visual identity of each dashboard and adds a "Just-in-Time" Daily Quest that automatically loads based on the student's last mistake -- no manual button click required.

---

## Part 1: Playground (Kids) Enhancements

### 1A. Themed Zone Names on Path Nodes

**File: `src/components/student/kids/LevelNode.tsx`** (Modify)

- Add a `zoneName` prop (optional) that displays themed labels like "Vocab Forest", "Grammar Mountain", "Story River"
- When present, render a small badge below the title with a tree/mountain/wave emoji and the zone name
- Use the existing Fredoka font and `rounded-full` pill styling

### 1B. 3D Game-Style Buttons

**New File: `src/components/student/kids/GameButton.tsx`** (Create)

- A reusable 3D-style button component with:
  - `box-shadow` for depth: `0 6px 0 #c2410c` (for orange), shifts on press to `0 2px 0`
  - `transform: translateY(-2px)` on hover, `translateY(2px)` on active
  - `rounded-full` corners, vibrant `#FF9F1C` / `#FFBF00` gradients
  - Sparkle icon optional
- Replace the existing `GiantGoButton` internal button styling with `GameButton`
- Replace standard buttons in `PlaygroundSidebar.tsx` with `GameButton`

### 1C. Zone Map Labels

**File: `src/components/student/kids/KidsWorldMap.tsx`** (Modify)

- Add floating zone labels on the map (e.g., "The Vocab Forest" at top-left, "Grammar Mountain" center-right)
- Use `position: absolute` with `motion.div` fade-in, styled as translucent pill badges with emojis
- Zone data is a static array of `{ name, emoji, position }` rendered over the map

---

## Part 2: Academy (Teens) Enhancements

### 2A. Daily Challenge Card (Social Media Style)

**New File: `src/components/student/academy/DailyChallengeCard.tsx`** (Create)

- Styled to look like a social post:
  - Avatar + "AI Coach" username at top
  - Challenge text as the "post body"
  - Reaction bar with thumbs-up, fire, and lightning emoji buttons
  - "Accept Challenge" neon-accented button
  - Timestamp showing "Posted 2h ago"
- Challenge content is derived from the student's last mistake (fetched from `student_profiles.mistake_history`):
  - If mistakes exist: "Fix your weak spot! Use **[word]** correctly in 3 sentences"
  - If no mistakes: "Daily vocab boost: learn 5 new words about [interest]"
- Uses the `useMistakeTracker` hook's `getWeakAreas()` method

### 2B. Neon Accent Polish

**File: `src/components/student/dashboards/AcademyDashboard.tsx`** (Modify)

- Add neon glow effects to active sidebar items: `shadow-[0_0_10px_rgba(168,85,247,0.5)]`
- Add neon border to the "Continue Learning" card: `border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]`
- Integrate the new `DailyChallengeCard` above the Schedule section
- Update leaderboard rank badges (#1, #2, #3) with neon glow on the podium positions

---

## Part 3: Professional (Adults) Enhancements

### 3A. Career Milestone Prominence

**File: `src/components/student/dashboards/HubDashboard.tsx`** (Modify)

- Move `BusinessMilestonesCard` from the right sidebar to the main content area (left column), below Skills Radar
- Add a "Next Career Milestone" banner at the top of the dashboard (above stats):
  - Shows the next incomplete milestone title with a progress percentage
  - Emerald gradient accent: `bg-gradient-to-r from-emerald-600 to-teal-600`
  - Charcoal card: `bg-gray-900` with `border-emerald-500/30`
- Ensure the `Emerald & Charcoal` palette is consistently applied (currently uses blue/indigo in some places)

### 3B. Color Palette Alignment

**File: `src/components/student/dashboards/HubDashboard.tsx`** (Modify)

- Replace `from-blue-600 to-indigo-600` with `from-emerald-600 to-teal-600` for the logo icon
- Replace `bg-blue-50 text-blue-600` active nav with `bg-emerald-50 text-emerald-600`
- Replace stat card accent colors to use emerald tones consistently

---

## Part 4: Just-in-Time Daily Quest (Auto-Loading)

### What Changes

Currently the AI Lesson Agent requires a manual "Generate Today's Lesson" button click. The Just-in-Time system will:
1. Automatically trigger lesson generation when the dashboard mounts
2. Prioritize the student's last mistake as the quest topic
3. Cache the generated lesson in `localStorage` for the day (avoid re-generating on navigation)

### File: `src/components/student/AILessonAgent.tsx` (Modify)

- Add an `autoGenerate` prop (default: `true`)
- On mount, check `localStorage` for a cached lesson from today (`dailyLesson_{userId}_{date}`)
- If cached: load it directly into `generatedLesson` state (skip "thinking" animation)
- If not cached: auto-trigger `generateLesson()` on mount
- After generation, cache the result in `localStorage`
- Keep the "Regenerate" button for manual override (clears cache and re-generates)
- The existing `mistakeHistory` data (already passed to the edge function) ensures the AI factors in the student's last mistake when creating the quest

### File: `src/hooks/useDailyQuest.ts` (Create)

- A lightweight hook that:
  - Reads `mistake_history` from `student_profiles`
  - Extracts the most recent mistake's `error_type` and `word`
  - Returns `{ lastMistake, weakAreas, questContext }` for display in the Daily Challenge card
  - `questContext` is a human-readable string: "You struggled with **'accomplish'** (spelling). Let's practice!"

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/student/kids/GameButton.tsx` | Create | Reusable 3D game-style button |
| `src/components/student/kids/GiantGoButton.tsx` | Modify | Use GameButton internally |
| `src/components/student/kids/LevelNode.tsx` | Modify | Add optional zoneName prop |
| `src/components/student/kids/KidsWorldMap.tsx` | Modify | Add floating zone labels |
| `src/components/student/academy/DailyChallengeCard.tsx` | Create | Social-media-styled daily challenge card |
| `src/components/student/dashboards/AcademyDashboard.tsx` | Modify | Add DailyChallengeCard, neon accents |
| `src/components/student/dashboards/HubDashboard.tsx` | Modify | Promote milestones, fix emerald palette |
| `src/components/student/AILessonAgent.tsx` | Modify | Add autoGenerate + localStorage caching |
| `src/hooks/useDailyQuest.ts` | Create | Mistake-driven quest context hook |
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Modify | Use GameButton in sidebar area |
