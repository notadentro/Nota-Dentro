import Link from 'next/link';
import { Home, Dumbbell, Shield, User } from 'lucide-react';

const navItems = [
  { name: 'Trilhas', href: '/', icon: Home },
  { name: 'Prática', href: '/pratica', icon: Dumbbell },
  { name: 'Ranking', href: '/ranking', icon: Shield },
  { name: 'Perfil', href: '/perfil', icon: User },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border h-screen sticky top-0 bg-background p-4">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-heading font-bold text-primary">Nota Dentro</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors font-medium"
            >
              <Icon size={24} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
