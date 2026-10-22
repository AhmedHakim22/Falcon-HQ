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
  Calendar,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  History,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { OperationalTask, TaskCategory, TaskStatus } from '@/lib/types';
import { 
  getWeekInfo, 
  getWeekKey, 
  formatLocalDate, 
  ARABIC_DAYS, 
  ArabicDay,
  WeekInfo 
} from '@/lib/taskWeekUtils';

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
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'أحمد' | 'معاذ'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDailyRoutineCollapsed, setIsDailyRoutineCollapsed] = useState(false);

  // Week Navigator State: 0 = Current Week, 1 = Next Week, -1 = Past Week, etc.
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const currentWeekInfo = getWeekInfo(0);
  const selectedWeekInfo = getWeekInfo(weekOffset);
  const isCurrentWeekView = weekOffset === 0;

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('project');
  const [newTargetWeekOffset, setNewTargetWeekOffset] = useState<number>(weekOffset);
  const [scheduleType, setScheduleType] = useState<'general' | 'day' | 'date'>('general');
  const [newScheduledDay, setNewScheduledDay] = useState<ArabicDay>('السبت');
  const [newScheduledDate, setNewScheduledDate] = useState<string>('');
  const [newAssignee, setNewAssignee] = useState<'أحمد' | 'معاذ' | 'كلاهما'>('معاذ');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newXpReward, setNewXpReward] = useState(20);
  const [newNotes, setNewNotes] = useState('');

  // Active (non-deleted) tasks
  const activeTasks = tasks.filter((t) => !t.isDeleted);

  // Filtered by assignee
  const filteredTasks = activeTasks.filter((t) => {
    if (assigneeFilter === 'all') return true;
    return t.assigneeName === assigneeFilter || t.assigneeName === 'كلاهما';
  });

  // 1. Daily recurring tasks (Routine Checklist - Section 1)
  const dailyTasks = filteredTasks.filter((t) => t.category === 'daily_recurring');
  const completedDaily = dailyTasks.filter((t) => t.status === 'done').length;
  const totalDaily = dailyTasks.length;
  const dailyPercent = totalDaily > 0 ? Math.round((completedDaily / totalDaily) * 100) : 0;

  // 2. Weekly Project & Scheduled tasks (Kanban - Section 2)
  // Smart Rollover & Week Filtering Logic
  const weeklyProjectTasks = filteredTasks.filter((t) => {
    if (t.category === 'daily_recurring') return false;

    const taskWeekKey = t.targetWeek || getWeekKey(new Date(t.createdAt));

    if (isCurrentWeekView) {
      // Current Week: shows tasks targeted for this week PLUS any unfinished past tasks (Rollover)
      if (taskWeekKey === selectedWeekInfo.key) return true;
      if (taskWeekKey < currentWeekInfo.key && t.status !== 'done') return true; // Rolled over!
      return false;
    }

    // Past or Future Week: shows tasks scheduled for that specific week snapshot
    return taskWeekKey === selectedWeekInfo.key;
  });

  // Check if a task is rolled over from a past week
  const isRolledOverTask = (task: OperationalTask) => {
    const taskWeekKey = task.targetWeek || getWeekKey(new Date(task.createdAt));
    return isCurrentWeekView && taskWeekKey < currentWeekInfo.key && task.status !== 'done';
  };

  // Kanban columns
  const todoTasks = weeklyProjectTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = weeklyProjectTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = weeklyProjectTasks.filter((t) => t.status === 'done');

  const handleOpenAddModal = (presetWeekOffset?: number, presetDay?: ArabicDay) => {
    setNewTitle('');
    setNewNotes('');
    setNewCategory('project');
    setNewTargetWeekOffset(presetWeekOffset !== undefined ? presetWeekOffset : weekOffset);
    if (presetDay) {
      setScheduleType('day');
      setNewScheduledDay(presetDay);
    } else {
      setScheduleType('general');
    }
    setIsAddModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetWeekKey = getWeekInfo(newTargetWeekOffset).key;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      status: 'todo',
      assigneeName: newAssignee,
      priority: newPriority,
      xpReward: newXpReward,
      targetWeek: newCategory === 'project' ? targetWeekKey : undefined,
      scheduledDay: newCategory === 'project' && scheduleType === 'day' ? newScheduledDay : undefined,
      scheduledDate: newCategory === 'project' && scheduleType === 'date' && newScheduledDate ? newScheduledDate : undefined,
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
              مهام وتشغيل فالكون والجدولة
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 dark:text-falcon-400 border border-falcon-200 dark:border-falcon-900">
              {activeTasks.length} مهام نشطة
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-stone-400 mt-1">
            جدولة المهام للأسبوع القادم، استعراض الأسابيع الماضية، ومتابعة الروتين اليومي لأحمد ومعاذ
          </p>
        </div>

        {/* View Toggle (Kanban vs List) & Add Task Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center bg-sand-200/80 dark:bg-stone-800 p-1 rounded-2xl border border-sand-border dark:border-stone-700 text-xs font-bold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 shadow-xs'
                  : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>لوحة الكانبان والجدولة</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 shadow-xs'
                  : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>عرض القوائم</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/25 active:scale-95 transition-all mr-auto sm:mr-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Assignee: أحمد / معاذ / الكل) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-2xl border border-sand-border dark:border-stone-800 text-xs font-semibold">
          {[
            { id: 'all', label: 'كل الفريق' },
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
            <span>روتين اليوم: {completedDaily} من {totalDaily}</span>
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
          SECTION 1: DAILY RECURRING CHECKLIST (Pinned Top Routine)
          ===================================================================== */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 shadow-xs overflow-hidden">
        <div 
          onClick={() => setIsDailyRoutineCollapsed(!isDailyRoutineCollapsed)}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-sand-50/50 dark:hover:bg-stone-800/40 transition-colors border-b border-sand-border/50 dark:border-stone-800/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-charcoal dark:text-stone-100 flex items-center gap-2">
                <span>المهام اليومية المتكررة (Daily Checklist)</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted">
                  {dailyTasks.length} مهام
                </span>
              </h2>
              <p className="text-[11px] text-charcoal-muted dark:text-stone-400">
                الرد على المطبعة، رفع بوالص الشحن، متابعة استفسارات العملاء
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setNewCategory('daily_recurring');
                setIsAddModalOpen(true);
              }}
              className="px-2.5 py-1 text-xs font-bold text-falcon-600 hover:bg-falcon-50 dark:hover:bg-falcon-950/40 rounded-xl transition-all"
            >
              + إضافة روتين
            </button>
            <div className="p-1 text-stone-400">
              {isDailyRoutineCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {!isDailyRoutineCollapsed && (
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-sand-50/30 dark:bg-stone-950/20">
            {dailyTasks.length === 0 ? (
              <p className="col-span-full text-center py-4 text-xs text-charcoal-muted dark:text-stone-500">
                لا توجد مهام روتينية حالياً. أضف مهام مثل الرد على المطبعة لرفع إنتاجيتكم اليومية!
              </p>
            ) : (
              dailyTasks.map((task) => {
                const isDone = task.status === 'done';
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isDone
                        ? 'bg-sand-50/80 dark:bg-stone-900/40 border-sand-border dark:border-stone-800 opacity-70'
                        : 'bg-white dark:bg-stone-800 border-sand-border dark:border-stone-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
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
                        <p className={`text-xs font-bold text-charcoal dark:text-stone-100 break-words ${
                          isDone ? 'line-through text-stone-400 dark:text-stone-500' : ''
                        }`}>
                          {task.title}
                        </p>
                        {task.notes && (
                          <p className="text-[10px] text-charcoal-muted dark:text-stone-400 mt-0.5 break-words line-clamp-2">
                            {task.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 text-[9px] font-semibold">
                          <span className="px-1.5 py-0.5 rounded-md bg-sand-100 dark:bg-stone-700 text-charcoal dark:text-stone-300">
                            {task.assigneeName}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            +{task.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-stone-300 hover:text-red-500 transition-colors flex-shrink-0"
                      title="حذف المهمة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* =====================================================================
          SECTION 2: WEEK-BY-WEEK NAVIGATOR BAR (Past ← Current → Next)
          ===================================================================== */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-3xl border border-sand-border dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Navigation Arrows & Current Week Display */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-sand-100 hover:bg-sand-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-charcoal dark:text-stone-200 text-xs font-bold transition-all active:scale-95"
            title="الانتقال للأسبوع الماضي"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            <span>الأسبوع السابق</span>
          </button>

          <div className="flex flex-col items-center text-center px-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                weekOffset === 0 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : weekOffset > 0
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}>
                {selectedWeekInfo.label}
              </span>
              {weekOffset !== 0 && (
                <button
                  onClick={() => setWeekOffset(0)}
                  className="text-[11px] font-bold text-falcon-600 hover:underline"
                >
                  (العودة لليوم)
                </button>
              )}
            </div>
            <span className="text-xs font-bold text-charcoal dark:text-stone-300 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{selectedWeekInfo.rangeStr}</span>
            </span>
          </div>

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-sand-100 hover:bg-sand-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-charcoal dark:text-stone-200 text-xs font-bold transition-all active:scale-95"
            title="الانتقال للأسبوع القادم"
          >
            <span>الأسبوع القادم</span>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Quick Week Presets (الماضي / الحالي / القادم) */}
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setWeekOffset(-1)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              weekOffset === -1
                ? 'bg-sand-200 dark:bg-stone-700 text-charcoal dark:text-stone-100 border-stone-400 shadow-xs'
                : 'border-sand-border dark:border-stone-800 text-charcoal-muted hover:text-charcoal'
            }`}
          >
            الأسبوع الماضي
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              weekOffset === 0
                ? 'bg-falcon-600 text-white border-falcon-600 shadow-xs'
                : 'border-sand-border dark:border-stone-800 text-charcoal-muted hover:text-charcoal'
            }`}
          >
            هذا الأسبوع
          </button>
          <button
            onClick={() => setWeekOffset(1)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              weekOffset === 1
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'border-sand-border dark:border-stone-800 text-charcoal-muted hover:text-charcoal'
            }`}
          >
            الأسبوع القادم
          </button>
          <button
            onClick={() => handleOpenAddModal(weekOffset)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 border border-falcon-200 dark:border-falcon-900 hover:bg-falcon-100 transition-all mr-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>جدولة لهذا الأسبوع</span>
          </button>
        </div>
      </div>

      {/* Rollover Notification Banner if viewing current week and rolled-over tasks exist */}
      {isCurrentWeekView && weeklyProjectTasks.some((t) => isRolledOverTask(t)) && (
        <div className="p-3.5 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-700 dark:text-amber-400 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              يوجد مهام لم تكتمل من أسابيع سابقة تم ترحيلها تلقائياً لأسبوعك الحالي (إنجازها متأخراً يمنح 50% من الـ XP).
            </span>
          </div>
          <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-500/20">
            {weeklyProjectTasks.filter((t) => isRolledOverTask(t)).length} مهام مُرحّلة
          </span>
        </div>
      )}

      {/* =====================================================================
          SECTION 3: WEEKLY KANBAN BOARD VIEW (To Do, In Progress, Done)
          ===================================================================== */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Column 1: قيد الانتظار (To Do) */}
          <div className="bg-sand-50/80 dark:bg-stone-900/60 p-4 rounded-3xl border border-sand-border dark:border-stone-800 flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-sand-border dark:border-stone-800">
              <span className="text-xs font-extrabold text-charcoal dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>قيد الانتظار (To Do)</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted">
                  {todoTasks.length}
                </span>
                <button
                  onClick={() => handleOpenAddModal(weekOffset)}
                  className="p-1 text-stone-400 hover:text-falcon-600 rounded-lg hover:bg-white dark:hover:bg-stone-800 transition-colors"
                  title="إضافة مهمة لهذا العمود"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {todoTasks.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                  <p className="text-xs text-stone-400">لا توجد مهام تنتظر التنفيذ في هذا الأسبوع</p>
                  <button
                    onClick={() => handleOpenAddModal(weekOffset)}
                    className="mt-2 text-xs font-bold text-falcon-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>جدولة مهمة الآن</span>
                  </button>
                </div>
              ) : (
                todoTasks.map((t) => {
                  const isRolledOver = isRolledOverTask(t);
                  return (
                    <div 
                      key={t.id} 
                      className={`p-3.5 rounded-2xl bg-white dark:bg-stone-800 border shadow-xs flex flex-col justify-between gap-3 transition-all hover:border-falcon-400 ${
                        isRolledOver ? 'border-amber-400/60 dark:border-amber-500/40 bg-amber-50/20' : 'border-sand-border dark:border-stone-700'
                      }`}
                    >
                      <div>
                        {/* Day / Schedule Badge */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {t.scheduledDay && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              <span>يوم {t.scheduledDay}</span>
                            </span>
                          )}
                          {t.scheduledDate && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-charcoal dark:text-stone-300">
                              📅 {t.scheduledDate}
                            </span>
                          )}
                          {isRolledOver && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>مُرحّلة من الماضي (50% XP)</span>
                            </span>
                          )}
                        </div>

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
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold px-2 py-0.5 rounded bg-sand-100 dark:bg-stone-700 text-charcoal-muted dark:text-stone-300">
                            {t.assigneeName}
                          </span>
                          <span className="text-emerald-600 font-bold">
                            +{isRolledOver ? Math.max(5, Math.round((t.xpReward || 15) * 0.5)) : t.xpReward || 15} XP
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            className="text-stone-300 hover:text-red-500 p-1"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onUpdateTaskStatus(t.id, 'in_progress')}
                            className="flex items-center gap-1 text-falcon-600 dark:text-falcon-400 font-bold hover:underline"
                          >
                            <span>بدء العمل</span>
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: جاري التنفيذ (In Progress) */}
          <div className="bg-sand-50/80 dark:bg-stone-900/60 p-4 rounded-3xl border border-sand-border dark:border-stone-800 flex flex-col min-h-[480px]">
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
              {inProgressTasks.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-center p-4">
                  <p className="text-xs text-stone-400">لا توجد مهام قيد التنفيذ حالياً</p>
                </div>
              ) : (
                inProgressTasks.map((t) => {
                  const isRolledOver = isRolledOverTask(t);
                  return (
                    <div 
                      key={t.id} 
                      className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-blue-500/40 shadow-xs flex flex-col justify-between gap-3"
                    >
                      <div>
                        {/* Day / Schedule Badge */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {t.scheduledDay && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              <span>يوم {t.scheduledDay}</span>
                            </span>
                          )}
                          {isRolledOver && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>مُرحّلة من الماضي (50% XP)</span>
                            </span>
                          )}
                        </div>

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
                          إرجاع للانتظار
                        </button>
                        <button
                          onClick={() => onUpdateTaskStatus(t.id, 'done')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                        >
                          <span>إكمال ✓</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 3: تم الإنجاز (Done) */}
          <div className="bg-sand-50/80 dark:bg-stone-900/60 p-4 rounded-3xl border border-sand-border dark:border-stone-800 flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-sand-border dark:border-stone-800">
              <span className="text-xs font-extrabold text-charcoal dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>تم الإنجاز في هذا الأسبوع (Done)</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted">
                {doneTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {doneTasks.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-center p-4">
                  <p className="text-xs text-stone-400">لم تُنجز مهام بعد في هذا الأسبوع</p>
                </div>
              ) : (
                doneTasks.map((t) => (
                  <div 
                    key={t.id} 
                    className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 opacity-80 flex flex-col justify-between gap-3"
                  >
                    <div>
                      {t.isDelayed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1.5 inline-block">
                          أُنجزت متأخرة (خصم 50% XP)
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-charcoal dark:text-stone-100 line-through break-words text-stone-400">
                        {t.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-sand-border/50 dark:border-stone-700/50 text-[10px]">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        +{t.isDelayed ? Math.max(5, Math.round((t.xpReward || 15) * 0.5)) : t.xpReward || 15} XP مكتسبة
                      </span>
                      <button
                        onClick={() => onUpdateTaskStatus(t.id, 'in_progress')}
                        className="text-stone-400 hover:text-stone-600 font-bold"
                      >
                        إعادة فتح
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          VIEW 2: LIST VIEW
          ===================================================================== */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-charcoal dark:text-stone-100">
              قائمة مهام {selectedWeekInfo.label} ({weeklyProjectTasks.length} مهام)
            </h3>
            <span className="text-xs text-stone-400 font-bold">
              {selectedWeekInfo.rangeStr}
            </span>
          </div>

          <div className="space-y-2.5">
            {weeklyProjectTasks.length === 0 ? (
              <p className="text-center py-8 text-xs text-stone-400">لا توجد مهام مسجلة لهذا الأسبوع.</p>
            ) : (
              weeklyProjectTasks.map((task) => {
                const isDone = task.status === 'done';
                const isRolledOver = isRolledOverTask(task);
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isDone
                        ? 'bg-sand-50/70 dark:bg-stone-900/40 border-sand-border dark:border-stone-800 opacity-70'
                        : isRolledOver
                        ? 'bg-amber-50/20 border-amber-300 dark:border-amber-500/30'
                        : 'bg-white dark:bg-stone-800 border-sand-border dark:border-stone-700 shadow-xs'
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
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {task.scheduledDay && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                              يوم {task.scheduledDay}
                            </span>
                          )}
                          {isRolledOver && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600">
                              مُرحّلة من الماضي
                            </span>
                          )}
                        </div>
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
                          <span className="px-2 py-0.5 rounded bg-sand-200 dark:bg-stone-800 text-[10px] text-charcoal-muted">
                            الحالة: {task.status === 'done' ? 'مكتملة' : task.status === 'in_progress' ? 'قيد التنفيذ' : 'انتظار'}
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
      )}

      {/* =====================================================================
          ADD & SCHEDULE TASK MODAL
          ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-stone-900 border border-sand-border dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-sand-border dark:border-stone-800 mb-4">
              <h3 className="text-base font-bold text-charcoal dark:text-stone-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-falcon-600" />
                <span>إضافة وجدولة مهمة جديدة</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  عنوان المهمة *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: تجهيز وإرسال باتش جرابات الجلد للمطبعة..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-falcon-500"
                />
              </div>

              {/* Task Category (Daily Routine vs Project/Weekly) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                    تصنيف المهمة
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                  >
                    <option value="project">خطة / مهمة مجدولة أسبوعياً</option>
                    <option value="daily_recurring">روتين يومي متكرر</option>
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
                    <option value="أحمد">أحمد ✍️</option>
                    <option value="معاذ">معاذ 🎬</option>
                    <option value="كلاهما">كلاهما 🤝</option>
                  </select>
                </div>
              </div>

              {/* Scheduling Section for Projects/Weekly Tasks */}
              {newCategory === 'project' && (
                <div className="p-3.5 rounded-2xl bg-sand-50/80 dark:bg-stone-800/60 border border-sand-border dark:border-stone-700 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-falcon-600 dark:text-falcon-400">
                    <Calendar className="w-4 h-4" />
                    <span>جدولة المهمة زمنياً</span>
                  </div>

                  {/* Target Week */}
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal dark:text-stone-300 mb-1">
                      الأسبوع المستهدف
                    </label>
                    <select
                      value={newTargetWeekOffset}
                      onChange={(e) => setNewTargetWeekOffset(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                    >
                      <option value={0}>هذا الأسبوع ({getWeekInfo(0).rangeStr})</option>
                      <option value={1}>الأسبوع القادم ({getWeekInfo(1).rangeStr})</option>
                      <option value={2}>بعد أسبوعين ({getWeekInfo(2).rangeStr})</option>
                      {weekOffset !== 0 && weekOffset !== 1 && weekOffset !== 2 && (
                        <option value={weekOffset}>
                          الأسبوع المعروض حالياً: {getWeekInfo(weekOffset).label} ({getWeekInfo(weekOffset).rangeStr})
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Day or Specific Date Scheduling */}
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal dark:text-stone-300 mb-1.5">
                      تحديد موعد داخل الأسبوع
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setScheduleType('general')}
                        className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                          scheduleType === 'general'
                            ? 'bg-falcon-600 text-white border-falcon-600'
                            : 'bg-white dark:bg-stone-800 text-charcoal dark:text-stone-300 border-sand-border'
                        }`}
                      >
                        هدف عام طوال الأسبوع
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleType('day')}
                        className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                          scheduleType === 'day'
                            ? 'bg-falcon-600 text-white border-falcon-600'
                            : 'bg-white dark:bg-stone-800 text-charcoal dark:text-stone-300 border-sand-border'
                        }`}
                      >
                        يوم محدد
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleType('date')}
                        className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                          scheduleType === 'date'
                            ? 'bg-falcon-600 text-white border-falcon-600'
                            : 'bg-white dark:bg-stone-800 text-charcoal dark:text-stone-300 border-sand-border'
                        }`}
                      >
                        تاريخ بالتقويم
                      </button>
                    </div>

                    {scheduleType === 'day' && (
                      <div className="mt-2.5">
                        <select
                          value={newScheduledDay}
                          onChange={(e) => setNewScheduledDay(e.target.value as ArabicDay)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                        >
                          {ARABIC_DAYS.map((d) => (
                            <option key={d} value={d}>
                              يوم {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {scheduleType === 'date' && (
                      <div className="mt-2.5">
                        <input
                          type="date"
                          value={newScheduledDate}
                          onChange={(e) => setNewScheduledDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Priority & Reward */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                    الأولوية
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                  >
                    <option value="high">عاجلة / أولوية قصوى 🔴</option>
                    <option value="medium">متوسطة الأهمية 🟡</option>
                    <option value="low">عادية / وقت الفراغ 🟢</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                    مكافأة الإنجاز (XP)
                  </label>
                  <select
                    value={newXpReward}
                    onChange={(e) => setNewXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs font-bold"
                  >
                    <option value={10}>10 XP (مهمة بسيطة)</option>
                    <option value={15}>15 XP (مهمة متوسطة)</option>
                    <option value={20}>20 XP (مهمة أساسية)</option>
                    <option value={35}>35 XP (مشروع أو شحنة كبيرة)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal dark:text-stone-200 mb-1">
                  ملاحظات أو روابط إضافية
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="أي تعليمات أو تفاصيل للمهمة..."
                  className="w-full px-3 py-2 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-xs text-charcoal dark:text-stone-100 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-border dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-sand-border dark:border-stone-700 text-xs font-bold hover:bg-sand-100 dark:hover:bg-stone-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold shadow-md shadow-falcon-600/25 active:scale-95 transition-all"
                >
                  حفظ وجدولة المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
