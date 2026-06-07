import React from 'react';
import { notFound } from 'next/navigation';
import { getDynamicCurriculum } from '@/utils/content';
import { Shield, Anchor, Crosshair, GraduationCap, Music, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-8 h-8" />,
  Anchor: <Anchor className="w-8 h-8" />,
  Crosshair: <Crosshair className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Music: <Music className="w-8 h-8" />
};

export default async function TrailPage({ params }: { params: Promise<{ trailId: string }> }) {
  const resolvedParams = await params;
  const dynamicDb = await getDynamicCurriculum();
  const trail = dynamicDb.find(t => t.id === resolvedParams.trailId);
  
  if (!trail) notFound();

  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-4rem)] font-body">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-brand-gray hover:text-[#2D8A5C] font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Trilhas
        </Link>
        
        <div className="mb-12">
          <h1 className="font-headline text-4xl font-bold text-brand-black dark:text-brand-white mb-4">{trail.title}</h1>
          <p className="text-xl text-brand-gray">Selecione o curso ou concurso desejado.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trail.courses.map(course => (
            <Link href={`/dashboard/course/${course.id}`} key={course.id} className="block group">
              <Card className="h-full border-2 border-brand-graphite/20 hover:border-brand-gold transition-all hover:shadow-[0_8px_0_0_#FACC15] hover:-translate-y-2 bg-background cursor-pointer flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
                    {iconMap[course.icon] || <BookOpen className="w-8 h-8" />}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold font-headline">{course.title}</CardTitle>
                    <CardDescription className="text-lg mt-1 font-body">{course.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center text-brand-gold font-bold mt-4 font-headline text-lg">
                    <span>Acessar Jornada</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {trail.courses.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center p-12 border-2 border-dashed border-brand-graphite/30 rounded-3xl">
              <p className="text-xl text-brand-gray font-medium">Nenhum curso disponível nesta trilha ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
