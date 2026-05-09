# Nota Dentro - Plataforma de Ensino Musical

Plataforma gamificada para aprendizado de teoria musical, criada para transformar conteúdo teórico em uma experiência interativa e progressiva.

## ✨ Visão geral

O projeto é construído com **Next.js** e oferece:
- dashboard com progresso e conquistas
- navegação por lições e subtemas
- visual gamificado para incentivar o estudo
- integração com Firebase para autenticação e dados

## 🧱 Principais tecnologias

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** + Radix UI
- **Firebase** (autenticação, backend e dados)
- **Lucide React** para ícones
- **Recharts** para gráficos
- **React Hook Form** para formulários

## 📁 Estrutura do projeto

```text
.
├── app/                  # Páginas da aplicação (Next.js App Router)
│   ├── dashboard/        # Dashboard, lições e conquistas
│   ├── profile/          # Páginas de perfil de usuário
│   └── page.tsx          # Página inicial pública
├── components/           # Componentes reutilizáveis
│   ├── ui/               # Wrappers de componentes shadcn/ui
│   ├── dashboard/        # Componentes específicos do dashboard
│   └── ...
├── contexts/             # Contextos React (ex: UserContext)
├── hooks/                # Hooks personalizados
├── lib/                  # Utilitários e helpers
├── modules/              # Módulos de domínio e páginas de lição
├── types/                # Tipos TypeScript compartilhados
├── public/               # Arquivos estáticos e imagens
├── config/               # Configurações de lint e build
└── package.json          # Scripts, dependências e metas do projeto
```

### Pastas principais

- `src/app/` - estrutura de páginas e layouts da aplicação
- `src/components/` - blocos de interface reutilizáveis
- `src/components/ui/` - componentes do sistema de design
- `src/contexts/` - provedor de usuário e contexto global
- `src/hooks/` - hooks de comportamento customizado
- `src/modules/` - funcionalidades de domínio
- `src/types/` - definições de tipos TypeScript
- `src/lib/` - utilitários, helpers e funções auxiliares

## ⚙️ Configuração local

### 1. Clonar o repositório

```bash
git clone <repo-url>
cd plataform
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com as credenciais do Firebase e outras chaves necessárias. Exemplo:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Iniciar a aplicação

```bash
npm run dev
```

Abra o navegador em `http://localhost:9002`.

## 🚀 Scripts úteis

- `npm run dev` - iniciar servidor de desenvolvimento em `9002`
- `npm run build` - gerar build de produção
- `npm start` - iniciar app em modo produção
- `npm run lint` - rodar eslint
- `npm run typecheck` - validação de tipos TypeScript
- `npm run genkit:dev` - iniciar GenKit para desenvolvimento de IA
- `npm run genkit:watch` - iniciar GenKit em modo watch

## 🧩 Fluxo principal do projeto

- `src/app/dashboard/page.tsx` - painel principal do usuário
- `src/app/dashboard/licoes/page.tsx` - lista de lições
- `src/app/dashboard/licoes/[lessonId]/page.tsx` - visualização da lição e navegação por subtópicos
- `src/app/dashboard/conquistas/page.tsx` - tela de conquistas
- `src/app/profile/[userId]/page.tsx` - perfil do usuário

## 💡 Observações

- A aplicação usa **Next.js App Router**, então grande parte da renderização acontece no cliente dentro de componentes `use client`.
- Vários componentes usam o sistema de UI `shadcn/ui`, com base em Radix e Tailwind.
- Para o fluxo de lições, a estrutura de dados pode ser substituída por uma fonte de backend real no futuro.

## ❤️ Sobre

Projeto desenvolvido para tornar o estudo da teoria musical mais acessível e envolvente, com foco em progresso, recompensas e experiência interativa.

