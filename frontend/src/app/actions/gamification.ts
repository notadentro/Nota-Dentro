'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function addXPServer(userId: string, amount: number) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (typeof amount !== 'number' || amount <= 0 || amount > 2000) {
    throw new Error('Invalid XP amount');
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    
    // Using FieldValue.increment from the admin SDK to securely add XP
    await userRef.update({
      'stats.xp': FieldValue.increment(amount)
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding XP on server:', error);
    throw new Error('Failed to add XP');
  }
}

export async function addSimulatorXPServer(userId: string, amount: number, bpm: number) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (typeof amount !== 'number' || amount <= 0 || amount > 2000) {
    throw new Error('Invalid XP amount');
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    
    await userRef.update({
      'stats.xp': FieldValue.increment(amount),
      [`stats.simulator_xp_${bpm}`]: FieldValue.increment(amount)
    });

    return { success: true };
  } catch (error) {
    console.error(`Error adding Simulator XP (${bpm} BPM) on server:`, error);
    throw new Error('Failed to add Simulator XP');
  }
}

export async function updateProgressServer(userId: string, completedLessons: string[], unlockedLessons: string[]) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    
    await userRef.update({
      'progress.completedLessons': completedLessons,
      'progress.unlockedLessons': unlockedLessons
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating progress on server:', error);
    throw new Error('Failed to update progress');
  }
}

export async function updateSimulatorProgressServer(userId: string, bpm: number, completedLessons: string[], unlockedLessons: string[]) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    
    const maxCompleted = completedLessons.length > 0 
      ? Math.max(...completedLessons.map(l => parseInt(l))) 
      : 0;

    await userRef.update({
      [`progress.simulator_${bpm}_completed`]: completedLessons,
      [`progress.simulator_${bpm}_unlocked`]: unlockedLessons,
      [`stats.simulator_level_${bpm}`]: maxCompleted
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating simulator progress on server:', error);
    throw new Error('Failed to update simulator progress');
  }
}

export async function updateLivesServer(userId: string, amount: number) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      'stats.lives': FieldValue.increment(amount)
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating lives on server:', error);
    throw new Error('Failed to update lives');
  }
}

export async function updateCacheServer(userId: string, amount: number) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      'stats.cache': FieldValue.increment(amount)
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating cache on server:', error);
    throw new Error('Failed to update cache');
  }
}

export async function getSimulatorRankingServer(bpm: number, limitCount: number = 50) {
  try {
    const usersRef = adminDb.collection('users');
    // Order by simulator_xp_${bpm} descending
    const snapshot = await usersRef
      .orderBy(`stats.simulator_xp_${bpm}`, 'desc')
      .limit(limitCount)
      .get();
      
    const ranking = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.displayName || 'Jogador',
        username: data.username || 'unknown',
        photoURL: data.photoURL || `https://picsum.photos/seed/${doc.id}/200`,
        xp: data.stats?.[`simulator_xp_${bpm}`] || 0,
        level: data.stats?.[`simulator_level_${bpm}`] || 0,
      };
    });
    
    return ranking;
  } catch (error) {
    console.error(`Error fetching simulator ranking for ${bpm} BPM:`, error);
    throw new Error('Failed to fetch ranking');
  }
}
