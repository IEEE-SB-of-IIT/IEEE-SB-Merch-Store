# Design System — CodeSprint 11 Merch

## Theme

Nocturnal drop-store. Pure black void, products floating free, one saturated orange. Dark is not a style choice here; it is inherited brand identity from codesprint.lk.

## Color

| Token | Value | Use |
|---|---|---|
| `cs11-bg` | `#000000` | Page background (the void) |
| `cs11-surface` | `#0a0a0a` | Lifted panels |
| `cs11-card` | `#111111` | Rare contained surfaces |
| `cs11-border` | `rgba(255,255,255,0.08)` | Hairlines |
| `cs11-orange` | `#ff6a3d` | THE brand color. Owns whole bands (marquee, CTA); scarce elsewhere |
| `cs11-gold` | `#ffc371` | Gradient end, warm highlights |
| text primary | `#ffffff` | Headings |
| text body | `rgba(255,255,255,0.7)` | Body copy (AA on black) |
| text muted | `rgba(255,255,255,0.45)` | Captions, labels |

Strategy: **Committed**. Orange carries ~30% of the page via full-bleed bands; everything else is black/white.

## Typography

- **Display**: Manrope ExtraBold, uppercase, tight leading (0.9–0.95), letter-spacing ≥ -0.03em. Viewport-scale wordmark on the hero only (deliberate Ranboo/VAIL move, documented exception to the 6rem ceiling).
- **Voice**: EB Garamond italic, sentence case, used as inline accent lines ("Wear the battle.") and statement pulls.
- **Labels**: Rajdhani SemiBold, uppercase, tracking 0.15–0.25em, ≤4 words, 10–12px. Technical captions only; never body copy.
- Body: Manrope regular, max 65ch.

## Imagery

The six merch renders in `public/images/codesprint-merch-images/` are the only imagery. Cutout versions (background-removed, `*-cut.png`) float directly on black with soft orange under-glow; original gray-tile versions are not used on brand surfaces.

## Motion

- Lenis smooth scroll, page-wide.
- GSAP ScrollTrigger for parallax/pins; framer-motion for entrances.
- Ease: expo/quart out. Durations 0.6–1.2s for reveals, 25–40s for marquees.
- Every effect has a `prefers-reduced-motion` fallback (instant or crossfade). Content never gated on animation.

## Layout grammar

- Full-bleed sections, max-w-[1500px] inner rails, generous `clamp()` vertical rhythm.
- Asymmetry over symmetry: product overlapping wordmark, offset grids.
- No card chrome around products; hairline dividers (`cs11-border`) instead of boxes.
- Marquee bands as section dividers (orange solid, or outline-text on black).

## Banned on this surface

Status pills/fake telemetry, icon card trios, numbered eyebrow scaffolding, gradient text on body, glassmorphism, search pills for six products.
