# Handoff: Covington Cards — poker game index

## Overview

`covingtoncards.com` is a small static site that houses the house rules for the ten poker
games one Covington, Kentucky home game plays. There is no login, no accounts, no data entry
in the product — the content ships with the site. Two screens:

1. **Index** (desktop-first, reflows down) — all ten games as cards on a green felt table.
2. **Game screen** (mobile) — one game's rules, opened by tapping a card on the index.

The aesthetic is old card room: green felt, a leather rail, brass hairlines, ivory card stock,
a Didone display face for game names.

## About the design files

The files in this bundle are **design references created in HTML** — prototypes that show the
intended look and behavior. They are not production code to copy. The task is to recreate these
designs in the target codebase's own environment (React, Astro, plain HTML + CSS, whatever the
project uses) with its established patterns. Given the content is static and tiny, a static
site generator or a plain React SPA are both reasonable; if nothing exists yet, prefer the
simplest thing that renders ten pages from a data file.

`Poker Index.dc.html` is the design document. It is a review artifact containing several
options; **only these two are approved**:

| id in the file | Screen | Status |
| --- | --- | --- |
| `2a` | Index — felt grid | **Build this** |
| `3a` | Game screen — mobile | **Build this** |
| `1a`, `1b`, `1c`, `3b` | earlier explorations | Ignore |

Open the file in a browser and scroll: turn 3 is at the top, then turn 2, then turn 1. Each
option is labelled with its id.

## Fidelity

**High-fidelity.** Colors, type, spacing and copy are final-intent. Recreate pixel-accurately
where the codebase allows; substitute the codebase's own primitives (button, card) only if they
can carry these exact values.

One caveat that is *not* a fidelity question: the rule text and the numbered "deal" steps for
Krogering are **draft copy written by the designer**, not the real house rules. The client is
supplying corrected text. Build the layout; expect the strings to change.

---

## Screen 1 — Index (option `2a`)

### Purpose
Land here, scan ten games, tap one when it's your deal.

### Layout

- Outer surface: **1120px** max width, centered. `border: 14px solid #2a180f` (the leather rail),
  `border-radius: 18px`, `padding: 34px 38px 40px`.
- Background: `radial-gradient(130% 100% at 50% -10%, #1a4a33 0%, #10301f 50%, #0a1d13 100%)`.
- Header row: `display:flex; align-items:flex-end; justify-content:space-between; gap:30px; flex-wrap:wrap`.
  - Left: chip mark + wordmark, `display:flex; align-items:center; gap:16px`.
  - Right: the suit key, `display:flex; gap:20px; align-items:baseline`.
- Subhead paragraph: `margin: 14px 0 26px 50px` (the 50px left indent aligns it under the wordmark,
  past the chip).
- Card grid: `display:grid; grid-template-columns:repeat(auto-fill, minmax(240px,1fr)); gap:16px`.
  At 1120px this lands as 4 columns; it degrades to 3/2/1 on its own.

### Components

**Chip mark** — 34×34px, `border-radius:50%`,
`background: radial-gradient(#a8332f, #7d211e)`, `border: 3px dashed rgba(240,236,225,.75)`,
`box-shadow: 0 2px 6px rgba(0,0,0,.5)`. Purely decorative; a real logo can replace it.

**Kicker** — `covingtoncards.com` — Inter 500, 10px, `letter-spacing:.22em`, uppercase, `#c9a227`.

**Wordmark** — `Covington Cards` — Bodoni Moda 400, 34px, `#f0ece1`, `margin:4px 0 0`.

**Subhead** — 13px Inter 400, `rgba(240,236,225,.5)`.
Copy: "Pick one when it's your deal. Most of these were invented within a mile of the river."

**Suit key** — 11.5px Inter 400, `rgba(240,236,225,.6)`; each glyph 15px, followed by `&nbsp;` and
the label. Four entries: ♠ Stud · ♦ Community cards · ♥ Down to luck · ♣ Table game.
Glyph colors: `#f0ece1` for ♠/♣, `#e08b87` for ♥/♦ (a lightened red so it clears contrast on felt).

