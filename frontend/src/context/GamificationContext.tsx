'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  isHydrated: boolean; // Tells us if the state has loaded from LocalStorage
}

// Starting state for a brand new user
const defaultState: GamificationState = {
  lives: 5,
  xp: 0,
  streak: 0,
  completedLessons: [],
  unlockedLessons: ['1'], // '1' is always unlocked initially
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notaDentroGamification');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // We merge with default state to prevent missing keys if we add new features later
        setState(prev => {
          const merged = { ...prev, ...parsed };
          // Garantir que a Lição 1 ('1') sempre esteja destravada, mesmo se o cache local tiver dados antigos ('l1')
          if (!merged.unlockedLessons.includes('1')) {
            merged.unlockedLessons = ['1']; // Reseta a trava se estiver com dados velhos
            merged.completedLessons = [];
          }
          return merged;
        });
      } catch (e) {
        console.error("Failed to parse gamification state");
      }
    }
    setIsHydrated(true);
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('notaDentroGamification', JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const completeLesson = (lessonId: string, nextLessonId?: string, xpReward = 50) => {
    setState((prev) => {
      // If already completed, just return
      if (prev.completedLessons.includes(lessonId)) return prev;

      const newCompleted = [...prev.completedLessons, lessonId];
      const newUnlocked = [...prev.unlockedLessons];
      
      // Unlock the next lesson in the trail
      if (nextLessonId && !newUnlocked.includes(nextLessonId)) {
        newUnlocked.push(nextLessonId);
      }

      return {
        ...prev,
        xp: prev.xp + xpReward,
        completedLessons: newCompleted,
        unlockedLessons: newUnlocked,
      };
    });
  };

  const loseLife = () => {
    setState((prev) => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1)
    }));
  };

  return (
    <GamificationContext.Provider value={{ ...state, completeLesson, loseLife, isHydrated }}>
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
