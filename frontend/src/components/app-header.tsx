import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Flame, Star } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex w-full items-center justify-between md:justify-end gap-4">
        <div className="flex items-center gap-4 md:mr-auto md:ml-4">
          <div className="flex items-center gap-1 text-orange-500 font-bold">
            <Flame size={20} className="fill-orange-500" />
            <span>12</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <Star size={20} className="fill-yellow-500" />
            <span>450 XP</span>
          </div>
        </div>
        <UserNav />
      </div>
    </header>
  );
}
