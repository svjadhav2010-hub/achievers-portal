# Design System
## Achievers Portal — Achievers Club Nashik

**Version:** 1.0.0  
**Author:** Swayam Vijay Jadhav  
**Philosophy:** Bold ambition, grounded execution — the visual language of a community that takes young people seriously.

---

## 1. Design Principles

1. **Clarity over decoration.** Every visual element earns its place by aiding navigation or comprehension.
2. **Mobile-first, always.** Most members are on Android phones. Design for 375px first.
3. **Gold signals importance.** The gold accent from the Achievers Club brand marks CTAs, highlights, and active states — use it sparingly so it retains weight.
4. **Role-aware affordances.** The UI should feel slightly different for members vs mentors vs admins — same design language, different emphasis.
5. **Speed reads as respect.** Skeleton loaders and instant feedback show users their time is valued.

---

## 2. Color Palette

```
Primary Black    #0A0A0A   — Main backgrounds, headers, nav
Gold Accent      #C9A84C   — CTAs, active states, highlights, borders
Gold Light       #F0D080   — Hover states, subtle backgrounds
Off-White        #FAFAFA   — Page background
Surface White    #FFFFFF   — Cards, modals, inputs
Light Gray       #F4F4F5   — Alternate row backgrounds, input fills
Mid Gray         #A1A1AA   — Placeholder text, secondary icons
Dark Gray        #52525B   — Secondary body text
```

### Semantic Colors
```
Success          #16A34A   — Task completed, verified, saved
Warning          #D97706   — Overdue tasks, expiring OTPs
Error            #DC2626   — Form errors, destructive actions
Info             #2563EB   — Informational toasts, tips
```

### Tailwind Config
```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        black:     '#0A0A0A',
        gold:      '#C9A84C',
        'gold-light': '#F0D080',
      },
      surface: {
        DEFAULT:   '#FFFFFF',
        muted:     '#F4F4F5',
        page:      '#FAFAFA',
      },
      ink: {
        DEFAULT:   '#0A0A0A',
        secondary: '#52525B',
        muted:     '#A1A1AA',
      }
    }
  }
}
```

---

## 3. Typography

### Font Stack
- **Display / Headings:** `Outfit` (Google Fonts) — geometric, modern, confident
- **Body / UI:** `Inter` (Google Fonts) — neutral, highly legible at small sizes
- **Monospace (code/IDs):** `JetBrains Mono` — for reference numbers, OTP display

```html
<!-- In app/layout.tsx -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
```

### Type Scale
| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Display | Outfit | 36px / 2.25rem | 800 | Hero headings, empty states |
| H1 | Outfit | 28px / 1.75rem | 700 | Page titles |
| H2 | Outfit | 22px / 1.375rem | 700 | Section headers |
| H3 | Outfit | 18px / 1.125rem | 600 | Card titles |
| Body Large | Inter | 16px / 1rem | 400 | Main content |
| Body | Inter | 14px / 0.875rem | 400 | Secondary content, labels |
| Small | Inter | 12px / 0.75rem | 400 | Captions, timestamps |
| Mono | JetBrains Mono | 14px / 0.875rem | 400 | OTP, reference numbers |

---

## 4. Spacing System

Stick to Tailwind's default 4px base scale. Common values:

| Token | Value | Usage |
|---|---|---|
| `gap-2` / `p-2` | 8px | Tight internal spacing |
| `gap-3` / `p-3` | 12px | Input padding, compact badges |
| `gap-4` / `p-4` | 16px | Standard card padding (mobile) |
| `gap-6` / `p-6` | 24px | Card padding (desktop) |
| `gap-8` / `p-8` | 32px | Section spacing |
| `gap-12` | 48px | Large section breaks |

---

## 5. Component Specifications

### 5.1 Buttons

