import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Play, Music } from 'lucide-react';
import { Lesson } from '@/types/lesson';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const isLocked = lesson.status === 'locked';

  return (
    <Card className={cn(
      "overflow-hidden transition-all border shadow-md",
      isLocked ? "opacity-60 grayscale bg-muted border-border" : "bg-card hover:border-primary/50 hover:shadow-primary/10"
    )}>
      <CardHeader className="pb-3 bg-card">
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Music className="size-5" />
          </div>
          {isLocked && <Lock className="size-4 text-muted-foreground" />}
        </div>
        <CardTitle className="font-headline text-lg mt-3 text-card-foreground">
          {lesson.title}
        </CardTitle>
        <CardDescription className="font-body text-sm line-clamp-2 italic text-muted-foreground">
          {lesson.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Button 
          disabled={isLocked}
          className={cn(
            "w-full gap-2 font-medium transition-colors",
            !isLocked ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {isLocked ? 'Bloqueado' : <><Play className="size-4 fill-current" /> Iniciar Lição</>}
        </Button>
      </CardContent>
    </Card>
  );
}