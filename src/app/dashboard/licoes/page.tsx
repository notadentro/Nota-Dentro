'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Music, Play, CheckCircle, Lock, Star, Clock } from "lucide-react";
import Link from "next/link";

const lessons = [
  {
    id: 1,
    title: "Introdução à Música",
    description: "Aprenda os conceitos básicos da teoria musical",
    duration: "15 min",
    difficulty: "Iniciante",
    xp: 50,
    completed: true,
    instrument: "Teoria"
  },
  {
    id: 2,
    title: "Ritmo Básico",
    description: "Entenda e pratique ritmos simples",
    duration: "20 min",
    difficulty: "Iniciante",
    xp: 75,
    completed: true,
    instrument: "Percussão"
  },
  {
    id: 3,
    title: "Escala de Dó Maior",
    description: "Aprenda a tocar a escala mais importante",
    duration: "25 min",
    difficulty: "Intermediário",
    xp: 100,
    completed: false,
    instrument: "Piano"
  },
  {
    id: 4,
    title: "Acordes Fundamentais",
    description: "Domine os acordes básicos para acompanhar músicas",
    duration: "30 min",
    difficulty: "Intermediário",
    xp: 125,
    completed: false,
    instrument: "Guitarra"
  },
  {
    id: 5,
    title: "Técnica Vocal",
    description: "Melhore sua voz com exercícios de aquecimento",
    duration: "20 min",
    difficulty: "Avançado",
    xp: 150,
    completed: false,
    instrument: "Vocal"
  },
  {
    id: 6,
    title: "Improvisação",
    description: "Aprenda a criar suas próprias melodias",
    duration: "35 min",
    difficulty: "Avançado",
    xp: 200,
    completed: false,
    instrument: "Todos"
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Iniciante": return "bg-green-100 text-green-800";
    case "Intermediário": return "bg-yellow-100 text-yellow-800";
    case "Avançado": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getInstrumentIcon = (instrument: string) => {
  switch (instrument) {
    case "Piano": return "🎹";
    case "Guitarra": return "🎸";
    case "Vocal": return "🎤";
    case "Percussão": return "🥁";
    case "Teoria": return "📚";
    default: return "🎵";
  }
};

export default function LicoesPage() {
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const totalXp = lessons.reduce((sum, l) => sum + (l.completed ? l.xp : 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2">Ambiente de Aprendizagem 🎵</h1>
        <p className="text-muted-foreground">Continue sua jornada musical com lições interativas</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lições Completadas</p>
                <p className="text-2xl font-bold">{completedLessons}/{totalLessons}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={(completedLessons / totalLessons) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">XP Ganho</p>
                <p className="text-2xl font-bold">{totalXp}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próxima Lição</p>
                <p className="text-lg font-semibold">Escala de Dó Maior</p>
              </div>
              <Play className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className={`hover:shadow-lg transition-shadow ${lesson.completed ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getInstrumentIcon(lesson.instrument)}</span>
                  <div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{lesson.instrument}</p>
                  </div>
                </div>
                {lesson.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                <Badge className={getDifficultyColor(lesson.difficulty)}>
                  {lesson.difficulty}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{lesson.xp} XP</span>
                </div>
              </div>

              {lesson.completed || lesson.id === completedLessons + 1 ? (
                <Link href={`/dashboard/licoes/${lesson.id}`}>
                  <Button
                    className="w-full"
                    variant={lesson.completed ? "outline" : "default"}
                  >
                    {lesson.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Revisar Lição
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Lição
                      </>
                    )}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full"
                  variant="outline"
                  disabled
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Bloqueada
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
