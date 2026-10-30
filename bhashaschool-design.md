# BhashaSchool Website Design Specification
> Design reference: uploaded Reasonal website screenshot. Recreate the same overall visual language, section order, proportions, and responsive behavior for BhashaSchool. Use original BhashaSchool copy and assets; do not copy Reasonal's brand, text, product imagery, or claims.

## 1. Design direction
- **Style:** editorial, friendly, modern educational landing page; playful but polished.
- **Layout:** long single-page landing page with compact header, stacked rounded sections, alternating pastel panels, small typography, generous section spacing, and occasional image-led banners.
- **Overall impression:** colorful, calm, approachable, content-rich, mobile-first.
- **Avoid:** dark futuristic gradients, heavy glassmorphism, oversized 3D effects, cluttered navigation, excessive shadows, giant desktop-only layouts.
- **Primary reference trait:** sections are nearly full-width with small outer gutters, rounded corners, and a consistent vertical rhythm.

## 2. Canvas and responsive layout
- Desktop content max-width: 1440px.
- Main page background: warm off-white `#F7F6F2`.
- Outer gutters: 16–24px desktop, 8–12px mobile.
- Section gap: 12–16px.
- Section corner radius: 16–22px.
- Header height: 64–76px desktop, 54–62px mobile.
- Mobile-first: stack all columns; no horizontal overflow.
- Typography scales fluidly with `clamp()`; preserve readable sizes on narrow screens.
- Buttons and interactive targets should be at least 44px tall.

## 3. Color palette
Use these colors consistently, inspired by the reference's pastel section blocks:
- Warm off-white page: `#F7F6F2`
- Ink / body text: `#20252A`
- Muted text: `#626B73`
- Brand navy: `#173B63`
- Brand gold accent: `#E4A642`
- Sky blue panel: `#BDEBFA`
- Soft peach panel: `#F9D9CD`
- Lavender panel: `#DCD5F5`
- Pale blue-gray panel: `#DCE7F0`
- Soft sage panel: `#D8E6DB`
- Blush panel: `#F4DEDF`
- Pale aqua panel: `#D9EEEE`
- White cards: `#FFFFFF`
- Borders: `rgba(32,37,42,.12)`

## 4. Header
- White/off-white compact header with a subtle bottom border.
- Left: BhashaSchool logo/wordmark.
- Center: `Courses`, `Classes`, `Speaking Club`, `Blog`, `About Us`.
- Right: `Log In` text link and solid navy or green `Start Learning` button.
- On mobile, collapse nav links into a menu icon; keep logo and one primary CTA visible.
- Keep header visually light; no oversized hero navigation.

## 5. Hero section — sky-blue cloud panel
- Full-width rounded panel, height around 330–420px desktop; 260–340px mobile.
- Background: sky blue gradient (`#BDEBFA` to `#8EDAF4`) with a subtle cloud texture or very soft abstract shapes.
- Small eyebrow: `GERMAN · ENGLISH · SPANISH`.
- Main headline: **“Learn a language. Open a world.”**
- Supporting copy: `CEFR-based online classes, live lessons and a community to practise speaking with confidence.`
- Primary CTA: `Explore Courses`
- Secondary CTA: `How BhashaSchool Works`
- Add a few small floating speech bubbles in English, German, Spanish, and Hindi, for example `Hello!`, `Hallo!`, `¡Hola!`, `नमस्ते!`. Keep these secondary to the headline.
- Headline uses dark navy/blue text, not a heavy neon gradient.
- Decorative cloud/word elements must not reduce contrast or legibility.

## 6. Section 2 — peach “why language learning” story
- Full-width rounded peach panel `#F9D9CD`.
- Small eyebrow: `LEARN. PRACTISE. CONNECT.`
- Heading: **“Language learning is better together.”**
- Explain that learners study structured CEFR levels and connect with approved peers to practise beyond class.
- Layout: editorial text on the left/center; a few small grayscale or duotone learning photos/icons around the edges.
- Avoid making the panel visually noisy; use 2–3 decorative visuals at most.
- Add one small supporting line: `From your first words to confident conversations.`

## 7. Two-column feature cards
Use two cards side by side on desktop and stacked on mobile. Cards should have distinct pastel backgrounds and rounded corners.

### Card A — learning pathway
- Background: pale blue-gray `#DCE7F0`.
- Title: **“A clear path from A1 to B2”**
- Body: `Follow a structured learning journey with classes mapped to CEFR levels.`
- Show compact chips: `Baustein`, `A1`, `A2`, `B1`, `B2`.
- Use a simple stepper / progress ladder, not a complex dashboard.

### Card B — speaking community
- Background: lavender `#DCD5F5`.
- Title: **“Practice with people, not just pages”**
- Body: `Connect with approved learners at linked levels and build speaking confidence together.`
- Add small pill labels: `Peer Chat`, `Speaking Practice`, `Connected Levels`.
- Mention privacy: `Your contact details stay private.`

## 8. Two-column content cards — lessons and real-life practice
### Card A — structured online classes
- Background: pale aqua `#D9EEEE`.
- Title: **“Live classes with a clear purpose”**
- Body: `See your batch start date, class link, attendance and learning resources in one place.`
- Visual: a clean mini class schedule or lesson card; never show fake personal data.

### Card B — real-world speaking practice
- Background: soft sage `#D8E6DB`.
- Title: **“Use your language in everyday life”**
- Body: `Practise through guided topics, role-play, short discussions and conversation prompts.`
- Visual: simple chat bubbles with sample phrases in German, English and Spanish.

