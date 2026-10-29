# 3CTRL website: Figma to Astro

Figma file: `utWlvskPizskWmvz67CWut` (3CTRL-Dev), page "Page 1", section "Design".

## Status

| Page (Figma frame) | Node | State |
| --- | --- | --- |
| Landing Page | `6:5` | Built: `/` (all 12 sections, animated) |
| Services | `6:3095` | Not started |
| Growth Lab | `6:845` | Not started |
| Our Workflow | `6:1386` | Not started |
| Why US | `6:1819` | Not started |
| About Us | `6:2249` | Not started |
| Success Stories | `6:2614` | Not started |
| `v2` (1440x1049), `Popup` (1240x745), `Section` (1440x618) | `6:1294`, `6:3683`, `6:1222` | Not inspected |

The Figma file only has **desktop (1440px)** frames. No tablet or mobile designs exist.

## Stack

Astro 7 (static), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis smooth scroll, Poppins via `@fontsource`.

## How the layout scales

The design is authored at 1440px. All sizes are in `rem`, and `html { font-size: min(100vw / 90, 16px) }` makes the
whole page scale proportionally below 1440px. At 1440px and above, 1rem = 16px and content stays centered.

Figma output comes in px. After writing or editing a component with px values in Tailwind arbitrary classes
(`w-[1330px]`), run:

```
node scripts/px-to-rem.mjs src
```

It only converts values inside `[...]` and is safe to re-run.

## Structure

```
src/
  layouts/Layout.astro        base HTML, fonts, smooth scroll
  pages/index.astro           homepage
  components/sections/        Hero, Marquee, ContentEngine, TranslationGap, Services, GrowthLab,
                              GlobalReach, ClientQuote, Testimonials, Faq, ContactCta, Footer, Header
  components/ui/              Button, Tag, Logo, Glow, GlobePin
  scripts/animations/
    core.ts                   gsap, ScrollTrigger, Lenis, anchor smooth-scroll
    home.ts                   all homepage animations
  styles/global.css           Tailwind, Poppins, design tokens
  assets/images/<section>/    images downloaded from Figma (never hotlinked)
```

## Animation conventions

- Hero intro elements start hidden only when JS runs (`.js` class set in `<head>`), so the page works without JS.
- Scroll reveals use `gsap.fromTo` with `once: true`.
- `data-depth="0.2"` on any element adds parallax (uses the CSS `translate` property so it never conflicts with
  GSAP's `transform`). Negative values drift the other way.
- Everything is skipped for `prefers-reduced-motion`.

## Known gaps and things to confirm

- **Mobile and tablet:** below 1440px the page just scales down. Needs a real responsive layout (design or my call).
- **Contact form:** UI and validation work, but there is no backend. See the TODO in `ContactCta.astro`.
- **FAQ answers 02-05:** placeholders (the design only shows answer 01).
- **Nav links:** point to routes that don't exist yet (`/services`, `/growth-lab`, `/our-workflow`, `/why-us`, `/about`).
- **Demo reel / video testimonials:** play buttons are visual only (no video files in the design).
- **Footer links:** Instagram URL, email and WhatsApp link are inferred from the text in the design.
- **Hero text:** "Watch Demo Reel" links to `#reel`, which doesn't exist yet.
