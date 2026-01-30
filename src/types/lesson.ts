import { MusicalQuality, MusicalMaterial } from './music';

/**
 * Estados da lição na trilha de aprendizado.
 */
export type LessonStatus = 'locked' | 'available' | 'completed';

/**
 * Diferenciação entre conteúdo teórico e desafios práticos.
 */
export type StepType = 'theory' | 'quiz';

/**
 * Estrutura de um desafio (Quiz).
 */
export interface QuizStep {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string; // Baseado na Scliar, para explicar o porquê do acerto/erro
}

/**
 * Estrutura de uma explicação teórica.
 */
export interface TheoryStep {
  content: string; // Texto formatado (pode aceitar Markdown futuramente)
  materialType?: MusicalMaterial; // Identifica se o foco é Som ou Silêncio
  highlightedQualities?: MusicalQuality[]; // Qualidades em destaque (ex: ['Duração'])
  imageUrl?: string; // Para mostrar pautas, pentagramas ou instrumentos
  audioUrl?: string; // Fundamental para ouvir as qualidades do som
}

/**
 * Um passo (Step) individual dentro de uma lição.
 * O campo 'type' serve como discriminador para o TypeScript saber se é teoria ou quiz.
 */
export interface LessonStep {
  id: string;
  type: StepType;
  title: string;
  data: TheoryStep | QuizStep;
}

/**
 * Interface principal da Lição.
 */
export interface Lesson {
  id: string;
  slug: string; // Ex: 'qualidades-do-som-e-silencio'
  title: string;
  description: string;
  status: LessonStatus;
  module: number; // Referência ao módulo ao qual pertence
  steps: LessonStep[];
}

/**
 * Estrutura de um Módulo, que agrupa várias lições.
 */
export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}