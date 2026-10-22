import { 
  Idea, 
  Script, 
  BusinessOutcome, 
  XpEvent, 
  TeamQuest, 
  OperationalTask, 
  ChatThought, 
  PerformanceConfig,
  resolveIdeaType,
  resolveDbCategory
} from './types';
import { getInitialSectionsForFramework } from './frameworks';

const STORAGE_KEYS = {
  IDEAS: 'falcon_ideas_v5',
  SCRIPTS: 'falcon_scripts_v5',
  OUTCOMES: 'falcon_outcomes_v5',
  XP_EVENTS: 'falcon_xp_events_v5',
  STREAK: 'falcon_streak_v5',
  ACTIVE_USER: 'falcon_active_user_v1',
  TASKS: 'falcon_tasks_v1',
  CHAT_THOUGHTS: 'falcon_chat_thoughts_v1',
  THEME: 'falcon_theme_v1',
  PERFORMANCE: 'falcon_performance_v1',
};

// Initial Ideas with Types
const INITIAL_IDEAS: Idea[] = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    title: 'مقارنة اصفرار الجرابات الرخيصة مقابل كفر فالكون الكريستال UV',
    category: 'product',
    ideaType: 'product',
    status: 'ready_to_film',
    sourceUrl: 'https://instagram.com/reel/example1',
    notes: 'ركز في أول ثانيتين على كفر مصفر شكله مقزز وبعدها وريه كفر فالكون الجديد بصوت كليك الحماية',
    creatorName: 'أحمد',
    assigneeName: 'معاذ',
    goalFitScore: 5,
    customerValueScore: 5,
    reachScore: 4,
    easeScore: 4,
    totalPriorityScore: 92.0,
    scriptIds: ['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    title: 'تحدي رمي الموبايل من الدور الثاني بكفر فالكون ضد الصدمات',
    category: 'marketing',
    ideaType: 'content',
    status: 'scripting',
    sourceUrl: 'https://tiktok.com/@example/video2',
    notes: 'فيديو تجربة عملية صادمة للشارع المصري لإثبات قوة الجراب الحقيقية',
    creatorName: 'معاذ',
    assigneeName: 'أحمد',
    goalFitScore: 4,
    customerValueScore: 4,
    reachScore: 5,
    easeScore: 3,
    totalPriorityScore: 81.0,
    scriptIds: ['bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    title: 'حل مشكلة بطء تجهيز بوليصة شحن المحافظات الصعيدية بتعاقد شاحن جديد',
    category: 'bizdev',
    ideaType: 'problem',
    status: 'inbox',
    sourceUrl: '',
    notes: 'تأخير شحن الصعيد بيعمل استرجاع عالي، محتاجين نربط مع شركة أسرع',
    creatorName: 'معاذ',
    assigneeName: 'أحمد',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_SCRIPTS: Script[] = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    ideaId: '11111111-1111-4111-a111-111111111111',
    title: 'مقارنة الاصفرار الصادمة - سكريبت AIDA',
    framework: 'AIDA',
    openLoopsLevel: 'light',
    sections: [
      {
        id: 'sec-1',
        key: 'attention',
        label: 'الانتباه (الهوك)',
        prompt: 'أول 3 ثواني توقف السكرول',
        content: 'في سر معظم محلات الموبايل بتخبيه عليك عن سبب اصفرار الجراب الشفاف بعد أسبوعين بالظبط!',
      },
      {
        id: 'sec-2',
        key: 'interest',
        label: 'الاهتمام',
        prompt: 'شرح المشكلة الشائعة',
        content: 'الجراب السيليكون العادي بيتأكسد مع عرق الإيد والشمس ويتحول للون أصفر مستحيل ينضف مهما غسلته.',
      },
      {
        id: 'sec-3',
        key: 'desire',
        label: 'الرغبة',
        prompt: 'إظهار الحل الفاخر من فالكون',
        content: 'علشان كدة فالكون عملت كفر الكريستال المعالج بطبقة UV ألمانية بتمنع الأكسدة وبتحافظ على نقاء شفافيته مع حماية ممتصة للصدمات.',
      },
      {
        id: 'sec-4',
        key: 'action',
        label: 'الإجراء (CTA)',
        prompt: 'الطلب بخصم محدد',
        content: 'اطلب جرابك دلوقتي من اللينك في البايو بخصم 15% وشحن مجاني لأي مكان في مصر.',
      },
    ],
    openLoops: [
      {
        id: 'loop-1',
        loopHook: 'هقولك في آخر الفيديو على التست البسيط اللي تكشف بيه أي جراب مغشوش في ثانية!',
        loopPayoff: 'التست: قرب فلاش الكاميرا من حواف الجراب؛ لو الضوء اتشتت بصفار يبقى مش UV أصلي!',
      },
    ],
    status: 'ready_to_film',
    authorName: 'أحمد',
    reviewerName: 'معاذ',
    estimatedDurationSeconds: 42,
    wordCount: 92,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_OUTCOMES: BusinessOutcome[] = [];

const INITIAL_XP_EVENTS: XpEvent[] = [];

export const INITIAL_TEAM_QUESTS: TeamQuest[] = [
  {
    id: 'quest-1',
    title: 'تجهيز 3 سكريبتات جاهزة للتصوير',
    targetCount: 3,
    currentCount: 2,
    rewardXp: 50,
    unit: 'سكريبتات',
  },
  {
    id: 'quest-2',
    title: 'تسجيل نتائج بيع لـ 2 فيديوهات منشورة',
    targetCount: 2,
    currentCount: 1,
    rewardXp: 40,
    unit: 'نتائج',
  },
];

// Initial Tasks (Points 3, 11, 14)
export const INITIAL_TASKS: OperationalTask[] = [
  {
    id: 'task-1',
    title: 'مراجعة وتأكيد أوردرات المطبعة والتصاميم المخصصة',
    category: 'daily_recurring',
    status: 'in_progress',
    assigneeName: 'معاذ',
    priority: 'high',
    xpReward: 15,
    notes: 'التأكد من كواليتي درجات الألوان وتجفيف الحبر قبل الشحن',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'رفع وتجهيز بوالص شحن الأوردرات اليومية لشركة الشحن',
    category: 'daily_recurring',
    status: 'todo',
    assigneeName: 'أحمد',
    priority: 'high',
    xpReward: 15,
    notes: 'فرز أوردرات القاهرة والجيزة عن محافظات الصعيد والدلتا',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'تجهيز خامات كفرات الكريستال UV لاختبار التصوير',
    category: 'project',
    status: 'done',
    assigneeName: 'كلاهما',
    priority: 'medium',
    xpReward: 20,
    notes: 'اختبار الإضاءة تحت فلاش الكاميرا لإبراز نقاء الشفافية',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'تصوير فيديو ريلز المقارنة مع معاذ في الاستوديو',
    category: 'project',
    status: 'todo',
    assigneeName: 'معاذ',
    priority: 'high',
    xpReward: 30,
    notes: 'تحضير الكفر المصفر القديم كعنصر صدمة في أول ثانيتين',
    createdAt: new Date().toISOString(),
  },
];

// Initial Chat Thoughts (Points 9, 10 - Chat Style)
export const INITIAL_CHAT_THOUGHTS: ChatThought[] = [
  {
    id: 'thought-1',
    sender: 'معاذ',
    text: 'يا أحمد ايه رأيك نعمل كفر لطلاب طب وهندسة عليه رسومات تشريحية أو معادلات بأسلوب مينيمال شيك جداً؟',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'thought-2',
    sender: 'أحمد',
    text: 'فكرة ممتازة يا معاذ! ممكن نعملها كوليكشن تخرج كامل مع بوكس الهدايا بتاعنا.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// -----------------------------------------------------------------------------
// GETTERS & SETTERS
// -----------------------------------------------------------------------------
export function getStoredIdeas(): Idea[] {
  if (typeof window === 'undefined') return INITIAL_IDEAS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (!raw) return INITIAL_IDEAS;
    const list: Idea[] = JSON.parse(raw);
    return list.map((idea) => ({
      ...idea,
      ideaType: resolveIdeaType(idea),
      category: resolveDbCategory(idea),
    }));
  } catch {
    return INITIAL_IDEAS;
  }
}

export function saveStoredIdeas(ideas: Idea[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
  } catch (err) {
    console.error('Failed to save ideas to LocalStorage:', err);
  }
}

export function getStoredScripts(): Script[] {
  if (typeof window === 'undefined') return INITIAL_SCRIPTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCRIPTS);
    return raw ? JSON.parse(raw) : INITIAL_SCRIPTS;
  } catch {
    return INITIAL_SCRIPTS;
  }
}

export function saveStoredScripts(scripts: Script[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(scripts));
  } catch (err) {
    console.error('Failed to save scripts to LocalStorage:', err);
  }
}

