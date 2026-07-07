import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from './routes';

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  
  // Verifica se o usuário tem o nosso cookie de sessão customizado
  const isLoggedIn = request.cookies.has('user_session');

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // 1. Não interferimos em rotas de API
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Se a rota for de Login/Signup e o usuário já estiver logado
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redireciona o usuário para longe da tela de login se já estiver autenticado
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // Caso contrário, deixa ele acessar o Login/Signup
    return NextResponse.next();
  }

  // 3. Se a rota não for pública e o usuário não estiver logado
  if (!isLoggedIn && !isPublicRoute) {
    // Redirecionamos para a tela de login, mas guardamos de onde ele veio no parâmetro redirect
    const redirectUrl = new URL('/auth/login', nextUrl);
    redirectUrl.searchParams.set('redirect', nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Qualquer outro caso (rota pública ou usuário logado na rota privada) passa direto
  return NextResponse.next();
}

// Configura o Next.js para só rodar o middleware nas páginas principais.
// Ignoramos os assets estáticos (_next, imagens, favicon, etc).
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|logo.*\\.).*)'],
};
