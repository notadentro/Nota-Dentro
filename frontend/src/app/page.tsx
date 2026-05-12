'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { CircleUser, Music4, GitBranch } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const signupSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  username: z.string().min(3, { message: 'Usuário deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
});

const passwordResetSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;
type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export default function LandingPage() {
  const { toast } = useToast();
  const { user, login } = useUser();
  const router = useRouter();
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false);
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-logo');

  // Sem redirecionamento automático. o usuário permanece na landing page até autenticar.

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordResetForm = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      await login(data.name, data.username, data.email);
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você será redirecionado para o seu painel.',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: 'Ocorreu um problema. Tente novamente.',
      });
    }
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login('Usuário', 'usuario', data.email);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Você será redirecionado para o seu painel.',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: 'Ocorreu um problema inesperado. Tente novamente mais tarde.',
      });
    }
  };

  const onPasswordResetSubmit = async (data: PasswordResetFormValues) => {
    try {
      setIsPasswordResetDialogOpen(false);
      toast({
        title: 'E-mail de recuperação enviado',
        description: `Se uma conta com o e-mail ${data.email} existir, um link para redefinir a senha foi enviado.`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar e-mail',
        description: 'Não foi possível enviar o e-mail de recuperação. Tente novamente.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Logo className="h-8 w-8 text-white" />
          <span className="sr-only">Nota Dentro</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href="#about" prefetch={false}>
              Sobre Nós
            </Link>
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href="#how-it-works" prefetch={false}>
              Como Funciona
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Bem-vindo de volta!</DialogTitle>
                <DialogDescription>Faça login para continuar sua jornada musical.</DialogDescription>
              </DialogHeader>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
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
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Sua senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Dialog open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="link" className="p-0 h-auto text-sm font-normal">Esqueci a senha</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Recuperar Senha</DialogTitle>
                        <DialogDescription>
                          Digite seu e-mail para receber um link de redefinição de senha.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...passwordResetForm}>
                        <form onSubmit={passwordResetForm.handleSubmit(onPasswordResetSubmit)} className="space-y-4">
                          <FormField
                            control={passwordResetForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="seu@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full">
                            Enviar e-mail de recuperação
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full h-[75vh] min-h-[600px] md:h-screen flex items-center justify-center">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover -z-10"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/60 -z-10"></div>
          
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4 bg-black/60 p-6 rounded-xl">
                <div className="space-y-4 text-center lg:text-left text-white">
                  <Logo className="h-16 w-16 mx-auto lg:mx-0" />
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-white">
                    Aprenda música de forma divertida e gamificada
                  </h1>
                  <p className="max-w-[600px] text-gray-100 md:text-xl mx-auto lg:mx-0">
                    Nota Dentro é a plataforma perfeita para você iniciar sua jornada no mundo da música.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          Começar Agora
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Crie sua conta</DialogTitle>
                          <DialogDescription>Inicie sua jornada musical criando uma conta gratuita.</DialogDescription>
                        </DialogHeader>
                        <Form {...signupForm}>
                          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                            <FormField
                              control={signupForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome Completo</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Seu nome completo" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={signupForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Usuário</FormLabel>
                                  <FormControl>
                                    <Input placeholder="seu_usuario" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={signupForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="seu@email.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={signupForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Senha</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Sua senha" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full">
                              Criar Conta
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    <Button size="lg" variant="outline" className="border-white text-black hover:bg-gray hover:text-black">
                      <CircleUser className="mr-2 h-4 w-4" />
                      Já tenho conta
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-4">
                  <Card className="bg-black/60 backdrop-blur border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Music4 className="h-5 w-5" />
                        Teoria Musical Interativa
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        Aprenda os fundamentos da música de forma prática e envolvente.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-primary/90 backdrop-blur border-white/20">
                    <CardHeader>
                      <CardTitle className="text-black flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        Progressão Personalizada
                      </CardTitle>
                      <CardDescription className="text-black-200">
                        Seu aprendizado se adapta ao seu ritmo e preferências.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Sobre a Nota Dentro</h2>
                  <p className="max-w-[600px] text-gray-600 md:text/xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Nossa plataforma foi desenvolvida com base no livro "Elementos de Teoria Musical" de Esther Scliar, oferecendo uma experiência de aprendizado completa e acessível.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" variant="outline">
                    Saiba Mais
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                {aboutImage && (
                  <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    width={400}
                    height={400}
                    className="rounded-lg object-cover"
                    data-ai-hint={aboutImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Como Funciona</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa metodologia gamificada torna o aprendizado de música divertido e eficaz.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Crie sua Conta</h3>
                  <p className="text-gray-600">
                    Registre-se gratuitamente e personalize seu perfil de aprendizado.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Aprenda no Seu Ritmo</h3>
                  <p className="text-gray-600">
                    Acesse lições interativas baseadas na teoria de Esther Scliar.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ganhe Conquistas</h3>
                  <p className="text-gray-600">
                    Desbloqueie badges e acompanhe seu progresso musical.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Nota Dentro. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  );
}
