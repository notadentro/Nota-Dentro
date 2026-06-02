'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Instagram, Youtube, Twitter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const contactSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  message: z.string().min(10, { message: 'Mensagem deve ter pelo menos 10 caracteres' }),
});

export function PublicFooter() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  const { toast } = useToast();

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onContactSubmit = async (values: z.infer<typeof contactSchema>) => {
    setIsSendingContact(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Mensagem enviada!',
        description: 'Entraremos em contato em breve.',
      });
      setIsContactDialogOpen(false);
      contactForm.reset();
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

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Branding Column */}
          <div className="md:col-span-1 space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Logo className="h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto md:mx-0">
              A plataforma gamificada definitiva para você dominar a teoria musical.
            </p>
            <div className="flex gap-4 pt-2 justify-center md:justify-start">
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Plataforma */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-4">Plataforma</h3>
            <ul className="space-y-3">
              <li><Link href="/#how-it-works" className="text-sm text-zinc-400 hover:text-primary transition-colors">Como Funciona</Link></li>
              <li><Link href="/#features" className="text-sm text-zinc-400 hover:text-primary transition-colors">Funcionalidades</Link></li>
              <li><Link href="/blog" className="text-sm text-zinc-400 hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Links Úteis */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-4">Links Úteis</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-primary transition-colors">Materiais Gratuitos</Link></li>
              <li><Link href="#" className="text-sm text-zinc-400 hover:text-primary transition-colors">Guia do THE</Link></li>
              <li>
                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="text-sm text-zinc-400 hover:text-primary transition-colors focus:outline-none">Contato Comercial</button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-gray-100">
                    <DialogHeader>
                      <DialogTitle className="text-white text-2xl font-bold">Fale Conosco</DialogTitle>
                      <DialogDescription className="text-gray-400">Envie-nos uma mensagem e responderemos o mais breve possível.</DialogDescription>
                    </DialogHeader>
                    <Form {...contactForm}>
                      <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                        <FormField
                          control={contactForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Nome</FormLabel>
                              <FormControl>
                                <Input className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-primary" placeholder="Seu nome" {...field} />
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
                              <FormLabel className="text-gray-300">Email</FormLabel>
                              <FormControl>
                                <Input className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-primary" placeholder="seu@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Mensagem</FormLabel>
                              <FormControl>
                                <textarea 
                                  className="flex min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Como podemos ajudar?" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-bold" disabled={isSendingContact}>
                          {isSendingContact ? 'Enviando...' : 'Enviar Mensagem'}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/termos-de-uso" className="text-sm text-zinc-400 hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="/politica-de-privacidade" className="text-sm text-zinc-400 hover:text-primary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-900 flex flex-col items-center justify-center text-center">
          <span className="text-sm text-zinc-600">© {new Date().getFullYear()} Nota Dentro. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