export function getStoredOutcomes(): BusinessOutcome[] {
  if (typeof window === 'undefined') return INITIAL_OUTCOMES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OUTCOMES);
    return raw ? JSON.parse(raw) : INITIAL_OUTCOMES;
  } catch {
    return INITIAL_OUTCOMES;
  }
}

export function saveStoredOutcomes(outcomes: BusinessOutcome[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.OUTCOMES, JSON.stringify(outcomes));
  } catch (err) {
    console.error('Failed to save outcomes to LocalStorage:', err);
  }
}

export function clearStoredOutcomes(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.OUTCOMES);
  } catch (err) {
    console.error('Failed to clear outcomes from LocalStorage:', err);
  }
}

export function getStoredStreak(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    return raw !== null ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function saveStoredStreak(days: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STREAK, String(days));
  } catch (err) {
    console.error('Failed to save streak to LocalStorage:', err);
  }
}

export function getStoredXpEvents(): XpEvent[] {
  if (typeof window === 'undefined') return INITIAL_XP_EVENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.XP_EVENTS);
    return raw ? JSON.parse(raw) : INITIAL_XP_EVENTS;
  } catch {
    return INITIAL_XP_EVENTS;
  }
}

export function saveStoredXpEvents(events: XpEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.XP_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save XP events:', err);
  }
}

