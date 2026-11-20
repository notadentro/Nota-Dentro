'use client';

import { PlayCircle, CheckCircle, Lock, Music, Guitar, Mic, Piano, Headphones, Clock, Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LicoesPage() {
  const router = useRouter();

  const courses = [
    { id: 1, title: "Fundamentos da Música", instrument: "Teoria",  icon: Music,  progress: 80, completed: 8,  total: 10, color: "#FFC107", locked: false },
    { id: 2, title: "Violão para Iniciantes", instrument: "Violão",  icon: Guitar, progress: 45, completed: 7,  total: 15, color: "#FF6B35", locked: false },
    { id: 3, title: "Técnicas Vocais",         instrument: "Canto",   icon: Mic,    progress: 20, completed: 2,  total: 12, color: "#E040FB", locked: false },
    { id: 4, title: "Piano Clássico",          instrument: "Piano",   icon: Piano,  progress: 0,  completed: 0,  total: 20, color: "#ADD8E6", locked: true  },
  ];

  const currentLesson = {
    title: "Escalas Maiores e Menores",
    course: "Fundamentos da Música",
    duration: "15 min",
    xp: 50,
    description: "Aprenda a diferença entre escalas maiores e menores e como aplicá-las na prática.",
    progress: 70, // percent of lesson already seen in a previous session
  };

  const lessons = [
    { id: 1, title: "Introdução às Notas Musicais", duration: "10 min", xp: 30,  status: "completed" },
    { id: 2, title: "Ritmo e Compasso",             duration: "12 min", xp: 40,  status: "completed" },
    { id: 3, title: "Intervalos Musicais",           duration: "15 min", xp: 50,  status: "completed" },
    { id: 4, title: "Acordes Básicos",               duration: "18 min", xp: 60,  status: "completed" },
    { id: 5, title: "Escalas Maiores e Menores",     duration: "15 min", xp: 50,  status: "current"   },
    { id: 6, title: "Harmonia Funcional",            duration: "20 min", xp: 70,  status: "locked"    },
    { id: 7, title: "Modulação e Transposição",      duration: "22 min", xp: 80,  status: "locked"    },
  ];

  return (
    <div className="w-full px-4 sm:px-8 py-6 space-y-6 font-body">

      {/* ── Continue Learning ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#FFC107]/30 shadow-[0_6px_0_0_#E6AC00]"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" }}>
        {/* Decorative notes */}
        <div className="absolute right-6 top-4 text-6xl opacity-5 rotate-12 select-none text-white">♪</div>
        <div className="absolute right-20 bottom-4 text-4xl opacity-5 -rotate-6 select-none text-white">♫</div>

        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-[#FFC107]/20 border border-[#FFC107]/40 rounded-full px-3 py-1">
              <Headphones className="w-4 h-4 text-[#FFC107]" />
              <span className="text-xs font-bold text-[#FFC107] uppercase tracking-wider">Continuar Aprendendo</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
            {currentLesson.title}
          </h2>
          <p className="text-white/60 text-sm mb-1">{currentLesson.course}</p>
          <p className="text-white/80 text-sm mb-5 max-w-lg">{currentLesson.description}</p>

          {/* Lesson progress bar */}
          <div className="mb-5 max-w-sm">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/60">Progresso da lição</span>
              <span className="text-[#FFC107] font-bold">{currentLesson.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full bg-[#FFC107]" style={{ width: `${currentLesson.progress}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/ritmo-insano/niveis")}
              className="flex items-center gap-2 bg-[#FFC107] hover:bg-[#FFB300] text-[#1a1a1a] font-bold px-6 py-3 rounded-xl shadow-[0_4px_0_0_#E6AC00] hover:shadow-[0_2px_0_0_#E6AC00] hover:translate-y-0.5 transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              Continuar Lição
            </button>
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{currentLesson.duration}</span>
              <span className="flex items-center gap-1.5 text-[#FFC107] font-bold"><Zap className="w-4 h-4" />+{currentLesson.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Seus Cursos ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Seus Cursos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                onClick={() => !course.locked && router.push("/ritmo-insano/niveis")}
                className={`bg-card rounded-2xl p-5 border-2 transition-all duration-200 ${
                  course.locked
                    ? "border-border opacity-60 cursor-not-allowed"
                    : "border-border hover:border-[#FFC107] hover:shadow-[0_6px_0_0_#E6AC00] hover:-translate-y-1 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${course.color}18` }}>
                    <Icon className="w-6 h-6" style={{ color: course.color }} />
                  </div>
                  {course.locked ? (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-bold text-foreground text-sm mb-0.5 leading-tight">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{course.instrument}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>{course.completed}/{course.total} lições</span>
                    <span style={{ color: course.color }}>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Lesson List ────────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Fundamentos da Música — Lições</h2>
          <span className="w-fit text-xs bg-[#FFF8E1] text-[#D4A017] border border-[#FFC107]/30 font-bold px-3 py-1 rounded-full">
            8/10 concluídas
          </span>
        </div>
        <div className="divide-y divide-border">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                lesson.status === "current" ? "bg-[#FFF8E1] hover:bg-[#FFF3CD]" :
                lesson.status === "completed" ? "hover:bg-green-50" :
                "opacity-50 cursor-not-allowed"
              }`}
            >
              {/* Status icon */}
              <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                lesson.status === "completed" ? "bg-green-500" :
                lesson.status === "current" ? "bg-[#FFC107] shadow-[0_3px_0_0_#E6AC00]" :
                "bg-muted"
              }`}>
                {lesson.status === "completed" ? <CheckCircle className="w-5 h-5 text-white" /> :
                 lesson.status === "current"   ? <PlayCircle className="w-5 h-5 text-[#1a1a1a]" /> :
                 <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{idx + 1}.</span>
                  <h3 className={`text-sm font-semibold truncate ${
                    lesson.status === "locked" ? "text-muted-foreground" : "text-foreground"
                  }`}>{lesson.title}</h3>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#D4A017]"><Zap className="w-3 h-3" />+{lesson.xp} XP</span>
                </div>
              </div>

              {/* CTA */}
              {lesson.status === "current" && (
                <button
                  onClick={() => router.push("/ritmo-insano/niveis")}
                  className="shrink-0 bg-[#FFC107] hover:bg-[#FFB300] text-[#1a1a1a] font-bold text-xs px-4 py-2 rounded-xl shadow-[0_3px_0_0_#E6AC00] hover:shadow-[0_1px_0_0_#E6AC00] hover:translate-y-0.5 transition-all"
                >
                  Iniciar
                </button>
              )}
              {lesson.status === "completed" && (
                <span className="shrink-0 text-xs text-green-600 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Concluída</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
