# Permanent Library 1: Tools Library & Stack Governance

**Document Path:** `libraries/tools-library.md`  
**Date:** 2026-10-21  
**Project:** FALCON HQ  

---

## 1. Stack Governance & Tool Selection Register

### 1. Next.js 15 (React 19 / App Router / TypeScript)
- **When to use:** The application runtime for web and PWA, powering frontend UI and backend Server Actions.
- **Why use it:** Instant server-side rendering, top-tier performance on mobile devices, automatic image optimization, and first-class integration with Vercel and Supabase SSR.
- **Alternatives:** Vite + SPA (React), Remix / React Router v7, SvelteKit.
- **Cost:** $0 (Open Source).
- **Limitations:** App Router hydration complexity if SSR boundaries are violated.
- **Risks:** Frequent version evolutions; mitigated by pinning stable LTS versions.
- **External Account Required:** None for local development.
- **Vendor Lock-in:** Low (Standard React/Node code, can be packaged in Docker).

### 2. Supabase (PostgreSQL + Auth + Storage + RLS)
- **When to use:** Core database, user authentication, role management, and image attachment storage.
- **Why use it:** Provides production-grade relational PostgreSQL with zero DevOps overhead, Row-Level Security (RLS) for data protection, and instant real-time synchronization.
- **Alternatives:** PocketBase, Firebase Firestore, Neon Postgres + Auth0, self-hosted Docker PostgreSQL.
- **Cost:** Free tier ($0/mo for 500MB DB & 50,000 MAU; Pro tier $25/mo if expanded).
- **Limitations:** Free tier pauses inactive projects after 7 days (not an issue with active daily use).
- **Risks:** Vendor coupling to Supabase proprietary client abstractions. Mitigated by using standard SQL schemas and standard PostgreSQL queries.
- **External Account Required:** Yes (Supabase Cloud).
- **Vendor Lock-in:** Very Low (PostgreSQL schema is 100% portable to any standard Postgres host).

### 3. Vercel Edge / Serverless Hosting
- **When to use:** Production hosting, edge routing, automated continuous deployment from GitHub.
- **Why use it:** Global CDN edge network, instant previews on pull requests, native Next.js optimization.
- **Alternatives:** Cloudflare Pages, Fly.io, Railway, Hetzner VPS.
- **Cost:** Free Hobby tier ($0/mo) for 2 users.
- **Limitations:** Serverless function execution timeouts (10–60s).
- **Risks:** Bandwidth overages if serving unoptimized videos (Mitigated by embedding external TikTok/Reels links instead of hosting massive raw video files directly).
- **External Account Required:** Yes (Vercel account).
- **Vendor Lock-in:** Low (Next.js can run on Node.js Docker container anywhere).

### 4. Tailwind CSS v4 & shadcn/ui
- **When to use:** Visual styling, responsive layouts, RTL directional positioning, and accessible UI component primitives.
- **Why use it:** Zero runtime overhead, complete styling control, native support for logical properties (`ms-`, `me-`, `ps-`, `pe-`).
- **Alternatives:** Mantine, Chakra UI, Ant Design, MUI.
- **Cost:** $0 (MIT Open Source).
- **Limitations:** Requires Tailwind syntax familiarity.
- **Risks:** None. Code is owned inside the project.
- **External Account Required:** None.
- **Vendor Lock-in:** Zero.

### 5. Tiptap Core & Novel Architecture
- **When to use:** The Script Studio text editor, guided copywriting sections, and prompt blocks.
- **Why use it:** Headless ProseMirror architecture allows total customization of custom nodes and blocks without fighting pre-baked UI assumptions.
- **Alternatives:** Slate.js, Draft.js (deprecated), Lexical, Quill.
- **Cost:** $0 (MIT / Apache 2.0).
- **Limitations:** Complex custom node views require careful React wrapper lifecycle handling.
- **Risks:** ProseMirror schema changes. Mitigated by isolating editor logic in `components/editor/`.
- **External Account Required:** None.
- **Vendor Lock-in:** Zero.

### 6. GitHub Actions & Git SCM
- **When to use:** Version control, continuous integration, automated linting, type-checking, and security vulnerability scanning.
- **Why use it:** Industry standard, seamless trigger on push, native GitHub integration.
- **Alternatives:** GitLab CI, Bitbucket Pipelines.
- **Cost:** $0 (Free tier provides 2,000 CI minutes/mo for private repos).
- **Limitations:** Setup overhead for pipeline configs.
- **Risks:** None.
- **External Account Required:** Yes (GitHub account).
- **Vendor Lock-in:** Low.
