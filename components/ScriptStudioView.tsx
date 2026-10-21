'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Save, 
  Send, 
  HelpCircle, 
  Layers, 
  Repeat, 
  ChevronDown,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Script, ScriptFramework, OpenLoopsLevel, FrameworkSection, ScriptStatus } from '@/lib/types';
import { FRAMEWORKS, getInitialSectionsForFramework } from '@/lib/frameworks';
import { estimateSpeakingDuration, formatSpeakingTime } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ScriptStudioViewProps {
  activeScript: Script | null;
  scripts: Script[];
  onSelectScript: (script: Script) => void;
  onSaveScript: (updated: Script) => void;
  onUpdateStatus: (scriptId: string, status: ScriptStatus) => void;
  currentUser: string;
}

export function ScriptStudioView({
  activeScript,
  scripts,
  onSelectScript,
  onSaveScript,
  onUpdateStatus,
  currentUser,
}: ScriptStudioViewProps) {
  const [currentScript, setCurrentScript] = useState<Script | null>(activeScript);
  const [activeFramework, setActiveFramework] = useState<ScriptFramework>('AIDA');
  const [openLoopsLevel, setOpenLoopsLevel] = useState<OpenLoopsLevel>('off');
  const [isSavedLocally, setIsSavedLocally] = useState<boolean>(true);

  useEffect(() => {
    if (activeScript) {
      setCurrentScript(activeScript);
      setActiveFramework(activeScript.framework);
      setOpenLoopsLevel(activeScript.openLoopsLevel);
    } else if (scripts.length > 0) {
      setCurrentScript(scripts[0]);
      setActiveFramework(scripts[0].framework);
      setOpenLoopsLevel(scripts[0].openLoopsLevel);
    }
  }, [activeScript, scripts]);

  if (!currentScript) {
    return (
      <div className="bento-card p-12 text-center max-w-lg mx-auto">
        <FileText className="w-12 h-12 text-charcoal-muted mx-auto mb-3" />
        <h3 className="text-base font-bold text-charcoal">مفيش سكريبت محدد حالياً</h3>
        <p className="text-xs text-charcoal-muted mt-1">اختر فكرة من بنك الأفكار وحولها لسكريبت موجه!</p>
      </div>
    );
  }

  // Calculate total text and speaking time
  const fullText = currentScript.sections.map((s) => s.content).join(' ');
  const durationStats = estimateSpeakingDuration(fullText);

  const handleSectionContentChange = (sectionId: string, newContent: string) => {
    setIsSavedLocally(false);
    const updatedSections = currentScript.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, content: newContent } : sec
    );
    const updated = {
      ...currentScript,
      sections: updatedSections,
      wordCount: durationStats.words,
      estimatedDurationSeconds: durationStats.seconds,
      updatedAt: new Date().toISOString(),
    };
    setCurrentScript(updated);
    onSaveScript(updated);
    setTimeout(() => setIsSavedLocally(true), 600);
  };

  const handleSwitchFramework = (newFramework: ScriptFramework) => {
    if (newFramework === currentScript.framework) return;
    const newSections = getInitialSectionsForFramework(newFramework);
    
    // Preserve existing hook / body / cta content if available
    const existingAttention = currentScript.sections.find((s) => s.key === 'attention' || s.key === 'hook' || s.key === 'problem')?.content || '';
    const existingCta = currentScript.sections.find((s) => s.key === 'action' || s.key === 'cta' || s.key === 'resolution' || s.key === 'response')?.content || '';

    if (newSections[0] && existingAttention) newSections[0].content = existingAttention;
    if (newSections[newSections.length - 1] && existingCta) newSections[newSections.length - 1].content = existingCta;

    const updated: Script = {
      ...currentScript,
      framework: newFramework,
      sections: newSections,
      updatedAt: new Date().toISOString(),
    };
    setCurrentScript(updated);
    setActiveFramework(newFramework);
    onSaveScript(updated);
  };

  const handleToggleOpenLoops = (level: OpenLoopsLevel) => {
    setOpenLoopsLevel(level);
    let openLoops = currentScript.openLoops;
    if (level !== 'off' && openLoops.length === 0) {
      openLoops = [
        {
          id: `loop_${Date.now()}`,
          loopHook: 'هقولك في آخر الفيديو على السر اللي هيوفر عليك تمن كفر جديد!',
          loopPayoff: 'السر: اختار خامة البولي كربونات بطبقة UV المقاومة للاصفرار.',
        },
      ];
    }
    const updated: Script = {
      ...currentScript,
      openLoopsLevel: level,
      openLoops,
      updatedAt: new Date().toISOString(),
    };
    setCurrentScript(updated);
    onSaveScript(updated);
  };

  const handleUpdateOpenLoop = (loopId: string, hook: string, payoff: string) => {
    const updatedLoops = currentScript.openLoops.map((l) =>
      l.id === loopId ? { ...l, loopHook: hook, loopPayoff: payoff } : l
    );
    const updated = {
      ...currentScript,
      openLoops: updatedLoops,
    };
    setCurrentScript(updated);
    onSaveScript(updated);
  };

  const handleHandoffForReview = () => {
    onUpdateStatus(currentScript.id, 'review_ready');
    const updated: Script = {
      ...currentScript,
      status: 'review_ready',
    };
    setCurrentScript(updated);
  };

  const handleApproveForFilming = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D32F2F', '#059669', '#F8F5F0'],
      });
    } catch {}

    onUpdateStatus(currentScript.id, 'ready_to_film');
    const updated: Script = {
      ...currentScript,
      status: 'ready_to_film',
      reviewerName: currentUser,
    };
    setCurrentScript(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Studio Header Toolbar */}
      <div className="bento-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal border border-sand-border">
              استوديو السكريبتات ✍️
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              currentScript.status === 'ready_to_film'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : currentScript.status === 'review_ready'
                ? 'bg-gold-light text-gold-dark border-amber-200'
                : 'bg-sand-100 text-charcoal-muted border-sand-border'
            }`}>
              {currentScript.status === 'ready_to_film'
                ? '✅ معتمد وجاهز للتصوير'
                : currentScript.status === 'review_ready'
                ? '👀 جاهز للمراجعة'
                : '📝 مسودة قيد الكتابة'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-charcoal">{currentScript.title}</h2>
          <p className="text-xs text-charcoal-muted mt-1">الكاتب: {currentScript.authorName} • الحفظ: {isSavedLocally ? 'محفوظ محلياً ومؤمّن 🛡️' : 'جاري الحفظ...'}</p>
        </div>

        {/* Duration counter & Handoff buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Speaking Time Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-sand-50 border border-sand-border text-xs font-semibold text-charcoal">
            <Clock className="w-4 h-4 text-falcon-600" />
            <span>{formatSpeakingTime(durationStats.seconds)}</span>
            <span className="text-charcoal-muted">({durationStats.words} كلمة)</span>
          </div>

          {/* Action Buttons */}
          {currentScript.status !== 'ready_to_film' ? (
            <>
              {currentScript.status !== 'review_ready' ? (
                <button
                  onClick={handleHandoffForReview}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-sand-100 border border-sand-border text-xs font-bold text-charcoal transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-gold" />
                  <span>إرسال للمراجعة للشريك (+15 XP)</span>
                </button>
              ) : null}

              <button
                onClick={handleApproveForFilming}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-md shadow-falcon-600/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد للتصوير (+25 XP)</span>
              </button>
            </>
          ) : (
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>معتمد بواسطة {currentScript.reviewerName || 'المؤسس'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Blueprint & Open Loops Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Framework Selector */}
        <div className="bento-card p-4">
          <label className="block text-xs font-bold text-charcoal mb-2">
            مدرسة الإقناع التسويقي (Framework)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {(['AIDA', 'PASTOR', 'StoryArc', 'THEDOC', 'Freeform'] as ScriptFramework[]).map((fw) => (
              <button
                key={fw}
                onClick={() => handleSwitchFramework(fw)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                  activeFramework === fw
                    ? 'bg-falcon-600 text-white shadow-xs font-bold'
                    : 'bg-sand-50 text-charcoal-muted hover:bg-sand-200'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-charcoal-muted mt-2">
            💡 {FRAMEWORKS[activeFramework]?.tagline}
          </p>
        </div>

        {/* Open Loops Controller */}
        <div className="bento-card p-4">
          <label className="block text-xs font-bold text-charcoal mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-falcon-600" />
            <span>محرك الألغاز المشوقة (Open Loops Engine)</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'off', label: 'مغلق (Off)' },
              { id: 'light', label: 'خفيف (حلقة واحدة)' },
              { id: 'full', label: 'كامل (3 حلقات)' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => handleToggleOpenLoops(lvl.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                  openLoopsLevel === lvl.id
                    ? 'bg-falcon-600 text-white shadow-xs font-bold'
                    : 'bg-sand-50 text-charcoal-muted hover:bg-sand-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-charcoal-muted mt-2">
            فتح لغز في بداية الفيديو وإجابته قبل الـ CTA يضاعف متوسط وقت المشاهدة.
          </p>
        </div>

      </div>

      {/* Script Sections (The Guided Writing Fields) */}
      <div className="space-y-4">
        
        {/* Open Loop Card (if active) */}
        {openLoopsLevel !== 'off' && currentScript.openLoops.length > 0 && (
          <div className="bento-card p-5 sm:p-6 border-2 border-dashed border-falcon-500/40 bg-gradient-to-br from-white to-falcon-50/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-falcon-50 text-falcon-600 flex items-center justify-center font-bold text-xs">
                ∞
              </div>
              <div>
                <h4 className="text-xs font-bold text-charcoal">كارت الحلقة المفتوحة (Open Loop Hook)</h4>
                <p className="text-[11px] text-charcoal-muted">جملة فضول في أول 5 ثواني مع إجابتها قبل النهاية</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-bold text-charcoal mb-1">اللغز / الهوك المشوق (بداية الفيديو)</label>
                <input
                  type="text"
                  dir="auto"
                  value={currentScript.openLoops[0]?.loopHook || ''}
                  onChange={(e) => handleUpdateOpenLoop(currentScript.openLoops[0]?.id, e.target.value, currentScript.openLoops[0]?.loopPayoff)}
                  placeholder="مثال: هقولك في آخر الفيديو على السر اللي..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-border text-xs text-charcoal outline-none focus:border-falcon-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal mb-1">الإجابة والحل (Payoff قبل الـ CTA)</label>
                <input
                  type="text"
                  dir="auto"
                  value={currentScript.openLoops[0]?.loopPayoff || ''}
                  onChange={(e) => handleUpdateOpenLoop(currentScript.openLoops[0]?.id, currentScript.openLoops[0]?.loopHook, e.target.value)}
                  placeholder="مثال: الإجابة: تختار خامة البولي كربونات..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-border text-xs text-charcoal outline-none focus:border-falcon-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Guided Sections */}
        {currentScript.sections.map((section, idx) => (
          <div key={section.id} className="bento-card p-5 sm:p-6 transition-all focus-within:border-falcon-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-falcon-50 text-falcon-600 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-charcoal">{section.label}</h3>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted mb-3 bg-sand-50 p-2 rounded-xl border border-sand-border">
              💡 {section.prompt}
            </p>

            <textarea
              dir="auto"
              rows={3}
              value={section.content}
              onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
              placeholder="اكتب هنا بلهجة مصرية واضحة ومقنعة..."
              className="w-full px-4 py-3 rounded-2xl bg-white border border-sand-border text-sm text-charcoal outline-none focus:border-falcon-600 focus:ring-1 focus:ring-falcon-600/30 transition-all placeholder:text-charcoal-muted/50 leading-relaxed resize-y"
            />
          </div>
        ))}

      </div>

    </div>
  );
}
