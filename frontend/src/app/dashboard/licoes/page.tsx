import { getDynamicCurriculum } from '@/utils/content';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { BookOpen, Play } from 'lucide-react';
import { Lesson } from '@/types/lesson';

export default async function LicoesPage() {
  const dynamicDb = await getDynamicCurriculum();
  
  const allLessons: { lesson: Lesson; courseId: string; moduleTitle: string }[] = [];

  for (const trail of dynamicDb) {
    for (const course of trail.courses) {
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          // Evita duplicatas caso a mesma lição esteja mapeada duas vezes
          if (!allLessons.find(l => l.lesson.id === lesson.id)) {
            allLessons.push({ lesson, courseId: course.id, moduleTitle: module.title });
          }
        }
      }
    }
  }

  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-4rem)] font-body">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-foreground">Todas as Lições</h1>
        <p className="text-muted-foreground text-lg mt-2">
          Acesse livremente qualquer lição do nosso acervo dinâmico sem precisar de desbloqueio prévio.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allLessons.map(({ lesson, courseId, moduleTitle }) => (
          <Link href={`/lesson/${courseId}/${lesson.id}`} key={lesson.id} className="block group">
            <Card className="h-full border-2 border-brand-graphite/20 hover:border-[#2D8A5C] transition-all hover:shadow-[0_8px_0_0_#2D8A5C] hover:-translate-y-2 bg-background cursor-pointer flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="w-12 h-12 rounded-xl bg-[#2D8A5C]/10 flex items-center justify-center text-[#2D8A5C] group-hover:bg-[#2D8A5C] group-hover:text-white transition-colors shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">{moduleTitle}</p>
                  <CardTitle className="text-xl font-bold font-headline leading-tight">{lesson.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{lesson.description}</p>
                <div className="flex items-center text-[#2D8A5C] font-bold font-headline text-sm bg-[#2D8A5C]/10 p-3 rounded-lg justify-center group-hover:bg-[#2D8A5C] group-hover:text-white transition-colors">
                  <Play className="w-4 h-4 mr-2" fill="currentColor" />
                  Acessar Lição
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {allLessons.length === 0 && (
          <p className="text-muted-foreground col-span-full">Nenhuma lição encontrada no banco de dados.</p>
        )}
      </div>
    </div>
  );
}
