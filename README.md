# 🎵 Nota Dentro

O **Nota Dentro** é o _"Duolingo da Teoria Musical"_. Uma plataforma interativa e gamificada focada na preparação de excelência para **Concursos Militares** (ESA, EAGS, Fuzileiros Navais) e **THE** (Teste de Habilidade Específica das Universidades).

Abandonamos a leitura densa e massante dos livros teóricos tradicionais e transformamos o aprendizado de música em uma jornada interativa: com níveis, pontos de experiência (XP), ofensivas e vidas, estimulando a constância e o aprendizado ativo.

---

## 📚 A "Sagrada Trindade" Metodológica

Nossa base curricular não é genérica. O projeto mapeia e transforma em micro-aulas os **três autores mais cobrados** pelas maiores bancas militares e universitárias do Brasil:

1. **Teoria Clássica** - Rigor analítico e estrutural profundo.
2. **Teoria Contemporânea** - A base contemporânea, ditados e exercícios.
3. **Fundamentos Musicais** - Fundamentos clássicos e tradição de leitura.

Com essa base, abrangemos desde Acordes, Escalas e Intervalos até Ornamentos e Modulação, tudo mastigado através de quizzes dinâmicos.

---

## 🌟 Funcionalidades Core

A plataforma evoluiu para se tornar um verdadeiro CMS (Content Management System) educacional:

- **Dashboard & Trilhas:** Mapeamento visual das aulas e módulos com layout em SVG (pautas musicais interativas).
- **Gamificação em Tempo Real (Lesson Engine):** Sistema de vidas, ganho de XP e recompensas baseados em acertos.
- **Minigames Interativos:** Para não ficar preso a múltipla-escolha, implementamos desafios práticos nativos:
  - Jogo da Memória (Flip Cards em 3D)
  - Ligar Colunas (Match interativo com glow e validação)
  - Preencher Lacunas (Botões drag/click nativos no texto)
- **Painel de Criação (Admin Builder):** Interface visual focada na experiência do professor para criar blocos dinâmicos de desafios sem precisar escrever código.
- **Blog & Engajamento:** Sistema de Artigos completo, com seção "Sobre a Autora" e fórum de comentários nativo com threads (respostas).

---

## 🛠️ Stack Tecnológico & Arquitetura

Nós construímos o Nota Dentro visando performance, estética imersiva e escalabilidade:

### Frontend
- **Next.js 15 (App Router) & React 18**: Motor principal da aplicação web.
- **Tailwind CSS & shadcn/ui**: Estilização robusta e componentes modernos. O visual prioriza _Dark Mode_, _glassmorphism_ e micro-animações fluidas (utilizando `framer-motion`) para entregar uma UX "premium".
- **TypeScript**: Tipagem forte para garantir integridade do código.

### Backend & Arquitetura de Dados
A plataforma utiliza um modelo híbrido moderno, combinando BaaS para escalabilidade e Flat-Files para o núcleo educacional:

- **Git-Backed Content (JSON):** Todos os módulos educacionais (Aulas, Quizzes) e os Artigos do Blog são salvos nativamente em arquivos `.json` locais (`src/content/lessons` e `src/content/blog`). O motor da plataforma une esses arquivos dinamicamente, permitindo versionamento Git perfeito e dispensando a necessidade de gerenciar bancos de dados pesados para o conteúdo.
- **Firebase Authentication**: Login social seguro com Google (OAuth) e Email/Senha.
- **Firestore Database**: Banco de dados NoSQL focado apenas na persistência do estado global do aluno (armazenando progresso, XP, vidas, comentários no blog).

---

## 🚀 Como Rodar o Projeto Localmente

É incrivelmente rápido subir a plataforma na sua máquina.

### 1. Requisitos
- Node.js (versão 18+ recomendada)
- Git

### 2. Instalação
Na **raiz do projeto**, execute o comando abaixo para instalar as dependências de todos os workspaces (usamos npm workspaces configurado para o frontend):

```bash
npm install
```

### 3. Variáveis de Ambiente
Crie um arquivo `.env.local` dentro da pasta `frontend/` com as suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="SuaChaveAqui"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

### 4. Gestão de Conteúdo (Uso da Plataforma)
- O acesso como aluno pode ser feito através de `/dashboard`.
- Para **Criar Novas Lições** e testar o CMS, acesse `/admin/lessons/create`. Ao preencher o formulário, o sistema de arquivos local criará o novo `.json` do seu curso e ele ficará visível em tempo real no Dashboard (na aba "Cursos Livres").

### 5. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Contribuição & Boas Práticas

Seja bem-vindo a evoluir a plataforma conosco!
Lembre-se sempre das premissas:

1. **Aesthetics First:** Nenhuma nova tela deve parecer um formulário burocrático. Use gradientes, animações sutis e seja visual.
2. **Didática Inclusiva:** Todo texto deve encorajar o aluno, mesmo no erro.
3. **Segurança:** Nunca acesse o Firestore no cliente sem passar pelas verificações de `uid` e Regras de Segurança.

---

_Desenvolvido com ❤️ para democratizar o acesso à teoria musical_
