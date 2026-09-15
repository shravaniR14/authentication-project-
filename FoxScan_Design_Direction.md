# FoxScan Creative Direction

The design system used for the Tool SOP site and PDF. Paste this into any Claude thread
where you're producing FoxScan material — web pages, decks, PDFs, reports, social assets —
and ask for the output to follow it.

Derived from foxscan.in: Inter Tight, `#FFBF1B` amber, `#121212` ink, white grounds,
hairline rules. Rev 1 — September 2026.

---

## 1. Colour

One accent. Everything else is ink, paper and hairlines.

| Token | Hex | Use |
|---|---|---|
| `--amber` | `#FFBF1B` | The single accent. Full-bleed hero panels, section rules, step discs, active states, footer edge. |
| `--amber-ink` | `#8A6400` | Amber as *text* — small labels and captions where `#FFBF1B` would be unreadable. |
| `--amber-wash` | `#FFFAE8` | Tinted panels: photo frames, procedure diagrams, callouts. |
| `--amber-line` | `#F2DFA6` (print `#EFD79A`) | Border of anything sitting on amber-wash. |
| `--ink` | `#121212` | Headings, dark bands, footer ground, logo reversed. |
| `--body` | `#5B5B5B` (print `#4E4E4E`) | Body copy. **Never set body text in `--ink`.** |
| `--muted` | `#8A8A8A` | Eyebrows, captions, metadata. |
| `--paper` | `#FFFFFF` | Default ground. |
| `--cream` | `#FDFDF5` | Secondary ground, used sparingly. |
| `--line` | `#E6E4DC` (print `#DEDBD1`) | Structural hairlines. |
| `--line-soft` | `#F0EEE6` (print `#EDEBE3`) | Row separators inside a list. |

**Semantic colours are separate from the accent** and are only for pass/fail meaning:

| State | Screen | Print |
|---|---|---|
| Good / pass | `#1B7A4B` | `#15693F` |
| Caution / marginal | `#B07D08` | `#96690A` |
| Watch / third tier | `#B25415` | `#9A4712` |
| Fail / alert | `#B3352A` | `#9E2E24` |

Print values are darker because ink on paper reads lighter than pixels on a screen.

**Rules**

- Always a white/light ground. No dark mode, no `prefers-color-scheme` adaptation — the
  page renders the same for everyone.
- Amber is structural, not decorative. If you can remove a piece of amber and lose no
  meaning, remove it.
- Never put the amber logo on an amber ground. Reverse it to solid `#121212` instead.

---

## 2. Typography

**Inter Tight, and nothing else.** Weights 300, 400, 500, 600.

| Role | Spec |
|---|---|
| Display heading | 300 weight, UPPERCASE, `letter-spacing:-0.02em`, `line-height:1.0–1.06`. Big and light — the contrast between size and thinness is the whole signature. |
| Section heading | 500, uppercase, `letter-spacing:.16em` |
| Eyebrow / label | 11px screen (6–7pt print), 500–600, UPPERCASE, `letter-spacing:.18em`, colour `--muted` or `--amber-ink` |
| Body | 15.5–16px screen (7.3–8pt print), 400, `line-height:1.4–1.62`, colour `--body` |
| Data / figures | 300 weight, large, `font-variant-numeric:tabular-nums` |

- Measure caps at ~68 characters.
- Numbers are zero-padded: `01`, `07 / 13`.
- Sentence case for sentences. UPPERCASE only for headings and labels — never for a
  full sentence of running text.
- Set headings `text-wrap:balance`.

---

## 3. Layout

**Hairlines, not cards.** The defining move: content is separated by 1px rules, not boxed
in panels with borders, radii and shadows.

- Every section label sits above a **2px amber rule** running the full content width.
- Information goes in label/value rows: a fixed label column (210px screen, 22mm print)
  in small uppercase, the value beside it in body text, rows divided by `--line-soft`.
- Left-aligned. Nothing centred except the cover strip.
- Radius `0–3px`. Effectively square.
- No drop shadows, with one exception: a single soft lift on card hover.
- Amber-wash panels are reserved for three things — photo frames, the procedure diagram,
  and callouts. Everywhere else is white.
