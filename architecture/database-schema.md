# Stage 7: Database Schema & Migration Specification

**Document Path:** `architecture/database-schema.md`  
**Date:** 2026-10-21  
**Database Engine:** PostgreSQL 15+ (Supabase)  
**Security Model:** Mandatory Row Level Security (RLS)  

---

## 1. Complete DDL Schema (Production-Grade)

```sql
-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. WORKSPACES & USERS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Falcon Workspace',
    slug TEXT UNIQUE NOT NULL DEFAULT 'falcon-hq',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'collaborator')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
);

-- =========================================================================
-- 2. IDEAS MODULE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('content', 'marketing', 'product', 'sales', 'bizdev')),
    status TEXT NOT NULL DEFAULT 'inbox' CHECK (status IN (
        'inbox', 
        'evaluating', 
        'scripting', 
        'action_plan', 
        'ready_to_film', 
        'published', 
        'archived'
    )),
    source_url TEXT,
    notes TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Priority Engine: 4 Dimensions (Scale 1 to 5)
    goal_fit_score INT CHECK (goal_fit_score BETWEEN 1 AND 5),
    customer_value_score INT CHECK (customer_value_score BETWEEN 1 AND 5),
    reach_score INT CHECK (reach_score BETWEEN 1 AND 5),
    ease_score INT CHECK (ease_score BETWEEN 1 AND 5),
    
    -- Calculated Score out of 100, or NULL if any dimension is missing (Not Rated)
    total_priority_score NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN goal_fit_score IS NOT NULL 
             AND customer_value_score IS NOT NULL 
             AND reach_score IS NOT NULL 
             AND ease_score IS NOT NULL 
            THEN (20.0 * (0.40 * goal_fit_score + 0.25 * customer_value_score + 0.20 * reach_score + 0.15 * ease_score))
            ELSE NULL 
        END
    ) STORED,

    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideas_workspace ON public.ideas(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_ideas_priority ON public.ideas(total_priority_score DESC NULLS LAST);

-- =========================================================================
-- 3. SCRIPTS MODULE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    framework TEXT NOT NULL DEFAULT 'AIDA' CHECK (framework IN ('AIDA', 'PASTOR', 'StoryArc', 'THEDOC', 'Freeform')),
    open_loops_level TEXT NOT NULL DEFAULT 'off' CHECK (open_loops_level IN ('off', 'light', 'full')),
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 
        'writing', 
        'review_ready', 
        'ready_to_film', 
        'published'
    )),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    estimated_duration_seconds INT NOT NULL DEFAULT 0,
    word_count INT NOT NULL DEFAULT 0,
    
    -- Soft Lock for Async Review Presence
    locked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    locked_at TIMESTAMPTZ,

    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scripts_idea ON public.scripts(idea_id);
CREATE INDEX IF NOT EXISTS idx_scripts_workspace ON public.scripts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_scripts_status ON public.scripts(status);

-- =========================================================================
-- 4. BUSINESS RESULTS MODULE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.business_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    published_url TEXT,
    orders_attributed INT NOT NULL DEFAULT 0,
    revenue_attributed NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    inquiries_count INT NOT NULL DEFAULT 0,
    confidence_level TEXT NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('high', 'medium', 'low')),
    key_learning TEXT,
    is_winning_pattern BOOLEAN NOT NULL DEFAULT false,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outcomes_script ON public.business_outcomes(script_id);

-- =========================================================================
-- 5. BALANCED GAMIFICATION & XP LEDGER
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.xp_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'idea_created',
        'idea_rated',
        'script_completed',
        'script_approved',
        'video_filmed',
        'outcome_recorded',
        'weekly_quest_finished'
    )),
    xp_amount INT NOT NULL,
    reference_id UUID, -- References idea_id, script_id, or outcome_id
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Prevent duplicate reward exploitation for the same event and target
    CONSTRAINT unique_event_reward UNIQUE (user_id, event_type, reference_id)
);

CREATE INDEX IF NOT EXISTS idx_xp_user ON public.xp_ledger(user_id);

-- User aggregated XP view for fast dashboard retrieval
CREATE OR REPLACE VIEW public.user_gamification_stats AS
SELECT 
    user_id,
    workspace_id,
    COALESCE(SUM(xp_amount), 0) AS total_xp,
    FLOOR(COALESCE(SUM(xp_amount), 0) / 100) + 1 AS current_level,
    MOD(COALESCE(SUM(xp_amount), 0), 100) AS current_level_progress
FROM public.xp_ledger
GROUP BY user_id, workspace_id;
```
