# ADR-003: Structured Multi-Framework Script Studio Architecture

**Status:** Approved  
**Date:** 2026-10-21  

---

## Context
Writing effective short-form video scripts for TikTok and Reels requires adherence to proven psychological sales models (AIDA, PASTOR, Story Arc, THEDOC) and retention mechanics (Open Loops). A blank page in Notion leads to creative paralysis.

## Decision
1. Build Script Studio using a **Structured Section Model** powered by `@tiptap/core` and custom React prompt containers.
2. Store script content as structured JSON (`content_json` containing `sections: [{ name, prompt, value }]`).
3. Switching between frameworks dynamically remaps shared sections (e.g. `Hook / Attention` and `Call to Action`) to ensure zero content loss during experimentation.
4. Calculate speaking duration in real-time ($Duration = \frac{\text{WordCount}}{130} \times 60\text{ seconds}$).

## Consequences
- Eliminates the blank canvas syndrome.
- Enforces viral video structure while retaining full editorial freedom.
