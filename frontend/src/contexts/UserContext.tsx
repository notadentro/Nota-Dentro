'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { addXPServer, updateProgressServer, updateLivesServer, updateCacheServer } from '@/app/actions/gamification';

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
    lives: number;
    cache: number;
  };
  achievements: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  updateProgress: (completedLessons: string[], unlockedLessons: string[]) => Promise<void>;
  deductLife: () => Promise<void>;
  buyLives: (cost: number, amount: number) => Promise<boolean>;
  addCache: (amount: number) => Promise<void>;
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
            stats: { 
              xp: data.stats?.xp || 0, 
              level: data.stats?.level || 1, 
              streak: data.stats?.streak || 0,
              lives: data.stats?.lives ?? 3,
              cache: data.stats?.cache ?? 100
            },
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
            stats: { xp: 0, level: 1, streak: 0, lives: 3, cache: 100 },
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
      stats: { xp: 0, level: 1, streak: 0, lives: 5, cache: 100 },
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
          stats: { xp: 0, level: 1, streak: 0, lives: 5, cache: 100 },
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

  const loginWithGoogle = async (): Promise<boolean> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const additionalInfo = getAdditionalUserInfo(result);
    return additionalInfo?.isNewUser ?? false;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addXP = async (amount: number) => {
    if (!user?.uid) return;

    // Atualização otimista na tela (UI)
    setUser(prev => prev ? { ...prev, stats: { ...prev.stats, xp: prev.stats.xp + amount } } : null);

    try {
      await addXPServer(user.uid, amount);
    } catch (error) {
      console.error('Failed to add XP to server:', error);
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
      await updateProgressServer(user.uid, completedLessons, unlockedLessons);
    } catch (error) {
      console.error('Failed to update progress on server:', error);
      // Aqui idealmente reverteríamos, mas por simplicidade mantemos otimista
    }
  };

  const deductLife = async () => {
    if (!user?.uid) return;
    if (user.stats.lives <= 0) return;

    setUser(prev => prev ? { ...prev, stats: { ...prev.stats, lives: prev.stats.lives - 1 } } : null);

    try {
      await updateLivesServer(user.uid, -1);
    } catch (error) {
      console.error('Failed to deduct life:', error);
      setUser(prev => prev ? { ...prev, stats: { ...prev.stats, lives: prev.stats.lives + 1 } } : null);
    }
  };

  const buyLives = async (cost: number, amount: number): Promise<boolean> => {
    if (!user?.uid) return false;
    if (user.stats.cache < cost) return false;

    setUser(prev => prev ? { 
      ...prev, 
      stats: { ...prev.stats, lives: prev.stats.lives + amount, cache: prev.stats.cache - cost } 
    } : null);

    try {
      await updateCacheServer(user.uid, -cost);
      await updateLivesServer(user.uid, amount);
      return true;
    } catch (error) {
      console.error('Failed to buy lives:', error);
      // rollback
      setUser(prev => prev ? { 
        ...prev, 
        stats: { ...prev.stats, lives: prev.stats.lives - amount, cache: prev.stats.cache + cost } 
      } : null);
      return false;
    }
  };

  const addCache = async (amount: number) => {
    if (!user?.uid) return;

    setUser(prev => prev ? { ...prev, stats: { ...prev.stats, cache: prev.stats.cache + amount } } : null);

    try {
      await updateCacheServer(user.uid, amount);
    } catch (error) {
      console.error('Failed to add cache:', error);
      setUser(prev => prev ? { ...prev, stats: { ...prev.stats, cache: prev.stats.cache - amount } } : null);
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
    <UserContext.Provider value={{ user, isUserLoading, login, signup, checkEmailExists, sendMagicLink, finishMagicLinkSignup, loginWithGoogle, logout, addXP, updateProgress, deductLife, buyLives, addCache, completeOnboarding }}>
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