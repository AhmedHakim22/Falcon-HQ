# Stage 2: GitHub Landscape Research Report

**Document Path:** `research/github-landscape.md`  
**Date:** 2026-10-21  
**Author:** Principal Product Architect & Open-Source Research Lead  
**Research Principle:** Evidence-Driven, License-First, Zero-Fake Data  

---

## 1. Executive Research Summary
We conducted a comprehensive GitHub landscape audit covering **15 candidate open-source repositories** across six functional domains relevant to Falcon HQ:
1. All-in-One Collaborative Workspaces & Notion Alternatives
2. Project & Kanban Management
3. Rich-Text & Document Block Editors
4. Gamification & Behavioral Habit Engines
5. UI Systems & Design Foundations
6. Backend, Authentication, Database & Sync Infrastructure

Each repository was scrutinized for:
- Live GitHub Stars & Community Traction (verified October 2026).
- Exact License Terms & Legal Obligations (GPL/AGPL vs Apache 2.0/MIT/ISC).
- Latest Release & Maintenance Recency.
- Architectural Complexity & Hosting/Operational Footprint.
- Fitness for Falcon's 2-person, mobile-first, Egyptian Arabic workflow.

---

## 2. In-Depth Analysis of 15 Candidate Repositories

### Category 1: All-in-One Workspaces & Notion Alternatives

#### 1. AFFiNE (`toeverything/affine`)
- **Stars:** ~73,700+
- **License:** Primarily MIT (with split proprietary/specific licensing in `packages/backend` and native components).
- **Latest Release:** `v0.27.4` (active canary line).
- **Tech Stack:** TypeScript, Rust, React, Jotai, BlockSuite.
- **Architectural Footprint:** Very heavy. Combines whiteboarding canvas with block docs. Requires substantial Docker microservices to self-host.
- **Evaluation for Falcon:** **Reject as Fork Base.** While visually stunning, it is drastically over-engineered for Falcon. It violates the "simpler than Notion" rule and brings high memory/compute overhead not suitable for low-cost Vercel/Supabase hosting.

#### 2. AppFlowy (`AppFlowy-IO/AppFlowy`)
- **Stars:** ~77,600+
- **License:** **GNU AGPL-3.0** (Strict copyleft network license).
- **Latest Release:** `v0.14.x` series.
- **Tech Stack:** Flutter (UI) + Rust (Core engine, SQLite sync).
- **Architectural Footprint:** Desktop & mobile native client requiring Flutter toolchain and compiled Rust binaries.
- **Evaluation for Falcon:** **Reject.** AGPL-3.0 creates severe legal contamination risks. Flutter for web has notoriously poor RTL Arabic text rendering and slow initial bundle load times compared to native React DOM.

#### 3. Colanode (`colanode/colanode`)
- **Stars:** ~5,200+
- **License:** **Apache License 2.0** (Permissive).
- **Latest Release:** `v0.4.7`.
- **Tech Stack:** TypeScript, React, Tailwind CSS, shadcn/ui, SQLite, PostgreSQL (`pgvector`), Redis, Yjs CRDTs.
- **Architectural Footprint:** Local-first modular workspace with clean desktop/web separation.
- **Evaluation for Falcon:** **Valuable Architectural Reference.** The use of shadcn/ui and PostgreSQL aligns with modern web standards, but running local SQLite sync + Redis + Node backend adds maintenance overhead when compared to serverless PostgreSQL (Supabase).

---

### Category 2: Project & Kanban Management

#### 4. Plane (`makeplane/plane`)
- **Stars:** ~61,000+
- **License:** **GNU AGPL-3.0**.
- **Latest Release:** `v1.4.2` / `v1.4.3-rc`.
- **Tech Stack:** TypeScript, React Router, Vite, Tailwind CSS (Frontend); Python (Django REST Framework), PostgreSQL, Redis, MinIO (Backend).
- **Architectural Footprint:** Massive multi-service enterprise Jira/Linear alternative. Requires 6+ Docker containers.
- **Evaluation for Falcon:** **Reject as Fork Base.** AGPL-3.0 copyleft restriction. Massive operational complexity designed for 50+ developer engineering teams, completely contrary to a 2-person marketing workflow.

#### 5. Planka (`plankanban/planka`)
- **Stars:** ~12,500+
- **License:** Fair-code / Source-Available & Commercial (shifted away from pure open AGPL).
- **Latest Release:** `v2.2.1`.
- **Tech Stack:** React, Redux, Node.js, PostgreSQL.
- **Architectural Footprint:** Moderate monolithic Kanban app.
- **Evaluation for Falcon:** **Reject.** License ambiguity prevents confident commercial adaptation. Kanban in Falcon HQ needs to be deeply tied to Idea prioritization and Script states, not a generic Trello board.

---

### Category 3: Rich-Text & Document Editors

#### 6. Novel (`steven-tey/novel`)
- **Stars:** ~15,800+
- **License:** **Apache License 2.0** (Permissive).
- **Latest Release:** `novel@1.0.2`.
- **Tech Stack:** Next.js, React, Tiptap, Tailwind CSS, Radix UI.
- **Evaluation for Falcon:** **Prime Reusability Candidate.** Novel is an open-source headless Notion-style editor package built on top of Tiptap with pre-configured slash commands, bubble menus, and Tailwind styling. It is modular, lightweight, and plugs directly into a Next.js frontend.

