import { Trail } from '@/types/curriculum';
import { Lesson } from '@/types/lesson';

const SCLIAR_LESSONS: Lesson[] = [
  {
    id: '1',
    slug: 'propriedades-do-som',
    title: 'O Som e Suas Propriedades',
    description: 'A matéria-prima da música e suas quatro qualidades fundamentais: Altura, Duração, Intensidade e Timbre.',
    status: 'completed',
    module: 1,
    steps: [
      {
        id: '1-1',
        type: 'theory',
        title: 'A Matéria-Prima',
        data: {
          content: 'Na teoria musical clássica, aprendemos que a **música é a arte dos sons**. Portanto, o som é a matéria-prima da música. Sem som, não há música.'
        }
      },
      {
        id: '1-2',
        type: 'quiz',
        title: 'Teste rápido',
        data: {
          question: 'Segundo a teoria clássica, qual é a matéria-prima da música?',
          options: ['O silêncio', 'Os instrumentos', 'O som', 'A partitura', 'O ritmo'],
          correctAnswer: 'O som',
          explanation: 'O som é a base e a matéria-prima da música. É através dele que a arte musical se materializa.',
          wrongExplanations: {
            'O silêncio': 'O silêncio faz parte da música, mas a teoria clássica define O Som como a matéria-prima onde o silêncio atua.',
            'Os instrumentos': 'Instrumentos são ferramentas que produzem a matéria-prima (o som).',
            'A partitura': 'A partitura é apenas a representação gráfica (escrita) da música, não a sua essência.',
            'O ritmo': 'O ritmo é como organizamos o tempo, mas precisamos do Som para preencher esse tempo.'
          }
        }
      },
      {
        id: '1-3',
        type: 'theory',
        title: 'As Quatro Qualidades',
        data: {
          content: 'Todo som possui quatro qualidades (ou propriedades) fundamentais: **Altura**, **Duração**, **Intensidade** e **Timbre**.'
        }
      },
      {
        id: '1-4',
        type: 'quiz',
        title: 'Quais são as qualidades?',
        data: {
          question: 'Quais são as quatro qualidades fundamentais do som?',
          options: [
            'Agudo, Grave, Forte e Fraco',
            'Altura, Duração, Intensidade e Timbre',
            'Ritmo, Melodia, Harmonia e Timbre',
            'Semibreve, Mínima, Semínima e Colcheia',
            'Volume, Tom, Timbre e Ritmo'
          ],
          correctAnswer: 'Altura, Duração, Intensidade e Timbre',
          explanation: 'Estas são as propriedades físicas do som na teoria musical. Agudo/Grave são tipos de Altura, não propriedades independentes.',
          wrongExplanations: {
            'Agudo, Grave, Forte e Fraco': 'Agudo e Grave são subdivisões da Altura. Forte e Fraco são subdivisões da Intensidade. Não são propriedades raízes.',
            'Ritmo, Melodia, Harmonia e Timbre': 'Ritmo, melodia e harmonia são elementos da música (como organizamos o som), não propriedades físicas do som isolado.',
            'Semibreve, Mínima, Semínima e Colcheia': 'Essas são figuras de valor (representam a duração na partitura), não as propriedades físicas do som.',
            'Volume, Tom, Timbre e Ritmo': 'Volume e Tom são termos populares (equivalentes a Intensidade e Altura), e Ritmo não é propriedade física do som.'
          }
        }
      },
      {
        id: '1-5',
        type: 'true_false',
        title: 'Mito ou Verdade?',
        data: {
          statement: 'A "Altura" é a propriedade que define se um som é forte ou fraco (o seu "volume").',
          isTrue: false,
          explanation: 'A Altura define se o som é Grave ou Agudo. O volume é definido pela Intensidade.',
          wrongExplanation: 'Se você marcou "Verdadeiro", confundiu com o conceito popular. Popularmente dizemos "aumente a altura do rádio", mas em Teoria Musical, isso se chama Intensidade!'
        }
      }
    ]
  },
  {
    id: '2',
    slug: 'propriedades-visuais',
    title: 'Propriedades Visuais da Música',
    description: 'Aprenda como os sons são representados no papel através de figuras, claves e pautas.',
    status: 'available',
    module: 1,
    steps: [
      {
        id: '2-1',
        type: 'match_columns',
        title: 'Ligue os pontos',
        data: {
          question: 'Conecte cada propriedade do som ao seu significado na teoria musical:',
          pairs: [
            { left: 'Altura', right: 'Grave ou Agudo' },
            { left: 'Intensidade', right: 'Forte ou Fraco' },
            { left: 'Duração', right: 'Curto ou Longo' },
            { left: 'Timbre', right: 'Cor do Som' }
          ],
          explanation: 'Perfeito! O Timbre é o que nos permite distinguir a "cor" de cada instrumento. A altura define se é agudo ou grave, a intensidade se é forte ou fraco, e a duração o tempo do som.'
        }
      },
      {
        id: '2-2',
        type: 'memory_game',
        title: 'Jogo da Memória',
        data: {
          question: 'Encontre os pares entre símbolos musicais e seus nomes!',
          pairs: [
            { item1: 'Clave de Sol', item2: '𝄞' },
            { item1: 'Clave de Fá', item2: '𝄢' },
            { item1: 'Sustenido', item2: '♯' },
            { item1: 'Bemol', item2: '♭' }
          ],
          explanation: 'Muito bem! A Clave de Sol e Fá dão nome às notas nas pautas, enquanto os acidentes (♯ e ♭) alteram a altura original.'
        }
      },
      {
        id: '2-3',
        type: 'fill_blanks',
        title: 'Complete a Frase',
        data: {
          question: 'Preencha as lacunas com os conceitos do Pentagrama (Pauta Musical):',
          text: 'O pentagrama ou pauta musical é formado por {0} linhas e {1} espaços, que são sempre contados de {2} para {3}.',
          blanks: ['5', '4', 'baixo', 'cima'],
          options: ['5', '4', 'baixo', 'cima', '7', 'trás', 'frente', '6'],
          explanation: 'Exato! As cinco linhas e quatro espaços formam a pauta, e contamos sempre começando da linha mais inferior até a superior.'
        }
      }
    ]
  },
  {
    id: '3',
    slug: 'duracao-e-intensidade',
    title: 'Duração e Intensidade',
    description: 'Descubra a diferença entre sons longos/curtos e fortes/fracos.',
    status: 'locked',
    module: 1,
    steps: []
  },
  {
    id: '4',
    slug: 'timbre-a-cor-do-som',
    title: 'Timbre: A Cor do Som',
    description: 'Como nosso ouvido diferencia um violino de um piano tocando a mesma nota?',
    status: 'locked',
    module: 1,
    steps: []
  },
  {
    id: '6',
    slug: 'ritmo-e-metrificacao',
    title: 'Ritmo e Metrificação',
    description: 'Como o som se organiza no tempo.',
    status: 'locked',
    module: 1,
    steps: []
  },
  {
    id: '7',
    slug: 'figuras-musicais',
    title: 'Figuras Musicais',
    description: 'Os símbolos que representam a duração.',
    status: 'locked',
    module: 1,
    steps: []
  },
  {
    id: '8',
    slug: 'pulsacao',
    title: 'Pulsação',
    description: 'O coração da música.',
    status: 'locked',
    module: 1,
    steps: []
  },
  {
    id: '5',
    slug: 'prova-modulo-1',
    title: 'Desafio do Módulo 1',
    description: 'Teste final do primeiro capítulo de Teoria Musical.',
    status: 'locked',
    module: 1,
    steps: []
  }
];

