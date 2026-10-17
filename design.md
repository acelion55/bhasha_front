# BhashaSchool Design System & UI Guidelines

## 1. Overview & Visual Atmosphere

BhashaSchool is a premium, modern language learning platform. The user interface is designed for high legibility, clean visual hierarchy, and seamless responsiveness across desktop, tablet, and mobile devices.

### Core Principles
- **High Legibility & Prominent Typography:** Text must be comfortably large, crisp, and easily readable on both mobile touchscreens and desktop monitors. Avoid tiny micro-text (`text-xs`/12px) for critical information.
- **Natural Content Flow (No Rigid Viewport Voids):** Components, cards, and containers must wrap and flow naturally (`h-auto`, flex/grid) without artificial `vh` constraints (e.g. `min-h-[48vh]`) that create large empty whitespace on mobile screens.
- **Responsive Standard Spacing:** Use standard responsive padding (`p-4 sm:p-6 lg:p-8`) and standard container max-widths (`max-w-7xl` or `w-full`) to prevent horizontal clipping and asymmetric side gaps.
- **Brand Identity:** Emerald theme (`#059669` / `emerald-600`) complemented by deep dark forest navigation surfaces (`#0c1913`), subtle emerald-tinted badges, and clean off-white card backgrounds (`#f8faf9` canvas, pure `#ffffff` cards).

---

## 2. Color Palette & Roles

### Primary Palette
- **Primary Emerald (`#059669` / `emerald-600`):** Main interactive CTAs, active tab backgrounds, primary icons, and focused states.
- **Dark Emerald (`#047857` / `emerald-700`):** Hover states for buttons and prominent accents.
- **Deep Forest (`#0c1913`):** Primary background for desktop sidebar and mobile top/bottom navigation bars.
- **Subtle Forest Border (`#152a20`):** Borders on dark navigation surfaces.
- **Mint Tint (`emerald-50` / `emerald-100`):** Backgrounds for badges, level indicators, and soft status containers.

### Canvas & Surfaces
- **Page Canvas (`#f8faf9`):** Soft, clean neutral canvas for dashboard layouts.
- **Card Background (`#ffffff`):** Pure white surface for content cards, form modals, and elevated panels.
- **Card Border (`emerald-100/90` or `gray-200`):** Subtle borders providing crisp separation without heavy shadows.

### Typography Colors
- **Headings & Titles:** `gray-900` (`#111827`) with `font-black` (800/900 weight).
- **Body & Descriptions:** `gray-700` (`#374151`) with `font-medium` for high contrast and readability.
- **Metadata & Subtext:** `gray-600` (`#4b5563`) or `emerald-800` for branded information.

---

## 3. Typography Standards

| Component / Role | Mobile Size | Desktop Size | Font Weight | Line Height |
|------------------|-------------|--------------|-------------|-------------|
| **Page / Section Title** | `text-2xl` (24px) | `text-3xl` (30px) | `font-black` (900) | `leading-tight` |
| **Class Card Title** | `text-xl` (20px) | `text-2xl` (24px) | `font-black` (900) | `leading-snug` |
| **Card Description** | `text-base` (16px) | `text-base` (16px) | `font-medium` (500) | `leading-relaxed` |
| **Timing & Mentor Info** | `text-base` (16px) | `text-base` (16px) | `font-bold` (700/800) | Normal |
| **Level Badge (A1-C2)** | `text-sm` (14px) | `text-sm` (14px) | `font-black` (900) | Normal |
| **Seats Counter** | `text-sm` (14px) | `text-base` (16px) | `font-bold` (700) | Normal |
| **Primary Action Button** | `text-base` (16px) | `text-lg` (18px) | `font-black` (900) | Normal |
| **Category Filter Pills** | `text-base` (16px) | `text-base` (16px) | `font-black` (900) | Normal |

> [!IMPORTANT]
> Never use `text-xs` (12px) for primary card text, titles, timings, or mentor names. Keep text at `text-base` (16px) or higher for high readability.

---

## 4. Component Rules

### Class / Batch Cards
- **Container:** `bg-white border border-emerald-100 rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`
- **Height:** Natural height (`h-auto` or `min-h-0` on mobile). Do **NOT** use `min-h-[48vh]` as this creates excessive blank white space.
- **Info Box (Timing & Mentor):** `bg-gray-50/90 border border-gray-100 p-4 rounded-2xl space-y-2.5`
- **CTAs & Enroll Buttons:** Full-width rounded-2xl buttons (`py-3.5 sm:py-4 px-6 text-base sm:text-lg font-black`) with subtle shadow (`shadow-md shadow-emerald-600/20`).

### Category Filter Tabs (A1, A2, B1, B2, C1, C2)
- Must be displayed at the top of batch/class listings.
- Active pill: `bg-emerald-600 text-white font-black shadow-xs`.
- Inactive pill: `bg-gray-50 text-gray-700 hover:bg-emerald-50 border border-gray-200 font-black`.
- Touch target: minimum `py-2.5 px-4 sm:px-5`.

### Navigation Architecture
- **Desktop (md+):** Fixed dark sidebar (`w-64 lg:w-72 bg-[#0c1913] text-gray-200`) with company logo, clean nav links, and Sign Out at bottom.
- **Mobile (<md):**
  - **Top Header:** Clean dark header (`bg-[#0c1913]`) with logo, student CEFR level pill, and Exit button.
  - **Bottom Navbar:** Fixed bottom bar (`bg-[#0c1913]`) with touch-friendly icons and short labels.
  - **Main Content Padding:** Add bottom padding (`pb-28` to `pb-32`) to prevent fixed bottom nav from covering page content.

---

## 5. Layout & Responsive Principles

### Container Standards
- Main page wrapper: `w-full max-w-7xl mx-auto space-y-6 font-[Plus_Jakarta_Sans]`
- Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6`

### Do's & Don'ts
- **DO** use natural content flow (`h-auto`, flex-col) so cards adapt to their content without empty gaps.
- **DO** use prominent, high-legibility typography (`text-base`, `text-xl`, `text-2xl`).
- **DO** maintain equal horizontal margins on mobile screens (`p-4 sm:p-6`).
- **DON'T** use rigid `vh` heights (like `min-h-[48vh]`) inside content cards.
- **DON'T** use `w-[..vw]` wrappers inside already-padded layout parents as this causes uneven side gaps.
- **DON'T** shrink text to unreadable sizes (`text-xs`).