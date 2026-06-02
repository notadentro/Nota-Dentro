'use server';

export type PersonalizedLessonRecommendationsInput = {
    userId: string;
    learningHistory: Array<{
        lessonId: string;
        score: number;
        completionTime: number;
    }>;
    availableLessons: Array<{
        lessonId: string;
        topic: string;
        difficulty: 'easy' | 'medium' | 'hard';
    }>;
};

export type PersonalizedLessonRecommendationsOutput = Array<{
    lessonId: string;
    reason: string;
    topic?: string;
    difficulty?: string;
}>;

const availableLessons: Array<{ lessonId: string; topic: string; difficulty: 'easy' | 'medium' | 'hard' }> = [
    { lessonId: '1', topic: 'Clave de Sol', difficulty: 'easy' },
    { lessonId: '2', topic: 'Clave de Fá', difficulty: 'easy' },
    { lessonId: '3', topic: 'Valores das Notas', difficulty: 'easy' },
    { lessonId: '4', topic: 'Compasso Simples', difficulty: 'medium' },
    { lessonId: '5', topic: 'Escalas Maiores', difficulty: 'medium' },
    { lessonId: '6', topic: 'Formação de Acordes', difficulty: 'hard' },
    { lessonId: '7', topic: 'Intervalos Musicais', difficulty: 'hard' },
];

export async function getPersonalizedRecommendations(): Promise<PersonalizedLessonRecommendationsOutput> {
    const learningHistory = [
        { lessonId: '1', score: 95, completionTime: 300 },
        { lessonId: '2', score: 80, completionTime: 400 },
        { lessonId: '3', score: 55, completionTime: 600 },
    ];

    const input: PersonalizedLessonRecommendationsInput = {
        userId: 'user123',
        learningHistory,
        availableLessons,
    };

    try {
        const completedIds = new Set(learningHistory.map(item => item.lessonId));

        const recommended = availableLessons
            .filter(lesson => !completedIds.has(lesson.lessonId))
            .slice(0, 3)
            .map(lesson => ({
                lessonId: lesson.lessonId,
                reason: `Recomendado para avançar no tópico ${lesson.topic}.`,
                topic: lesson.topic,
                difficulty: lesson.difficulty,
            }));

        return recommended;

    } catch (error) {
        console.error('Error fetching personalized recommendations:', error);
        return [];
    }
}
