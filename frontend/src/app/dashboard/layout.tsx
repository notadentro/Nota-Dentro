'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppHeader } from '@/components/app-header';
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
        <div className="flex flex-col min-h-screen">
            <header className="h-16 border-b p-4 flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </header>
            <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
                <Skeleton className="h-12 w-64 mb-6" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    );
  }

  return (
    <GamificationProvider>
      <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
        {/* Renderiza o modal por cima de tudo e bloqueia o layout se não tiver completado */}
        {!user.hasCompletedOnboarding && <OnboardingModal />}
        
        <AppHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
      </div>
    </GamificationProvider>
  );
}
