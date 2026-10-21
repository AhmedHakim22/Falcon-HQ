# Stage 2: License & Security Audit

**Document Path:** `research/license-security-audit.md`  
**Date:** 2026-10-21  
**Author:** Principal Product Architect & Open-Source Research Lead  

---

## 1. Open Source License Risk Classification

To protect Falcon's internal intellectual property and eliminate legal liabilities, all open-source candidates are categorized into four legal risk tiers:

```
[Tier 1: Green / Permissive]  ---> MIT, Apache 2.0, ISC, BSD
[Tier 2: Yellow / Weak Copyleft] -> MPL 2.0, LGPL (Isolated libraries only)
[Tier 3: Red / Strong Copyleft]  -> GPL v2 / v3 (Source disclosure risk)
[Tier 4: Black / Network Copyleft]-> AGPL v3, SSPL, Fair-code / Source-Available (BANNED FOR CORE REUSE)
```

### Candidate Classification Breakdown:

| Repository | License | Risk Tier | Legal Verdict for Falcon HQ |
|---|---|---|---|
| **shadcn/ui** | MIT | **Tier 1 (Green)** | Completely safe. Source code is owned directly within the repository. |
| **supabase/supabase** | Apache 2.0 | **Tier 1 (Green)** | Safe. Permissive commercial use, patent grant included. |
| **ueberdosis/tiptap** | MIT | **Tier 1 (Green)** | Safe. Full liberty to build custom proprietary extensions. |
| **steven-tey/novel** | Apache 2.0 | **Tier 1 (Green)** | Safe. Can be modified, adapted, or encapsulated directly. |
| **lucide-react** | ISC / MIT | **Tier 1 (Green)** | Safe. Zero attribution hassle, completely open. |
| **TanStack Query / Zustand**| MIT | **Tier 1 (Green)** | Safe. Standard modern industry baseline. |
| **pocketbase** | MIT | **Tier 1 (Green)** | Safe for self-hosted fallback. |
| **TypeCellOS/BlockNote** | MPL 2.0 (Core) / GPL 3.0 (XL) | **Tier 2/3 (Yellow/Red)**| Dual license risks; XL packages trigger GPL obligations. |
| **HabitRPG/habitica** | GNU GPL 3.0 | **Tier 3 (Red)** | Incompatible with private proprietary codebase reuse. |
| **AppFlowy** | GNU AGPL 3.0 | **Tier 4 (Black)** | Strictly excluded from codebase. |
| **makeplane/plane** | GNU AGPL 3.0 | **Tier 4 (Black)** | Strictly excluded from codebase. |
| **plankanban/planka** | Fair-code / Commercial | **Tier 4 (Black)** | Licensing uncertainty; prohibited. |

---

## 2. Security Assessment & Attack Surface Analysis

### 1. Data Isolation & Tenant Boundaries
- **Threat:** Falcon's ideas, unpublished product angles, and financial revenue figures must never be visible to unauthorized users or leaked to the public web.
- **Security Control:** Implementation of PostgreSQL **Row Level Security (RLS)** in Supabase. Every table (`ideas`, `scripts`, `outcomes`, `xp_ledger`) will strictly enforce `auth.uid()` checks against workspace membership. Even if an API endpoint is misconfigured, the database engine itself rejects unauthorized queries.

### 2. Cross-Site Scripting (XSS) in Rich-Text Editor
- **Threat:** Copywriting scripts and idea notes accept rich-text and pasted links. Malicious script injection or rogue iframe embeddings could compromise user sessions.
- **Security Control:** Tiptap and Novel use DOMPurify and ProseMirror's strict node schema validation. Raw unescaped HTML injection is blocked at the parser level.

### 3. CSRF & Session Security
- **Threat:** Session hijacking or unauthorized actions executed on behalf of Omar or Salma.
- **Security Control:** JWTs stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies via Next.js Server Components and Supabase SSR Auth helpers. No sensitive access tokens stored in vulnerable `localStorage`.

### 4. Zero Secrets in Client Bundles
- **Threat:** Leaking Supabase `service_role` key or third-party API credentials in client-side JavaScript.
- **Security Control:** Strict separation between public environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and secret server keys (`SUPABASE_SERVICE_ROLE_KEY`). Server Actions and Edge route handlers mediate all privileged operations.

### 5. Mobile Offline Buffer Sanitization
- **Threat:** Corrupted or tampered local cache causing desynchronization or crashes.
- **Security Control:** Strict Zod schema parsing on all data retrieved from local storage or IndexedDB prior to hydration into the application state.
