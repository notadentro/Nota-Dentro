# 🎵 Nota Dentro

O **Nota Dentro** é o _"Duolingo da Teoria Musical"_. Uma plataforma interativa e gamificada focada na preparação de excelência para **Concursos Militares** (ESA, EAGS, Fuzileiros Navais) e **THE** (Teste de Habilidade Específica das Universidades).

Abandonamos a leitura densa e massante dos livros teóricos tradicionais e transformamos o aprendizado de música em uma jornada interativa: com níveis, pontos de experiência (XP), ofensivas e vidas, estimulando a constância e o aprendizado ativo.

---

## 📚 A "Sagrada Trindade" Metodológica

Nossa base curricular não é genérica. O projeto mapeia e transforma em micro-aulas os **três autores mais cobrados** pelas maiores bancas militares e universitárias do Brasil:

1. **Esther Scliar** - Rigor analítico e estrutural profundo (Elementos de Teoria Musical).
2. **Bohumil Med** - A base contemporânea, ditados e exercícios (Teoria da Música).
3. **Maria Luiza de Mattos Priolli** - Fundamentos clássicos e tradição de leitura (Princípios Básicos da Música para a Juventude).

Com essa base, abrangemos desde Acordes, Escalas e Intervalos até Ornamentos e Modulação, tudo mastigado através de quizzes dinâmicos.

---

## 🛠️ Stack Tecnológico & Arquitetura

Nós construímos o Nota Dentro visando performance, estética imersiva e escalabilidade:

### Frontend

- **Next.js 15 (App Router) & React 18**: Motor principal da aplicação web.
- **Tailwind CSS & shadcn/ui**: Estilização robusta e componentes modernos. O visual prioriza _Dark Mode_, _glassmorphism_ e micro-animações fluidas (utilizando `framer-motion`) para entregar uma UX "premium".
- **TypeScript**: Tipagem forte para garantir integridade do código.

### Backend / Infraestrutura (Firebase)

A plataforma gerencia a progressão via nuvem (BaaS), de maneira isolada e segura, utilizando o ecossistema Google:

- **Firebase Authentication**: Login social seguro com Google (OAuth) e Email/Senha.
- **Firestore Database**: Banco de dados NoSQL que armazena os esquemas de perfil (`stats: xp, level, streak`) e salva em tempo real as vitórias de `progress` do aluno.
- **Security Rules**: Toda transação de dados é bloqueada e checada no servidor. O usuário só consegue ler e editar o _seu próprio progresso_ (`request.auth.uid == userId`).

_(Nota: a aplicação é formatada utilizando o padrão de **npm Workspaces**, organizando a `frontend` como workspace principal, mas preparado para escalabilidade com microserviços futuros)._

---

## 🚀 Como Rodar o Projeto Localmente

É incrivelmente rápido subir a plataforma na sua máquina.

### 1. Requisitos

- Node.js (versão 18+ recomendada)
- Git

### 2. Instalação

Na **raiz do projeto**, execute o comando abaixo para que o npm instale todas as dependências de todos os workspaces automaticamente:

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

### 4. Executar o Servidor de Desenvolvimento

Basta rodar o comando abaixo na pasta raiz:

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
