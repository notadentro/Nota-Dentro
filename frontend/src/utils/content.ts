import fs from 'fs/promises';
import path from 'path';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');
  
  try {
    const files = await fs.readdir(contentDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const posts = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
        const parsed = JSON.parse(content);
        return {
          id: parsed.id,
          slug: parsed.id, // O ID salvo pelo painel admin é o slug
          title: parsed.title,
          subtitle: parsed.subtitle,
          excerpt: parsed.subtitle || parsed.content.substring(0, 150) + '...', // Usa o subtitle como resumo se existir
          content: parsed.content,
          date: parsed.date,
          author: parsed.author || 'Annie Larcher',
        };
      })
    );
    
    // Ordena do mais recente pro mais antigo
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Erro ao ler posts do blog local:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find(p => p.slug === slug) || null;
}

import { DATABASE } from '@/constants/curriculum';
import { Trail } from '@/types/curriculum';
import { Lesson } from '@/types/lesson';

export async function getDynamicCurriculum(): Promise<Trail[]> {
  const dynamicDb: Trail[] = JSON.parse(JSON.stringify(DATABASE));
  const contentDir = path.join(process.cwd(), 'src', 'content', 'lessons');
  
  let jsonFiles: string[] = [];
  try {
    const files = await fs.readdir(contentDir);
    jsonFiles = files.filter(f => f.endsWith('.json'));
  } catch (e) {
    // Pasta pode não existir
  }

  const dynamicLessons: Lesson[] = [];
  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
      dynamicLessons.push(JSON.parse(content));
    } catch (err) {
      console.error('Erro ler lição:', file, err);
    }
  }

  const unmappedLessons: Lesson[] = [];

  for (const dLesson of dynamicLessons) {
    let found = false;
    for (const trail of dynamicDb) {
      for (const course of trail.courses) {
        for (const module of course.modules) {
          const index = module.lessons.findIndex((l: any) => l.id === dLesson.id || l.slug === dLesson.slug);
          if (index !== -1) {
            module.lessons[index] = {
              ...module.lessons[index],
              title: dLesson.title || module.lessons[index].title,
              description: dLesson.description || module.lessons[index].description,
              status: dLesson.status || module.lessons[index].status,
              steps: dLesson.steps || []
            };
            found = true;
          }
        }
      }
    }
    if (!found) {
      unmappedLessons.push(dLesson);
    }
  }

  if (unmappedLessons.length > 0) {
    const livresTrail = dynamicDb.find(t => t.id === 'livres');
    if (livresTrail) {
      if (livresTrail.courses.length === 0) {
        livresTrail.courses.push({
          id: 'curso-livre-geral',
          title: 'Aulas Avulsas',
          description: 'Aulas e desafios criados pela comunidade e professores.',
          icon: 'BookOpen',
          modules: [
            {
              id: 'mod-livre-1',
              title: 'Conteúdo Dinâmico',
              description: 'Lições adicionadas recentemente.',
              author: 'Vários Autores',
              lessons: []
            }
          ]
        });
      }
      livresTrail.courses[0].modules[0].lessons.push(...unmappedLessons);
    }
  }

  return dynamicDb;
}
