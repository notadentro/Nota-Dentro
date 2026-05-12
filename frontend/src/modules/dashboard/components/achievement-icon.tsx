import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";


type AchievementIconProps = {
  title: string;
  description: string;
};

export function AchievementIcon({ title, description }: AchievementIconProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Card className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-amber-400">
        <Trophy className="size-10 text-amber-600" />
      </Card>
      <div className="w-24">
        <p className="truncate text-sm font-medium" title={title}>{title}</p>
        <p className="truncate text-xs text-muted-foreground" title={description}>{description}</p>
      </div>
    </div>
  );
}
