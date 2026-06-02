import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';

export const metadata = {
  title: 'Termos de Uso | Nota Dentro',
  description: 'Termos de Uso da plataforma Nota Dentro.',
};

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 selection:bg-primary selection:text-black">
      <PublicHeader />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 max-w-3xl">
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">Termos de Uso</h1>
          <p className="text-xl text-zinc-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <p>Ao acessar e usar a plataforma Nota Dentro, você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossa plataforma.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Descrição do Serviço</h2>
            <p>A Nota Dentro é uma plataforma interativa de ensino musical, focada na preparação para Testes de Habilidade Específica (THE), concursos militares e estudos livres. Disponibilizamos lições teóricas, exercícios gamificados e acompanhamento de progresso.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cadastro e Conta de Usuário</h2>
            <p>Para acessar determinadas funcionalidades, você precisará criar uma conta. Você é responsável por manter a confidencialidade das informações da sua conta e senha, bem como por todas as atividades que ocorrerem sob sua conta.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Uso Aceitável</h2>
            <p>Você concorda em usar a plataforma apenas para fins legais e de forma que não infrinja os direitos de, restrinja ou iniba o uso e o aproveitamento da plataforma por qualquer terceiro.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Propriedade Intelectual</h2>
            <p>Todo o conteúdo presente na plataforma (textos, gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados) é propriedade da Nota Dentro ou de seus fornecedores de conteúdo e é protegido pelas leis de direitos autorais.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Modificações dos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações entrarão em vigor imediatamente após a publicação na plataforma. O uso contínuo da plataforma após tais publicações constituirá sua aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Contato</h2>
            <p>Para dúvidas sobre estes Termos de Uso, entre em contato através do e-mail: contato@notadentro.com.</p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
