'use client';

import React, { useState } from 'react';
import { X, Sparkles, Link2, ArrowLeft, Lightbulb, FileText, CheckCircle2 } from 'lucide-react';
import { Idea, IdeaCategory } from '@/lib/types';
import confetti from 'canvas-confetti';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveIdea: (idea: Partial<Idea>, nextAction: 'start_script' | 'save_inbox' | 'action_plan') => void;
  currentUser: string;
}

export function QuickCaptureModal({
  isOpen,
  onClose,
  onSaveIdea,
  currentUser,
}: QuickCaptureModalProps) {
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('content');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (action: 'start_script' | 'save_inbox' | 'action_plan') => {
    if (!title.trim()) return;

    // Trigger subtle celebratory confetti
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#D32F2F', '#D97706', '#F8F5F0'],
      });
    } catch {}

    onSaveIdea(
      {
        title: title.trim(),
        sourceUrl: sourceUrl.trim(),
        category,
        notes: notes.trim(),
        creatorName: currentUser,
        status: action === 'start_script' ? 'scripting' : action === 'action_plan' ? 'action_plan' : 'inbox',
      },
      action
    );

    // Reset and close
    setTitle('');
    setSourceUrl('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl border border-sand-border shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-falcon-50 text-falcon-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-charcoal">فكرة جديدة في ثانية</h2>
              <p className="text-xs text-charcoal-muted">سجل الفكرة واللينك فوراً قبل ما يطيروا</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-sand-100 text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-5 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-charcoal mb-1.5">
              عنوان الفكرة <span className="text-falcon-600">*</span>
            </label>
            <input
              type="text"
              autoFocus
              dir="auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مقارنة كفر فالكون ضد الصدمات مع الجراب العادي"
              className="w-full px-4 py-3 rounded-2xl bg-sand-50 border border-sand-border focus:border-falcon-600 focus:bg-white text-sm text-charcoal outline-none transition-all placeholder:text-charcoal-muted/60"
            />
          </div>

          {/* Inspiration Link */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-falcon-600" />
              <span>رابط الإلهام (تيك توك / ريلز / شورتس)</span>
            </label>
            <input
              type="url"
              dir="ltr"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@... or instagram.com/reel/..."
              className="w-full px-4 py-2.5 rounded-2xl bg-sand-50 border border-sand-border focus:border-falcon-600 focus:bg-white text-xs sm:text-sm text-charcoal outline-none transition-all placeholder:text-charcoal-muted/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              نوع الفكرة
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'content', label: 'محتوى وريلز' },
                { id: 'product', label: 'منتج وجراب' },
                { id: 'marketing', label: 'تسويق وعروض' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    category === c.id
                      ? 'bg-falcon-50 border-falcon-600 text-falcon-600 font-bold'
                      : 'bg-sand-50 border-sand-border text-charcoal-muted hover:border-sand-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              ملحوظة أو زاوية سريعة (اختياري)
            </label>
            <textarea
              dir="auto"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: نركز في أول ثانيتين على صوت خبطة الموبايل..."
              className="w-full px-4 py-2.5 rounded-2xl bg-sand-50 border border-sand-border focus:border-falcon-600 focus:bg-white text-xs sm:text-sm text-charcoal outline-none transition-all placeholder:text-charcoal-muted/50 resize-none"
            />
          </div>

        </div>

        {/* Action Router Buttons */}
        <div className="mt-6 pt-4 border-t border-sand-border flex flex-col sm:flex-row gap-2.5 justify-end">
          
          <button
            type="button"
            disabled={!title.trim()}
            onClick={() => handleSubmit('save_inbox')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-sand-border bg-white hover:bg-sand-100 text-charcoal text-xs sm:text-sm font-semibold transition-all disabled:opacity-50"
          >
            حفظ في الصندوق
          </button>

          <button
            type="button"
            disabled={!title.trim()}
            onClick={() => handleSubmit('start_script')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/20 transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>ابدأ السكريبت فوراً (+5 XP)</span>
          </button>

        </div>

      </div>
    </div>
  );
}
