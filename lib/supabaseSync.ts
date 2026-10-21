import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Idea, Script, BusinessOutcome, XpEvent } from './types';

// Helper to ensure valid UUID v4
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// -----------------------------------------------------------------------------
// FETCH ALL DATA FROM SUPABASE
// -----------------------------------------------------------------------------
export async function fetchRemoteData(): Promise<{
  ideas: Idea[] | null;
  scripts: Script[] | null;
  outcomes: BusinessOutcome[] | null;
  xpEvents: XpEvent[] | null;
}> {
  if (!supabase || !isSupabaseConfigured) {
    return { ideas: null, scripts: null, outcomes: null, xpEvents: null };
  }

  try {
    const [ideasRes, scriptsRes, outcomesRes, xpRes] = await Promise.all([
      supabase.from('ideas').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
      supabase.from('scripts').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
      supabase.from('business_outcomes').select('*').order('created_at', { ascending: false }),
      supabase.from('xp_ledger').select('*').order('created_at', { ascending: false }),
    ]);

    if (ideasRes.error || scriptsRes.error || outcomesRes.error || xpRes.error) {
      console.warn('Supabase fetch error, fallback to local buffer:', {
        ideasError: ideasRes.error?.message,
        scriptsError: scriptsRes.error?.message,
      });
      return { ideas: null, scripts: null, outcomes: null, xpEvents: null };
    }

    const ideas: Idea[] = (ideasRes.data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      status: row.status,
      sourceUrl: row.source_url || '',
      notes: row.notes || '',
      creatorName: row.creator_name || 'أحمد',
      assigneeName: row.assignee_name || undefined,
      goalFitScore: row.goal_fit_score || undefined,
      customerValueScore: row.customer_value_score || undefined,
      reachScore: row.reach_score || undefined,
      easeScore: row.ease_score || undefined,
      totalPriorityScore: row.total_priority_score ? Number(row.total_priority_score) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    const scripts: Script[] = (scriptsRes.data || []).map((row: any) => ({
      id: row.id,
      ideaId: row.idea_id || undefined,
      title: row.title,
      framework: row.framework,
      openLoopsLevel: row.open_loops_level,
      sections: row.content_json || [],
      openLoops: row.open_loops_json || [],
      status: row.status,
      authorName: row.author_name || 'أحمد',
      reviewerName: row.reviewer_name || undefined,
      estimatedDurationSeconds: row.estimated_duration_seconds || 0,
      wordCount: row.word_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    const outcomes: BusinessOutcome[] = (outcomesRes.data || []).map((row: any) => ({
      id: row.id,
      scriptId: row.script_id,
      ideaTitle: row.idea_title,
      publishedUrl: row.published_url || '',
      ordersAttributed: row.orders_attributed || 0,
      revenueAttributed: Number(row.revenue_attributed) || 0,
      inquiriesCount: row.inquiries_count || 0,
      confidenceLevel: row.confidence_level || 'high',
      keyLearning: row.key_learning || '',
      isWinningPattern: row.is_winning_pattern ?? true,
      recordedAt: row.recorded_at,
    }));

    const xpEvents: XpEvent[] = (xpRes.data || []).map((row: any) => ({
      id: row.id,
      eventType: row.event_type,
      xpAmount: row.xp_amount,
      description: row.description,
      createdAt: row.created_at,
    }));

    return { ideas, scripts, outcomes, xpEvents };
  } catch (err) {
    console.error('Remote fetch error:', err);
    return { ideas: null, scripts: null, outcomes: null, xpEvents: null };
  }
}

// -----------------------------------------------------------------------------
// SYNC OPERATIONS
// -----------------------------------------------------------------------------
export async function syncIdeaToSupabase(idea: Idea) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: idea.id,
      title: idea.title,
      category: idea.category,
      status: idea.status,
      source_url: idea.sourceUrl || null,
      notes: idea.notes || null,
      creator_name: idea.creatorName,
      assignee_name: idea.assigneeName || null,
      goal_fit_score: idea.goalFitScore || null,
      customer_value_score: idea.customerValueScore || null,
      reach_score: idea.reachScore || null,
      ease_score: idea.easeScore || null,
      total_priority_score: idea.totalPriorityScore || null,
      is_deleted: false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('ideas').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('Supabase sync idea warning:', error.message);
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function deleteIdeaFromSupabase(ideaId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from('ideas').update({ is_deleted: true }).eq('id', ideaId);
  } catch (err) {
    console.warn('Delete idea sync error:', err);
  }
}

export async function syncScriptToSupabase(script: Script) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: script.id,
      idea_id: script.ideaId || null,
      title: script.title,
      framework: script.framework,
      open_loops_level: script.openLoopsLevel,
      content_json: script.sections,
      open_loops_json: script.openLoops,
      status: script.status,
      author_name: script.authorName,
      reviewer_name: script.reviewerName || null,
      estimated_duration_seconds: script.estimatedDurationSeconds,
      word_count: script.wordCount,
      is_deleted: false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('scripts').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('Supabase sync script warning:', error.message);
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function syncOutcomeToSupabase(outcome: BusinessOutcome) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: outcome.id,
      script_id: outcome.scriptId,
      idea_title: outcome.ideaTitle,
      published_url: outcome.publishedUrl || null,
      orders_attributed: outcome.ordersAttributed,
      revenue_attributed: outcome.revenueAttributed,
      inquiries_count: outcome.inquiriesCount,
      confidence_level: outcome.confidenceLevel,
      key_learning: outcome.keyLearning,
      is_winning_pattern: outcome.isWinningPattern,
    };

    const { error } = await supabase.from('business_outcomes').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('Supabase sync outcome warning:', error.message);
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function syncXpEventToSupabase(event: XpEvent) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from('xp_ledger').insert({
      id: event.id,
      event_type: event.eventType,
      xp_amount: event.xpAmount,
      description: event.description,
      created_at: event.createdAt,
    });
  } catch (err) {
    console.warn('Network sync XP error:', err);
  }
}

// -----------------------------------------------------------------------------
// REALTIME SUBSCRIPTION FOR INSTANT CROSS-DEVICE SYNC
// -----------------------------------------------------------------------------
export function subscribeToRealtimeChanges(onRefresh: () => void) {
  if (!supabase || !isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('falcon-hq-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => {
      onRefresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'scripts' }, () => {
      onRefresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'business_outcomes' }, () => {
      onRefresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'xp_ledger' }, () => {
      onRefresh();
    })
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}
