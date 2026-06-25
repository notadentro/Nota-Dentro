# Documentação Técnica: Motor de Polirritmia (Nota Dentro)

Este documento descreve o funcionamento interno, arquitetura e lógicas físicas/matemáticas do `PerformanceSimulator`. O objetivo é permitir que engenheiros e desenvolvedores façam a manutenção ou expansão deste sistema no futuro.

---

## 1. Arquitetura do Motor (Engine)

O motor do simulador não utiliza bibliotecas de jogos pesadas (como Phaser ou Three.js). Ele é construído inteiramente com **React + CSS Transforms**, movido a um game loop de alta performance.

- **Game Loop:** A função `tick()` roda recursivamente através de um `requestAnimationFrame`. Isso garante que a verificação de inputs e a renderização das notas aconteçam sincronizadas com a taxa de atualização do monitor (ex: 60fps a 144fps).
- **Relógio de Precisão:** Usamos o `currentTime` da **Web Audio API** (`AudioContext`) para medir o tempo decorrido de forma impecável, evitando os gargalos de performance do `Date.now()` no JavaScript.
- **Áudio Metrônomo:** Os "cliques" preparatórios e de batida são agendados preventivamente via `scheduleClick`, garantindo precisão em nível de milissegundos sem depender da thread principal do JavaScript.

---

## 2. Estrutura de Dados e Compilação Rítmica

A "partitura" fornecida nas lições (`levels.ts`) consiste em arrays de strings simples chamados `RhythmCell` (ex: `['seminima', 'duas_colcheias']`).
Para que o motor entenda quando o usuário deve apertar o botão, o motor realiza um "Flattening" via `flattenSequence()`.

### A conversão (Flattening)
A função `flattenSequence` lê o array e converte cada célula em um ou múltiplos `TapEvent`. 
Um `TapEvent` possui:
- `beatAbsolute`: O "instante" na linha do tempo onde a nota ocorre (Ex: beat 0, beat 1.5, etc.).
- `duration`: A duração física da nota em batidas.
- `type`: 'note' ou 'rest' (notas vs pausas).
- `isHeld`: Um booleano reativo para notas longas.
- `result` e `releaseResult`: O diagnóstico de precisão ('perfect', 'early', 'late', 'missed', 'penalty', 'tied').

### Modo Single-Track vs Double-Track (Polirritmia)
O motor adapta a gameplay com base nos dados.
- Se a lição informar `lowerVoice: []` (vazio), a pauta é centralizada e o jogador pode usar tanto `F` quanto `J` para as notas.
- Se houver `lowerVoice`, a tela se divide: `F` controla a pauta de cima, `J` controla a pauta de baixo.

### Regras de Ouro para a Escrita de Fases (Level Design)
- **Proibido "Vazar" o Compasso:** Figuras musicais não podem ultrapassar a duração física de sua fórmula de compasso (ex: uma `semibreve` de 4 tempos quebra o layout de um compasso `2/4`).
- **Usando Ligaduras (`_ligada`) para Ultrapassar a Barra:** Se for necessário que o jogador segure uma nota por 4 tempos em um compasso `2/4`, deve-se escrever `minima_ligada` seguida de `minima`. O motor somará isso silenciosamente, gerando um único arco de duração (Hold) de 4 tempos, mantendo a notação ortodoxa.

---

## 3. Mecânica Físico-Quântica do Jogo

Para que o jogo julgue o clique do jogador, existem lógicas estritas em `handleTap` e `handleRelease`.

### "Latência Humana" e Tolerância
- O botão é avaliado em milissegundos. `beatMs = (60 / bpm) * 1000`.
- Existe uma margem de `TOLERANCE_MS` (atualmente 150ms). Se o jogador apertar a tecla entre `expectedTime - 150ms` e `expectedTime + 150ms`, é considerado um Hit válido.
- O clique é particionado em sub-margens para exibir se foi **Adiantado (Early)**, **Atrasado (Late)** ou **Perfeito**.
- Se o usuário apertar durante uma Pausa (`rest`), recebe a classificação `penalty` e perde uma vida.

