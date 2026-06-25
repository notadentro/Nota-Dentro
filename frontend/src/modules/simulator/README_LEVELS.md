# Documentação para Criação de Fases (Nota Dentro - Polirritmia)

As lições (fases) são cadastradas no arquivo `src/modules/simulator/constants/levels.ts`. Você mesmo pode adicionar, alterar ou reordenar as fases seguindo as regras abaixo.

## 1. Estrutura de uma Fase

Uma fase é um objeto JavaScript do tipo `LevelDefinition`, com a seguinte estrutura:

```typescript
{
  id: 1, // Número único de identificação
  name: "Nome da Lição", 
  timeSignature: [4, 4], // Fórmula de compasso: [Numerador, Denominador]
  upperVoice: ['seminima', 'pausa'], // Ritmos da Pista de Cima (Mão Esquerda / F)
  lowerVoice: [] // Ritmos da Pista de Baixo (Mão Direita / J)
}
```

> **Dica:** Se a `lowerVoice` estiver vazia (`[]`), o jogo entra em **Modo Single-Track (Pista Única)**. A pista será centralizada na tela e o jogador poderá usar tanto a tecla `F` quanto a tecla `J` para tocar a lição (ideal para níveis iniciantes).

---

## 2. Vocabulário Rítmico (Rhythm Cells)

O nosso motor entende as seguintes palavras (tokens) para desenhar as figuras e contar a duração de cada nota no compasso. Em um compasso 4/4, as durações são:

### Notas Longas e Básicas
- `'semibreve'` (Dura 4 tempos)
- `'minima'` (Dura 2 tempos)
- `'seminima'` (Dura 1 tempo)
- `'colcheia'` (Dura 0.5 tempo)

### Pausas
- `'pausa_minima'` (Pausa de 2 tempos)
- `'pausa'` (Pausa de semínima, dura 1 tempo)

### Agrupamentos (Células Combinadas)
- `'duas_colcheias'` (Dura 1 tempo. O motor divide em duas batidas de 0.5)
- `'quatro_semicolcheias'` (Dura 1 tempo. O motor divide em quatro batidas de 0.25)
- `'colcheia_pausa_colcheia'` (Dura 1 tempo. Nota, pausa, nota)
- `'pausa_colcheia_colcheia'` (Dura 1 tempo. Pausa, nota)
- `'colcheia_seminima_colcheia'` (A Síncope clássica de Gramani. Dura 2 tempos: bate 0.5, segura a semínima por 1.0, e bate 0.5 no contratempo)

---

## 3. Pontos de Aumento e Ligaduras (Motor Avançado)

Você pode aplicar modificadores às notas do vocabulário:

### 🔴 Pontos de Aumento (`_pontuada`)
Aumentam a nota em metade do seu valor original. No visual, aparece um ponto dourado ao lado da cabeça da nota.
Tokens suportados:
- `'minima_pontuada'` (Dura 3 tempos)
- `'seminima_pontuada'` (Dura 1.5 tempo)
- `'colcheia_pontuada'` (Dura 0.75 tempo)

### 🔴 Ligaduras de Tempo (`_ligada`)
Uma ligadura soma a duração de uma figura à próxima. 
Como escrever: Basta colocar o sufixo `_ligada` em qualquer célula.
Exemplo prático de uma semínima ligada a outra semínima (o aluno fará um Hold de 2 tempos sem soltar):
```typescript
upperVoice: ['seminima_ligada', 'seminima']
```

> **Atenção nas Ligaduras:** O sufixo `_ligada` sempre indica que **a última nota** daquela célula está ligada à **primeira nota** da próxima célula. 
> Visualmente, o motor desenhará um pequeno "sorriso" (arco) por baixo das notas.
> Para Células Agrupadas: Se você escrever `'duas_colcheias_ligada'`, a SEGUNDA colcheia do grupo ganhará a ligadura com a próxima figura do array.

---

## 4. Regras e Boas Práticas (Rigor Musical)

1. **Matemática do Compasso:** O motor não impede que você coloque 5 tempos num compasso 4/4, pois o visual flui como um pergaminho contínuo. No entanto, para fins didáticos, **some as durações de cabeça** e garanta que sua linha musical feche compassos certinhos para que a "Linha Vertical de Compasso" apareça no momento certo.
2. **Igualdade entre as Mãos:** Em níveis polirrítmicos (onde `lowerVoice` tem itens), a soma total das durações de `upperVoice` **deve ser igual** à soma total das durações de `lowerVoice`. Se uma mão acabar antes da outra, o jogo pode encerrar a fase de forma prematura ou assíncrona.
   > Se precisar que uma mão não faça nada enquanto a outra toca, preencha a diferença com `'pausa'` ou `'pausa_minima'`!

## 5. Exemplo de Fase Completa com Tudo Misturado

Aqui está um compasso 4/4 polirrítmico com ponto de aumento em cima e síncope embaixo:

```typescript
{
  id: 15,
  name: "Desafio Master (Polirritmia + Síncope)",
  timeSignature: [4, 4],
  upperVoice: ['minima_pontuada', 'seminima'], // 3 tempos + 1 tempo = 4 tempos totais
  lowerVoice: ['colcheia_seminima_colcheia', 'duas_colcheias', 'pausa'] // 2 tempos + 1 tempo + 1 tempo = 4 tempos totais
}
```
