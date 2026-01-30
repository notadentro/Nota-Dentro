import { Lesson } from '../types/lesson';

export const SCLIAR_CURRICULUM: Lesson[] = [
  {
    id: 'L1',
    slug: 'materia-prima-musica',
    title: 'Lição 1: Som e Silêncio',
    description: 'A base fundamental da música segundo Esther Scliar.',
    module: 1,
    status: 'available',
    steps: [
      {
        id: 'L1-S1',
        type: 'theory',
        title: 'Fundamentos',
        data: {
          content: 'A música é a arte que tem o som como matéria-prima fundamental. O silêncio é a matéria-prima secundária e possui apenas a qualidade da duração.',
          materialType: 'Som'
        }
      },
      {
        id: 'L1-Q1',
        type: 'quiz',
        title: 'Desafio 1',
        data: {
          question: 'Qual é a matéria-prima fundamental da música?',
          options: ['Silêncio', 'Som', 'Pauta', 'Ritmo'],
          correctAnswer: 'Som',
          explanation: 'Para Scliar, o som é o elemento essencial, enquanto o silêncio é dependente deste.'
        }
      },
      {
        id: 'L1-Q2',
        type: 'quiz',
        title: 'Desafio 2',
        data: {
          question: 'Qual qualidade o silêncio possui?',
          options: ['Altura', 'Intensidade', 'Duração', 'Timbre'],
          correctAnswer: 'Duração',
          explanation: 'O silêncio é caracterizado apenas pelo tempo de sua existência.'
        }
      },
      {
        id: 'L1-Q3',
        type: 'quiz',
        title: 'Desafio 3',
        data: {
          question: 'Como Scliar define o silêncio?',
          options: ['Matéria fundamental', 'Ausência total de arte', 'Matéria secundária', 'Ruído'],
          correctAnswer: 'Matéria secundária',
          explanation: 'Ele é secundário pois sua percepção depende da presença prévia ou posterior do som.'
        }
      }
    ]
  },
  {
    id: 'L2',
    slug: 'qualidades-do-som',
    title: 'Lição 2: As Qualidades do Som',
    description: 'Altura, Intensidade, Timbre e Duração.',
    module: 1,
    status: 'locked',
    steps: [
      {
        id: 'L2-S1',
        type: 'theory',
        title: 'As 4 Qualidades',
        data: {
          content: 'O som possui quatro qualidades: Altura (grave/agudo), Intensidade (forte/fraco), Timbre (cor do som) e Duração (tempo).',
          materialType: 'Som',
          highlightedQualities: ['Altura', 'Intensidade', 'Timbre', 'Duração']
        }
      },
      {
        id: 'L2-Q1',
        type: 'quiz',
        title: 'Desafio 1',
        data: {
          question: 'Qual qualidade nos permite distinguir um som grave de um agudo?',
          options: ['Timbre', 'Intensidade', 'Altura', 'Duração'],
          correctAnswer: 'Altura',
          explanation: 'A altura refere-se à frequência das vibrações.'
        }
      },
      {
        id: 'L2-Q2',
        type: 'quiz',
        title: 'Desafio 2',
        data: {
          question: 'O que define se um som é forte ou fraco?',
          options: ['Altura', 'Intensidade', 'Timbre', 'Duração'],
          correctAnswer: 'Intensidade',
          explanation: 'A intensidade está ligada à amplitude da vibração sonora.'
        }
      },
      {
        id: 'L2-Q3',
        type: 'quiz',
        title: 'Desafio 3',
        data: {
          question: 'Qual qualidade permite distinguir o som de um piano de um violino tocando a mesma nota?',
          options: ['Altura', 'Timbre', 'Duração', 'Intensidade'],
          correctAnswer: 'Timbre',
          explanation: 'O timbre é a "personalidade" ou cor sonora de cada fonte.'
        }
      }
    ]
  },
  {
    id: 'L3',
    slug: 'o-pentagrama',
    title: 'Lição 3: O Pentagrama',
    description: 'A casa das notas musicais.',
    module: 1,
    status: 'locked',
    steps: [
      {
        id: 'L3-S1',
        type: 'theory',
        title: 'Linhas e Espaços',
        data: {
          content: 'O pentagrama ou pauta é composto por 5 linhas e 4 espaços, contados sempre de baixo para cima.',
          imageUrl: '/images/theory/staff-base.png'
        }
      },
      {
        id: 'L3-Q1',
        type: 'quiz',
        title: 'Desafio 1',
        data: {
          question: 'Quantas linhas formam o pentagrama básico?',
          options: ['4', '5', '6', '3'],
          correctAnswer: '5',
          explanation: 'O nome "penta" indica as cinco linhas da pauta.'
        }
      },
      {
        id: 'L3-Q2',
        type: 'quiz',
        title: 'Desafio 2',
        data: {
          question: 'Como devemos contar as linhas e espaços da pauta?',
          options: ['De cima para baixo', 'Da esquerda para direita', 'De baixo para cima', 'Aleatoriamente'],
          correctAnswer: 'De baixo para cima',
          explanation: 'Esta é a convenção universal da notação musical.'
        }
      },
      {
        id: 'L3-Q3',
        type: 'quiz',
        title: 'Desafio 3',
        data: {
          question: 'Quantos espaços existem dentro de um pentagrama comum?',
          options: ['5', '3', '4', '2'],
          correctAnswer: '4',
          explanation: 'Entre as 5 linhas, formam-se 4 espaços internos.'
        }
      }
    ]
  },
  {
    id: 'L4',
    slug: 'clave-de-sol',
    title: 'Lição 4: A Clave de Sol',
    description: 'Dando nome às notas agudas.',
    module: 1,
    status: 'locked',
    steps: [
      {
        id: 'L4-S1',
        type: 'theory',
        title: 'A Segunda Linha',
        data: {
          content: 'A Clave de Sol é escrita a partir da segunda linha, dando o nome "Sol" a qualquer nota ali situada[cite: 147].',
          imageUrl: '/images/theory/clef-sol.png'
        }
      },
      {
        id: 'L4-Q1',
        type: 'quiz',
        title: 'Desafio 1',
        data: {
          question: 'Em qual linha o desenho da Clave de Sol se inicia?',
          options: ['1ª linha', '2ª linha', '3ª linha', '5ª linha'],
          correctAnswer: '2ª linha',
          explanation: 'O ponto de partida define a nota de referência da clave[cite: 147].'
        }
      },
      {
        id: 'L4-Q2',
        type: 'quiz',
        title: 'Desafio 2',
        data: {
          question: 'Qual nota recebe seu nome diretamente da Clave de Sol?',
          options: ['Dó', 'Fá', 'Sol', 'Lá'],
          correctAnswer: 'Sol',
          explanation: 'A clave serve como uma "âncora" para nomear as outras notas[cite: 147].'
        }
      },
      {
        id: 'L4-Q3',
        type: 'quiz',
        title: 'Desafio 3',
        data: {
          question: 'Para que serve uma clave na música?',
          options: ['Apenas para enfeite', 'Para indicar o volume', 'Para dar nome e altura às notas', 'Para marcar o tempo'],
          correctAnswer: 'Para dar nome e altura às notas',
          explanation: 'Sem a clave, as notas na pauta não possuem nome definido[cite: 147].'
        }
      }
    ]
  },
  {
    id: 'L5',
    slug: 'outras-claves-e-suplementares',
    title: 'Lição 5: Clave de Fá e Linhas Suplementares',
    description: 'Expandindo o horizonte musical.',
    module: 1,
    status: 'locked',
    steps: [
      {
        id: 'L5-S1',
        type: 'theory',
        title: 'Sons Graves',
        data: {
          content: 'A Clave de Fá é usada para sons graves e as linhas suplementares permitem escrever notas fora do pentagrama[cite: 148].'
        }
      },
      {
        id: 'L5-Q1',
        type: 'quiz',
        title: 'Desafio 1',
        data: {
          question: 'Qual clave é comumente usada para instrumentos graves como o Baixo ou o Violoncelo?',
          options: ['Clave de Sol', 'Clave de Fá', 'Clave de Dó', 'Clave de Percussão'],
          correctAnswer: 'Clave de Fá',
          explanation: 'A Clave de Fá situa as notas em uma região mais baixa da escala geral.'
        }
      },
      {
        id: 'L5-Q2',
        type: 'quiz',
        title: 'Desafio 2',
        data: {
          question: 'Como chamamos as pequenas linhas usadas acima ou abaixo da pauta?',
          options: ['Linhas de apoio', 'Linhas invisíveis', 'Linhas suplementares', 'Linhas de corte'],
          correctAnswer: 'Linhas suplementares',
          explanation: 'Elas estendem a tessitura do pentagrama conforme a necessidade.'
        }
      },
      {
        id: 'L5-Q3',
        type: 'quiz',
        title: 'Desafio 3',
        data: {
          question: 'O que acontece com o nome das notas se mudarmos a clave?',
          options: ['Continua o mesmo', 'Muda completamente', 'Desaparece', 'A nota morre'],
          correctAnswer: 'Muda completamente',
          explanation: 'A posição física na pauta depende inteiramente da clave escolhida.'
        }
      }
    ]
  }
];