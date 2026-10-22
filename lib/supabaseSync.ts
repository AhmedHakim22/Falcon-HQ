import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  Idea, 
  Script, 
  BusinessOutcome, 
  XpEvent, 
  ChatThought, 
  OperationalTask, 
  resolveIdeaType, 
  resolveDbCategory 
} from './types';

// System storage rows in scripts table for zero-latency resilient sync
export const SYSTEM_CHAT_ID = '00000000-0000-4000-8000-000000000001';
export const SYSTEM_TASKS_ID = '00000000-0000-4000-8000-000000000002';

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
// REALTIME CHANNEL & BROADCAST (Zero-config instant peer-to-peer sync)
// -----------------------------------------------------------------------------
let activeChannel: any = null;

export function broadcastDataChange(entity: string) {
  try {
    if (activeChannel) {
      activeChannel.send({
        type: 'broadcast',
        event: 'falcon_data_change',
        payload: { entity, timestamp: Date.now() },
      });
    }
  } catch (err) {
    console.warn('[Supabase Broadcast] Send warning:', err);
  }
}

export function broadcastChatMessage(thought: ChatThought) {
  try {
    if (activeChannel) {
      // Realtime payload safeguard:
      // If voice base64 string is large (> 100KB), omit audio data to prevent websocket frame drop
      const isLargeAudio = Boolean(thought.audioBase64 && thought.audioBase64.length > 100000);
      const broadcastThought = isLargeAudio 
        ? { ...thought, audioBase64: undefined }
        : thought;

      activeChannel.send({
        type: 'broadcast',
        event: 'falcon_chat_msg',
        payload: {
          thought: broadcastThought,
          needsFetch: isLargeAudio,
          timestamp: Date.now(),
        },
      });
    }
  } catch (err) {
    console.warn('[Supabase Broadcast] Chat send warning:', err);
  }
}

