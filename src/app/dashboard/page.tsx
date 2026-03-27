'use client';

import { Trophy, Flame, Star, Target, Award, TrendingUp, Music2, Guitar, Mic, Piano } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Nível", value: "12", icon: Target, color: "bg-primary" },
    { label: "Sequência", value: "7 dias", icon: Flame, color: "bg-orange-500" },
    { label: "XP Total", value: "3,450", icon: Star, color: "bg-primary" },
    { label: "Conquistas", value: "24", icon: Trophy, color: "bg-secondary" },
  ];

  const achievements = [
    { id: 1, name: "Primeira Nota", description: "Complete sua primeira lição", icon: Music2, unlocked: true },
    { id: 2, name: "Dedicação", description: "Estude 7 dias seguidos", icon: Flame, unlocked: true },
    { id: 3, name: "Guitarrista", description: "Complete 10 lições de violão", icon: Guitar, unlocked: true },
    { id: 4, name: "Vocalista", description: "Complete 5 lições de canto", icon: Mic, unlocked: false },
    { id: 5, name: "Pianista", description: "Complete 15 lições de piano", icon: Piano, unlocked: false },
    { id: 6, name: "Mestre Musical", description: "Alcance o nível 20", icon: Award, unlocked: false },
  ];

  const weeklyProgress = [
    { day: "Seg", xp: 120 },
    { day: "Ter", xp: 180 },
    { day: "Qua", xp: 90 },
    { day: "Qui", xp: 200 },
    { day: "Sex", xp: 150 },
    { day: "Sáb", xp: 0 },
    { day: "Dom", xp: 0 },
  ];

  const maxXp = Math.max(...weeklyProgress.map(d => d.xp));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2">Olá, Músico! 🎵</h1>
        <p className="text-muted-foreground">Continue sua jornada musical e alcance novos níveis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-foreground">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* XP Progress */}
      <div className="bg-card rounded-xl p-6 shadow-md mb-8 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">Progresso para o Próximo Nível</h2>
          <span className="text-sm text-muted-foreground">450/500 XP</span>
        </div>
        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: "90%" }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">Faltam apenas 50 XP para o nível 13!</p>
      </div>

      {/* Weekly Activity */}
      <div className="bg-card rounded-xl p-6 shadow-md mb-8 border border-border">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-foreground">Atividade Semanal</h2>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyProgress.map((day) => (
            <div key={day.day} className="flex flex-col items-center flex-1 gap-2">
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full bg-primary rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: day.xp > 0 ? `${(day.xp / maxXp) * 100}%` : "8px" }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
              <span className="text-xs text-muted-foreground">{day.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-xl p-6 shadow-md border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-foreground">Conquistas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? "border-primary bg-[#FFF8E1] shadow-sm"
                    : "border-border bg-muted opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      achievement.unlocked
                        ? "bg-primary"
                        : "bg-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
