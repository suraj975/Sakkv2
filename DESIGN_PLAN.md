# Sakk — Design Improvement Plan

## Diagnosis (from screenshots)

### Critical web issues

| Page            | Problem                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| Home            | Categories/stats rows stretch awkwardly full-width; Unicode sidebar icons look amateur |
| Search          | Full-width form with empty half the page — no filter/results split on desktop          |
| Estimator       | Form crammed left, huge blank right side                                               |
| Escrow/Complete | Content too narrow, excessive whitespace on desktop                                    |
| Sidebar         | Unicode symbols (⌂ ◎ ⊕ ○) — unprofessional                                             |
| All             | No hover effects, no animations, no transitions                                        |

---

## Implementation Plan

### 1. Icons — Install lucide-react

Replace all Unicode symbols with Lucide icons across:

- Sidebar: `Home`, `Search`, `PlusCircle`, `Calculator`, `User`
- BottomNav: same set
- PageHeader: `ArrowLeft`
- InfoBox: `ShieldCheck`
- Hero badge: `CircleDot`
- Plate detail verified badge: `BadgeCheck`
- Escrow steps: `CheckCircle2`, `Circle`, `Loader`

### 2. Sidebar redesign

- Lucide icon + label layout
- Hover: `bg-teal-light/50` transition with 200ms ease
- Active: full `bg-teal-light` with teal-colored icon + dark text
- Post Plate button: pill with `+` Lucide icon, teal background
- Divider between main nav and Account
- Footer badge: "100% Escrow Safe" stays, improved styling

### 3. Home — web layout

- Hero: `max-h-[240px] lg:max-h-[200px]` — more compact on desktop
- Categories row: 3 col → on desktop grid changes to `grid-cols-3 xl:grid-cols-3` but cards are max-width capped
- Wrap content in `max-w-[1280px] mx-auto` container
- Trending section: sticky tab bar on scroll

### 4. Search — filter sidebar layout (desktop)

- **Desktop**: `lg:grid lg:grid-cols-[280px_1fr]`
  - Left: sticky filter panel with all controls (Emirate, Code, Digits, Advanced)
  - Right: plate results grid (3 col on desktop)
- **Mobile**: unchanged stacked layout

### 5. Estimator — side-by-side layout (desktop)

- **Desktop**: `lg:grid lg:grid-cols-2 lg:gap-8`
  - Left: form
  - Right: live estimate result (appears as you type or after button)

### 6. Escrow / Complete — max-width and breathing room

- Content wrapped in `max-w-[640px] lg:mx-auto` for both pages
- Add subtle background pattern/gradient on the page background area

### 7. Plate cards — hover effects

```css
.plate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
```

- Transition: `all 200ms ease`
- Cursor pointer, background highlight subtle

### 8. Animations — CSS (globals.css)

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

- Hero text: `animate-fade-up 0.4s ease`
- Cards (staggered via nth-child delay): `animate-fade-up`
- Sidebar items: slide-in on mount
- Page transitions: fade-in

### 9. Buttons

- All primary buttons: hover `brightness-110`, `active:scale-95 transition-transform`
- Secondary/outline buttons: hover `bg-teal-light` transition
- Add `cursor-pointer` and `select-none` consistently

### 10. PlateViz improvements

- Drop shadow on the plate component: `filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15))`
- Slight scale on hover in detail page

---

## Priority Order

1. lucide-react install
2. globals.css animations + utilities
3. Sidebar + BottomNav icons
4. PlateCard hover + animations
5. Search desktop filter layout
6. Estimator side-by-side layout
7. PageHeader + back button icon
8. InfoBox icon
9. Home compact hero + content max-width
10. Escrow/Complete max-width + polish