// -----------------------------------------------------------------------------
// FETCH ALL DATA FROM SUPABASE (Independent resilient fetching)
// -----------------------------------------------------------------------------
export async function fetchRemoteData(): Promise<{
  ideas: Idea[] | null;
  scripts: Script[] | null;
  outcomes: BusinessOutcome[] | null;
  xpEvents: XpEvent[] | null;
  chatThoughts: ChatThought[] | null;
  tasks: OperationalTask[] | null;
}> {
  if (!supabase || !isSupabaseConfigured) {
    return { ideas: null, scripts: null, outcomes: null, xpEvents: null, chatThoughts: null, tasks: null };
  }

  try {
    const [ideasRes, scriptsRes, outcomesRes, xpRes, chatRes, tasksRes] = await Promise.allSettled([
      supabase.from('ideas').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
      supabase.from('scripts').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
      supabase.from('business_outcomes').select('*').order('created_at', { ascending: false }),
      supabase.from('xp_ledger').select('*').order('created_at', { ascending: false }),
      supabase.from('scripts').select('content_json').eq('id', SYSTEM_CHAT_ID).maybeSingle(),
      supabase.from('scripts').select('content_json').eq('id', SYSTEM_TASKS_ID).maybeSingle(),
    ]);

    let ideas: Idea[] | null = null;
    let scripts: Script[] | null = null;
    let outcomes: BusinessOutcome[] | null = null;
    let xpEvents: XpEvent[] | null = null;
    let chatThoughts: ChatThought[] | null = null;
    let tasks: OperationalTask[] | null = null;

    if (ideasRes.status === 'fulfilled' && !ideasRes.value.error && ideasRes.value.data) {
      ideas = ideasRes.value.data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        ideaType: resolveIdeaType({ category: row.category }),
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
    }

    if (scriptsRes.status === 'fulfilled' && !scriptsRes.value.error && scriptsRes.value.data) {
      scripts = scriptsRes.value.data
        .filter((row: any) => row.id !== SYSTEM_CHAT_ID && row.id !== SYSTEM_TASKS_ID && !row.title?.startsWith('__falcon_system_'))
        .map((row: any) => ({
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
    }

    if (outcomesRes.status === 'fulfilled' && !outcomesRes.value.error && outcomesRes.value.data) {
      outcomes = outcomesRes.value.data.map((row: any) => ({
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
    }

    if (xpRes.status === 'fulfilled' && !xpRes.value.error && xpRes.value.data) {
      xpEvents = xpRes.value.data.map((row: any) => ({
        id: row.id,
        eventType: row.event_type,
        xpAmount: row.xp_amount,
        description: row.description,
        createdAt: row.created_at,
      }));
    }

    if (chatRes.status === 'fulfilled' && !chatRes.value.error && chatRes.value.data) {
      const parsed = chatRes.value.data.content_json;
      if (Array.isArray(parsed)) {
        chatThoughts = parsed as ChatThought[];
      }
    }

    if (tasksRes.status === 'fulfilled' && !tasksRes.value.error && tasksRes.value.data) {
      const parsed = tasksRes.value.data.content_json;
      if (Array.isArray(parsed)) {
        tasks = parsed as OperationalTask[];
      }
    }

    return { ideas, scripts, outcomes, xpEvents, chatThoughts, tasks };
  } catch (err) {
    console.error('Remote fetch error:', err);
    return { ideas: null, scripts: null, outcomes: null, xpEvents: null, chatThoughts: null, tasks: null };
  }
}

// -----------------------------------------------------------------------------
// SYNC OPERATIONS (Upsert + Broadcast)
// -----------------------------------------------------------------------------
export async function syncIdeaToSupabase(idea: Idea) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const dbCategory = resolveDbCategory(idea);
    const payload = {
      id: idea.id,
      title: idea.title,
      category: dbCategory,
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
    if (error) {
      console.warn('Supabase sync idea warning:', error.message);
    } else {
      broadcastDataChange('ideas');
    }
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function deleteIdeaFromSupabase(ideaId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('ideas').update({ is_deleted: true }).eq('id', ideaId);
    if (!error) {
      broadcastDataChange('ideas');
    }
  } catch (err) {
    console.warn('Delete idea sync error:', err);
  }
}

export async function restoreIdeaInSupabase(ideaId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('ideas').update({ is_deleted: false }).eq('id', ideaId);
    if (!error) {
      broadcastDataChange('ideas');
    }
  } catch (err) {
    console.warn('Restore idea sync error:', err);
  }
}

export async function purgeIdeaPermanentlyFromSupabase(ideaId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('ideas').delete().eq('id', ideaId);
    if (!error) {
      broadcastDataChange('ideas');
    }
  } catch (err) {
    console.warn('Purge idea error:', err);
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
      is_deleted: script.isDeleted ?? false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('scripts').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase sync script warning:', error.message);
    } else {
      broadcastDataChange('scripts');
    }
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function deleteScriptFromSupabase(scriptId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('scripts').update({ is_deleted: true }).eq('id', scriptId);
    if (!error) {
      broadcastDataChange('scripts');
    }
  } catch (err) {
    console.warn('Delete script sync error:', err);
  }
}

export async function restoreScriptInSupabase(scriptId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('scripts').update({ is_deleted: false }).eq('id', scriptId);
    if (!error) {
      broadcastDataChange('scripts');
    }
  } catch (err) {
    console.warn('Restore script sync error:', err);
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
    if (error) {
      console.warn('Supabase sync outcome warning:', error.message);
    } else {
      broadcastDataChange('business_outcomes');
    }
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function deleteOutcomeFromSupabase(outcomeId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('business_outcomes').delete().eq('id', outcomeId);
    if (!error) {
      broadcastDataChange('business_outcomes');
    }
  } catch (err) {
    console.warn('Delete outcome error:', err);
  }
}

export async function clearAllOutcomesFromSupabase() {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('business_outcomes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (!error) {
      broadcastDataChange('business_outcomes');
    }
  } catch (err) {
    console.warn('Clear all outcomes error:', err);
  }
}

export async function syncXpEventToSupabase(event: XpEvent) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('xp_ledger').insert({
      id: event.id,
      event_type: event.eventType,
      xp_amount: event.xpAmount,
      description: event.description,
      created_at: event.createdAt,
    });
    if (!error) {
      broadcastDataChange('xp_ledger');
    }
  } catch (err) {
    console.warn('Network sync XP error:', err);
  }
}

export async function deleteXpEventFromSupabase(eventId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('xp_ledger').delete().eq('id', eventId);
    if (!error) {
      broadcastDataChange('xp_ledger');
    }
  } catch (err) {
    console.warn('Delete XP event error:', err);
  }
}

