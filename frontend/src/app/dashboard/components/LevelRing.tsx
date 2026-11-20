'use client';

export function LevelRing({ level, xp, maxXp }: { level: number; xp: number; maxXp: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  // If the user has more XP than maxXp (should level up soon), cap at 1 to prevent bar overflow
  const progress = Math.min(xp / maxXp, 1);
  const dashOffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: 136, height: 136 }}>
      <svg className="-rotate-90 absolute inset-0" width="136" height="136" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r={radius} fill="none" stroke="currentColor" className="text-muted/50" strokeWidth="10" />
        <circle
          cx="68" cy="68" r={radius} fill="none"
          stroke="#FFC107" strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center z-10">
        <span className="text-3xl font-bold text-foreground font-headline">{level}</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">nível</span>
      </div>
    </div>
  );
}
