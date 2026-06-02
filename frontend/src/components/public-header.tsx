'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { CircleUser } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
});

export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { login } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await login('Usuário', 'usuario', values.email);
      toast({
        title: 'Bem-vindo de volta!',
        description: 'Login realizado com sucesso.',
      });
      setIsLoginDialogOpen(false);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais.',
      });
    }
  }

  return (
    <header className={`w-full h-24 md:h-28 flex items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/70 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Logo className="h-16 md:h-20 w-auto" priority />
          <span className="sr-only">Nota Dentro</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 sm:gap-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white hidden md:inline-flex" asChild>
            <Link href="/#about" prefetch={false}>
              Sobre Nós
            </Link>
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white hidden md:inline-flex" asChild>
            <Link href="/#how-it-works" prefetch={false}>
              Como Funciona
            </Link>
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white hidden md:inline-flex" asChild>
            <Link href="/blog" prefetch={false}>
              Blog
            </Link>
          </Button>
          
          <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-2 border-zinc-700 text-gray-300 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white rounded-full">
                <CircleUser className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl font-bold">Bem-vindo de volta</DialogTitle>
                <DialogDescription className="text-gray-400">Acesse sua conta para continuar estudando.</DialogDescription>
              </DialogHeader>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-primary" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Senha</FormLabel>
                        <FormControl>
                          <Input type="password" className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-primary" placeholder="Sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button variant="link" className="px-0 font-normal text-zinc-400 hover:text-primary">
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-semibold text-lg py-6">
                    Entrar na Plataforma
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </header>
  );
}
