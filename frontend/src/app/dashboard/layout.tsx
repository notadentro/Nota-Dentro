'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { GamificationProvider } from '@/context/GamificationContext';
import { OnboardingModal } from '@/modules/onboarding/components/OnboardingModal';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar Skeleton */}
            <aside className="hidden md:flex flex-col w-64 border-r p-6 gap-6">
                <Skeleton className="h-10 w-32" />
                <div className="space-y-4 mt-8">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
            </aside>
            <div className="flex-1 p-6 w-full flex flex-col">
                <header className="md:hidden h-16 border-b flex items-center mb-6">
                   <Skeleton className="h-8 w-8 rounded-full" />
                </header>
                <Skeleton className="h-12 w-64 mb-6" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    );
  }

  return (
    <GamificationProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-background relative overflow-x-hidden">
        {/* Renderiza o modal por cima de tudo e bloqueia o layout se não tiver completado */}
        {!user.hasCompletedOnboarding && <OnboardingModal />}
        
        <AppSidebar />
        <main className="flex-1 w-full flex flex-col min-h-screen overflow-x-hidden">{children}</main>
      </div>
    </GamificationProvider>
  );
}
