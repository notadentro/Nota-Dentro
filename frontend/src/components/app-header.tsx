import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex w-full items-center justify-end">
        <UserNav />
      </div>
    </header>
  );
}
