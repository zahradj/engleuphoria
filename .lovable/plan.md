

## Homepage Visual Upgrade Plan

### Current State
The homepage already has **all 12+ sections** requested (Hero, Features/BentoGrid, How It Works, Personalized Path, Gamification, Pricing, Testimonials, Trust, Ambassador, Final CTA, Contact, Footer) with glassmorphism, framer-motion animations, dual-theme support, and responsive layouts.

### What's Actually New in This Request
The primary gap is the **Hero section background** — currently it uses abstract gradient meshes and a dot grid. The user wants a **dynamic, high-quality background image** with parallax effects showing engaged learners or illustrated learning scenarios.

### Plan

#### 1. Hero Background Image with Parallax (HeroSection.tsx)
- Generate a high-quality illustrated hero background using the AI image generation API — depicting an engaged, diverse group of students in a modern digital learning environment with flowing abstract shapes in brand colors (indigo/violet/emerald/amber)
- Add parallax scrolling effect using `useScroll` + `useTransform` so the background image moves at a slower rate than content (0.5x speed)
- Layer the image behind existing gradient mesh and dot grid with a semi-transparent overlay
- Dark mode: dark overlay (85% opacity) with gradient blend
- Light mode: light frosted overlay (70% opacity) preserving warmth
- Image uses `object-cover` for responsive fill, lazy-loaded

#### 2. Enhanced Gradient Overlays (HeroSection.tsx)
- Add a stronger gradient overlay on top of the hero image: `bg-gradient-to-b from-transparent via-[bg-color]/60 to-[bg-color]` to blend into the next section
- Add subtle animated floating shapes (3-4 translucent circles/blobs) with slow drift animations layered between the image and content for depth

#### 3. Course Offerings Quick-View Section (New: `CourseOfferingsSection.tsx`)
- A dedicated "Our Courses" section with card-based layout showcasing 6 course categories (General English, Business English, Exam Prep, Kids English, Conversation Club, Grammar Mastery)
- Each card: glassmorphic style, gradient icon badge, course title, brief description, level tag (A1-C2), and "Learn More" CTA
- 3-column grid (desktop), 2-col (tablet), 1-col (mobile)
- Staggered entrance animations
- Place between `BentoGridSection` and `ActivityMarquee`

### Files Changed

| File | Action |
|---|---|
| `src/components/landing/HeroSection.tsx` | Add background image with parallax, enhanced gradient overlays, floating shapes |
| `src/components/landing/CourseOfferingsSection.tsx` | New — 6-card course showcase with glassmorphic cards |
| `src/components/landing/index.ts` | Export new section |
| `src/pages/LandingPage.tsx` | Insert CourseOfferingsSection after BentoGrid |

### Technical Notes
- Hero image generated via AI image API and stored as a project asset
- Parallax uses `useScroll({ target: sectionRef })` with `useTransform(scrollYProgress, [0, 1], ['0%', '30%'])` on the image container
- All new elements maintain the existing dual-theme (Spatial/Pearl) pattern
- Brand copy rules respected: "Smart"/"Adaptive" terminology, no "AI" in public copy

