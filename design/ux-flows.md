# Stage 8: User Experience Flows & Navigation Architecture

**Document Path:** `design/ux-flows.md`  
**Date:** 2026-10-21  
**Target Viewports:** Mobile-First (PWA 375px–430px) & Desktop Studio (1280px+)  

---

## 1. Information Architecture (Site Map)

```
[ FALCON HQ ROOT ]
  ├── 🏠 الرئيسية (Home Bento Grid)
  │     ├── Hero Inspiration & Quick Capture Bar
  │     ├── Streak & Team Quest Bento
  │     ├── High-Priority Ideas Radar
  │     └── Revenue & Content Sparkline
  │
  ├── 💡 بنك الأفكار (Idea Bank)
  │     ├── Quick Capture Modal / FAB
  │     ├── Filter Bar (Category, Priority, Status)
  │     └── Multi-Track Route Selector
  │
  ├── ✍️ استوديو السكريبتات (Script Studio)
  │     ├── Framework Picker (AIDA, PASTOR, Story Arc, THEDOC)
  │     ├── Open Loops Engine (Off / Light / Full)
  │     ├── Speaking Time Counter
  │     └── Review & Handoff Action Bar
  │
  ├── 💰 نتائج البزنس (Business Results)
  │     ├── Video Outcome Logger
  │     ├── Attributed Revenue & Case Orders
  │     └── Winning Patterns Library
  │
  └── 🏆 لوحة التحفيز (Gamification Ledger)
        ├── XP History & Transparency Log
        ├── Level Progression
        └── Weekly Team Sprints
```

---

## 2. Mobile User Flow: The 15-Second Quick Capture

```mermaid
flowchart TD
    A["Tap Falcon HQ Icon on Phone Home Screen"] --> B["Instant App Open (Cached PWA Shell)"]
    B --> C["Tap Bottom Floating Action Button (+ فكرة)"]
    C --> D["Quick Modal Opens with 2 Fields: Title & Link"]
    D --> E["User Pastes Reel Link + Types 'فكرة كفر ضد الصدمات'"]
    E --> F["Tap 'حفظ وتوجيه' (+5 XP)"]
    F --> G{"Pick Quick Route"}
    G -- "Start Script Now" --> H["Opens Script Studio with Pre-Loaded Framework"]
    G -- "Save to Inbox" --> I["Saved to Idea Bank with 'Not Rated' status"]
```

---

## 3. Desktop User Flow: Script Studio Guided Copywriting

```mermaid
flowchart TD
    A["Select Idea from 'Waiting for Script' Queue"] --> B["Studio Opens in Distraction-Free Layout"]
    B --> C["Framework defaults to AIDA"]
    C --> D["User enters Attention Hook: 'في سر معظم الناس ماتعرفوش عن الجرابات...'"]
    D --> E["Speaking Timer updates: '15 ثانية (ممتاز)'"]
    E --> F["Toggle Open Loops: 'Light' -> Loop Card appears"]
    F --> G["Fill Interest, Desire & Call to Action"]
    G --> H["Click 'إرسال للمراجعة للشريك' (+15 XP)"]
    H --> I["Status updates to 'Review Ready' & Soft-lock transfers to Reviewer"]
```
