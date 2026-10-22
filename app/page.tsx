'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BentoGridHome } from '@/components/BentoGridHome';
import { IdeaBankView } from '@/components/IdeaBankView';
import { ScriptStudioView } from '@/components/ScriptStudioView';
import { TasksView } from '@/components/TasksView';
import { ChatScratchpadView } from '@/components/ChatScratchpadView';
import { BusinessOutcomesView } from '@/components/BusinessOutcomesView';
import { GamificationView } from '@/components/GamificationView';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';
import { EditIdeaModal } from '@/components/EditIdeaModal';
import { PriorityModal } from '@/components/PriorityModal';
import { TrashBinModal } from '@/components/TrashBinModal';
import { UndoToast } from '@/components/UndoToast';
import { 
  getStoredIdeas, 
  saveStoredIdeas, 
  getStoredScripts, 
  saveStoredScripts, 
  getStoredOutcomes, 
  saveStoredOutcomes, 
  clearStoredOutcomes,
  getStoredTasks,
  saveStoredTasks,
  getStoredChatThoughts,
  saveStoredChatThoughts,
  getStoredXpEvents, 
  addXpEvent,
  saveStoredXpEvents,
  clearStoredXpEvents,
  getStoredStreak,
  saveStoredStreak,
  getStoredActiveUser,
  saveStoredActiveUser,
  getStoredTheme,
  saveStoredTheme,
  getStoredPerformance,
  saveStoredPerformance,
  downloadBackupJSON,
  INITIAL_TEAM_QUESTS 
} from '@/lib/storage';
import { 
  fetchRemoteData, 
  syncIdeaToSupabase, 
  syncScriptToSupabase, 
  syncOutcomeToSupabase, 
  deleteOutcomeFromSupabase,
  clearAllOutcomesFromSupabase,
  syncXpEventToSupabase, 
  deleteXpEventFromSupabase,
  clearAllXpEventsFromSupabase,
  deleteIdeaFromSupabase,
  restoreIdeaInSupabase,
  purgeIdeaPermanentlyFromSupabase,
  deleteScriptFromSupabase,
  restoreScriptInSupabase,
  syncChatThoughtsToSupabase,
  syncTasksToSupabase,
  broadcastChatMessage,
  broadcastDataChange,
  subscribeToRealtimeChanges, 
  generateUUID 
} from '@/lib/supabaseSync';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { 
  Idea, 
  Script, 
  BusinessOutcome, 
  OperationalTask, 
  ChatThought, 
  XpEvent, 
  PerformanceConfig, 
  IdeaStatus, 
  ScriptStatus,
  TaskStatus,
  resolveIdeaType,
  resolveDbCategory
} from '@/lib/types';
import { calculatePriorityScore } from '@/lib/priority';
import { getInitialSectionsForFramework } from '@/lib/frameworks';
import { Plus } from 'lucide-react';

