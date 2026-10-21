# ADR-004: Mobile Offline-Resilient Cache & Optimistic Sync

**Status:** Approved  
**Date:** 2026-10-21  

---

## Context
Egyptian cellular mobile networks frequently suffer from packet drops, high latency, and intermittent disconnects during commutes. A mobile web app that crashes or loses user input during network disruption is immediately abandoned.

## Decision
1. Implement a **Local-First Buffer** using Zustand persisted to `IndexedDB` / `localStorage`.
2. Every idea captured via the Quick Capture FAB and every keystroke in Script Studio is written synchronously to local storage prior to network dispatch.
3. Server Actions perform optimistic background dispatch. If a network error occurs, the item is flagged as `pending_sync` with an amber indicator (`محفوظ محلياً (غير متصل)`).
4. A window `online` event listener automatically replays and synchronizes pending mutations once connectivity is restored.

## Consequences
- Zero data loss in mobile transit.
- Sub-15-second capture performance regardless of mobile network speed.
