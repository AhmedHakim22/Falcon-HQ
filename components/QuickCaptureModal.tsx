'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Link2, 
  FileText, 
  Lightbulb, 
  User, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2 
} from 'lucide-react';
import { Idea, IdeaCategory, IdeaType, resolveDbCategory } from '@/lib/types';
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
  const [ideaType, setIdeaType] = useState<IdeaType>('content');
  const [category, setCategory] = useState<IdeaCategory>('content');
  const [creatorName, setCreatorName] = useState(currentUser || 'أحمد');
  const [notes, setNotes] = useState('');

  // Audio Recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteBase64, setVoiceNoteBase64] = useState<string | undefined>(undefined);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
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
      alert('يرجى السماح بالوصول للميكروفون لتسجيل الفويس.');
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

  const handleSubmit = (action: 'start_script' | 'save_inbox' | 'action_plan') => {
    if (!title.trim()) return;

    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#D32F2F', '#D97706', '#F8F5F0'],
      });
    } catch {}

    const finalCategory = resolveDbCategory({ ideaType, category });
    onSaveIdea(
      {
        title: title.trim(),
        sourceUrl: sourceUrl.trim(),
        ideaType,
        category: finalCategory,
        notes: notes.trim(),
        creatorName,
        voiceNoteBase64,
        status: action === 'start_script' ? 'scripting' : action === 'action_plan' ? 'action_plan' : 'inbox',
      },
      action
    );

    // Reset and close
    setTitle('');
    setSourceUrl('');
    setNotes('');
    setVoiceNoteBase64(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sand-border dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-charcoal dark:text-stone-100">فكرة جديدة في ثانية</h2>
              <p className="text-xs text-charcoal-muted dark:text-stone-400">سجل الفكرة والمسار فوراً قبل ما يطيروا</p>
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
        <div className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto px-0.5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5">
              عنوان الفكرة <span className="text-falcon-600">*</span>
            </label>
            <input
              type="text"
              autoFocus
              dir="auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مقارنة كفر فالكون ضد الصدمات مع الجراب العادي"
              className="w-full px-4 py-3 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-sm text-charcoal dark:text-stone-100 outline-none focus:border-falcon-600 transition-all placeholder:text-charcoal-muted/60"
            />
          </div>

          {/* Type Tag (Point 11: الفصل بين أفكار منتج / محتوى / حل مشكلة) */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5">
              مسار الفكرة
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'content', label: '🎬 محتوى وتسويق' },
                { id: 'product', label: '📱 منتج وجراب' },
                { id: 'problem', label: '🛠️ حل مشكلة' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    const newType = t.id as IdeaType;
                    setIdeaType(newType);
                    setCategory(resolveDbCategory({ ideaType: newType }));
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    ideaType === t.id
                      ? 'bg-falcon-50 dark:bg-falcon-950/60 border-falcon-600 text-falcon-600 dark:text-falcon-400 shadow-xs'
                      : 'bg-sand-50 dark:bg-stone-800 border-sand-border dark:border-stone-700 text-charcoal-muted dark:text-stone-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Creator Selector (Point 2: أحمد ولا معاذ) */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-falcon-600" />
              <span>مين اللي صاحب الفكرة؟</span>
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

          {/* Voice Memo Recording (Point 10) */}
          <div className="p-3.5 rounded-2xl bg-sand-50 dark:bg-stone-800/80 border border-sand-border dark:border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal dark:text-stone-200 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-falcon-600" />
                <span>تسجيل فويس نوت للفكرة</span>
              </span>
              {voiceNoteBase64 && (
                <span className="text-[11px] text-emerald-600 font-bold">✓ تم حفظ التسجيل</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>بدء التسجيل</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold animate-pulse active:scale-95 transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>إيقاف التسجيل</span>
                </button>
              )}

              {voiceNoteBase64 && (
                <>
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-sand-border dark:border-stone-600 text-xs font-bold text-charcoal dark:text-stone-200"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>تشغيل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceNoteBase64(undefined)}
                    className="p-1 rounded-lg text-stone-400 hover:text-red-500"
                    title="حذف الفويس"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5">
              ملاحظة أو زاوية سريعة (اختياري)
            </label>
            <textarea
              dir="auto"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: نركز في أول ثانيتين على صوت خبطة الموبايل..."
              className="w-full px-4 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs sm:text-sm text-charcoal dark:text-stone-100 outline-none focus:border-falcon-600 transition-all placeholder:text-charcoal-muted/50 resize-none"
            />
          </div>

          {/* Source Link */}
          <div>
            <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-falcon-600" />
              <span>رابط الإلهام (اختياري)</span>
            </label>
            <input
              type="url"
              dir="ltr"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs sm:text-sm text-charcoal dark:text-stone-100 outline-none focus:border-falcon-600 transition-all placeholder:text-charcoal-muted/50"
            />
          </div>

        </div>

        {/* Action Router Buttons */}
        <div className="mt-6 pt-4 border-t border-sand-border dark:border-stone-800 flex flex-col sm:flex-row gap-2.5 justify-end">
          <button
            type="button"
            disabled={!title.trim()}
            onClick={() => handleSubmit('save_inbox')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-sand-border dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-sand-100 dark:hover:bg-stone-700 text-charcoal dark:text-stone-100 text-xs sm:text-sm font-semibold transition-all disabled:opacity-50"
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
