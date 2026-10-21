# Permanent Library 3: Skills Library

This directory houses standardized, reusable operational instructions for specialized engineering roles within the Falcon HQ lifecycle.

Each skill specifies:
1. **Purpose**
2. **Inputs**
3. **Preconditions**
4. **Workflow**
5. **Prohibited Actions**
6. **Output Deliverables**
7. **Acceptance Checklist**

---

## 1. GitHub Repository Evaluator (`skills/github-evaluator.md`)
- **Purpose:** Rigorously evaluate candidate open-source repositories against Falcon's 8-factor scorecard before any dependency is introduced.
- **Workflow:** Inspect verified GitHub stars, release recency, commit cadence, and architectural weight.
- **Prohibited:** Never evaluate by star count alone; never hallucinate unverified stars or releases.

## 2. License & Security Reviewer (`skills/license-security-reviewer.md`)
- **Purpose:** Audit software dependencies for legal copyleft risk (AGPL/GPL) and security vulnerabilities (CVEs, XSS, RLS leakage).
- **Prohibited:** Never import AGPL-3.0 or GPL-3.0 libraries into core application bundles.

## 3. PRD Critic (`skills/prd-critic.md`)
- **Purpose:** Stress-test product specifications for scope creep, missing edge cases, offline network failure, and usability friction.
- **Prohibited:** Never allow an undefined edge case or ambiguous success metric to pass to development.

## 4. Script Editor Builder (`skills/script-editor-builder.md`)
- **Purpose:** Guide the construction of copywriting studio modules (AIDA, PASTOR, Story Arc, THEDOC + Open Loops) ensuring dynamic framework mapping and real-time speaking duration indicators.
- **Prohibited:** Never present an unguided blank page; never lose user input during framework switches.

## 5. Gamification Balance Reviewer (`skills/gamification-balance-reviewer.md`)
- **Purpose:** Audit XP distribution and streaks to prevent fatigue, gaming/abuse, and toxic pressure on rest days.
- **Prohibited:** Never reward empty activity; never wipe streaks on recognized grace days.
