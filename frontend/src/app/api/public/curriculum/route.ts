import { NextResponse } from 'next/server';
import { DATABASE } from '@/constants/curriculum';
import fs from 'fs/promises';
import path from 'path';
import { Lesson, Trail } from '@/types/lesson';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Clonar o DATABASE estático para não mutar a constante original
    const dynamicDb: Trail[] = JSON.parse(JSON.stringify(DATABASE));
    
    // 2. Ler todos os arquivos JSON da pasta de lições
    const contentDir = path.join(process.cwd(), 'src', 'content', 'lessons');
    let jsonFiles: string[] = [];
    
    try {
      const files = await fs.readdir(contentDir);
      jsonFiles = files.filter(f => f.endsWith('.json'));
    } catch (e) {
      // Pasta pode não existir ainda no primeiro run
    }

    const dynamicLessons: Lesson[] = [];

    for (const file of jsonFiles) {
      try {
        const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
        const lesson: Lesson = JSON.parse(content);
        dynamicLessons.push(lesson);
      } catch (err) {
        console.error('Erro ao ler lição JSON:', file, err);
      }
    }

    // 3. Mesclar as lições dinâmicas na estrutura do DATABASE
    // Regra: Se o slug ou ID bater com uma lição existente, substitui o conteúdo dela.
    // Se não bater com nenhuma, adiciona na trilha "Cursos Livres" (livres).
    
    const unmappedLessons: Lesson[] = [];

    for (const dLesson of dynamicLessons) {
      let found = false;
      
      for (const trail of dynamicDb) {
        for (const course of trail.courses) {
          for (const module of course.modules) {
            const index = module.lessons.findIndex(l => l.id === dLesson.id || l.slug === dLesson.slug);
            if (index !== -1) {
              // Mescla os dados (mantém a estrutura mas atualiza steps, título, descrição)
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

    // 4. Se houver lições não mapeadas (novas criadas no Admin), adiciona aos Cursos Livres
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
        
        // Adiciona as lições órfãs no primeiro módulo do primeiro curso livre
        livresTrail.courses[0].modules[0].lessons.push(...unmappedLessons);
      }
    }

    return NextResponse.json({ database: dynamicDb });
  } catch (error: any) {
    console.error('Erro na API de curriculum:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
