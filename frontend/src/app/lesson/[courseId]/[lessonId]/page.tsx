'use client';

import { useParams, useRouter } from 'next/navigation';
import { DATABASE } from '@/constants/curriculum';
import { LessonEngine } from '@/modules/lesson/components/LessonEngine';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/context/GamificationContext';

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const lessonId = params.lessonId as string;
    const { isHydrated } = useGamification();

    let foundLesson = null;
    let nextLessonId: string | undefined = undefined;

    for (const trail of DATABASE) {
      for (const course of trail.courses) {
        if (course.id === courseId) {
          for (const module of course.modules) {
            const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
            if (lessonIndex !== -1) {
              foundLesson = module.lessons[lessonIndex];
              // Try to find next lesson in the same module
              if (lessonIndex < module.lessons.length - 1) {
                nextLessonId = module.lessons[lessonIndex + 1].id;
              }
              break;
            }
          }
        }
        if (foundLesson) break;
      }
      if (foundLesson) break;
    }

    if (!isHydrated) return null;

    if (!foundLesson) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background">
                <h1 className="text-2xl font-bold font-headline text-brand-black dark:text-brand-white">Lição não encontrada</h1>
                <Button onClick={() => router.push('/dashboard')} className="mt-4 bg-[#2D8A5C] text-white hover:bg-green-600 rounded-2xl py-6 px-8 font-bold">
                    Voltar ao Dashboard
                </Button>
            </div>
        );
    }

    return (
        <LessonEngine 
          lesson={foundLesson} 
          nextLessonId={nextLessonId}
          onClose={() => router.push(`/dashboard/course/${courseId}`)} 
        />
    );
}