export default function FalconHQApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'ideas' | 'scripts' | 'tasks' | 'scratchpad' | 'results' | 'gamification'>('home');
  const [currentUser, setCurrentUser] = useState<string>('أحمد');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // App Data State
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [outcomes, setOutcomes] = useState<BusinessOutcome[]>([]);
  const [tasks, setTasks] = useState<OperationalTask[]>([]);
  const [chatThoughts, setChatThoughts] = useState<ChatThought[]>([]);
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);
  const [performance, setPerformance] = useState<PerformanceConfig>(getStoredPerformance());
  const [streakDays, setStreakDays] = useState<number>(0);
  
  // Modals & Active selections
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [priorityModalIdea, setPriorityModalIdea] = useState<Idea | null>(null);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [activeScript, setActiveScript] = useState<Script | null>(null);
  const [isTrashBinOpen, setIsTrashBinOpen] = useState(false);

  // Undo Toast state (Points 4 & 5)
  const [undoToast, setUndoToast] = useState<{ message: string; undoAction: () => void } | null>(null);

  // Theme application
  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Hydrate from LocalStorage first, then fetch live from Supabase & subscribe to Realtime
  useEffect(() => {
    // 1. Instant local render from buffer
    setIdeas(getStoredIdeas());
    const initialScripts = getStoredScripts();
    setScripts(initialScripts);
    if (initialScripts.length > 0) setActiveScript(initialScripts[0]);
    setOutcomes(getStoredOutcomes());
    setTasks(getStoredTasks());
    setChatThoughts(getStoredChatThoughts());
    setXpEvents(getStoredXpEvents());
    setPerformance(getStoredPerformance());
    setStreakDays(getStoredStreak());
    
    // Restore preferred user persona (أحمد / معاذ)
    const savedUser = getStoredActiveUser();
    if (savedUser) setCurrentUser(savedUser);

    // 2. Dedicated refresh routine from Supabase
    const refreshData = async () => {
      try {
        const remote = await fetchRemoteData();
        if (remote.ideas !== null) {
          setIdeas(remote.ideas);
          saveStoredIdeas(remote.ideas);
        }
        if (remote.scripts !== null) {
          setScripts(remote.scripts);
          saveStoredScripts(remote.scripts);
          setActiveScript((prev) => {
            if (!prev && remote.scripts && remote.scripts.length > 0) return remote.scripts[0];
            if (prev && remote.scripts) {
              const updated = remote.scripts.find((s) => s.id === prev.id);
              return updated || remote.scripts[0] || null;
            }
            return prev;
          });
        }
        if (remote.outcomes !== null) {
          setOutcomes(remote.outcomes);
          saveStoredOutcomes(remote.outcomes);
        }
        if (remote.xpEvents !== null) {
          setXpEvents(remote.xpEvents);
        }
        if (remote.chatThoughts !== null) {
          setChatThoughts((prev) => {
            const map = new Map<string, ChatThought>();
            prev.forEach((t) => map.set(t.id, t));
            remote.chatThoughts!.forEach((t) => map.set(t.id, t));
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            saveStoredChatThoughts(merged);
            return merged;
          });
        }
        if (remote.tasks !== null) {
          setTasks((prev) => {
            const map = new Map<string, OperationalTask>();
            prev.forEach((t) => map.set(t.id, t));
            remote.tasks!.forEach((t) => map.set(t.id, t));
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            saveStoredTasks(merged);
            return merged;
          });
        }
      } catch (err) {
        console.warn('Sync refresh error:', err);
      }
    };

    // Initial fetch from Supabase
    refreshData();

    // Realtime Listener
    const unsubscribe = subscribeToRealtimeChanges(
      () => {
        refreshData();
      },
      (incomingThought, needsFetch) => {
        setChatThoughts((prev) => {
          if (prev.some((t) => t.id === incomingThought.id)) return prev;
          const updated = [...prev, incomingThought].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          saveStoredChatThoughts(updated);
          return updated;
        });

        if (needsFetch) {
          refreshData();
        }
      }
    );

    // Background Heartbeat Polling
    const pollInterval = setInterval(() => {
      refreshData();
    }, 6000);

    const handleFocusSync = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };

    window.addEventListener('focus', handleFocusSync);
    document.addEventListener('visibilitychange', handleFocusSync);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocusSync);
      document.removeEventListener('visibilitychange', handleFocusSync);
    };
  }, []);

  // Compute total XP
  const totalXp = xpEvents.reduce((acc, ev) => acc + ev.xpAmount, 0);

  // Deleted items count for Trash Bin badge
  const deletedIdeas = ideas.filter((i) => i.isDeleted);
  const deletedScripts = scripts.filter((s) => s.isDeleted);
  const deletedTasks = tasks.filter((t) => t.isDeleted);
  const totalDeletedCount = deletedIdeas.length + deletedScripts.length + deletedTasks.length;

  // Handlers: Save Idea
  const handleSaveIdea = (newIdeaData: Partial<Idea>, nextAction: 'start_script' | 'save_inbox' | 'action_plan') => {
    const newId = generateUUID();
    const ideaType = newIdeaData.ideaType || resolveIdeaType(newIdeaData);
    const category = resolveDbCategory({ ...newIdeaData, ideaType });
    const newIdea: Idea = {
      id: newId,
      title: newIdeaData.title || 'فكرة جديدة',
      category,
      ideaType,
      status: newIdeaData.status || 'inbox',
      sourceUrl: newIdeaData.sourceUrl || '',
      notes: newIdeaData.notes || '',
      voiceNoteBase64: newIdeaData.voiceNoteBase64,
      creatorName: newIdeaData.creatorName || currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedIdeas = [newIdea, ...ideas];
    setIdeas(updatedIdeas);
    saveStoredIdeas(updatedIdeas);
    syncIdeaToSupabase(newIdea);

    // Award XP
    const event = addXpEvent({
      eventType: 'idea_created',
      xpAmount: 5,
      description: `تسجيل فكرة جديدة: ${newIdea.title}`,
    });
    setXpEvents((prev) => [event, ...prev]);
    syncXpEventToSupabase(event);

    if (nextAction === 'start_script') {
      handleStartScriptFromIdea(newIdea);
    }
  };

  // Handlers: Update Existing Idea (Point 7)
  const handleUpdateIdea = (updatedIdea: Idea) => {
    const ideaType = resolveIdeaType(updatedIdea);
    const category = resolveDbCategory({ ...updatedIdea, ideaType });
    const normalizedIdea: Idea = {
      ...updatedIdea,
      ideaType,
      category,
    };
    const updated = ideas.map((i) => (i.id === normalizedIdea.id ? normalizedIdea : i));
    setIdeas(updated);
    saveStoredIdeas(updated);
    syncIdeaToSupabase(normalizedIdea);
  };

  // Handlers: Soft Delete Idea (Points 4 & 5)
  const handleDeleteIdea = (ideaId: string) => {
    const target = ideas.find((i) => i.id === ideaId);
    if (!target) return;

    const updated = ideas.map((i) => (i.id === ideaId ? { ...i, isDeleted: true, deletedAt: new Date().toISOString() } : i));
    setIdeas(updated);
    saveStoredIdeas(updated);
    deleteIdeaFromSupabase(ideaId);

    // Undo Toast
    setUndoToast({
      message: `تم نقل الفكرة "${target.title.slice(0, 30)}..." لسلة المهملات`,
      undoAction: () => {
        handleRestoreIdea(ideaId);
        setUndoToast(null);
      },
    });
  };

  // Handlers: Restore Idea from Trash
  const handleRestoreIdea = (ideaId: string) => {
    const updated = ideas.map((i) => (i.id === ideaId ? { ...i, isDeleted: false, deletedAt: undefined } : i));
    setIdeas(updated);
    saveStoredIdeas(updated);
    restoreIdeaInSupabase(ideaId);
  };

  // Handlers: Purge Idea Permanently
  const handlePurgeIdea = (ideaId: string) => {
    const updated = ideas.filter((i) => i.id !== ideaId);
    setIdeas(updated);
    saveStoredIdeas(updated);
    purgeIdeaPermanentlyFromSupabase(ideaId);
  };

  // Handlers: Start Script from Idea
  const handleStartScriptFromIdea = (idea: Idea) => {
    const scriptId = generateUUID();
    const newScript: Script = {
      id: scriptId,
      ideaId: idea.id,
      title: `سكريبت: ${idea.title}`,
      framework: 'AIDA',
      openLoopsLevel: 'off',
      sections: getInitialSectionsForFramework('AIDA'),
      openLoops: [],
      status: 'writing',
      authorName: currentUser,
      estimatedDurationSeconds: 0,
      wordCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedScripts = [newScript, ...scripts];
    setScripts(updatedScripts);
    setActiveScript(newScript);
    saveStoredScripts(updatedScripts);
    syncScriptToSupabase(newScript);

    // Update Idea status
    const updatedIdeas = ideas.map((i) =>
      i.id === idea.id ? { ...i, status: 'scripting' as IdeaStatus, scriptIds: [...(i.scriptIds || []), scriptId] } : i
    );
    setIdeas(updatedIdeas);
    saveStoredIdeas(updatedIdeas);
    const updatedIdea = updatedIdeas.find((i) => i.id === idea.id);
    if (updatedIdea) syncIdeaToSupabase(updatedIdea);

    setActiveTab('scripts');
  };

  // Handlers: Save Ratings
  const handleSaveRatings = (
    ideaId: string,
    ratings: { goalFit: number; customerValue: number; reach: number; ease: number }
  ) => {
    const totalScore = calculatePriorityScore(ratings);
    const updatedIdeas = ideas.map((idea) => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          goalFitScore: ratings.goalFit,
          customerValueScore: ratings.customerValue,
          reachScore: ratings.reach,
          easeScore: ratings.ease,
          totalPriorityScore: totalScore,
          updatedAt: new Date().toISOString(),
        };
      }
      return idea;
    });

    setIdeas(updatedIdeas);
    saveStoredIdeas(updatedIdeas);
    const updatedIdea = updatedIdeas.find((i) => i.id === ideaId);
    if (updatedIdea) syncIdeaToSupabase(updatedIdea);

    const event = addXpEvent({
      eventType: 'idea_rated',
      xpAmount: 5,
      description: `تقييم أولوية فكرة (درجة ${totalScore || 0})`,
    });
    setXpEvents((prev) => [event, ...prev]);
    syncXpEventToSupabase(event);
  };

  // Handlers: Save Script
  const handleSaveScript = (updatedScript: Script) => {
    const updatedScripts = scripts.map((s) => (s.id === updatedScript.id ? updatedScript : s));
    setScripts(updatedScripts);
    setActiveScript(updatedScript);
    saveStoredScripts(updatedScripts);
    syncScriptToSupabase(updatedScript);
  };

  // Handlers: Update Script Status
  const handleUpdateScriptStatus = (scriptId: string, status: ScriptStatus) => {
    const updatedScripts = scripts.map((s) => {
      if (s.id === scriptId) {
        return { ...s, status, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    setScripts(updatedScripts);
    const updatedScript = updatedScripts.find((s) => s.id === scriptId);
    if (updatedScript) {
      setActiveScript(updatedScript);
      syncScriptToSupabase(updatedScript);
    }
    saveStoredScripts(updatedScripts);

    if (status === 'review_ready') {
      const ev = addXpEvent({
        eventType: 'script_completed',
        xpAmount: 15,
        description: 'إكمال مسودة سكريبت وإرساله للمراجعة',
      });
      setXpEvents((prev) => [ev, ...prev]);
      syncXpEventToSupabase(ev);
    } else if (status === 'ready_to_film') {
      const ev = addXpEvent({
        eventType: 'script_approved',
        xpAmount: 25,
        description: 'اعتماد سكريبت وتجهيزه للتصوير',
      });
      setXpEvents((prev) => [ev, ...prev]);
      syncXpEventToSupabase(ev);
    }
  };

  // Handlers: Soft Delete Script
  const handleDeleteScript = (scriptId: string) => {
    const target = scripts.find((s) => s.id === scriptId);
    if (!target) return;

    const updated = scripts.map((s) => (s.id === scriptId ? { ...s, isDeleted: true, deletedAt: new Date().toISOString() } : s));
    setScripts(updated);
    saveStoredScripts(updated);
    deleteScriptFromSupabase(scriptId);

    setUndoToast({
      message: `تم نقل السكريبت "${target.title.slice(0, 30)}..." لسلة المهملات`,
      undoAction: () => {
        handleRestoreScript(scriptId);
        setUndoToast(null);
      },
    });
  };

  const handleRestoreScript = (scriptId: string) => {
    const updated = scripts.map((s) => (s.id === scriptId ? { ...s, isDeleted: false, deletedAt: undefined } : s));
    setScripts(updated);
    saveStoredScripts(updated);
    restoreScriptInSupabase(scriptId);
  };

  const handlePurgeScript = (scriptId: string) => {
    const updated = scripts.filter((s) => s.id !== scriptId);
    setScripts(updated);
    saveStoredScripts(updated);
  };

  // Handlers: Operational Tasks (Points 3, 11, 14)
  const handleAddTask = (taskData: Omit<OperationalTask, 'id' | 'createdAt'>) => {
    const newTask: OperationalTask = {
      ...taskData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveStoredTasks(updated);
    syncTasksToSupabase(updated);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const target = tasks.find((t) => t.id === taskId);
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          completedAt: status === 'done' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    setTasks(updated);
    saveStoredTasks(updated);
    syncTasksToSupabase(updated);

    if (status === 'done' && target && target.status !== 'done') {
      const ev = addXpEvent({
        eventType: 'task_completed',
        xpAmount: target.xpReward || 15,
        description: `إتمام مهمة تشغيلية: ${target.title}`,
      });
      setXpEvents((prev) => [ev, ...prev]);
      syncXpEventToSupabase(ev);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const updated = tasks.map((t) => (t.id === taskId ? { ...t, isDeleted: true, deletedAt: new Date().toISOString() } : t));
    setTasks(updated);
    saveStoredTasks(updated);
    syncTasksToSupabase(updated);

    setUndoToast({
      message: `تم نقل المهمة "${target.title.slice(0, 30)}..." لسلة المهملات`,
      undoAction: () => {
        handleRestoreTask(taskId);
        setUndoToast(null);
      },
    });
  };

  const handleRestoreTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, isDeleted: false, deletedAt: undefined } : t));
    setTasks(updated);
    saveStoredTasks(updated);
    syncTasksToSupabase(updated);
  };

  const handlePurgeTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveStoredTasks(updated);
    syncTasksToSupabase(updated);
  };

  // Handlers: Empty Trash Bin Completely
  const handleEmptyTrash = () => {
    const purgedIdeas = ideas.filter((i) => !i.isDeleted);
    const purgedScripts = scripts.filter((s) => !s.isDeleted);
    const purgedTasks = tasks.filter((t) => !t.isDeleted);
    setIdeas(purgedIdeas);
    saveStoredIdeas(purgedIdeas);
    setScripts(purgedScripts);
    saveStoredScripts(purgedScripts);
    setTasks(purgedTasks);
    saveStoredTasks(purgedTasks);
    syncTasksToSupabase(purgedTasks);
    setIsTrashBinOpen(false);
  };

  // Handlers: Chat Scratchpad (Points 9 & 10)
  const handleAddChatThought = (thoughtData: Omit<ChatThought, 'id' | 'createdAt'>) => {
    const newThought: ChatThought = {
      ...thoughtData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...chatThoughts, newThought];
    setChatThoughts(updated);
    saveStoredChatThoughts(updated);

    // 1. Instant Realtime broadcast to peers
    broadcastChatMessage(newThought);

    // 2. Persistent cloud sync
    syncChatThoughtsToSupabase(updated);
  };

  const handleConvertThoughtToIdea = (thought: ChatThought) => {
    const title = thought.text || 'فكرة من تسجيل صوتي';
    handleSaveIdea({
      title,
      notes: thought.text ? `مستخلصة من شات الأفكار: ${thought.text}` : '',
      voiceNoteBase64: thought.audioBase64,
      creatorName: thought.sender,
    }, 'save_inbox');

    // Mark as converted
    const updated = chatThoughts.map((t) => 
      t.id === thought.id 
        ? { ...t, convertedTo: { type: 'idea' as const, title: title.slice(0, 30) } } 
        : t
    );
    setChatThoughts(updated);
    saveStoredChatThoughts(updated);
    syncChatThoughtsToSupabase(updated);
    broadcastDataChange('chat');
    setActiveTab('ideas');
  };

  const handleConvertThoughtToTask = (thought: ChatThought) => {
    const title = thought.text || 'مهمة من التسجيل الصوتي';
    handleAddTask({
      title,
      category: 'daily_recurring',
      status: 'todo',
      assigneeName: thought.sender as any,
      priority: 'high',
      xpReward: 15,
      notes: thought.text,
    });

    const updated = chatThoughts.map((t) => 
      t.id === thought.id 
        ? { ...t, convertedTo: { type: 'task' as const, title: title.slice(0, 30) } } 
        : t
    );
    setChatThoughts(updated);
    saveStoredChatThoughts(updated);
    syncChatThoughtsToSupabase(updated);
    broadcastDataChange('chat');
    setActiveTab('tasks');
  };

  const handleDeleteThought = (id: string) => {
    const updated = chatThoughts.filter((t) => t.id !== id);
    setChatThoughts(updated);
    saveStoredChatThoughts(updated);
    syncChatThoughtsToSupabase(updated);
    broadcastDataChange('chat');
  };

  // Handlers: Gamification Reset & Adjustment (Points 6, 8, 11)
  const handleResetWeeklyXp = () => {
    if (!confirm('هل تريد تصفير نقاط الأسبوع لبدء أسبوع جديد وتحديث البونص؟')) return;
    const newConf: PerformanceConfig = {
      ...performance,
      lastResetDate: new Date().toISOString(),
    };
    setPerformance(newConf);
    saveStoredPerformance(newConf);

    // Keep streak, reset weekly XP
    const resetEvent = addXpEvent({
      eventType: 'manual_adjustment',
      xpAmount: 0,
      description: '🔄 تصفير نقاط الأسبوع وبدء تارجت جديد',
    });
    setXpEvents([resetEvent]);
    saveStoredXpEvents([resetEvent]);
  };

  const handleAdjustXp = (amount: number, reason: string) => {
    const ev = addXpEvent({
      eventType: 'manual_adjustment',
      xpAmount: amount,
      description: `تعديل يدوي (${amount >= 0 ? '+' : ''}${amount} XP): ${reason}`,
    });
    setXpEvents((prev) => [ev, ...prev]);
    syncXpEventToSupabase(ev);
  };

  const handleSetExactXp = (exactXp: number, reason: string) => {
    const currentTotal = xpEvents.reduce((acc, ev) => acc + ev.xpAmount, 0);
    const diff = exactXp - currentTotal;
    if (diff === 0) return;
    const ev = addXpEvent({
      eventType: 'manual_adjustment',
      xpAmount: diff,
      description: `تعيين الرصيد إلى (${exactXp} XP): ${reason}`,
    });
    setXpEvents((prev) => [ev, ...prev]);
    syncXpEventToSupabase(ev);
  };

  const handleResetAllGamification = () => {
    setXpEvents([]);
    clearStoredXpEvents();
    clearAllXpEventsFromSupabase();
    setStreakDays(0);
    saveStoredStreak(0);
  };

  const handleUpdateStreak = (days: number) => {
    setStreakDays(days);
    saveStoredStreak(days);
  };

  const handleDeleteXpEvent = (eventId: string) => {
    const updated = xpEvents.filter((e) => e.id !== eventId);
    setXpEvents(updated);
    saveStoredXpEvents(updated);
    deleteXpEventFromSupabase(eventId);
  };

  // Handlers: Business Outcomes Edit / Delete / Reset
  const handleUpdateOutcome = (updatedOutcome: BusinessOutcome) => {
    const updated = outcomes.map((o) => (o.id === updatedOutcome.id ? updatedOutcome : o));
    setOutcomes(updated);
    saveStoredOutcomes(updated);
    syncOutcomeToSupabase(updatedOutcome);
  };

  const handleDeleteOutcome = (outcomeId: string) => {
    const updated = outcomes.filter((o) => o.id !== outcomeId);
    setOutcomes(updated);
    saveStoredOutcomes(updated);
    deleteOutcomeFromSupabase(outcomeId);
  };

  const handleResetAllOutcomes = () => {
    setOutcomes([]);
    clearStoredOutcomes();
    clearAllOutcomesFromSupabase();
  };

  // Handlers: User Change
  const handleUserChange = (user: string) => {
    setCurrentUser(user);
    saveStoredActiveUser(user);
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-stone-950 text-charcoal dark:text-stone-100 flex flex-col pb-24 md:pb-12 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={handleUserChange}
        totalXp={totalXp}
        streakDays={streakDays}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onDownloadBackup={downloadBackupJSON}
        onOpenTrashBin={() => setIsTrashBinOpen(true)}
        deletedCount={totalDeletedCount}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <BentoGridHome
            ideas={ideas.filter((i) => !i.isDeleted)}
            scripts={scripts.filter((s) => !s.isDeleted)}
            outcomes={outcomes}
            quests={INITIAL_TEAM_QUESTS}
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            onNavigateToTab={setActiveTab}
            onSelectScript={(script) => {
              setActiveScript(script);
              setActiveTab('scripts');
            }}
            onSelectIdea={(idea) => {
              handleStartScriptFromIdea(idea);
            }}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeaBankView
            ideas={ideas}
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            onOpenPriorityModal={(idea) => setPriorityModalIdea(idea)}
            onEditIdea={(idea) => setEditingIdea(idea)}
            onStartScriptFromIdea={handleStartScriptFromIdea}
            onDeleteIdea={handleDeleteIdea}
            onUpdateStatus={(id, status) => {
              const updated = ideas.map((i) => (i.id === id ? { ...i, status } : i));
              setIdeas(updated);
              saveStoredIdeas(updated);
              const target = updated.find((i) => i.id === id);
              if (target) syncIdeaToSupabase(target);
            }}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'scripts' && (
          <ScriptStudioView
            activeScript={activeScript}
            scripts={scripts.filter((s) => !s.isDeleted)}
            onSelectScript={(script) => setActiveScript(script)}
            onSaveScript={handleSaveScript}
            onUpdateStatus={handleUpdateScriptStatus}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'scratchpad' && (
          <ChatScratchpadView
            thoughts={chatThoughts}
            onAddThought={handleAddChatThought}
            onConvertToIdea={handleConvertThoughtToIdea}
            onConvertToTask={handleConvertThoughtToTask}
            onDeleteThought={handleDeleteThought}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'results' && (
          <BusinessOutcomesView
            outcomes={outcomes}
            scripts={scripts.filter((s) => !s.isDeleted)}
            onAddOutcome={(newOutcomeData) => {
              const newOutcome: BusinessOutcome = {
                ...newOutcomeData,
                id: generateUUID(),
                recordedAt: new Date().toISOString(),
              };
              const updated = [newOutcome, ...outcomes];
              setOutcomes(updated);
              saveStoredOutcomes(updated);
              syncOutcomeToSupabase(newOutcome);

              const ev = addXpEvent({
                eventType: 'outcome_recorded',
                xpAmount: 15,
                description: `توثيق نتائج فيديو: ${newOutcome.ordersAttributed} طلب (${newOutcome.revenueAttributed.toLocaleString()} ج.م)`,
              });
              setXpEvents((prev) => [ev, ...prev]);
              syncXpEventToSupabase(ev);
            }}
            onUpdateOutcome={handleUpdateOutcome}
            onDeleteOutcome={handleDeleteOutcome}
            onResetAllOutcomes={handleResetAllOutcomes}
          />
        )}

        {activeTab === 'gamification' && (
          <GamificationView
            totalXp={totalXp}
            streakDays={streakDays}
            events={xpEvents}
            quests={INITIAL_TEAM_QUESTS}
            performance={performance}
            onUpdatePerformance={(newConf) => {
              setPerformance(newConf);
              saveStoredPerformance(newConf);
            }}
            onResetWeeklyXp={handleResetWeeklyXp}
            onResetAllGamification={handleResetAllGamification}
            onAdjustXp={handleAdjustXp}
            onSetExactXp={handleSetExactXp}
            onDeleteXpEvent={handleDeleteXpEvent}
            onUpdateStreak={handleUpdateStreak}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) for Mobile Quick Capture */}
      <div className="md:hidden fixed start-5 bottom-20 z-40">
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          className="w-14 h-14 rounded-full bg-falcon-600 text-white flex items-center justify-center shadow-xl shadow-falcon-600/40 active:scale-95 transition-transform"
          title="فكرة سريعة في ثانية"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onSaveIdea={handleSaveIdea}
        currentUser={currentUser}
      />

      {/* Edit Idea Modal (Point 7) */}
      <EditIdeaModal
        isOpen={!!editingIdea}
        onClose={() => setEditingIdea(null)}
        idea={editingIdea}
        onSave={handleUpdateIdea}
        currentUser={currentUser}
      />

      {/* Priority Modal */}
      <PriorityModal
        isOpen={!!priorityModalIdea}
        onClose={() => setPriorityModalIdea(null)}
        idea={priorityModalIdea}
        onSaveRatings={handleSaveRatings}
      />

      {/* Trash Bin Modal (Point 4) */}
      <TrashBinModal
        isOpen={isTrashBinOpen}
        onClose={() => setIsTrashBinOpen(false)}
        deletedIdeas={deletedIdeas}
        deletedScripts={deletedScripts}
        deletedTasks={deletedTasks}
        onRestoreIdea={handleRestoreIdea}
        onRestoreScript={handleRestoreScript}
        onRestoreTask={handleRestoreTask}
        onPurgeIdea={handlePurgeIdea}
        onPurgeScript={handlePurgeScript}
        onPurgeTask={handlePurgeTask}
        onEmptyTrash={handleEmptyTrash}
      />

      {/* Undo Toast Notification (Point 5) */}
      {undoToast && (
        <UndoToast
          message={undoToast.message}
          onUndo={undoToast.undoAction}
          onClose={() => setUndoToast(null)}
        />
      )}

    </div>
  );
}