**Game card** (×10) —
- `background: linear-gradient(160deg, #f4f0e4, #e2dcca)`, `border-radius:10px`,
  `padding:16px 18px 18px`, `box-shadow: 0 6px 16px rgba(0,0,0,.4)`.
- Top row: `display:flex; justify-content:space-between; align-items:flex-start`.
  - Family label — Inter 500, 9px, `letter-spacing:.18em`, uppercase, `#7a6f52`.
  - Suit glyph — 16px, `#231a08` for ♠/♣, `#a8332f` for ♥/♦.
- Title — Bodoni Moda 500, 23px, `#1b1a16`, `margin:6px 0 8px`, `line-height:1.05`.
- Rule line — 12.5px/1.55 Inter, `#453f33`, `text-wrap:pretty`.
- Meta — player count, `margin-top:12px`, 11px Inter 400, `#7a6f52`.
- **Covington original variant**: add `outline: 2px solid #c9a227` and append
  `· Covington original` to the family label. Currently on Krogering only — the client will
  confirm which games qualify, so drive it off a boolean in the data, not a hardcoded slug.

### Suit encoding (do not treat as decoration)

The suit glyph *is* the family, shown twice — once as the glyph, once as the caps label — so the
grid can be scanned by shape. The mapping lives in `games.json > families`:

| Family | Glyph | Games |
| --- | --- | --- |
| Stud | ♠ | Five-Card Stud, Seven-Card Stud, Krogering, Chase the Queen |
| Community | ♦ | Criss Cross |
| Down to luck | ♥ | In Between, Night Baseball |
| Table game | ♣ | Screw Your Neighbor, Liar's Poker, Beat Charlie |

### States (to add in implementation — the mock is static)

- **Hover** on a card: lift it. `transform: translateY(-2px)`,
  `box-shadow: 0 10px 22px rgba(0,0,0,.5)`, 140ms `ease-out`. Cursor `pointer`.
- **Focus-visible**: `outline: 2px solid #c9a227; outline-offset: 3px`. Never the browser default.
- **Active/pressed**: `transform: translateY(0)`, shadow back to rest.
- Each card is one link (`<a>`) wrapping the whole card → `/games/<slug>`.

---

## Screen 2 — Game screen, mobile (option `3a`)

Mocked at **390 × 844** (iPhone 14/15 logical size). Everything below the header scrolls; the
bottom action bar is fixed to the bottom of the viewport.

### Layout, top to bottom

1. **Status bar row** — `padding:14px 20px 0`, `display:flex; justify-content:space-between`,
   Inter 500 11px `rgba(240,236,225,.5)`. Left `9:41`, right `covingtoncards.com`.
   (The clock is mock chrome — drop it, keep the domain as a small right-aligned label.)
2. **Back row** — `padding:14px 16px 16px; display:flex; align-items:center; gap:14px`.
   - Back button: **44×44px** circle, `border:1px solid rgba(201,162,39,.55)`, glyph `‹` 20px `#e8cf7a`.
     44px is the minimum hit target — do not shrink it.
   - Label `All games` — Inter 500 10px, `letter-spacing:.18em`, uppercase, `rgba(240,236,225,.5)`.
3. **Hero card** — the index card, grown. `margin:0 16px`, ivory gradient as above,
   `border-radius:12px`, `padding:18px 20px 20px`, `box-shadow:0 10px 26px rgba(0,0,0,.5)`,
   plus `outline:2px solid #c9a227` when the game is a Covington original.
   - Family label + suit glyph, same treatment as the index card (suit 18px here).
   - Title — Bodoni Moda 500, **32px**, `#1b1a16`, `margin:8px 0 2px`, `line-height:1`.
   - "also called low hold" — Inter 400 12.5px italic, `#7a6f52`. Omit the line if absent.
   - Summary — 13.5px/1.6, `#453f33`, `margin:12px 0 0`.
4. **Stat strip** — `margin:18px 16px 0`, `display:flex`, with
   `border-top` and `border-bottom: 1px solid rgba(201,162,39,.3)`.
   Three cells, `flex: 1 / 1 / 1.4`, `padding:12px 0`:
   label Inter 500 9px `letter-spacing:.16em` uppercase `rgba(240,236,225,.45)`;
   value Bodoni Moda 20px `#f0ece1` — except the Wild value, which is `#e8cf7a`.
   Cells shown: Players `2–8` · Bets `Five` · Wild `Low hole`.
