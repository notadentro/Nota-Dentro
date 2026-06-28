export type TimeSignature = [number, number]; // [numerator, denominator]

export type RhythmCellBase = 
  | 'semibreve' // 4 tempos
  | 'minima'    // 2 tempos
  | 'minima_pontuada' // 3 tempos
  | 'seminima'  // 1 tempo
  | 'seminima_pontuada' // 1.5 tempos
  | 'pausa'     // pausa de seminima
  | 'pausa_minima' // pausa de minima
  | 'colcheia'    // 0.5 tempo
  | 'colcheia_pontuada' // 0.75 tempo
  | 'duas_colcheias' // 1 tempo
  | 'quatro_semicolcheias' // 1 tempo
  | 'colcheia_pausa_colcheia' // 1 tempo
  | 'pausa_colcheia_colcheia' // 1 tempo
  | 'colcheia_seminima_colcheia'; // 2 tempos

export type RhythmCell = RhythmCellBase | `${RhythmCellBase}_ligada`;

export type LevelDef = {
  id: number;
  name: string;
  timeSignature: [number, number]; // [numBeats, beatValue]
  upperVoice: RhythmCell[];
  lowerVoice: RhythmCell[];
  isTutorial?: boolean;
  instruction?: {
    title: string;
    text: string;
  }
};

export interface LevelDefinition {
  id: number;
  name: string;
  timeSignature: TimeSignature;
  upperVoice: RhythmCell[]; // Mão Direita (J) agora
  lowerVoice: RhythmCell[]; // Mão Esquerda (F) agora
  instruction?: {
    title: string;
    text: string;
  };
  isTutorial?: boolean;
}

