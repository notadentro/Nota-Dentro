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
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
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
  hasCompletedOnboarding?: boolean;
  onboardingData?: { goal: string; level: string; focus?: string; instruments?: string[]; };
  isAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
  sendMagicLink: (email: string) => Promise<void>;
  finishMagicLinkSignup: (email: string, windowUrl: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  updateProgress: (completedLessons: string[], unlockedLessons: string[]) => Promise<void>;
  completeOnboarding: (goal: string, level: string, focus?: string, instruments?: string[]) => Promise<void>;
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
            hasCompletedOnboarding: data.hasCompletedOnboarding ?? false,
            onboardingData: data.onboardingData || { goal: '', level: '' },
            isAdmin: data.isAdmin ?? false,
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
            hasCompletedOnboarding: false,
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
      hasCompletedOnboarding: false,
      createdAt: new Date().toISOString()
    });
  };

  const checkEmailExists = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const sendMagicLink = async (email: string) => {
    const actionCodeSettings = {
      // URL para onde o usuário será redirecionado após clicar no link
      url: `${window.location.origin}/auth/finish-signup`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Salva o email localmente para não precisar digitar de novo na outra aba
    window.localStorage.setItem('emailForSignIn', email);
  };

  const finishMagicLinkSignup = async (email: string, windowUrl: string) => {
    if (isSignInWithEmailLink(auth, windowUrl)) {
      const result = await signInWithEmailLink(auth, email, windowUrl);
      const firebaseUser = result.user;
      
      // Cria o documento do usuário se for novo (isNewUser)
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser;
      
      if (isNewUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, {
          name: 'Aluno',
          username: `user_${firebaseUser.uid.substring(0,5)}`,
          email: firebaseUser.email,
          photoURL: `https://picsum.photos/seed/${firebaseUser.uid}/200`,
          stats: { xp: 0, level: 1, streak: 0 },
          achievements: [],
          progress: {},
          hasCompletedOnboarding: false,
          createdAt: new Date().toISOString()
        });
      }
      
      window.localStorage.removeItem('emailForSignIn');
    } else {
      throw new Error('Link inválido ou expirado.');
    }
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

  const updateProgress = async (completedLessons: string[], unlockedLessons: string[]) => {
    if (!user?.uid) return;

    // Atualização otimista na tela (UI)
    setUser(prev => prev ? {
      ...prev,
      progress: {
        ...prev.progress,
        completedLessons,
        unlockedLessons
      }
    } : null);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'progress.completedLessons': completedLessons,
        'progress.unlockedLessons': unlockedLessons
      });
    } catch (error) {
      console.error('Failed to update progress in Firestore:', error);
      // Aqui idealmente reverteríamos, mas por simplicidade mantemos otimista
    }
  };

  const completeOnboarding = async (goal: string, level: string, focus?: string, instruments?: string[]) => {
    if (!user?.uid) return;

    setUser(prev => prev ? {
      ...prev,
      hasCompletedOnboarding: true,
      onboardingData: { goal, level, focus, instruments }
    } : null);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        hasCompletedOnboarding: true,
        onboardingData: { goal, level, focus, instruments }
      });
    } catch (error) {
      console.error('Failed to update onboarding status in Firestore:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, isUserLoading, login, signup, checkEmailExists, sendMagicLink, finishMagicLinkSignup, loginWithGoogle, logout, addXP, updateProgress, completeOnboarding }}>
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