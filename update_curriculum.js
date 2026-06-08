const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, 'frontend', 'src', 'constants', 'curriculum.ts');

let content = fs.readFileSync(curriculumPath, 'utf8');

// Replace export const SCLIAR_CURRICULUM with const SCLIAR_LESSONS
content = content.replace('export const SCLIAR_CURRICULUM: Lesson[] = [', 'const SCLIAR_LESSONS: Lesson[] = [');

// Update imports
content = "import { Trail } from '@/types/curriculum';\n" + content;

// Append the new DATABASE structure at the end
const databaseCode = `
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
`;

fs.writeFileSync(curriculumPath, content + databaseCode);
console.log('Successfully updated curriculum.ts');
