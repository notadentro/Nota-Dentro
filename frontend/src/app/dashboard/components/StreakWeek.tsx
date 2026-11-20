'use client';

import { cn } from "@/lib/utils";

export function StreakWeek({ streak }: { streak: number }) {
  const days = ["S", "T", "Q", "Q", "S", "S", "D"];
  
  // Limita para visualização de 7 dias
  const displayStreak = Math.min(streak, 7);
  // Se for maior que 7, hoje é sempre o último dia do calendário semanal mostrado
  const todayIndex = streak > 0 ? (streak > 7 ? 6 : streak - 1) : -1;

  return (
    <div className="flex gap-2 justify-between w-full">
      {days.map((day, i) => {
        const active = streak > 7 ? true : i < displayStreak;
        const isToday = i === todayIndex;
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg transition-all",
                isToday
                  ? "bg-orange-500 shadow-[0_4px_0_0_#c2410c] scale-110"
                  : active
                  ? "bg-orange-100"
                  : "bg-muted"
              )}
            >
              {active ? (isToday ? "🔥" : "🟠") : "○"}
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">{day}</span>
          </div>
        );
      })}
    </div>
  );
}
