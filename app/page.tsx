'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BentoGridHome } from '@/components/BentoGridHome';
import { IdeaBankView } from '@/components/IdeaBankView';
import { ScriptStudioView } from '@/components/ScriptStudioView';
import { BusinessOutcomesView } from '@/components/BusinessOutcomesView';
import { GamificationView } from '@/components/GamificationView';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';
import { PriorityModal } from '@/components/PriorityModal';
import { 
  getStoredIdeas, 
  saveStoredIdeas, 
  getStoredScripts, 
  saveStoredScripts, 
  getStoredOutcomes, 
  saveStoredOutcomes, 
  getStoredXpEvents, 
  addXpEvent,
  INITIAL_TEAM_QUESTS 
} from '@/lib/storage';
import { 
  fetchRemoteData, 
  syncIdeaToSupabase, 
  syncScriptToSupabase, 
  syncOutcomeToSupabase, 
  syncXpEventToSupabase, 
  deleteIdeaFromSupabase, 
  subscribeToRealtimeChanges, 
  generateUUID 
} from '@/lib/supabaseSync';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { Idea, Script, BusinessOutcome, XpEvent, IdeaStatus, ScriptStatus } from '@/lib/types';
import { calculatePriorityScore } from '@/lib/priority';
import { getInitialSectionsForFramework } from '@/lib/frameworks';
import { Plus } from 'lucide-react';

export default function FalconHQApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'ideas' | 'scripts' | 'results' | 'gamification'>('home');
  const [currentUser, setCurrentUser] = useState<string>('أحمد');
  
  // App Data State
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [outcomes, setOutcomes] = useState<BusinessOutcome[]>([]);
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);
  const [streakDays, setStreakDays] = useState<number>(3);
  
  // Modals & Active selections
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [priorityModalIdea, setPriorityModalIdea] = useState<Idea | null>(null);
  const [activeScript, setActiveScript] = useState<Script | null>(null);

  // Hydrate from LocalStorage first, then fetch live from Supabase & subscribe to Realtime
  useEffect(() => {
    // 1. Instant local render
    setIdeas(getStoredIdeas());
    const initialScripts = getStoredScripts();
    setScripts(initialScripts);
    if (initialScripts.length > 0) setActiveScript(initialScripts[0]);
    setOutcomes(getStoredOutcomes());
    setXpEvents(getStoredXpEvents());

    // 2. Fetch live data from Supabase
    fetchRemoteData().then((remote) => {
      if (remote.ideas && remote.ideas.length > 0) {
        setIdeas(remote.ideas);
        saveStoredIdeas(remote.ideas);
        if (remote.scripts && remote.scripts.length > 0) {
          setScripts(remote.scripts);
          saveStoredScripts(remote.scripts);
          setActiveScript(remote.scripts[0]);
        }
        if (remote.outcomes && remote.outcomes.length > 0) {
          setOutcomes(remote.outcomes);
          saveStoredOutcomes(remote.outcomes);
        }
        if (remote.xpEvents && remote.xpEvents.length > 0) {
          setXpEvents(remote.xpEvents);
        }
      } else if (isSupabaseConfigured) {
        // Supabase is empty: push initial seed so both partners see it
        const seedIdeas = getStoredIdeas();
        const seedScripts = getStoredScripts();
        const seedOutcomes = getStoredOutcomes();
        const seedXp = getStoredXpEvents();
        seedIdeas.forEach((i) => syncIdeaToSupabase(i));
        seedScripts.forEach((s) => syncScriptToSupabase(s));
        seedOutcomes.forEach((o) => syncOutcomeToSupabase(o));
        seedXp.forEach((x) => syncXpEventToSupabase(x));
      }
    });

    // 3. Realtime Listener: updates immediately whenever Ahmed or Moaz saves anything
    const unsubscribe = subscribeToRealtimeChanges(() => {
      fetchRemoteData().then((remote) => {
        if (remote.ideas) {
          setIdeas(remote.ideas);
          saveStoredIdeas(remote.ideas);
        }
        if (remote.scripts) {
          setScripts(remote.scripts);
          saveStoredScripts(remote.scripts);
        }
        if (remote.outcomes) {
          setOutcomes(remote.outcomes);
          saveStoredOutcomes(remote.outcomes);
        }
        if (remote.xpEvents) {
          setXpEvents(remote.xpEvents);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Compute total XP
  const totalXp = xpEvents.reduce((acc, ev) => acc + ev.xpAmount, 0);

  // Handlers: Save Idea
  const handleSaveIdea = (newIdeaData: Partial<Idea>, nextAction: 'start_script' | 'save_inbox' | 'action_plan') => {
    const newId = generateUUID();
    const newIdea: Idea = {
      id: newId,
      title: newIdeaData.title || 'فكرة جديدة',
      category: newIdeaData.category || 'content',
      status: newIdeaData.status || 'inbox',
      sourceUrl: newIdeaData.sourceUrl || '',
      notes: newIdeaData.notes || '',
      creatorName: currentUser,
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

    // Handle Route
    if (nextAction === 'start_script') {
      handleStartScriptFromIdea(newIdea);
    }
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

    // Award XP
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

  // Handlers: Delete Idea
  const handleDeleteIdea = (ideaId: string) => {
    const updated = ideas.filter((i) => i.id !== ideaId);
    setIdeas(updated);
    saveStoredIdeas(updated);
    deleteIdeaFromSupabase(ideaId);
  };

  // Handlers: Add Outcome
  const handleAddOutcome = (newOutcomeData: Omit<BusinessOutcome, 'id' | 'recordedAt'>) => {
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
  };

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col pb-24 md:pb-12">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        totalXp={totalXp}
        streakDays={streakDays}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <BentoGridHome
            ideas={ideas}
            scripts={scripts}
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
            onStartScriptFromIdea={handleStartScriptFromIdea}
            onDeleteIdea={handleDeleteIdea}
            onUpdateStatus={(id, status) => {
              const updated = ideas.map((i) => (i.id === id ? { ...i, status } : i));
              setIdeas(updated);
              saveStoredIdeas(updated);
              const target = updated.find((i) => i.id === id);
              if (target) syncIdeaToSupabase(target);
            }}
          />
        )}

        {activeTab === 'scripts' && (
          <ScriptStudioView
            activeScript={activeScript}
            scripts={scripts}
            onSelectScript={(script) => setActiveScript(script)}
            onSaveScript={handleSaveScript}
            onUpdateStatus={handleUpdateScriptStatus}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'results' && (
          <BusinessOutcomesView
            outcomes={outcomes}
            scripts={scripts}
            onAddOutcome={handleAddOutcome}
          />
        )}

        {activeTab === 'gamification' && (
          <GamificationView
            totalXp={totalXp}
            streakDays={streakDays}
            events={xpEvents}
            quests={INITIAL_TEAM_QUESTS}
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

      {/* Modals */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onSaveIdea={handleSaveIdea}
        currentUser={currentUser}
      />

      <PriorityModal
        isOpen={!!priorityModalIdea}
        onClose={() => setPriorityModalIdea(null)}
        idea={priorityModalIdea}
        onSaveRatings={handleSaveRatings}
      />

    </div>
  );
}
