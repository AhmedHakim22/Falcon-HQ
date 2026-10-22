'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  MessageSquare, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Layers,
  Edit3,
  Trash2,
  RotateCcw,
  AlertTriangle,
  X,
  Save
} from 'lucide-react';
import { BusinessOutcome, Script } from '@/lib/types';
import confetti from 'canvas-confetti';

interface BusinessOutcomesViewProps {
  outcomes: BusinessOutcome[];
  scripts: Script[];
  onAddOutcome: (outcome: Omit<BusinessOutcome, 'id' | 'recordedAt'>) => void;
  onUpdateOutcome?: (outcome: BusinessOutcome) => void;
  onDeleteOutcome?: (outcomeId: string) => void;
  onResetAllOutcomes?: () => void;
}

export function BusinessOutcomesView({
  outcomes,
  scripts,
  onAddOutcome,
  onUpdateOutcome,
  onDeleteOutcome,
  onResetAllOutcomes,
}: BusinessOutcomesViewProps) {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<BusinessOutcome | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // New Outcome Form State
  const [selectedScriptId, setSelectedScriptId] = useState(scripts[0]?.id || '');
  const [customTitle, setCustomTitle] = useState('');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [orders, setOrders] = useState<number>(10);
  const [revenue, setRevenue] = useState<number>(3500);
  const [inquiries, setInquiries] = useState<number>(45);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('high');
  const [learning, setLearning] = useState('');
  const [isWinning, setIsWinning] = useState(true);

  // Edit Outcome Form State
  const [editTitle, setEditTitle] = useState('');
  const [editPublishedUrl, setEditPublishedUrl] = useState('');
  const [editOrders, setEditOrders] = useState<number>(0);
  const [editRevenue, setEditRevenue] = useState<number>(0);
  const [editInquiries, setEditInquiries] = useState<number>(0);
  const [editConfidence, setEditConfidence] = useState<'high' | 'medium' | 'low'>('high');
  const [editLearning, setEditLearning] = useState('');
  const [editIsWinning, setEditIsWinning] = useState(true);

  // Calculations
  const totalRevenue = outcomes.reduce((acc, o) => acc + (Number(o.revenueAttributed) || 0), 0);
  const totalOrders = outcomes.reduce((acc, o) => acc + (Number(o.ordersAttributed) || 0), 0);
  const totalInquiries = outcomes.reduce((acc, o) => acc + (Number(o.inquiriesCount) || 0), 0);

  const handleOpenEdit = (outcome: BusinessOutcome) => {
    setEditingOutcome(outcome);
    setEditTitle(outcome.ideaTitle);
    setEditPublishedUrl(outcome.publishedUrl || '');
    setEditOrders(outcome.ordersAttributed);
    setEditRevenue(outcome.revenueAttributed);
    setEditInquiries(outcome.inquiriesCount);
    setEditConfidence(outcome.confidenceLevel);
    setEditLearning(outcome.keyLearning);
    setEditIsWinning(outcome.isWinningPattern);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutcome || !onUpdateOutcome) return;

    const updated: BusinessOutcome = {
      ...editingOutcome,
      ideaTitle: editTitle.trim() || editingOutcome.ideaTitle,
      publishedUrl: editPublishedUrl.trim(),
      ordersAttributed: Number(editOrders) || 0,
      revenueAttributed: Number(editRevenue) || 0,
      inquiriesCount: Number(editInquiries) || 0,
      confidenceLevel: editConfidence,
      keyLearning: editLearning.trim(),
      isWinningPattern: editIsWinning,
    };

    onUpdateOutcome(updated);
    setEditingOutcome(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const script = scripts.find((s) => s.id === selectedScriptId);
    const finalTitle = customTitle.trim() || script?.title || 'نتائج فيديو محتوى';

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#059669', '#D32F2F', '#D97706'],
      });
    } catch {}

    onAddOutcome({
      scriptId: selectedScriptId || (script?.id ?? 'custom'),
      ideaTitle: finalTitle,
      publishedUrl,
      ordersAttributed: Number(orders) || 0,
      revenueAttributed: Number(revenue) || 0,
      inquiriesCount: Number(inquiries) || 0,
      confidenceLevel: confidence,
      keyLearning: learning.trim(),
      isWinningPattern: isWinning,
    });

    setIsAddModalOpen(false);
    setLearning('');
    setCustomTitle('');
    setPublishedUrl('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-stone-100">
            نتائج البزنس ومبيعات المحتوى
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-stone-400 mt-0.5">
            ربط كل سكريبت مصور بعدد الجرابات المباعة، الأرباح، وإمكانية التعديل أو المسح في أي وقت
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onResetAllOutcomes && outcomes.length > 0 && (
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-all"
              title="تصفير كل المبيعات والنتائج"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير المبيعات</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>تسجيل نتائج فيديو (+15 XP)</span>
          </button>
        </div>
      </div>

      {/* 3 Metrics Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bento-card p-6 bg-gradient-to-br from-white to-sand-50 dark:from-stone-900 dark:to-stone-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">إجمالي الإيراد المنسوب</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              EGP
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal dark:text-stone-100">
            {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">ج.م</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">مبيعات محققة من الفيديوهات</p>
        </div>

        <div className="bento-card p-6 bg-gradient-to-br from-white to-sand-50 dark:from-stone-900 dark:to-stone-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">عدد الجرابات المطلوبة</span>
            <div className="w-9 h-9 rounded-2xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 dark:text-falcon-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal dark:text-stone-100">
            {totalOrders} <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">جراب</span>
          </div>
          <p className="text-[11px] text-falcon-600 dark:text-falcon-400 font-semibold mt-1">طلبات من ريلز وتيك توك</p>
        </div>

        <div className="bento-card p-6 bg-gradient-to-br from-white to-sand-50 dark:from-stone-900 dark:to-stone-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">استفسارات الشراء بالرسائل</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal dark:text-stone-100">
            {totalInquiries} <span className="text-xs font-bold text-charcoal-muted dark:text-stone-400">رسالة</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">عملاء مهتمين بالتصاميم</p>
        </div>

      </div>

      {/* Recorded Outcomes Ledger */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-charcoal dark:text-stone-100 flex items-center gap-2">
          <span>سجل الفيديوهات المنشورة ونتائجها</span>
          <span className="text-xs font-normal text-charcoal-muted dark:text-stone-400">({outcomes.length} فيديوهات موثقة)</span>
        </h3>

        {outcomes.length === 0 ? (
          <div className="bento-card p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 dark:bg-stone-800 text-charcoal-muted dark:text-stone-400 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-charcoal dark:text-stone-200">
              لا توجد مبيعات مسجلة حالياً
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-stone-400 max-w-sm">
              تم تصفير الإحصائيات بالكامل. سجل نتائج أول فيديو منشور لربط المشاهدات بالمبيعات الفعلية.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold transition-all"
            >
              + تسجيل نتائج أول فيديو
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {outcomes.map((outcome) => (
              <div key={outcome.id} className="bento-card p-6 flex flex-col justify-between hover:border-falcon-200 dark:hover:border-stone-700 transition-all group">
                <div>
                  {/* Top Bar: Badges + Action Buttons (Edit / Delete) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                      {outcome.ordersAttributed} طلب • {outcome.revenueAttributed.toLocaleString()} ج.م
                    </span>

                    <div className="flex items-center gap-1.5">
                      {outcome.isWinningPattern && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>قالب رابح ⭐</span>
                        </span>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(outcome)}
                        className="p-1.5 rounded-xl hover:bg-sand-100 dark:hover:bg-stone-800 text-charcoal-muted hover:text-charcoal dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                        title="تعديل الأرقام والنتائج"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      {onDeleteOutcome && (
                        <button
                          onClick={() => setConfirmDeleteId(outcome.id)}
                          className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-charcoal-muted hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 transition-colors"
                          title="مسح هذه النتيجة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-charcoal dark:text-stone-100">
                    {outcome.ideaTitle}
                  </h4>

                  {outcome.publishedUrl && (
                    <a
                      href={outcome.publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-falcon-600 dark:text-falcon-400 hover:underline mt-2 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>رابط الفيديو المنشور</span>
                    </a>
                  )}

                  {/* Core Learning Box */}
                  {outcome.keyLearning && (
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-sand-50 dark:bg-stone-800/70 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-300">
                      <span className="font-bold block text-falcon-600 dark:text-falcon-400 mb-1">💡 الدرس المستفاد:</span>
                      <p className="leading-relaxed">{outcome.keyLearning}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-sand-border dark:border-stone-800 flex items-center justify-between text-[11px] text-charcoal-muted dark:text-stone-400">
                  <span>مستوى الثقة: <strong className="text-charcoal dark:text-stone-200">{outcome.confidenceLevel === 'high' ? 'عالي (كود خصم)' : outcome.confidenceLevel === 'medium' ? 'متوسط' : 'تقديري'}</strong></span>
                  <span>{new Date(outcome.recordedAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------
          MODAL 1: Add New Outcome
          ------------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <form 
            onSubmit={handleCreateSubmit}
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sand-border dark:border-stone-800">
              <h3 className="text-base sm:text-lg font-bold text-charcoal dark:text-stone-100">
                تسجيل نتائج فيديو منشور
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Script selector or custom title */}
            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">اختر السكريبت أو اكتب العنوان</label>
              {scripts.length > 0 ? (
                <select
                  value={selectedScriptId}
                  onChange={(e) => {
                    setSelectedScriptId(e.target.value);
                    const s = scripts.find((sc) => sc.id === e.target.value);
                    if (s) setCustomTitle(s.title);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100"
                >
                  {scripts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="عنوان الفيديو أو الموضوع..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">الطلبات المنسوبة (جرابات)</label>
                <input
                  type="number"
                  min={0}
                  value={orders}
                  onChange={(e) => setOrders(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">الإيراد المنسوب (ج.م)</label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">استفسارات الشراء بالرسائل</label>
              <input
                type="number"
                min={0}
                value={inquiries}
                onChange={(e) => setInquiries(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">رابط الفيديو المنشور</label>
              <input
                type="url"
                dir="ltr"
                value={publishedUrl}
                onChange={(e) => setPublishedUrl(e.target.value)}
                placeholder="https://instagram.com/reel/..."
                className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">أهم درس مستفاد من الفيديو</label>
              <textarea
                rows={2}
                dir="auto"
                required
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
                placeholder="مثال: الهوك المقارن في أول ثانيتين جاب مبيعات أعلى بكثير من مجرد استعراض الكفر..."
                className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="winning"
                checked={isWinning}
                onChange={(e) => setIsWinning(e.target.checked)}
                className="accent-falcon-600 rounded"
              />
              <label htmlFor="winning" className="text-xs font-semibold text-charcoal dark:text-stone-200 cursor-pointer">
                اعتبار هذا الفيديو "قالب رابح" يمكن تكراره
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-sand-border dark:border-stone-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-semibold text-charcoal dark:text-stone-300"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-sm"
              >
                حفظ النتائج (+15 XP)
              </button>
            </div>

          </form>
        </div>
      )}

      {/* -------------------------------------------------------------------
          MODAL 2: Edit Outcome Modal (تعديل النتيجة)
          ------------------------------------------------------------------- */}
      {editingOutcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <form 
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sand-border dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-falcon-600" />
                <h3 className="text-base sm:text-lg font-bold text-charcoal dark:text-stone-100">
                  تعديل نتائج ومبيعات الفيديو
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOutcome(null)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">عنوان الفيديو / السكريبت</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">الطلبات المنسوبة (جرابات)</label>
                <input
                  type="number"
                  min={0}
                  value={editOrders}
                  onChange={(e) => setEditOrders(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">الإيراد المنسوب (ج.م)</label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={editRevenue}
                  onChange={(e) => setEditRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">استفسارات الشراء بالرسائل</label>
              <input
                type="number"
                min={0}
                value={editInquiries}
                onChange={(e) => setEditInquiries(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">رابط الفيديو المنشور</label>
              <input
                type="url"
                dir="ltr"
                value={editPublishedUrl}
                onChange={(e) => setEditPublishedUrl(e.target.value)}
                placeholder="https://instagram.com/reel/..."
                className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">أهم درس مستفاد من الفيديو</label>
              <textarea
                rows={2}
                dir="auto"
                required
                value={editLearning}
                onChange={(e) => setEditLearning(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editWinning"
                  checked={editIsWinning}
                  onChange={(e) => setEditIsWinning(e.target.checked)}
                  className="accent-falcon-600 rounded"
                />
                <label htmlFor="editWinning" className="text-xs font-semibold text-charcoal dark:text-stone-200 cursor-pointer">
                  قالب رابح ⭐
                </label>
              </div>

              <div>
                <select
                  value={editConfidence}
                  onChange={(e) => setEditConfidence(e.target.value as any)}
                  className="text-xs py-1 px-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-200"
                >
                  <option value="high">ثقة عالية (كود خصم)</option>
                  <option value="medium">ثقة متوسطة</option>
                  <option value="low">ثقة تقديرية</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-sand-border dark:border-stone-800">
              <button
                type="button"
                onClick={() => setEditingOutcome(null)}
                className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-semibold text-charcoal dark:text-stone-300"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* -------------------------------------------------------------------
          MODAL 3: Delete Single Outcome Confirmation
          ------------------------------------------------------------------- */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 p-6 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal dark:text-stone-100">
                هل تريد مسح هذه النتيجة؟
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
                سيتم حذف هذه النتيجة وتحديث إجمالي المبيعات والطلبات تلقائياً.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-bold text-charcoal dark:text-stone-300"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteOutcome && confirmDeleteId) {
                    onDeleteOutcome(confirmDeleteId);
                  }
                  setConfirmDeleteId(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                نعم، احذفها
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------
          MODAL 4: Reset All Outcomes Confirmation
          ------------------------------------------------------------------- */}
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
                تصفير جميع مبيعات المحتوى؟
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
                سيتم مسح كل الفيديوهات الموثقة وتصفير الإيراد والطلبات إلى (0 ج.م) للبدء من جديد.
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
                  if (onResetAllOutcomes) {
                    onResetAllOutcomes();
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