- Photos use `object-fit:contain` on an amber-wash panel, never `cover` — an instrument
  cropped at the edges looks careless.
- Generous vertical space between sections; tight, consistent rhythm inside them.

---

## 4. Signature components

These are the pieces that make a FoxScan document recognisable:

- **The amber asterisk** `✱` (U+2733) as a separator in eyebrows and metadata lines.
- **Process flow** — numbered amber discs on a horizontal amber rule with triangular
  arrowheads between them, stage name in uppercase below, description under that, the
  whole thing on an amber-wash panel. Rotates to a vertical chain on narrow screens.
- **Severity bands** — a 3px left rule in the semantic colour plus an uppercase label in
  that same colour. Never a filled coloured box.
- **Printed checkboxes** — in print, an empty 2.8mm square with a hairline border, so it
  can be ticked with a pen on site.
- **Dot-leader contents** — number, name, dotted leader, category, page number.
- **Page numbers** as `07 / 13`, the figure large in ink, the total small in muted.
- **Corner-anchored metadata** — tool ID top-left, organisation top-right, both in tracked
  uppercase at 6–7pt.

---

## 5. Motion (screen only)

Restrained, and always from a resting state.

- **Reveal on scroll**: 18px rise plus fade, `550ms cubic-bezier(.2,.7,.3,1)`, staggered
  70ms across a row.
- **Card hover**: amber rule draws across the top (`scaleX` from left, 340ms), image
  scales to 1.06 behind a clipped edge, number badge fills amber, arrow slides 6px right,
  card lifts 4px.
- Always honour `prefers-reduced-motion: reduce`.
- Never let content sit at `opacity:0` waiting on a script — if the animation never runs,
  everything must still be visible.

---

## 6. Print specifics

- A4, `@page{margin:0}`, page margins handled inside a fixed 210×297mm `.page` element.
- Embed the font as base64 `@font-face` rather than linking Google Fonts, so the PDF
  renders identically anywhere.
- Body 8pt, labels 6–6.4pt, display 22pt. Dense is correct — this is an instrument manual,
  not a brochure.
- One subject per page. Measure content height and tune the type scale until nothing
  clips; never let a page run over.
- Amber panels use heavy ink — specify 120gsm or heavier for anything printed for the field.

---

## 7. Voice

- Plain, declarative, technical. Short sentences.
- State what something answers or measures, not how good it is. No marketing adjectives.
- Name the governing standard explicitly wherever one applies.
- "Do not", not "Don't", in formal labels.
- Never claim more precision than the measurement supports.

---

## 8. What to avoid

These are the tells that make a design look machine-generated. None of them belong in
FoxScan work:

- Purple-to-blue gradient heroes; warm cream grounds with a serif display and terracotta
  accent; near-black pages with one acid-green pop.
- Inter or Space Grotesk as the "safe" typeface. (Inter **Tight** is the brand face —
  that's different, and deliberate.)
- Emoji as section markers.
- Everything centred.
- `border-radius` on every block, soft drop shadows everywhere, an accent bar stapled to
  the top of a rounded card.
- Condensed industrial display faces. Tried, rejected — the light uppercase Inter Tight is
  the FoxScan voice.
- Boxed cards where hairline rules would do.

---

## 9. Quick brief to paste

> Follow the FoxScan creative direction: Inter Tight only (300 display / 400 body /
> 500–600 labels), amber `#FFBF1B` as the single structural accent with `#8A6400` for
> amber text, `#FFFAE8` washes, ink `#121212`, body copy `#5B5B5B`, hairlines `#E6E4DC`.
> Always a white ground, no dark mode. Light uppercase display headings with tight
> letter-spacing. Hairline rules and label/value rows instead of cards, radius 0–3px, no
> shadows. Semantic green/amber/orange/red only for pass–fail meaning. Amber asterisk as
> separator, numbered amber discs with arrows for any process, 3px left rules for severity.
> Left-aligned, generous whitespace, restrained motion.
