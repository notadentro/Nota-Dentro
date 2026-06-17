# 📖 Diário de Bordo (Research Log)

Este diário tem como objetivo documentar as decisões arquiteturais, pedagógicas e tecnológicas tomadas no desenvolvimento da plataforma "Nota Dentro", visando fundamentar o futuro projeto de mestrado em Educação Musical / Tecnologia Educacional.

## Metodologia Aplicada
A plataforma transpõe a pedagogia erudita (nível universitário e preparatório militar) para o ambiente gamificado. O objetivo é reduzir a carga cognitiva no aprendizado inicial de percepção musical.

### Decisões de Design Pedagógico

#### 1. Abordagem "Fractal" da Divisão Rítmica
*   **Problema:** O ensino tradicional apresenta a divisão proporcional (semibreve, mínima, semínima) em tabelas abstratas e de difícil memorização.
*   **Solução (Nota Dentro):** Implementação da `FullPyramidView` e `PyramidDragDropView`. Através da manipulação direta (*Drag and Drop*), o aluno compreende a matemática rítmica de forma cinestésica e visual, observando a árvore genealógica do tempo como um fractal matemático real.
*   **Fundamentação Teórica:** Transformar a abstração em uma estrutura manipulável reduz a carga intrínseca e possibilita a experimentação segura (tentativa e erro sem punição imediata severa).

#### 2. Escolha do "Conselho de Professores" (Avatares)
*   **Problema:** O estudo teórico focado em editais militares exige um grande domínio de referências cruzadas de autores clássicos que frequentemente possuem linguagens herméticas.
*   **Solução:** Camuflagem e "Personificação" dos autores. Os clássicos (Bohdan Med, Maria Luísa de Mattos Priolli, Esther Scliar e Odette Ernest Dias, além do Maestro Mascarenhas) foram integrados na narrativa através de avatares didáticos (Bohdan, Maria Luísa, Ester, Odette e Márcio).
*   **Fundamentação Teórica:** Baseado em Fernando Pereira da Silva Sobrinho e Raul D'Avila, que reforçam que a teoria da música (techné) não deve ser desprovida da escuta ativa e da emoção/sensibilidade.

## Próximos Passos (Coleta de Dados)
- [ ] Conduzir testes beta fechados (Alpha Testing) do Módulo 1 com 5-10 estudantes reais (foco em aspirantes a concursos militares).
- [ ] Aplicar questionário qualitativo avaliando: (a) retenção de conceitos matemáticos do ritmo, (b) engajamento com a narrativa.
