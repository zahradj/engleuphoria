

## Plan: AI Tutor Streaming + Markdown & Teacher Analytics Improvements

### Part A: Streaming + Markdown for AI Tutor

**Current state**: The `ai-tutor` edge function returns a complete JSON response (non-streaming). The `useAITutor` hook uses `supabase.functions.invoke()` and waits for the full response. Messages render as plain text.

**Changes**:

1. **Update `supabase/functions/ai-tutor/index.ts`**
   - Add a `stream: true` query param / body flag
   - When streaming: pass `stream: true` to the AI gateway, return the SSE stream directly (save messages after stream completes using a tee'd reader)
   - Keep non-streaming path for backward compatibility

2. **Update `src/hooks/useAITutor.ts`**
   - Add a `sendMessageStreaming()` method that uses `fetch()` directly (not `supabase.functions.invoke`) to consume the SSE stream
   - Parse SSE line-by-line, accumulate tokens into a "streaming message" state
   - Optimistically add user message to `messages` array immediately
   - Build assistant message progressively via `onDelta` pattern
   - After stream completes, reload messages from DB to get persisted versions

3. **Update `src/components/ai/AITutorInterface.tsx`**
   - Install and use `react-markdown` for rendering message content (already in deps via other components)
   - Replace plain `{msg.content}` with `<ReactMarkdown>{msg.content}</ReactMarkdown>` wrapped in `prose prose-sm`
   - Show streaming indicator (typing dots) that transitions to real content as tokens arrive
   - Auto-scroll to bottom on new tokens

### Part B: Teacher Analytics — Fix Per-Student Stats

**Current state**: `useTeacherAnalytics` fetches real data for class-level metrics but per-student `lessons_completed`, `homework_completion_rate`, `last_active`, and `total_sessions` are hardcoded to 0/null (line 127-137).

**Changes**:

4. **Update `src/hooks/useTeacherAnalytics.ts`**
   - Fetch `interactive_lesson_progress` grouped by student to get per-student `lessons_completed`
   - Fetch `homework_submissions` grouped by student to calculate per-student `homework_completion_rate` and `avg_score`
   - Fetch `class_bookings` grouped by student to get `total_sessions`
   - Query each student's most recent activity timestamp for `last_active`
   - Map all this data into the `StudentStat[]` array properly

5. **Update `src/components/teacher/analytics/ClassOverview.tsx`**
   - Add `homework_completion_rate` display to each student card
   - Show `last_active` as relative time ("2 days ago")
   - Add color coding for low/medium/high performance

6. **Update `src/components/teacher/ReportsTab.tsx`**
   - Make the level filter functional (filter `studentStats` by CEFR level)
   - Wire "Export All" button to download CSV of student data

### Files Summary

| File | Action |
|---|---|
| `supabase/functions/ai-tutor/index.ts` | Add streaming mode |
| `src/hooks/useAITutor.ts` | Add `sendMessageStreaming` with SSE parsing |
| `src/components/ai/AITutorInterface.tsx` | Markdown rendering + streaming UX |
| `src/hooks/useTeacherAnalytics.ts` | Fix per-student stat aggregation |
| `src/components/teacher/analytics/ClassOverview.tsx` | Show completion rate + last active |
| `src/components/teacher/ReportsTab.tsx` | Functional level filter + CSV export |

