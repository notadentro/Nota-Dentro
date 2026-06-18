# 📖 Diário de Bordo (Research Log)

Este diário tem como objetivo documentar as decisões arquiteturais, pedagógicas e tecnológicas tomadas no desenvolvimento da plataforma "Nota Dentro", visando fundamentar o futuro projeto de mestrado em Educação Musical / Tecnologia Educacional.

## Metodologia Aplicada

A plataforma transpõe a pedagogia erudita (nível universitário e preparatório militar) para o ambiente gamificado. O objetivo é reduzir a carga cognitiva no aprendizado inicial de percepção musical.

### Decisões de Design Pedagógico

#### 1. Abordagem "Fractal" da Divisão Rítmica

- **Problema:** O ensino tradicional apresenta a divisão proporcional (semibreve, mínima, semínima) em tabelas abstratas e de difícil memorização.
- **Solução (Nota Dentro):** Implementação da `FullPyramidView` e `PyramidDragDropView`. Através da manipulação direta (_Drag and Drop_), o aluno compreende a matemática rítmica de forma cinestésica e visual, observando a árvore genealógica do tempo como um fractal matemático real.
- **Fundamentação Teórica:** Transformar a abstração em uma estrutura manipulável reduz a carga intrínseca e possibilita a experimentação segura (tentativa e erro sem punição imediata severa).

#### 2. Escolha do "Conselho de Professores" (Avatares)

- **Problema:** O estudo teórico focado em editais militares exige um grande domínio de referências cruzadas de autores clássicos que frequentemente possuem linguagens herméticas.
- **Solução:** Camuflagem e "Personificação" dos autores. Os clássicos (Bohdan Med, Maria Luísa de Mattos Priolli, Esther Scliar e Odette Ernest Dias, além do Maestro Mascarenhas) foram integrados na narrativa através de avatares didáticos (Bohdan, Maria Luísa, Ester, Odette e Márcio).
- **Fundamentação Teórica:** Baseado em Fernando Pereira da Silva Sobrinho e Raul D'Avila, que reforçam que a teoria da música (techné) não deve ser desprovida da escuta ativa e da emoção/sensibilidade.

## Próximos Passos (Coleta de Dados)

- [ ] Conduzir testes beta fechados (Alpha Testing) do Módulo 1 com 5-10 estudantes reais (foco em aspirantes a concursos militares).
- [ ] Aplicar questionário qualitativo avaliando: (a) retenção de conceitos matemáticos do ritmo, (b) engajamento com a narrativa.

AULA 5: Anatomia da Semínima e Leitura Rítmica (com foco em concursos)

Objetivo: Este PR introduz a Aula 5 do Módulo 1, focada na anatomia estrutural da Semínima e na importância pedagógica do silêncio (pausa). Para consolidar o aprendizado (focado em carreiras militares e THE), criamos dois novos motores gamificados de percepção rítmica (PulsationView e RhythmicReadingView) com latência zero e design iterativo responsivo.

✨ O que foi implementado:

1. Conteúdo Teórico & Pedagógico

Lições interativas sobre a anatomia da Semínima e o debate sobre "Valores Negativos" vs. "Silêncio Estrutural".
Uso de componentes de exibição visual com os SVG oficiais (seminima.svg e pausa-seminima.svg). 2. Motor de Pulsação Básica (PulsationView)

Motor de batida (Tap) para testar a constância de pulso.
Sincronia de Hardware: O loop do requestAnimationFrame foi atrelado ao AudioContext.currentTime para 0ms de drift visual/sonoro.
Correções de UX: Correção de vazamento de memória e stale closures, reaproveitando uma única instância do AudioContext para eliminar todo o input lag. 3. NOVO Motor de Leitura Rítmica (RhythmicReadingView)

Novo mini-game inspirado em mecânicas side-scrolling de leitura rítmica clássica (ex: Pozzoli).
Cursor Dinâmico (Playhead): Um cursor dourado que se move suavemente de forma progressiva pela pauta estática, guiado diretamente pelo tempo absoluto de áudio.
Micro-Interação (Bounce): A figura (nota ou pausa) cresce na tela exata na fração de segundo em que deve ser tocada.
Lógica de Penalidade do Silêncio: O algoritmo penaliza ativamente ("Aí é silêncio!") o aluno que ceder ao impulso de realizar o Tap durante a janela de uma Pausa de Semínima. 4. Otimizações Visuais e de Áudio Gerais

Sound Design: Criação de osciladores nativos em Web Audio API simulando som percussivo (Woodblock/Tom) com variação de frequência entre tempo forte (1200Hz/800Hz) e o feedback interativo do usuário (400Hz).
Acessibilidade de Interface: Ocultação responsiva da dica "(Espaço)" no teclado nativo exclusivamente para dispositivos Mobile, garantindo fluidez e espaço na tela.
Telas de Resumo: Sobreposições translúcidas (backdrop-blur) ao finalizar a lição, com botões bem posicionados para "Jogar Novamente" ou "Tentar Novamente", baseados no escore mínimo de aprovação (70%).
🧠 Impacto de Aprendizado: Ao fechar esta aula, a plataforma "Nota Dentro" garante que o candidato não apenas mantenha uma pulsação robótica, mas que também adquira o nível exigido de Leitura Rítmica à primeira vista, interiorizando ativamente as pausas, o que é um diferencial absoluto em bancas de exames.

🔗 Issues Relacionadas:

Fecha a task de implementação completa e prática da Aula 5.
