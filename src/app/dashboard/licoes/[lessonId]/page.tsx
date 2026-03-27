'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  CheckCircle,
  Clock,
  Star,
  ArrowLeft,
  Music,
  FileText,
  Target,
  Award,
  ChevronRight,
  ChevronLeft,
  Circle,
  Volume2,
  Pause
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Dados mockados das aulas - em produção viria do backend
const lessonsData: Record<number, any> = {
  1: {
    id: 1,
    title: "Introdução à Música",
    description: "Aprenda os conceitos básicos da teoria musical",
    duration: "15 min",
    difficulty: "Iniciante",
    xp: 50,
    instrument: "Teoria",
    completed: true,
    course: "Fundamentos da Música",
    subtopics: [
      {
        id: 0,
        title: "Introdução às Escalas",
        completed: false,
        type: "text-image",
        content: {
          text: `As escalas são sequências de notas musicais organizadas em uma ordem específica. Elas são fundamentais para a composição e improvisação musical.

Uma escala é como um "alfabeto musical" - ela nos dá as notas que funcionam bem juntas em uma determinada tonalidade. Existem dois tipos principais de escalas: maiores e menores.

As escalas maiores tendem a soar mais alegres e brilhantes, enquanto as escalas menores têm um caráter mais melancólico e sombrio.`,
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
          imageAlt: "Piano keyboard showing scale pattern"
        }
      },
      {
        id: 1,
        title: "Estrutura da Escala Maior",
        completed: false,
        type: "text-video",
        content: {
          text: `A escala maior é formada por uma sequência específica de tons e semitons:

**Tom - Tom - Semitom - Tom - Tom - Tom - Semitom**

Por exemplo, a escala de Dó Maior:
• Dó - Ré (tom)
• Ré - Mi (tom)
• Mi - Fá (semitom)
• Fá - Sol (tom)
• Sol - Lá (tom)
• Lá - Si (tom)
• Si - Dó (semitom)

Esta fórmula pode ser aplicada a qualquer nota inicial para criar uma escala maior.`,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          videoTitle: "Como construir escalas maiores"
        }
      },
      {
        id: 2,
        title: "Estrutura da Escala Menor",
        completed: false,
        type: "text-audio",
        content: {
          text: `A escala menor natural segue um padrão diferente de tons e semitons:

**Tom - Semitom - Tom - Tom - Semitom - Tom - Tom**

Por exemplo, a escala de Lá Menor (relativa de Dó Maior):
• Lá - Si (tom)
• Si - Dó (semitom)
• Dó - Ré (tom)
• Ré - Mi (tom)
• Mi - Fá (semitom)
• Fá - Sol (tom)
• Sol - Lá (tom)

Note que Lá menor e Dó maior compartilham as mesmas notas, mas começam em pontos diferentes.`,
          audioUrl: "https://example.com/audio/minor-scale.mp3",
          audioTitle: "Exemplo de escala menor"
        }
      },
      {
        id: 3,
        title: "Exercício Prático",
        completed: false,
        type: "text",
        content: {
          text: `**Agora é sua vez de praticar!**

**Exercício 1:** Construa a escala de Sol Maior
Use a fórmula: Tom - Tom - Semitom - Tom - Tom - Tom - Semitom

**Exercício 2:** Construa a escala de Mi Menor
Use a fórmula: Tom - Semitom - Tom - Tom - Semitom - Tom - Tom

**Exercício 3:** Toque no seu instrumento
Pratique as escalas que você construiu no seu instrumento. Comece devagar e aumente gradualmente a velocidade.

**Dica:** Use um metrônomo para manter o tempo consistente enquanto pratica as escalas.`
        }
      },
      {
        id: 4,
        title: "Quiz de Verificação",
        completed: false,
        type: "quiz",
        content: {
          text: `Teste seus conhecimentos sobre escalas maiores e menores:

**Pergunta 1:** Quantos tons existem entre a primeira e a terceira nota de uma escala maior?
a) 1 tom
b) 2 tons
c) 3 tons
d) 1,5 tons

**Resposta correta:** b) 2 tons

**Pergunta 2:** Qual é a relativa menor da escala de Sol Maior?
a) Ré menor
b) Mi menor
c) Lá menor
d) Si menor

**Resposta correta:** b) Mi menor

Parabéns por completar esta lição!`
        }
      }
    ],
    nextLesson: 2,
    previousLesson: null
  },
  2: {
    id: 2,
    title: "Ritmo Básico",
    description: "Entenda e pratique ritmos simples",
    duration: "20 min",
    difficulty: "Iniciante",
    xp: 75,
    instrument: "Percussão",
    completed: true,
    course: "Fundamentos da Música",
    subtopics: [
      {
        id: 0,
        title: "O que é Ritmo?",
        completed: false,
        type: "text",
        content: {
          text: `O ritmo é a organização temporal dos sons musicais. Ele determina quando os sons acontecem e por quanto tempo duram.

O ritmo musical é como o coração da música - ele dá vida e movimento às melodias e harmonias. Sem ritmo, a música seria apenas uma sequência de notas sem direção.`
        }
      },
      {
        id: 1,
        title: "Figuras Rítmicas",
        completed: false,
        type: "text-image",
        content: {
          text: `As figuras rítmicas indicam a duração relativa das notas:

• **Semínima (♩):** 1 tempo
• **Mínima (♪):** 2 tempos
• **Semibreve (♫):** 4 tempos
• **Colcheia (♪♪):** 1/2 tempo
• **Semicolcheia (♪♪♪♪):** 1/4 tempo

Cada figura tem um valor específico em relação às outras.`,
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
          imageAlt: "Musical notes and rhythms"
        }
      }
    ],
    nextLesson: 3,
    previousLesson: 1
  },
  3: {
    id: 3,
    title: "Escala de Dó Maior",
    description: "Aprenda a tocar a escala mais importante",
    duration: "25 min",
    difficulty: "Intermediário",
    xp: 100,
    instrument: "Piano",
    completed: false,
    course: "Fundamentos da Música",
    subtopics: [
      {
        id: 0,
        title: "A Escala de Dó Maior",
        completed: false,
        type: "text",
        content: {
          text: `A escala de Dó Maior é a escala mais simples e importante para começar a aprender música. Ela não tem sustenidos nem bemóis.

Notas: Dó - Ré - Mi - Fá - Sol - Lá - Si - Dó`
        }
      }
    ],
    nextLesson: 4,
    previousLesson: 2
  }
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const lesson = lessonsData[parseInt(lessonId)];

  const [currentSubtopic, setCurrentSubtopic] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!lesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Aula não encontrada</h2>
            <p className="text-muted-foreground">A aula que você está procurando não existe.</p>
            <Link href="/dashboard/licoes">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Lições
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentContent = lesson.subtopics[currentSubtopic];
  const progress = ((currentSubtopic + 1) / lesson.subtopics.length) * 100;

  const handleNext = () => {
    if (currentSubtopic < lesson.subtopics.length - 1) {
      setCurrentSubtopic(currentSubtopic + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSubtopic > 0) {
      setCurrentSubtopic(currentSubtopic - 1);
    }
  };

  const handleComplete = () => {
    router.push("/dashboard/licoes");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-card border-b border-border md:border-b-0 md:border-r flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <Link
            href="/dashboard/licoes"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </Link>
          <h2 className="text-foreground mb-1">{lesson.title}</h2>
          <p className="text-sm text-muted-foreground">{lesson.course}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Subtopics List */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {lesson.subtopics.map((subtopic: any, index: number) => (
              <button
                key={subtopic.id}
                onClick={() => setCurrentSubtopic(index)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                  currentSubtopic === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-[#FFF8E1] text-foreground"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {subtopic.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{subtopic.title}</p>
                  <p className="text-xs opacity-80 mt-0.5">
                    {index === currentSubtopic ? "Em andamento" : `Tópico ${index + 1}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="bg-[#FFF8E1] border border-primary rounded-lg p-3 text-sm">
            <p className="text-foreground">
              <strong>+{lesson.xp} XP</strong> ao completar esta lição
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-foreground mb-6">{currentContent.title}</h1>

            {/* Text Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-foreground whitespace-pre-line leading-relaxed">
                {currentContent.content.text}
              </div>
            </div>

            {/* Media Content */}
            {currentContent.type === "text-image" && currentContent.content.imageUrl && (
              <div className="mb-8">
                <img
                  src={currentContent.content.imageUrl}
                  alt={currentContent.content.imageAlt || "Lesson illustration"}
                  className="w-full rounded-xl shadow-md"
                />
              </div>
            )}

            {currentContent.type === "text-video" && currentContent.content.videoUrl && (
              <div className="mb-8">
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-foreground mb-3">{currentContent.content.videoTitle}</h3>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src={currentContent.content.videoUrl}
                      title={currentContent.content.videoTitle}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}

            {currentContent.type === "text-audio" && currentContent.content.audioUrl && (
              <div className="mb-8">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-primary text-primary-foreground p-4 rounded-full hover:opacity-90 transition-opacity"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2">{currentContent.content.audioTitle}</h3>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-primary w-0 transition-all" />
                      </div>
                    </div>
                    <Volume2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-border bg-card p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentSubtopic === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentSubtopic === 0
                  ? "opacity-50 cursor-not-allowed text-muted-foreground"
                  : "bg-muted text-foreground hover:bg-[#FFF8E1]"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="text-sm text-muted-foreground">
              {currentSubtopic + 1} de {lesson.subtopics.length}
            </div>

            {currentSubtopic === lesson.subtopics.length - 1 ? (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <CheckCircle className="w-5 h-5" />
                Completar Lição
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Próximo
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}