```
PRIMARY (Gold CTA)
  Background: brand-gold (#C9A84C)
  Text: brand-black, font-semibold
  Hover: opacity-90, scale-[1.01]
  Active: scale-95
  Disabled: opacity-40, cursor-not-allowed
  Border-radius: rounded-lg (8px)
  Padding: px-5 py-2.5

SECONDARY (Ghost)
  Background: transparent
  Border: 1.5px solid brand-gold
  Text: brand-gold
  Hover: bg-brand-gold/10

DANGER
  Background: #DC2626
  Text: white
  Hover: #B91C1C

SIZES
  sm: text-sm px-3 py-1.5
  md: text-sm px-5 py-2.5   ← default
  lg: text-base px-6 py-3
  icon: p-2, square

LOADING STATE
  Show spinner (Lucide Loader2, animate-spin)
  Disable interaction while loading
```

### 5.2 Inputs & Forms

```
INPUT
  Background: surface-muted (#F4F4F5)
  Border: 1px solid zinc-200; focus: 2px solid brand-gold
  Border-radius: rounded-lg
  Height: 42px (md), 36px (sm)
  Padding: px-4
  Font: Inter 14px

LABEL
  Font: Inter 13px, font-medium
  Color: ink-secondary
  Margin-bottom: 6px

ERROR STATE
  Border: 2px solid #DC2626
  Error text: 12px, #DC2626, below input

FORM LAYOUT
  Vertical stack, gap-4 between field groups
  Section divider (hr, gold tint) for multi-section forms
```

### 5.3 Cards

```
BASE CARD
  Background: white
  Border: 1px solid zinc-100
  Border-radius: rounded-xl (12px)
  Box-shadow: shadow-sm (0 1px 3px rgba(0,0,0,0.08))
  Padding: p-4 (mobile), p-6 (md+)

KPI CARD
  Left border: 3px solid brand-gold
  Icon: top-right, muted background circle
  Number: H1 size, Outfit font, brand-black
  Label: Body size, ink-muted

MEMBER CARD (directory)
  Avatar: 56px circle, border-2 brand-gold/30
  Name: H3 weight
  City + role badge: below name
  WhatsApp button: icon + "Message" text, right side
  Hover: shadow-md, slight translateY(-1px)

TASK CARD (mobile)
  Status badge: top-right
  Title: font-semibold
  Due date: Small, muted
  Progress: thin progress bar bottom of card
```

### 5.4 Badges / Status Pills

```
PENDING     bg-zinc-100   text-zinc-600   "Pending"
IN_PROGRESS bg-blue-50    text-blue-700   "In Progress"
COMPLETED   bg-green-50   text-green-700  "Completed ✓"
OVERDUE     bg-red-50     text-red-700    "Overdue"

ROLE
  MEMBER   bg-zinc-100    text-zinc-600
  MENTOR   bg-amber-50    text-amber-700
  ADMIN    bg-brand-gold  text-brand-black

All badges: rounded-full, px-2.5 py-0.5, text-xs, font-medium
```

### 5.5 Sidebar Navigation

```
SIDEBAR (desktop)
  Width: 240px
  Background: brand-black
  Left padding: pl-4

LOGO AREA
  Achievers Club logo / wordmark
  "Achievers Portal" subtitle in gold

NAV ITEM
  Padding: px-3 py-2.5
  Icon (20px) + label
  Border-radius: rounded-lg
  Active: bg-brand-gold/15, text-brand-gold, border-l-2 brand-gold
  Hover: bg-white/5
  Font: Inter 14px, font-medium

USER SECTION (bottom)
  Avatar + name + role badge
  Logout button (icon only, hover red)

MOBILE (< 768px)
  Sidebar hidden, bottom navigation bar
  5 icons: Home, Members, Tasks, Events, Profile
  Active: gold icon + gold dot indicator
```

### 5.6 Chat Widget (Achibot)

```
TRIGGER BUTTON
  Position: fixed bottom-6 right-6
  Size: 56px circle
  Background: brand-black
  Icon: MessageCircle (white) + gold pulse ring
  Unread badge: red dot top-right

CHAT PANEL
  Mobile: bottom sheet, 85vh, slide-up animation
  Desktop: fixed panel 380px wide × 500px tall, bottom-right
  Header: brand-black, "Achibot" + subtitle + close button

MESSAGES
  User bubble: right, brand-gold background, black text
  Bot bubble: left, surface-muted, black text
  Avatar: small club logo for bot messages
  Timestamp: below each bubble, tiny, muted

INPUT AREA
  Sticky bottom
  Text input (flex-1) + Send button (brand-gold)
  Enter key sends
```

