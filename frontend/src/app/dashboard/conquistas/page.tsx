'use client';

import { useState } from "react";
import { Mail, Calendar, MapPin, Lock, Zap, Trophy, TrendingUp, Target, BookOpen, Music, Guitar, Mic, Piano } from "lucide-react";
import { MascotDom } from "@/app/dashboard/components/MascotDom";
import { useUser } from "@/contexts/UserContext";

// ─── Achievement data ─────────────────────────────────────────────────────────
const rarityConfig: Record<string, { border: string; glow: string; bg: string; label: string; labelColor: string }> = {
  bronze:   { border: "border-[#CD7F32]", glow: "shadow-[0_0_12px_#CD7F3240]", bg: "bg-[#FFF4E6]", label: "Bronze",  labelColor: "bg-[#CD7F32] text-white" },
  silver:   { border: "border-[#A8A8A8]", glow: "shadow-[0_0_12px_#A8A8A830]", bg: "bg-[#F8F8F8]", label: "Prata",   labelColor: "bg-[#A8A8A8] text-white" },
  gold:     { border: "border-[#FFD700]", glow: "shadow-[0_0_16px_#FFD70040]", bg: "bg-[#FFFDE7]", label: "Ouro",    labelColor: "bg-[#FFD700] text-[#1a1a1a]" },
  platinum: { border: "border-[#ADD8E6]", glow: "shadow-[0_0_20px_#ADD8E660]", bg: "bg-[#F0F8FF]", label: "Platina", labelColor: "bg-[#ADD8E6] text-[#1a1a1a]" },
};

