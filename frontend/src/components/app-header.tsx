'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserNav } from '@/components/user-nav';
import { Flame, Heart, Star, BookOpen, Home, Trophy, Menu, Coins, Infinity as InfinityIcon } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { useUser } from '@/contexts/UserContext';
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

export function AppHeader() {
  const pathname = usePathname();
  const { lives, xp, streak, isHydrated } = useGamification();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      
      {/* Esquerda: Mobile Menu Hambúrguer */}
      <div className="flex flex-1 md:hidden items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
               <SheetTitle className="sr-only">Navegação</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 pt-4 h-full">
              <Link href="/dashboard" className="flex items-center gap-2 mb-4 p-4">
                <Logo className="w-28 h-auto" />
              </Link>
              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {isHydrated && (
                <div className="flex justify-between items-center bg-secondary/50 rounded-lg p-4 mt-auto mb-4">
                  {/* Vidas */}
                  <div className={`flex flex-col items-center gap-1 font-bold ${lives > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    <Heart size={20} className={lives > 0 ? "fill-red-500" : "fill-transparent"} />
                    <span className="text-xs">{lives === Infinity ? <InfinityIcon size={14}/> : lives}</span>
                  </div>

                  {/* Cachês */}
                  <div className="flex flex-col items-center gap-1 font-bold text-amber-500">
                    <Coins size={20} className="fill-amber-500" />
                    <span className="text-xs">{user?.economy?.cache || 0}</span>
                  </div>

                  {/* Ofensiva */}
                  <div className={`flex flex-col items-center gap-1 font-bold ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                    <Flame size={20} className={streak > 0 ? "fill-orange-500" : "fill-transparent"} />
                    <span className="text-xs">{streak}</span>
                  </div>
                  
                  {/* XP */}
                  <div className="flex flex-col items-center gap-1 text-[#2D8A5C] font-bold">
                    <Star size={20} className="fill-[#2D8A5C]" />
                    <span className="text-xs">{xp}</span>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Esquerda: Desktop Navegação */}
      <nav className="hidden md:flex items-center gap-6 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary font-body',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Centro: Logo */}
      <div className="flex justify-center flex-1 md:flex-none">
        <Link href="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-105 p-2 md:p-3">
          <Logo className="w-28 md:w-36 h-auto" />
        </Link>
      </div>

      {/* Direita: Gamificação e Ações */}
      <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
        
        {isHydrated && (
          <div className="hidden sm:flex items-center gap-3 md:gap-4 mr-2">
            {/* Vidas */}
            <div className={`flex items-center gap-1 font-bold ${lives > 0 ? 'text-red-500' : 'text-gray-400'}`} title="Vidas">
              <Heart size={18} className={lives > 0 ? "fill-red-500" : "fill-transparent"} />
              <motion.span key={lives} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="flex items-center">
                {lives === Infinity ? <InfinityIcon size={18} /> : lives}
              </motion.span>
            </div>

            {/* Cachês */}
            <div className="flex items-center gap-1 font-bold text-amber-500" title="Cachês">
              <Coins size={18} className="fill-amber-500" />
              <span>{user?.economy?.cache || 0}</span>
            </div>

            {/* Ofensiva */}
            <div className={`flex items-center gap-1 font-bold ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} title="Ofensiva">
              <Flame size={18} className={streak > 0 ? "fill-orange-500" : "fill-transparent"} />
              <span>{streak}</span>
            </div>
            
            {/* XP */}
            <div className="flex items-center gap-1 text-[#2D8A5C] font-bold" title="XP Geral">
              <Star size={18} className="fill-[#2D8A5C]" />
              <motion.span key={xp} initial={{ scale: 1.5, color: '#FFD700' }} animate={{ scale: 1, color: '#2D8A5C' }}>
                {xp}
              </motion.span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          <NotificationsPopover />
          <UserNav />
        </div>
      </div>
      
    </header>
  );
}
