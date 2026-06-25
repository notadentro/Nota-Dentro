import '@testing-library/jest-dom'

// Mock de variáveis de ambiente para o Firebase não quebrar no ambiente de teste
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "test.firebaseapp.com";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test";
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "test.appspot.com";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456789";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:123:web:123";

// Mock do IntersectionObserver para o Framer Motion não quebrar no JSDOM
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.IntersectionObserver = IntersectionObserverMock as any;
