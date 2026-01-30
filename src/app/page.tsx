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
import { useAuth, useUser, useFirestore } from '@/firebase';
import { initiateEmailSignUp, initiateEmailSignIn, initiatePasswordReset } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FirebaseError } from 'firebase/app';

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
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-logo');
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false);


  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

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
      const userCredential = await initiateEmailSignUp(auth, data.email, data.password);
      const user = userCredential.user;
        if (user) {
          const userProfile = {
            uid: user.uid,
            name: data.name,
            username: data.username,
            email: data.email,
            experience: 0,
            profileImage: `https://picsum.photos/seed/${data.username}/200`,
            instagramProfile: '',
            linkedInProfile: '',
          };
          const userDocRef = doc(firestore, 'users', user.uid);
          await setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
          
          toast({
            title: 'Conta criada com sucesso!',
            description: 'Você será redirecionado para o seu painel.',
          });
          // onAuthStateChanged will handle the redirect
        }
    } catch (error) {      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'destructive',
          title: 'Erro ao criar conta',
          description: "Este e-mail já está em uso por outra conta.",
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao criar conta',
          description: "Ocorreu um problema. Tente novamente.",
        });
      }
    }
  };
  
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await initiateEmailSignIn(auth, data.email, data.password);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Você será redirecionado para o seu painel.',
      });
      // onAuthStateChanged will handle the redirect
    } catch (error) {
       if (error instanceof FirebaseError && (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found')) {
         toast({
          variant: 'destructive',
          title: 'Falha no login',
          description: 'Email ou senha inválidos. Verifique suas credenciais e tente novamente.',
        });
       } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao fazer login',
          description: 'Ocorreu um problema inesperado. Tente novamente mais tarde.',
        });
       }
    }
  };

  const onPasswordResetSubmit = async (data: PasswordResetFormValues) => {
    try {
      await initiatePasswordReset(auth, data.email);
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


  if (isUserLoading || user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Carregando...</p>
        </div>
    );
  }

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
            {heroImage && 
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover -z-10"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            }
            <div className="absolute inset-0 bg-black/60 -z-10"></div>
          <div className="container px-4 md:px-6 text-white">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4 text-center lg:text-left">
                  <Logo className="h-16 w-16 mx-auto lg:mx-0" />
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-black [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                    Aprenda música de forma divertida e gamificada
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl mx-auto lg:mx-0">
                    Nota Dentro é a plataforma perfeita para você iniciar sua jornada no mundo da música.
                  </p>
                </div>
              </div>
              <Card className="bg-background/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Crie sua conta</CardTitle>
                  <CardDescription>Comece sua jornada musical agora mesmo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
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
                              <Input placeholder="Seu nome de usuário" {...field} />
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
                </CardContent>
                 <CardFooter className="flex-col items-start text-sm">
                    <p className="text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto">Faça login</Button>
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
                    </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                {aboutImage &&
                  <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    width={550}
                    height={550}
                    className="mx-auto rounded-lg"
                    data-ai-hint={aboutImage.imageHint}
                  />
                }
              </div>
              <div className="flex flex-col justify-center space-y-4 order-1 lg:order-2">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nossa Missão</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">A Música ao Alcance de Todos</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Nossa missão é tornar o aprendizado de música acessível, divertido e eficaz. Acreditamos que a música tem o poder de transformar vidas e, com a Nota Dentro, queremos que todos tenham a oportunidade de experimentar essa magia através de uma plataforma gamificada e intuitiva.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Como Funciona</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                É simples e divertido. Siga estes passos para começar a aprender.
              </p>
            </div>
            <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              <div className="flex flex-col gap-2 items-center">
                <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-16 w-16 text-2xl font-bold">
                  <CircleUser className="size-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">Crie sua conta</h3>
                <p className="text-sm text-muted-foreground">Cadastre-se rapidamente para começar.</p>
              </div>
              <div className="flex flex-col gap-2 items-center">
                 <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-16 w-16 text-2xl font-bold">
                  <Music4 className="size-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">Escolha uma lição</h3>
                <p className="text-sm text-muted-foreground">Navegue por nossas lições e comece por onde quiser.</p>
              </div>
              <div className="flex flex-col gap-2 items-center">
                 <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-16 w-16 text-2xl font-bold">
                  <GitBranch className="size-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">Pratique e evolua</h3>
                <p className="text-sm text-muted-foreground">Complete os desafios, ganhe pontos e suba de nível.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Nota Dentro. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Termos de Serviço
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  );
}
