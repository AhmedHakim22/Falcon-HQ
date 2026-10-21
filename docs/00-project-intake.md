# Stage 0: Project Intake & Product Scope

**Document Path:** `docs/00-project-intake.md`  
**Date:** 2026-10-21  
**Project:** FALCON HQ — Ideas, Scripts & Growth Workspace  
**Status:** Verification & Alignment Complete  

---

## 1. Product Classification & Core Purpose
- **Product Name (Interim):** FALCON HQ — Ideas, Scripts & Growth Workspace.
- **Product Type:** Internal Product Operating System (Not a public e-commerce store, not an enterprise ERP, and not a generic personal note-taking tool).
- **Domain:** Idea Management, Structured Scriptwriting, Growth Experimentation, and Outcome Tracking specifically tailored for **Falcon** (Egyptian custom phone cases, printed designs, and mobile accessories).
- **Core Operating Dynamic:** High-velocity capture on mobile → Structured evaluation → Frictionless copywriting using battle-tested frameworks → Execution & result recording → Habit reinforcement via balanced gamification.

---

## 2. Target Users & Stakeholder Matrix

### Current Team (v1 MVP):
1. **User Persona 1 — The Founder / Strategist (Owner / Admin):**
   - High mobile usage (captures visual inspiration, reels trends, product ideas while on the go).
   - Responsible for overall brand voice, prioritization, final review/approval of scripts, and tracking actual sales/revenue attribution.
2. **User Persona 2 — Content Partner / Creative Collaborator (Editor / Collaborator):**
   - Co-ideates, researches hooks, writes script drafts, structures copywriting frameworks, tests angles, and requests reviews.

### Future Scalability:
- Future roles (Reviewer, Freelance Videographer, Community Manager) considered in data modeling, but **zero enterprise permission bloat** will be implemented for the initial 2-person workflow.

---

## 3. Commercial & Operational Objectives
1. **Accelerate Creative Throughput:** Reduce time from raw inspiration to production-ready short-form video script from hours/days to < 15 minutes.
2. **Prevent Idea Atrophy:** Stop high-potential marketing and product ideas from getting lost in WhatsApp voice notes or chaotic Notion databases.
3. **Double-Down on What Sells:** Create an unbroken lineage between:
   $$\text{Idea} \longrightarrow \text{Script Angle} \longrightarrow \text{Publish Date} \longrightarrow \text{Actual Orders / Revenue Generated}$$
4. **Cultivate Execution Discipline:** Encourage consistent publishing routines through positive reinforcement rather than punitive pressure.

---

## 4. MVP Scope Definition

### IN-SCOPE (v1 Core Deliverables):
1. **Mobile-First Quick Capture:** Single-tap idea ingestion (Title, Type, Tags, Voice Note/Link, Angles).
2. **Multi-Track Idea Routing:** Ideas can be routed to:
   - *Review First*
   - *Start Script*
   - *Create Action Plan*
   - *Save for Later*
3. **Idea Priority Engine:** Weighted 4-factor scoring model ($GoalFit \times 40\% + CustomerValue \times 25\% + Reach \times 20\% + Ease \times 15\%$), with explicit **Not Rated** state for incomplete ratings.
4. **Structured Script Studio:**
   - Pre-configured frameworks: **AIDA**, **PASTOR**, **Story Arc**, **THEDOC**.
   - Modular **Open Loops Engine** (Off, Light, Full).
   - Frictionless manual writing guidance (prompts, questions, section inputs).
   - Reusable script templates & local autosave.
5. **Lightweight Collaboration:** Async review status (`Draft`, `Writing`, `Review`, `Ready`, `Published`), inline comments, field-level conflict mitigation.
6. **Business Results Ledger:** Post-execution outcome recording (Orders, Revenue, Inquiries, Qualitative lessons, Attribution confidence).
7. **Balanced Gamification Engine:** Transparent XP ledger, non-punitive levels, weekly quests, team milestone bars, optional/healthy streaks.
8. **Arabic-First Responsive Interface:** Fluent Egyptian Arabic UI with native RTL typography and English technical/framework terminology.

### OUT-OF-SCOPE (Explicit Non-Goals for v1):
- Full public e-commerce store / shopping cart / checkout.
- Automated AI autonomous ghostwriting (AI writing scripts on behalf of humans without intervention).
- Real-time Google Docs-style multi-cursor collaborative editing (heavy CRDT overhead not warranted for 2 users).
- Complex multi-tenant enterprise billing or multi-tier workspace administration.
- Deep two-way real-time Notion sync (avoids API rate limits and schema synchronization conflicts).
- Direct social media automated publishing / API posting bots (v1 focuses on creative production and validation).

---

## 5. Technical & Financial Constraints
- **Hosting & Infrastructure Budget:** Near-zero fixed monthly cost (< \$10–15/mo), utilizing generous managed tiers:
  - **Database & Auth:** Supabase (PostgreSQL with Row Level Security, Auth, Storage).
  - **Hosting & Edge Delivery:** Vercel (Next.js Edge runtime, automated CI/CD).
- **Target Devices:**
  - Primary: Mobile browsers / PWA (iPhone / Android) for capture and reviewing.
  - Secondary: Desktop / Laptop (Mac / Windows) for deep-focus scriptwriting sessions.
- **Network Resilience:** Graceful handling of high-latency or intermittent mobile data in Egypt (optimistic UI + local cache buffer).

---

## 6. Success Metrics & Stage Gate Exit Criteria
- **Capture Speed:** Raw idea captured in $< 15$ seconds from mobile home screen.
- **Script Readiness:** Script draft completed in $< 12$ minutes using structured prompts.
- **Adoption:** 100% of Falcon's published content in month 1 originated and tracked within Falcon HQ.
- **Verification Gate:** Formal sign-off on Intake, Discovery, and GitHub Research prior to proceeding to Architecture and PRD.
