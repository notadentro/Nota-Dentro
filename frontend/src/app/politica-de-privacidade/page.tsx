import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata = {
  title: 'Política de Privacidade | Nota Dentro',
  description: 'Política de Privacidade da plataforma Nota Dentro.',
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 selection:bg-primary selection:text-black">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-zinc-900 sticky top-0 z-20 bg-black/90 backdrop-blur">
        <Link href="/" className="flex items-center justify-center">
          <Logo className="h-8 w-auto text-white" />
          <span className="sr-only">Nota Dentro</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Voltar ao Início</Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">Política de Privacidade</h1>
          <p className="text-xl text-zinc-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introdução</h2>
            <p>A privacidade dos nossos usuários é de extrema importância para a Nota Dentro. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Informações que Coletamos</h2>
            <p>Coletamos informações que você nos fornece diretamente, como nome, endereço de e-mail e dados de perfil quando você cria uma conta. Também coletamos dados de uso sobre como você interage com nossas lições e gamificação (ex: pontuação de XP, tempo de estudo).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Como Usamos suas Informações</h2>
            <p className="mb-2">Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços educacionais;</li>
              <li>Personalizar sua experiência de aprendizado;</li>
              <li>Enviar comunicações técnicas, atualizações e alertas de segurança;</li>
              <li>Responder aos seus comentários, perguntas e solicitações.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Compartilhamento de Informações</h2>
            <p>Não vendemos ou alugamos suas informações pessoais para terceiros. Podemos compartilhar informações com prestadores de serviços de confiança que trabalham em nosso nome, sempre sob acordos de confidencialidade rigorosos (ex: provedores de hospedagem, envio de e-mails de recuperação de senha).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados são criptografados em trânsito e em repouso.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Seus Direitos</h2>
            <p>Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Para exercer esses direitos, basta utilizar as opções de gerenciamento de conta na plataforma ou entrar em contato direto com o nosso suporte.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Uso de Cookies</h2>
            <p>Utilizamos cookies estritamente necessários para manter sua sessão ativa (login) e cookies analíticos para entender de forma anônima como as lições são acessadas, ajudando a melhorar nosso conteúdo.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contato</h2>
            <p>Se você tiver alguma dúvida sobre esta Política de Privacidade ou sobre o tratamento dos seus dados, entre em contato pelo e-mail: privacidade@notadentro.com.</p>
          </section>
        </div>
      </main>

      <footer className="w-full py-6 bg-zinc-950 border-t border-zinc-900 mt-auto text-center">
        <span className="text-sm text-zinc-600">© {new Date().getFullYear()} Nota Dentro. Todos os direitos reservados.</span>
      </footer>
    </div>
  );
}