---

## 6. Layout Patterns

### Page Layout (Authenticated)
```
┌─────────────────────────────────────────────────┐
│  SIDEBAR (240px, brand-black, fixed)            │
│  ┌─────────────────────────────────────────┐   │
│  │ TOPBAR (fixed, white, h-16)             │   │
│  ├─────────────────────────────────────────┤   │
│  │                                         │   │
│  │  MAIN CONTENT AREA                      │   │
│  │  max-w-7xl, mx-auto, px-6, py-8        │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘

MOBILE (< 768px):
  Sidebar hidden → Bottom nav bar (h-16, fixed bottom)
  Full-width content, px-4
```

### Dashboard Grid
```
KPI ROW:    grid-cols-2 (mobile) → grid-cols-4 (desktop)
CHARTS:     grid-cols-1 (mobile) → grid-cols-2 (desktop)
TABLES:     full-width, horizontal scroll on mobile
```

### Member Directory Grid
```
grid-cols-1 (< 480px)
grid-cols-2 (480px – 768px)
grid-cols-3 (768px – 1280px)
grid-cols-4 (> 1280px)
```

---

## 7. Motion & Animation

Keep animations purposeful and fast. The portal is a productivity tool, not a showcase.

| Element | Animation | Duration |
|---|---|---|
| Page transition | fade in (opacity 0→1) | 150ms |
| Modal open | scale 0.95→1 + fade | 200ms |
| Chat panel | slide up (translateY) | 250ms ease-out |
| Toast notification | slide in from right | 200ms |
| Hover on cards | translateY(-2px) | 150ms |
| Typing indicator | 3-dot bounce | ∞ loop, 600ms |
| Skeleton loader | shimmer pulse | ∞ loop |

```css
/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## 8. Iconography

Use **Lucide React** exclusively. No mixing icon libraries.

| Context | Icon |
|---|---|
| Members | `Users` |
| Tasks | `CheckSquare` |
| Events | `Calendar` |
| Dashboard | `LayoutDashboard` |
| Chat / Achibot | `MessageCircle` |
| Profile | `UserCircle` |
| Settings | `Settings` |
| Logout | `LogOut` |
| WhatsApp link | `MessageSquare` (custom green) |
| Success | `CheckCircle2` |
| Error | `AlertCircle` |
| Warning | `AlertTriangle` |
| Loading | `Loader2` (animate-spin) |

Icon size defaults: `16px` in tables/badges, `20px` in nav, `24px` in cards, `32px` in empty states.

---

## 9. Responsive Breakpoints

Follow Tailwind defaults:

| Breakpoint | Min-width | Context |
|---|---|---|
| (base) | 0px | Mobile phones |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets, sidebar appears |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

---

## 10. Accessibility Checklist

- [ ] All interactive elements reachable by keyboard (Tab / Enter / Space)
- [ ] Focus rings visible (gold outline, `focus-visible:ring-2 focus-visible:ring-brand-gold`)
- [ ] Color contrast: text on white ≥ 4.5:1, text on gold ≥ 3:1
- [ ] All images have `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Modal traps focus while open
- [ ] `aria-live` region for toast notifications
- [ ] Skeleton loaders have `aria-hidden="true"`

---

## 11. Empty States

Every list page needs a designed empty state — never a blank white void.

```
Pattern:
  1. Centered illustration (simple SVG or Lucide icon, 64px, muted)
  2. Heading: "No tasks yet"
  3. Subtext: "Tasks assigned to you will appear here."
  4. CTA (if applicable): "Create Task" button (admin only)
```

| Page | Empty State Message |
|---|---|
| Member Directory | "No members found. Try adjusting your search." |
| Tasks | "You're all caught up! No pending tasks." |
| Events | "No upcoming events. Check back soon." |
| Chat | "Ask Achibot anything about Achievers Club!" |