5. **The deal** — `padding:20px 20px 0`.
   - Section head: Inter 500 10px, `letter-spacing:.18em`, uppercase, `#c9a227`, `margin-bottom:12px`.
   - Steps: `display:flex; flex-direction:column; gap:11px`. Each step is a
     `display:flex; gap:12px` row — numeral in Bodoni Moda 15px `#c9a227` in a fixed
     `width:14px; flex:none` column, text 13px/1.5 `rgba(240,236,225,.82)`.
6. **Faded rule** — the Nocturne signature divider, 1px tall, `margin:18px 0`:
   `linear-gradient(to right, transparent, rgba(201,162,39,.4) 20px, rgba(201,162,39,.4) calc(100% - 20px), transparent)`.
7. **House notes** — same section head style; body 13px/1.55 `rgba(240,236,225,.7)`, `text-wrap:pretty`.
8. **Action bar** — pinned bottom. `padding:14px 16px 26px` (the 26px absorbs the home indicator),
   `background: linear-gradient(#2a180f, #1d1008)`, `border-top:1px solid rgba(201,162,39,.35)`,
   `display:flex; gap:10px`.
   - **Call this game** — `flex:1`, height **48px**, `border-radius:999px`,
     `background: linear-gradient(#e8cf7a, #c9a227)`, label Inter 500 14px `#231a08`.
     Hover/pressed: `linear-gradient(#f2dd97, #d8b132)` and `transform: translateY(1px)`.
   - **Favourite** — 48×48px circle, `border:1px solid rgba(201,162,39,.6)`, ♥ 17px `#e8cf7a`.
     Toggles filled (`background: rgba(201,162,39,.16)`, glyph `#f2dd97`) when on.

### Page background
`radial-gradient(120% 80% at 50% 0%, #1a4a33, #0d2519 60%, #08160f)` on the scroll container, so
the felt stays lit from the top no matter the scroll position.

---

## Interactions & behavior

| Trigger | Behavior |
| --- | --- |
| Tap/click a game card on the index | Navigate to `/games/<slug>`. Real page, real URL — the site must be linkable and shareable. |
| Back button on the game screen | Browser back if there is history, otherwise navigate to `/`. |
| "Call this game" | **Undecided.** In the mock it is a dead button. Options discussed: mark it as tonight's game, or copy a link to the rules. Ask the client before wiring it; render it disabled-but-present if the answer isn't in yet. |
| Favourite (♥) | Local-only toggle, persisted in `localStorage` under one key (e.g. `cc.favourites` → array of slugs). No accounts. Favourited games can sort to the top of the index later — not in this scope. |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` — drop the card hover lift, keep the shadow change. |

### Responsive

- Index: the `auto-fill / minmax(240px, 1fr)` grid handles every width down to ~272px. Below
  **560px**, drop the leather border from 14px to 8px, reduce padding to `20px 16px 28px`, and let
  the suit key wrap (`flex-wrap:wrap; gap:10px 16px`).
- Game screen: the 390px mock is the narrow case. On viewports ≥ 760px, widen the content column to
  600px and center it; the action bar stops being fixed and sits inline at the end of the content.
- No fixed heights anywhere except the deliberate 48px/44px control sizes.

## State management

Almost none. The content is static.

- `favourites: string[]` — slugs, persisted in `localStorage`, read on mount.
- `games` — build-time import of `games.json`. No fetching, no loading or error states.
- If "Call this game" becomes "tonight's game", that is one more `localStorage` string.

## Design tokens

The design is built on the **Nocturne** design system's structure — its spacing scale, 8px radius
family, faded-rule divider, and its `:focus-visible` ring convention — with the palette shifted to
the client's requested card-room colors. Nocturne's own stylesheet is in this bundle as
`nocturne-styles.css` for reference; the values actually used are below. Take these verbatim.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--felt-lit` | `#1a4a33` | top of the felt gradient |
| `--felt-mid` | `#10301f` | felt midtone |
| `--felt-deep` | `#0a1d13` | felt falloff |
| `--felt-edge` | `#08160f` | deepest felt (mobile) |
| `--leather` | `#2a180f` | rail / border, action bar top |
| `--leather-deep` | `#1d1008` | action bar bottom |
| `--brass` | `#c9a227` | hairlines, kickers, section heads, primary fill |
| `--brass-light` | `#e8cf7a` | brass gradient top, accent values, icon glyphs |
| `--brass-bright` | `#f2dd97` | hover only |
| `--ink-on-brass` | `#231a08` | text on brass, dark suit glyphs |
| `--card-stock-1` | `#f4f0e4` | card gradient start |
| `--card-stock-2` | `#e2dcca` | card gradient end (index) |
| `--card-stock-3` | `#e0dac6` | card gradient end (hero card) |
| `--card-ink` | `#1b1a16` | game titles |
| `--card-body` | `#453f33` | rule text on card stock |
| `--card-muted` | `#7a6f52` | labels / meta on card stock |
| `--suit-red` | `#a8332f` | ♥/♦ on card stock, chip face |
| `--suit-red-light` | `#e08b87` | ♥/♦ on felt (the suit key) |
| `--ivory` | `#f0ece1` | primary text on felt |
| `--ivory-70` | `rgba(240,236,225,.7)` | secondary text on felt |
| `--ivory-50` | `rgba(240,236,225,.5)` | tertiary / chrome |
| `--hairline` | `rgba(201,162,39,.3)` | brass rules and strip borders |

