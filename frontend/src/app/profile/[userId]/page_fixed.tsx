'use client';

import { useUser } from '@/contexts/UserContext';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Linkedin } from 'lucide-react';

export default function ProfilePage() {
  const { userId: rawUserId } = useParams();
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
  const { user } = useUser();

  // Para modo demo, mostra o perfil do usuário logado
  const userProfile = user;

  if (!userProfile) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4 font-headline">Perfil não encontrado</h1>
        <p>Usuário não encontrado ou não logado.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4 font-headline">Perfil de {userProfile.name}</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userProfile.photoURL} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
              <p className="text-muted-foreground">@{userProfile.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{userProfile.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Experiência</p>
            <p>{userProfile.stats?.xp || 0} pontos</p>
          </div>
          <div className="flex gap-4 pt-4">
            {userProfile.instagramProfile && (
              <a
                href={`https://instagram.com/${userProfile.instagramProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            )}
            {userProfile.linkedInProfile && (
              <a
                href={`https://linkedin.com/in/${userProfile.linkedInProfile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}