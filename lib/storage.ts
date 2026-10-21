import { Idea, Script, BusinessOutcome, XpEvent, TeamQuest } from './types';
import { getInitialSectionsForFramework } from './frameworks';

const STORAGE_KEYS = {
  IDEAS: 'falcon_ideas_v2',
  SCRIPTS: 'falcon_scripts_v2',
  OUTCOMES: 'falcon_outcomes_v2',
  XP_EVENTS: 'falcon_xp_events_v2',
  STREAK: 'falcon_streak_v2',
};

// Initial realistic seed data for Falcon
const INITIAL_IDEAS: Idea[] = [
  {
    id: 'idea-1',
    title: 'مقارنة اصفرار الجرابات الرخيصة مقابل كفر فالكون الكريستال UV',
    category: 'product',
    status: 'ready_to_film',
    sourceUrl: 'https://instagram.com/reel/example1',
    notes: 'ركز في أول ثانيتين على كفر مصفر شكله مقزز وبعدها وريه كفر فالكون الجديد بصوت كليك الحماية',
    creatorName: 'أنا',
    assigneeName: 'معاذ',
    goalFitScore: 5,
    customerValueScore: 5,
    reachScore: 4,
    easeScore: 4,
    totalPriorityScore: 92.0, // High priority
    scriptIds: ['script-1'],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'idea-2',
    title: 'تحدي رمي الموبايل من الدور الثاني بكفر فالكون ضد الصدمات',
    category: 'marketing',
    status: 'scripting',
    sourceUrl: 'https://tiktok.com/@example/video2',
    notes: 'فيديو تجربة عملية صادمة للشارع المصري لإثبات قوة الجراب الحقيقية',
    creatorName: 'معاذ',
    assigneeName: 'أنا',
    goalFitScore: 4,
    customerValueScore: 4,
    reachScore: 5,
    easeScore: 3,
    totalPriorityScore: 81.0,
    scriptIds: ['script-2'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'idea-3',
    title: 'طباعة صورة تخرج مخصصة مع باركود أغنية سبوتيفاي المفضلة',
    category: 'content',
    status: 'inbox',
    sourceUrl: '',
    notes: 'تريند هدايا التخرج المرتبطة بالأغاني والذكريات',
    creatorName: 'معاذ',
    // Deliberately unrated to test the "Not Rated" guardrail
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_SCRIPTS: Script[] = [
  {
    id: 'script-1',
    ideaId: 'idea-1',
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
    authorName: 'أنا',
    reviewerName: 'معاذ',
    estimatedDurationSeconds: 42,
    wordCount: 92,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_OUTCOMES: BusinessOutcome[] = [
  {
    id: 'out-1',
    scriptId: 'script-1',
    ideaTitle: 'مقارنة اصفرار الجرابات الرخيصة مقابل كفر فالكون',
    publishedUrl: 'https://instagram.com/reel/published1',
    ordersAttributed: 42,
    revenueAttributed: 14700,
    inquiriesCount: 165,
    confidenceLevel: 'high',
    keyLearning: 'الهوك المقارن المباشر في أول ثانيتين رفع معدل التحويل 3 أضعاف مقارنة بالفيديوهات العادية.',
    isWinningPattern: true,
    recordedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

const INITIAL_XP_EVENTS: XpEvent[] = [
  {
    id: 'xp-1',
    eventType: 'idea_created',
    xpAmount: 5,
    description: 'تسجيل فكرة جديدة: مقارنة الاصفرار',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'xp-2',
    eventType: 'script_completed',
    xpAmount: 15,
    description: 'كتابة سكريبت AIDA لفيديو الاصفرار',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'xp-3',
    eventType: 'script_approved',
    xpAmount: 25,
    description: 'اعتماد السكريبت وتجهيزه للتصوير',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'xp-4',
    eventType: 'outcome_recorded',
    xpAmount: 15,
    description: 'تسجيل نتائج حملة الاصفرار (14,700 جنيه إيراد)',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

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

export function getStoredIdeas(): Idea[] {
  if (typeof window === 'undefined') return INITIAL_IDEAS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IDEAS);
    return raw ? JSON.parse(raw) : INITIAL_IDEAS;
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

export function getStoredXpEvents(): XpEvent[] {
  if (typeof window === 'undefined') return INITIAL_XP_EVENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.XP_EVENTS);
    return raw ? JSON.parse(raw) : INITIAL_XP_EVENTS;
  } catch {
    return INITIAL_XP_EVENTS;
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
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.XP_EVENTS, JSON.stringify(updated));
  }
  return newEvent;
}
