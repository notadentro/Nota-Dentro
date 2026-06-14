import { MusicalQuality, MusicalMaterial } from './music';

/**
 * Estados da lição na trilha de aprendizado.
 */
export type LessonStatus = 'locked' | 'available' | 'completed';

/**
 * Diferenciação entre conteúdo teórico e desafios práticos.
 */
export type StepType = 'theory' | 'quiz' | 'true_false' | 'match_columns' | 'memory_game' | 'fill_blanks' | 'sandbox_audio' | 'drag_drop_pauta' | 'drag_drop_pizza' | 'graphic_showcase';

/**
 * Estrutura de um desafio (Quiz).
 */
export interface QuizStep {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  wrongExplanations?: Record<string, string>;
}

/**
 * Estrutura de um desafio Verdadeiro/Falso.
 */
export interface TrueFalseStep {
  statement: string;
  isTrue: boolean;
  explanation: string;
  wrongExplanation?: string;
}

/**
 * Estrutura para Correspondência entre Colunas (Match Columns).
 */
export interface MatchColumnsStep {
  question: string;
  pairs: { left: string; right: string }[];
  explanation: string;
}

/**
 * Estrutura para Jogo da Memória.
 */
export interface MemoryGameStep {
  question: string;
  pairs: { item1: string; item2: string }[];
  explanation: string;
}

/**
 * Estrutura para Completar Lacunas (Fill in the Blanks).
 */
export interface FillBlanksStep {
  question: string;
  text: string; // Exemplo: "O som possui quatro qualidades: {0}, {1}, intensidade e timbre."
  blanks: string[]; // As respostas corretas em ordem: ["altura", "duração"]
  options: string[]; // Opções para o banco de palavras (misturadas com as corretas)
  explanation: string;
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
 * Estrutura de uma Invenção de Áudio (Sandbox Oscilador)
 */
export interface SandboxAudioStep {
  question: string;
  successMessage: string;
}

export interface DragDropPautaStep {
  question: string;
  expectedTarget: 'line-1' | 'space-1' | 'line-2' | 'space-2' | 'line-3' | 'space-3' | 'line-4' | 'space-4' | 'line-5';
  successMessage: string;
}

export interface DragDropPizzaStep {
  question: string;
  expectedTarget: string[];
  successMessage: string;
}

export interface GraphicShowcaseItem {
  name: string;
  image_url?: string;
  symbol?: string;
  description: string;
}

export interface GraphicShowcaseStep {
  items: GraphicShowcaseItem[];
  content?: string;
}

/**
 * Um passo (Step) individual dentro de uma lição.
 * O campo 'type' serve como discriminador para o TypeScript saber se é teoria ou quiz.
 */
export interface LessonStep {
  id: string;
  type: StepType;
  title: string;
  source?: string; // Fonte bibliográfica. Ex: "Teoria Clássica", "Fundamentos Musicais"
  avatar?: 'odette' | 'scliar' | 'priolli' | 'med' | 'mascarenhas' | 'annie'; // Professor avatar
  data: TheoryStep | QuizStep | TrueFalseStep | MatchColumnsStep | MemoryGameStep | FillBlanksStep | SandboxAudioStep | DragDropPautaStep | DragDropPizzaStep | GraphicShowcaseStep;
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