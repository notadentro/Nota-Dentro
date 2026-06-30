## 🎯 O que foi feito?
Este PR foca em duas grandes frentes para o "Ritmo Insano": a reestruturação arquitetural do `PerformanceSimulator` (eliminando o anti-pattern de *God Object*) e a implementação da persistência de progressão por nível de dificuldade (BPM).

### 🛠️ Refatoração do Motor Rítmico (Performance Simulator)
O componente principal do simulador, que antes possuía quase 1500 linhas, foi totalmente modularizado seguindo as diretrizes de Clean Code. Nenhuma regra de negócio ou precisão de tempo (*timing*) foi quebrada no processo. A nova estrutura ficou dividida em:

- **State & Game Loop:** Lógica central extraída para o custom hook `useSimulatorEngine.ts`, controlando o ciclo de vida, o `requestAnimationFrame` e a detecção de hits.
- **Utilitários Puros:**
  - `engineUtils.ts`: Cálculos de score, precisão e formatação da timeline.
  - `audioUtils.ts`: Injeção de dependência nativa do `AudioContext` para agendamento exato do metrônomo.
  - `renderUtils.tsx`: Estilização dinâmica e posicionamento geométrico das notas (SVG/CSS).
- **Componentes Visuais (Dumb Components):**
  - `SimulatorHUD.tsx`: Cabeçalho (Vidas, Cachê, BPM).
  - `SimulatorTrack.tsx`: Renderização das pistas polirrítmicas e barra de compasso.
  - `SimulatorControls.tsx`: Pads de interação física (J e F).
  - `SimulatorModals.tsx`: Máquina de estados das modais (GameOver, Instrução, Loja, etc).

O arquivo raiz `PerformanceSimulator.tsx` atua agora apenas como um Controller/Orquestrador.

### 🎮 Gamificação e Progressão Isolada
- **Progressão por Dificuldade:** A progressão do jogador agora é salva isoladamente baseada no modo escolhido (Fácil 60 BPM, Médio 70 BPM, Insano 90 BPM). 
- **Nova Action Server-Side:** Adicionado suporte a múltiplos campos como `simulator_60_completed`, `simulator_70_completed` no `updateSimulatorProgressServer`.
- **UI do Ritmo Insano:**
  - Refatoração da tela de entrada do simulador, adicionando um sistema de Abas (Tabs) separando "Modos de Jogo" de "Configurações".
  - O sistema agora persiste o último BPM escolhido localmente via `localStorage` e reflete isso instantaneamente no botão "Continuar Fase".

### 📝 Documentação
- Atualização do `README.md` principal, documentando a nova topologia modular e as características do motor de áudio.

## ✔️ Checklist
- [x] O simulador roda perfeitamente sem gargalos de performance.
- [x] Os eventos de acerto (Perfect, Early, Late, Miss) continuam milimétricos.
- [x] Passar de fase em uma dificuldade não afeta o progresso das outras dificuldades.
- [x] Os layouts estão responsivos e a página inicial do minigame está com a nova UI de Abas.
