'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPersonalizedRecommendations } from '@/app/actions';
import type { PersonalizedLessonRecommendationsOutput } from '@/app/actions';
import { ChevronRight, Sparkles } from 'lucide-react';

// Extend the type to include properties added in the server action
type RecommendationWithDetails = PersonalizedLessonRecommendationsOutput[0] & {
  topic?: string;
  difficulty?: string;
};

export function RecommendedLessons() {
  const [recommendations, setRecommendations] = useState<RecommendationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      const result = await getPersonalizedRecommendations();
      setRecommendations(result);
      setLoading(false);
    }
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <CardTitle className="font-headline text-lg">Tudo Certo!</CardTitle>
        <CardDescription className="mt-2">
          Nenhuma recomendação especial por agora. Continue seu ótimo trabalho!
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.lessonId} className="bg-accent/40 border-accent">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Sparkles className="text-primary size-5"/>
                {rec.topic || `Lição ${rec.lessonId}`}
            </CardTitle>
            <CardDescription>
                <Badge variant="outline" className="capitalize">{rec.difficulty || 'Normal'}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{rec.reason}</p>
          </CardContent>
          <CardFooter>
            <Button>
              <span>Começar Lição</span>
              <ChevronRight />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
