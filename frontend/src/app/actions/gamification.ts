'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function addXPServer(userId: string, amount: number) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (typeof amount !== 'number' || amount <= 0 || amount > 100) {
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
    
    await userRef.update({
      [`progress.simulator_${bpm}_completed`]: completedLessons,
      [`progress.simulator_${bpm}_unlocked`]: unlockedLessons
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
