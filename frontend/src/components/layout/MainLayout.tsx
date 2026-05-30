import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        {/* pb-20 on mobile to account for the bottom nav */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
