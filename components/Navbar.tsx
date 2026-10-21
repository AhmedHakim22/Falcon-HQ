'use client';

import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Plus, 
  Lightbulb, 
  FileText, 
  TrendingUp, 
  Award, 
  Home, 
  UserCheck 
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'ideas' | 'scripts' | 'results' | 'gamification';
  setActiveTab: (tab: 'home' | 'ideas' | 'scripts' | 'results' | 'gamification') => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  totalXp: number;
  streakDays: number;
  onOpenQuickCapture: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  totalXp,
  streakDays,
  onOpenQuickCapture,
}: NavbarProps) {
  const currentLevel = Math.floor(totalXp / 100) + 1;
  const levelProgress = totalXp % 100;

  return (
    <header className="sticky top-0 z-40 bg-sand-100/90 backdrop-blur-md border-b border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-falcon-600 flex items-center justify-center text-white shadow-md shadow-falcon-600/20 group-hover:bg-falcon-700 transition-colors">
                <span className="font-bold text-lg tracking-wider">F</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl text-charcoal tracking-tight">FALCON</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-falcon-50 text-falcon-600 border border-falcon-100">HQ</span>
                </div>
                <p className="text-[11px] text-charcoal-muted hidden sm:block">Ideas & Growth Studio</p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 mr-6">
              {[
                { id: 'home', label: 'الرئيسية', icon: Home },
                { id: 'ideas', label: 'بنك الأفكار', icon: Lightbulb },
                { id: 'scripts', label: 'استوديو السكريبتات', icon: FileText },
                { id: 'results', label: 'نتائج البزنس', icon: TrendingUp },
                { id: 'gamification', label: 'التحفيز', icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-falcon-600 shadow-sm border border-sand-border font-semibold'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-200/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-falcon-600' : 'text-charcoal-muted'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Gamification Stats: Streak & Level */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-sand-border shadow-sm">
              <div className="flex items-center gap-1 text-xs font-bold text-falcon-600">
                <Flame className="w-4 h-4 text-falcon-500 fill-falcon-500 animate-pulse" />
                <span>{streakDays} أيام</span>
              </div>
              <span className="text-sand-border">|</span>
              <div 
                onClick={() => setActiveTab('gamification')} 
                className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-charcoal hover:text-falcon-600 transition-colors"
                title={`المستوى ${currentLevel} (${levelProgress}% نحو المستوى القادم)`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Lv.{currentLevel}</span>
                <span className="text-[11px] text-charcoal-muted hidden lg:inline">({totalXp} XP)</span>
              </div>
            </div>

            {/* Active User Switcher (Omar / Salma) */}
            <div className="hidden sm:flex items-center bg-sand-200/70 p-1 rounded-2xl border border-sand-border text-xs">
              <button
                onClick={() => setCurrentUser('عمر')}
                className={`px-2.5 py-1 rounded-xl transition-all font-medium ${
                  currentUser === 'عمر'
                    ? 'bg-white text-charcoal shadow-xs font-bold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                عمر (المؤسس)
              </button>
              <button
                onClick={() => setCurrentUser('سلمى')}
                className={`px-2.5 py-1 rounded-xl transition-all font-medium ${
                  currentUser === 'سلمى'
                    ? 'bg-white text-charcoal shadow-xs font-bold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                سلمى (الكاتبة)
              </button>
            </div>

            {/* Mobile / Quick Capture Button */}
            <button
              onClick={onOpenQuickCapture}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-falcon-600/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>فكرة جديدة</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-sand-border bg-white/95">
        {[
          { id: 'home', label: 'الرئيسية', icon: Home },
          { id: 'ideas', label: 'الأفكار', icon: Lightbulb },
          { id: 'scripts', label: 'السكريبت', icon: FileText },
          { id: 'results', label: 'النتائج', icon: TrendingUp },
          { id: 'gamification', label: 'التحفيز', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-falcon-600 font-bold' : 'text-charcoal-muted'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-falcon-600' : 'text-charcoal-muted'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
