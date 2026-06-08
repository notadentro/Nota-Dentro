'use client';

import { useUser } from '@/contexts/UserContext';
import { Users, BookOpen, BarChart3, Settings } from 'lucide-react';

export default function ProfPage() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline text-slate-900">
          Olá, Professor(a) {user?.displayName?.split(' ')[0] || ''}! 👋
        </h1>
        <p className="text-slate-500 mt-2">Bem-vindo ao seu painel B2B. Acompanhe suas turmas e crie simulados direcionados.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 mb-1">12</h3>
          <p className="text-slate-500 text-sm font-medium">Alunos Ativos</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 mb-1">3</h3>
          <p className="text-slate-500 text-sm font-medium">Simulados Ativos</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 mb-1">78%</h3>
          <p className="text-slate-500 text-sm font-medium">Taxa Média de Acerto</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Plano Base</h3>
          <p className="text-slate-500 text-sm font-medium">Gerenciar Assinatura</p>
        </div>
      </div>

      <section className="mt-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold font-headline text-slate-900 mb-4">Mural da Turma</h2>
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center">
          <Users className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Nenhuma atividade recente</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Seus alunos ainda não completaram simulados esta semana. Que tal enviar um lembrete sobre a revisão de compassos compostos?
          </p>
        </div>
      </section>
    </div>
  );
}
