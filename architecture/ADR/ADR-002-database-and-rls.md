# ADR-002: Relational PostgreSQL Schema with Row Level Security (RLS)

**Status:** Approved  
**Date:** 2026-10-21  

---

## Context
Falcon HQ handles sensitive business intellectual property: unpublished viral content hooks, custom case manufacturing angles, and exact revenue numbers. Unauthorized reads or writes must be prevented at the database layer.

## Decision
1. Use PostgreSQL with strict typed schemas (`workspaces`, `ideas`, `scripts`, `business_outcomes`, `xp_ledger`).
2. Enforce Row Level Security (RLS) policies on every single table.
3. Automatically compute the Priority Score inside PostgreSQL as a generated column (`GENERATED ALWAYS AS ... STORED`), guaranteeing that `total_priority_score` is strictly `NULL` (Not Rated) whenever any of the 4 dimensions is absent.
4. Prevent direct client insertion into `xp_ledger` to eliminate points cheating.

## Consequences
- Guaranteed data isolation between workspaces.
- Elimination of arithmetic discrepancies in priority scores.
- Immutability of the gamification ledger.
