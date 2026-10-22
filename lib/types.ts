export type IdeaCategory = 'content' | 'marketing' | 'product' | 'sales' | 'bizdev';

export type IdeaType = 'content' | 'product' | 'problem';

export type IdeaStatus = 
  | 'inbox' 
  | 'evaluating' 
  | 'scripting' 
  | 'action_plan' 
  | 'ready_to_film' 
  | 'published' 
  | 'archived';

export type ScriptFramework = 'AIDA' | 'PASTOR' | 'StoryArc' | 'THEDOC' | 'Freeform';

export type OpenLoopsLevel = 'off' | 'light' | 'full';

export type ScriptStatus = 'draft' | 'writing' | 'review_ready' | 'ready_to_film' | 'published';

export type AttributionConfidence = 'high' | 'medium' | 'low';

export interface Idea {
  id: string;
  title: string;
  category: IdeaCategory;
  ideaType?: IdeaType; // 'content' (محتوى) | 'product' (منتج) | 'problem' (حل مشكلة)
  status: IdeaStatus;
  sourceUrl?: string;
  notes?: string;
  creatorName: string;
  assigneeName?: string;
  voiceNoteBase64?: string;
  voiceNoteDuration?: number;
  
  // Priority Ratings (1-5)
  goalFitScore?: number;
  customerValueScore?: number;
  reachScore?: number;
  easeScore?: number;
  totalPriorityScore?: number | null; // NULL if unrated
  
  scriptIds?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FrameworkSection {
  id: string;
  key: string;
  label: string;
  prompt: string;
  content: string;
}

export interface OpenLoopItem {
  id: string;
  loopHook: string;
  loopPayoff: string;
}

export interface Script {
  id: string;
  ideaId?: string;
  title: string;
  framework: ScriptFramework;
  openLoopsLevel: OpenLoopsLevel;
  sections: FrameworkSection[];
  openLoops: OpenLoopItem[];
  status: ScriptStatus;
  authorName: string;
  reviewerName?: string;
  estimatedDurationSeconds: number;
  wordCount: number;
  lockedBy?: string | null;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessOutcome {
  id: string;
  scriptId: string;
  ideaTitle: string;
  publishedUrl?: string;
  ordersAttributed: number;
  revenueAttributed: number;
  inquiriesCount: number;
  confidenceLevel: AttributionConfidence;
  keyLearning: string;
  isWinningPattern: boolean;
  recordedAt: string;
}

export interface XpEvent {
  id: string;
  eventType: 
    | 'idea_created' 
    | 'idea_rated' 
    | 'script_completed' 
    | 'script_approved' 
    | 'video_filmed' 
    | 'outcome_recorded'
    | 'task_completed'
    | 'manual_adjustment';
  xpAmount: number;
  description: string;
  createdAt: string;
}

export interface TeamQuest {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  unit: string;
}

// -----------------------------------------------------------------------------
// OPERATIONAL TASKS & KANBAN (Points 3, 11, 14)
// -----------------------------------------------------------------------------
export type TaskCategory = 'daily_recurring' | 'project';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface OperationalTask {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  assigneeName: 'أحمد' | 'معاذ' | 'كلاهما';
  priority: 'high' | 'medium' | 'low';
  xpReward: number;
  notes?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  completedAt?: string;
}

// -----------------------------------------------------------------------------
// CHAT SCRATCHPAD & VOICE MEMOS (Points 9, 10 - Chat Style)
// -----------------------------------------------------------------------------
export interface ChatThought {
  id: string;
  sender: 'أحمد' | 'معاذ';
  text?: string;
  audioBase64?: string;
  audioDuration?: number;
  convertedTo?: {
    type: 'idea' | 'task' | 'script';
    title: string;
  };
  createdAt: string;
}

// -----------------------------------------------------------------------------
// PERFORMANCE & BONUS TARGETS (Point 11)
// -----------------------------------------------------------------------------
export interface PerformanceConfig {
  weeklyTargetXp: number;
  egpPer10Xp: number;
  lastResetDate: string;
}