Contrast: all body copy above clears 4.5:1 on its ground. `#c9a227` on felt is used only for
10px uppercase labels and large numerals — do not set paragraph text in it.

### Type

- Display: **Bodoni Moda** (Google Fonts), weights 400 and 500. Game names, wordmark, stat numerals.
- UI / body: **Inter** (Google Fonts), weights 400 and 500. Nothing bolder than 500 anywhere.
- Scale in use: 38 / 34 / 32 / 23 / 20 (display) · 14 / 13.5 / 13 / 12.5 / 11.5 / 11 / 10 / 9 (Inter).
- Uppercase labels always carry `letter-spacing` between `.14em` and `.22em`.
- Body copy gets `text-wrap: pretty`.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Inter:wght@400;500&display=swap">
```

### Spacing, radius, elevation

- Spacing steps in use: 2, 4, 6, 8, 10, 11, 12, 14, 16, 18, 20, 22, 26, 34, 38, 40.
- Radius: `10px` index card · `12px` hero card · `18px` felt surface · `34px` phone shell (mock
  chrome only) · `999px` pills.
- Shadows: `0 6px 16px rgba(0,0,0,.4)` index card · `0 10px 26px rgba(0,0,0,.5)` hero card ·
  `0 2px 6px rgba(0,0,0,.5)` chip · `0 4px 12px rgba(0,0,0,.45)` primary button.
  Do not stack more than one.

## Assets

- **No images.** Everything is CSS gradients and Unicode suit glyphs (`&#9824; &#9827; &#9829; &#9830;`).
  The chip mark is a CSS circle with a dashed border.
- **Fonts**: Bodoni Moda + Inter from Google Fonts. Self-host if the project already self-hosts.
- **Icons**: only `‹`, `›`, `♥` as text glyphs. If the project has an icon set, swap the chevrons
  for real icons; Nocturne's convention is Phosphor.
- If a real logo exists, it replaces the chip mark in the index header.

## Open questions for the client

1. Correct rule text for all ten games, and the real numbered deal for Krogering.
2. Which games are genuinely Covington originals (the brass outline + label).
3. What "Call this game" should do.
4. Whether the ♠/♦/♥/♣ family key stays (it was decorative in earlier rounds and was given
   meaning in `2a`).

## Files in this bundle

| File | What it is |
| --- | --- |
| `Poker Index.dc.html` | The design document. Build `2a` (index) and `3a` (mobile game screen); ignore the rest. Open it in a browser. |
| `games.json` | All ten games, the family→suit mapping, and Krogering's full detail content. Draft rule copy. |
| `nocturne-styles.css` | The Nocturne design system stylesheet the design's structure came from — reference for the spacing scale, radii, faded rule and focus-ring convention. Not required at runtime. |
| `README.md` | This file. |
