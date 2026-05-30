'use client';

import { SCLIAR_CURRICULUM } from '@/constants/curriculum';
import { LessonCard } from '@/modules/lessons/components/LessonCard';
import { UserProgress } from '@/modules/dashboard/components/user-progress';
import { RecommendedLessons } from '@/modules/dashboard/components/recommended-lessons';
import { AchievementIcon } from '@/modules/dashboard/components/achievement-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

export default function DashboardPage() {
    const { user } = useUser();

    const achievements = [
        { title: "Iniciante", description: "Completou 10 lições" },
        { title: "Ouvido de Ouro", description: "Acertou 50 notas" },
        { title: "Maratonista", description: "Estudou por 7 dias" },
    ];

    return (
        <div className="p-4 md:p-6 space-y-8 bg-background min-h-screen font-body">
            <header>
                <h1 className="text-3xl font-bold font-headline text-foreground">
                    Olá, {user?.displayName?.split(' ')[0] || 'Aluno'}! 👋
                </h1>
                <p className="text-muted-foreground">Pronta para exercitar sua musculatura musical hoje?</p>
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold font-headline mb-4">Sua Jornada Scliar</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {SCLIAR_CURRICULUM.map((lesson) => (
                                <LessonCard key={lesson.id} lesson={lesson} />
                            ))}
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
