'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { MascotDom } from './components/MascotDom';
import { LevelRing } from './components/LevelRing';
import { StreakWeek } from './components/StreakWeek';
import { WeeklyChart } from './components/WeeklyChart';
import { DashboardAchievements } from './components/DashboardAchievements';
import { PlayCircle, Flame, Zap, Trophy, Target, BookOpen, Lock, Shield, Anchor, Crosshair, GraduationCap, Music, ChevronRight } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  Anchor: <Anchor className="w-6 h-6" />,
  Crosshair: <Crosshair className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trails, setTrails] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/curriculum')
      .then(res => res.json())
      .then(data => {
        if (data.database) {
          setTrails(data.database);
        }
      })
      .catch(console.error);
  }, []);

  const userName = user?.displayName?.split(' ')[0] || 'Aluno';
  const level = user?.stats?.level || 1;
  const xp = user?.stats?.xp || 0;
  const maxXp = level * 1000;
  const streak = user?.stats?.streak || 0;
  const dailyXp = user?.stats?.dailyXp || {};
  const unlockedAchievements = user?.achievements || [];

  // Filter trails based on user goal
  const filteredTrails = trails.filter(trail => {
    if (!user?.onboardingData?.goal) return true;
    const goal = user.onboardingData.goal;
    if (goal === 'livre' && trail.id === 'livres') return true;
    if (goal === 'the' && trail.id === 'universidades') return true;
    if (['esa', 'eags', 'fuzileiros'].includes(goal) && trail.id === 'militares') return true;
    return false;
  });

  return (
    <div className="w-full px-4 sm:px-8 py-6 space-y-6 font-body">

      {/* ── Greeting Hero Card ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF8E1] to-[#FFF3CD] border-2 border-[#FFC107]/40 shadow-[0_6px_0_0_#E6AC00]">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-7">
          <MascotDom />
          <div className="flex-1 min-w-0 text-center sm:text-left z-10">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4A017]">Mestre Dom fala:</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1 font-headline">
              Olá, {userName}! 🎵
            </h1>
            <p className="text-[#6b5000] text-sm sm:text-base">
              Você está a{" "}
              <span className="font-bold text-[#D4A017]">{Math.max(maxXp - xp, 0)} XP</span> do próximo nível.{" "}
              Bora tocar?
            </p>
            <button
              onClick={() => router.push(filteredTrails[0] ? `/dashboard/trail/${filteredTrails[0].id}` : "/aprendizagem")}
              className="mt-4 mx-auto sm:mx-0 flex items-center gap-2 bg-[#FFC107] hover:bg-[#FFB300] text-[#1a1a1a] font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_0_0_#E6AC00] hover:shadow-[0_2px_0_0_#E6AC00] hover:translate-y-0.5 transition-all text-sm"
            >
              <PlayCircle className="w-4 h-4" />
              Continuar Lição
            </button>
          </div>
          {/* Decorative notes */}
          <div className="absolute right-4 top-4 text-4xl opacity-10 rotate-12 select-none pointer-events-none text-[#FFC107]">♪</div>
          <div className="absolute right-12 bottom-4 text-2xl opacity-10 -rotate-6 select-none pointer-events-none text-[#FFC107]">♫</div>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Nível",      value: level,            icon: Target,  color: "bg-[#FFC107]", textColor: "text-[#D4A017]", shadow: "shadow-[0_4px_0_0_#E6AC00]" },
          { label: "Sequência",  value: `${streak} dias`, icon: Flame,   color: "bg-orange-500", textColor: "text-orange-600", shadow: "shadow-[0_4px_0_0_#c2410c]" },
          { label: "XP Total",   value: xp.toLocaleString(), icon: Zap,  color: "bg-violet-500", textColor: "text-violet-600", shadow: "shadow-[0_4px_0_0_#7c3aed]" },
          { label: "Conquistas", value: unlockedAchievements.length.toString(), icon: Trophy, color: "bg-[#ADD8E6]", textColor: "text-sky-600", shadow: "shadow-[0_4px_0_0_#7CB9D4]" },
        ].map(({ label, value, icon: Icon, color, textColor, shadow }) => (
          <div key={label} className={`bg-card rounded-2xl p-4 border border-border hover:${shadow} transition-all cursor-default`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`text-2xl font-bold font-headline ${textColor}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Two columns: Level + Streak | XP chart ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Level Ring + XP bar */}
        <div className="bg-card rounded-2xl p-5 border border-border flex flex-col gap-4">
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Progresso de Nível</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <LevelRing level={level} xp={xp} maxXp={maxXp} />
            <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-foreground">Nível {level}</span>
                <span className="text-[#D4A017] font-bold">{xp}/{maxXp} XP</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((xp / maxXp) * 100, 100)}%`,
                    background: "linear-gradient(to right, #FFB300, #FFC107)",
                    transition: "width 1s ease-out",
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">Faltam <span className="font-bold text-[#D4A017]">{Math.max(maxXp - xp, 0)} XP</span> para o nível {level + 1}!</p>
            </div>
          </div>
        </div>

        {/* Streak Week */}
        <div className="bg-card rounded-2xl p-5 border border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Sua Sequência</h2>
            <span className="text-xl font-bold text-orange-500 font-headline">🔥 {streak} dias</span>
          </div>
          <StreakWeek streak={streak} />
          <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
            <span className="text-xs text-orange-500 font-medium">Estude hoje para manter sua sequência ativa!</span>
          </div>
        </div>
      </div>

      {/* ── XP Semanal ─────────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Histórico Semanal</h2>
          <span className="text-sm font-bold text-[#D4A017] bg-[#FFF8E1] px-3 py-1 rounded-full border border-[#FFC107]/30">
            {Object.values(dailyXp).slice(-7).reduce((acc, curr) => acc + curr, 0)} XP esta semana
          </span>
        </div>
        <WeeklyChart dailyXp={dailyXp} />
      </div>

      {/* ── Conquistas Preview ─────────────────────────────────────────── */}
      <DashboardAchievements unlockedIds={unlockedAchievements} />

      {/* ── Seus Cursos (Trilhas) ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FFC107]" />
            <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Seus Cursos</h2>
          </div>
          <button
            onClick={() => router.push("/dashboard/trails")}
            className="text-xs font-semibold text-[#D4A017] flex items-center gap-1 hover:underline"
          >
            Ver todos <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        {filteredTrails.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Carregando trilhas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrails.map((trail) => {
              // Simulated progress until we implement actual course tracking
              const progress = Math.min((user?.stats?.xp || 0) / 100, 100);
              const isLocked = false;
              
              return (
                <div
                  key={trail.id}
                  onClick={() => !isLocked && router.push(`/dashboard/trail/${trail.id}`)}
                  className={`bg-card rounded-2xl p-5 border-2 transition-all duration-200 ${
                    isLocked
                      ? "border-border opacity-60 cursor-not-allowed"
                      : "border-border hover:border-[#2D8A5C] hover:shadow-[0_6px_0_0_#2D8A5C] hover:-translate-y-1 cursor-pointer"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#2D8A5C]/10 text-[#2D8A5C]"
                  >
                    {iconMap[trail.icon] || <Shield className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-3 leading-tight font-headline">{trail.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{trail.description}</p>
                  
                  <div className="space-y-1.5 mt-auto">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progresso da trilha</span>
                      {isLocked && (
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Bloqueado</span>
                      )}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-[#2D8A5C]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