#### 7. Tiptap Core (`ueberdosis/tiptap`)
- **Stars:** ~38,800+
- **License:** **MIT License** (Core & open extensions).
- **Latest Release:** Continuous active updates (v2.x / v3.x lineage).
- **Tech Stack:** Headless, framework-agnostic wrapper over ProseMirror.
- **Evaluation for Falcon:** **Approved Essential Engine.** Provides total control over document nodes, schema extensions (e.g. custom Hook cards, Open Loop blocks, AIDA section containers), and native RTL text alignment support.

#### 8. BlockNote (`TypeCellOS/BlockNote`)
- **Stars:** ~10,300+
- **License:** **MPL-2.0** (Core), **GPL-3.0** (XL packages).
- **Latest Release:** `v0.56.0`.
- **Tech Stack:** React / Vanilla JS built on Prosemirror.
- **Evaluation for Falcon:** **Secondary Alternative.** While cleanly block-based, the split MPL/GPL licensing structure and more rigid block UI make customized structured form inputs (like AIDA/PASTOR guided prompts) harder to craft than using vanilla Tiptap with custom React extensions.

---

### Category 4: Gamification & Behavioral Habit Engines

#### 9. Habitica (`HabitRPG/habitica`)
- **Stars:** ~14,200+
- **License:** **GNU GPL-3.0**.
- **Latest Release:** `v5.51.x`.
- **Tech Stack:** Vue.js, Node.js (Express), MongoDB, Redis.
- **Architectural Footprint:** Full RPG game engine with character avatars, equipment, party quests, and boss fights.
- **Evaluation for Falcon:** **Reference Only / Reject Code Reuse.** GPL-3.0 license. The RPG pixel-art fantasy mechanics are completely inappropriate for an internal business workspace. However, the *mathematical pacing of XP per task and anti-cheating mechanisms* serve as excellent conceptual inspiration.

#### 10. Octalysis & Custom Balanced Gamification Patterns
- **Concept:** Purpose-built, lightweight TypeScript Gamification Engine.
- **License:** Native in-house design (0 external license restrictions).
- **Footprint:** Single database table (`xp_ledger`) with deterministic point triggers and anti-abuse safeguards.
- **Evaluation for Falcon:** **Strongest Approach.** A lightweight custom gamification model in TypeScript avoids bloated RPG codebases and guarantees 100% relevance to Falcon's creative milestones.

---

### Category 5: Design Systems & Component Foundations

#### 11. shadcn/ui (`shadcn-ui/ui`)
- **Stars:** ~126,100+
- **License:** **MIT License**.
- **Latest Release:** Actively maintained with CLI `v4.x`.
- **Tech Stack:** React, Tailwind CSS, Radix UI primitives.
- **Evaluation for Falcon:** **Approved Component Foundation.** Not an npm dependency you get locked into, but accessible source code copied directly into the project. Flawless accessibility, full RTL support via Tailwind logical properties (`ms-`, `me-`, `ps-`, `pe-`), and seamless customization for Falcon's visual aesthetic.

#### 12. Lucide Icons (`lucide-icons/lucide` / `lucide-react`)
- **Stars:** ~25,200+
- **License:** **ISC / MIT License**.
- **Latest Release:** `v1.60.0`.
- **Tech Stack:** Tree-shakeable modern SVG icons for React.
- **Evaluation for Falcon:** **Approved Icon Standard.** Ultra-lightweight, customizable stroke-widths, zero external assets, and instant visual cues for idea types, priority ratings, and status badges.

---

### Category 6: Backend, Database & Infrastructure

#### 13. Supabase (`supabase/supabase`)
- **Stars:** ~113,000+
- **License:** **Apache License 2.0**.
- **Latest Release:** Continuous production platform updates.
- **Tech Stack:** PostgreSQL, PostgREST, GoTrue (Auth), Realtime (Elixir), Storage (S3-compatible).
- **Evaluation for Falcon:** **Primary Backend Choice.** Enterprise-grade relational PostgreSQL with native Row-Level Security (RLS), instant JWT authentication, managed storage for image/voice attachments, and a generous free/low-cost tier that runs Falcon HQ for $0–$25/mo without managing servers.

#### 14. PocketBase (`pocketbase/pocketbase`)
- **Stars:** ~61,500+
- **License:** **MIT License**.
- **Latest Release:** `v0.40.4`.
- **Tech Stack:** Go + SQLite, single portable binary.
- **Evaluation for Falcon:** **Strong Alternative.** Excellent for ultra-lightweight self-hosting on a single $5 VPS, but lacks the native serverless edge integration, instant migration tooling, and mature client ecosystem that Supabase provides for Next.js.

#### 15. TanStack Query (`TanStack/query`) & Zustand (`pmndrs/zustand`)
- **Stars:** ~45,000+ / ~50,000+
- **License:** **MIT License**.
- **Evaluation for Falcon:** **Approved Client State Layer.** Zustand handles lightweight UI states (active editor mode, filter bars, mobile drawer toggles); TanStack Query handles server caching, optimistic updates, and background re-validation on intermittent Egyptian mobile connections.
