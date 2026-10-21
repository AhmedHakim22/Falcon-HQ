# Stage 8: Interaction & Micro-Animation Specifications

**Document Path:** `design/interaction-spec.md`  
**Date:** 2026-10-21  

---

## 1. Micro-Interactions & Haptic Pacing

1. **Quick Capture Floating Action Button (FAB):**
   - Position: Fixed at bottom-left on mobile (`start-6 bottom-6 z-50`).
   - Action: Tapping expands a modal smoothly (`scale-95` to `scale-100` over `150ms`).
   - Focus: Title input is auto-focused immediately upon opening.
2. **XP Award Toast:**
   - Subtle slide-in from top-center: `+25 XP سكريبت جاهز للتصوير! 🔥`.
   - Subtle particle confetti burst or subtle gold shimmer around the user avatar.
   - Automatically dismisses after 3 seconds without blocking screen interaction.
3. **Framework Switcher (AIDA / PASTOR / Story Arc):**
   - Tab switch animates smoothly via sliding active pill background.
   - Any common fields (e.g. `Hook`, `Body`, `Call to Action`) map automatically across templates so no user text is lost.
4. **Offline Recovery Notification:**
   - When offline, a tiny amber cloud badge appears in the header: `أنت أوفلاين (شغالين بالذاكرة المحلية)`.
   - When connectivity resumes, the badge pulses green for 2 seconds: `تم حفظ كل التغييرات في السحابة ✅`.
