'use client';

import React, { useState, useEffect } from 'react';
import { X, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { Idea } from '@/lib/types';
import { calculatePriorityScore, getPriorityTier } from '@/lib/priority';

interface PriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  onSaveRatings: (ideaId: string, ratings: { goalFit: number; customerValue: number; reach: number; ease: number }) => void;
}

export function PriorityModal({
  isOpen,
  onClose,
  idea,
  onSaveRatings,
}: PriorityModalProps) {
  const [goalFit, setGoalFit] = useState<number>(3);
  const [customerValue, setCustomerValue] = useState<number>(3);
  const [reach, setReach] = useState<number>(3);
  const [ease, setEase] = useState<number>(3);

  useEffect(() => {
    if (idea) {
      setGoalFit(idea.goalFitScore || 3);
      setCustomerValue(idea.customerValueScore || 3);
      setReach(idea.reachScore || 3);
      setEase(idea.easeScore || 3);
    }
  }, [idea]);

  if (!isOpen || !idea) return null;

  const currentScore = calculatePriorityScore({
    goalFit,
    customerValue,
    reach,
    ease,
  });

  const tier = getPriorityTier(currentScore);

  const handleSave = () => {
    onSaveRatings(idea.id, {
      goalFit,
      customerValue,
      reach,
      ease,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl border border-sand-border shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gold-light text-gold flex items-center justify-center">
              <Sliders className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal">محرك تقييم أولوية الفكرة</h2>
              <p className="text-xs text-charcoal-muted line-clamp-1">{idea.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-sand-100 text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Score Bento Pill */}
        <div className="my-5 p-4 rounded-2xl bg-sand-50 border border-sand-border flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-charcoal-muted block">درجة الأولوية المتوقعة</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-charcoal">
                {currentScore !== null ? currentScore : 'غير مقيمة'}
              </span>
              {currentScore !== null && <span className="text-xs text-charcoal-muted">من 100</span>}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs border ${tier.badgeClass}`}>
            {tier.label}
          </span>
        </div>

        {/* 4 Factor Sliders */}
        <div className="space-y-4">
          
          {/* Factor 1: Goal Fit (40%) */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-charcoal">ملاءمة أهداف فالكون (وزن 40%)</span>
              <span className="text-falcon-600 font-bold">{goalFit} من 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={goalFit}
              onChange={(e) => setGoalFit(Number(e.target.value))}
              className="w-full accent-falcon-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-muted px-1 mt-0.5">
              <span>بعيدة عن البراند</span>
              <span>في قلب الاستراتيجية</span>
            </div>
          </div>

          {/* Factor 2: Customer Value (25%) */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-charcoal">قيمة العميل وفائدة الجراب (وزن 25%)</span>
              <span className="text-falcon-600 font-bold">{customerValue} من 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={customerValue}
              onChange={(e) => setCustomerValue(Number(e.target.value))}
              className="w-full accent-falcon-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-muted px-1 mt-0.5">
              <span>فائدة عادية</span>
              <span>حاجة ملحة للشراء</span>
            </div>
          </div>

          {/* Factor 3: Reach Potential (20%) */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-charcoal">فرصة الانتشار والتريند (وزن 20%)</span>
              <span className="text-falcon-600 font-bold">{reach} من 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={reach}
              onChange={(e) => setReach(Number(e.target.value))}
              className="w-full accent-falcon-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-muted px-1 mt-0.5">
              <span>مشاهدات محدودة</span>
              <span>فرصة فايرال عالية</span>
            </div>
          </div>

          {/* Factor 4: Ease of Execution (15%) */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-charcoal">سهولة التنفيذ والتصوير (وزن 15%)</span>
              <span className="text-falcon-600 font-bold">{ease} من 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={ease}
              onChange={(e) => setEase(Number(e.target.value))}
              className="w-full accent-falcon-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-muted px-1 mt-0.5">
              <span>صعبة ومعقدة</span>
              <span>تصوير في 10 دقايق</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-sand-border flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl border border-sand-border bg-white hover:bg-sand-100 text-xs font-semibold text-charcoal"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-md shadow-falcon-600/20"
          >
            حفظ التقييم (+5 XP)
          </button>
        </div>

      </div>
    </div>
  );
}
