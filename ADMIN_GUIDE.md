# 🛠️ Manual de Criação de Aulas (Lesson Engine)

Este documento orienta como estruturar novas aulas no sistema do **Nota Dentro**. Nossa arquitetura utiliza arquivos `.json` locais na pasta `src/content/lessons/` para renderizar o conteúdo dinamicamente.

## 📂 Estrutura de uma Aula
Cada aula é composta por um array de `steps` (passos). Um passo pode ser um bloco de teoria (`theory`) ou um desafio interativo (`quiz`, `drag_drop_pizza`, etc.).

### 1. Criando um Bloco de Teoria
Use o tipo `theory` para as falas dos professores.
```json
{
  "id": "tb-1",
  "type": "theory",
  "title": "Título do Bloco",
  "avatar": "ester", 
  "data": {
    "content": "A regra de ouro da matemática musical...",
    "image_url": "/assets/svg/exemplo.svg"
  }
}
```

### 2. Criando Desafios
Todo desafio deve ter uma recompensa em XP e um feedback claro para o acerto/erro. Exemplo de desafio interativo de Pirâmide:
```json
{
  "id": "ch-1",
  "type": "drag_drop_pyramid",
  "title": "Construindo a Pirâmide",
  "avatar": "bohdan",
  "data": {
    "question": "Arraste as figuras corretas para completar a 2ª camada...",
    "expectedTarget": { "level_2": ["minima", "minima"] },
    "successMessage": "Brilhante! 1 Semibreve se divide em 2 Mínimas!"
  }
}
```

**Regra de Ouro da Plataforma:** Nunca crie um desafio sobre um conceito visual que ainda não foi apresentado em um bloco de theory com `image_url`.
