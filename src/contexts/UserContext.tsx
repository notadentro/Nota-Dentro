'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface User {
  uid: string;
  name: string;
  displayName?: string;
  username: string;
  email: string;
  profileImage: string;
  experience: number;
  instagramProfile?: string;
  linkedInProfile?: string;
}

interface UserContextType {
  user: User | null;
  isUserLoading: boolean;
  login: (name: string, username: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    uid: 'demo-user-123',
    name: 'Aluno Demo',
    displayName: 'Aluno Demo',
    username: 'aluno_demo',
    email: 'aluno@demo.com',
    profileImage: 'https://picsum.photos/seed/aluno_demo/200',
    experience: 0,
    instagramProfile: '',
    linkedInProfile: '',
  });
  const [isUserLoading] = useState(false);

  const login = async (name: string, username: string, email: string) => {
    // Mock login - sempre sucesso
    setUser({
      uid: `user-${Date.now()}`,
      name,      displayName: name,      username,
      email,
      profileImage: `https://picsum.photos/seed/${username}/200`,
      experience: 0,
      instagramProfile: '',
      linkedInProfile: '',
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isUserLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}