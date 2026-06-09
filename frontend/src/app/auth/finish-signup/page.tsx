'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { auth, db } from '@/lib/firebase';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/logo';

function FinishSignupContent() {
  const { finishMagicLinkSignup, user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'verifying' | 'ask_email' | 'setup_profile' | 'done' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVerifyingRef = useRef(false);

  useEffect(() => {
    if (status !== 'verifying') return;
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;
    
    // Na primeira renderização (no client), tenta pegar o email do LocalStorage
    const savedEmail = window.localStorage.getItem('emailForSignIn');
    if (!savedEmail) {
      // Se abriu a guia anonimamente ou em outro device, pedimos o email.
      setStatus('ask_email');
      return;
    }

    handleLinkVerification(savedEmail);
  }, [status]);

  const handleLinkVerification = async (emailToVerify: string) => {
    try {
      // Tenta validar o link
      await finishMagicLinkSignup(emailToVerify, window.location.href);
      setStatus('setup_profile');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMsg(error.message || 'Link inválido ou expirado.');
    }
  };

  const submitEmail = () => {
    if (!email) return;
    setStatus('verifying');
    handleLinkVerification(email);
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsSubmitting(true);
    try {
      if (!auth.currentUser) throw new Error('Usuário não autenticado.');
      
      // Define a senha para login futuro com Email/Senha
      await updatePassword(auth.currentUser, password);
      
      // Atualiza o username no Firestore
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { username });
      }
      
      setStatus('done');
      setTimeout(() => {
        // Envia pro fluxo de onboarding ou dashboard
        router.push('/dashboard'); 
      }, 1500);
      
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Erro ao concluir perfil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24 px-4 text-white">
      <div className="mb-8">
        <Logo className="h-12 w-auto" />
      </div>
      
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Completar Cadastro</CardTitle>
          <CardDescription className="text-zinc-400">
            {status === 'verifying' && 'Verificando seu link seguro...'}
            {status === 'ask_email' && 'Por favor, confirme o e-mail que usou para se cadastrar.'}
            {status === 'setup_profile' && 'Link validado! Agora escolha seu username e crie sua senha definitiva.'}
            {status === 'done' && 'Perfil concluído!'}
            {status === 'error' && 'Ops, ocorreu um erro.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'verifying' && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          )}

          {status === 'ask_email' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-400">E-mail</label>
                <Input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-zinc-950 border-zinc-800 mt-1"
                />
              </div>
              <Button onClick={submitEmail} className="w-full font-bold bg-primary text-black hover:bg-primary/90">
                Confirmar
              </Button>
            </div>
          )}

          {status === 'setup_profile' && (
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-400">Nome de Usuário (Username)</label>
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: johndoe"
                  className="bg-zinc-950 border-zinc-800 mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">Criar Senha de Acesso</label>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="bg-zinc-950 border-zinc-800 mt-1"
                  required
                  minLength={6}
                />
              </div>
              
              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

              <Button type="submit" disabled={isSubmitting} className="w-full font-bold bg-primary text-black hover:bg-primary/90">
                {isSubmitting ? 'Salvando...' : 'Concluir e Entrar'}
              </Button>
            </form>
          )}

          {status === 'done' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="text-center font-medium">Tudo pronto! Redirecionando...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-6 space-y-4">
              <p className="text-red-400 font-medium">{errorMsg}</p>
              <Button variant="outline" onClick={() => router.push('/')} className="border-zinc-800 text-white">
                Voltar para a Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FinishSignup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <FinishSignupContent />
    </Suspense>
  );
}
