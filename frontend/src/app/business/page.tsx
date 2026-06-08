"use client";

import React from "react";
import { Download, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BusinessPlanPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-6 print:px-0">
        
        {/* Header - Hidden on print */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold tracking-wider uppercase text-sm">Documento Estratégico</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Plano de Negócios</h1>
            <p className="text-slate-500 mt-1">Nota Dentro - Plataforma Gamificada de Ensino Musical</p>
          </div>
          <Button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 print:shadow-none print:border-none print:p-0">
          <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-indigo-600 prose-li:marker:text-indigo-500">
            
            <div className="text-center mb-12 hidden print:block">
              <h1 className="text-4xl font-bold mb-2">Plano de Negócios: Nota Dentro</h1>
              <p className="text-xl text-slate-600">Mapeamento de Receitas e Plano de Ação Estratégico</p>
            </div>

            <h2>Visão Geral do Ecossistema</h2>
            <p>
              O <strong>Nota Dentro</strong> atua na intersecção entre o rigor acadêmico exigido pelos principais editais (Forças Armadas, THE) e a retenção proporcionada pela gamificação moderna. Nosso diferencial competitivo repousa na curadoria do conteúdo ancorado nos principais teóricos da música.
            </p>

            <hr className="my-8" />

            {/* FRONT 1 */}
            <h3>1. Google Ads (Monetização da Base Gratuita)</h3>
            <p><strong>Aprofundamento:</strong> O modelo <em>Freemium</em> é a porta de entrada. Usuários gratuitos recebem o valor central da plataforma (aprender a teoria), mas "pagam" com sua atenção. Anúncios são exibidos estrategicamente sem quebrar o estado de <em>flow</em> da aprendizagem.</p>
            <h4>Estruturação e Plano de Ação:</h4>
            <ul>
              <li><strong>Passo 1:</strong> Implementar a SDK do Google AdMob / AdSense na plataforma.</li>
              <li><strong>Passo 2:</strong> Mapear os "pontos de frustração e alívio" (ex: após passar de uma lição difícil de compassos compostos, ou ao perder a última vida).</li>
              <li><strong>Passo 3:</strong> Inserir <em>Rewarded Video Ads</em> (Anúncios em vídeo com recompensa) para o usuário ganhar vidas extras gratuitamente assistindo a um vídeo de 30 segundos.</li>
              <li><strong>Passo 4:</strong> Inserir banners não-intrusivos no rodapé do dashboard principal.</li>
            </ul>

            {/* FRONT 2 */}
            <h3>2. Assinatura "Nota Dentro PRO" (Duolingo Super)</h3>
            <p><strong>Aprofundamento:</strong> A evolução natural da assinatura de trilhas. O usuário paga uma mensalidade recorrente não apenas por conteúdo novo, mas por <strong>conveniência</strong>. O alvo principal aqui é o concurseiro militar (ESA, EsPCEx) que não tem tempo a perder com anúncios ou esperando vidas recarregarem.</p>
            <h4>Estruturação e Plano de Ação:</h4>
            <ul>
              <li><strong>Passo 1:</strong> Criar os planos de assinatura (Mensal, Semestral e Anual) integrados a um gateway como Stripe ou Pagar.me.</li>
              <li><strong>Passo 2:</strong> Desenvolver o bloqueador de anúncios (flag <code>isProUser: true</code> na modelagem do usuário).</li>
              <li><strong>Passo 3:</strong> Desenvolver a <strong>"Clínica de Erros"</strong>: uma aba exclusiva Spalla que compila as questões onde o aluno mais errou (focando nos "pegas" teóricos clássicos).</li>
              <li><strong>Passo 4:</strong> Adicionar Vidas Ilimitadas para assinantes PRO.</li>
            </ul>

            {/* FRONT 3 */}
            <h3>3. Compra de Vidas Extras e Cosméticos (Microtransações)</h3>
            <p><strong>Aprofundamento:</strong> Alunos gratuitos frustrados com a perda de vidas e que não querem assinar o plano PRO podem realizar microtransações. Além disso, a venda de itens cosméticos fomenta o desejo de personalização.</p>
            <h4>Estruturação e Plano de Ação:</h4>
            <ul>
              <li><strong>Passo 1:</strong> Criar uma moeda virtual (ex: "Semínimas de Ouro").</li>
              <li><strong>Passo 2:</strong> Cadastrar produtos tangíveis: Apostilas diagramadas de Teoria Musical, Cadernos de Pautas estilizados e Flashcards de Acordes e Intervalos.</li>
              <li><strong>Passo 3:</strong> Permitir o uso das moedas para refilar a barra de vidas instantaneamente.</li>
              <li><strong>Passo 4:</strong> Criar uma "Loja do App" onde a moeda pode comprar temas escuros (Dark Mode), avatares e pacotes de sons de acerto (Piano de Cauda, Violino, etc).</li>
            </ul>

            {/* FRONT 4 */}
            <h3>4. YouTube e Produtos High-Ticket (Mentorias)</h3>
            <p><strong>Aprofundamento:</strong> O app Nota Dentro é excelente para fixação rápida (microlearning). No entanto, temas como <em>Ditado Rítmico a 2 Vozes</em> ou <em>Harmonia Funcional Avançada</em> exigem aulas profundas. O YouTube atua como topo de funil (atrai alunos) e a plataforma direciona para serviços de alto valor agregado.</p>
            <h4>Estruturação e Plano de Ação:</h4>
            <ul>
              <li><strong>Passo 1:</strong> Mapear as 20 dúvidas mais comuns nas provas da ESA/UFRJ.</li>
              <li><strong>Passo 2:</strong> Gravar resoluções em vídeo e postar no YouTube (com CTA para baixar o Nota Dentro).</li>
              <li><strong>Passo 3:</strong> Dentro do Nota Dentro, nas questões difíceis, colocar um botão: <em>"Não entendeu? Assista à resolução no YouTube"</em>.</li>
              <li><strong>Passo 4:</strong> Lançar turmas fechadas de Mentoria (via Zoom) focadas em THE, cobrando um valor premium (High-Ticket), divulgadas tanto no YouTube quanto no app.</li>
            </ul>

            {/* FRONT 5 */}
            <h3>5. Plataforma B2B (SaaS para Escolas e Professores)</h3>
            <p><strong>Aprofundamento:</strong> Professores de música e bandas (militares/civis) carecem de ferramentas para automatizar os testes teóricos. Alugar a <em>engine</em> do Nota Dentro em modelo "White-label" ou como ferramenta de sala de aula gera receita recorrente e previsível.</p>
            <h4>Estruturação e Plano de Ação:</h4>
            <ul>
              <li><strong>Passo 1:</strong> Desenvolver um Painel Admin (Dashboard do Professor) onde o professor cadastra seus alunos através de um código de turma.</li>
              <li><strong>Passo 2:</strong> Criar o construtor de questionários, permitindo que o professor crie suas próprias lições ou "clone" lições da base oficial do Nota Dentro.</li>
              <li><strong>Passo 3:</strong> Desenvolver o modelo de cobrança por <strong>"Assentos" (Seats)</strong>: ex: Plano Turma (até 30 alunos), Plano Escola (até 200 alunos).</li>
              <li><strong>Passo 4:</strong> Emitir relatórios de desempenho automáticos, mostrando ao professor quais alunos estão com deficiência em leitura de claves ou divisão rítmica.</li>
            </ul>

            {/* FRONT 6 */}
            <h3>6. Venda de "Packs" de Simulados Direcionados</h3>
            <p><strong>Aprofundamento:</strong> Em vez de pagar uma assinatura recorrente, o candidato pode querer apenas testar seus conhecimentos reta final de um edital específico.</p>
            <h4>Estruturação e Plano de Ação:</h4>
            <ul>
              <li><strong>Passo 1:</strong> Mapear os editais mais procurados (ESA, EsPCEx, Fuzileiros Navais, THE-UFRJ, THE-UNIRIO).</li>
              <li><strong>Passo 2:</strong> Criar bancos de questões (Simulados) que espelhem perfeitamente a divisão da prova (ex: X questões de teoria contemporânea, Y questões de teoria clássica).</li>
              <li><strong>Passo 3:</strong> Vender esses pacotes como um produto de pagamento único na loja do app (ex: Pack ESA 2026 - R$ 39,90).</li>
            </ul>

            {/* FRONT 7 */}
            <h3>7. Programa de Afiliados (Amazon)</h3>
            <p><strong>Aprofundamento:</strong> Os alunos precisarão das referências bibliográficas físicas para estudar. Recomendar os livros dentro da plataforma e lucrar com comissões gera renda passiva sem onerar o aluno.</p>
            <h4>Estruturação e Plano de Ação:</h4>
            <ul>
              <li><strong>Passo 1:</strong> Inscrever-se no Programa de Associados da Amazon.</li>
              <li><strong>Passo 2:</strong> Gerar links rastreáveis para: <em>Teoria da Música</em>, <em>Princípios de Ritmo e Harmonia</em> e <em>Princípios Básicos da Música</em>.</li>
              <li><strong>Passo 3:</strong> Criar uma seção "Biblioteca Recomendada" dentro do app.</li>
              <li><strong>Passo 4:</strong> Nas explicações teóricas do app, adicionar rodapés: <em>"Para aprofundar este tema, consulte os manuais recomendados. (Compre o livro aqui)"</em>.</li>
            </ul>

            <hr className="my-8" />
            <div className="bg-indigo-50 p-6 rounded-lg print:bg-transparent print:p-0 print:border-t print:border-slate-200">
              <h3 className="text-indigo-900 mt-0 print:mt-4">Próxima Fase de Engenharia (Visão Técnica)</h3>
              <p className="mb-0 text-indigo-800 print:text-slate-700">Para suportar este modelo de negócios, o back-end precisará ser refatorado para suportar <strong>Feature Toggling</strong>. Precisaremos injetar variáveis de estado como <code>isPremium</code> em toda a árvore de componentes React, preferencialmente utilizando um Provider Global (Zustand ou Context API), garantindo que as regras de negócio de monetização sejam aplicadas sem quebrar a fluidez (UX) das lições gamificadas.</p>
            </div>

          </article>
        </div>
        
        {/* Print specific CSS helper */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body { background: white !important; }
            @page { margin: 2cm; }
          }
        `}} />
      </div>
    </div>
  );
}
