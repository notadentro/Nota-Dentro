'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function ProfileSetup() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Se o usuário ainda tá carregando, aguarda
  // Se não tem usuário logado depois do load, manda pra Home
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [isUserLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !user?.uid) return;
    
    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { username });
      // Redireciona para o dashboard ou onboarding musical
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Erro ao salvar o nome de usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24 px-4 text-white">
      <div className="mb-8">
        <Logo className="h-12 w-auto" />
      </div>
      
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quase lá!</CardTitle>
          <CardDescription className="text-zinc-400">
            Bem-vindo, {user.name}! Escolha como você quer ser chamado na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400">Nome de Usuário (Username)</label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: johndoe"
                className="bg-zinc-950 border-zinc-800 mt-1 focus-visible:ring-primary"
                required
              />
            </div>
            
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full font-bold bg-primary text-black hover:bg-primary/90 mt-4 h-12">
              {isSubmitting ? 'Salvando...' : 'Entrar na Plataforma'}
            </Button>
            <p className="text-xs text-center text-zinc-500 mt-4 leading-relaxed">
              Você poderá editar as demais informações depois na página Meu Perfil.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
