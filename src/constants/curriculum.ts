import { Lesson } from '@/types/lesson';

export const SCLIAR_CURRICULUM: Lesson[] = [
  {
    id: '1',
    slug: 'clave-de-sol',
    title: 'Clave de Sol',
    description: 'Entenda a função da clave de sol na leitura musical e a posição das notas na pauta.',
    status: 'completed',
    module: 1,
    steps: [
      {
        id: '1-1',
        type: 'theory',
        title: 'O que é Clave de Sol',
        data: {
          content: 'A clave de sol define a posição da nota sol na segunda linha da pauta e orienta a leitura das demais notas.'
        }
      }
    ]
  },
  {
    id: '2',
    slug: 'clave-de-fa',
    title: 'Clave de Fá',
    description: 'Estude a clave de fá e a leitura de notas graves na pauta musical.',
    status: 'available',
    module: 1,
    steps: [
      {
        id: '2-1',
        type: 'theory',
        title: 'O que é Clave de Fá',
        data: {
          content: 'A clave de fá mostra a posição da nota fá na quarta linha da pauta, usada para vozes graves.'
        }
      }
    ]
  },
  {
    id: '3',
    slug: 'valores-das-notas',
    title: 'Valores das Notas',
    description: 'Reconheça semínimas, colcheias, semicolcheias e seus valores no compasso.',
    status: 'available',
    module: 1,
    steps: [
      {
        id: '3-1',
        type: 'theory',
        title: 'Figurações e durações',
        data: {
          content: 'Semínima vale 1 tempo, colcheia vale 1/2 tempo e semicolcheia vale 1/4 de tempo no compasso comum.'
        }
      }
    ]
  },
  {
    id: '4',
    slug: 'compasso-simples',
    title: 'Compasso Simples',
    description: 'Aprenda o funcionamento do compasso simples e como contar batidas regulares.',
    status: 'locked',
    module: 2,
    steps: [
      {
        id: '4-1',
        type: 'theory',
        title: 'Fundamentos do compasso',
        data: {
          content: 'Compasso simples é composto por tempos que se dividem em duas partes iguais (2/4, 3/4, 4/4).'
        }
      }
    ]
  },
  {
    id: '5',
    slug: 'escalas-maiores',
    title: 'Escalas Maiores',
    description: 'Conheça as escalas maiores e a sequência de tons e semitons segundo Scliar.',
    status: 'locked',
    module: 2,
    steps: [
      {
        id: '5-1',
        type: 'theory',
        title: 'Formação da escala',
        data: {
          content: 'Escala maior segue o padrão T-T-S-T-T-T-S, com 8 notas por oitava.'
        }
      }
    ]
  },
  {
    id: '6',
    slug: 'formacao-de-acordes',
    title: 'Formação de Acordes',
    description: 'Veja como acordes básicos são construídos a partir de terças sobre cada nota.',
    status: 'locked',
    module: 3,
    steps: [
      {
        id: '6-1',
        type: 'theory',
        title: 'Triades maiores e menores',
        data: {
          content: 'Triades são acordes com tercinas: fundamental, terça e quinta. Classificação por intervalo da terça.'
        }
      }
    ]
  },
  {
    id: '7',
    slug: 'intervalos-musicais',
    title: 'Intervalos Musicais',
    description: 'Identifique intervalos de segunda a oitava e veja sua importância na harmonia.',
    status: 'locked',
    module: 3,
    steps: [
      {
        id: '7-1',
        type: 'theory',
        title: 'Qualidades dos intervalos',
        data: {
          content: 'Intervalos podem ser justos, maiores, menores, aumentados ou diminuídos e são a base da harmonia.'
        }
      }
    ]
  }
];
