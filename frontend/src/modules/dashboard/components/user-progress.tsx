import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

export function UserProgress() {
    const currentLevel = 5;
    const currentXp = 450;
    const xpToNextLevel = 1000;
    const progress = (currentXp / xpToNextLevel) * 100;

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="font-headline text-lg">Seu Progresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">
                            Nível {currentLevel}
                        </Badge>
                        <p className="text-sm font-medium text-muted-foreground">{currentXp} / {xpToNextLevel} XP</p>
                    </div>
                     <div className="flex items-center gap-1 text-primary">
                        <Star className="size-5 fill-current" />
                        <span className="font-bold">12</span>
                    </div>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-center text-xs text-muted-foreground">
                    Faltam {xpToNextLevel - currentXp} XP para o próximo nível!
                </p>
            </CardContent>
        </Card>
    );
}
