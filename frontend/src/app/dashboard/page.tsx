'use client';

import { SCLIAR_CURRICULUM } from '@/constants/curriculum';
import { TrailMap } from '@/modules/dashboard/components/TrailMap';
import { UserProgress } from '@/modules/dashboard/components/user-progress';
import { RecommendedLessons } from '@/modules/dashboard/components/recommended-lessons';
import { AchievementIcon } from '@/modules/dashboard/components/achievement-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useGamification } from '@/context/GamificationContext';
import { Lesson } from '@/types/lesson';

export default function DashboardPage() {
    const { user } = useUser();
    const { completedLessons, unlockedLessons, isHydrated, completeLesson } = useGamification();

    const achievements = [
        { title: "Iniciante", description: "Completou 10 lições" },
        { title: "Ouvido de Ouro", description: "Acertou 50 notas" },
        { title: "Maratonista", description: "Estudou por 7 dias" },
    ];

    // Compute dynamic statuses for lessons based on Gamification Context
    const lessonsWithStatus: Lesson[] = SCLIAR_CURRICULUM.map((lesson) => {
        let status: 'completed' | 'available' | 'locked' = 'locked';
        if (completedLessons.includes(lesson.id)) {
            status = 'completed';
        } else if (unlockedLessons.includes(lesson.id)) {
            status = 'available';
        }
        return { ...lesson, status };
    });

    return (
        <div className="p-4 md:p-6 space-y-8 bg-background min-h-screen font-body">
            <header className="text-center md:text-left">
                <h1 className="text-3xl font-bold font-headline text-foreground">
                    Olá, {user?.displayName?.split(' ')[0] || 'Aluno'}! 👋
                </h1>
                <p className="text-muted-foreground">Pronta para exercitar sua musculatura musical hoje?</p>
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8 flex flex-col items-center overflow-hidden">
                    <section className="w-full">
                        <h2 className="text-2xl font-bold font-headline mb-4 text-center md:text-left">Sua Jornada Scliar</h2>
                        <div className="bg-brand-black dark:bg-brand-black/50 py-12 rounded-3xl border-2 border-brand-graphite shadow-2xl overflow-hidden flex justify-center min-h-[300px]">
                            {isHydrated ? (
                                <TrailMap 
                                    lessons={lessonsWithStatus} 
                                    onLessonClick={(lesson) => {
                                        // Para a Fase 6: Completar a lição e destravar a próxima
                                        const currentIndex = SCLIAR_CURRICULUM.findIndex(l => l.id === lesson.id);
                                        const nextLesson = SCLIAR_CURRICULUM[currentIndex + 1];
                                        completeLesson(lesson.id, nextLesson?.id, 50);
                                    }}
                                />
                            ) : null}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold font-headline mb-4">Recomendado para você</h2>
                        <RecommendedLessons />
                    </section>
                </div>

                <aside className="space-y-6">
                    <UserProgress />
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Conquistas Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-around gap-4">
                                {achievements.map(ach => (
                                    <AchievementIcon key={ach.title} title={ach.title} description={ach.description} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
