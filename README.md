# Nota Dentro - Plataforma de Ensino Musical

Uma plataforma gamificada para aprendizado de teoria musical baseada no livro "Elementos de Teoria Musical" de Esther Scliar.

## 🚀 Configuração Inicial

### 1. Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `studio-2351776517-dea39`
3. Vá em **Configurações do Projeto** > **Geral** > **Seus apps**
4. Copie as configurações da Web App

### 2. Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Preencha o `.env.local` com suas configurações reais do Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-2351776517-dea39.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-2351776517-dea39
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-2351776517-dea39.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   ```

### 3. Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## 📁 Estrutura do Projeto

- `src/app/` - Páginas Next.js App Router
- `src/components/` - Componentes reutilizáveis
- `src/modules/` - Módulos organizados por domínio
- `src/firebase/` - Configuração e hooks do Firebase
- `src/types/` - Definições TypeScript
- `src/constants/` - Constantes da aplicação

## 🎵 Currículo Scliar

O conteúdo é baseado nos 30 capítulos do livro "Elementos de Teoria Musical" de Esther Scliar, organizado em módulos progressivos.

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **Firebase** - Backend e autenticação
- **Tailwind CSS** - Estilização
- **TypeScript** - Tipagem
- **shadcn/ui** - Componentes UI

---

*Desenvolvido com ❤️ para democratizar o acesso à teoria musical*
