'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Sliders, 
  FileText, 
  Trash2, 
  Edit3, 
  Mic, 
  Play, 
  Pause,
  AlertTriangle,
  User,
  Tag
} from 'lucide-react';
import { Idea, IdeaCategory, IdeaType, IdeaStatus } from '@/lib/types';
import { getPriorityTier } from '@/lib/priority';

interface IdeaBankViewProps {
  ideas: Idea[];
  onOpenQuickCapture: () => void;
  onOpenPriorityModal: (idea: Idea) => void;
  onEditIdea: (idea: Idea) => void;
  onStartScriptFromIdea: (idea: Idea) => void;
  onDeleteIdea: (ideaId: string) => void;
  onUpdateStatus: (ideaId: string, status: IdeaStatus) => void;
  currentUser: string;
}

export function IdeaBankView({
  ideas,
  onOpenQuickCapture,
  onOpenPriorityModal,
  onEditIdea,
  onStartScriptFromIdea,
  onDeleteIdea,
  onUpdateStatus,
  currentUser,
}: IdeaBankViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [confirmDeleteIdeaId, setConfirmDeleteIdeaId] = useState<string | null>(null);

  // Active (non-deleted) ideas
  const activeIdeas = ideas.filter((i) => !i.isDeleted);

  const filteredIdeas = activeIdeas.filter((idea) => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.notes && idea.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || (idea.ideaType || 'content') === selectedType;
    return matchesSearch && matchesType;
  });

  const handleToggleAudio = (id: string, base64: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      const audio = new Audio(base64);
      audio.onended = () => setPlayingAudioId(null);
      audio.play();
      setPlayingAudioId(id);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteIdeaId) {
      onDeleteIdea(confirmDeleteIdeaId);
      setConfirmDeleteIdeaId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-stone-100">
              بنك أفكار فالكون
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 dark:text-falcon-400 border border-falcon-200 dark:border-falcon-900">
              {activeIdeas.length} أفكار
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-400 mt-1">
            تصنيف وفلترة الأفكار (منتجات، محتوى، حل مشاكل) وتحديد الأولويات بدون اقتصاص للعناوين
          </p>
        </div>

        <button
          onClick={onOpenQuickCapture}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>فكرة جديدة</span>
        </button>
      </div>

      {/* Search and Tag Filter Bar (Point 11: الفلترة حسب مسار الفكرة) */}
      <div className="bento-card p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-muted absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            dir="auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في عناوين الأفكار أو الملاحظات..."
            className="w-full ps-10 pe-4 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs sm:text-sm text-charcoal dark:text-stone-100 outline-none focus:border-falcon-600 transition-all placeholder:text-charcoal-muted/60"
          />
        </div>

        {/* Type Filter Pills (منتج / محتوى / حل مشكلة) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'كل المسارات' },
            { id: 'product', label: '📱 أفكار منتجات' },
            { id: 'content', label: '🎬 أفكار محتوى' },
            { id: 'problem', label: '🛠️ حل مشاكل' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type.id
                  ? 'bg-falcon-600 text-white shadow-xs'
                  : 'bg-sand-50 dark:bg-stone-800 text-charcoal-muted dark:text-stone-300 hover:bg-sand-200 dark:hover:bg-stone-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.map((idea) => {
          const tier = getPriorityTier(idea.totalPriorityScore ?? null);
          const typeLabel = 
            idea.ideaType === 'product' ? '📱 منتج جديد' :
            idea.ideaType === 'problem' ? '🛠️ حل مشكلة' : '🎬 محتوى وتسويق';
          
          return (
            <div
              key={idea.id}
              className="bento-card p-5 sm:p-6 flex flex-col justify-between hover:border-falcon-200 dark:hover:border-stone-600 transition-all group"
            >
              <div>
                {/* Card Top: Type Tag & Priority Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    idea.ideaType === 'product'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                      : idea.ideaType === 'problem'
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                  }`}>
                    {typeLabel}
                  </span>

                  <button
                    onClick={() => onOpenPriorityModal(idea)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all hover:scale-105 font-bold ${tier.badgeClass}`}
                    title="اضغط لتقييم الأولوية"
                  >
                    {tier.label}
                  </button>
                </div>

                {/* Title (Point 1: العنوان يظهر بالكامل دون أي اقتصاص) */}
                <h3 className="text-sm sm:text-base font-extrabold text-charcoal dark:text-stone-100 leading-snug break-words whitespace-normal">
                  {idea.title}
                </h3>

                {/* Notes (Full or wrap) */}
                {idea.notes && (
                  <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-2.5 leading-relaxed bg-sand-50 dark:bg-stone-800/80 p-2.5 rounded-xl border border-sand-border dark:border-stone-700/80 break-words whitespace-pre-wrap">
                    {idea.notes}
                  </p>
                )}

                {/* Voice Note Player (Point 10) */}
                {idea.voiceNoteBase64 && (
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-falcon-50/60 dark:bg-falcon-950/40 border border-falcon-100 dark:border-falcon-900 text-falcon-700 dark:text-falcon-400 text-xs font-bold">
                    <button
                      onClick={() => handleToggleAudio(idea.id, idea.voiceNoteBase64!)}
                      className="w-7 h-7 rounded-full bg-falcon-600 text-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      {playingAudioId === idea.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 mr-0.5" />}
                    </button>
                    <span>تسجيل صوتي مرفق بالفكرة</span>
                  </div>
                )}

                {/* External Link */}
                {idea.sourceUrl && (
                  <div className="mt-3">
                    <a
                      href={idea.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-falcon-600 dark:text-falcon-400 font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>رابط المصدر</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Card Footer: Creator info & Actions */}
              <div className="mt-5 pt-3.5 border-t border-sand-border dark:border-stone-800 flex items-center justify-between gap-2">
                {/* Creator (Point 2) */}
                <div className="flex items-center gap-1 text-[11px] text-charcoal-muted dark:text-stone-400">
                  <User className="w-3 h-3 text-falcon-600" />
                  <span>{idea.creatorName}</span>
                  {idea.assigneeName && (
                    <span className="text-[10px] text-stone-400">➔ {idea.assigneeName}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Edit Idea Button (Point 7) */}
                  <button
                    onClick={() => onEditIdea(idea)}
                    className="p-1.5 rounded-xl text-charcoal-muted hover:text-charcoal dark:text-stone-400 dark:hover:text-stone-100 hover:bg-sand-100 dark:hover:bg-stone-800 transition-colors"
                    title="تعديل الفكرة"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Priority Slider Button */}
                  <button
                    onClick={() => onOpenPriorityModal(idea)}
                    className="p-1.5 rounded-xl text-charcoal-muted hover:text-charcoal dark:text-stone-400 dark:hover:text-stone-100 hover:bg-sand-100 dark:hover:bg-stone-800 transition-colors"
                    title="تقييم الأولوية"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>

                  {/* Delete Button (Triggers Confirmation) (Point 4) */}
                  <button
                    onClick={() => setConfirmDeleteIdeaId(idea.id)}
                    className="p-1.5 rounded-xl text-charcoal-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="حذف الفكرة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Start Script Button */}
                  <button
                    onClick={() => onStartScriptFromIdea(idea)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>سكريبت</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="bento-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-3xl bg-sand-100 dark:bg-stone-800 text-charcoal-muted flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal dark:text-stone-100">
            مفيش أفكار مطابقة للبحث
          </h3>
          <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
            جرّب تغيير كلمات البحث أو سجل فكرة جديدة الآن!
          </p>
          <button
            onClick={onOpenQuickCapture}
            className="mt-4 px-4 py-2 rounded-2xl bg-falcon-600 text-white text-xs font-bold"
          >
            سجل فكرة جديدة
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal (Point 4) */}
      {confirmDeleteIdeaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-white dark:bg-stone-900 border border-sand-border dark:border-stone-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal dark:text-stone-100">
              نقل الفكرة لسلة المهملات؟
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1.5 leading-relaxed">
              سيتم نقل الفكرة إلى سلة المهملات، ويمكنك استعادتها في أي وقت أو التراجع فوراً.
            </p>

            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => setConfirmDeleteIdeaId(null)}
                className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-bold text-charcoal dark:text-stone-300"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                نقل للمهملات
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
