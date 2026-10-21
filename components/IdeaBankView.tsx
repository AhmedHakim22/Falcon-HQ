'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Sliders, 
  FileText, 
  Trash2, 
  Sparkles,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { Idea, IdeaCategory, IdeaStatus } from '@/lib/types';
import { getPriorityTier } from '@/lib/priority';

interface IdeaBankViewProps {
  ideas: Idea[];
  onOpenQuickCapture: () => void;
  onOpenPriorityModal: (idea: Idea) => void;
  onStartScriptFromIdea: (idea: Idea) => void;
  onDeleteIdea: (ideaId: string) => void;
  onUpdateStatus: (ideaId: string, status: IdeaStatus) => void;
}

export function IdeaBankView({
  ideas,
  onOpenQuickCapture,
  onOpenPriorityModal,
  onStartScriptFromIdea,
  onDeleteIdea,
  onUpdateStatus,
}: IdeaBankViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.notes && idea.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || idea.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-charcoal">بنك الأفكار</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            التقاط الأفكار وترتيب أولوياتها قبل تحويلها لسكريبتات فيديوهات
          </p>
        </div>

        <button
          onClick={onOpenQuickCapture}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>فكرة سريعة جديدة</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bento-card p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-muted absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            dir="auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأفكار أو الملاحظات..."
            className="w-full ps-10 pe-4 py-2 rounded-2xl bg-sand-50 border border-sand-border text-xs sm:text-sm text-charcoal outline-none focus:border-falcon-600 focus:bg-white transition-all placeholder:text-charcoal-muted/60"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'content', label: 'محتوى' },
            { id: 'product', label: 'منتج وجراب' },
            { id: 'marketing', label: 'تسويق' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-falcon-600 text-white shadow-xs'
                  : 'bg-sand-50 text-charcoal-muted hover:bg-sand-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.map((idea) => {
          const tier = getPriorityTier(idea.totalPriorityScore ?? null);
          return (
            <div
              key={idea.id}
              className="bento-card p-5 sm:p-6 flex flex-col justify-between hover:border-falcon-100 transition-all group"
            >
              <div>
                {/* Card Top: Category & Priority Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal border border-sand-border">
                    {idea.category === 'product' ? '📱 منتج' : idea.category === 'marketing' ? '📢 تسويق' : '🎬 محتوى'}
                  </span>

                  <button
                    onClick={() => onOpenPriorityModal(idea)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all hover:scale-105 ${tier.badgeClass}`}
                    title="اضغط لتعديل تقييم الأولوية"
                  >
                    {tier.label}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-charcoal leading-snug line-clamp-2">
                  {idea.title}
                </h3>

                {/* Notes */}
                {idea.notes && (
                  <p className="text-xs text-charcoal-muted mt-2 line-clamp-2 leading-relaxed bg-sand-50 p-2.5 rounded-xl border border-sand-border">
                    {idea.notes}
                  </p>
                )}

                {/* External Link */}
                {idea.sourceUrl && (
                  <div className="mt-3">
                    <a
                      href={idea.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-falcon-600 font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>رابط الفيديو أو المصدر</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Card Footer: Metadata & Actions */}
              <div className="mt-5 pt-3.5 border-t border-sand-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted">
                  <span>بواسطة {idea.creatorName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenPriorityModal(idea)}
                    className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-sand-100 transition-colors"
                    title="تقييم الأولوية"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteIdea(idea.id)}
                    className="p-2 rounded-xl text-charcoal-muted hover:text-falcon-600 hover:bg-falcon-50 transition-colors"
                    title="حذف الفكرة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onStartScriptFromIdea(idea)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ابدأ سكريبت</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="bento-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-3xl bg-sand-100 text-charcoal-muted flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal">مفيش أفكار مطابقة للبحث</h3>
          <p className="text-xs text-charcoal-muted mt-1">جرّب تغير كلمات البحث أو سجل فكرة جديدة دلوقتي!</p>
          <button
            onClick={onOpenQuickCapture}
            className="mt-4 px-4 py-2 rounded-2xl bg-falcon-600 text-white text-xs font-bold"
          >
            سجل فكرة جديدة
          </button>
        </div>
      )}

    </div>
  );
}
