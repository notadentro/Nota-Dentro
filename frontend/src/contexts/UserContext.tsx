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
import { User, UserEconomy } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface UserContextType {
  user: User | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  updateProgress: (completedLessons: string[], unlockedLessons: string[]) => Promise<void>;
  completeOnboarding: (goal: string, level: string, focus?: string, instruments?: string[]) => Promise<void>;
  
  // Economy & Monetization
  useLife: () => Promise<boolean>;
  addCache: (amount: number) => Promise<void>;
  spendCache: (amount: number) => Promise<boolean>;
  upgradeToSpalla: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { toast } = useToast();

  // Helper to check daily login cache
  const checkDailyLogin = async (currentUser: User) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLoginDay = currentUser.economy?.lastLogin?.split('T')[0];

    if (lastLoginDay !== today) {
      // It's a new day! Give 1 cachê (Evento: "Passar o Chapéu")
      const newCache = (currentUser.economy?.cache || 0) + 1;
      const updatedEconomy: UserEconomy = {
        ...currentUser.economy,
        lives: currentUser.economy?.lives || 5,
        maxLives: currentUser.economy?.maxLives || 5,
        cache: newCache,
        lastLogin: new Date().toISOString()
      };

      setUser(prev => prev ? { ...prev, economy: updatedEconomy } : null);
      
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          'economy': updatedEconomy
        });
        
        // Disparar o evento "Passar o Chapéu"
        toast({
          title: "🎩 Passar o Chapéu!",
          description: "Você ganhou 1 cachê pelo seu acesso diário!",
          variant: "default",
          className: "bg-amber-100 text-amber-900 border-amber-300"
        });
      } catch (error) {
        console.error('Failed to update daily login cache:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);
      
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        const defaultEconomy: UserEconomy = { lives: 5, maxLives: 5, cache: 0, lastLogin: new Date().toISOString() };

        if (userSnap.exists()) {
          const data = userSnap.data();
          const currentUser: User = {
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
            isSpalla: data.isSpalla ?? false,
            role: data.role || 'student',
            economy: data.economy || defaultEconomy,
            createdAt: data.createdAt
          };

          setUser(currentUser);
          await checkDailyLogin(currentUser);
        } else {
          const newUser: Partial<User> = {
            name: firebaseUser.displayName || 'Aluno',
            email: firebaseUser.email || '',
            username: `user_${firebaseUser.uid.substring(0,5)}`,
            photoURL: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
            stats: { xp: 0, level: 1, streak: 0 },
            achievements: [],
            progress: {},
            hasCompletedOnboarding: false,
            isSpalla: false,
            role: 'student',
            economy: defaultEconomy,
            createdAt: new Date().toISOString()
          };
          
          await setDoc(userRef, newUser);
          
          setUser({
            ...(newUser as User),
            uid: firebaseUser.uid,
            displayName: newUser.name,
          });
        }
      } else {
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
      isSpalla: false,
      role: 'student',
      economy: { lives: 5, maxLives: 5, cache: 0, lastLogin: new Date().toISOString() },
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
    setUser(prev => prev ? { ...prev, stats: { ...prev.stats, xp: prev.stats.xp + amount } } : null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 'stats.xp': increment(amount) });
    } catch (error) {
      setUser(prev => prev ? { ...prev, stats: { ...prev.stats, xp: prev.stats.xp - amount } } : null);
    }
  };

  const updateProgress = async (completedLessons: string[], unlockedLessons: string[]) => {
    if (!user?.uid) return;
    setUser(prev => prev ? {
      ...prev,
      progress: { ...prev.progress, completedLessons, unlockedLessons }
    } : null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'progress.completedLessons': completedLessons,
        'progress.unlockedLessons': unlockedLessons
      });
    } catch (error) {}
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
    } catch (error) {}
  };

  // --- Economy Methods ---
  
  const useLife = async (): Promise<boolean> => {
    if (!user?.uid) return false;
    if (user.isSpalla) return true; // Spalla has infinite lives
    
    const currentLives = user.economy?.lives || 0;
    if (currentLives <= 0) return false; // Can't play

    setUser(prev => {
      if (!prev || !prev.economy) return prev;
      return { ...prev, economy: { ...prev.economy, lives: prev.economy.lives - 1 } };
    });

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 'economy.lives': increment(-1) });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const addCache = async (amount: number) => {
    if (!user?.uid) return;
    setUser(prev => {
      if (!prev || !prev.economy) return prev;
      return { ...prev, economy: { ...prev.economy, cache: prev.economy.cache + amount } };
    });
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 'economy.cache': increment(amount) });
    } catch (error) {}
  };

  const spendCache = async (amount: number): Promise<boolean> => {
    if (!user?.uid) return false;
    const currentCache = user.economy?.cache || 0;
    if (currentCache < amount) return false;

    setUser(prev => {
      if (!prev || !prev.economy) return prev;
      return { ...prev, economy: { ...prev.economy, cache: prev.economy.cache - amount } };
    });

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 'economy.cache': increment(-amount) });
      return true;
    } catch (error) {
      return false;
    }
  };

  const upgradeToSpalla = async () => {
    if (!user?.uid) return;
    setUser(prev => prev ? { ...prev, isSpalla: true } : null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { isSpalla: true });
    } catch (error) {}
  };

  return (
    <UserContext.Provider value={{ 
      user, isUserLoading, login, signup, loginWithGoogle, logout, addXP, updateProgress, completeOnboarding,
      useLife, addCache, spendCache, upgradeToSpalla
    }}>
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