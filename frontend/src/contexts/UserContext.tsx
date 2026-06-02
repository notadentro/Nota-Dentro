'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '@/lib/firebase';

interface User {
  uid: string;
  name: string;
  displayName?: string;
  username: string;
  email: string;
  photoURL: string;
  stats: {
    xp: number;
    level: number;
    streak: number;
  };
  achievements: string[];
  progress?: Record<string, any>;
  instagramProfile?: string;
  linkedInProfile?: string;
}

interface UserContextType {
  user: User | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // Fica escutando se alguém entrou ou saiu da "portaria" do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);
      
      if (firebaseUser) {
        // Usuário está logado. Vamos buscar os dados dele no nosso Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUser({
            uid: firebaseUser.uid,
            name: data.name || firebaseUser.displayName || 'Aluno',
            displayName: data.displayName || data.name || firebaseUser.displayName || 'Aluno',
            username: data.username || `user_${firebaseUser.uid.substring(0,5)}`,
            email: firebaseUser.email || data.email || '',
            photoURL: data.photoURL || firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
            stats: data.stats || { xp: 0, level: 1, streak: 0 },
            achievements: data.achievements || [],
            progress: data.progress || {},
            instagramProfile: data.instagramProfile || '',
            linkedInProfile: data.linkedInProfile || '',
          });
        } else {
          // Se o usuário logou pela primeira vez (ex: Google) e não tem perfil no Firestore, criamos um!
          const newUser = {
            name: firebaseUser.displayName || 'Aluno',
            email: firebaseUser.email || '',
            username: `user_${firebaseUser.uid.substring(0,5)}`,
            photoURL: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
            stats: { xp: 0, level: 1, streak: 0 },
            achievements: [],
            progress: {},
            createdAt: new Date().toISOString()
          };
          
          await setDoc(userRef, newUser);
          
          setUser({
            uid: firebaseUser.uid,
            ...newUser,
            displayName: newUser.name,
          });
        }
      } else {
        // Ninguém logado
        setUser(null);
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name: string, username: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Logo após criar a conta no Auth, já criamos o perfil no Firestore
    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, {
      name,
      username,
      email,
      photoURL: `https://picsum.photos/seed/${username}/200`,
      stats: { xp: 0, level: 1, streak: 0 },
      achievements: [],
      progress: {},
      createdAt: new Date().toISOString()
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addXP = async (amount: number) => {
    if (!user?.uid) return;

    // Atualização otimista na tela (UI)
    setUser(prev => prev ? { ...prev, stats: { ...prev.stats, xp: prev.stats.xp + amount } } : null);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'stats.xp': increment(amount)
      });
    } catch (error) {
      console.error('Failed to add XP to Firestore:', error);
      // Reverte caso dê erro no banco
      setUser(prev => prev ? { ...prev, stats: { ...prev.stats, xp: prev.stats.xp - amount } } : null);
    }
  };

  return (
    <UserContext.Provider value={{ user, isUserLoading, login, signup, loginWithGoogle, logout, addXP }}>
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