import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Idea, Script, BusinessOutcome, XpEvent } from './types';

export async function syncIdeaToSupabase(idea: Idea) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('ideas').upsert({
      id: idea.id.startsWith('idea_') ? undefined : idea.id,
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
    });
    if (error) console.warn('Supabase sync idea warning:', error.message);
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function syncScriptToSupabase(script: Script) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('scripts').upsert({
      id: script.id.startsWith('script_') ? undefined : script.id,
      idea_id: script.ideaId && !script.ideaId.startsWith('idea_') ? script.ideaId : null,
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
    });
    if (error) console.warn('Supabase sync script warning:', error.message);
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}

export async function syncOutcomeToSupabase(outcome: BusinessOutcome) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('business_outcomes').upsert({
      id: outcome.id.startsWith('out_') ? undefined : outcome.id,
      idea_title: outcome.ideaTitle,
      published_url: outcome.publishedUrl || null,
      orders_attributed: outcome.ordersAttributed,
      revenue_attributed: outcome.revenueAttributed,
      inquiries_count: outcome.inquiriesCount,
      confidence_level: outcome.confidenceLevel,
      key_learning: outcome.keyLearning,
      is_winning_pattern: outcome.isWinningPattern,
    });
    if (error) console.warn('Supabase sync outcome warning:', error.message);
  } catch (err) {
    console.warn('Network sync paused (using local buffer):', err);
  }
}
