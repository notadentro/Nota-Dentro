'use client';

import { useState, useEffect } from 'react';
import { UserProgress } from '@/modules/dashboard/components/user-progress';
import { AchievementIcon } from '@/modules/dashboard/components/achievement-icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import { Shield, Anchor, Crosshair, GraduationCap, Music, ArrowRight, PenTool } from 'lucide-react';
import { SpallaBanner } from '@/components/spalla/SpallaBanner';
import { getRankName } from '@/utils/ranks';

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-8 h-8" />,
  Anchor: <Anchor className="w-8 h-8" />,
  Crosshair: <Crosshair className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Music: <Music className="w-8 h-8" />
};

export default function DashboardPage() {
    const { user } = useUser();
    const [trails, setTrails] = useState<any[]>([]);

    useEffect(() => {
      fetch('/api/public/curriculum')
        .then(res => res.json())
        .then(data => {
          if (data.database) {
            setTrails(data.database);
          }
        })
        .catch(console.error);
    }, []);

    const achievements = [
        { title: "Iniciante", description: "Completou 10 lições" },
        { title: "Ouvido de Ouro", description: "Acertou 50 notas" },
        { title: "Maratonista", description: "Estudou por 7 dias" },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 min-h-[calc(100vh-4rem)] font-body overflow-x-hidden">
            <SpallaBanner />
            <header className="text-center md:text-left">
                <h1 className="text-3xl font-bold font-headline text-foreground flex items-center gap-3">
                    Olá, {user?.displayName?.split(' ')[0] || 'Aluno'}! 👋
                    <span className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-wider">
                        {getRankName(user?.stats?.level || 1)}
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg mt-2">Qual o seu objetivo principal hoje?</p>
                
                {user?.onboardingData?.goal === 'livre' && (
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 text-sm font-body">
                    <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full font-bold">
                      Foco: {user.onboardingData.focus === 'harmonia' ? 'Harmonia' : user.onboardingData.focus === 'melodia' ? 'Melodia' : user.onboardingData.focus === 'ritmo' ? 'Percussão' : 'Geral'}
                    </span>
                    {user.onboardingData.instruments?.map(inst => (
                      <span key={inst} className="px-3 py-1 bg-[#2D8A5C]/20 text-[#2D8A5C] rounded-full font-bold capitalize">
                        {inst}
                      </span>
                    ))}
                  </div>
                )}
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8 flex flex-col">
                    <section className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {trails.length === 0 ? (
                              <p className="text-muted-foreground col-span-2">Carregando trilhas...</p>
                            ) : trails.map(trail => (
                            <Link href={`/dashboard/trail/${trail.id}`} key={trail.id} className="block group">
                                <Card className="h-full border-2 border-brand-graphite/20 hover:border-[#2D8A5C] transition-all hover:shadow-[0_8px_0_0_#2D8A5C] hover:-translate-y-2 bg-background cursor-pointer flex flex-col">
                                <CardHeader className="flex flex-row items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2D8A5C]/10 flex items-center justify-center text-[#2D8A5C] group-hover:bg-[#2D8A5C] group-hover:text-white transition-colors shrink-0">
                                    {iconMap[trail.icon] || <Shield className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1">
                                    <CardTitle className="text-xl font-bold font-headline leading-tight">{trail.title}</CardTitle>
                                    <CardDescription className="text-sm mt-2 font-body">{trail.description}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <div className="flex items-center text-[#2D8A5C] font-bold mt-2 font-headline text-sm">
                                    <span>Ver Cursos ({trail.courses.length})</span>
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </CardContent>
                                </Card>
                            </Link>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <UserProgress />
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Conquistas Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap justify-around gap-4">
                                {achievements.map(ach => (
                                    <AchievementIcon key={ach.title} title={ach.title} description={ach.description} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Link href="/blog" className="block group">
                        <Card className="border-2 border-brand-graphite/20 hover:border-brand-gold transition-all hover:shadow-[0_8px_0_0_#EEBB2E] hover:-translate-y-2 bg-brand-black text-brand-white cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline text-lg text-brand-gold">
                                    <PenTool className="w-5 h-5" />
                                    Artigos & Dicas
                                </CardTitle>
                                <CardDescription className="text-brand-gray font-body mt-2">
                                    Leia conteúdos complementares, dicas de estudo e análises teóricas.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </aside>
            </div>
        </div>
    );
}
