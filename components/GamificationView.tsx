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
  Target
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
  onAdjustXp: (amount: number, reason: string) => void;
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
  onAdjustXp,
  currentUser,
}: GamificationViewProps) {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');

  const currentLevel = Math.floor(totalXp / 100) + 1;
  const levelProgress = totalXp % 100;

  // Weekly Target Progress (Point 11, Answer A3)
  const targetXp = performance.weeklyTargetXp || 120;
  const targetPercent = Math.min(100, Math.round((totalXp / targetXp) * 100));

  // Estimated Bonus Calculation (Point 11: النقاط تتحول لبونص)
  const estimatedBonusEgp = Math.round((totalXp / 10) * (performance.egpPer10Xp || 15));

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

    const finalAmount = adjustType === 'add' ? Math.abs(adjustAmount) : -Math.abs(adjustAmount);
    onAdjustXp(finalAmount, adjustReason.trim());
    setIsAdjustModalOpen(false);
    setAdjustReason('');
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
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold-light text-gold-dark border border-amber-200 dark:border-amber-900">
              {currentRank.badge} {currentRank.title}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
            نقاط تفاعلية مرتبطة بالتارجت الأسبوعي، ومكافآت بونص حقيقية لأحمد ومعاذ
          </p>
        </div>

        {/* Action Controls: Reset Week / Adjust XP (Points 6 & 8) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sand-100 dark:bg-stone-800 hover:bg-sand-200 dark:hover:bg-stone-700 text-charcoal dark:text-stone-200 text-xs font-bold border border-sand-border dark:border-stone-700 transition-all"
            title="تعديل رصيد النقاط يدوياً"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>تعديل يدوي للنقاط</span>
          </button>

          <button
            onClick={onResetWeeklyXp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-all"
            title="تصفير أسبوع جديد"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير الأسبوع</span>
          </button>
        </div>
      </div>

      {/* Top 3 Interactive Feature Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Weekly Target & Bonus (Points 6, 11) */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50 dark:from-stone-900 dark:to-stone-900/60">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">التارجت الأسبوعي</span>
              <div className="w-8 h-8 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-black text-charcoal dark:text-stone-100 flex items-baseline gap-2">
              <span>{totalXp}</span>
              <span className="text-sm font-bold text-charcoal-muted dark:text-stone-400">/ {targetXp} XP</span>
            </div>
            
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              {targetPercent >= 100 ? '🎉 مبروك! حققتم تارجت الأسبوع' : `${targetXp - totalXp} XP متبقية للوصول للتارجت`}
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

        {/* Card 2: Bonus Pool Conversion (Point 11: حساب البونص) */}
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
              <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">التتابع الإيجابي</span>
              <div className="w-8 h-8 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-falcon-600" />
              </div>
            </div>

            <div className="text-3xl font-black text-charcoal dark:text-stone-100 flex items-center gap-2">
              <span>{streakDays} أيام</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 dark:text-falcon-400 border border-falcon-100 dark:border-falcon-900">
                مستمر 🔥
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

      {/* Team Quests */}
      <div className="bento-card p-6">
        <h3 className="text-base font-bold text-charcoal dark:text-stone-100 mb-4 flex items-center justify-between">
          <span>تحديات ومهمات الأسبوع المشتركة</span>
          <span className="text-xs font-normal text-charcoal-muted dark:text-stone-400">تمنح نقاط إضافية عند إتمامها</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((q) => {
            const p = Math.min(100, Math.round((q.currentCount / q.targetCount) * 100));
            return (
              <div key={q.id} className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-border dark:border-stone-700 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100">{q.title}</h4>
                  <span className="text-xs font-bold text-falcon-600 dark:text-falcon-400 bg-falcon-50 dark:bg-falcon-950/60 px-2 py-0.5 rounded-full">
                    +{q.rewardXp} XP
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-charcoal-muted dark:text-stone-400 mb-1">
                    <span>الإنجاز: {q.currentCount} من {q.targetCount} {q.unit}</span>
                    <span>{p}%</span>
                  </div>
                  <div className="w-full bg-sand-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-falcon-600 h-full rounded-full transition-all duration-500" style={{ width: `${p}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent XP Ledger Table */}
      <div className="bento-card p-6">
        <h3 className="text-base font-bold text-charcoal dark:text-stone-100 mb-4 flex items-center justify-between">
          <span>سجل النقاط الموثق (XP Ledger)</span>
          <span className="text-xs font-normal text-charcoal-muted dark:text-stone-400">توثيق شفاف لكل مهمة وسكريبت</span>
        </h3>

        <div className="divide-y divide-sand-border dark:divide-stone-800">
          {events.map((ev) => (
            <div key={ev.id} className="py-3.5 flex items-center justify-between gap-4">
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

              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl border border-emerald-100 dark:border-emerald-900">
                موثق
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual XP Adjustment Modal (Point 8) */}
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
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adjustType === 'add'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-sand-50 dark:bg-stone-800 text-charcoal dark:text-stone-300 border-sand-border dark:border-stone-700'
                  }`}
                >
                  إضافة نقاط (+)
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
                  خصم نقاط (-)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  كمية النقاط
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
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
                  placeholder="مثال: بونص إضافي لحملة تيك توك ناجحة..."
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
                  className="px-4 py-2 rounded-xl border border-sand-border text-xs font-bold"
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

    </div>
  );
}
