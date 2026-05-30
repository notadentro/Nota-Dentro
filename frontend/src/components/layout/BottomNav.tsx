import Link from 'next/link';
import { Home, Dumbbell, Shield, User } from 'lucide-react';

const navItems = [
  { name: 'Trilhas', href: '/', icon: Home },
  { name: 'Prática', href: '/pratica', icon: Dumbbell },
  { name: 'Ranking', href: '/ranking', icon: Shield },
  { name: 'Perfil', href: '/perfil', icon: User },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background flex justify-around items-center p-3 pb-safe z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
