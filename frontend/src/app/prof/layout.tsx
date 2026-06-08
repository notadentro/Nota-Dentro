'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, LogOut, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Acesso permitido para 'teacher' ou 'admin'
    if (!isUserLoading && (!user || (user.role !== 'teacher' && user.role !== 'admin'))) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-900">Carregando Painel...</div>;
  }

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 text-slate-900 p-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-4">Acesso Restrito</h1>
        <p className="mb-8 text-slate-500">Você precisa de uma conta de Professor para acessar este painel.</p>
        <Button onClick={() => router.push('/dashboard')} className="bg-[#2D8A5C] hover:bg-[#2D8A5C]/90 text-white">
          Voltar para a Área do Aluno
        </Button>
      </div>
    );
  }

  const navItems = [
    { name: 'Visão Geral', href: '/prof', icon: LayoutDashboard },
    // Temporariamente comentando até as lições B2B estarem prontas:
    // { name: 'Minhas Lições', href: '/prof/lessons', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold font-headline text-brand-gold">Nota Dentro</h2>
          <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full uppercase mt-2 inline-block">Painel do Professor</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 py-6"
          >
            <LogOut size={20} />
            Sair do Painel
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
