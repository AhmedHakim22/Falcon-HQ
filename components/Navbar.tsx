'use client';

import React from 'react';
import { 
  Home, 
  Lightbulb, 
  FileText, 
  TrendingUp, 
  Award, 
  Plus, 
  Flame, 
  Sparkles,
  CheckSquare,
  MessageSquare,
  Moon,
  Sun,
  Download,
  Trash2
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'ideas' | 'scripts' | 'tasks' | 'scratchpad' | 'results' | 'gamification';
  setActiveTab: (tab: 'home' | 'ideas' | 'scripts' | 'tasks' | 'scratchpad' | 'results' | 'gamification') => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  totalXp: number;
  streakDays: number;
  onOpenQuickCapture: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onDownloadBackup: () => void;
  onOpenTrashBin: () => void;
  deletedCount: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  totalXp,
  streakDays,
  onOpenQuickCapture,
  theme,
  onToggleTheme,
  onDownloadBackup,
  onOpenTrashBin,
  deletedCount,
}: NavbarProps) {
  const currentLevel = Math.floor(totalXp / 100) + 1;
  const levelProgress = totalXp % 100;

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'ideas', label: 'بنك الأفكار', icon: Lightbulb },
    { id: 'scripts', label: 'السكريبتات', icon: FileText },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'scratchpad', label: 'شات الأفكار', icon: MessageSquare },
    { id: 'results', label: 'النتائج', icon: TrendingUp },
    { id: 'gamification', label: 'التحفيز', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-sand-100/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-sand-border dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img 
                  src="/falcon-logo.png" 
                  alt="Falcon Brand Logo" 
                  className="w-full h-full object-contain drop-shadow-sm" 
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl text-charcoal dark:text-stone-100 tracking-tight">FALCON</span>
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-falcon-50 dark:bg-falcon-950/80 text-falcon-600 dark:text-falcon-400 border border-falcon-100 dark:border-falcon-900">HQ</span>
                </div>
                <p className="text-[10px] text-charcoal-muted dark:text-stone-400 hidden sm:block">Ideas & Growth Studio</p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden xl:flex items-center gap-1 mr-4">
              {navItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white dark:bg-stone-800 text-falcon-600 dark:text-falcon-400 shadow-xs border border-sand-border dark:border-stone-700 font-bold'
                        : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal dark:hover:text-stone-200 hover:bg-sand-200/60 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-falcon-600 dark:text-falcon-400' : 'text-charcoal-muted dark:text-stone-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Gamification Stats: Streak & Level */}
            <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-2xl border border-sand-border dark:border-stone-700 shadow-xs">
              <div className="flex items-center gap-1 text-xs font-bold text-falcon-600 dark:text-falcon-400">
                <Flame className="w-4 h-4 text-falcon-500 fill-falcon-500 animate-pulse" />
                <span>{streakDays} أيام</span>
              </div>
              <span className="text-sand-border dark:text-stone-700">|</span>
              <div 
                onClick={() => setActiveTab('gamification')} 
                className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-charcoal dark:text-stone-200 hover:text-falcon-600 transition-colors"
                title={`المستوى ${currentLevel} (${levelProgress}% نحو المستوى القادم)`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Lv.{currentLevel}</span>
              </div>
            </div>

            {/* Backup Download Button (Point 13) */}
            <button
              onClick={onDownloadBackup}
              className="p-2 rounded-2xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal-muted dark:text-stone-300 hover:text-falcon-600 transition-colors"
              title="تحميل نسخة احتياطية فورية على الهاتف/الكمبيوتر (Backup JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Trash Bin Button with Badge (Point 4) */}
            <button
              onClick={onOpenTrashBin}
              className="relative p-2 rounded-2xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal-muted dark:text-stone-300 hover:text-falcon-600 transition-colors"
              title="سلة المهملات"
            >
              <Trash2 className="w-4 h-4" />
              {deletedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {deletedCount}
                </span>
              )}
            </button>

            {/* Dark Theme Toggle (Point 12) */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-2xl bg-white dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal-muted dark:text-stone-300 hover:text-falcon-600 transition-colors"
              title={theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الليلي الفاخر (Dark Mode)'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-charcoal" />}
            </button>

            {/* Active User Switcher (أحمد / معاذ) (Point 2) */}
            <div className="flex items-center bg-sand-200/70 dark:bg-stone-800 p-1 rounded-2xl border border-sand-border dark:border-stone-700 text-xs">
              <button
                onClick={() => setCurrentUser('أحمد')}
                className={`px-2.5 py-1 rounded-xl transition-all font-bold ${
                  currentUser === 'أحمد'
                    ? 'bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 shadow-xs'
                    : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal'
                }`}
              >
                أحمد
              </button>
              <button
                onClick={() => setCurrentUser('معاذ')}
                className={`px-2.5 py-1 rounded-xl transition-all font-bold ${
                  currentUser === 'معاذ'
                    ? 'bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 shadow-xs'
                    : 'text-charcoal-muted dark:text-stone-400 hover:text-charcoal'
                }`}
              >
                معاذ
              </button>
            </div>

            {/* Quick Capture Button */}
            <button
              onClick={onOpenQuickCapture}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-falcon-600/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">فكرة جديدة</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile/Tablet Bottom Navigation Bar */}
      <div className="xl:hidden flex items-center justify-around py-2 border-t border-sand-border dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 overflow-x-auto px-1">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors whitespace-nowrap ${
                isActive ? 'text-falcon-600 dark:text-falcon-400 font-bold' : 'text-charcoal-muted dark:text-stone-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-falcon-600 dark:text-falcon-400' : 'text-charcoal-muted dark:text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