export const GAME_LEVELS: LevelDefinition[] = [
  // ============================================================================
  // MUNDO 0: TUTORIAL BÁSICO
  // ============================================================================
  {
    id: 0,
    name: "Tutorial de Controles",
    timeSignature: [4, 4],
    isTutorial: true,
    upperVoice: [
      // Mão Direita Sozinha (M1, M2)
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      // Espera Mão Esquerda (M3, M4)
      'pausa_minima', 'pausa_minima',
      'pausa_minima', 'pausa_minima',
      // Juntas (M5)
      'seminima', 'seminima', 'seminima', 'seminima',
      // Mínimas (M6)
      'minima', 'minima',
      // Semibreve (M7)
      'semibreve',
      // Contratempos (M8)
      'pausa', 'seminima', 'pausa', 'seminima',
      // Fim (M9)
      'semibreve'
    ],
    lowerVoice: [
      // Espera Mão Direita (M1, M2)
      'pausa_minima', 'pausa_minima',
      'pausa_minima', 'pausa_minima',
      // Mão Esquerda Sozinha (M3, M4)
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      // Juntas (M5, M6, M7)
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      // Contratempos (M8)
      'seminima', 'pausa', 'seminima', 'pausa',
      // Fim (M9)
      'semibreve'
    ],
    instruction: {
      title: "Introdução",
      text: "Siga o tutorial para aprender os controles básicos do Ritmo Insano."
    }
  },

  // ============================================================================
  // MUNDO 1: O TODO E AS METADES (A Beleza das Notas Longas)
  // Foco: 8 Compassos (32 tempos) usando APENAS Semibreves e Mínimas. 
  // O aluno vivencia a Unidade e a respiração antes da agilidade.
  // ============================================================================
  {
    id: 1,
    name: "A Unidade do Tempo",
    timeSignature: [4, 4],
    // 8 Semibreves = 32 tempos cravados
    upperVoice: [
      'semibreve', 'semibreve', 'semibreve', 'semibreve', 
      'semibreve', 'semibreve', 'semibreve', 'semibreve'
    ],
    lowerVoice: [],
    instruction: {
      title: "Respire com a Música",
      text: "Bem-vindo ao Mundo 1! A Semibreve é o Todo (a Unidade). Quando ela atingir o alvo, pressione J e SEGURE firmemente por 4 tempos inteiros. Sinta a beleza da nota longa!"
    }
  },
  {
    id: 2,
    name: "O Despertar da Mínima",
    timeSignature: [4, 4],
    // Mistura de Semibreves (4) e Mínimas (2) = 32 tempos
    upperVoice: [
      'semibreve', 'semibreve', 
      'minima', 'minima', 'minima', 'minima', 
      'semibreve', 'semibreve',
      'minima', 'minima', 'minima', 'minima'
    ],
    lowerVoice: []
  },
  {
    id: 3,
    name: "Uníssono Motor",
    timeSignature: [4, 4],
    // Espelho perfeito por 8 compassos
    upperVoice: [
      'minima', 'minima', 'semibreve', 
      'minima', 'minima', 'semibreve',
      'semibreve', 'semibreve', 'semibreve', 'semibreve'
    ],
    lowerVoice: [
      'minima', 'minima', 'semibreve', 
      'minima', 'minima', 'semibreve',
      'semibreve', 'semibreve', 'semibreve', 'semibreve'
    ],
    instruction: {
      title: "O Espelho",
      text: "A tela dividiu! Use F (esquerda) e J (direita) EXATAMENTE ao mesmo tempo. Suas mãos devem trabalhar em simetria por 8 compassos."
    }
  },
  {
    id: 4,
    name: "Transferência de Peso",
    timeSignature: [4, 4],
    // Alternância longa usando pausas fantasma
    upperVoice: [
      'minima', 'pausa_minima', 'minima', 'pausa_minima',
      'semibreve', 'pausa_minima', 'pausa_minima',
      'minima', 'pausa_minima', 'minima', 'pausa_minima'
    ],
    lowerVoice: [
      'pausa_minima', 'minima', 'pausa_minima', 'minima',
      'pausa_minima', 'pausa_minima', 'semibreve',
      'pausa_minima', 'minima', 'pausa_minima', 'minima'
    ]
  },
  {
    id: 5,
    name: "Ostinato Lento",
    timeSignature: [4, 4],
    // U: 8 semibreves = 32 tempos
    upperVoice: [
      'semibreve', 'semibreve', 'semibreve', 'semibreve',
      'semibreve', 'semibreve', 'semibreve', 'semibreve'
    ],
    // L: 16 minimas = 32 tempos
    lowerVoice: [
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima',
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima'
    ],
    instruction: {
      title: "Independência Primária",
      text: "A mão esquerda (F) agora é um pêndulo lento e ininterrupto de Mínimas (2 em 2 tempos). A direita (J) segura as Semibreves. Não deixe o pêndulo parar!"
    }
  },
  {
    id: 6,
    name: "Ostinato Lento Reverso",
    timeSignature: [4, 4],
    upperVoice: [
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima',
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima'
    ],
    lowerVoice: [
      'semibreve', 'semibreve', 'semibreve', 'semibreve',
      'semibreve', 'semibreve', 'semibreve', 'semibreve'
    ]
  },
  {
    id: 7,
    name: "O Silêncio Maior",
    timeSignature: [4, 4],
    // Treinando o freio inibitório com blocos grandes de tempo
    upperVoice: [
      'semibreve', 'pausa_minima', 'pausa_minima',
      'minima', 'minima', 'pausa_minima', 'minima',
      'semibreve', 'semibreve', 'pausa_minima', 'pausa_minima'
    ],
    lowerVoice: []
  },
  {
    id: 8,
    name: "O Cânone de Mínimas",
    timeSignature: [4, 4],
    upperVoice: [
      'minima', 'minima', 'pausa_minima', 'minima',
      'semibreve', 'semibreve',
      'minima', 'minima', 'pausa_minima', 'pausa_minima'
    ],
    lowerVoice: [
      'pausa_minima', 'minima', 'minima', 'minima',
      'semibreve', 'semibreve',
      'pausa_minima', 'minima', 'minima', 'minima'
    ]
  },
  {
    id: 9,
    name: "Pêndulo Quebrado",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve', 'minima', 'minima', 
      'semibreve', 'pausa_minima', 'minima',
      'semibreve', 'minima', 'minima'
    ],
    lowerVoice: [
      'minima', 'minima', 'semibreve',
      'pausa_minima', 'minima', 'semibreve',
      'minima', 'minima', 'semibreve'
    ]
  },
  {
    id: 10,
    name: "Boss do Mundo 1: Resistência Tética",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve', 'pausa_minima', 'minima',
      'semibreve', 'minima', 'pausa_minima',
      'semibreve', 'semibreve', 'pausa_minima', 'minima', 'minima', 'minima'
    ],
    // Mão esquerda inabalável por 8 compassos
    lowerVoice: [
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima',
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima'
    ],
    instruction: {
      title: "O Pêndulo de Aço",
      text: "Boss do Mundo 1! A sua mão esquerda baterá Mínimas por 8 compassos seguidos sem errar. A direita terá notas longas e pausas falsas. Ancore a mente na esquerda!"
    }
  },

  // ============================================================================
  // MUNDO 2: O DESPERTAR DA SEMÍNIMA (Os Quartos de Tempo)
  // Foco: 8 Compassos (32 tempos). A Semínima vira o passo natural (Tap rápido).
  // ============================================================================
  {
    id: 11,
    name: "A Marcha",
    timeSignature: [4, 4],
    // 32 seminimas
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [],
    instruction: {
      title: "Um Quarto da Unidade",
      text: "Mundo 2! A Semibreve foi dividida em 4 partes iguais. Agora a Semínima pede apenas um toque (Tap) rápido. Sinta o pulso de marcha por 8 compassos."
    }
  },
  {
    id: 12,
    name: "Hold vs Tap",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve', 
      'seminima', 'seminima', 'seminima', 'seminima',
      'minima', 'minima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'minima', 'minima',
      'semibreve'
    ],
    lowerVoice: []
  },
  {
    id: 13,
    name: "Passos Alternados",
    timeSignature: [4, 4],
    // Direita e Esquerda conversam com semínimas e pausas
    upperVoice: [
      'seminima', 'pausa', 'seminima', 'pausa',
      'minima', 'minima',
      'seminima', 'pausa', 'seminima', 'pausa',
      'semibreve',
      'seminima', 'pausa', 'seminima', 'pausa',
      'minima', 'minima',
      'seminima', 'seminima', 'minima'
    ],
    lowerVoice: [
      'pausa', 'seminima', 'pausa', 'seminima',
      'minima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima',
      'semibreve',
      'pausa', 'seminima', 'pausa', 'seminima',
      'minima', 'minima',
      'minima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "Caminhada Rítmica",
      text: "Use F e J alternadamente, como se fossem os passos dos seus pés (Direito, Esquerdo, Direto...). Cuidado com as Mínimas e Semibreves intrusas!"
    }
  },
  {
    id: 14,
    name: "O Pulo (Pausas)",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'pausa', 'pausa', 'seminima',
      'seminima', 'seminima', 'minima',
      'pausa', 'seminima', 'seminima', 'pausa',
      'semibreve',
      'seminima', 'pausa', 'pausa', 'seminima',
      'minima', 'minima',
      'pausa', 'pausa', 'minima',
      'semibreve'
    ],
    lowerVoice: []
  },
  {
    id: 15,
    name: "Ostinato de Marcha",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve', 
      'minima', 'minima',
      'semibreve',
      'minima', 'minima',
      'semibreve',
      'minima', 'minima',
      'semibreve',
      'semibreve'
    ],
    // Bumbo ininterrupto de semínimas na esquerda (32 batidas)
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "O Bumbo Inabalável",
      text: "A sua mão esquerda fará 32 Semínimas sem parar! É o motor da música. A sua mão direita fará as notas longas. Não deixe o dedo direito influenciar a batida do esquerdo."
    }
  },
  {
    id: 16,
    name: "Ostinato Invertido de Marcha",
    timeSignature: [4, 4],
    // Bumbo ininterrupto na direita
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [
      'minima', 'minima', 
      'semibreve',
      'minima', 'minima',
      'semibreve',
      'minima', 'minima',
      'semibreve',
      'semibreve',
      'semibreve'
    ]
  },
  {
    id: 17,
    name: "Metades e Quartos",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'minima',
      'minima', 'seminima', 'seminima',
      'seminima', 'seminima', 'minima',
      'semibreve',
      'seminima', 'seminima', 'minima',
      'minima', 'seminima', 'seminima',
      'seminima', 'seminima', 'minima',
      'semibreve'
    ],
    lowerVoice: [
      'minima', 'seminima', 'seminima',
      'seminima', 'seminima', 'minima',
      'minima', 'seminima', 'seminima',
      'semibreve',
      'minima', 'seminima', 'seminima',
      'seminima', 'seminima', 'minima',
      'minima', 'seminima', 'seminima',
      'semibreve'
    ]
  },
  {
    id: 18,
    name: "Espelho com Buracos",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'pausa', 'seminima', 'seminima',
      'seminima', 'seminima', 'pausa', 'seminima',
      'minima', 'pausa_minima',
      'semibreve',
      'seminima', 'pausa', 'seminima', 'seminima',
      'seminima', 'seminima', 'pausa', 'seminima',
      'pausa_minima', 'minima',
      'semibreve'
    ],
    lowerVoice: [
      'seminima', 'pausa', 'seminima', 'seminima',
      'seminima', 'seminima', 'pausa', 'seminima',
      'minima', 'pausa_minima',
      'semibreve',
      'seminima', 'pausa', 'seminima', 'seminima',
      'seminima', 'seminima', 'pausa', 'seminima',
      'pausa_minima', 'minima',
      'semibreve'
    ]
  },
  {
    id: 19,
    name: "Independência Falsa",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'pausa', 'minima',
      'pausa', 'seminima', 'minima',
      'semibreve',
      'seminima', 'pausa', 'minima',
      'pausa', 'seminima', 'minima',
      'semibreve',
      'seminima', 'seminima', 'minima',
      'semibreve'
    ],
    lowerVoice: [
      'pausa', 'seminima', 'minima',
      'seminima', 'pausa', 'minima',
      'semibreve',
      'pausa', 'seminima', 'minima',
      'seminima', 'pausa', 'minima',
      'semibreve',
      'seminima', 'seminima', 'minima',
      'semibreve'
    ]
  },
  {
    id: 20,
    name: "Boss do Mundo 2: Duelo de Pulsações",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'minima',
      'minima', 'minima',
      'seminima', 'pausa', 'minima',
      'semibreve',
      'seminima', 'seminima', 'minima',
      'minima', 'minima',
      'seminima', 'pausa', 'minima',
      'semibreve'
    ],
    // A mão esquerda faz o bumbo nos contratempos ou tempos fracos
    lowerVoice: [
      'minima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'minima', 'pausa', 'seminima',
      'semibreve',
      'minima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'minima', 'pausa', 'seminima',
      'semibreve'
    ],
    instruction: {
      title: "Desafio de Gramani",
      text: "Cuidado! Pela primeira vez as mãos vão tocar a mesma figura (Semínima) em tempos diferentes do compasso. Uma ataca enquanto a outra segura. Sobreviva aos 8 compassos!"
    }
  },
  // ============================================================================
  // MUNDO 3: O DOMÍNIO DO SILÊNCIO E O CONTRATEMPO (O Freio Inibitório)
  // Foco: 8 Compassos. Introdução das pausas e da "Penalidade do Silêncio". 
  // O jogador precisa interromper ativamente o fluxo motor.
  // ============================================================================
  {
    id: 21,
    name: "O Toque e o Silêncio",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima'
    ],
    lowerVoice: [],
    instruction: {
      title: "Segure o Impulso!",
      text: "Mundo 3! Agora o motor detecta a 'Penalidade do Silêncio'. Dê o toque rápido na semínima e TIRE o dedo ativamente na pausa. Controle seus reflexos por 8 compassos!"
    }
  },
  {
    id: 22,
    name: "O Vazio Constante",
    timeSignature: [4, 4],
    upperVoice: [
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima'
    ],
    lowerVoice: []
  },
  {
    id: 23,
    name: "Diálogo Interrompido",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima'
    ],
    lowerVoice: [
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima'
    ],
    instruction: {
      title: "Passos e Buracos",
      text: "As mãos alternam, mas agora temos silêncios longos no meio. Se você bater junto ou esquecer de pausar, o combo zera!"
    }
  },
  {
    id: 24,
    name: "Ostinato com Silêncio",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ]
  },
  {
    id: 25,
    name: "Contratempos Simples",
    timeSignature: [4, 4],
    upperVoice: [
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima'
    ],
    lowerVoice: [],
    instruction: {
      title: "O Contratempo",
      text: "Na teoria, contratempo é a pausa no tempo forte e som no tempo fraco. Sinta o balanço de tocar sempre na 'volta' da batida!"
    }
  },
  {
    id: 26,
    name: "Contratempo e Bumbo",
    timeSignature: [4, 4],
    upperVoice: [
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa', 'seminima', 'minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ]
  },
  {
    id: 27,
    name: "O Silêncio Maior",
    timeSignature: [4, 4],
    upperVoice: [
      'minima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'minima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'minima', 'pausa', 'seminima', 'pausa_minima', 'minima',
      'minima', 'pausa', 'seminima', 'pausa_minima', 'minima'
    ],
    lowerVoice: []
  },
  {
    id: 28,
    name: "Alternância Sincopada",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'pausa_minima', 'seminima', 'pausa_minima', 'minima',
      'seminima', 'pausa_minima', 'seminima', 'pausa_minima', 'minima',
      'seminima', 'pausa_minima', 'seminima', 'pausa_minima', 'minima',
      'seminima', 'pausa_minima', 'seminima', 'pausa_minima', 'minima'
    ],
    lowerVoice: [
      'pausa', 'minima', 'seminima', 'minima', 'pausa_minima',
      'pausa', 'minima', 'seminima', 'minima', 'pausa_minima',
      'pausa', 'minima', 'seminima', 'minima', 'pausa_minima',
      'pausa', 'minima', 'seminima', 'minima', 'pausa_minima'
    ]
  },
  {
    id: 29,
    name: "O Soluço Tcheco",
    timeSignature: [4, 4],
    upperVoice: [
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'pausa_minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'pausa_minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'pausa_minima',
      'pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'pausa_minima'
    ],
    lowerVoice: [
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'minima', 'minima'
    ]
  },
  {
    id: 30,
    name: "Boss do Mundo 3: Prova do Silêncio",
    timeSignature: [4, 4],
    upperVoice: [
      'pausa', 'seminima', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'pausa', 'seminima', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'pausa', 'seminima', 'seminima', 'pausa', 'minima', 'pausa_minima',
      'pausa', 'seminima', 'seminima', 'pausa', 'minima', 'pausa_minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "O Exame de Final",
      text: "Mantenha o pulso de bumbo cravado na esquerda por 8 compassos, enquanto a direita desvia das pausas! Confie no pulso!"
    }
  },

  // ============================================================================
  // MUNDO 4: O DESPERTAR DAS COLCHEIAS (A Subdivisão Binária)
  // Foco: 8 Compassos. Introdução da célula 'duas_colcheias'. O aluno 
  // divide fisicamente o pulso em apoio e impulso.
  // ============================================================================
  {
    id: 31,
    name: "Apoio e Impulso",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima'
    ],
    lowerVoice: [],
    instruction: {
      title: "Dividindo o Tempo",
      text: "Mundo 4! A Semínima foi cortada ao meio. Quando ver as duas Colcheias ligadas, dê dois toques rápidos (Apoio e Impulso) na mesma pulsação."
    }
  },
  {
    id: 32,
    name: "Correndo Mais",
    timeSignature: [4, 4],
    upperVoice: [
      'duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'duas_colcheias', 'duas_colcheias', 'minima'
    ],
    lowerVoice: []
  },
  {
    id: 33,
    name: "Espelho de Colcheias",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima'
    ],
    lowerVoice: [
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima'
    ],
    instruction: {
      title: "Agilidade Dupla",
      text: "As duas mãos vão executar as colcheias juntas. Sinta o tempo dobrar de velocidade no seu dedo."
    }
  },
  {
    id: 34,
    name: "Alternando a Subdivisão",
    timeSignature: [4, 4],
    upperVoice: [
      'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa', 'minima', 'pausa_minima',
      'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa', 'minima', 'pausa_minima',
      'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa', 'minima', 'pausa_minima',
      'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa', 'minima', 'pausa_minima'
    ],
    lowerVoice: [
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa_minima', 'minima',
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa_minima', 'minima',
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa_minima', 'minima',
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa_minima', 'minima'
    ]
  },
  {
    id: 35,
    name: "Ostinato com Colcheias 1",
    timeSignature: [4, 4],
    upperVoice: [
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "Polirritmia Acelerada",
      text: "A mão esquerda (F) faz o ostinato de semínimas. A mão direita (J) encaixa as duas colcheias entre as batidas do bumbo."
    }
  },
  {
    id: 36,
    name: "Ostinato Reverso Motor",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima'
    ],
    instruction: {
      title: "Inversão de Papéis",
      text: "Agora a sua mão direita (J) segura o pulso constante, enquanto a esquerda (F) trabalha duro na subdivisão das colcheias."
    }
  },
  {
    id: 37,
    name: "A Valsa Dividida",
    timeSignature: [4, 4],
    upperVoice: [
      'duas_colcheias', 'seminima', 'seminima', 'seminima', 'duas_colcheias', 'seminima', 'minima',
      'duas_colcheias', 'seminima', 'seminima', 'seminima', 'duas_colcheias', 'seminima', 'minima',
      'duas_colcheias', 'seminima', 'seminima', 'seminima', 'duas_colcheias', 'seminima', 'minima',
      'duas_colcheias', 'seminima', 'seminima', 'seminima', 'duas_colcheias', 'seminima', 'minima'
    ],
    lowerVoice: []
  },
  {
    id: 38,
    name: "Colisão Rítmica",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima',
      'seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima'
    ],
    lowerVoice: [
      'duas_colcheias', 'seminima', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'seminima', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'seminima', 'minima', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'seminima', 'minima', 'seminima', 'duas_colcheias', 'minima'
    ]
  },
  {
    id: 39,
    name: "Contratempo e Colcheia",
    timeSignature: [4, 4],
    upperVoice: [
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'minima', 'minima',
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'minima', 'minima',
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'minima', 'minima',
      'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'minima', 'minima'
    ],
    lowerVoice: [
      'seminima', 'pausa', 'seminima', 'pausa', 'pausa_minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'pausa_minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'pausa_minima', 'pausa_minima',
      'seminima', 'pausa', 'seminima', 'pausa', 'pausa_minima', 'pausa_minima'
    ]
  },
  {
    id: 40,
    name: "Boss do Mundo 4: A Resistência",
    timeSignature: [4, 4],
    upperVoice: [
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'seminima', 'duas_colcheias', 'minima',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'seminima', 'duas_colcheias', 'minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "Cãibra Rítmica!",
      text: "Boss Final do Mundo 4! Sua mão direita terá que fatiar a subdivisão sem parar enquanto a esquerda faz a marcação. Respire e sobreviva aos 8 compassos!"
    }
  },

  // ============================================================================
  // MUNDO 5: O BALANÇO BRASILEIRO (A Ginga e as Síncopes)
  // Foco: 8 Compassos (32 tempos) em 4/4. Deslocamento do acento natural 
  // usando a célula 'colcheia_seminima_colcheia' (que vale 2 tempos).
  // ============================================================================
  {
    id: 41,
    name: "A Ginga da Síncope",
    timeSignature: [4, 4],
    upperVoice: [
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima'
    ],
    lowerVoice: [],
    instruction: {
      title: "O Balanço Brasileiro",
      text: "Mundo 5! A síncope desloca o acento forte da música. Dê um toque rápido e SEGURE a próxima nota atravessando o tempo! Mantenha a ginga por 8 compassos."
    }
  },
  {
    id: 42,
    name: "Síncope no Contratempo",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima',
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima',
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima',
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima'
    ],
    lowerVoice: []
  },
  {
    id: 43,
    name: "Ondas Rítmicas",
    timeSignature: [4, 4],
    // Duas síncopes seguidas geram uma tensão incrível!
    upperVoice: [
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia'
    ],
    lowerVoice: []
  },
  {
    id: 44,
    name: "Apoio, Impulso e Síncope",
    timeSignature: [4, 4],
    upperVoice: [
      'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia',
      'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia',
      'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia',
      'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia'
    ],
    lowerVoice: []
  },
  {
    id: 45,
    name: "Ostinato Sincopado 1",
    timeSignature: [4, 4],
    upperVoice: [
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "Bumbo e Tamborim",
      text: "A verdadeira polirritmia! A mão esquerda faz o bumbo cravado de semínimas. O 'Hold' da síncope na mão direita vai acontecer ENQUANTO a esquerda dá um novo toque. Isole o cérebro!"
    }
  },
  {
    id: 46,
    name: "Ostinato Sincopado 2",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima',
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima',
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima',
      'seminima', 'colcheia_seminima_colcheia', 'seminima', 'seminima', 'colcheia_seminima_colcheia', 'seminima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ]
  },
  {
    id: 47,
    name: "O Mar de Síncopes",
    timeSignature: [4, 4],
    upperVoice: [
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia'
    ],
    lowerVoice: [
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima',
      'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima', 'minima'
    ]
  },
  {
    id: 48,
    name: "Ostinato Reverso Sincopado",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima'
    ],
    instruction: {
      title: "Inversão de Hemisférios",
      text: "Agora a mão direita segura a pulsação ininterrupta, enquanto a esquerda ginga com as síncopes. Domine a ambidestria!"
    }
  },
  {
    id: 49,
    name: "Silêncio antes da Ginga",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [
      'pausa', 'pausa', 'colcheia_seminima_colcheia', 'pausa', 'pausa', 'colcheia_seminima_colcheia',
      'pausa', 'pausa', 'colcheia_seminima_colcheia', 'pausa', 'pausa', 'colcheia_seminima_colcheia',
      'pausa', 'pausa', 'colcheia_seminima_colcheia', 'pausa', 'pausa', 'colcheia_seminima_colcheia',
      'pausa', 'pausa', 'colcheia_seminima_colcheia', 'pausa', 'pausa', 'colcheia_seminima_colcheia'
    ]
  },
  {
    id: 50,
    name: "Boss do Mundo 5: A Roda de Choro",
    timeSignature: [4, 4],
    upperVoice: [
      'colcheia_seminima_colcheia', 'duas_colcheias', 'seminima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'duas_colcheias', 'seminima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'duas_colcheias', 'seminima', 'colcheia_seminima_colcheia', 'minima',
      'colcheia_seminima_colcheia', 'duas_colcheias', 'seminima', 'colcheia_seminima_colcheia', 'minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "Resistência Sincopada!",
      text: "Boss do Mundo 5! A mão esquerda não perdoa um único tempo. A mão direita vai balançar entre colcheias e síncopes. Segure o ritmo!"
    }
  },

  // ============================================================================
  // MUNDO 6: OS DIVERTIMENTOS (O Ápice da Agilidade)
  // Foco: 8 Compassos em 2/4 (16 tempos). A subdivisão quaternária: 
  // O aluno executará 'quatro_semicolcheias' (1 tempo visual) em andamento rápido.
  // ============================================================================
  {
    id: 51,
    name: "A Metralhadora",
    timeSignature: [2, 4],
    upperVoice: [
      'quatro_semicolcheias', 'seminima', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'seminima', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'seminima', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'seminima', 'quatro_semicolcheias', 'seminima'
    ],
    lowerVoice: [],
    instruction: {
      title: "Subdivisão Quaternária",
      text: "Mundo 6! O compasso agora é 2/4. A semínima se dividiu em QUATRO Semicolcheias. Dê 4 toques extremamente rápidos dentro de um único tempo!"
    }
  },
  {
    id: 52,
    name: "Fôlego Rápido",
    timeSignature: [2, 4],
    upperVoice: [
      'quatro_semicolcheias', 'quatro_semicolcheias', 'minima',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'minima',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'minima',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'minima'
    ],
    lowerVoice: []
  },
  {
    id: 53,
    name: "Semicolcheias e Silêncio",
    timeSignature: [2, 4],
    upperVoice: [
      'quatro_semicolcheias', 'pausa', 'duas_colcheias', 'pausa',
      'quatro_semicolcheias', 'pausa', 'duas_colcheias', 'pausa',
      'quatro_semicolcheias', 'pausa', 'duas_colcheias', 'pausa',
      'quatro_semicolcheias', 'pausa', 'duas_colcheias', 'pausa'
    ],
    lowerVoice: [],
    instruction: {
      title: "Acelera e Freia",
      text: "O controle absoluto! Exploda em 4 toques e no milissegundo seguinte paralise a mão para respeitar o silêncio."
    }
  },
  {
    id: 54,
    name: "Síncope e Semicolcheia",
    timeSignature: [2, 4],
    // Lembrando: Síncope vale 2 tempos inteiros no 2/4.
    upperVoice: [
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'seminima',
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'seminima',
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'seminima',
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'seminima'
    ],
    lowerVoice: []
  },
  {
    id: 55,
    name: "Divertimento em 2/4",
    timeSignature: [2, 4],
    upperVoice: [
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "Polirritmia Extrema",
      text: "A mão esquerda marca as Semínimas. A direita faz a leitura do Divertimento. Isole os hemisférios!"
    }
  },
  {
    id: 56,
    name: "A Marcha Quebrada",
    timeSignature: [2, 4],
    upperVoice: [
      'quatro_semicolcheias', 'pausa', 'colcheia_seminima_colcheia',
      'quatro_semicolcheias', 'pausa', 'colcheia_seminima_colcheia',
      'quatro_semicolcheias', 'pausa', 'colcheia_seminima_colcheia',
      'quatro_semicolcheias', 'pausa', 'colcheia_seminima_colcheia'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima'
    ]
  },
  {
    id: 57,
    name: "O Motor Esquerdo",
    timeSignature: [2, 4],
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima',
      'quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima'
    ],
    instruction: {
      title: "Inversão da Agilidade",
      text: "Agora a sua mão direita é o relógio constante. A mão esquerda assume a tarefa de disparar as semicolcheias."
    }
  },
  {
    id: 58,
    name: "Polirritmia 4 contra 2",
    timeSignature: [2, 4],
    upperVoice: [
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias'
    ],
    lowerVoice: [
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias'
    ]
  },
  {
    id: 59,
    name: "O Paradoxo",
    timeSignature: [2, 4],
    upperVoice: [
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'pausa',
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'pausa',
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'pausa',
      'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'pausa'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima'
    ]
  },
  {
    id: 60,
    name: "Boss Final: A Aprovação no THE",
    timeSignature: [2, 4],
    upperVoice: [
      'quatro_semicolcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'pausa', 'minima',
      'quatro_semicolcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'pausa', 'minima'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "VOCÊ É UM MESTRE!",
      text: "Último nível! Aqui tem tudo: silêncio, síncope, semicolcheias e ostinato contínuo por 8 compassos. Zere esta fase e não haverá banca que o reprove!"
    }
  },
  // ============================================================================
  // MUNDO 7: A EXTENSÃO DO SOM (Ligaduras e Pontos de Aumento)
  // Foco: 8 Compassos (32 tempos) em 4/4. Treinar a sustentação do "Hold" 
  // fundindo figuras através da barra de compasso e usando pontos de aumento.
  // ============================================================================
  {
    id: 61,
    name: "O Poder da Ligadura",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve', // C1 (4 tempos)
      'minima_ligada', 'minima', // C2 (Toca no 1, segura até o final do 4)
      'seminima', 'seminima', 'minima_ligada', // C3 (Toca 1, 2, segura 3 e 4...)
      'minima', 'minima', // C4 (...fundindo com o início deste compasso)
      'seminima', 'seminima_ligada', 'seminima', 'seminima', // C5
      'semibreve', // C6
      'minima_ligada', 'minima', // C7
      'semibreve' // C8
    ],
    lowerVoice: [],
    instruction: {
      title: "Sons Amarrados",
      text: "Mundo 7! Quando a nota tiver uma ligadura, você não deve soltar o botão e apertar de novo. Apenas mantenha o 'Hold' segurado somando a duração das duas figuras!"
    }
  },
  {
    id: 62,
    name: "O Ponto de Aumento",
    timeSignature: [4, 4],
    // A mínima vale 2. O ponto aumenta metade (1). Total: 3 tempos de Hold.
    upperVoice: [
      'minima_pontuada', 'seminima', 
      'minima_pontuada', 'seminima',
      'minima', 'minima', 
      'semibreve',
      'seminima', 'minima_pontuada', 
      'seminima', 'minima_pontuada',
      'minima', 'minima', 
      'semibreve'
    ],
    lowerVoice: [],
    instruction: {
      title: "A Matemática do Ponto",
      text: "O ponto à direita aumenta METADE do valor da nota. Uma Mínima Pontuada exige que você segure o botão por exatos 3 tempos. Solte apenas na Semínima final!"
    }
  },
  {
    id: 63,
    name: "Teoria na Prática (O Espelho)",
    timeSignature: [4, 4],
    // Upper usa Ponto. Lower usa Ligadura. A execução auditiva e motora é IDÊNTICA.
    upperVoice: [
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima'
    ],
    lowerVoice: [
      'minima_ligada', 'seminima', 'seminima', 'minima_ligada', 'seminima', 'seminima',
      'minima_ligada', 'seminima', 'seminima', 'minima_ligada', 'seminima', 'seminima',
      'minima_ligada', 'seminima', 'seminima', 'minima_ligada', 'seminima', 'seminima',
      'minima_ligada', 'seminima', 'seminima', 'minima_ligada', 'seminima', 'seminima'
    ],
    instruction: {
      title: "O Paradoxo Visual",
      text: "As mãos farão exatamenta a mesma coisa! Na música, uma Mínima Pontuada soa igual a uma Mínima ligada a uma Semínima. Sinta a matemática sonora com as duas mãos."
    }
  },
  {
    id: 64,
    name: "Síncope por Ligadura",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'minima_ligada', 'seminima', 
      'seminima', 'minima_ligada', 'seminima',
      'semibreve', 'semibreve',
      'seminima', 'seminima_ligada', 'minima',
      'seminima', 'seminima_ligada', 'minima',
      'semibreve', 'semibreve'
    ],
    lowerVoice: []
  },
  {
    id: 65,
    name: "Ostinato Pontuado",
    timeSignature: [4, 4],
    upperVoice: [
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'semibreve', 'semibreve',
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'semibreve', 'semibreve'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "O Ponto e o Pulso",
      text: "A mão esquerda marca as Semínimas constantes (o pulso). A mão direita ataca no tempo 1, e segura o 'Hold' através dos tempos 2 and 3 (o ponto), batendo novamente só no tempo 4."
    }
  },
  {
    id: 66,
    name: "Ostinato Reverso Ligado",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [
      'seminima', 'minima_ligada', 'seminima', 
      'seminima', 'minima_ligada', 'seminima',
      'semibreve', 'semibreve',
      'seminima', 'minima_ligada', 'seminima', 
      'seminima', 'minima_ligada', 'seminima',
      'semibreve', 'semibreve'
    ],
    instruction: {
      title: "Inversão de Carga",
      text: "Agora a mão direita é a base inabalável. A mão esquerda esconde uma síncope disfarçada de ligadura."
    }
  },
  {
    id: 67,
    name: "Balanço Oculto",
    timeSignature: [4, 4],
    upperVoice: [
      'minima_pontuada', 'seminima', 
      'seminima_ligada', 'seminima', 'minima',
      'semibreve', 'semibreve',
      'minima_pontuada', 'seminima', 
      'seminima_ligada', 'seminima', 'minima',
      'semibreve', 'semibreve'
    ],
    lowerVoice: []
  },
  {
    id: 68,
    name: "A Marcha Amarrada",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima',
      'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'
    ],
    lowerVoice: [
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima',
      'minima_pontuada', 'seminima', 'minima_pontuada', 'seminima'
    ]
  },
  {
    id: 69,
    name: "Sustentação Cruzada",
    timeSignature: [4, 4],
    upperVoice: [
      'minima_ligada', 'seminima', 'seminima', 
      'minima_ligada', 'seminima', 'seminima',
      'semibreve', 'semibreve',
      'minima_ligada', 'seminima', 'seminima', 
      'minima_ligada', 'seminima', 'seminima',
      'semibreve', 'semibreve'
    ],
    lowerVoice: [
      'seminima', 'minima_pontuada', 
      'seminima', 'minima_pontuada',
      'semibreve', 'semibreve',
      'seminima', 'minima_pontuada', 
      'seminima', 'minima_pontuada',
      'semibreve', 'semibreve'
    ],
    instruction: {
      title: "Desafio Diagonal",
      text: "Preste atenção! A mão direita segura o início do compasso e ataca no final. A mão esquerda ataca no início e segura até o final (falso contratempo). Cuidado para não bugar!"
    }
  },
  {
    id: 70,
    name: "Boss do Mundo 7: A Corda Bamba",
    timeSignature: [4, 4],
    upperVoice: [
      'minima_pontuada', 'seminima', 
      'minima_ligada', 'minima', 
      'seminima', 'seminima_ligada', 'minima', 
      'semibreve',
      'minima_pontuada', 'seminima', 
      'minima_ligada', 'minima', 
      'seminima', 'seminima_ligada', 'minima', 
      'semibreve'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'minima', 
      'seminima', 'seminima', 'minima',
      'minima_pontuada', 'seminima', 
      'semibreve',
      'seminima', 'seminima', 'minima', 
      'seminima', 'seminima', 'minima',
      'minima_pontuada', 'seminima', 
      'semibreve'
    ],
    instruction: {
      title: "O Ponto e o Laço",
      text: "O Boss Final! Um teste absoluto de resistência. Intercalamos pontos de aumento com ligaduras de prolongação. A sua mão precisará de vida própria para sobreviver aos 8 compassos."
    }
  },

  // ============================================================================
];
