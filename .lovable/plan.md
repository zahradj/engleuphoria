## What changes

### 1. Sounds for every reward, star, and sticker

Today `audioService.play*` is a no-op stub, so reward toasts, the synced star tally, the teacher "Award" buttons, and badge/sticker reveals are silent. `soundEffectsService` already has fast WebAudio tones (`playStarEarned`, `playCelebration`, `playPowerUp`, `playDing`, `playPop`, `playPerfectStreak`). We just need to route the stubs through it and fire SFX at the remaining trigger points.

What we'll do:

- **Replace the stubs in `src/services/audioService.ts`** so the existing API keeps working everywhere it's already called, but actually plays sound:
  - `playRewardSound(points)` → tier-aware: small (`playDing`), medium (`playStarEarned`), large (`playPerfectStreak`), huge (`playCelebration`).
  - `playSuccessSound` → `playCorrect`, `playErrorSound` → `playIncorrect`, `playButtonClick` → `playButtonClick`, `playCelebrationSound` → `playCelebration`.
  - Honors the existing `setMuted` flag and forwards it to `soundEffectsService` so the Sound Settings toggle keeps working.
- **Star tally sync sound (top neon bar)**: it already calls `soundEffectsService.playStarEarned()` per filled segment — confirm it remains audible after unmute and add a single "burst" `playPop` when the star icon scales (the `isAnimating` prop transition).
- **Teacher "Award Star" / quick-reward buttons** (`TeacherRewardSystem`, `ModernRewardsPanel`): already call `audioService.playRewardSound` — they'll start producing sound automatically once the stub is replaced. We'll also add a short `playPop` on press to give immediate tactile feedback before the reward melody.
- **Badge / sticker reveals**: `useRewards.earnBadge` is silent today. Add `soundEffectsService.playPowerUp()` at the moment a badge is granted, and `playCelebration()` when `showLevelUp` flips true. The lesson-slide star bursts (`DailyRoutinesSlides` etc.) already animate stars but don't play sound — add `playPerfectStreak()` when the burst mounts.
- **Reward toast** (`RewardToast`): plays nothing today. Map the toast `type` → SFX (`star`→`playStarEarned`, `trophy`→`playCelebration`, `zap`→`playPowerUp`).

Optional richer audio (deferred): an ElevenLabs SFX prefetch layer can be added later for cinematic stingers, but the WebAudio path above is instant, free, and works offline — perfect for "every reward should make a sound" without latency.

### 2. Shrink the Hyperbeam stage

The cloud browser still feels too zoomed because the container fills the full available width up to `max-w-6xl` (1152px) and a 4:3 aspect ratio. We'll:

- Lower the container cap from `max-w-6xl` → `max-w-4xl` (~896px).
- Switch the aspect ratio from `4 / 3` to `16 / 10` so the frame is a touch shorter and feels more like a desktop window.
- Keep the existing `object-fit: contain` rules so nothing crops.

Net effect: the embedded webpage renders smaller inside the stage area while the surrounding glass/dock UI gets more breathing room. Resolution from the edge function (1024×768) is unchanged.

## Files touched

- `src/services/audioService.ts` — replace stubs with real WebAudio calls via `soundEffectsService`; tier-aware reward sound; mute-state passthrough.
- `src/hooks/classroom/useRewards.ts` — fire `playPowerUp` on badge earn and `playCelebration` on level-up.
- `src/components/classroom/modern/RewardToast.tsx` — fire SFX matching the toast icon type.
- `src/components/classroom/rewards/TeacherRewardSystem.tsx` — add `playPop` on click before the reward melody.
- `src/components/classroom/gamification/TopLevelBar.tsx` — keep existing per-segment `playStarEarned`; ensure burst pop on star scale.
- `src/components/classroom/stage/MultiplayerWebStage.tsx` — `max-w-4xl`, `aspectRatio: '16 / 10'`.

## Out of scope

- ElevenLabs custom SFX generation (kept for a future richer-audio pass).
- Restyling the rewards panel layout.
- Changing the synced star data model.
