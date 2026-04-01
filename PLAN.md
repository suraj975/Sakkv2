# Sakk — Build Plan

## What exists

- Standard `create-next-app` scaffold (Next.js 16, React 19, Tailwind v4, TypeScript)
- `sakk_app.tsx` — complete UI as a single-file React component (mobile-only SPA, state-machine routing)

## Goal

Convert the prototype into a proper Next.js App Router application that works on **both mobile and desktop**.

---

## Architecture

### Routing (App Router)

| Screen                  | Route                            |
| ----------------------- | -------------------------------- |
| Home                    | `/`                              |
| Search                  | `/search`                        |
| Plate Detail            | `/plates/[id]`                   |
| Checkout                | `/plates/[id]/checkout`          |
| Escrow Status           | `/plates/[id]/checkout/escrow`   |
| Transfer Complete       | `/plates/[id]/checkout/complete` |
| Gift Detail             | `/plates/[id]/gift`              |
| Gift Setup              | `/plates/[id]/gift/setup`        |
| Gift Checkout           | `/plates/[id]/gift/checkout`     |
| Gift Reveal (recipient) | `/gift/reveal?plateId=&from=`    |
| Plate Estimator         | `/estimator`                     |

### File Structure

```
src/
  app/
    globals.css               ← brand theme (CSS vars + Tailwind v4 @theme)
    layout.tsx                ← root layout with AppShell
    page.tsx                  ← Home
    search/page.tsx
    plates/[id]/
      page.tsx                ← Plate Detail
      checkout/
        page.tsx
        escrow/page.tsx
        complete/page.tsx
      gift/
        page.tsx
        setup/page.tsx
        checkout/page.tsx
    gift/reveal/page.tsx
    estimator/page.tsx
  components/
    layout/
      AppShell.tsx            ← shell (mobile/desktop switch)
      BottomNav.tsx           ← mobile bottom tab bar
      Sidebar.tsx             ← desktop left sidebar
      PageHeader.tsx          ← back-button sub-page header
    ui/
      Logo.tsx
      IBox.tsx
      Pill.tsx
      TLine.tsx
      Hero.tsx
      InfoBox.tsx
      Button.tsx
    plates/
      PlateViz.tsx            ← pixel-accurate license plate visual
      PlateCard.tsx           ← grid card
  lib/
    plates.ts                 ← PLATES data, fee/tier/aed utils
  types/
    index.ts
```

---

## Responsive Strategy

### Mobile (< 1024px)

- Max-width 430px phone container, centered
- Bottom tab navigation
- 2-column plate grids
- Stacked layouts

### Desktop (≥ 1024px)

- 240px left sidebar, fluid main content
- No phone frame, no bottom nav
- 4-column plate grids on home
- Split layout on detail/checkout (left=visual, right=actions)
- Hero banner spans full width with more padding

---

## Brand Colors (CSS variables → Tailwind utilities)

| Name            | Hex       | Tailwind (via `@theme inline`)   |
| --------------- | --------- | -------------------------------- |
| `--teal`        | `#0CBFB8` | `bg-teal`, `text-teal`           |
| `--teal-dark`   | `#063D3A` | `bg-teal-dark`, `text-teal-dark` |
| `--teal-light`  | `#E5F9F8` | `bg-teal-light`                  |
| `--teal-border` | `#A7E8E5` | `border-teal-border`             |
| `--sakk-bg`     | `#F4F6F7` | `bg-sakk-bg`                     |
| `--sakk-border` | `#E5E8EA` | `border-sakk-border`             |

---

## State Between Pages

- Plate being purchased: plate ID in URL (`/plates/[id]/checkout`)
- Gift details (name, message, date): `sessionStorage` + URL search params
- Note: all flows are stateless/shareable by URL

---

## Notes

- PRD `.docx` is binary and unreadable — design derived from source code + color system
- Claude artifact link requires auth — design fully reconstructed from `sakk_app.tsx`
- Keep visual design 1:1 with original; only expand layout for desktop
