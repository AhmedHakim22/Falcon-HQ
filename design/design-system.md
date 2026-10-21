# Stage 8: Design System & Bento Component Specifications

**Document Path:** `design/design-system.md`  
**Date:** 2026-10-21  
**Aesthetic:** Falcon Warm Bento (Warm Beige `#F8F5F0` + Falcon Crimson `#D32F2F`)  

---

## 1. Visual Token Hierarchy

### Colors:
- **Canvas / App Background:** `bg-[#F8F5F0]` (Warm Sand).
- **Surface / Card Background:** `bg-white` with border `border-[#E8E3DA]`.
- **Card Radius:** `rounded-3xl` (24px) for prominent Bento cards; `rounded-2xl` (16px) for inner sections.
- **Brand Primary Accent:** `bg-[#D32F2F]` (Falcon Crimson) with hover `hover:bg-[#B71C1C]`.
- **XP / Gamification Gold:** `text-[#D97706]` / `bg-[#FEF3C7]`.
- **Success / Revenue Green:** `text-[#059669]` / `bg-[#D1FAE5]`.
- **Primary Text:** `text-[#1C1917]` (Charcoal Stone).
- **Muted Text:** `text-[#78716C]` (Warm Stone Gray).

### Typography:
- **Font Family:** `font-sans` with fallback to `Readex Pro`, `Cairo`, system-ui.
- **Direction:** `dir="rtl"` by default with `dir="auto"` on user input areas.

---

## 2. Reusable Bento Component Primitives

### Component 1: `BentoCard`
- Outer container for all dashboard blocks.
- Large border-radius (`rounded-3xl`), white background, subtle border, gentle floating shadow (`shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]`).
- Header with squircle icon badge, title, and optional micro-action button.

### Component 2: `StatusPill`
- Rounded pill badge (`rounded-full px-3 py-1 text-xs font-semibold`).
- States:
  - `Draft`: Gray/Sand (`bg-[#E8E3DA] text-[#57534E]`)
  - `Review Ready`: Amber (`bg-[#FEF3C7] text-[#D97706]`)
  - `Ready to Film`: Falcon Red (`bg-[#FEE2E2] text-[#D32F2F]`)
  - `Published`: Emerald (`bg-[#D1FAE5] text-[#059669]`)

### Component 3: `PrioritySlider`
- 4 touch-friendly sliders with 5 discrete snap points.
- Real-time recalculation of the 100-point score with animated number roll.
- When uncompleted, displays gray `Not Rated` badge.

### Component 4: `SpeakingTimeIndicator`
- Floating pill in Script Studio showing live words and seconds:
  - $< 30\text{s}$: Blue (`سريع ومكثف`)
  - $30\text{s} - 55\text{s}$: Green (`مثالي للريلز`)
  - $> 60\text{s}$: Amber (`طويل نسبياً - اختصر الهوك`)
