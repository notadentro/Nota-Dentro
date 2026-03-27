'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, Target, Award, Music, Guitar, Mic, Piano, Clock, CheckCircle, Lock } from "lucide-react";

const achievements = [
  {
    id: 1,
    name: "Primeira Nota",
    description: "Complete sua primeira lição",
    icon: Music,
    unlocked: true,
    unlockedDate: "15 Jan 2024",
    category: "Iniciante",
    rarity: "Comum",
    xpReward: 50
  },
  {
    id: 2,
    name: "Dedicação",
    description: "Estude 7 dias seguidos",
    icon: Flame,
    unlocked: true,
    unlockedDate: "22 Jan 2024",
    category: "Consistência",
    rarity: "Raro",
    xpReward: 100
  },
  {
    id: 3,
    name: "Guitarrista",
    description: "Complete 10 lições de violão",
    icon: Guitar,
    unlocked: true,
    unlockedDate: "10 Fev 2024",
    category: "Instrumento",
    rarity: "Épico",
    xpReward: 200
  },
  {
    id: 4,
    name: "Ritmo Mestre",
    description: "Complete 5 lições de percussão",
    icon: Music,
    unlocked: true,
    unlockedDate: "5 Mar 2024",
    category: "Ritmo",
    rarity: "Raro",
    xpReward: 150
  },
  {
    id: 5,
    name: "Vocalista",
    description: "Complete 5 lições de canto",
    icon: Mic,
    unlocked: false,
    progress: 3,
    total: 5,
    category: "Vocal",
    rarity: "Épico",
    xpReward: 250
  },
  {
    id: 6,
    name: "Pianista",
    description: "Complete 15 lições de piano",
    icon: Piano,
    unlocked: false,
    progress: 8,
    total: 15,
    category: "Instrumento",
    rarity: "Lendário",
    xpReward: 300
  },
  {
    id: 7,
    name: "Maratonista Musical",
    description: "Estude por 30 dias seguidos",
    icon: Target,
    unlocked: false,
    progress: 7,
    total: 30,
    category: "Consistência",
    rarity: "Lendário",
    xpReward: 500
  },
  {
    id: 8,
    name: "Mestre Musical",
    description: "Alcance o nível 20",
    icon: Award,
    unlocked: false,
    progress: 12,
    total: 20,
    category: "Progressão",
    rarity: "Lendário",
    xpReward: 1000
  },
  {
    id: 9,
    name: "Perfeccionista",
    description: "Complete 50 lições com pontuação perfeita",
    icon: Star,
    unlocked: false,
    progress: 23,
    total: 50,
    category: "Qualidade",
    rarity: "Épico",
    xpReward: 400
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Comum": return "bg-gray-100 text-gray-800";
    case "Raro": return "bg-blue-100 text-blue-800";
    case "Épico": return "bg-purple-100 text-purple-800";
    case "Lendário": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Iniciante": return "🌱";
    case "Consistência": return "🔥";
    case "Instrumento": return "🎵";
    case "Ritmo": return "🥁";
    case "Vocal": return "🎤";
    case "Progressão": return "📈";
    case "Qualidade": return "⭐";
    default: return "🏆";
  }
};

export default function ConquistasPage() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const totalXpEarned = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2">Conquistas 🏆</h1>
        <p className="text-muted-foreground">Desbloqueie achievements e mostre seu progresso musical</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{unlockedCount}/{totalCount}</div>
            <p className="text-sm text-muted-foreground">Conquistas Desbloqueadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalXpEarned}</div>
            <p className="text-sm text-muted-foreground">XP Ganho com Conquistas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round((unlockedCount / totalCount) * 100)}%</div>
            <p className="text-sm text-muted-foreground">Progresso Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const isUnlocked = achievement.unlocked;
          const progress = achievement.progress && achievement.total ?
            (achievement.progress / achievement.total) * 100 : 0;

          return (
            <Card
              key={achievement.id}
              className={`transition-all hover:shadow-lg ${
                isUnlocked
                  ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10'
                  : 'border-border opacity-75'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${
                    isUnlocked
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isUnlocked && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {!isUnlocked && <Lock className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div className="space-y-2">
                  <CardTitle className={`text-lg ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getCategoryIcon(achievement.category)}</span>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                  {achievement.description}
                </p>

                {isUnlocked ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Desbloqueada em:</span>
                      <span className="font-medium">{achievement.unlockedDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Recompensa:</span>
                      <Badge variant="secondary">+{achievement.xpReward} XP</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso:</span>
                      <span className="font-medium">{achievement.progress}/{achievement.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Recompensa:</span>
                      <Badge variant="outline">{achievement.xpReward} XP</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
