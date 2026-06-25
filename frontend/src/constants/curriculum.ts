import { Trail } from '@/types/curriculum';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Lesson } from '@/types/lesson';
import { PROFESSORS } from './professors';

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
            author: PROFESSORS.ester.displayName,
            lessons: []
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
            author: PROFESSORS.bohdan.displayName,
            lessons: []
          },
          {
            id: 'fn-teoria-2',
            title: 'Notação Musical',
            description: 'Aprofundamento na escrita musical.',
            author: PROFESSORS.bohdan.displayName,
            lessons: []
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
