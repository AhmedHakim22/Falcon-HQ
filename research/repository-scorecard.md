# Stage 2: Repository Scorecard & Evaluation Matrix

**Document Path:** `research/repository-scorecard.md`  
**Date:** 2026-10-21  
**Scoring Model:** 8-Factor Weighted Scorecard (Scale 0–100)  

---

## 1. Weighted Evaluation Criteria
- **W1 — Falcon Fit (25%):** Exact alignment with quick capture, idea scoring, structured copywriting frameworks, and result tracking for a 2-person team.
- **W2 — Licensing & Legal Safety (15%):** Permissive (MIT/Apache-2.0/ISC = 15; MPL = 10; GPL/AGPL copyleft = 0–4; Ambiguous = 0).
- **W3 — Maintenance & Sustainability (15%):** Active releases in 2026, vibrant community, low issue backlog decay.
- **W4 — Security & Dependency Health (15%):** Minimal attack surface, robust auth models, low CVE exposure.
- **W5 — Customization & Maintenance Ease (10%):** Clean codebase, modular architecture, easy for a small team to maintain.
- **W6 — UX & Mobile Suitability (10%):** High performance on mobile viewports, native RTL Arabic support, low cognitive load.
- **W7 — Integration Friendliness (5%):** Seamless fit with modern web stack (Next.js/React/TypeScript/PostgreSQL).
- **W8 — Operational & Hosting Cost (5%):** Low-cost serverless or minimal VPS footprint (< $15/mo).

---

## 2. Comprehensive Scorecard Table

| Repository | Category | W1 (25) | W2 (15) | W3 (15) | W4 (15) | W5 (10) | W6 (10) | W7 (5) | W8 (5) | Total (100) | Disposition |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **shadcn/ui** | UI Foundation | 24 | 15 | 15 | 15 | 10 | 9 | 5 | 5 | **98** | **Approved Core Component Base** |
| **supabase/supabase** | Backend & DB | 24 | 15 | 15 | 14 | 9 | 8 | 5 | 5 | **95** | **Approved Core Backend** |
| **lucide-icons/lucide** | Icon System | 24 | 15 | 15 | 15 | 10 | 10 | 5 | 5 | **99** | **Approved Icon Standard** |
| **ueberdosis/tiptap** | Editor Engine | 23 | 15 | 15 | 14 | 9 | 8 | 5 | 5 | **94** | **Approved Editor Engine** |
| **steven-tey/novel** | Notion-Style Editor | 22 | 15 | 13 | 13 | 9 | 8 | 5 | 5 | **90** | **Approved Adaptable Package** |
| **TanStack Query** | State & Sync | 23 | 15 | 15 | 14 | 9 | 9 | 5 | 5 | **95** | **Approved Data Sync** |
| **pocketbase/pocketbase** | Alternative Backend | 18 | 15 | 14 | 13 | 8 | 7 | 4 | 5 | **84** | **Viable Fallback Backend** |
| **colanode/colanode** | Local Workspace | 16 | 15 | 12 | 12 | 7 | 7 | 4 | 4 | **77** | **Inspirational Architecture Only** |
| **TypeCellOS/BlockNote** | Block Editor | 19 | 10 | 14 | 12 | 7 | 7 | 4 | 4 | **77** | **Alternative Editor (MPL Split)** |
| **toeverything/affine** | All-in-One Canvas | 12 | 10 | 14 | 12 | 4 | 5 | 3 | 2 | **62** | **Rejected (Heavyweight / Overkill)** |
| **plankanban/planka** | Kanban Board | 14 | 4 | 12 | 11 | 6 | 6 | 3 | 4 | **60** | **Rejected (Commercial/Fair-code license)** |
| **makeplane/plane** | Project Management | 13 | 3 | 14 | 11 | 4 | 6 | 3 | 2 | **56** | **Rejected (AGPL-3.0 / Enterprise bloat)** |
| **HabitRPG/habitica** | Gamification RPG | 10 | 3 | 12 | 11 | 4 | 5 | 2 | 3 | **50** | **Rejected (GPL-3.0 / RPG Fantasy Mismatch)** |
| **AppFlowy-IO/AppFlowy** | Flutter Workspace | 11 | 2 | 14 | 11 | 3 | 4 | 2 | 2 | **49** | **Rejected (AGPL-3.0 / Poor Web RTL)** |

---

## 3. Disqualification Analysis

### 1. AppFlowy (`AppFlowy-IO/AppFlowy`) & Plane (`makeplane/plane`)
- **Reason for Disqualification:** Both projects utilize the **GNU Affero General Public License v3.0 (AGPL-3.0)**. Under AGPL-3.0, running modified versions over a network imposes legal copyleft triggers. Furthermore, both projects are architectural monoliths requiring multi-container orchestration (Flutter/Rust for AppFlowy, Django/Redis/MinIO for Plane), making zero-maintenance deployment on low-cost edge platforms impossible.

### 2. Habitica (`HabitRPG/habitica`)
- **Reason for Disqualification:** In addition to **GPL-3.0**, Habitica's domain model revolves around RPG game elements (Mana, Gold, Warrior/Rogue classes, Pixel Bosses). Trying to fork or shoehorn this into an internal commercial workspace for an e-commerce case brand would create absurd cognitive friction for Omar and Salma.

### 3. AFFiNE (`toeverything/affine`)
- **Reason for Disqualification:** Combines an infinite whiteboard canvas with document editing. It is too heavy for fast mobile entry on Egyptian cellular networks and directly violates Falcon HQ's fundamental law: **"Simpler than Notion in daily use."**
