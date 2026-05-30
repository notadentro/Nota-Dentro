# Backend - Nota Dentro

Esta pasta é reservada para toda a lógica de servidor e regras de negócio da plataforma. 

## Por que separar `/frontend` e `/backend`?

Como você trabalha com **Front-end** (React, Next.js, UI/UX), a pasta `frontend` contém tudo o que roda diretamente no navegador do usuário (componentes visuais, estado React, Context API).

A pasta `backend` será responsável pelo que o usuário **não pode** manipular, garantindo a segurança do jogo.

### O que entrará aqui na Fase 7 (Integração Firebase)?

1. **Firestore Security Rules (`firestore.rules`):**
   - Regras que impedem um usuário de "hackear" o banco de dados enviando +1000 XP artificialmente.
   - O backend validará se a lição foi realmente feita antes de conceder XP.

2. **Cloud Functions (Node.js):**
   - Funções isoladas que rodam nos servidores do Google.
   - Exemplo: Um *Cron Job* (tarefa agendada) que roda todo dia à meia-noite para **regenerar as vidas (corações)** dos usuários.

3. **Configuração Admin (`firebase-admin`):**
   - Scripts de migração de banco de dados e gerenciamento de usuários de alto nível.

Nesta **Fase 6**, criamos a simulação dessa mecânica localmente no React Context (`frontend/src/context/GamificationContext.tsx`) para podermos testar a UI e as interações. Assim que o fluxo estiver validado visualmente, transportaremos a validação real de dados para esta pasta `/backend`!
