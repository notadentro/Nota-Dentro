'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getRankName } from "@/utils/ranks";

export function UserProgress() {
    const { user } = useUser();
    
    const currentLevel = user?.stats?.level || 1;
    const currentXp = user?.stats?.xp || 0;
    const currentStreak = user?.stats?.streak || 0;
    
    // Fórmula de XP para o próximo nível (exemplo simples: nível atual * 1000)
    const xpToNextLevel = currentLevel * 1000;
    const progress = Math.min((currentXp / xpToNextLevel) * 100, 100);

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="font-headline text-lg">Seu Progresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-primary/20 text-primary-foreground hover:bg-primary/30 uppercase tracking-wide">
                            {getRankName(currentLevel)}
                        </Badge>
                        <p className="text-sm font-medium text-muted-foreground">{currentXp} / {xpToNextLevel} XP</p>
                    </div>
                     <div className="flex items-center gap-1 text-primary">
                        <Star className="size-5 fill-current" />
                        <span className="font-bold">{currentStreak}</span>
                    </div>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-center text-xs text-muted-foreground">
                    {currentXp >= xpToNextLevel 
                      ? "Você pode subir de nível!" 
                      : `Faltam ${xpToNextLevel - currentXp} XP para o próximo nível!`}
                </p>
            </CardContent>
        </Card>
    );
}
