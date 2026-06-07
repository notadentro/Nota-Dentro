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
