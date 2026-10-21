# Architectural & Product Decisions Log (DECISIONS.md)

| ID | Date | Decision | Context / Rationale | Status |
|---|---|---|---|---|
| **DEC-001** | 2026-10-21 | Follow YVCF 14-Stage Framework | Strict adherence to verification gates and research prior to code generation. | **Approved** |
| **DEC-002** | 2026-10-21 | Target Audience: 2-person Core Team | Eliminate enterprise permission/organization complexity in MVP. Focus strictly on Founder + Collaborator workflows. | **Approved** |
| **DEC-003** | 2026-10-21 | Strategy Selection: Composable Reuse over Full Fork | Large open-source monoliths (AFFiNE, AppFlowy, Plane) carry severe licensing constraints (AGPL-3.0), heavy infrastructure footprints (Rust/Flutter/Django/Docker multi-containers), and overwhelming UX complexity that conflicts with the "simpler than Notion" mandate. Selected Strategy B: Composable Reuse of best-of-breed MIT/Apache-2.0 modular packages. | **Proposed (Pending Gate)** |
| **DEC-004** | 2026-10-21 | Standalone Arabic-First RTL Web App | Arabic Egyptian colloquial tone + clear English technical/business terms. Responsive Mobile-First PWA/Web. | **Approved** |
| **DEC-005** | 2026-10-21 | Standby for Supabase & Vercel Linking | Postpone live cloud environment linking until Stage 6 (PRD) approval and Stage 7 (Architecture & Schema baseline). | **Approved** |