## 9. Human-centered brand statement
- Blush panel `#F4DEDF`.
- Small eyebrow: `MADE FOR REAL PROGRESS`.
- Heading: **“A learning community built around people.”**
- Copy: `Language is more than grammar. It is the confidence to ask, listen, share ideas and understand one another.`
- Add a subtle line-art illustration: speech bubbles, book, or connected learner icons.
- Keep the section open and editorial, with large whitespace.

## 10. “Everything you need” feature directory
- Warm neutral panel `#EAE5DD`.
- Centered eyebrow: `YOUR LEARNING SPACE`.
- Heading: **“Everything you need to keep moving.”**
- Show small rounded tiles for:
  - CEFR learning paths
  - Live classes
  - Attendance
  - Learning library
  - Speaking club
  - Connected learners
  - Level guidance
  - Class schedule
  - Privacy controls
  - Progress tracking
- Tiles use white or very pale pastel backgrounds, simple line icons and concise labels.
- Desktop: multi-column grid; mobile: 2-column grid.

## 11. App / portal promotion banner
- Full-width rounded banner with warm peach-to-gold background.
- Heading: **“Your language classroom, all in one place.”**
- Body: `Check your class details, revisit learning resources and stay connected with your learning community.`
- Visual: tasteful phone mockup showing a generic BhashaSchool learner dashboard with fictional/non-personal UI.
- CTA: `Explore the Learner Portal`
- Do not imply an app exists unless one has actually been launched. If the product is web-only, call it the learner portal.

## 12. Confidence / safety section
- Pale cream background `#F6E8CF`.
- Eyebrow: `LEARN WITH CONFIDENCE`.
- Heading: **“A comfortable space to practise.”**
- Copy: `Use approved learner connections and portal-based messaging without publishing your personal phone number or email address.`
- Supporting points:
  - Controlled learner connections
  - Clear community guidelines
  - Private account details
- Do not promise absolute security; describe specific privacy controls only when implemented.

## 13. Learner testimonials
- Pale sage background `#E6EFD9`.
- Eyebrow: `THE LEARNER COMMUNITY`.
- Heading: **“Small steps. Real progress.”**
- Show 3–4 testimonial cards only when genuine feedback is available and permission has been obtained.
- If testimonials are not yet available, replace them with a “What learners can expect” section rather than inventing reviews, names, ratings, or results.

## 14. FAQ
- Pale aqua background `#D9EEEE`.
- Centered heading: **“Frequently asked questions”**
- Use an accessible accordion with concise answers:
  1. What is BhashaSchool?
  2. Which languages can I learn?
  3. What are CEFR levels?
  4. What is Baustein?
  5. How is my classroom assigned?
  6. How do live classes work?
  7. Can I practise with other learners?
  8. Are my phone number and email visible?
  9. What does the learning library include?
  10. How do I join a speaking session?
- Accordion rows should be white, rounded, and separated by 8–10px.
- Use keyboard-accessible buttons, `aria-expanded`, and clear focus states.

## 15. Footer
- Dark charcoal footer `#1E2529`, rounded top corners.
- Left: BhashaSchool logo and one-line summary.
- Link columns:
  - Company: About Us, Courses, Blog
  - Learning: German, English, Spanish, CEFR Guide
  - Support: FAQs, Contact, Privacy Policy, Terms
- Bottom row: copyright and social links, only where real accounts exist.
- On mobile, stack columns vertically.

## 16. Interaction and motion
- Use restrained, accessible motion:
  - Gentle fade/slide reveal as sections enter viewport.
  - Small hover lift on cards (2–4px).
  - CTA hover transitions around 180–240ms.
  - Speech bubbles can float subtly, but no constant distracting movement.
- Respect `prefers-reduced-motion`.
- Do not animate every element simultaneously.
- No forced scrolling or cursor-following effects.

## 17. SEO and semantic structure
- One clear H1 in the hero.
- Use H2 for major sections and H3 for cards.
- Use descriptive internal links to German, English, Spanish and CEFR pages.
- Keep the content original and useful; do not keyword-stuff.
- Add unique page title and meta description.
- Add `Organization`, `WebSite`, and `BreadcrumbList` structured data where appropriate.
- Use optimized images with meaningful alt text.
- Keep private learner dashboards, class links, attendance and chats behind authentication; prevent indexing of private pages.

## 18. Accessibility and quality checks
- Maintain WCAG-friendly contrast for text on pastel panels.
- Provide visible keyboard focus.
- Use semantic buttons and links, descriptive labels and accessible accordions.
- Use meaningful alt text for informative images and empty alt text for purely decorative shapes.
- Check mobile widths at 320px, 375px, 768px and 1440px.
- Prevent horizontal overflow and ensure all CTAs are tappable.
- Avoid false claims such as guaranteed fluency, exam pass rates, or “certified” status unless verifiable.

## 19. Build acceptance checklist
- [ ] Overall page rhythm and stacked pastel panels resemble the reference.
- [ ] Compact header and rounded full-width sections.
- [ ] Hero uses a sky-blue/cloud visual, not a dark futuristic background.
- [ ] Two-column cards stack correctly on mobile.
- [ ] Language bubbles include English, German, Spanish and Hindi greetings.
- [ ] CEFR pathway and peer speaking features are clear.
- [ ] Learner portal section uses a believable generic dashboard mockup.
- [ ] Testimonials are genuine or replaced with expectations.
- [ ] FAQ accordion is accessible.
- [ ] Footer includes all essential navigation and policy links.
- [ ] Responsive layout, contrast, motion preferences and metadata are tested.

## 20. Implementation note
Treat this file as a design and content specification. Match the reference’s visual hierarchy, section sequence, pastel palette, rounded panels, and compact editorial typography, but adapt the copy and visuals to BhashaSchool. The result should feel like the same design family rather than a pixel-for-pixel copy of another company’s branded website.
