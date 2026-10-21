# Architectural & Product Decisions Log (DECISIONS.md)

| ID | Date | Decision | Context / Rationale | Status |
|---|---|---|---|---|
| **DEC-001** | 2026-10-21 | Follow YVCF 14-Stage Framework | Strict adherence to verification gates and research prior to code generation. | **Approved** |
| **DEC-002** | 2026-10-21 | Target Audience: 2-person Core Team | Eliminate enterprise permission/organization complexity in MVP. Focus strictly on Founder + Collaborator workflows. | **Approved** |
| **DEC-003** | 2026-10-21 | Strategy Selection: Composable Reuse over Full Fork | Reject AGPL-3.0 heavy monoliths. Compose best-of-breed modular packages (Tiptap, shadcn/ui, Supabase, TanStack Query). | **Approved** |
| **DEC-004** | 2026-10-21 | Standalone Arabic-First RTL Web App | Arabic Egyptian colloquial tone + clear English technical/business terms. Responsive Mobile-First PWA/Web. | **Approved** |
| **DEC-005** | 2026-10-21 | Async Collaboration over Multiplayer Cursors | Confirmed by user: writing happens asynchronously. Section-level presence and locking prevents edit collision without heavy WebSocket CRDT baggage. | **Approved** |
| **DEC-006** | 2026-10-21 | Falcon Warm Bento Design System | Warm Beige/Sand background (`#F8F5F0`), Falcon Crimson (`#D32F2F`), and white ivory Bento cards (`rounded-3xl`) adapted from user reference image. | **Approved** |
| **DEC-007** | 2026-10-21 | Lean Media Capture | Links first (TikTok/Reels), minimal compressed images; exclude native audio voice memo encoding in MVP to preserve database bandwidth and speed. | **Approved** |
| **DEC-008** | 2026-10-21 | Psychological Balanced Gamification | Non-punitive streaks with weekly grace days, team shared milestone quests, and anti-inflation XP safeguards. | **Approved** |
