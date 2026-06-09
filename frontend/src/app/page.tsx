'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { CircleUser, Music4, GitBranch, ArrowRight, Star, ShieldCheck, Instagram, Youtube, Twitter } from 'lucide-react';
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
import { motion, Variants } from 'framer-motion';
import { PublicFooter } from '@/components/public-footer';

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

const contactSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  whatsapp: z.string().optional(),
  subject: z.string().min(1, { message: 'Assunto é obrigatório' }),
  message: z.string().min(10, { message: 'Mensagem deve ter pelo menos 10 caracteres' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;
type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
type ContactFormValues = z.infer<typeof contactSchema>;

export default function LandingPage() {
  const { toast } = useToast();
  const { user, login, signup, loginWithGoogle } = useUser();
  const router = useRouter();
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      subject: 'suporte',
      message: '',
    },
  });

  const [isSendingContact, setIsSendingContact] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Novos estados de Auth (Estilo Outlier)
  const [authStep, setAuthStep] = useState<'initial' | 'login' | 'magic_link_sent'>('initial');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const { checkEmailExists, sendMagicLink } = useUser();

  const handleEmailContinue = async () => {
    if (!authEmail) {
      toast({ variant: 'destructive', title: 'Aviso', description: 'Preencha seu e-mail.' });
      return;
    }
    setIsChecking(true);
    try {
      const exists = await checkEmailExists(authEmail);
      if (exists) {
        setAuthStep('login');
      } else {
        await sendMagicLink(authEmail);
        setAuthStep('magic_link_sent');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível verificar o email.' });
    } finally {
      setIsChecking(false);
    }
  };

  const handlePasswordLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authPassword) return;
    setIsChecking(true);
    try {
      await login(authEmail, authPassword);
      toast({ title: 'Bem-vindo de volta!', description: 'Entrando...' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Senha incorreta.' });
    } finally {
      setIsChecking(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data.name, data.username, data.email, data.password);
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você será redirecionado para o seu painel.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: error.message || 'Ocorreu um problema. Tente novamente.',
      });
    }
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Você será redirecionado para o seu painel.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Senha ou email incorretos',
        description: 'Verifique suas credenciais e tente novamente.',
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const isNewUser = await loginWithGoogle();
      toast({
        title: 'Login realizado!',
        description: 'Entrando com a conta do Google...',
      });
      // Se for usuário novo, encaminhamos pro profile setup
      if (isNewUser) {
        router.push('/onboarding/profile');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no Google',
        description: 'Não foi possível fazer login com o Google.',
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

  const onContactSubmit = async (data: ContactFormValues) => {
    setIsSendingContact(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Erro ao enviar');
      toast({
        title: 'Mensagem enviada!',
        description: 'Recebemos seu contato e retornaremos em breve.',
      });
      contactForm.reset();
      setIsContactDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar mensagem',
        description: 'Ocorreu um problema ao enviar o contato. Tente novamente.',
      });
    } finally {
      setIsSendingContact(false);
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeUpItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100 overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Floating Navbar */}
      <header className={`w-full h-24 md:h-28 flex items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/70 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto flex items-center">
          <Link href="#" className="flex items-center justify-center" prefetch={false}>
            <Logo className="h-16 md:h-20 w-auto" priority />
            <span className="sr-only">Nota Dentro</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1 sm:gap-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white hidden md:inline-flex" asChild>
            <Link href="#about" prefetch={false}>
              Sobre Nós
            </Link>
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white hidden md:inline-flex" asChild>
            <Link href="#how-it-works" prefetch={false}>
              Como Funciona
            </Link>
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white" asChild>
            <Link href="/blog" prefetch={false}>
              Blog
            </Link>
          </Button>
          
          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-gray-300 hover:text-white">Contato</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-zinc-950 border-zinc-800 text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-white">Fale Conosco</DialogTitle>
                <DialogDescription className="text-gray-400">Tem alguma dúvida, sugestão ou quer ser um parceiro? Mande uma mensagem!</DialogDescription>
              </DialogHeader>
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nome Completo</FormLabel>
                          <FormControl>
                            <Input className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-primary" placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">E-mail</FormLabel>
                          <FormControl>
                            <Input className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-primary" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">WhatsApp (Opcional)</FormLabel>
                          <FormControl>
                            <Input className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-primary" placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Assunto</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              {...field}
                            >
                              <option value="suporte">Dúvida / Suporte</option>
                              <option value="contato">Parceria / Contato Comercial</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Mensagem</FormLabel>
                        <FormControl>
                          <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            placeholder="Como podemos te ajudar?" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-semibold" disabled={isSendingContact}>
                    {isSendingContact ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/20 ml-2 rounded-full px-6 transition-all">Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl font-bold">Bem-vindo de volta!</DialogTitle>
                <DialogDescription className="text-gray-400">Faça login para continuar sua jornada musical.</DialogDescription>
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
                    <Dialog open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="link" className="p-0 h-auto text-sm text-primary hover:text-primary/80">Esqueci a senha</Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-950 border-zinc-800 text-gray-100">
                        <DialogHeader>
                          <DialogTitle className="text-white">Recuperar Senha</DialogTitle>
                          <DialogDescription className="text-gray-400">
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
                                  <FormLabel className="text-gray-300">Email</FormLabel>
                                  <FormControl>
                                    <Input className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-primary" placeholder="seu@email.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-semibold">
                              Enviar e-mail de recuperação
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-semibold text-lg py-6">
                    Entrar na Plataforma
                  </Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-zinc-950 px-2 text-zinc-500">Ou</span>
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white py-6">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Continuar com o Google
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </nav>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden pt-20">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black -z-20"></div>
          
          {/* Subtle Glowing Orbs (Static for better mobile/Safari performance) */}
          <div className="absolute top-[20%] left-[15%] w-72 h-72 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute bottom-[20%] right-[-5%] md:right-[10%] w-72 h-72 md:w-[500px] md:h-[500px] bg-purple-600/20 rounded-full blur-[90px] md:blur-[150px] -z-10 pointer-events-none" />

          <div className="container px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col justify-center space-y-8 text-center lg:text-left mt-10 lg:mt-0"
              >
                <motion.div variants={fadeUpItem} className="space-y-4">
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl/none font-headline text-transparent bg-clip-text bg-gradient-to-br from-primary to-yellow-200 drop-shadow-sm">
                    Aprenda música de forma dinâmica
                  </h1>
                  <p className="max-w-[600px] text-gray-400 text-lg md:text-xl mx-auto lg:mx-0 font-light leading-relaxed">
                    A <strong>Nota Dentro</strong> é a plataforma gamificada definitiva para estudos livres, Testes de Habilidade Específica (THE) e Carreiras Militares. Domine os fundamentos teóricos de forma prática e interativa.
                  </p>
                </motion.div>
                
                <motion.div variants={fadeUpItem} className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                  <div className="flex -space-x-3">
                    {["https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/68.jpg", "https://randomuser.me/api/portraits/men/46.jpg"].map((src, i) => (
                      <div key={i} className={`relative w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center z-${10-i} shadow-sm overflow-hidden`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`Estudante ${i+1}`} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                  <p className="font-medium text-gray-400">Junte-se a dezenas de estudantes.</p>
                </motion.div>
              </motion.div>

              {/* Right Content - Embedded Dark Premium Form */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.2 },
                  scale: { duration: 0.8, delay: 0.2, type: "spring" },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } 
                }}
                className="relative w-full max-w-md mx-auto lg:ml-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-purple-600/30 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
                <Card className="relative bg-[#1a1a1c] border-zinc-800/60 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden">
                  <CardHeader className="text-left pb-4 pt-8">
                    <CardTitle className="text-2xl font-semibold text-white">
                      {authStep === 'initial' ? 'Welcome to Nota Dentro' : authStep === 'login' ? 'Welcome Back' : 'Check your email'}
                    </CardTitle>
                    {authStep === 'magic_link_sent' && (
                      <CardDescription className="text-zinc-400 mt-2">
                        Enviamos um magic link para criar sua conta.
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="px-6 md:px-8 pb-8">
                    
                    {authStep === 'initial' && (
                      <div className="space-y-4">
                        <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white h-12 rounded-full font-medium">
                          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                          </svg>
                          Continue with Google
                        </Button>
                        
                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-800" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-[#1a1a1c] px-4 text-zinc-500">OR</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-zinc-400 mb-1.5 block font-medium">Email</label>
                          <Input 
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            type="email"
                            className="bg-transparent border-zinc-700 h-12 text-white placeholder:text-zinc-600 focus-visible:ring-primary mb-4" 
                            placeholder="seu@email.com" 
                            onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
                          />
                          <Button onClick={handleEmailContinue} disabled={isChecking} className="w-full bg-[#f97316] text-white hover:bg-[#ea580c] font-semibold text-base h-12 rounded-full transition-all">
                            {isChecking ? 'Verificando...' : 'Continue'}
                          </Button>
                        </div>
                        
                        <p className="text-[11px] text-zinc-500 mt-6 leading-relaxed">
                          By signing up, I agree to the Terms of Use, including the Independent Contractor and Arbitration Agreements, and acknowledge the Privacy Policy.
                        </p>
                      </div>
                    )}

                    {authStep === 'login' && (
                      <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div>
                          <label className="text-sm text-zinc-400 mb-1.5 block font-medium">Email</label>
                          <Input 
                            value={authEmail}
                            disabled
                            className="bg-zinc-800/50 border-zinc-700 h-12 text-white/50 cursor-not-allowed" 
                          />
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400 mb-1.5 block font-medium">Password</label>
                          <Input 
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            type="password"
                            className="bg-transparent border-zinc-700 h-12 text-white focus-visible:ring-primary" 
                            placeholder="Sua senha" 
                            autoFocus
                          />
                        </div>
                        <Button type="submit" disabled={isChecking} className="w-full bg-[#f97316] text-white hover:bg-[#ea580c] font-semibold text-base h-12 rounded-full mt-2">
                          {isChecking ? 'Entrando...' : 'Log In'}
                        </Button>
                        <Button type="button" variant="link" onClick={() => setAuthStep('initial')} className="w-full text-zinc-400 text-sm">
                          Voltar
                        </Button>
                      </form>
                    )}

                    {authStep === 'magic_link_sent' && (
                      <div className="text-center space-y-6 mt-2">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <p className="text-zinc-300">
                          Um link de acesso foi enviado para <br/><strong className="text-white">{authEmail}</strong>
                        </p>
                        <Button type="button" variant="outline" onClick={() => setAuthStep('initial')} className="w-full border-zinc-700 bg-transparent text-white rounded-full">
                          Tentar outro email
                        </Button>
                      </div>
                    )}

                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="w-full py-24 lg:py-32 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid gap-12 lg:grid-cols-2 items-center"
            >
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 text-primary font-medium text-sm tracking-widest uppercase">
                  <ShieldCheck className="w-4 h-4" /> Fundamentação Teórica
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline text-white">
                  O Método <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Scliar</span> Digitalizado
                </h2>
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                  Não reinventamos a roda. Pegamos a metodologia sólida de <strong>Esther Scliar, Bohumil Med e Maria Luiza Priolli</strong> e transformamos em uma experiência moderna, onde o feedback é instantâneo e a teoria ganha vida.
                </p>
                <div className="pt-4">
                  <Button variant="link" className="text-primary hover:text-primary/80 p-0 text-lg group">
                    Conheça nossa metodologia <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                <Image
                  src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000&auto=format&fit=crop"
                  alt="Partitura Clássica"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="w-full py-24 lg:py-32 bg-black relative">
          <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline text-white">
                Como Funciona
              </h2>
              <p className="max-w-[700px] text-gray-400 text-lg md:text-xl">
                O caminho mais curto entre você e a sua aprovação.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-zinc-800 via-primary/50 to-zinc-800 -z-10"></div>
              
              {[
                { step: 1, title: 'Cadastro Gratuito', desc: 'Crie sua conta em 30 segundos e defina seu objetivo (Livre, Concurso ou Universidade).' },
                { step: 2, title: 'Missões Diárias', desc: 'Resolva desafios de percepção, ritmo e harmonia ganhando XP por cada acerto.' },
                { step: 3, title: 'Evolução', desc: 'Acompanhe seu desempenho com estatísticas detalhadas e domine a teoria musical.' }
              ].map((item, index) => (
                <motion.div 
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl transition-all group-hover:bg-primary/10"></div>
                  <div className="relative flex flex-col items-center text-center space-y-4 p-8 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-primary/50 rounded-3xl transition-colors h-full">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 transition-all">
                      <span className="text-3xl font-black text-gray-300 group-hover:text-primary">{item.step}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-4">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL SECTION */}
        <section className="w-full py-20 bg-zinc-900 border-t border-zinc-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-zinc-900 to-zinc-900 -z-10"></div>
          <div className="container px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold font-headline text-white">Pronto para dominar a música?</h2>
              <p className="text-gray-400 text-lg md:text-xl">Comece a aprender de forma dinâmica e interativa agora mesmo.</p>
            </div>
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="lg" className="relative group bg-primary text-black hover:bg-primary/90 font-bold text-lg h-14 px-8 rounded-full shadow-[0_0_40px_-10px_rgba(255,215,0,0.5)] transition-all hover:shadow-[0_0_60px_-10px_rgba(255,215,0,0.7)] hover:-translate-y-1">
              <span>Criar Conta Gratuita</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <PublicFooter />
    </div>
  );
}