export const DATABASE: Trail[] = [
  {
    id: 'militares',
    title: 'Concursos Militares',
    description: 'Prepare-se para as bandas de música das Forças Armadas.',
    icon: 'Shield',
    courses: [
      {
        id: 'esa',
        title: 'Sargento da ESA',
        description: 'Foco na bibliografia da Escola de Sargentos das Armas.',
        icon: 'Crosshair',
        modules: [
          {
            id: 'esa-teoria-1',
            title: 'Noções Básicas',
            description: 'Introdução à teoria musical focada no edital.',
            author: 'Teoria Musical',
            lessons: [
              {
                id: 'esa-l1',
                slug: 'introducao-teoria',
                title: 'O Som e a Música',
                description: 'Conceitos iniciais da teoria musical.',
                status: 'available',
                module: 1,
                steps: []
              }
            ]
          }
        ]
      },
      {
        id: 'fuzileiros',
        title: 'Fuzileiros Navais',
        description: 'Preparação completa para o Corpo de Fuzileiros Navais da Marinha.',
        icon: 'Anchor',
        modules: [
          {
            id: 'fn-teoria-1',
            title: 'Fundamentos do Som',
            description: 'Matéria-prima e Propriedades do Som',
            author: 'Teoria Clássica',
            lessons: SCLIAR_LESSONS
          },
          {
            id: 'fn-teoria-2',
            title: 'Notação Musical',
            description: 'Aprofundamento na escrita musical.',
            author: 'Teoria Contemporânea',
            lessons: [
              {
                id: 'fn-l2',
                slug: 'notacao-teoria',
                title: 'O Pentagrama',
                description: 'Escrita musical detalhada.',
                status: 'locked',
                module: 1,
                steps: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'universidades',
    title: 'Universidades (THE)',
    description: 'Teste de Habilidade Específica para ingresso em faculdades de Música.',
    icon: 'GraduationCap',
    courses: [
       {
        id: 'teoria-geral',
        title: 'Teoria Musical',
        description: 'Teoria geral abrangente para vestibulares.',
        icon: 'BookOpen',
        modules: []
      }
    ]
  },
  {
    id: 'livres',
    title: 'Cursos Livres',
    description: 'Estude teoria musical no seu ritmo, sem pressão de editais.',
    icon: 'Music',
    courses: []
  }
];
