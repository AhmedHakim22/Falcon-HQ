'use client';

import React, { useState } from 'react';
import { Trash2, RotateCcw, X, AlertTriangle, Lightbulb, FileText, CheckSquare } from 'lucide-react';
import { Idea, Script, OperationalTask } from '@/lib/types';

interface TrashBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedIdeas: Idea[];
  deletedScripts: Script[];
  deletedTasks: OperationalTask[];
  onRestoreIdea: (id: string) => void;
  onRestoreScript: (id: string) => void;
  onRestoreTask: (id: string) => void;
  onPurgeIdea: (id: string) => void;
  onPurgeScript: (id: string) => void;
  onPurgeTask: (id: string) => void;
  onEmptyTrash: () => void;
}

export function TrashBinModal({
  isOpen,
  onClose,
  deletedIdeas,
  deletedScripts,
  deletedTasks,
  onRestoreIdea,
  onRestoreScript,
  onRestoreTask,
  onPurgeIdea,
  onPurgeScript,
  onPurgeTask,
  onEmptyTrash,
}: TrashBinModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'ideas' | 'scripts' | 'tasks'>('all');

  if (!isOpen) return null;

  const totalCount = deletedIdeas.length + deletedScripts.length + deletedTasks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-stone-900 border border-sand-border dark:border-stone-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-sand-border dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-charcoal dark:text-stone-100 flex items-center gap-2">
                <span>سلة المهملات</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted dark:text-stone-300">
                  {totalCount} عناصر
                </span>
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-stone-400">
                يمكنك استعادة أي عنصر أو مسحه نهائياً في أي وقت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalCount > 0 && (
              <button
                onClick={onEmptyTrash}
                className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors"
                title="مسح كل العناصر نهائياً"
              >
                تفريغ السلة بالكامل
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-charcoal-muted hover:text-charcoal dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pt-3 pb-2 flex items-center gap-2 border-b border-sand-border dark:border-stone-800 text-xs">
          {[
            { id: 'all', label: `الكل (${totalCount})` },
            { id: 'ideas', label: `أفكار (${deletedIdeas.length})` },
            { id: 'scripts', label: `سكريبتات (${deletedScripts.length})` },
            { id: 'tasks', label: `مهام (${deletedTasks.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeSubTab === tab.id
                  ? 'bg-falcon-50 dark:bg-falcon-950/70 text-falcon-600 dark:text-falcon-400 font-bold border border-falcon-200 dark:border-falcon-900'
                  : 'text-charcoal-muted dark:text-stone-400 hover:bg-sand-100 dark:hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {totalCount === 0 ? (
            <div className="py-16 text-center">
              <Trash2 className="w-12 h-12 text-sand-400 dark:text-stone-600 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm font-bold text-charcoal dark:text-stone-200">سلة المهملات فارغة</p>
              <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
                أي فكرة، سكريبت، أو مهمة تحذفها ستظهر هنا أولاً لتتمكن من استرجاعها بأمان
              </p>
            </div>
          ) : (
            <>
              {/* Deleted Ideas */}
              {(activeSubTab === 'all' || activeSubTab === 'ideas') &&
                deletedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3.5 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-border dark:border-stone-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100 break-words">
                          {idea.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-charcoal-muted dark:text-stone-400 mt-0.5">
                          <span>فكرة • بواسطة {idea.creatorName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onRestoreIdea(idea.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-sand-border dark:border-stone-600 text-charcoal dark:text-stone-200 hover:text-emerald-600 text-xs font-semibold shadow-xs transition-colors"
                        title="استعادة الفكرة"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>استعادة</span>
                      </button>
                      <button
                        onClick={() => onPurgeIdea(idea.id)}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        title="حذف نهائي"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

              {/* Deleted Scripts */}
              {(activeSubTab === 'all' || activeSubTab === 'scripts') &&
                deletedScripts.map((script) => (
                  <div
                    key={script.id}
                    className="p-3.5 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-border dark:border-stone-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100 break-words">
                          {script.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-charcoal-muted dark:text-stone-400 mt-0.5">
                          <span>سكريبت • {script.framework} • بواسطة {script.authorName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onRestoreScript(script.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-sand-border dark:border-stone-600 text-charcoal dark:text-stone-200 hover:text-emerald-600 text-xs font-semibold shadow-xs transition-colors"
                        title="استعادة السكريبت"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>استعادة</span>
                      </button>
                      <button
                        onClick={() => onPurgeScript(script.id)}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        title="حذف نهائي"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

              {/* Deleted Tasks */}
              {(activeSubTab === 'all' || activeSubTab === 'tasks') &&
                deletedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-border dark:border-stone-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100 break-words">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-charcoal-muted dark:text-stone-400 mt-0.5">
                          <span>مهمة • مسندة لـ {task.assigneeName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onRestoreTask(task.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-sand-border dark:border-stone-600 text-charcoal dark:text-stone-200 hover:text-emerald-600 text-xs font-semibold shadow-xs transition-colors"
                        title="استعادة المهمة"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>استعادة</span>
                      </button>
                      <button
                        onClick={() => onPurgeTask(task.id)}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        title="حذف نهائي"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
