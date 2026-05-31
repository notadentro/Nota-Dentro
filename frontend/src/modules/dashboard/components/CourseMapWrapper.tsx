'use client';
import { Course } from '@/types/curriculum';
import { Lesson } from '@/types/lesson';
import { useGamification } from '@/context/GamificationContext';
import { TrailMap } from './TrailMap';

export function CourseMapWrapper({ course }: { course: Course }) {
  const { completedLessons, unlockedLessons, isHydrated } = useGamification();

  if (!isHydrated) return null;

  return (
    <div className="space-y-16">
      {course.modules.map((module, mIndex) => {
        // Map lessons and inject status
        const lessonsWithStatus: Lesson[] = module.lessons.map(lesson => {
          let status: 'completed' | 'available' | 'locked' = 'locked';
          if (completedLessons.includes(lesson.id)) {
            status = 'completed';
          } else if (unlockedLessons.includes(lesson.id)) {
            status = 'available';
          }
          return { ...lesson, status };
        });

        return (
          <section key={module.id} className="relative">
             <div className="mb-6 flex flex-col gap-2">
                <h2 className="text-3xl font-bold font-headline text-[#2D8A5C]">{`Módulo ${mIndex + 1}: ${module.title}`}</h2>
                <p className="text-brand-gray font-bold font-body text-lg">Autor(a): {module.author}</p>
             </div>

             <div className="bg-brand-black dark:bg-brand-black/50 py-12 rounded-3xl border-2 border-brand-graphite shadow-2xl overflow-hidden flex justify-center min-h-[300px]">
                <TrailMap lessons={lessonsWithStatus} courseId={course.id} />
             </div>
          </section>
        );
      })}
    </div>
  );
}