export function clearStoredXpEvents(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.XP_EVENTS);
  } catch (err) {
    console.error('Failed to clear XP events from LocalStorage:', err);
  }
}

export function addXpEvent(event: Omit<XpEvent, 'id' | 'createdAt'>): XpEvent {
  const newEvent: XpEvent = {
    ...event,
    id: `xp_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const list = getStoredXpEvents();
  const updated = [newEvent, ...list];
  saveStoredXpEvents(updated);
  return newEvent;
}

export function getStoredActiveUser(): string {
  if (typeof window === 'undefined') return 'أحمد';
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return raw && (raw === 'أحمد' || raw === 'معاذ') ? raw : 'أحمد';
  } catch {
    return 'أحمد';
  }
}

export function saveStoredActiveUser(user: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, user);
  } catch (err) {
    console.error('Failed to save active user:', err);
  }
}

export function getStoredTasks(): OperationalTask[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: OperationalTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
}

export function getStoredChatThoughts(): ChatThought[] {
  if (typeof window === 'undefined') return INITIAL_CHAT_THOUGHTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_THOUGHTS);
    return raw ? JSON.parse(raw) : INITIAL_CHAT_THOUGHTS;
  } catch {
    return INITIAL_CHAT_THOUGHTS;
  }
}

export function saveStoredChatThoughts(thoughts: ChatThought[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_THOUGHTS, JSON.stringify(thoughts));
  } catch (err) {
    console.error('Failed to save chat thoughts:', err);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
}

export function getStoredPerformance(): PerformanceConfig {
  const defaultConf: PerformanceConfig = {
    weeklyTargetXp: 120,
    egpPer10Xp: 20, // 20 EGP per 10 XP
    lastResetDate: new Date().toISOString(),
  };
  if (typeof window === 'undefined') return defaultConf;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PERFORMANCE);
    return raw ? JSON.parse(raw) : defaultConf;
  } catch {
    return defaultConf;
  }
}

export function saveStoredPerformance(conf: PerformanceConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PERFORMANCE, JSON.stringify(conf));
  } catch (err) {
    console.error('Failed to save performance config:', err);
  }
}

// -----------------------------------------------------------------------------
// BACKUP EXPORT & IMPORT (Point 13 - Phone & PC download)
// -----------------------------------------------------------------------------
export function downloadBackupJSON() {
  if (typeof window === 'undefined') return;
  const backupData = {
    version: '2.0',
    brand: 'FALCON HQ',
    exportedAt: new Date().toISOString(),
    data: {
      ideas: getStoredIdeas(),
      scripts: getStoredScripts(),
      outcomes: getStoredOutcomes(),
      tasks: getStoredTasks(),
      xpEvents: getStoredXpEvents(),
      chatThoughts: getStoredChatThoughts(),
      performance: getStoredPerformance(),
    },
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];

  const a = document.createElement('a');
  a.href = url;
  a.download = `falcon-hq-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function restoreBackupJSON(jsonData: any): boolean {
  try {
    if (!jsonData || !jsonData.data) return false;
    const { data } = jsonData;
    if (data.ideas) saveStoredIdeas(data.ideas);
    if (data.scripts) saveStoredScripts(data.scripts);
    if (data.outcomes) saveStoredOutcomes(data.outcomes);
    if (data.tasks) saveStoredTasks(data.tasks);
    if (data.xpEvents) saveStoredXpEvents(data.xpEvents);
    if (data.chatThoughts) saveStoredChatThoughts(data.chatThoughts);
    if (data.performance) saveStoredPerformance(data.performance);
    return true;
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return false;
  }
}
