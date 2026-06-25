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
  // ============================================================================
  // MUNDO 1: O DOMÍNIO DO PULSO E A INDEPENDÊNCIA (Apenas figuras inteiras)
  // Foco: Memória muscular nas teclas F e J, Segurar (Hold) vs Tocar (Tap), 
  // Alternância de mãos e a primeira Polirritmia (Boss).
  // ============================================================================
  {
    id: 1,
    name: "Iniciação ao Pulso",
    timeSignature: [2, 4],
    upperVoice: ['minima', 'seminima', 'seminima', 'minima', 'seminima', 'seminima', 'seminima', 'seminima'],
    lowerVoice: [],
    instruction: {
      title: "O Seu Primeiro Passo",
      text: "Bem-vindo ao Nota Dentro! Use a tecla J. Para a Semínima (1 tempo), dê um toque rápido. Para a Mínima e a Semibreve, SEGURE o botão até a barra preencher!"
    }
  },
  {
    id: 2,
    name: "O Valor do Silêncio",
    timeSignature: [2, 4],
    upperVoice: ['minima', 'minima', 'seminima', 'pausa', 'minima'],
    lowerVoice: [],
    instruction: {
      title: "Respire",
      text: "A música também é feita de silêncio. Quando aparecer o símbolo da pausa, tire o dedo da tecla e espere o próximo tempo!"
    }
  },
  {
    id: 3,
    name: "O Espelho (Mãos Juntas)",
    timeSignature: [2, 4],
    upperVoice: ['minima', 'minima', 'seminima', 'seminima', 'minima'],
    lowerVoice: ['minima', 'minima', 'seminima', 'seminima', 'minima'],
    instruction: {
      title: "Uníssono Motor",
      text: "A tela dividiu! F para a pauta de baixo e J para a de cima. Neste nível, as duas mãos tocam EXATAMENTE ao mesmo tempo."
    }
  },
  {
    id: 4,
    name: "Passos Alternados",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima'],
    lowerVoice: ['pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima'],
    instruction: {
      title: "Caminhada Rítmica",
      text: "Agora as mãos não tocam juntas. É como caminhar: direita (J), depois esquerda (F). Olhe para as pausas que guiam o descanso de cada mão."
    }
  },
  {
    id: 5,
    name: "O Cânone (Pergunta e Resposta)",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'pausa_minima', 'pausa_minima'],
    lowerVoice: ['pausa_minima', 'pausa_minima', 'seminima', 'seminima', 'seminima', 'seminima']
  },
  {
    id: 6,
    name: "Espelho com Pausas",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'pausa', 'seminima', 'seminima', 'minima', 'pausa', 'seminima'],
    lowerVoice: ['seminima', 'pausa', 'seminima', 'seminima', 'minima', 'pausa', 'seminima']
  },
  {
    id: 7,
    name: "Alternância Longa",
    timeSignature: [2, 4],
    upperVoice: ['minima', 'pausa_minima', 'seminima', 'pausa', 'minima'],
    lowerVoice: ['pausa_minima', 'minima', 'pausa', 'seminima', 'minima']
  },
  {
    id: 8,
    name: "Preparação para o Ostinato",
    timeSignature: [2, 4],
    upperVoice: ['minima', 'pausa_minima', 'pausa_minima', 'minima', 'minima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'minima', 'minima']
  },
  {
    id: 9,
    name: "O Despertar da Independência",
    timeSignature: [2, 4],
    upperVoice: ['pausa', 'seminima', 'pausa', 'seminima', 'minima', 'pausa_minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'pausa_minima', 'minima']
  },
  {
    id: 10,
    name: "Boss do Mundo 1: Polirritmia",
    timeSignature: [2, 4],
    upperVoice: ['minima', 'seminima', 'seminima', 'minima_ligada', 'minima', 'minima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "O Grande Desafio",
      text: "Chegou o Boss! A mão esquerda (F) é o seu bumbo de bateria: ela não para de bater Semínimas. A mão direita (J) faz a melodia por cima. Ancore sua mente na esquerda!"
    }
  },

  // ============================================================================
  // MUNDO 2: O DESPERTAR DAS COLCHEIAS (A Subdivisão Binária)
  // Foco: Entender que 1 tempo (Semínima) agora comporta 2 notas (Colcheias).
  // ============================================================================
  {
    id: 11,
    name: "Apoio e Impulso",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima'],
    lowerVoice: [],
    instruction: {
      title: "Dividindo o Tempo",
      text: "Mundo 2! Agora a Semínima foi cortada ao meio. Quando ver as duas Colcheias unidas, você dará dois toques rápidos (Apoio e Impulso) dentro da mesma pulsação!"
    }
  },
  {
    id: 12,
    name: "Correndo Mais",
    timeSignature: [2, 4],
    upperVoice: ['duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'duas_colcheias', 'duas_colcheias', 'minima'],
    lowerVoice: []
  },
  {
    id: 13,
    name: "Espelho de Colcheias",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima'],
    lowerVoice: ['seminima', 'duas_colcheias', 'minima', 'duas_colcheias', 'seminima', 'minima'],
    instruction: {
      title: "Agilidade Dupla",
      text: "As duas mãos vão executar as colcheias juntas. Sinta o tempo dobrar de velocidade no seu dedo."
    }
  },
  {
    id: 14,
    name: "Alternando a Subdivisão",
    timeSignature: [2, 4],
    upperVoice: ['duas_colcheias', 'pausa', 'duas_colcheias', 'pausa', 'minima', 'pausa_minima'],
    lowerVoice: ['pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'pausa_minima', 'minima']
  },
  {
    id: 15,
    name: "Acelerando e Freando",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'duas_colcheias', 'seminima', 'pausa'],
    lowerVoice: []
  },
  {
    id: 16,
    name: "Ostinato com Colcheias 1",
    timeSignature: [2, 4],
    upperVoice: ['duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "Polirritmia Acelerada",
      text: "A mão esquerda (F) faz o ostinato de semínimas. A mão direita (J) vai encaixar duas colcheias para cada batida da mão esquerda!"
    }
  },
  {
    id: 17,
    name: "Ostinato com Colcheias 2",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'duas_colcheias', 'duas_colcheias', 'seminima', 'duas_colcheias', 'seminima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima']
  },
  {
    id: 18,
    name: "O Espelho Quebrado",
    timeSignature: [2, 4],
    upperVoice: ['duas_colcheias', 'seminima', 'pausa_minima', 'seminima', 'duas_colcheias', 'minima'],
    lowerVoice: ['pausa_minima', 'duas_colcheias', 'seminima', 'minima', 'pausa_minima']
  },
  {
    id: 19,
    name: "Ostinato Reverso",
    timeSignature: [2, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    lowerVoice: ['duas_colcheias', 'duas_colcheias', 'minima', 'seminima', 'duas_colcheias', 'minima'],
    instruction: {
      title: "Inversão de Papéis",
      text: "Trocou! Agora a sua mão direita (J) é quem segura o pulso constante de semínimas, enquanto a esquerda (F) sua para fazer a melodia com colcheias."
    }
  },
  {
    id: 20,
    name: "Boss do Mundo 2: Colisão Rítmica",
    timeSignature: [2, 4],
    upperVoice: ['duas_colcheias', 'seminima', 'minima', 'duas_colcheias', 'duas_colcheias', 'minima'],
    lowerVoice: ['duas_colcheias', 'seminima', 'minima', 'seminima', 'duas_colcheias', 'seminima', 'seminima']
  },
  // ============================================================================
  // MUNDO 3: O DOMÍNIO DO SILÊNCIO (O Freio Inibitório)
  // Foco: Introdução das Pausas, Penalidade do Silêncio e Contratempos Básicos.
  // ============================================================================
  {
    id: 21,
    name: "O Toque e o Silêncio",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'pausa', 'seminima', 'pausa', 'minima', 'pausa_minima'],
    lowerVoice: [],
    instruction: {
      title: "Segure o Impulso!",
      text: "Mundo 3! Agora o nosso motor detecta a 'Penalidade do Silêncio'. Se você tocar a tecla na hora da pausa, perderá corações. Toque a semínima e ativamente TIRE o dedo no silêncio!"
    }
  },
  {
    id: 22,
    name: "Freio Inibitório",
    timeSignature: [4, 4],
    upperVoice: ['pausa', 'seminima', 'pausa', 'seminima', 'pausa_minima', 'minima'],
    lowerVoice: []
  },
  {
    id: 23,
    name: "A Pausa e a Colcheia",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'pausa', 'duas_colcheias', 'pausa', 'seminima', 'pausa', 'minima'],
    lowerVoice: [],
    instruction: {
      title: "Agilidade e Pausa",
      text: "Dê os dois toques rápidos das colcheias e congele a mão imediatamente para respeitar a pausa seguinte."
    }
  },
  {
    id: 24,
    name: "Buracos no Caminho",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'duas_colcheias', 'pausa_minima', 'pausa', 'duas_colcheias', 'minima'],
    lowerVoice: []
  },
  {
    id: 25,
    name: "Ostinato com Silêncio",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'pausa', 'duas_colcheias', 'pausa', 'minima', 'pausa_minima'],
    // Mão esquerda faz o pulso reto, sem parar.
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "Independência Total",
      text: "A sua mão esquerda (F) não pode parar! Ela fará o pulso constante. A sua mão direita (J) vai tocar a melodia e DEVE parar durante as pausas, enquanto a esquerda continua batendo!"
    }
  },
  {
    id: 26,
    name: "O Contratempo Fantasma",
    timeSignature: [4, 4],
    upperVoice: ['pausa', 'seminima', 'pausa', 'duas_colcheias', 'pausa', 'seminima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima']
  },
  {
    id: 27,
    name: "Alternância Rápida",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'pausa', 'duas_colcheias', 'pausa', 'pausa_minima', 'minima'],
    lowerVoice: ['pausa', 'duas_colcheias', 'pausa', 'duas_colcheias', 'minima', 'pausa_minima'],
    instruction: {
      title: "O Soluço Tcheco",
      text: "Agora as mãos conversam: a direita toca as colcheias enquanto a esquerda faz silêncio, e vice-versa. Não deixe as duas tocarem juntas no início!"
    }
  },
  {
    id: 28,
    name: "Ostinato Invertido com Pausas",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    lowerVoice: ['pausa', 'duas_colcheias', 'seminima', 'pausa', 'pausa_minima', 'minima']
  },
  {
    id: 29,
    name: "Diálogo Interrompido",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'pausa', 'seminima', 'pausa', 'pausa_minima', 'minima'],
    lowerVoice: ['pausa', 'duas_colcheias', 'pausa', 'seminima', 'minima', 'pausa_minima']
  },
  {
    id: 30,
    name: "Boss: A Prova do Silêncio",
    timeSignature: [4, 4], // 12 tempos totais na pista
    upperVoice: ['pausa', 'duas_colcheias', 'seminima', 'pausa', 'duas_colcheias', 'pausa', 'minima', 'pausa_minima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "O Exame!",
      text: "Para derrotar este Boss, você deve manter o pulso cravado na mão esquerda por 3 compassos inteiros, enquanto a mão direita desvia das pausas de forma completamente irregular. Respire e confie no pulso!"
    }
  },
  // ============================================================================
  // MUNDO 4: O BALANÇO BRASILEIRO (Síncopes)
  // Foco: Deslocamento de acento com a célula 'colcheia_seminima_colcheia' (2 tempos).
  // ============================================================================
  {
    id: 31,
    name: "A Ginga da Síncope",
    timeSignature: [4, 4],
    upperVoice: ['colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima'],
    lowerVoice: [],
    instruction: {
      title: "O Balanço Brasileiro",
      text: "Mundo 4! A Síncope desloca o acento da música. Você dará um toque rápido (colcheia) e vai SEGURAR a próxima nota (Hold) atravessando o tempo forte! Sinta a ginga."
    }
  },
  {
    id: 32,
    name: "Síncope no Contratempo",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'colcheia_seminima_colcheia', 'seminima', 'colcheia_seminima_colcheia', 'minima'],
    lowerVoice: []
  },
  {
    id: 33,
    name: "Síncopes Sucessivas",
    timeSignature: [4, 4],
    upperVoice: ['colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'minima', 'minima'],
    lowerVoice: [],
    instruction: {
      title: "Ondas Rítmicas",
      text: "Duas síncopes seguidas! Cuidado para não transformar a semínima do meio (o Hold) em um toque rápido. Respeite as durações exatas."
    }
  },
  {
    id: 34,
    name: "Apoio, Impulso e Síncope",
    timeSignature: [4, 4],
    upperVoice: ['duas_colcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'minima', 'minima'],
    lowerVoice: []
  },
  {
    id: 35,
    name: "Ostinato Sincopado 1",
    timeSignature: [4, 4],
    upperVoice: ['colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "O Bumbo e o Tamborim",
      text: "A mão esquerda (F) é o bumbo reto. A direita (J) é o tamborim fazendo a síncope. O seu cérebro vai bugar: o 'Hold' da mão direita vai acontecer ENQUANTO a esquerda dá um novo Tap!"
    }
  },
  {
    id: 36,
    name: "Ostinato Sincopado 2",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'colcheia_seminima_colcheia', 'seminima', 'colcheia_seminima_colcheia', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima']
  },
  {
    id: 37,
    name: "Mar de Síncopes",
    timeSignature: [4, 4],
    upperVoice: ['colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima']
  },
  {
    id: 38,
    name: "Ostinato Reverso Sincopado",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    lowerVoice: ['colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'minima'],
    instruction: {
      title: "Síncope na Mão Esquerda",
      text: "Inversão de hemisférios! Agora a mão direita (J) segura a pulsação constante, enquanto a mão esquerda (F) ginga com a síncope."
    }
  },
  {
    id: 39,
    name: "Silêncio antes da Ginga",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    lowerVoice: ['pausa', 'pausa', 'colcheia_seminima_colcheia', 'minima', 'minima']
  },
  {
    id: 40,
    name: "Boss do Mundo 4: O Choro",
    timeSignature: [4, 4],
    upperVoice: ['colcheia_seminima_colcheia', 'duas_colcheias', 'seminima', 'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia', 'minima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "A Roda de Choro",
      text: "O teste final do balanço! Mantenha a mão esquerda cravada no tempo e não deixe que os acentos deslocados da mão direita tirem a sua pulsação do trilho."
    }
  },

  // ============================================================================
  // MUNDO 5: O MESTRE GRAMANI (Semicolcheias e Divertimentos)
  // Foco: A subdivisão quaternária ('quatro_semicolcheias') e independência extrema.
  // ============================================================================
  {
    id: 41,
    name: "Divertimento em 2/4",
    timeSignature: [2, 4],
    upperVoice: ['quatro_semicolcheias', 'seminima', 'quatro_semicolcheias', 'seminima'],
    lowerVoice: [],
    instruction: {
      title: "A Metralhadora",
      text: "Bem-vindo ao Mundo 5! Agora a Semínima se dividiu em QUATRO Semicolcheias. Você precisará dar 4 toques muito rápidos dentro de uma única pulsação de tempo!"
    }
  },
  {
    id: 42,
    name: "Agilidade",
    timeSignature: [4, 4],
    upperVoice: ['quatro_semicolcheias', 'quatro_semicolcheias', 'duas_colcheias', 'seminima', 'minima', 'pausa_minima'],
    lowerVoice: []
  },
  {
    id: 43,
    name: "Semicolcheias e Silêncio",
    timeSignature: [2, 4],
    upperVoice: ['quatro_semicolcheias', 'pausa', 'duas_colcheias', 'quatro_semicolcheias', 'seminima', 'pausa'],
    lowerVoice: [],
    instruction: {
      title: "Acelera e Freia",
      text: "O segredo da música está no controle. Dê os 4 toques rápidos da semicolcheia e freie a mão bruscamente para respeitar a pausa."
    }
  },
  {
    id: 44,
    name: "Síncope e Semicolcheia",
    timeSignature: [4, 4],
    upperVoice: ['colcheia_seminima_colcheia', 'quatro_semicolcheias', 'seminima', 'minima', 'minima'],
    lowerVoice: []
  },
  {
    id: 45,
    name: "Ostinato de Gramani 1",
    timeSignature: [2, 4],
    upperVoice: ['quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "Independência Extrema",
      text: "A mão esquerda marca o passo da marcha (semínimas). A direita faz a subdivisão de 4 notas. Mantenha os hemisférios isolados!"
    }
  },
  {
    id: 46,
    name: "A Marcha Quebrada",
    timeSignature: [4, 4],
    upperVoice: ['quatro_semicolcheias', 'pausa', 'quatro_semicolcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima']
  },
  {
    id: 47,
    name: "Ostinato Reverso Motor",
    timeSignature: [4, 4],
    upperVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    lowerVoice: ['quatro_semicolcheias', 'duas_colcheias', 'quatro_semicolcheias', 'seminima', 'colcheia_seminima_colcheia', 'minima'],
    instruction: {
      title: "O Motor Esquerdo",
      text: "Trocou! Agora sua mão direita dita o tempo (pulso) e a sua mão esquerda será a metralhadora de semicolcheias."
    }
  },
  {
    id: 48,
    name: "Polirritmia: 4 contra 2",
    timeSignature: [2, 4],
    upperVoice: ['quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias'],
    lowerVoice: ['duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias']
  },
  {
    id: 49,
    name: "O Paradoxo",
    timeSignature: [4, 4],
    upperVoice: ['colcheia_seminima_colcheia', 'quatro_semicolcheias', 'pausa', 'colcheia_seminima_colcheia', 'duas_colcheias', 'seminima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima']
  },
  {
    id: 50,
    name: "Boss Final: A Aprovação",
    timeSignature: [4, 4],
    upperVoice: ['quatro_semicolcheias', 'duas_colcheias', 'colcheia_seminima_colcheia', 'pausa', 'quatro_semicolcheias', 'colcheia_seminima_colcheia', 'minima', 'colcheia_seminima_colcheia', 'quatro_semicolcheias', 'seminima', 'minima'],
    lowerVoice: ['seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima', 'seminima'],
    instruction: {
      title: "Você é um Mestre!",
      text: "Último nível do curso base! Aqui tem tudo: silêncio, síncope, semicolcheias e ostinato rítmico. Se você passar daqui, não existe banca de teoria musical que te reprove. Boa sorte!"
    }
  },

  // ============================================================================
  // MUNDO 6: A MARATONA DA SEMIBREVE (Resistência e Independência)
  // Foco: Fases longas de 8 compassos (32 tempos). A Semibreve atua como um 
  // ostinato de sustentação contínua contra subdivisões complexas.
  // ============================================================================
  {
    id: 51,
    name: "A Longa Jornada",
    timeSignature: [4, 4],
    // 8 compassos de 4/4 = 32 tempos
    upperVoice: [
      'semibreve', // C1
      'seminima', 'seminima', 'seminima', 'seminima', // C2
      'semibreve', // C3
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias', // C4
      'semibreve', // C5
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', // C6
      'semibreve', // C7
      'minima', 'minima' // C8
    ],
    lowerVoice: [],
    instruction: {
      title: "Resistência Rítmica",
      text: "Mundo 6! As fases agora têm o DOBRO do tamanho. Prepare o fôlego! Alterne entre segurar a nota o compasso inteiro (Semibreve) e explodir em agilidade."
    }
  },
  {
    id: 52,
    name: "O Pilar de Sustentação",
    timeSignature: [4, 4],
    upperVoice: [
      'seminima', 'seminima', 'seminima', 'seminima', 
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'seminima', 'seminima', 'seminima', 'seminima',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'minima', 'minima',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'semibreve'
    ],
    // Mão esquerda trava no Hold por 8 compassos seguidos!
    lowerVoice: [
      'semibreve', 'semibreve', 'semibreve', 'semibreve', 
      'semibreve', 'semibreve', 'semibreve', 'semibreve'
    ],
    instruction: {
      title: "Independência Muscular",
      text: "A sua mão esquerda (F) é o pilar. Ela vai segurar as Semibreves ininterruptamente! Seu cérebro vai tentar soltar o botão esquerdo quando a mão direita (J) acelerar. Não permita!"
    }
  },
  {
    id: 53,
    name: "Resistência Mista",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve', 
      'pausa', 'pausa', 'pausa', 'pausa', 
      'semibreve', 
      'pausa_minima', 'pausa_minima', 
      'semibreve', 
      'pausa_colcheia_colcheia', 'pausa_colcheia_colcheia', 'pausa_colcheia_colcheia', 'pausa_colcheia_colcheia', 
      'minima', 'minima',
      'semibreve'
    ],
    lowerVoice: [] // Voltamos para 1 voz para descansar o cérebro (Intercalação)
  },
  {
    id: 54,
    name: "Inversão do Pilar",
    timeSignature: [4, 4],
    // Mão direita agora é o Pilar de Hold
    upperVoice: [
      'semibreve', 'semibreve', 'semibreve', 'semibreve', 
      'semibreve', 'semibreve', 'semibreve', 'semibreve'
    ],
    lowerVoice: [
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'seminima', 'seminima', 'seminima', 'seminima',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'seminima', 'seminima', 'seminima', 'seminima',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'seminima', 'seminima', 'seminima', 'seminima',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'semibreve'
    ],
    instruction: {
      title: "Ambidestria",
      text: "Trocou! Agora a mão direita (J) fica travada na Semibreve, enquanto a esquerda (F) corre na esteira. Cuidado com a fadiga do dedo!"
    }
  },
  {
    id: 55,
    name: "Fôlego Sincopado",
    timeSignature: [4, 4],
    upperVoice: [
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'semibreve',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'semibreve',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'semibreve',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'semibreve'
    ],
    lowerVoice: []
  },
  {
    id: 56,
    name: "Desafio de Gramani Estendido",
    timeSignature: [4, 4],
    upperVoice: [
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia'
    ],
    lowerVoice: [
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima'
    ],
    instruction: {
      title: "Ginga Infinita",
      text: "A mão direita vai emendar 16 síncopes seguidas! Enquanto isso, a mão esquerda alterna entre segurar a Semibreve e marcar o pulso duro. Mantenha o foco!"
    }
  },
  {
    id: 57,
    name: "A Calmaria (Espelho)",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve',
      'minima', 'minima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'semibreve',
      'semibreve'
    ],
    lowerVoice: [
      'semibreve',
      'minima', 'minima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'semibreve',
      'semibreve'
    ]
  },
  {
    id: 58,
    name: "Polirritmia de Longa Duração",
    timeSignature: [4, 4],
    upperVoice: [
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'semibreve',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'semibreve',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'semibreve',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'semibreve'
    ],
    lowerVoice: [
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'semibreve'
    ]
  },
  {
    id: 59,
    name: "Mãos em Revezamento",
    timeSignature: [4, 4],
    // Uma mão toca a Semibreve enquanto a outra descansa por 4 tempos
    upperVoice: [
      'semibreve', 
      'pausa_minima', 'pausa_minima', 
      'semibreve', 
      'pausa_minima', 'pausa_minima', 
      'semibreve', 
      'pausa_minima', 'pausa_minima', 
      'semibreve', 
      'pausa_minima', 'pausa_minima'
    ],
    lowerVoice: [
      'pausa_minima', 'pausa_minima', 
      'semibreve', 
      'pausa_minima', 'pausa_minima', 
      'semibreve', 
      'pausa_minima', 'pausa_minima', 
      'semibreve', 
      'pausa_minima', 'pausa_minima', 
      'semibreve'
    ],
    instruction: {
      title: "Respiração",
      text: "Fase de transição! Pressione F por 4 tempos, solte, e imediatamente pressione J por 4 tempos. Sinta a passagem do som de um lado para o outro."
    }
  },
  {
    id: 60,
    name: "Boss do Mundo 6: A Maratona THE",
    timeSignature: [4, 4],
    upperVoice: [
      'semibreve',
      'colcheia_seminima_colcheia', 'colcheia_seminima_colcheia',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'semibreve',
      'duas_colcheias', 'duas_colcheias', 'duas_colcheias', 'duas_colcheias',
      'pausa_colcheia_colcheia', 'pausa_colcheia_colcheia', 'pausa_colcheia_colcheia', 'pausa_colcheia_colcheia',
      'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias', 'quatro_semicolcheias',
      'semibreve'
    ],
    lowerVoice: [
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve',
      'seminima', 'seminima', 'seminima', 'seminima',
      'semibreve'
    ],
    instruction: {
      title: "Prova Final de Resistência",
      text: "8 bússolas completas! A mão esquerda não perdoa: bate 4 e segura 4 até o fim. A mão direita vai passar por TUDO que você aprendeu. Sobreviva a esta maratona!"
    }
  }
];
