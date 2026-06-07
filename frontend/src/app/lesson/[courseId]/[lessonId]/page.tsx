'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LessonEngine } from '@/modules/lesson/components/LessonEngine';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/context/GamificationContext';
import { Trail } from '@/types/lesson';

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const lessonId = params.lessonId as string;
    const { isHydrated } = useGamification();

    const [database, setDatabase] = useState<Trail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      fetch('/api/public/curriculum', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.database) {
            setDatabase(data.database);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, []);

    let foundLesson = null;
    let nextLessonId: string | undefined = undefined;

    if (!isLoading && database.length > 0) {
      for (const trail of database) {
        for (const course of trail.courses) {
          if (course.id === courseId) {
            for (let mIndex = 0; mIndex < course.modules.length; mIndex++) {
              const module = course.modules[mIndex];
              const lessonIndex = module.lessons.findIndex(l => l.id === lessonId || l.slug === lessonId);
              
              if (lessonIndex !== -1) {
                foundLesson = module.lessons[lessonIndex];
                if (lessonIndex < module.lessons.length - 1) {
                  nextLessonId = module.lessons[lessonIndex + 1].id;
                } else if (mIndex < course.modules.length - 1) {
                  nextLessonId = course.modules[mIndex + 1].lessons[0]?.id;
                }
                break;
              }
            }
          }
          if (foundLesson) break;
        }
        if (foundLesson) break;
      }
    }

    if (!isHydrated || isLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-brand-gray font-bold">Carregando sala de aula...</p>
        </div>
      );
    }

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
