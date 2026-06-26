/**
 * Rotas que são públicas e acessíveis sem necessidade de autenticação.
 */
export const publicRoutes = [
  '/',
  '/ritmo-insano', // A landing page do jogo
  '/auth/finish-signup',
  '/politica-de-privacidade',
  '/termos-de-uso',
];

/**
 * Rotas destinadas exclusivamente a autenticação (login, cadastro).
 * Usuários já logados que tentarem acessar estas rotas serão redirecionados
 * para a rota padrão de fallback (DEFAULT_LOGIN_REDIRECT).
 */
export const authRoutes = [
  '/auth/login',
  '/auth/signup',
];

/**
 * Prefixo para rotas de API relacionadas à autenticação.
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Rota padrão para onde o usuário será redirecionado após o login (se não houver um ?redirect).
 */
export const DEFAULT_LOGIN_REDIRECT = '/dashboard';
