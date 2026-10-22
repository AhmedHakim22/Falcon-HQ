'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Columns, 
  ListTodo, 
  Plus, 
  User, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  RotateCcw,
  Flame,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { OperationalTask, TaskCategory, TaskStatus } from '@/lib/types';

interface TasksViewProps {
  tasks: OperationalTask[];
  onAddTask: (task: Omit<OperationalTask, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  currentUser: string;
}

export function TasksView({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  currentUser,
}: TasksViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('list');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'أحمد' | 'معاذ'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('daily_recurring');
  const [newAssignee, setNewAssignee] = useState<'أحمد' | 'معاذ' | 'كلاهما'>('معاذ');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newXpReward, setNewXpReward] = useState(15);
  const [newNotes, setNewNotes] = useState('');

  // Active (non-deleted) tasks
  const activeTasks = tasks.filter((t) => !t.isDeleted);

  // Filtered by assignee
  const filteredTasks = activeTasks.filter((t) => {
    if (assigneeFilter === 'all') return true;
    return t.assigneeName === assigneeFilter || t.assigneeName === 'كلاهما';
  });

  // Daily recurring vs Projects
  const dailyTasks = filteredTasks.filter((t) => t.category === 'daily_recurring');
  const projectTasks = filteredTasks.filter((t) => t.category === 'project');

