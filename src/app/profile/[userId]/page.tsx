'use client';

import { useMemo } from 'react'; // Adicionado para gerenciar as dependências
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Instagram, Linkedin } from 'lucide-react';

export default function ProfilePage() {
  const { userId: rawUserId } = useParams();
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
  const { firestore } = useFirebase();

  // Correção: Envolvendo o useMemoFirebase em um useMemo padrão do React
  // para lidar corretamente com a lista de dependências [firestore, userId]
  const userDocRef = useMemo(() => {
    return useMemoFirebase(() => {
      if (!firestore || !userId) return null;
      return doc(firestore, 'users', userId);
    });
  }, [firestore, userId]);
  
  const { data: userProfile, isLoading } = useDoc(userDocRef);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4 font-headline">Perfil de Usuário</h1>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <div className="flex gap-4 pt-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="p-6 text-center">Perfil não encontrado.</div>;
  }

  return (
    <div className="p-4 md:p-6">
       <h1 className="text-2xl font-bold mb-4 font-headline">Perfil de Usuário</h1>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={userProfile.profileImage} alt={userProfile.name} />
              <AvatarFallback className="text-3xl">{userProfile.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-3xl">{userProfile.name}</CardTitle>
              <p className="text-muted-foreground">@{userProfile.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{userProfile.email}</p>
            </div>
             <div>
                <p className="text-sm font-medium text-muted-foreground">Experiência</p>
                <p>{userProfile.experience} XP</p>
            </div>
            <div className="flex gap-4 pt-4">
                {userProfile.instagramProfile && (
                    <a href={userProfile.instagramProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                        <Instagram className="size-5" /> <span>Instagram</span>
                    </a>
                )}
                {userProfile.linkedInProfile && (
                    <a href={userProfile.linkedInProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                        <Linkedin className="size-5" /> <span>LinkedIn</span>
                    </a>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}