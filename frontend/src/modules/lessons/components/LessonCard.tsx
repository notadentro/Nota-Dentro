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
      "overflow-hidden transition-all border-none shadow-md",
      isLocked ? "opacity-60 grayscale bg-slate-50" : "bg-white hover:shadow-lg"
    )}>
      <CardHeader className="pb-3 bg-[#FAFAFA]"> {/* Cor de fundo do blueprint */}
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-lg bg-[#FFC107]/10 text-[#FFC107]"> {/* Amarelo do blueprint */}
            <Music className="size-5" />
          </div>
          {isLocked && <Lock className="size-4 text-muted-foreground" />}
        </div>
        <CardTitle className="font-headline text-lg mt-3 text-slate-800"> {/* Fonte Poppins configurada no CSS */}
          {lesson.title}
        </CardTitle>
        <CardDescription className="font-body text-sm line-clamp-2 italic"> {/* Fonte PT Sans configurada no CSS */}
          {lesson.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Button 
          disabled={isLocked}
          className={cn(
            "w-full gap-2 font-medium transition-colors",
            !isLocked ? "bg-[#ADD8E6] hover:bg-[#97c9d9] text-slate-900" : "bg-slate-200" // Azul do blueprint
          )}
        >
          {isLocked ? 'Bloqueado' : <><Play className="size-4 fill-current" /> Iniciar Lição</>}
        </Button>
      </CardContent>
    </Card>
  );
}