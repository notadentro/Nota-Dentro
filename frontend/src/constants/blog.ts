export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  coverImage?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'como-ler-partituras-basico',
    title: 'Como ler partituras: O Guia Definitivo para Iniciantes',
    excerpt: 'Desvende o mistério das notas musicais na pauta e comece a ler partituras hoje mesmo com o método Nota Dentro.',
    content: `
# Como ler partituras: O Guia Definitivo para Iniciantes

Ler partituras pode parecer assustador no começo, mas é muito parecido com aprender um novo idioma. Assim como as letras formam palavras, as notas formam melodias.

## O Pentagrama
O pentagrama (ou pauta) é formado por 5 linhas e 4 espaços. É nele que as notas são escritas. A altura da nota na pauta determina o seu som: quanto mais alta, mais aguda.

## As Claves
A clave é o símbolo que aparece no início do pentagrama e serve para dar nome às notas. As mais comuns são a Clave de Sol e a Clave de Fá.
- **Clave de Sol:** Usada para instrumentos mais agudos (violão, violino, mão direita do piano).
- **Clave de Fá:** Usada para instrumentos mais graves (baixo, violoncelo, mão esquerda do piano).

## Figuras Rítmicas
Além da altura, as notas têm duração. As figuras rítmicas (Semibreve, Mínima, Semínima, etc.) indicam quanto tempo o som deve durar.

Acompanhe nossos próximos artigos para mergulhar mais fundo neste universo!
    `,
    date: '2024-05-30',
    author: 'Carol',
  },
  {
    id: '2',
    slug: 'importancia-do-treino-de-ouvido',
    title: 'A Importância do Treino de Ouvido na Música',
    excerpt: 'Descubra por que ter um bom ouvido é tão importante quanto ter uma boa técnica instrumental.',
    content: `
# A Importância do Treino de Ouvido na Música

O "Ear Training" (Treinamento Auditivo) é frequentemente negligenciado por músicos iniciantes, que focam apenas na técnica mecânica do instrumento. No entanto, o ouvido é a sua bússola musical.

## O que é o Treinamento Auditivo?
É o processo de conectar a teoria musical (notas, intervalos, acordes) com os sons que você ouve. É a capacidade de identificar um acorde maior, menor, ou um intervalo de quinta justa apenas escutando.

## Benefícios
1. **Tirar músicas de ouvido:** Você não precisará mais depender de partituras ou tablaturas o tempo todo.
2. **Improvisação:** Um bom ouvido permite que você preveja o som que vai tocar antes de colocar os dedos no instrumento.
3. **Afinação:** Cantores e instrumentistas de sopro/cordas dependem criticamente do ouvido para manter a afinação perfeita.

Aqui na Nota Dentro, temos exercícios gamificados focados exatamente no desenvolvimento do seu ouvido musical!
    `,
    date: '2024-05-31',
    author: 'Carol',
  }
];
