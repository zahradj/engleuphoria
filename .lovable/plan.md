

# Remove "AI" References Across the Landing Page

## Overview

All seven sections (IntelligenceSection, HowItWorksSection, TestimonialsSection, TrustBarSection, AmbassadorSection, ContactSection, FooterSection) are **already fully theme-aware** with dual-mood dark/light styling -- they all import `useThemeMode`, derive `isDark`, and apply conditional classes throughout. No theme changes are needed.

The actionable work is **removing every instance of "AI" from the website copy** across 5 landing component files.

---

## Changes by File

### 1. `src/components/landing/IntelligenceSection.tsx`

Three changes:
- **Line 75**: Badge text `"AI-Powered Learning"` changes to `"Smart Learning"`
- **Line 78**: Headline `"Personalized by AI."` changes to `"Personalized for You."`
- **Line 84**: Subtext `"Our AI maps your strengths..."` changes to `"Our system maps your strengths, adapts your curriculum, and delivers lessons tailored to your interests."`

### 2. `src/components/landing/BentoGridSection.tsx`

Three changes:
- **Card 2 title (~line 230)**: `"AI Skill Radar"` changes to `"Skill Radar"`
- **Card 2 hover text (~line 233)**: `"AI-Adjusted Curriculum: Your path evolves as you do."` changes to `"Adaptive Curriculum: Your path evolves as you do."`
- **Card 3 subtitle (~line 303)**: `"AI-curated challenges"` changes to `"Curated daily challenges"`

### 3. `src/components/landing/TrustBarSection.tsx`

Two changes:
- **Line 20**: Title `"Certified AI Curriculum"` changes to `"Certified Curriculum"`
- **Line 21**: Description `"CEFR-aligned, AI-powered lesson plans."` changes to `"CEFR-aligned, expertly crafted lesson plans."`

### 4. `src/components/landing/AmbassadorSection.tsx`

One change:
- **Line 45**: `"Share the future of AI learning..."` changes to `"Share the future of language learning and earn free sessions for every successful referral."`

### 5. `src/components/landing/PricingSection.tsx`

One change:
- **Line 66**: Value bullet `"AI-Powered Curriculum"` changes to `"Adaptive Curriculum"`

---

## Summary

| File | Instances | What Changes |
|------|-----------|--------------|
| IntelligenceSection.tsx | 3 | Badge, headline, subtext |
| BentoGridSection.tsx | 3 | Card title, hover text, subtitle |
| TrustBarSection.tsx | 2 | Trust card title and description |
| AmbassadorSection.tsx | 1 | Referral paragraph |
| PricingSection.tsx | 1 | Value bullet text |

**Total: 10 "AI" references removed**, replaced with human-centric or neutral alternatives.

No theme-related changes are needed -- all seven sections already have full dual-mood support.

