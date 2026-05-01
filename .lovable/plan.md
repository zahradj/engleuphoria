## Goal

Finish the Landing Page localization. Today only `HeroSection`, `NavHeader`, and `FinalCTASection` use `t()`. The 12 other sections (TrustBar, CourseOfferings, BentoGrid, ActivityMarquee, HowItWorks, PersonalizedPath, Gamification, Pricing, AppDownload, Testimonials, Contact, Footer) are 100% hardcoded English — which also breaks RTL since English glyphs and punctuation render LTR inside an `dir="rtl"` document.

## Scope

### 1. Hero — fix the rotating tagline
The text "Learn Through Play!" (and its 2 siblings "Level Up Your English!" and "Professional Growth Starts Here.") lives in `GROUP_THEMES[].tagline` in `HeroSection.tsx` and is rendered raw on line 167. Replace each `tagline` with a translation key (`lp.hero.taglinePlay`, `lp.hero.taglineLevelUp`, `lp.hero.taglinePro`) and resolve via `t()` at render time so it switches with language.

### 2. Components to wire to `useTranslation`
For each file below: import `useTranslation`, replace every visible English string (headings, subtitles, button labels, card titles/descriptions, badges, link labels, footer copy) with `t('lp.<section>.<key>')`. Do not touch any data fetched from the database; this is static marketing copy only.

- `CourseOfferingsSection.tsx` — section eyebrow "Programs", heading "Courses for Every Goal", subtitle "Whether you're preparing…", and all 6 course cards (General English, Business English, Exam Preparation, Kids English, Conversation Club, Grammar Mastery — title, description, tag, "enrolled", "Explore").
- `TrustBarSection.tsx` — trusted-by labels.
- `BentoGridSection.tsx` — feature bento headings + descriptions.
- `ActivityMarquee.tsx` — rolling activity strings.
- `HowItWorksSection.tsx` — 3-step process title, steps, CTA.
- `PersonalizedPathSection.tsx` — heading, subheading, bullet copy.
- `GamificationSection.tsx` — heading, badges, descriptions.
- `PricingSection.tsx` — heading, plan names where they're marketing copy (keep currency/numbers as-is), feature bullets, CTA.
- `AppDownloadSection.tsx` — heading, subtext, store badges alt text.
- `TestimonialsSection.tsx` — section title + UI chrome only (testimonial *quotes* stay in their original language as authentic content).
- `ContactSection.tsx` — heading, form labels, placeholders, submit button, success/error toasts.
- `FooterSection.tsx` — column titles, link labels, copyright, legal links.

### 3. Translation dictionaries

Create one new namespace file per locale: `src/translations/<locale>/landing.ts` exporting a single `landing` object containing the full `lp.*` tree (hero, nav, cta already exist in `dashboardUI.ts` — move them here for cleanliness and re-export, or keep `dashboardUI` and just add new section keys there; we'll add to `dashboardUI` to avoid breaking existing keys, then register `landing` namespace as additive).

Add these key groups to all 6 locales (`english`, `arabic`, `french`, `turkish`, `spanish`, `italian`):

```
lp.hero.taglinePlay | taglineLevelUp | taglinePro
lp.trustbar.*       (trusted-by, partner labels)
lp.programs.eyebrow | heading | headingAccent | subtitle | enrolled | explore
lp.programs.cards.generalEnglish.{title,description,tag}
lp.programs.cards.businessEnglish.{...}
lp.programs.cards.examPrep.{...}
lp.programs.cards.kids.{...}
lp.programs.cards.conversation.{...}
lp.programs.cards.grammar.{...}
lp.bento.*          (feature tiles)
lp.marquee.items[]  (array of activity strings)
lp.how.{eyebrow,heading,subtitle,steps[].{title,desc},cta}
lp.path.{heading,subtitle,bullets[]}
lp.game.{heading,subtitle,badges[].{title,desc}}
lp.pricing.{eyebrow,heading,subtitle,perMonth,mostPopular,cta,features[]}
lp.app.{heading,subtitle,iosAlt,androidAlt}
lp.testimonials.{eyebrow,heading,subtitle}
lp.contact.{heading,subtitle,nameLabel,emailLabel,messageLabel,submit,placeholderName,placeholderEmail,placeholderMessage,successToast,errorToast}
lp.footer.{tagline,product,company,legal,resources,copyright,links.*}
```

### 4. Arabic (RTL) quality
Provide native Arabic translations (not transliteration). Examples of the tone we'll use:
- "Courses for Every Goal" → "دورات لكل هدف"
- "Whether you're preparing for an exam…" → "سواء كنت تستعد لامتحان، أو تطوّر مسيرتك المهنية، أو تبدأ من الصفر — لدينا ما يناسبك."
- "General English" → "اللغة الإنجليزية العامة"
- "Business English" → "الإنجليزية للأعمال"
- "Exam Preparation" → "التحضير للامتحانات"
- "Most Popular" → "الأكثر شيوعاً"
- "Kids Favourite" → "المفضّل للأطفال"
- "Explore" → "اكتشف"
- "enrolled" → "مسجَّل"
- "Learn Through Play!" → "تعلَّم باللعب!"
- Punctuation: use Arabic question mark `؟` and comma `،` instead of `?` and `,`.
- No mixing of Latin and Arabic punctuation in the same string.

French / Spanish / Italian / Turkish: native equivalents with proper diacritics and natural marketing tone (not literal MT output).

### 5. Wiring & registration
- Add the new `landing` keys into each locale's existing `dashboardUI.ts` (single namespace already loaded), so no i18n config change is required.
- Verify `i18n.ts` `nsSeparator`/`keySeparator` defaults work with the `lp.*.*.*` dotted keys (they do).
- Spot-check `src/translations/spanish/landing.ts` already exists — fold its contents into the unified plan if non-empty.

## Technical Notes

- The L1/L2 rule still applies: only marketing copy is translated. Database-driven lesson content (`curriculum_lessons.title`, slide content, etc.) remains English — out of scope here.
- Course cards use the `courses` array at module scope. Convert it to a function `getCourses(t)` called inside the component so titles/descriptions/tags resolve per active language.
- Same pattern for `GROUP_THEMES` taglines in `HeroSection`.
- Testimonial quotes themselves: keep original (authentic voice). Translate only surrounding chrome.
- After edits, RTL Arabic should look correct because all visible strings will be Arabic and no English punctuation will leak through.

## Files Edited

New / appended:
- `src/translations/{english,arabic,french,turkish,spanish,italian}/dashboardUI.ts` (append `lp.*` keys)

Refactored to use `useTranslation`:
- `src/components/landing/HeroSection.tsx` (taglines)
- `src/components/landing/CourseOfferingsSection.tsx`
- `src/components/landing/TrustBarSection.tsx`
- `src/components/landing/BentoGridSection.tsx`
- `src/components/landing/ActivityMarquee.tsx`
- `src/components/landing/HowItWorksSection.tsx`
- `src/components/landing/PersonalizedPathSection.tsx`
- `src/components/landing/GamificationSection.tsx`
- `src/components/landing/PricingSection.tsx`
- `src/components/landing/AppDownloadSection.tsx`
- `src/components/landing/TestimonialsSection.tsx`
- `src/components/landing/ContactSection.tsx`
- `src/components/landing/FooterSection.tsx`
