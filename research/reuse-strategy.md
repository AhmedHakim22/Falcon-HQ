# Stage 2: Open Source Reuse Strategy

**Document Path:** `research/reuse-strategy.md`  
**Date:** 2026-10-21  
**Author:** Principal Product Architect & Open-Source Research Lead  

---

## 1. Strategy Comparison: Full Fork vs Composable Reuse vs Custom Build

| Dimension | Strategy A: Full Fork (e.g. Fork Plane or AppFlowy) | Strategy B: Composable Reuse (Selected Strategy) | Strategy C: Focused Custom Build (From Absolute Zero) |
|---|---|---|---|
| **Description** | Clone an existing monolithic open-source repository and customize its UI/features. | Assemble battle-tested, modular, permissive packages (Tiptap, shadcn/ui, Supabase) and build only custom Falcon domain logic. | Code the entire database, UI components, rich-text editor engine, and auth from scratch. |
| **Legal / License Risk** | **Extreme** (AGPL-3.0 copyleft obligations, network disclosure risks). | **Zero** (100% MIT / Apache-2.0 / ISC permissive components). | **Zero** (All in-house code). |
| **Time to Working MVP** | Slow (Weeks spent deleting 80% of unused enterprise code). | **Fast** (Days: Focus immediately on Falcon's core workflows). | Extremely Slow (Months: Re-inventing rich-text editors and UI primitives). |
| **Maintenance Burden** | Unbearable (Upstream sync conflicts, heavy Docker containers). | **Low** (Clean, modular, standard Next.js / TypeScript maintenance). | High (Maintenance of custom UI primitives and editor cursors). |
| **Simplicity vs Notion** | **Fails** (Monoliths are as bloated as Notion). | **Succeeds** (Laser-focused, zero clutter, single-tap capture). | Variable (High risk of rough edges and UX bugs). |
| **Hosting Cost** | High ($30–$80/mo VPS for Redis/Postgres/MinIO/Celery). | **Near Zero** ($0–$15/mo on Vercel + Supabase free/hobby tiers). | Low ($0–$15/mo). |
| **Final Decision** | **REJECTED** | **STRONGLY APPROVED** | **REJECTED** |

---

## 2. Granular Inventory of Reusable Components

The **Composable Reuse Strategy** specifies exactly what we adopt from the open-source ecosystem versus what we author in-house:

### 1. UI Primitives & Accessibility Base
- **Reusable Package:** `shadcn/ui` (built on Radix UI primitives and Tailwind CSS).
- **Source Repository:** `https://github.com/shadcn-ui/ui`
- **Why it fits:** It is not an opaque npm dependency; the code lives directly in our repository. It provides full keyboard navigation, accessible ARIA attributes, and easy RTL adaptations.
- **License:** MIT License.
- **Obligations:** Include original copyright notice.
- **Modification Plan:** Adapted with Falcon Design Tokens, Arabic typography (`Cairo` / `Readex Pro`), and RTL directional alignment.
- **Why not build from scratch:** Writing accessible dialogs, popovers, dropdowns, and form controls from scratch takes hundreds of engineering hours with high defect rates.
- **Contingency if Abandoned:** The code already lives in our project; it has zero external runtime dependency.

### 2. Rich-Text Editor Engine & Notion-Style Blocks
- **Reusable Package:** `@tiptap/core`, `@tiptap/react`, `@tiptap/starter-kit`, inspired by `steven-tey/novel`.
- **Source Repository:** `https://github.com/ueberdosis/tiptap` & `https://github.com/steven-tey/novel`
- **Why it fits:** Headless ProseMirror wrapper with full DOM control. Perfect for building custom blocks for Falcon:
  - Copywriting Framework Blocks (AIDA / PASTOR / Story Arc / THEDOC).
  - Open Loop Callout Cards.
  - Estimated Speaking Time / Word Count indicators.
- **License:** MIT (Tiptap) & Apache 2.0 (Novel).
- **Obligations:** Standard license notices.
- **Modification Plan:** Adapt Novel's bubble menu and slash-command architecture, while building custom Falcon scriptwriting prompt cards.
- **Why not build from scratch:** Building a contenteditable rich-text editor from scratch is notoriously one of the hardest challenges in web development (cursor bugs, IME composition, mobile keyboard quirks).
- **Contingency if Abandoned:** Tiptap is a foundational standard backed by thousands of companies; ProseMirror underneath is indestructible.

### 3. Icons & Visual Indicators
- **Reusable Package:** `lucide-react`.
- **Source Repository:** `https://github.com/lucide-icons/lucide`
- **License:** ISC / MIT.
- **Modification Plan:** Used as-is for crisp iconography (Tags, Priorities, XP Badges, Audio Notes, Video Links).

### 4. Backend, Identity, Database & Realtime
- **Reusable Infrastructure:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Source Repository:** `https://github.com/supabase/supabase`
- **Why it fits:** Relational PostgreSQL with JSONB support, built-in Auth, Row Level Security, and automated SSL/backup.
- **License:** Apache 2.0.
- **Modification Plan:** Leveraged via managed cloud service or standard SDK; custom Falcon SQL migration schema and RLS policies.
- **Why not build from scratch:** Managing a custom auth server, token rotation, and database backups adds zero commercial value to Falcon.

---

## 3. What We Build In-House (Proprietary Domain Logic)

1. **Idea Priority Engine:** Weighted 4-factor scoring algorithm ($GoalFit, CustomerValue, Reach, Ease$) with automatic status updates and "Not Rated" boundary conditions.
2. **Script Studio Guided Prompting:** Specialized UX step-by-step copywriting guides for Egyptian short-form videos (Hooks, Visual Direction, Audio Cues, Open Loops).
3. **Falcon Balanced Gamification Engine:** Point ledger (`xp_ledger`), streak protection rules, weekly quest trackers, and anti-abuse safeguards.
4. **Business Results & Qualitative Attribution Ledger:** Post-publishing outcome tracking connecting creative angles directly to phone case orders and revenue.
5. **Mobile Quick Capture PWA Experience:** Native Egyptian Arabic interface tuned for sub-15-second idea entry.
