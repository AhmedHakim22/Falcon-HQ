'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Coins, 
  RotateCcw, 
  Plus, 
  Sliders, 
  X,
  Target,
  Trash2,
  AlertTriangle,
  Edit3
} from 'lucide-react';
import { XpEvent, TeamQuest, PerformanceConfig } from '@/lib/types';

interface GamificationViewProps {
  totalXp: number;
  streakDays: number;
  events: XpEvent[];
  quests: TeamQuest[];
  performance: PerformanceConfig;
  onUpdatePerformance: (conf: PerformanceConfig) => void;
  onResetWeeklyXp: () => void;
  onResetAllGamification?: () => void;
  onAdjustXp: (amount: number, reason: string) => void;
  onSetExactXp?: (exactXp: number, reason: string) => void;
  onDeleteXpEvent?: (eventId: string) => void;
  onUpdateStreak?: (days: number) => void;
  currentUser: string;
}

export function GamificationView({
  totalXp,
  streakDays,
  events,
  quests,
  performance,
  onUpdatePerformance,
  onResetWeeklyXp,
  onResetAllGamification,
  onAdjustXp,
  onSetExactXp,
  onDeleteXpEvent,
  onUpdateStreak,
  currentUser,
}: GamificationViewProps) {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct' | 'set'>('add');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [tempStreak, setTempStreak] = useState<number>(streakDays);

  const currentLevel = Math.max(1, Math.floor(totalXp / 100) + 1);
  const levelProgress = Math.max(0, totalXp % 100);

  // Weekly Target Progress
  const targetXp = performance.weeklyTargetXp || 120;
  const targetPercent = Math.min(100, Math.max(0, Math.round((totalXp / targetXp) * 100)));

  // Estimated Bonus Calculation
  const estimatedBonusEgp = Math.max(0, Math.round((totalXp / 10) * (performance.egpPer10Xp || 15)));

  // Ranks / Titles based on XP
  const ranks = [
    { title: 'مبتدئ فالكون', minXp: 0, badge: '🌱' },
    { title: 'صانع محتوى واعد', minXp: 50, badge: '⭐' },
    { title: 'شريك نمو نشط', minXp: 150, badge: '🔥' },
    { title: 'خبير سكريبتات وأوردرات', minXp: 300, badge: '🏆' },
    { title: 'قائد منظومة فالكون', minXp: 600, badge: '👑' },
  ];
  const currentRank = [...ranks].reverse().find((r) => totalXp >= r.minXp) || ranks[0];

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustReason.trim()) return;

    if (adjustType === 'set' && onSetExactXp) {
      onSetExactXp(Math.max(0, Number(adjustAmount)), adjustReason.trim());
    } else {
      const finalAmount = adjustType === 'add' ? Math.abs(adjustAmount) : -Math.abs(adjustAmount);
      onAdjustXp(finalAmount, adjustReason.trim());
    }

    setIsAdjustModalOpen(false);
    setAdjustReason('');
  };

  const handleStreakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStreak) {
      onUpdateStreak(Math.max(0, Number(tempStreak)));
    }
    setIsStreakModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-sand-border dark:border-stone-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-charcoal dark:text-stone-100">
              منظومة التحفيز والبونص (Gamification)
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
              {currentRank.badge} المستوى {currentLevel} • {currentRank.title}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
            نقاط تفاعلية مرتبطة بالتارجت الأسبوعي، مع إمكانية تعديلها أو تصفيرها في أي وقت
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sand-100 dark:bg-stone-800 hover:bg-sand-200 dark:hover:bg-stone-700 text-charcoal dark:text-stone-200 text-xs font-bold border border-sand-border dark:border-stone-700 transition-all"
            title="تعديل رصيد النقاط أو تعيين رقم محدد"
          >
            <Sliders className="w-3.5 h-3.5 text-falcon-600" />
            <span>تعديل يدوي للنقاط</span>
          </button>

          {onResetAllGamification && (
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-all"
              title="تصفير شامل للعدادات والمستوى والـ XP"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير المستوى والعدادات</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Interactive Feature Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Weekly Target & Bonus */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50 dark:from-stone-900 dark:to-stone-900/60">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">التارجت الأسبوعي (المستوى {currentLevel})</span>
              <div className="w-8 h-8 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-black text-charcoal dark:text-stone-100 flex items-baseline gap-2">
              <span>{totalXp}</span>
              <span className="text-sm font-bold text-charcoal-muted dark:text-stone-400">/ {targetXp} XP</span>
            </div>
            
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              {targetPercent >= 100 ? '🎉 مبروك! تم إنجاز التارجت' : totalXp === 0 ? 'العداد مصفّر جاهز للأسبوع الجديد' : `${targetXp - totalXp} XP متبقية للوصول للتارجت`}
            </p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-charcoal-muted dark:text-stone-400 mb-1.5">
              <span>نسبة إنجاز التارجت</span>
              <span className="text-falcon-600 font-bold">{targetPercent}%</span>
            </div>
            <div className="w-full bg-sand-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-falcon-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${targetPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Bonus Pool Conversion */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50 dark:from-stone-900 dark:to-stone-900/60">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">رصيد البونص التقديري</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-black text-charcoal dark:text-stone-100 flex items-baseline gap-1.5">
              <span>{estimatedBonusEgp.toLocaleString()}</span>
              <span className="text-sm font-bold text-charcoal-muted dark:text-stone-400">ج.م</span>
            </div>

            <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
              معدل التحويل: {performance.egpPer10Xp || 15} جنيه لكل 10 نقاط إنجاز
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-sand-border dark:border-stone-800 text-xs text-charcoal dark:text-stone-300 flex items-center justify-between">
            <span>توزيع البونص:</span>
            <span className="font-bold text-falcon-600 dark:text-falcon-400">مناصفة بين أحمد ومعاذ 🤝</span>
          </div>
        </div>

        {/* Card 3: Streak & Dopamine Guardrail */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50 dark:from-stone-900 dark:to-stone-900/60">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">التتابع الإيجابي (الستريك)</span>
              <div className="flex items-center gap-1">
                {onUpdateStreak && (
                  <button
                    onClick={() => {
                      setTempStreak(streakDays);
                      setIsStreakModalOpen(true);
                    }}
                    className="p-1 rounded-lg hover:bg-sand-100 dark:hover:bg-stone-800 text-charcoal-muted hover:text-charcoal dark:text-stone-400"
                    title="تعديل أيام الستريك"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="w-8 h-8 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-falcon-600" />
                </div>
              </div>
            </div>

            <div className="text-3xl font-black text-charcoal dark:text-stone-100 flex items-center gap-2">
              <span>{streakDays} أيام</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 dark:text-falcon-400 border border-falcon-100 dark:border-falcon-900">
                {streakDays > 0 ? 'مستمر 🔥' : 'مصفّر'}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
              مبني على أبحاث الدوبامين الإيجابي بدون أي ضغط نفسي
            </p>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>حماية العطلات مفعلة: يوم الراحة لا يكسر العداد</span>
          </div>
        </div>

      </div>

      {/* Transparent XP Ledger Table */}
      <div className="bento-card p-6">
        <h3 className="text-base font-bold text-charcoal dark:text-stone-100 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>سجل النقاط الموثق (XP Ledger)</span>
            <span className="text-xs font-normal text-charcoal-muted dark:text-stone-400">({events.length} حركات موثقة)</span>
          </div>
          {events.length > 0 && (
            <span className="text-xs text-charcoal-muted dark:text-stone-400">
              يمكنك مسح أي عملية كُتبت بالخطأ
            </span>
          )}
        </h3>

        {events.length === 0 ? (
          <div className="p-8 text-center text-xs text-charcoal-muted dark:text-stone-400 bg-sand-50 dark:bg-stone-800/40 rounded-2xl border border-sand-border dark:border-stone-800">
            سجل النقاط مصفّر بالكامل حالياً. ستظهر هنا النقاط المكتسبة فور إنشاء سكريبتات، تسجيل أفكار، أو إنجاز مهام.
          </div>
        ) : (
          <div className="divide-y divide-sand-border dark:divide-stone-800">
            {events.map((ev) => (
              <div key={ev.id} className="py-3.5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    ev.xpAmount >= 0 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                  }`}>
                    {ev.xpAmount >= 0 ? `+${ev.xpAmount}` : ev.xpAmount}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100">{ev.description}</p>
                    <span className="text-[10px] text-charcoal-muted dark:text-stone-400">
                      {new Date(ev.createdAt).toLocaleString('ar-EG')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    موثق
                  </span>

                  {onDeleteXpEvent && (
                    <button
                      onClick={() => onDeleteXpEvent(ev.id)}
                      className="p-1 rounded-lg text-charcoal-muted hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      title="مسح هذه الحركة من السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual XP Adjustment Modal (إضافة / خصم / تعيين رقم محدد) */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-stone-900 border border-sand-border dark:border-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-sand-border dark:border-stone-800 mb-4">
              <h3 className="text-base font-bold text-charcoal dark:text-stone-100">
                تعديل رصيد النقاط يدوياً
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adjustType === 'add'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-sand-50 dark:bg-stone-800 text-charcoal dark:text-stone-300 border-sand-border dark:border-stone-700'
                  }`}
                >
                  إضافة (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('deduct')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adjustType === 'deduct'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-sand-50 dark:bg-stone-800 text-charcoal dark:text-stone-300 border-sand-border dark:border-stone-700'
                  }`}
                >
                  خصم (-)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('set')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adjustType === 'set'
                      ? 'bg-falcon-600 text-white border-falcon-600 shadow-xs'
                      : 'bg-sand-50 dark:bg-stone-800 text-charcoal dark:text-stone-300 border-sand-border dark:border-stone-700'
                  }`}
                >
                  تعيين رقم (=)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  {adjustType === 'set' ? 'الرصيد الجديد المطلوب تماماً' : 'كمية النقاط'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  سبب التعديل *
                </label>
                <input
                  type="text"
                  placeholder="مثال: تصحيح رصيد، بونص إضافي، تعديل خطأ كتابي..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-border dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-bold text-charcoal dark:text-stone-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-md"
                >
                  تأكيد التعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Streak Editor Modal */}
      {isStreakModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-stone-900 border border-sand-border dark:border-stone-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sand-border dark:border-stone-800 mb-3">
              <h3 className="text-base font-bold text-charcoal dark:text-stone-100">
                تعديل عداد الأيام (Streak)
              </h3>
              <button
                onClick={() => setIsStreakModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStreakSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  عدد الأيام المتتالية
                </label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={tempStreak}
                  onChange={(e) => setTempStreak(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-base font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStreakModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-bold text-charcoal dark:text-stone-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-md"
                >
                  حفظ الأيام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 p-6 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal dark:text-stone-100">
                تصفير شامل للعدادات والمستوى؟
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
                سيتم مسح سجل النقاط وإعادة المستوى إلى 1 ورصيد الـ XP إلى (0)، وتصفير الستريك للبدء من جديد تماماً.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-bold text-charcoal dark:text-stone-300"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onResetAllGamification) {
                    onResetAllGamification();
                  }
                  setIsResetConfirmOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                تأكيد التصفير
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
