'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserNav } from '@/components/user-nav';
import { Flame, Heart, Star, BookOpen, Home, Trophy, Menu } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { motion } from 'framer-motion';
import { NotificationsPopover } from '@/modules/dashboard/components/notifications-popover';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/dashboard/licoes', label: 'Lições', icon: BookOpen },
  { href: '/dashboard/conquistas', label: 'Conquistas', icon: Trophy },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { lives, xp, streak, isHydrated } = useGamification();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-6 pb-2">
        <Link href="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Logo className="w-32 h-auto" />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
              pathname === item.href 
                ? 'bg-[#FFC107]/10 text-[#D4A017]' 
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 space-y-4 mt-auto">
        {/* Gamification Stats */}
        {isHydrated && (
          <div className="grid grid-cols-3 gap-2 bg-card rounded-2xl p-3 border border-border shadow-sm">
            {/* Vidas */}
            <div className="flex flex-col items-center justify-center gap-1">
              <Heart size={18} className={lives > 0 ? "text-red-500 fill-red-500" : "text-muted-foreground"} />
              <motion.span key={lives} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-xs font-bold font-headline">
                {lives}
              </motion.span>
            </div>
            {/* Ofensiva */}
            <div className="flex flex-col items-center justify-center gap-1 border-x border-border">
              <Flame size={18} className={streak > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground"} />
              <span className="text-xs font-bold font-headline">{streak}</span>
            </div>
            {/* XP */}
            <div className="flex flex-col items-center justify-center gap-1">
              <Star size={18} className="text-[#2D8A5C] fill-[#2D8A5C]" />
              <motion.span key={xp} initial={{ scale: 1.5, color: '#FFD700' }} animate={{ scale: 1, color: '#2D8A5C' }} className="text-xs font-bold font-headline">
                {xp}
              </motion.span>
            </div>
          </div>
        )}

        {/* User Controls */}
        <div className="flex items-center justify-between px-3 py-2 bg-accent/50 rounded-2xl border border-border">
          <NotificationsPopover />
          <UserNav />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Top Bar ────────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Alternar menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r-0">
             <SheetHeader className="sr-only">
               <SheetTitle>Menu de Navegação</SheetTitle>
             </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="w-24 h-auto" />
        </Link>
        
        {/* Placeholder the same size as the menu button to truly center the logo */}
        <div className="w-10 h-10" /> 
      </header>

      {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-40">
        <SidebarContent />
      </aside>
    </>
  );
}
