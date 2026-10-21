'use client';

import React from 'react';
import { 
  Plus, 
  ArrowLeft, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  Lightbulb, 
  FileText, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ShoppingBag,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { Idea, Script, BusinessOutcome, TeamQuest } from '@/lib/types';

interface BentoGridHomeProps {
  ideas: Idea[];
  scripts: Script[];
  outcomes: BusinessOutcome[];
  quests: TeamQuest[];
  onOpenQuickCapture: () => void;
  onNavigateToTab: (tab: 'ideas' | 'scripts' | 'results' | 'gamification') => void;
  onSelectScript: (script: Script) => void;
  onSelectIdea: (idea: Idea) => void;
  currentUser: string;
}

export function BentoGridHome({
  ideas,
  scripts,
  outcomes,
  quests,
  onOpenQuickCapture,
  onNavigateToTab,
  onSelectScript,
  onSelectIdea,
  currentUser,
}: BentoGridHomeProps) {
  const readyScripts = scripts.filter((s) => s.status === 'ready_to_film');
  const highPriorityIdeas = ideas.filter((i) => (i.totalPriorityScore ?? 0) >= 80);
  const totalAttributedRevenue = outcomes.reduce((acc, o) => acc + o.revenueAttributed, 0);
  const totalAttributedOrders = outcomes.reduce((acc, o) => acc + o.ordersAttributed, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* =========================================================================
          ROW 1: HERO BENTO (Big Bold Title + Floating Stat Card)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Main Hero Card (Spans 2 cols) */}
        <div className="lg:col-span-2 bento-card p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[340px]">
          {/* Subtle warm decorative gradient glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-falcon-100/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gold-light/40 blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-falcon-50 border border-falcon-100 text-falcon-600 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مساحة فالكون التشغيلية • إصدار 1.0</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-charcoal tracking-tight leading-tight sm:leading-none">
              أفكارك هي اللي <span className="text-falcon-600 underline decoration-falcon-100 decoration-wavy">بتبيع</span>.
            </h1>
            
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-charcoal-muted max-w-xl leading-relaxed">
              مكان واحد سريع ومخصص لتوثيق أفكار المحتوى، صياغة سكريبتات ريلز وتيك توك بمدارس الإقناع، ومتابعة مبيعات الجرابات الفعلية بدون تشتت نوشن.
            </p>
          </div>

          <div className="mt-6 pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuickCapture}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white font-bold text-sm shadow-lg shadow-falcon-600/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>سجل فكرة جديدة في ثانية</span>
            </button>

            <button
              onClick={() => onNavigateToTab('scripts')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-sand-50 hover:bg-sand-200 border border-sand-border text-charcoal font-semibold text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-falcon-600" />
              <span>افتح استوديو السكريبتات</span>
            </button>
          </div>
        </div>

        {/* Floating Stat Bento Card: Attributed Sales & Orders */}
        <div className="bento-card p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal-muted">المبيعات المنسوبة للمحتوى</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
                {totalAttributedRevenue.toLocaleString()} <span className="text-sm font-bold text-charcoal-muted">ج.م</span>
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{totalAttributedOrders} طلب جراب مؤكد حتى الآن</span>
              </p>
            </div>
          </div>

          {/* Micro sparkline illustration */}
          <div className="my-4 py-3 px-3 bg-white rounded-2xl border border-sand-border">
            <div className="flex items-end justify-between gap-1 h-12 pt-2">
              {[35, 55, 40, 70, 60, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={`w-full rounded-t-md transition-all ${
                      i === 6 ? 'bg-falcon-600' : 'bg-sand-300'
                    }`} 
                    style={{ height: `${h}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-charcoal-muted mt-1.5 px-0.5">
              <span>الأسبوع 1</span>
              <span>الأسبوع الحالي</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('results')}
            className="w-full flex items-center justify-between text-xs font-bold text-falcon-600 hover:text-falcon-700 py-1 transition-colors"
          >
            <span>سجل نتائج الفيديوهات المنشورة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          ROW 2: THREE KEY BENTO FEATURE PILLARS
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Card 1: Ready to Film Queue */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-falcon-50 text-falcon-600 flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-falcon-50 text-falcon-600 border border-falcon-100">
                {readyScripts.length} سكريبتات جاهزة
              </span>
            </div>

            <h3 className="text-base font-bold text-charcoal">جاهز للتصوير الآن</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              السكريبتات المعتمدة بعد مراجعة الهوك والـ Open Loops بانتظار تصويرها.
            </p>

            {readyScripts.length > 0 ? (
              <div className="mt-4 space-y-2">
                {readyScripts.slice(0, 2).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectScript(s)}
                    className="p-3 rounded-2xl bg-sand-50 hover:bg-sand-100 border border-sand-border cursor-pointer transition-all"
                  >
                    <p className="text-xs font-bold text-charcoal line-clamp-1">{s.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-charcoal-muted mt-1">
                      <span>{s.framework}</span>
                      <span className="text-falcon-600 font-semibold">{s.estimatedDurationSeconds} ثانية</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-2xl bg-sand-50 text-center text-xs text-charcoal-muted">
                مفيش سكريبتات جاهزة حالياً. ابدأ واحد من بنك الأفكار!
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateToTab('scripts')}
            className="mt-4 pt-3 border-t border-sand-border flex items-center justify-between text-xs font-bold text-charcoal hover:text-falcon-600 transition-colors"
          >
            <span>استعراض كل السكريبتات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: High Priority Ideas */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-gold-light text-gold flex items-center justify-center">
                <Lightbulb className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gold-light text-gold-dark border border-amber-200">
                {highPriorityIdeas.length} أفكار ذهبية
              </span>
            </div>

            <h3 className="text-base font-bold text-charcoal">أعلى الأفكار أولوية</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              أفكار تم تقييمها وتجاوزت 80 نقطة بحسب معادلة الانتشار وقيمة العميل.
            </p>

            <div className="mt-4 space-y-2">
              {highPriorityIdeas.slice(0, 2).map((idea) => (
                <div
                  key={idea.id}
                  onClick={() => onSelectIdea(idea)}
                  className="p-3 rounded-2xl bg-sand-50 hover:bg-sand-100 border border-sand-border cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-charcoal line-clamp-1">{idea.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-charcoal-muted mt-1">
                    <span className="text-falcon-600 font-bold">{idea.totalPriorityScore} / 100</span>
                    <span>بواسطة {idea.creatorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('ideas')}
            className="mt-4 pt-3 border-t border-sand-border flex items-center justify-between text-xs font-bold text-charcoal hover:text-falcon-600 transition-colors"
          >
            <span>افتح بنك الأفكار الكامل</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Team Sprint Quest (Gamification) */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-2xl bg-falcon-50 text-falcon-600 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-falcon-600" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sand-100 text-charcoal border border-sand-border">
                تحدي الأسبوع 🔥
              </span>
            </div>

            <h3 className="text-base font-bold text-charcoal">مهمة الفريق المشتركة</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              هدف مشترك بين أحمد ومعاذ بدون ضغط نفسي لتعزيز النشر والتصوير المنتظم.
            </p>

            <div className="mt-4 space-y-3">
              {quests.slice(0, 2).map((q) => {
                const percent = Math.min(100, Math.round((q.currentCount / q.targetCount) * 100));
                return (
                  <div key={q.id} className="p-3 bg-white rounded-2xl border border-sand-border">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-charcoal">{q.title}</span>
                      <span className="text-falcon-600">{q.currentCount} / {q.targetCount}</span>
                    </div>
                    <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-falcon-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('gamification')}
            className="mt-4 pt-3 border-t border-sand-border flex items-center justify-between text-xs font-bold text-falcon-600 hover:text-falcon-700 transition-colors"
          >
            <span>لوحة النقاط والمستويات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          ROW 3: WINNING LESSON CARD (Learnings & Creative Feedback)
          ========================================================================= */}
      {outcomes.length > 0 && (
        <div className="bento-card p-6 sm:p-7 border-r-4 border-r-falcon-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-falcon-600 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>درس تسويقي مستفاد من سكريبت ناجح</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-charcoal">
              "{outcomes[0].keyLearning}"
            </h4>
            <p className="text-xs text-charcoal-muted mt-1">
              النتيجة: حقق هذا السكريبت {outcomes[0].ordersAttributed} طلب بإجمالي {outcomes[0].revenueAttributed.toLocaleString()} جنيه.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('results')}
            className="px-4 py-2 rounded-2xl bg-sand-50 hover:bg-sand-200 border border-sand-border text-xs font-bold text-charcoal whitespace-nowrap transition-colors"
          >
            عرض التفاصيل
          </button>
        </div>
      )}

    </div>
  );
}
