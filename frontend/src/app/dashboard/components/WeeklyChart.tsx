'use client';

export function WeeklyChart({ dailyXp }: { dailyXp?: Record<string, number> }) {
  // Pega os últimos 7 dias até hoje
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toISOString().split('T')[0];
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    // Se o backend não tem dados de hoje/antigos, mocka 0
    return {
      day: days[date.getDay()],
      xp: dailyXp?.[dayStr] || 0
    };
  });

  const max = Math.max(...data.map(d => d.xp), 100); // 100 como baseline visual

  return (
    <div className="flex items-end gap-2 h-24 mt-4 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
          <div className="w-full flex items-end h-[72px]">
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{
                height: d.xp > 0 ? `${Math.max((d.xp / max) * 100, 8)}%` : "4px",
                background: d.xp > 0
                  ? `linear-gradient(to top, #E6AC00, #FFC107)`
                  : "#e0e0e0",
              }}
            />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">{d.day}</span>
        </div>
      ))}
    </div>
  );
}