### Holds (Notas Longas) e Tolerância de Soltura de 10%
Quando `ev.duration > 1.0` (ex: Mínimas, Semibreves), o usuário precisa manter o botão pressionado (Hold).
- `handleRelease` calcula se a pessoa segurou até o fim.
- **Mecânica Humanizada:** O motor aplica uma "gordurinha" (early tolerance). Um usuário é autorizado a soltar a nota adiantado em `10%` do seu tempo real. Ou seja, em uma semibreve, ele pode soltar um milissegundo antes para respirar e se preparar para a próxima figura sem receber penalidade.
- A fórmula é: `earlyTolerance = TOLERANCE_MS + (ev.duration * beatMs * 0.15)` (tolerância expandida para 15% por conveniência de gameplay).

---

## 4. Renderização e Modificadores Visuais (Ligaduras, Pontos)

O `renderTrack` desenha as notas baseadas em CSS Dinâmico, se aproveitando das variáveis matemáticas calculadas no tick.

### O "Wiggle" e a Barra de Progresso
Durante o Hold de notas longas:
1. A cabeça da figura musical é iluminada (dourada) por inteira e recebe uma animação em CSS chamada `@keyframes wiggle` (vibração na diagonal). Isso permite que o jogador assimile que a tecla está pressionada com sucesso e mova seus olhos para a frente.
2. Simultaneamente, uma barra reta localizada logo abaixo do pentagrama se preenche da esquerda para a direita simulando um *progress bar*, preenchendo 100% de acordo com `ev.duration`.

### Ligaduras (`_ligada`)
A ligadura funde a duração matemática de duas notas.
- No `flattenSequence`, se um token tiver `_ligada`, ele acha o próximo evento `TapEvent` de nota, soma a duração na nota original, e setta o `result` da segunda nota como `'tied'` (amarrado).
- Notas `'tied'` não precisam ser clicadas. O jogador passa reto por elas no seu Hold.
- Visual: Uma tag SVG com Bézier `<path d="M 0 0 Q 20 15 40 0" />` é desenhada conectando as notas.

### Pontos de Aumento (`_pontuada`)
Qualquer figura terminada em `_pontuada` tem sua duração multiplicada +50%.
Ex: `seminima` = 1.0; `seminima_pontuada` = 1.5.

### Alinhamento Visual por Unidade de Tempo (Ponto de Ataque)
Em notação musical a duas vozes, as notas alinham-se horizontalmente pelo seu instante de ataque e não pelo centro de sua largura. Para replicar isso, os wrappers das notas são alinhados à esquerda (`justify-start`), de modo que as "cabeças" caiam verticalmente sobre o mesmo eixo de pixels exatos da pulsação, independentemente se uma mão tem uma figura larga (`minima`) e a outra uma estreita (`colcheia`).

### Hit-Detection com CSS Linear Gradient (Grupos Unificados)
Figuras que compartilham um traste unificado via um único SVG (como `duas_colcheias`) são processadas em bloco.
Para iluminar as cabeças independentemente (ex: usuário acertou apenas o "Impulso", mas não o "Apoio"), o motor sobrepõe uma máscara dinâmica via **CSS Linear Gradients** (`linear-gradient(to right, black 50%, gold 50%)`), permitindo hit-detection visual microscópico em apenas "metade" do elemento DOM.

---

## 5. UI Periférica: Grade e Fórmula de Compasso

Para parecer uma partitura fluida, criamos um background estético para o nível:
- **Fórmula de Compasso:** Lida diretamente no state `levelDef.timeSignature`. As "Frações" de tempo (ex: 4 e 4) são renderizadas com coordenada rígida `left: -0.8 beat`, colando-se no início absoluto da pista.
- **Grades Rítmicas (Compassos):** Uma linha de grade grossa `border-l-4` é desenhada a cada início de compasso usando o resto da divisão (`beatIndex % timeSignature[0] === 0`).
- **Barra Dupla (Fim):** Quando as notas acabam, uma barra dupla (uma linha fina + uma grossa) trava a extremidade da partitura (`left: totalBeats`). Essa demarcação respeita o tamanho computado final do nível.

---

## Próximos Passos (Banco de Dados)
A arquitetura foi mantida limpa para facilitar injeção externa. Em breve, a const `INITIAL_LIVES = 5` passará a consultar um Context API abastecido por Firebase, controlando um painel interativo fora da Engine.
