'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Lightbulb, 
  Save, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Sparkles, 
  User, 
  Tag, 
  Layers, 
  Link as LinkIcon 
} from 'lucide-react';
import { Idea, IdeaCategory, IdeaType, IdeaStatus, resolveIdeaType, resolveDbCategory } from '@/lib/types';
import { calculatePriorityScore } from '@/lib/priority';

interface EditIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  onSave: (updatedIdea: Idea) => void;
  currentUser: string;
}

export function EditIdeaModal({
  isOpen,
  onClose,
  idea,
  onSave,
  currentUser,
}: EditIdeaModalProps) {
  const [title, setTitle] = useState('');
  const [ideaType, setIdeaType] = useState<IdeaType>('content');
  const [category, setCategory] = useState<IdeaCategory>('content');
  const [status, setStatus] = useState<IdeaStatus>('inbox');
  const [creatorName, setCreatorName] = useState('أحمد');
  const [assigneeName, setAssigneeName] = useState('معاذ');
  const [notes, setNotes] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  
  // Ratings
  const [goalFit, setGoalFit] = useState<number | undefined>(undefined);
  const [customerValue, setCustomerValue] = useState<number | undefined>(undefined);
  const [reach, setReach] = useState<number | undefined>(undefined);
  const [ease, setEase] = useState<number | undefined>(undefined);

  // Audio Recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteBase64, setVoiceNoteBase64] = useState<string | undefined>(undefined);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (idea) {
      setTitle(idea.title || '');
      const initialType = resolveIdeaType(idea);
      setIdeaType(initialType);
      setCategory(resolveDbCategory(idea));
      setStatus(idea.status || 'inbox');
      setCreatorName(idea.creatorName || currentUser);
      setAssigneeName(idea.assigneeName || 'معاذ');
      setNotes(idea.notes || '');
      setSourceUrl(idea.sourceUrl || '');
      setGoalFit(idea.goalFitScore);
      setCustomerValue(idea.customerValueScore);
      setReach(idea.reachScore);
      setEase(idea.easeScore);
      setVoiceNoteBase64(idea.voiceNoteBase64);
    }
  }, [idea, currentUser]);

  if (!isOpen || !idea) return null;

  // Recalculate priority if rated
  const hasAllScores = goalFit !== undefined && customerValue !== undefined && reach !== undefined && ease !== undefined;
  const computedScore = hasAllScores 
    ? calculatePriorityScore({ goalFit: goalFit!, customerValue: customerValue!, reach: reach!, ease: ease! })
    : null;

  // Audio Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setVoiceNoteBase64(reader.result as string);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission or support issue:', err);
      alert('تعذر الوصول للميكروفون، يرجى السماح بالوصول من إعدادات المتصفح.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayAudio = () => {
    if (!voiceNoteBase64) return;
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(voiceNoteBase64);
      audioElementRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleDeleteAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setVoiceNoteBase64(undefined);
    setIsPlayingAudio(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = resolveDbCategory({ ideaType, category });
    const updated: Idea = {
      ...idea,
      title: title.trim(),
      ideaType,
      category: finalCategory,
      status,
      creatorName,
      assigneeName,
      notes: notes.trim(),
      sourceUrl: sourceUrl.trim(),
      goalFitScore: goalFit,
      customerValueScore: customerValue,
      reachScore: reach,
      easeScore: ease,
      totalPriorityScore: computedScore,
      voiceNoteBase64,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-stone-900 border border-sand-border dark:border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-sand-border dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-charcoal dark:text-stone-100">
                تعديل الفكرة وبياناتها
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-stone-400">
                تعديل التصنيف، المسؤول، التسجيل الصوتي، والأولويات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-muted hover:text-charcoal dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Title */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5">
              عنوان الفكرة (يظهر بالكامل بدون اقتصاص) *
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              required
              className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-falcon-500 transition-all resize-none"
              placeholder="اكتب العنوان بوضوح..."
            />
          </div>

          {/* 2. Type Tag (Point 11: الفصل بين أفكار منتج / محتوى / حل مشكلة) */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5">
              مسار الفكرة والهدف منها (Type Tag)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'product', label: '📱 فكرة منتج / كفر جديد', desc: 'تصميم أو خامة' },
                { id: 'content', label: '🎬 فكرة محتوى وتسويق', desc: 'ريلز / تيك توك' },
                { id: 'problem', label: '🛠️ حل مشكلة تشغيلية', desc: 'مطبعة / شحن' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    const newType = t.id as IdeaType;
                    setIdeaType(newType);
                    setCategory(resolveDbCategory({ ideaType: newType }));
                  }}
                  className={`p-2.5 rounded-2xl border text-right transition-all ${
                    ideaType === t.id
                      ? 'bg-falcon-50 dark:bg-falcon-950/60 border-falcon-600 text-falcon-700 dark:text-falcon-400 shadow-xs'
                      : 'bg-sand-50 dark:bg-stone-800 border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-300 hover:bg-sand-100'
                  }`}
                >
                  <p className="text-xs font-bold">{t.label}</p>
                  <p className="text-[10px] text-charcoal-muted dark:text-stone-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Creator & Assignee (Point 2: تعديل مين اللي عملها ومين مسؤول عنها) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-falcon-600" />
                <span>صاحب الفكرة (المنشئ)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['أحمد', 'معاذ'].map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setCreatorName(name)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      creatorName === name
                        ? 'bg-falcon-600 text-white border-falcon-600 shadow-xs'
                        : 'bg-sand-50 dark:bg-stone-800 border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-300'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-falcon-600" />
                <span>المسؤول عن التنفيذ (Assignee)</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['أحمد', 'معاذ', 'كلاهما'].map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setAssigneeName(name)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      assigneeName === name
                        ? 'bg-charcoal text-white dark:bg-stone-100 dark:text-charcoal border-charcoal shadow-xs'
                        : 'bg-sand-50 dark:bg-stone-800 border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-300'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Status Selector */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5">
              حالة الفكرة الحالية
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IdeaStatus)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-falcon-500 transition-all"
            >
              <option value="inbox">📥 صندوق الأفكار (Inbox)</option>
              <option value="evaluating">⚖️ قيد التقييم والدراسة</option>
              <option value="scripting">📝 جاري كتابة السكريبت</option>
              <option value="action_plan">🛠️ خطة عمل وتنفيذ منتج</option>
              <option value="ready_to_film">🎬 جاهز للتصوير الفوري</option>
              <option value="published">🚀 تم النشر / الإطلاق</option>
              <option value="archived">📦 مؤرشف</option>
            </select>
          </div>

          {/* 5. Voice Note Recorder (Point 10: تسجيل صوتي) */}
          <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/80 border border-sand-border dark:border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal dark:text-stone-200 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-falcon-600" />
                <span>تسجيل ملاحظة صوتية (Voice Memo)</span>
              </span>
              {voiceNoteBase64 && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ يوجد تسجيل محفوظ
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{voiceNoteBase64 ? 'تسجيل فويس جديد' : 'بدء تسجيل فويس'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold animate-pulse active:scale-95 transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>إيقاف وحفظ الفويس</span>
                </button>
              )}

              {voiceNoteBase64 && (
                <>
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-sand-border dark:border-stone-600 text-charcoal dark:text-stone-200 text-xs font-bold hover:text-falcon-600 transition-colors"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'إيقاف' : 'تشغيل الفويس'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAudio}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-red-500 transition-colors"
                    title="حذف التسجيل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 6. Notes & Reference URL */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                ملاحظات وتفاصيل الفكرة
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-falcon-500 transition-all resize-none"
                placeholder="تفاصيل إضافية عن الفكرة، زاوية التصوير، أو مواصفات الجراب..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-charcoal-muted" />
                <span>رابط مرجعي أو إلهام (Instagram / TikTok)</span>
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-falcon-500 transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-sand-border dark:border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-300 hover:bg-sand-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/25 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
