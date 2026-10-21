export type IdeaCategory = 'content' | 'marketing' | 'product' | 'sales' | 'bizdev';

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
  status: IdeaStatus;
  sourceUrl?: string;
  notes?: string;
  creatorName: string;
  assigneeName?: string;
  
  // Priority Ratings (1-5)
  goalFitScore?: number;
  customerValueScore?: number;
  reachScore?: number;
  easeScore?: number;
  totalPriorityScore?: number | null; // NULL if unrated
  
  scriptIds?: string[];
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
    | 'outcome_recorded';
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
