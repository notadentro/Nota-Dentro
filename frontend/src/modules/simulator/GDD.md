# 🎹 Documento de Game Design (GDD) - Plataforma "Nota Dentro"

Este documento descreve as mecânicas centrais, arquitetura de níveis e regras de progressão do Simulador Rítmico "Nota Dentro", focado na pedagogia Gramani para candidatos de provas militares e vestibulares de música (THE).

---

## 1. Visão Geral do Jogo
O Simulador é um **treinador cognitivo polirrítmico**. O jogador deve ler partituras simplificadas rolando horizontalmente na tela e executar os ritmos pressionando botões no exato momento em que as figuras cruzam o centro da tela. 

A grande inovação pedagógica é a **execução a duas vozes (polirritmia)**.
- **Mão Esquerda (Tecla F):** Executa a "Voz Superior" da pauta (quando o nível for a 2 vozes) ou a voz única.
- **Mão Direita (Tecla J):** Executa a "Voz Inferior" da pauta.

---

## 2. Mecânicas Centrais

### 2.1. O "Hit" (Acerto Perfeito vs Erro)
- O motor de áudio e visualização rola continuamente a uma velocidade determinada pelo **BPM (Batimentos Por Minuto)** escolhido (Fácil 60, Médio 70, Insano 90).
- Avaliação cirúrgica: Perfect, Early, Late, e Miss. Falhar esgota as tentativas ("retries") locais da fase. Se esgotadas, ocorre o "Game Over", perdendo-se 1 Vida Global.
- Precisão acima de 80% é necessária para concluir a fase. Precisões de 98% ou mais concedem **+1 Cachê Bônus**.

### 2.2. Notas Longas (Mínimas, Semibreves, Ligaduras e Pontos)
Para ensinar a **duração exata do som**, o jogador não deve apenas "bater", mas **segurar a tecla (Hold)**.
- Quando a nota atinge o cursor central, o usuário pressiona e segura o botão. Uma barra de progresso enche visualmente.
- O motor suporta `minima_ligada` e notas pontuadas (`minima_pontuada`). Uma ligadura não precisa de duplo clique, apenas sustentar o "Hold" pela soma matemática das figuras envolvidas.

---

## 3. Estrutura Curricular: Os 7 Mundos
As fases do jogo não são aleatórias. Elas são compostas por 70 fases curadas (divididas em 7 mundos com 10 fases cada), simulando lições de um livro de teoria musical progressivo:

- **Mundo 1: O Todo e as Metades** (Semibreves e Mínimas. Foco em sustentação).
- **Mundo 2: O Despertar da Semínima** (Tempos inteiros, ostinato de pulso e independência).
- **Mundo 3: O Domínio do Silêncio e o Contratempo** (Pausas e penalidade do silêncio).
- **Mundo 4: O Despertar das Colcheias** (Subdivisões binárias e velocidade motora).
- **Mundo 5: O Balanço Brasileiro** (Síncopes de colcheia-semínima-colcheia, ginga).
- **Mundo 6: Os Divertimentos** (Semicolcheias e desafios rápidos).
- **Mundo 7: A Extensão do Som** (Ligaduras e Pontos de Aumento - O verdadeiro THE).

### Modo Treino (Retry-Free)
Ao conquistar um nível, o jogador pode acessá-lo futuramente sem risco de perder "Vidas". Fases já completadas ativam o Modo Treino, permitindo que alunos foquem em atingir o limite dos 98% sem penalidades severas caso errem.

---

## 4. Retenção, Vidas e Banco de Dados (Integração Firebase)
- **Sistema de Vidas:** O usuário inicia com 3 a 5 vidas. Falhar em uma fase não concluída consome uma Vida.
- **Monetização:** Vidas podem ser restauradas usando moedas _in-game_ ("Cachês"), que o aluno ganha com precisão cirúrgica ou através da loja online.
- **Progresso Salvo:** O nível mais alto desbloqueado é registrado na nuvem (Firestore), segmentado por **Dificuldade (BPM)**. A URL da fase é protegida: o jogador não pode avançar modificando o número do nível manualmente.

---

## 5. Instruções In-Game para o Jogador
Estas são as instruções que aparecerão num modal tutorial:

> **Bem-vindo(a) ao Treinamento Cognitivo Nota Dentro!**
> 
> 1. **Duas Mãos, Duas Vozes:** Prepare sua Mão Esquerda sobre a tecla **F** e sua Mão Direita sobre a tecla **J**. 
> 2. **Siga a Pista:** As figuras musicais deslizarão em sua direção. Aperte os botões no momento exato.
> 3. **Segure o Som!** Figuras longas (Mínimas, Semibreves, notas com ligaduras) exigem que você **SEGURE** o botão pressionado. Você verá a nota vibrar. Só solte quando o tempo dela terminar!
> 
> Concentre-se, mantenha o pulso interno e bons estudos!
