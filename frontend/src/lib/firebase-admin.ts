import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn("⚠️ Firebase Admin: FIREBASE_PROJECT_ID is missing. Running in mock mode to avoid compilation crash.");
    }
  } catch (error: any) {
    console.log('Firebase admin initialization error', error.stack);
  }
}

// Provide a mock to prevent Next.js from crashing when compiling server actions
export const adminDb = admin.apps.length > 0 ? admin.firestore() : {
  collection: () => ({
    doc: () => ({
      set: async () => {},
      update: async () => {},
      get: async () => ({ exists: false, data: () => ({}) }),
    })
  })
} as any;

export const adminAuth = admin.apps.length > 0 ? admin.auth() : {} as any;
