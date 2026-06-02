'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';

interface GamificationState {
  lives: number;
  xp: number;
  streak: number;
  completedLessons: string[];
  unlockedLessons: string[];
}

interface GamificationContextType extends GamificationState {
  completeLesson: (lessonId: string, nextLessonId?: string, xpReward?: number) => void;
  loseLife: () => void;
  restoreLives: () => void;
  isHydrated: boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { user, addXP, updateProgress } = useUser();
  const [lives, setLives] = useState(5);
  const [isHydrated, setIsHydrated] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [unlockedLessons, setUnlockedLessons] = useState<string[]>(['1']);

  useEffect(() => {
    if (user) {
      const storedCompleted = user.progress?.completedLessons as string[] || [];
      const storedUnlocked = user.progress?.unlockedLessons as string[] || ['1'];
      
      setCompletedLessons(storedCompleted);
      setUnlockedLessons(storedUnlocked);
      
      if (!storedUnlocked.includes('1')) {
        setUnlockedLessons(['1']);
      }
      setIsHydrated(true);
    }
  }, [user]);

  const completeLesson = async (lessonId: string, nextLessonId?: string, xpReward = 50) => {
    if (completedLessons.includes(lessonId)) return;

    const newCompleted = [...completedLessons, lessonId];
    const newUnlocked = [...unlockedLessons];
    
    if (nextLessonId && !newUnlocked.includes(nextLessonId)) {
      newUnlocked.push(nextLessonId);
    }

    setCompletedLessons(newCompleted);
    setUnlockedLessons(newUnlocked);

    // Salvar no Firebase
    await updateProgress(newCompleted, newUnlocked);
    await addXP(xpReward);
  };

  const loseLife = () => {
    setLives((prev) => Math.max(0, prev - 1));
  };

  const restoreLives = () => {
    setLives(5);
  };

  return (
    <GamificationContext.Provider value={{ 
      lives, 
      xp: user?.stats?.xp || 0, 
      streak: user?.stats?.streak || 0, 
      completedLessons, 
      unlockedLessons, 
      completeLesson, 
      loseLife, 
      restoreLives, 
      isHydrated 
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