export async function clearAllXpEventsFromSupabase() {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('xp_ledger').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (!error) {
      broadcastDataChange('xp_ledger');
    }
  } catch (err) {
    console.warn('Clear all XP events error:', err);
  }
}

// -----------------------------------------------------------------------------
// CHAT & TASKS SYSTEM PERSISTENCE (Synced to Supabase system scripts)
// -----------------------------------------------------------------------------
export async function syncChatThoughtsToSupabase(thoughts: ChatThought[]) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: SYSTEM_CHAT_ID,
      title: '__falcon_system_chat__',
      framework: 'AIDA',
      open_loops_level: 'off',
      content_json: thoughts,
      open_loops_json: [],
      status: 'writing',
      author_name: 'system',
      is_deleted: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('scripts').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase sync chat warning:', error.message);
    }
  } catch (err) {
    console.warn('Network sync chat paused:', err);
  }
}

export async function syncTasksToSupabase(tasks: OperationalTask[]) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: SYSTEM_TASKS_ID,
      title: '__falcon_system_tasks__',
      framework: 'AIDA',
      open_loops_level: 'off',
      content_json: tasks,
      open_loops_json: [],
      status: 'writing',
      author_name: 'system',
      is_deleted: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('scripts').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase sync tasks warning:', error.message);
    } else {
      broadcastDataChange('tasks');
    }
  } catch (err) {
    console.warn('Network sync tasks paused:', err);
  }
}

// -----------------------------------------------------------------------------
// REALTIME SUBSCRIPTION FOR INSTANT CROSS-DEVICE SYNC
// -----------------------------------------------------------------------------
export function subscribeToRealtimeChanges(
  onRefresh: () => void,
  onNewChatMessage?: (thought: ChatThought, needsFetch?: boolean) => void
) {
  if (!supabase || !isSupabaseConfigured) return () => {};

  try {
    if (activeChannel && supabase) {
      try {
        supabase.removeChannel(activeChannel);
      } catch (e) {
        // ignore
      }
      activeChannel = null;
    }

    const channel = supabase.channel('falcon-hq-sync-v1', {
      config: {
        broadcast: { self: false },
      },
    });

    // 1. Attach general broadcast listener BEFORE subscribe()
    channel.on('broadcast', { event: 'falcon_data_change' }, (eventPayload: any) => {
      console.log('[Realtime] Peer updated:', eventPayload?.payload?.entity);
      onRefresh();
    });

    // 2. Attach instant chat message broadcast listener
    channel.on('broadcast', { event: 'falcon_chat_msg' }, (eventPayload: any) => {
      console.log('[Realtime] Peer chat message received');
      const thought = eventPayload?.payload?.thought;
      const needsFetch = eventPayload?.payload?.needsFetch;
      if (onNewChatMessage && thought) {
        onNewChatMessage(thought, needsFetch);
      } else {
        onRefresh();
      }
    });

    // 3. Attach Postgres CDC listeners BEFORE subscribe()
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => {
        console.log('[Realtime] Postgres change on ideas');
        onRefresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scripts' }, () => {
        console.log('[Realtime] Postgres change on scripts');
        onRefresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'business_outcomes' }, () => {
        console.log('[Realtime] Postgres change on business_outcomes');
        onRefresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'xp_ledger' }, () => {
        console.log('[Realtime] Postgres change on xp_ledger');
        onRefresh();
      });

    // 4. ONLY call subscribe() AFTER all handlers are attached!
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Supabase Realtime] Connected to live sync channel');
      }
    });

    activeChannel = channel;

    return () => {
      try {
        if (activeChannel && supabase) {
          supabase.removeChannel(activeChannel);
          activeChannel = null;
        }
      } catch (e) {
        // Safe cleanup
      }
    };
  } catch (err) {
    console.error('[Supabase Realtime] Setup error:', err);
    return () => {};
  }
}
