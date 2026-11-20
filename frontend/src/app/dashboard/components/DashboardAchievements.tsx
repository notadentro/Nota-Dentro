'use client';

import { Trophy, ChevronRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const rarityConfig: Record<string, { border: string; glow: string; bg: string; label: string }> = {
  bronze:   { border: "border-[#CD7F32]", glow: "shadow-[0_0_12px_#CD7F3260]", bg: "bg-[#FFF4E6]", label: "Bronze" },
  silver:   { border: "border-[#A8A8A8]", glow: "shadow-[0_0_12px_#A8A8A840]", bg: "bg-[#F8F8F8]", label: "Prata" },
  gold:     { border: "border-[#FFD700]", glow: "shadow-[0_0_16px_#FFD70060]", bg: "bg-[#FFFDE7]", label: "Ouro" },
  platinum: { border: "border-[#ADD8E6]", glow: "shadow-[0_0_20px_#ADD8E680]", bg: "bg-[#F0F8FF]", label: "Platina" },
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: "bronze" | "silver" | "gold" | "platinum";
}

const allAchievements: Achievement[] = [
  { id: "primeira_nota",  name: "Primeira Nota",    description: "Completou sua 1ª lição",       emoji: "🎵", rarity: "bronze"   },
  { id: "semana_fogo",   name: "Semana de Fogo",   description: "7 dias de sequência",           emoji: "🔥", rarity: "silver"   },
  { id: "cordas_rasgadas",  name: "Cordas Rasgadas",  description: "10 lições de violão",           emoji: "🎸", rarity: "bronze"   },
  { id: "maestro_iniciante",name: "Maestro Iniciante",description: "Acertou 50 notas",             emoji: "🎓", rarity: "silver"   },
  { id: "ouvido_perfeito",  name: "Ouvido Perfeito",  description: "100% em um quiz de teoria",     emoji: "👂", rarity: "gold"     },
  { id: "vocalista",        name: "Vocalista",        description: "Complete 5 lições de canto",    emoji: "🎤", rarity: "silver"   },
  { id: "pianista",         name: "Pianista",         description: "Complete 15 lições de piano",   emoji: "🎹", rarity: "gold"     },
  { id: "maratonista",      name: "Maratonista",      description: "Estude 30 dias seguidos",       emoji: "🏃", rarity: "platinum" },
  { id: "teorico_supremo",  name: "Teórico Supremo",  description: "Complete toda trilha de teoria",emoji: "📖", rarity: "platinum" },
  { id: "mestre_musical",   name: "Mestre Musical",   description: "Alcance o nível 20",            emoji: "👑", rarity: "platinum" },
];

export function DashboardAchievements({ unlockedIds }: { unlockedIds: string[] }) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FFC107]" />
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Conquistas</h2>
        </div>
        <button
          onClick={() => router.push("/perfil")}
          className="text-xs font-semibold text-[#D4A017] flex items-center gap-1 hover:underline"
        >
          Ver todas <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-5 gap-3">
        {allAchievements.slice(0, 5).map((ach) => {
          const unlocked = unlockedIds.includes(ach.id);
          const r = rarityConfig[ach.rarity];
          return (
            <div
              key={ach.id}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                unlocked
                  ? `${r.border} ${r.bg} ${r.glow}`
                  : "border-border bg-muted opacity-50 grayscale"
              }`}
              title={ach.description}
            >
              <span className="text-3xl">{ach.emoji}</span>
              <span className="text-[10px] font-bold text-center leading-tight text-foreground">{ach.name}</span>
              {unlocked && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  ach.rarity === "bronze" ? "bg-[#CD7F32] text-white" :
                  ach.rarity === "silver" ? "bg-[#A8A8A8] text-white" :
                  ach.rarity === "gold"   ? "bg-[#FFD700] text-[#1a1a1a]" :
                  "bg-[#ADD8E6] text-[#1a1a1a]"
                }`}>{r.label}</span>
              )}
              {!unlocked && <Lock className="w-3 h-3 text-muted-foreground" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
