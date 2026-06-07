'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, PenTool, LogOut, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && (!user || !user.isAdmin)) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return <div className="flex h-screen items-center justify-center bg-brand-black text-brand-white">Carregando Admin...</div>;
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-brand-black text-brand-white p-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-4">Acesso Restrito</h1>
        <p className="mb-8 text-brand-gray">Você não tem permissão para acessar o Painel Administrativo.</p>
        <Button onClick={() => router.push('/dashboard')} className="bg-[#2D8A5C] text-white">
          Voltar para a Dashboard
        </Button>
      </div>
    );
  }

  const navItems = [
    { name: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
    { name: 'Gerenciar Lições', href: '/admin/lessons', icon: BookOpen },
    { name: 'Artigos', href: '/admin/blog', icon: PenTool },
  ];

  return (
    <div className="flex h-screen bg-brand-black text-brand-white font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-graphite/10 border-r border-brand-graphite/20 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-brand-graphite/20">
          <h2 className="text-2xl font-bold font-headline text-brand-gold">Nota Dentro</h2>
          <span className="text-xs font-bold bg-[#2D8A5C]/20 text-[#2D8A5C] px-2 py-1 rounded-full uppercase mt-2 inline-block">Admin CMS</span>
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
                    ? 'bg-brand-gold/10 text-brand-gold' 
                    : 'text-brand-gray hover:bg-brand-graphite/20 hover:text-brand-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-graphite/20">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-start gap-3 text-brand-gray hover:text-red-400 hover:bg-red-500/10 rounded-xl px-4 py-6"
          >
            <LogOut size={20} />
            Sair do Admin
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background text-foreground">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
