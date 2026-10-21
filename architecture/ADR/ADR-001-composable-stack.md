# ADR-001: Selection of Composable Modern Web Stack (Next.js 15, Tailwind v4, Supabase)

**Status:** Approved  
**Date:** 2026-10-21  
**Deciders:** Principal Architect & Founder  

---

## Context
Falcon HQ requires a hyper-fast, low-friction internal workspace that is simpler and faster than Notion for a 2-person team operating predominantly on mobile in Egypt. The hosting footprint must be near-zero fixed cost, and the legal posture must be immune to AGPL copyleft triggers.

## Decision
We select **Strategy B (Composable Reuse)**:
1. **Frontend / Fullstack Framework:** Next.js 15 with React 19 and App Router.
2. **Styling & Components:** Tailwind CSS v4 + `shadcn/ui` (accessible Radix primitives with copy-paste ownership).
3. **Database & Auth:** Supabase Managed PostgreSQL with native Row Level Security.
4. **Icons:** `lucide-react`.

## Consequences
- **Positive:**
  - $0/mo hosting on Vercel + Supabase free tiers.
  - Zero legal exposure to AGPL or GPL copyleft codebases.
  - Native support for Egyptian Arabic RTL via Tailwind logical CSS properties.
  - Instant server-side rendering with zero cold start lag for mobile users.
- **Negative / Trade-offs:**
  - Requires maintaining explicit schema migrations rather than Notion's arbitrary schema changes.
