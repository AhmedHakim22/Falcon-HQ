# Stage 7: Permission Model & Row Level Security (RLS)

**Document Path:** `architecture/permission-model.md`  
**Date:** 2026-10-21  
**Target Engine:** Supabase PostgreSQL Security Policies  

---

## 1. Security Axiom
**"Every single query to public tables must be guarded by Row-Level Security."**  
Even if an unauthorized user obtains the Supabase public anonymous API key, the database engine guarantees that zero rows outside their authorized workspace can be read, updated, inserted, or deleted.

---

## 2. RLS Security Policies

```sql
-- Enable RLS across all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user belongs to workspace
CREATE OR REPLACE FUNCTION public.is_member_of(target_workspace_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = target_workspace_id
          AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- PROFILES POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Users can read members in their workspace"
ON public.profiles FOR SELECT
USING (
    id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.workspace_members wm1
        JOIN public.workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
        WHERE wm1.user_id = auth.uid() AND wm2.user_id = profiles.id
    )
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

-- -------------------------------------------------------------------------
-- IDEAS POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Members can view workspace ideas"
ON public.ideas FOR SELECT
USING (public.is_member_of(workspace_id) AND is_deleted = false);

CREATE POLICY "Members can insert ideas into their workspace"
ON public.ideas FOR INSERT
WITH CHECK (public.is_member_of(workspace_id));

CREATE POLICY "Members can update workspace ideas"
ON public.ideas FOR UPDATE
USING (public.is_member_of(workspace_id));

CREATE POLICY "Only workspace owner or creator can soft-delete ideas"
ON public.ideas FOR DELETE
USING (
    public.is_member_of(workspace_id) AND (
        creator_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.workspace_members 
            WHERE workspace_id = ideas.workspace_id 
              AND user_id = auth.uid() 
              AND role = 'owner'
        )
    )
);

-- -------------------------------------------------------------------------
-- SCRIPTS POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Members can view workspace scripts"
ON public.scripts FOR SELECT
USING (public.is_member_of(workspace_id) AND is_deleted = false);

CREATE POLICY "Members can insert and edit workspace scripts"
ON public.scripts FOR ALL
USING (public.is_member_of(workspace_id));

-- -------------------------------------------------------------------------
-- BUSINESS OUTCOMES POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Members can view business outcomes"
ON public.business_outcomes FOR SELECT
USING (public.is_member_of(workspace_id));

CREATE POLICY "Members can record business outcomes"
ON public.business_outcomes FOR INSERT
WITH CHECK (public.is_member_of(workspace_id));

-- -------------------------------------------------------------------------
-- GAMIFICATION XP LEDGER POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Members can view workspace XP ledger"
ON public.xp_ledger FOR SELECT
USING (public.is_member_of(workspace_id));

-- Inserts into XP ledger are restricted to Server Actions (via Security Definer or Service Role)
-- Direct client insertions into xp_ledger are disallowed to prevent client-side point forgery.
CREATE POLICY "Client direct insert to xp_ledger is disallowed"
ON public.xp_ledger FOR INSERT
WITH CHECK (false);
```
