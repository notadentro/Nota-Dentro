export interface UserStats {
  xp: number;
  level: number;
  streak: number;
}

export interface UserEconomy {
  lives: number;
  maxLives: number;
  cache: number;
  lastLogin?: string; // ISO string date to track daily login rewards
}

export interface UserOnboardingData {
  goal: string;
  level: string;
  focus?: string;
  instruments?: string[];
}

export interface User {
  uid: string;
  name: string;
  displayName?: string;
  username: string;
  email: string;
  photoURL: string;
  
  // Progression
  stats: UserStats;
  achievements: string[];
  progress?: Record<string, any>;
  
  // Economy & Monetization
  isSpalla?: boolean;
  economy?: UserEconomy;
  role?: 'student' | 'teacher' | 'admin';
  
  // Social & Meta
  instagramProfile?: string;
  linkedInProfile?: string;
  hasCompletedOnboarding?: boolean;
  onboardingData?: UserOnboardingData;
  isAdmin?: boolean;
  createdAt?: string;
}