const allAchievements = [
  { id: 1,  name: "Primeira Nota",      description: "Completou sua primeira lição",             emoji: "🎵", unlocked: true,  rarity: "bronze",   xp: 50   },
  { id: 2,  name: "Semana de Fogo",     description: "Estudou 7 dias seguidos",                   emoji: "🔥", unlocked: true,  rarity: "silver",   xp: 100  },
  { id: 3,  name: "Cordas Rasgadas",   description: "Completou 10 lições de violão",              emoji: "🎸", unlocked: true,  rarity: "bronze",   xp: 80   },
  { id: 4,  name: "Maestro Iniciante", description: "Acertou 50 notas no total",                 emoji: "🎓", unlocked: true,  rarity: "silver",   xp: 120  },
  { id: 5,  name: "Ouvido Perfeito",   description: "100% de acerto em um quiz de teoria",       emoji: "👂", unlocked: false, rarity: "gold",     xp: 200  },
  { id: 6,  name: "Vocalista",         description: "Complete 5 lições de técnica vocal",        emoji: "🎤", unlocked: false, rarity: "silver",   xp: 100  },
  { id: 7,  name: "Pianista",          description: "Complete 15 lições de piano",               emoji: "🎹", unlocked: false, rarity: "gold",     xp: 250  },
  { id: 8,  name: "Maratonista",       description: "Estude 30 dias seguidos sem parar",        emoji: "🏃", unlocked: false, rarity: "platinum", xp: 500  },
  { id: 9,  name: "Teórico Supremo",   description: "Complete toda a trilha de teoria musical", emoji: "📖", unlocked: false, rarity: "platinum", xp: 800  },
  { id: 10, name: "Mestre Musical",    description: "Alcance o nível 20 na plataforma",         emoji: "👑", unlocked: false, rarity: "platinum", xp: 1000 },
  { id: 11, name: "Ritmo no Sangue",   description: "Acerte 20 exercícios de ritmo seguidos",   emoji: "🥁", unlocked: false, rarity: "gold",     xp: 300  },
  { id: 12, name: "Nota Certa",        description: "Complete um módulo sem errar",              emoji: "⭐", unlocked: false, rarity: "gold",     xp: 250  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────
const skills = [
  { name: "Teoria Musical",       level: 85, icon: Music,  color: "#FFC107" },
  { name: "Violão",               level: 45, icon: Guitar, color: "#FF6B35" },
  { name: "Canto",                level: 20, icon: Mic,    color: "#E040FB" },
  { name: "Leitura de Partitura", level: 60, icon: BookOpen,color: "#ADD8E6" },
  { name: "Piano",                level: 10, icon: Piano,  color: "#26A69A" },
];

// ─── Activity feed ────────────────────────────────────────────────────────────
const recentActivity = [
  { id: 1, action: "Completou",   detail: "Escalas Maiores e Menores", date: "Hoje, 14:32",         xp: 50,  emoji: "📚" },
  { id: 2, action: "Conquistou",  detail: "Semana de Fogo 🔥",          date: "Hoje, 14:35",         xp: 100, emoji: "🏆" },
  { id: 3, action: "Completou",   detail: "Acordes Básicos",            date: "Ontem, 19:10",        xp: 60,  emoji: "📚" },
  { id: 4, action: "Iniciou",     detail: "Técnicas Vocais",            date: "2 dias atrás",        xp: 0,   emoji: "▶️" },
  { id: 5, action: "Finalizou",   detail: "Fundamentos da Música",      date: "3 dias atrás",        xp: 500, emoji: "🎓" },
  { id: 6, action: "Completou",   detail: "Ritmo e Compasso",           date: "4 dias atrás",        xp: 40,  emoji: "📚" },
];

// ─── Tab types ────────────────────────────────────────────────────────────────
type Tab = "stats" | "conquistas" | "atividade";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [achievementFilter, setAchievementFilter] = useState<"todas" | "desbloqueadas" | "bloqueadas">("todas");
  
  const { user } = useUser();

  const level = user?.stats?.level || 1;
  const xp = user?.stats?.xp || 0;
  const maxXp = level * 1000;
  const streak = user?.stats?.streak || 0;

  const userInfo = {
    name: user?.displayName || "Estudante Mestre",
    email: user?.email || "estudante@notadentro.com.br",
    joined: "Este mês",
    location: "Brasil",
    bio: "Apaixonado por música desde criança. Aprendendo e se aventurando na teoria musical. Sonho em compor minhas próprias músicas! 🎸",
    level: level,
    xp: xp,
    maxXp: maxXp,
    totalXp: xp,
    streak: streak,
  };

  const statCards = [
    { label: "Cursos Concluídos", value: "3",      icon: Trophy,     color: "bg-green-500",  bg: "bg-green-50",  text: "text-green-700"  },
    { label: "Total de Lições",   value: "47",     icon: BookOpen,   color: "bg-[#FFC107]",  bg: "bg-[#FFF8E1]", text: "text-[#D4A017]"  },
    { label: "Horas de Estudo",   value: "28h",    icon: TrendingUp, color: "bg-[#ADD8E6]",  bg: "bg-blue-50",   text: "text-sky-700"    },
    { label: "Meta Semanal",      value: "5/7 dias", icon: Target,   color: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-700" },
  ];

  const filteredAchievements = allAchievements.filter(a => {
    if (achievementFilter === "desbloqueadas") return a.unlocked;
    if (achievementFilter === "bloqueadas") return !a.unlocked;
    return true;
  });

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "stats",      label: "Estatísticas" },
    { id: "conquistas", label: "Conquistas", count: unlockedCount },
    { id: "atividade",  label: "Atividade" },
  ];



  return (
    <div className="w-full px-4 sm:px-8 py-6 space-y-6 font-body">

      {/* ── Profile Hero ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF8E1] to-[#FFF3CD] rounded-2xl border-2 border-[#FFC107]/40 shadow-[0_6px_0_0_#E6AC00]">
        {/* Decorative */}
        <div className="absolute right-4 top-4 text-5xl opacity-10 rotate-12 select-none">♪</div>
        <div className="absolute right-20 bottom-4 text-3xl opacity-10 -rotate-6 select-none">♫</div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8">
          <div className="shrink-0 mt-2 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFC107]/30 bg-white shadow-sm flex items-center justify-center">
                <MascotDom />
            </div>
            {/* Level badge */}
            <div className="-mt-3 z-10 bg-[#FFC107] text-[#1a1a1a] text-xs font-bold px-3 py-1 rounded-full shadow-[0_3px_0_0_#E6AC00] whitespace-nowrap">
              Nível {userInfo.level}
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
              {userInfo.name}
            </h1>
            <p className="text-[#6b5000] text-sm mb-3 max-w-xl">{userInfo.bio}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="w-4 h-4" /> {userInfo.email}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4" /> Desde {userInfo.joined}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4" /> {userInfo.location}
              </span>
            </div>
            {/* XP bar */}
            <div className="mt-4 max-w-sm mx-auto sm:mx-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#6b5000]">Progresso do Nível</span>
                <span className="text-[#D4A017] font-bold">{userInfo.xp}/{userInfo.maxXp} XP</span>
              </div>
              <div className="w-full bg-white/60 rounded-full h-2.5 overflow-hidden border border-[#FFC107]/30">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((userInfo.xp / userInfo.maxXp) * 100, 100)}%`,
                    background: "linear-gradient(to right, #FFB300, #FFC107)",
                  }}
                />
              </div>
              <p className="text-[10px] text-[#8B6914] mt-1">Faltam {userInfo.maxXp - userInfo.xp} XP para o nível {userInfo.level + 1}</p>
            </div>
          </div>
          <div className="flex sm:flex-col gap-4 sm:gap-3 shrink-0 flex-wrap justify-center">
            {[
              { label: "XP Total", value: userInfo.totalXp.toLocaleString(), icon: Zap, color: "text-violet-600" },
              { label: "Sequência", value: `${userInfo.streak}d 🔥`, icon: null, color: "text-orange-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center bg-white/60 rounded-2xl px-4 py-3 border border-[#FFC107]/20">
                <div className={`text-xl font-bold ${color}`} style={{ fontFamily: "Poppins, sans-serif" }}>{value}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-muted rounded-2xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === tab.id ? "bg-[#FFC107] text-[#1a1a1a]" : "bg-border text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Estatísticas ──────────────────────────────────────────── */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg, text }) => (
              <div key={label} className={`rounded-2xl p-4 border border-border ${bg}`}>
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`text-2xl font-bold mb-0.5 ${text}`} style={{ fontFamily: "Poppins, sans-serif" }}>{value}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wide mb-5">Habilidades Musicais</h3>
            <div className="space-y-5">
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${skill.color}20` }}>
                          <Icon className="w-4 h-4" style={{ color: skill.color }} />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: skill.color }}>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Conquistas ────────────────────────────────────────────── */}
      {activeTab === "conquistas" && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex gap-2">
            {(["todas", "desbloqueadas", "bloqueadas"] as const).map(f => (
              <button
                key={f}
                onClick={() => setAchievementFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  achievementFilter === f
                    ? "bg-[#FFC107] text-[#1a1a1a] shadow-[0_3px_0_0_#E6AC00]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f === "todas" ? "Todas" : f === "desbloqueadas" ? "Desbloqueadas" : "Bloqueadas"}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground self-center font-medium">
              {unlockedCount}/{allAchievements.length} desbloqueadas
            </span>
          </div>

          {/* Summary progress */}
          <div className="bg-gradient-to-r from-[#FFF8E1] to-[#FFF3CD] rounded-2xl p-4 border border-[#FFC107]/30 flex items-center gap-4">
            <div className="text-4xl font-bold text-[#D4A017]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {Math.round((unlockedCount / allAchievements.length) * 100)}%
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#6b5000] mb-1.5">Progresso de Conquistas</div>
              <div className="w-full bg-white/70 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(unlockedCount / allAchievements.length) * 100}%`,
                    background: "linear-gradient(to right, #FFB300, #FFC107)",
                  }}
                />
              </div>
            </div>
            <Trophy className="w-8 h-8 text-[#FFC107]" />
          </div>

          {/* Achievement grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredAchievements.map((ach) => {
              const r = rarityConfig[ach.rarity];
              return (
                <div
                  key={ach.id}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    ach.unlocked
                      ? `${r.border} ${r.bg} ${r.glow} hover:scale-105`
                      : "border-border bg-muted opacity-50 grayscale"
                  }`}
                >
                  <span className="text-4xl">{ach.emoji}</span>
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground leading-tight">{ach.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{ach.description}</div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-auto">
                    {ach.unlocked ? (
                      <>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.labelColor}`}>{r.label}</span>
                        <span className="text-[10px] font-semibold text-muted-foreground">+{ach.xp} XP</span>
                      </>
                    ) : (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab: Atividade ─────────────────────────────────────────────── */}
      {activeTab === "atividade" && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Atividade Recente</h3>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-muted/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] border border-[#FFC107]/30 flex items-center justify-center text-xl shrink-0">
                  {activity.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {activity.action}{" "}
                    <span className="text-[#D4A017]">{activity.detail}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.date}</p>
                </div>
                {activity.xp > 0 && (
                  <div className="shrink-0 flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Zap className="w-3 h-3" />
                    +{activity.xp} XP
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
