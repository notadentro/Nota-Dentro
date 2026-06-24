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
}

export const GAME_LEVELS: LevelDefinition[] = [
  // ---------------- MUNDO 1: FUNDAÇÕES MOTORAS ----------------
  {
    id: 1,
    name: "O Despertar do Tempo",
    timeSignature: [4, 4],
    upperVoice: ['semibreve', 'minima', 'minima', 'semibreve'],
    lowerVoice: [],
    instruction: {
      title: "Como Jogar",
      text: "Use F ou J. Quando a nota longa chegar, SEGURE o botão pressionado até a barra de progresso encher completamente! Domine a duração."
    }
  },
  {
    id: 2,
    name: "A Marcha da Semínima",
    timeSignature: [4, 4],
    upperVoice: ['minima', 'seminima', 'seminima', 'minima', 'seminima', 'seminima'],
    lowerVoice: []
  },
  {
    id: 3,
    name: "Ritmo Tético Constante",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'minima'],
    lowerVoice: []
  },
  {
    id: 4,
    name: "Espelho (Mãos Juntas)",
    timeSignature: [4, 4],
    upperVoice: ['minima', 'seminima', 'seminima', 'semibreve'],
    lowerVoice: ['minima', 'seminima', 'seminima', 'semibreve'],
    instruction: {
      title: "Cérebros Unidos",
      text: "A tela dividiu! F para a pauta inferior e J para a pauta superior. Neste nível, as duas mãos batem e seguram EXATAMENTE juntas no uníssono."
    }
  },
  {
    id: 5,
    name: "Espelho Acelerado",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'minima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'minima', 'minima']
  },
  {
    id: 6,
    name: "Passos Alternados",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima'],
    lowerVoice: ['pausa', 'seminima', 'pausa', 'seminima', 'minima', 'pausa_minima'],
    instruction: {
      title: "Caminhada Rítmica",
      text: "Agora elas alternam! Pressione J, depois F, como se fossem os passos do seu corpo. Sinta o balanço da transferência de peso."
    }
  },
  {
    id: 7,
    name: "Alternância Longa",
    timeSignature: [4, 4],
    upperVoice: ['minima', 'pausa_minima', 'minima', 'minima'],
    lowerVoice: ['pausa_minima', 'minima', 'minima', 'minima']
  },
  {
    id: 8,
    name: "Ostinato Primário",
    timeSignature: [4, 4],
    upperVoice: ['minima', 'minima', 'semibreve'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "Independência F/J",
      text: "A verdadeira polirritmia! A mão esquerda (F) manterá uma batida cardíaca constante de semínimas (ostinato). A direita (J) fará notas longas que atravessam os pulsos."
    }
  },
  {
    id: 9,
    name: "Inversão do Ostinato",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    lowerVoice: ['minima', 'minima', 'semibreve']
  },
  {
    id: 10,
    name: "Boss do Mundo 1: 3/4",
    timeSignature: [3, 4],
    upperVoice: ['minima_pontuada', 'minima_pontuada', 'seminima', 'seminima', 'seminima'],
    lowerVoice: ['seminima', 'minima', 'minima', 'seminima', 'minima_pontuada']
  },
  // ---------------- MUNDO 2: O DESPERTAR DAS COLCHEIAS ----------------
  {
    id: 11,
    name: "Apoio e Impulso",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'duas_colcheias', 'seminima', 'duas_colcheias'],
    lowerVoice: [],
    instruction: {
      title: "Subdivisão Binária",
      text: "A Semínima se partiu ao meio! Agora, dentro de uma única batida (Unidade de Tempo), você precisa dar 2 toques rápidos: um no Apoio e outro no Impulso. Olhe para a linha tracejada dividindo o núcleo!"
    }
  },
  {
    id: 12,
    name: "Balanço Rápido",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima'],
    lowerVoice: []
  },
  {
    id: 13,
    name: "A Valsa Dividida",
    timeSignature: [3, 4],
    upperVoice: ['duas_colcheias', 'seminima', 'seminima', 'seminima', 'duas_colcheias', 'seminima'],
    lowerVoice: []
  },
  {
    id: 14,
    name: "O Teste da Subdivisão",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'duas_colcheias', 'duas_colcheias', 'minima'],
    lowerVoice: []
  },
  {
    id: 15,
    name: "Ostinato 1: Pulso na Esquerda",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'minima', 'minima'],
    instruction: {
      title: "A Bateria Mental",
      text: "Sua mão esquerda (F) agora é o bumbo da bateria, mantendo o pulso constante em Semínimas. Sua mão direita (J) é o chimbal, fazendo as Colcheias. Mantenha a esquerda inabalável!"
    }
  },
  {
    id: 16,
    name: "Acelerador Controlado",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'minima', 'minima'],
    lowerVoice: ['minima', 'minima', 'seminima', 'seminima', 'minima']
  },
  {
    id: 17,
    name: "Ostinato em 3/4",
    timeSignature: [3, 4],
    upperVoice: ['duas_colcheias', 'duas_colcheias', 'seminima', 'seminima', 'duas_colcheias', 'seminima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'minima', 'seminima']
  },
  {
    id: 18,
    name: "Ostinato Reverso",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'minima', 'minima'],
    lowerVoice: ['duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'minima'],
    instruction: {
      title: "Inversão de Hemisférios",
      text: "Independência total! Invertemos os papéis: agora a sua mão direita (J) é quem segura o pulso constante, enquanto a esquerda (F) trabalha dobrado nas colcheias."
    }
  },
  {
    id: 19,
    name: "Desafio Reverso",
    timeSignature: [4, 4],
    upperVoice: ['minima', 'seminima', 'seminima', 'semibreve'],
    lowerVoice: ['duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'minima', 'minima']
  },
  {
    id: 20,
    name: "Boss do Mundo 2: Colisão",
    timeSignature: [3, 4],
    upperVoice: ['seminima', 'duas_colcheias', 'seminima', 'minima', 'duas_colcheias'],
    lowerVoice: ['duas_colcheias', 'seminima', 'seminima', 'duas_colcheias', 'minima']
  }
];
