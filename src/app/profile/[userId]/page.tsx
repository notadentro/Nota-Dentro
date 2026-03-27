'use client';

import { useUser } from '@/contexts/UserContext';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Flame, Star, Target, Award, TrendingUp, Music, Calendar, Clock, Instagram, Linkedin } from 'lucide-react';

export default function ProfilePage() {
  const { userId: rawUserId } = useParams();
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
  const { user } = useUser();

  // Para modo demo, mostra o perfil do usuário logado
  const userProfile = user;

  if (!userProfile) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4 font-headline">Perfil não encontrado</h1>
        <p>Usuário não encontrado ou não logado.</p>
      </div>
    );
  }

  // Dados mockados para gamificação
  const profileStats = {
    level: 12,
    xp: 3450,
    nextLevelXp: 4000,
    streak: 7,
    totalLessons: 24,
    achievements: 8,
    joinDate: "Janeiro 2024"
  };

  const recentAchievements = [
    { name: "Dedicação", description: "7 dias seguidos estudando", icon: Flame, date: "Hoje" },
    { name: "Guitarrista", description: "Completou 10 lições de violão", icon: Music, date: "2 dias atrás" },
    { name: "Primeira Nota", description: "Completou primeira lição", icon: Star, date: "1 semana atrás" }
  ];

  const recentActivity = [
    { action: "Completou lição", lesson: "Ritmo Básico", xp: 75, time: "2h atrás" },
    { action: "Ganhou conquista", achievement: "Dedicação", xp: 100, time: "1 dia atrás" },
    { action: "Completou lição", lesson: "Escala de Dó Maior", xp: 100, time: "3 dias atrás" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userProfile.photoURL || userProfile.profileImage} alt={userProfile.displayName || userProfile.name} />
            <AvatarFallback>{(userProfile.displayName || userProfile.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{userProfile.displayName || userProfile.name}</h1>
            <p className="text-muted-foreground">@{userProfile.username || 'musician'}</p>
            <p className="text-sm text-muted-foreground mt-1">Membro desde {profileStats.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Nível</span>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{profileStats.level}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">XP Total</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">{profileStats.xp.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Sequência</span>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">{profileStats.streak} dias</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Conquistas</span>
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-2xl font-bold">{profileStats.achievements}</div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progresso para Nível {profileStats.level + 1}</h2>
            <span className="text-sm text-muted-foreground">{profileStats.xp}/{profileStats.nextLevelXp} XP</span>
          </div>
          <Progress value={(profileStats.xp / profileStats.nextLevelXp) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">Faltam {profileStats.nextLevelXp - profileStats.xp} XP para o próximo nível</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <achievement.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                      {activity.lesson && <span className="text-muted-foreground"> "{activity.lesson}"</span>}
                      {activity.achievement && <span className="text-muted-foreground"> "{activity.achievement}"</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">+{activity.xp} XP</Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{userProfile.email}</p>
          </div>
          <div className="flex gap-4 pt-4">
            {userProfile.instagramProfile && (
              <a
                href={`https://instagram.com/${userProfile.instagramProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            )}
            {userProfile.linkedInProfile && (
              <a
                href={`https://linkedin.com/in/${userProfile.linkedInProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}