  // Kanban columns
  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  // Daily Completion Stats
  const totalDaily = dailyTasks.length;
  const completedDaily = dailyTasks.filter((t) => t.status === 'done').length;
  const dailyPercent = totalDaily > 0 ? Math.round((completedDaily / totalDaily) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      status: 'todo',
      assigneeName: newAssignee,
      priority: newPriority,
      xpReward: newXpReward,
      notes: newNotes.trim() || undefined,
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-sand-border dark:border-stone-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-charcoal dark:text-stone-100">
              مهام وتشغيل فالكون اليومية
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 dark:text-falcon-400 border border-falcon-200 dark:border-falcon-900">
              {activeTasks.length} مهام
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
            متابعة المطبعة، شحن الأوردرات، والمهام التشغيلية اليومية لأحمد ومعاذ
          </p>
        </div>

        {/* View Toggle (List vs Kanban) & Add Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Mode Switcher */}
          <div className="flex items-center bg-sand-200/80 dark:bg-stone-800 p-1 rounded-2xl border border-sand-border dark:border-stone-700 text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 shadow-xs'
                  : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>القائمة اليومية</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 shadow-xs'
                  : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>لوحة الكانبان</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/25 active:scale-95 transition-all mr-auto sm:mr-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Assignee: أحمد / معاذ / الكل) + Daily Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-2xl border border-sand-border dark:border-stone-800 text-xs font-semibold">
          {[
            { id: 'all', label: 'كل المسؤولين' },
            { id: 'أحمد', label: 'مهام أحمد ✍️' },
            { id: 'معاذ', label: 'مهام معاذ 🎬' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAssigneeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                assigneeFilter === tab.id
                  ? 'bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 dark:text-falcon-400 font-bold border border-falcon-200 dark:border-falcon-900 shadow-xs'
                  : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily Streak / Completion Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-stone-900 px-4 py-2 rounded-2xl border border-sand-border dark:border-stone-800 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-falcon-600 dark:text-falcon-400">
            <Flame className="w-4 h-4 fill-falcon-600 dark:fill-falcon-500 animate-pulse" />
            <span>إنجاز روتين اليوم: {completedDaily} من {totalDaily}</span>
          </div>
          <div className="w-24 bg-sand-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyPercent}%` }}
            />
          </div>
          <span className="font-extrabold text-charcoal dark:text-stone-200">{dailyPercent}%</span>
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: DAILY LIST VIEW (Checklist Style)
          ===================================================================== */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: Daily Recurring Tasks (الروتين اليومي: مطبعة، بوالص، عملاء) */}
          <div className="bento-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal dark:text-stone-100">
                      المهام اليومية المتكررة (Daily Checklist)
                    </h3>
                    <p className="text-[11px] text-charcoal-muted dark:text-stone-400">
                      تتجدد كل يوم للمحافظة على تدفق أوردرات الجرابات
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-falcon-600 bg-falcon-50 dark:bg-falcon-950/60 px-2.5 py-1 rounded-full">
                  {dailyTasks.length} مهام
                </span>
              </div>

              <div className="space-y-2.5">
                {dailyTasks.length === 0 ? (
                  <p className="text-center py-8 text-xs text-charcoal-muted dark:text-stone-500">
                    لا توجد مهام يومية حالياً.
                  </p>
                ) : (
                  dailyTasks.map((task) => {
                    const isDone = task.status === 'done';
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          isDone
                            ? 'bg-sand-50/70 dark:bg-stone-900/40 border-sand-border dark:border-stone-800 opacity-70'
                            : 'bg-white dark:bg-stone-800/80 border-sand-border dark:border-stone-700 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, isDone ? 'todo' : 'done')}
                            className="mt-0.5 text-falcon-600 dark:text-falcon-400 hover:scale-110 transition-transform flex-shrink-0"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100 break-words ${
                              isDone ? 'line-through text-stone-400 dark:text-stone-500' : ''
                            }`}>
                              {task.title}
                            </p>
                            {task.notes && (
                              <p className="text-[11px] text-charcoal-muted dark:text-stone-400 mt-1 break-words">
                                {task.notes}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold">
                              <span className="px-2 py-0.5 rounded-md bg-sand-100 dark:bg-stone-700 text-charcoal dark:text-stone-300">
                                مسؤول: {task.assigneeName}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400">
                                +{task.xpReward} XP
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-red-500 transition-colors flex-shrink-0"
                          title="حذف المهمة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Column 2: One-off / Project Tasks (مشاريع وتطوير البراند) */}
          <div className="bento-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal dark:text-stone-100">
                      مهام التطوير والمشاريع (Project Tasks)
                    </h3>
                    <p className="text-[11px] text-charcoal-muted dark:text-stone-400">
                      أهداف غير متكررة لتطوير خامات الجرابات والتصوير
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
                  {projectTasks.length} مهام
                </span>
              </div>

              <div className="space-y-2.5">
                {projectTasks.length === 0 ? (
                  <p className="text-center py-8 text-xs text-charcoal-muted dark:text-stone-500">
                    لا توجد مهام مشاريع حالياً.
                  </p>
                ) : (
                  projectTasks.map((task) => {
                    const isDone = task.status === 'done';
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          isDone
                            ? 'bg-sand-50/70 dark:bg-stone-900/40 border-sand-border dark:border-stone-800 opacity-70'
                            : 'bg-white dark:bg-stone-800/80 border-sand-border dark:border-stone-700 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, isDone ? 'todo' : 'done')}
                            className="mt-0.5 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform flex-shrink-0"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs sm:text-sm font-bold text-charcoal dark:text-stone-100 break-words ${
                              isDone ? 'line-through text-stone-400 dark:text-stone-500' : ''
                            }`}>
                              {task.title}
                            </p>
                            {task.notes && (
                              <p className="text-[11px] text-charcoal-muted dark:text-stone-400 mt-1 break-words">
                                {task.notes}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold">
                              <span className="px-2 py-0.5 rounded-md bg-sand-100 dark:bg-stone-700 text-charcoal dark:text-stone-300">
                                مسؤول: {task.assigneeName}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400">
                                +{task.xpReward} XP
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-red-500 transition-colors flex-shrink-0"
                          title="حذف المهمة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          VIEW 2: KANBAN BOARD VIEW (To Do, In Progress, Done)
          ===================================================================== */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Column 1: قيد الانتظار (To Do) */}
          <div className="bg-sand-50/80 dark:bg-stone-900/60 p-4 rounded-3xl border border-sand-border dark:border-stone-800 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-sand-border dark:border-stone-800">
              <span className="text-xs font-extrabold text-charcoal dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>قيد الانتظار (To Do)</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted">
                {todoTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {todoTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 shadow-xs flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal dark:text-stone-100 break-words">
                      {t.title}
                    </h4>
                    {t.notes && (
                      <p className="text-[11px] text-charcoal-muted dark:text-stone-400 mt-1 break-words">
                        {t.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-sand-border/50 dark:border-stone-700/50 text-[10px]">
                    <span className="font-semibold text-charcoal-muted dark:text-stone-400">
                      {t.assigneeName}
                    </span>
                    <button
                      onClick={() => onUpdateTaskStatus(t.id, 'in_progress')}
                      className="flex items-center gap-1 text-falcon-600 dark:text-falcon-400 font-bold hover:underline"
                    >
                      <span>بدء العمل</span>
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: جاري التنفيذ (In Progress) */}
          <div className="bg-sand-50/80 dark:bg-stone-900/60 p-4 rounded-3xl border border-sand-border dark:border-stone-800 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-sand-border dark:border-stone-800">
              <span className="text-xs font-extrabold text-charcoal dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <span>جاري التنفيذ (In Progress)</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {inProgressTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-blue-500/30 dark:border-blue-500/40 shadow-xs flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal dark:text-stone-100 break-words">
                      {t.title}
                    </h4>
                    {t.notes && (
                      <p className="text-[11px] text-charcoal-muted dark:text-stone-400 mt-1 break-words">
                        {t.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-sand-border/50 dark:border-stone-700/50 text-[10px]">
                    <button
                      onClick={() => onUpdateTaskStatus(t.id, 'todo')}
                      className="text-stone-400 hover:text-stone-600 font-bold"
                    >
                      إرجاع
                    </button>
                    <button
                      onClick={() => onUpdateTaskStatus(t.id, 'done')}
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      <span>إكمال ✓</span>
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: تم الإنجاز (Done) */}
          <div className="bg-sand-50/80 dark:bg-stone-900/60 p-4 rounded-3xl border border-sand-border dark:border-stone-800 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-sand-border dark:border-stone-800">
              <span className="text-xs font-extrabold text-charcoal dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>تم الإنجاز (Done)</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted">
                {doneTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {doneTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 opacity-80 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal dark:text-stone-100 line-through break-words text-stone-400">
                      {t.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-sand-border/50 dark:border-stone-700/50 text-[10px]">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +{t.xpReward} XP مكتسبة
                    </span>
                    <button
                      onClick={() => onUpdateTaskStatus(t.id, 'in_progress')}
                      className="text-stone-400 hover:text-stone-600 font-bold"
                    >
                      إعادة فتح
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-stone-900 border border-sand-border dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-sand-border dark:border-stone-800 mb-4">
              <h3 className="text-base font-bold text-charcoal dark:text-stone-100">
                إضافة مهمة جديدة
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  عنوان المهمة *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: متابعة تشغيل كفرات آيفون 15 مع المطبعة..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-falcon-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                    نوع المهمة
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                  >
                    <option value="daily_recurring">روتين يومي متكرر</option>
                    <option value="project">مشروع / تطوير</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                    المسؤول
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                  >
                    <option value="أحمد">أحمد</option>
                    <option value="معاذ">معاذ</option>
                    <option value="كلاهما">كلاهما</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="أي تعليمات أو تفاصيل للمهمة..."
                  className="w-full px-3 py-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-border dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-sand-border text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-md"
                >
                  حفظ المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
