'use client';

import React from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { XpEvent, TeamQuest } from '@/lib/types';

interface GamificationViewProps {
  totalXp: number;
  streakDays: number;
  events: XpEvent[];
  quests: TeamQuest[];
  currentUser: string;
}

export function GamificationView({
  totalXp,
  streakDays,
  events,
  quests,
  currentUser,
}: GamificationViewProps) {
  const currentLevel = Math.floor(totalXp / 100) + 1;
  const levelProgress = totalXp % 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-charcoal">منظومة التحفيز والاستمرارية</h2>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          نقاط خبرة شفافة ومكافآت على الإنجاز الفعلي لحماية شغف الفريق واستمراريته
        </p>
      </div>

      {/* Top 3 Gamification Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Level Progression */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-muted">المستوى الحالي</span>
              <div className="w-8 h-8 rounded-xl bg-gold-light text-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-black text-charcoal">
              المستوى {currentLevel}
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              إجمالي {totalXp} نقطة خبرة (XP)
            </p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-charcoal-muted mb-1.5">
              <span>التقدم للمستوى القادم</span>
              <span className="text-falcon-600">{levelProgress} / 100 XP</span>
            </div>
            <div className="w-full bg-sand-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-falcon-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stress-Free Streak */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-muted">التتابع الإيجابي</span>
              <div className="w-8 h-8 rounded-xl bg-falcon-50 text-falcon-600 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-falcon-600" />
              </div>
            </div>

            <div className="text-3xl font-black text-charcoal flex items-center gap-2">
              <span>{streakDays} أيام</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-falcon-50 text-falcon-600 border border-falcon-100">
                نشط 🔥
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              مبني على أبحاث الدوبامين الإيجابي بدون ضغط نفسي
            </p>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-white border border-sand-border text-xs text-charcoal flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>حماية العطلات مفعلة: يوم الراحة الأسبوعي لا يكسر العداد!</span>
          </div>
        </div>

        {/* Team Quest */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-white to-sand-50">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-muted">مهمة الفريق الأسبوعية</span>
              <div className="w-8 h-8 rounded-xl bg-falcon-50 text-falcon-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-base font-bold text-charcoal">تجهيز 3 سكريبتات للتصوير</h4>
            <p className="text-xs text-charcoal-muted mt-0.5">هدف مشترك بينك وبين معاذ معاً (+50 XP للفريق)</p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-charcoal-muted mb-1.5">
              <span>نسبة الإنجاز</span>
              <span className="text-falcon-600 font-bold">66%</span>
            </div>
            <div className="w-full bg-sand-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: '66%' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Transparent XP Ledger Table */}
      <div className="bento-card p-6">
        <h3 className="text-base font-bold text-charcoal mb-4 flex items-center justify-between">
          <span>سجل النقاط الشفاف (XP Ledger)</span>
          <span className="text-xs font-normal text-charcoal-muted">حماية كاملة من التكرار والتزييف</span>
        </h3>

        <div className="divide-y divide-sand-border">
          {events.map((ev) => (
            <div key={ev.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sand-100 flex items-center justify-center text-xs font-bold text-falcon-600">
                  +{ev.xpAmount}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-charcoal">{ev.description}</p>
                  <span className="text-[10px] text-charcoal-muted">
                    {new Date(ev.createdAt).toLocaleString('ar-EG')}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                موثق
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
