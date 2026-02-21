
# Teacher Video Script Templates, Filming Checklist, and Self-Review Validation

## Overview

Add three interconnected features to the teacher video submission flow: (1) a "Teacher Success" instructions modal with script templates and filming tips shown before recording, (2) a track-based script selector (Professional vs. Kids), and (3) a self-review checklist that gates the video submission.

---

## 1. New Component: `VideoInstructionsModal`

**File to create:** `src/components/teacher/VideoInstructionsModal.tsx`

A Dialog modal containing:

### Script Templates Section
- Toggle between two script tabs: **"Professional / Executive Track"** and **"Playground / Academy Track"**
- Each tab displays the full 60-second script with timestamp markers (0:00-0:10, 0:10-0:30, etc.) styled as a step-by-step guide
- Professional script emphasizes Business English, negotiations, executive presence
- Kids script emphasizes adventure, games, energy, and fun

### Filming Checklist Section (Accordion)
Five tips displayed as an expandable checklist:
1. **Eye Contact is King** -- Look at the camera lens, not your own image
2. **Lighting (The 3-Point Rule)** -- Face the window or use a ring light; avoid backlighting
3. **The "Silent" Background** -- No fan noise, traffic, or echo
4. **Dress for the Price** -- Professional: business casual; Playground: bright colors
5. **The Engleuphoria Background** -- Clean workspace, small plant or bookshelf

Each tip will have an icon and a short explanation paragraph.

### Self-Review Checklist
Three checkboxes that must ALL be checked before the teacher can proceed:
- "I have checked my audio quality"
- "My face is clearly lit"
- "I followed the Engleuphoria script structure"

A "Got It" / "I'm Ready" button at the bottom, disabled until all 3 checkboxes are checked. Closing the modal also stores a local flag so returning users are not blocked but can reopen it via a help link.

---

## 2. Integration into `ProfileSetupTab.tsx`

**File to modify:** `src/components/teacher/ProfileSetupTab.tsx`

- Add a "View Script & Filming Guide" button (with a `Clapperboard` or `FileVideo` icon) next to the video URL input field
- Clicking it opens `VideoInstructionsModal`
- Track the `selfReviewChecked` state: once the teacher completes the self-review checklist in the modal, show 3 green checkmarks below the video URL field confirming:
  - Audio quality verified
  - Lighting verified
  - Script structure followed
- The "Save Profile" button remains gated on `bio + video_url` (existing logic), but now also shows a gentle reminder if self-review was not completed: "We recommend completing the filming checklist for the best first impression"

---

## 3. Integration into `EnhancedTeacherApplicationForm.tsx` (Step 4)

**File to modify:** `src/components/teacher/EnhancedTeacherApplicationForm.tsx`

- Replace the current simple "Video Tips" box (lines 425-433) with:
  - A prominent "View Script Templates & Filming Guide" button that opens `VideoInstructionsModal`
  - The 3 self-review checkboxes displayed inline below the video URL input
  - The "Next" button on Step 4 requires all 3 self-review checkboxes to be checked (in addition to the video URL)
- Keep the video URL and description fields as-is

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/teacher/VideoInstructionsModal.tsx` | Script templates, filming checklist, self-review gate |
| Modify | `src/components/teacher/ProfileSetupTab.tsx` | Add "View Guide" button + self-review status indicators |
| Modify | `src/components/teacher/EnhancedTeacherApplicationForm.tsx` | Replace video tips with modal trigger + inline self-review checkboxes |

---

## Technical Details

### `VideoInstructionsModal.tsx` Structure

```text
Props:
  - open: boolean
  - onOpenChange: (open: boolean) => void
  - onSelfReviewComplete: (checked: boolean) => void
  - initialTrack?: 'professional' | 'kids' (default: 'professional')

State:
  - selectedTrack: 'professional' | 'kids'
  - checklist: { audio: boolean, lighting: boolean, script: boolean }

Components used:
  - Dialog (Radix) for the modal shell
  - Tabs for Professional vs. Kids script toggle
  - Accordion for the 5 filming tips
  - Checkbox (3x) for self-review
  - Button ("I'm Ready") disabled until all 3 checked
```

### Script Content (Hardcoded Constants)

The two script templates will be stored as structured arrays within the component file:

```text
PROFESSIONAL_SCRIPT = [
  { time: "0:00-0:10", label: "The Hook", text: "Hello! Are you looking to bridge..." },
  { time: "0:10-0:30", label: "The Value", text: "I specialize in Business English..." },
  { time: "0:30-0:50", label: "The Method", text: "In our 55-minute sessions..." },
  { time: "0:50-1:00", label: "The Call to Action", text: "Check my schedule below..." }
]

KIDS_SCRIPT = [
  { time: "0:00-0:10", label: "Energy", text: "Hi there! I'm [Name]..." },
  { time: "0:10-0:30", label: "Engagement", text: "I love making English feel..." },
  { time: "0:30-0:50", label: "The Promise", text: "I use games and interactive..." },
  { time: "0:50-1:00", label: "CTA", text: "I can't wait to meet you..." }
]
```

### Filming Tips Data

```text
FILMING_TIPS = [
  { icon: Eye, title: "Eye Contact is King", description: "Look directly into the camera lens..." },
  { icon: Sun, title: "Lighting (The 3-Point Rule)", description: "Face the window or use a ring light..." },
  { icon: VolumeX, title: "The Silent Background", description: "No fan noise, traffic, or echo..." },
  { icon: Shirt, title: "Dress for the Price", description: "Professional: business casual. Playground: bright colors..." },
  { icon: Home, title: "The Engleuphoria Background", description: "Clean workspace, small plant or bookshelf..." }
]
```

### Validation Logic in Application Form (Step 4)

The existing `validateStep(4)` function will be extended to also check that all 3 self-review booleans are `true`. If not, a toast will prompt: "Please complete the self-review checklist before proceeding."
