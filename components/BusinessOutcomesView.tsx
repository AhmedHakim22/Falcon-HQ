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
  Layers
} from 'lucide-react';
import { BusinessOutcome, Script } from '@/lib/types';
import confetti from 'canvas-confetti';

interface BusinessOutcomesViewProps {
  outcomes: BusinessOutcome[];
  scripts: Script[];
  onAddOutcome: (outcome: Omit<BusinessOutcome, 'id' | 'recordedAt'>) => void;
}

export function BusinessOutcomesView({
  outcomes,
  scripts,
  onAddOutcome,
}: BusinessOutcomesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScriptId, setSelectedScriptId] = useState(scripts[0]?.id || '');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [orders, setOrders] = useState<number>(10);
  const [revenue, setRevenue] = useState<number>(3500);
  const [inquiries, setInquiries] = useState<number>(45);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('high');
  const [learning, setLearning] = useState('');
  const [isWinning, setIsWinning] = useState(true);

  const totalRevenue = outcomes.reduce((acc, o) => acc + o.revenueAttributed, 0);
  const totalOrders = outcomes.reduce((acc, o) => acc + o.ordersAttributed, 0);
  const totalInquiries = outcomes.reduce((acc, o) => acc + o.inquiriesCount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const script = scripts.find((s) => s.id === selectedScriptId);
    
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#059669', '#D32F2F', '#D97706'],
      });
    } catch {}

    onAddOutcome({
      scriptId: selectedScriptId,
      ideaTitle: script?.title || 'سكريبت فيديو',
      publishedUrl,
      ordersAttributed: Number(orders),
      revenueAttributed: Number(revenue),
      inquiriesCount: Number(inquiries),
      confidenceLevel: confidence,
      keyLearning: learning.trim(),
      isWinningPattern: isWinning,
    });

    setIsModalOpen(false);
    setLearning('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-charcoal">نتائج البزنس ومبيعات المحتوى</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            ربط كل سكريبت مصور بعدد الجرابات المباعة والأرباح والدروس المستفادة
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>تسجيل نتائج فيديو منشور (+15 XP)</span>
        </button>
      </div>

      {/* 3 Metrics Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bento-card p-6 bg-gradient-to-br from-white to-sand-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted">إجمالي الإيراد المنسوب</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              EGP
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal">
            {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-charcoal-muted">ج.م</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">مبيعات محققة من الفيديوهات</p>
        </div>

        <div className="bento-card p-6 bg-gradient-to-br from-white to-sand-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted">عدد الجرابات المطلوبة</span>
            <div className="w-9 h-9 rounded-2xl bg-falcon-50 text-falcon-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal">
            {totalOrders} <span className="text-xs font-bold text-charcoal-muted">جراب</span>
          </div>
          <p className="text-[11px] text-falcon-600 font-semibold mt-1">طلبات من ريلز وتيك توك</p>
        </div>

        <div className="bento-card p-6 bg-gradient-to-br from-white to-sand-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted">استفسارات الشراء بالرسائل</span>
            <div className="w-9 h-9 rounded-2xl bg-gold-light text-gold flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal">
            {totalInquiries} <span className="text-xs font-bold text-charcoal-muted">رسالة</span>
          </div>
          <p className="text-[11px] text-gold-dark font-semibold mt-1">عملاء مهتمين بالتصاميم</p>
        </div>

      </div>

      {/* Recorded Outcomes Ledger */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
          <span>سجل الفيديوهات المنشورة ونتائجها</span>
          <span className="text-xs font-normal text-charcoal-muted">({outcomes.length} فيديوهات موثقة)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {outcomes.map((outcome) => (
            <div key={outcome.id} className="bento-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {outcome.ordersAttributed} طلب • {outcome.revenueAttributed.toLocaleString()} ج.م
                  </span>

                  {outcome.isWinningPattern && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gold-light text-gold-dark border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold" />
                      <span>قالب رابح ⭐</span>
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-charcoal">{outcome.ideaTitle}</h4>

                {outcome.publishedUrl && (
                  <a
                    href={outcome.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-falcon-600 hover:underline mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>رابط الفيديو المنشور</span>
                  </a>
                )}

                {/* Core Learning Box */}
                {outcome.keyLearning && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-sand-50 border border-sand-border text-xs text-charcoal">
                    <span className="font-bold block text-falcon-600 mb-1">💡 الدرس المستفاد:</span>
                    <p className="leading-relaxed">{outcome.keyLearning}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-sand-border flex items-center justify-between text-[11px] text-charcoal-muted">
                <span>مستوى الثقة في الإسناد: <strong className="text-charcoal">{outcome.confidenceLevel === 'high' ? 'عالي (كود خصم)' : 'متوسط'}</strong></span>
                <span>{new Date(outcome.recordedAt).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Outcome Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-150">
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white rounded-3xl border border-sand-border shadow-2xl p-6 sm:p-7 space-y-4"
          >
            <h3 className="text-lg font-bold text-charcoal">تسجيل نتائج فيديو منشور</h3>
            
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">اختر السكريبت</label>
              <select
                value={selectedScriptId}
                onChange={(e) => setSelectedScriptId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-border text-xs text-charcoal"
              >
                {scripts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">الطلبات المنسوبة</label>
                <input
                  type="number"
                  min={0}
                  value={orders}
                  onChange={(e) => setOrders(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-sand-50 border border-sand-border text-xs text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">الإيراد المنسوب (ج.م)</label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-sand-50 border border-sand-border text-xs text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">رابط الفيديو المنشور</label>
              <input
                type="url"
                dir="ltr"
                value={publishedUrl}
                onChange={(e) => setPublishedUrl(e.target.value)}
                placeholder="https://instagram.com/reel/..."
                className="w-full px-3 py-2 rounded-xl bg-sand-50 border border-sand-border text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">أهم درس مستفاد من الفيديو</label>
              <textarea
                rows={2}
                dir="auto"
                required
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
                placeholder="مثال: الهوك المقارن في أول ثانيتين جاب تفاعل أكبر بكثير من فيديوهات الاستعراض العادية..."
                className="w-full px-3 py-2 rounded-xl bg-sand-50 border border-sand-border text-xs text-charcoal resize-none"
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
              <label htmlFor="winning" className="text-xs font-semibold text-charcoal cursor-pointer">
                اعتبار هذا السكريبت "قالب رابح" يمكن تكراره
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-sand-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-sand-border text-xs font-semibold text-charcoal"
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

    </div>
  );
}
