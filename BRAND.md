# Nota Dentro — Manual de Identidade Visual

> Versão 1.0 · 2025 · [youtube.com/@notadentro](https://www.youtube.com/@notadentro)

---

## Sumário

1. [A História](#1-a-história)
2. [Essência da Marca](#2-essência-da-marca)
3. [Paleta de Cores](#3-paleta-de-cores)
4. [Tipografia](#4-tipografia)
5. [Logotipo](#5-logotipo)
6. [Tom de Voz](#6-tom-de-voz)
7. [Grid e Espaçamento](#7-grid-e-espaçamento)
8. [Aplicações Digitais](#8-aplicações-digitais)

---

## 1. A História

O Nota Dentro nasceu de uma convicção simples e poderosa: **o acesso ao conhecimento musical não deveria ser privilégio de quem pode pagar por ele.** Com essa missão, o projeto surgiu em 2019 como um canal no YouTube voltado a quem deseja ingressar na carreira de músico militar — um dos caminhos mais concorridos e menos documentados do setor.

### Timeline

| Ano | Marco |
|-----|-------|
| **2019** | Canal criado no YouTube com conteúdo gratuito para preparação em concursos de músico militar. Democratizando uma informação que circulava apenas em círculos fechados. |
| **2020** | A fundadora foi aprovada em **1º lugar** no concurso de Sargento Músico Flautista da ESA (Escola de Sargentos das Armas do Exército Brasileiro). O projeto foi pausado. |
| **2021–2023** | Contaminada pela COVID-19 dentro do serviço militar, desenvolveu sequelas permanentes e tornou-se PCD. Impedida de tocar e de servir, reinventou sua relação com a música e com o projeto. |
| **2024–2025** | Retomou o canal, expandiu os temas, aprendeu programação e começou a desenvolver a plataforma gamificada. A limitação física se tornou motor de uma visão maior. |

### Sobre a fundadora

Bacharela em música (flauta transversal), pós-graduada em musicoterapia, técnica em publicidade e propaganda e desenvolvedora front-end.

**Stack:** React · Next.js · TypeScript · Tailwind CSS · Firebase · Git · Vercel

---

## 2. Essência da Marca

### Propósito

> *"Tornar o aprendizado musical acessível, envolvente e transformador — para qualquer pessoa, em qualquer lugar."*

### Missão

Criar uma plataforma de educação musical gamificada que democratize o acesso ao conhecimento técnico com linguagem acessível, conteúdo de qualidade e tecnologia de ponta.

### Visão

Ser a principal referência em educação musical digital em língua portuguesa, reconhecida pela inclusão, pela qualidade pedagógica e pela experiência envolvente.

### Os Quatro Pilares

| Pilar | Descrição |
|-------|-----------|
| 🎯 **Acessível** | Fala com quem nunca estudou música e com quem já tem bagagem. Sem jargão desnecessário, sem elitismo. |
| 🔥 **Apaixonado** | A marca surgiu de uma escolha de vida. Esse amor pela música está em cada peça de conteúdo produzida. |
| 🎮 **Lúdico** | Gamificação no centro da experiência. Aprender música deve ser tão envolvente quanto um jogo bem feito. |
| 💡 **Rigoroso** | Conteúdo respaldado por formação acadêmica real. Acessível não significa superficial — nunca. |

---

## 3. Paleta de Cores

### Cores Primárias

| Nome | Hex | Uso |
|------|-----|-----|
| **Nota Ouro** | `#C9A811` | Cor primária · Destaque · CTA · Ações |
| **Nota Preto** | `#1A1A1A` | Cor base · Fundo dark · Texto principal |
| **Nota Branco** | `#F8F6F0` | Fundo claro · Espaço negativo |

> ⚠️ **Regra de ouro:** Nunca use `#C9A811` como cor de fundo para textos longos. O Nota Ouro é uma cor de ação e destaque. O texto principal deve sempre estar sobre preto, branco ou cinza neutro.

### Cores Secundárias

| Nome | Hex | Uso |
|------|-----|-----|
| **Ouro Claro** | `#EDD033` | Hover state · Destaque leve |
| **Ouro Escuro** | `#A88A0D` | Active / Pressed state |
| **Grafite** | `#3A3A3A` | Textos secundários · Superfícies |
| **Cinza Médio** | `#6B6B6B` | Legendas · Metadados · Placeholders |
| **Areia** | `#E8E6DF` | Fundos alternativos · Borders suaves |

### Cores de Sistema (plataforma)

| Nome | Hex | Uso |
|------|-----|-----|
| **Sucesso** | `#2D8A5C` | Acerto · Nível completo · Progresso |
| **Erro** | `#C0392B` | Resposta errada · Alerta crítico |
| **Aviso** | `#E67E22` | Atenção · Progresso parcial |
| **Info** | `#5B9BD5` | Dicas · Informações neutras |

### Tokens CSS (copiar para `globals.css`)

```css
:root {
  /* Cores primárias */
  --color-primary:          #C9A811;
  --color-primary-hover:    #A88A0D;
  --color-primary-light:    #EDD033;
  --color-background:       #1A1A1A;
  --color-background-alt:   #2A2A2A;
  --color-surface:          #2A2A2A;
  --color-white:            #F8F6F0;

  /* Textos */
  --color-text-primary:     #F8F6F0;
  --color-text-secondary:   #6B6B6B;
  --color-text-muted:       #3A3A3A;

  /* Bordas */
  --color-border:           #3A3A3A;
  --color-border-light:     #E8E6DF;

  /* Sistema */
  --color-success:          #2D8A5C;
  --color-error:            #C0392B;
  --color-warning:          #E67E22;
  --color-info:             #5B9BD5;

  /* Fundos de feedback */
  --color-success-bg:       #F0FAF5;
  --color-error-bg:         #FDF4F4;
}
```

### Tokens Tailwind (copiar para `tailwind.config.ts`)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          gold:         '#C9A811',
          'gold-hover': '#A88A0D',
          'gold-light': '#EDD033',
          black:        '#1A1A1A',
          white:        '#F8F6F0',
          graphite:     '#3A3A3A',
          gray:         '#6B6B6B',
          sand:         '#E8E6DF',
        },
        system: {
          success: '#2D8A5C',
          error:   '#C0392B',
          warning: '#E67E22',
          info:    '#5B9BD5',
        },
      },
    },
  },
}

export default config
```

---

## 4. Tipografia

### Famílias tipográficas

| Família | Função | Pesos | Link |
|---------|--------|-------|------|
| **Nunito** | Títulos, headings, wordmark | 700, 800 | [Google Fonts](https://fonts.google.com/specimen/Nunito) |
| **Inter** | Corpo, interface, dados | 400, 500, 600 | [Google Fonts](https://fonts.google.com/specimen/Inter) |

### Importar no Next.js (`layout.tsx`)

```tsx
import { Nunito, Inter } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-nunito',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Tokens CSS de fonte

```css
:root {
  --font-primary: var(--font-nunito), 'Arial Rounded MT Bold', sans-serif;
  --font-body:    var(--font-inter), system-ui, sans-serif;
}
```

### Escala tipográfica

| Token | Tamanho | Família | Peso | Uso |
|-------|---------|---------|------|-----|
| `text-display` | 32px / 2rem | Nunito | 800 | Hero, títulos de página |
| `text-h1` | 24px / 1.5rem | Nunito | 700 | Headings principais |
| `text-h2` | 18px / 1.125rem | Nunito | 700 | Subseções |
| `text-h3` | 14px / 0.875rem | Inter | 600 | Cards, labels de módulo |
| `text-body` | 14px / 0.875rem | Inter | 400 | Corpo de texto padrão |
| `text-small` | 12px / 0.75rem | Inter | 400 | Legendas, metadados |
| `text-label` | 10px / 0.625rem | Inter | 600 + uppercase | Labels, badges, tags |

### Escala Tailwind

```tsx
// Exemplos de uso
<h1 className="font-nunito text-3xl font-extrabold text-brand-white">
  Aprenda a ler partituras
</h1>

<p className="font-inter text-sm font-normal text-brand-gray leading-relaxed">
  A teoria musical não precisa ser chata.
</p>

<span className="font-inter text-xs font-semibold uppercase tracking-widest text-brand-gold">
  Módulo 1 — Fundamentos
</span>
```

---

## 5. Logotipo

### Arquivos disponíveis

> Os arquivos originais da logo estão em `public/brand/` (adicione os PNGs nessa pasta).

```
public/
└── brand/
    ├── logo-horizontal-preto.png      # Logotipo completo, cor preta, fundo branco/transparente
    ├── logo-horizontal-branco.png     # Logotipo completo, cor branca, para fundos escuros
    ├── logo-horizontal-ouro-claro.png # Logotipo completo, cor ouro, fundo branco
    ├── logo-horizontal-ouro-escuro.png# Logotipo completo, cor ouro, fundo preto
    ├── logo-vertical-preto.png        # Versão empilhada, preto
    ├── logo-vertical-branco.png       # Versão empilhada, branco
    ├── logo-vertical-ouro-escuro.png  # Versão empilhada, ouro, fundo preto
    ├── icone-ouro-preto.png           # Só o ícone, ouro, fundo preto ★ preferencial
    ├── icone-branco-ouro.png          # Só o ícone, branco, fundo ouro
    ├── icone-preto-claro.png          # Só o ícone, preto, fundo claro
    └── icone-branco-preto.png         # Só o ícone, branco, fundo preto
```

### Versões e quando usar

| Versão | Contexto |
|--------|----------|
| **Horizontal completa** | Header da plataforma, thumbnails do YouTube, banners, materiais de divulgação |
| **Vertical empilhada** | Perfil de redes sociais, capas, posts quadrados, Open Graph |
| **Ícone isolado** | Favicon, ícone do app mobile, avatar de canal, tamanhos < 120px |

### Variações por fundo

| Fundo | Versão da logo a usar |
|-------|-----------------------|
| Branco / claro `#F8F6F0` | Logo preta ou logo ouro |
| Preto / escuro `#1A1A1A` | Logo branca ou logo ouro |
| Ouro `#C9A811` | Logo branca |
| Grafite `#3A3A3A` | Logo ouro claro ou logo branca |

### Componente React (Header)

```tsx
// components/Logo.tsx
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon'
  color?: 'preto' | 'branco' | 'ouro-claro' | 'ouro-escuro'
  width?: number
  height?: number
  className?: string
}

export function Logo({
  variant = 'horizontal',
  color = 'branco',
  width = 160,
  height = 52,
  className,
}: LogoProps) {
  const src = `/brand/logo-${variant === 'icon' ? 'icone' : `logo-${variant}`}-${color}.png`

  return (
    <Link href="/" aria-label="Nota Dentro — Início">
      <Image
        src={src}
        alt="Nota Dentro"
        width={width}
        height={height}
        className={className}
        priority
      />
    </Link>
  )
}
```

### Zona de proteção

O espaço mínimo ao redor da logo em qualquer aplicação equivale à **altura da letra "n" do wordmark**. Nenhum outro elemento deve invadir essa área.

```tsx
// Aplicar sempre padding/margin suficiente ao redor da logo
<header className="px-6 py-4">
  {/* O padding do header já garante a zona de proteção */}
  <Logo variant="horizontal" color="branco" />
</header>
```

### ✅ Uso correto

- Logo monocromática em preto puro (`#1A1A1A`)
- Logo em branco sobre fundos escuros ou ouro
- Logo em ouro sobre fundo preto ou grafite
- Ícone isolado em contextos reduzidos (app, favicon, avatar)
- Redução proporcional mantendo legibilidade mínima (120px de largura)
- Versão colorida (ouro + preto) sobre fundo claro neutro

### ❌ Uso incorreto

- Deformar, esticar ou comprimir a logo
- Alterar cores para tons não aprovados neste manual
- Adicionar sombra, brilho, outline ou efeitos visuais
- Aplicar sobre fundos fotográficos sem área de respiro
- Girar, inclinar ou espelhar qualquer elemento
- Separar wordmark do ícone nas aplicações principais
- Usar o Nota Ouro como cor de fundo do wordmark

### Tamanho mínimo

| Versão | Tamanho mínimo |
|--------|---------------|
| Horizontal completa | 120px de largura |
| Vertical empilhada | 80px de largura |
| Ícone isolado | 24×24px |

---

## 6. Tom de Voz

### Como a marca se comunica

A voz do Nota Dentro é a voz de alguém que sabe muito — e quer genuinamente que você saiba também. Não há julgamento, não há pedantismo. Há **entusiasmo, clareza e respeito** pela jornada de quem aprende.

| Pilar | Como aplicar |
|-------|-------------|
| **Didático, não condescendente** | "Vamos entender juntos" — não "é simples, veja só". Explica com paciência sem subestimar quem aprende. |
| **Próximo, não informal demais** | Linguagem natural e acessível, mas com credibilidade. O conteúdo é sério; a entrega não precisa ser rígida. |
| **Motivador, não vazio** | Encoraja sem clichê. A motivação vem da história real e do progresso concreto. |
| **Técnico quando necessário** | Quando o assunto exige precisão, a marca não simplifica a ponto de errar. |
| **Inclusivo sempre** | Fala com pessoas de todas as origens, idades e níveis. Nunca intimida quem está começando. |
| **Autêntico e real** | A marca tem uma história de superação verdadeira. Nada de marketing vazio. |

### Exemplos de linguagem

| ❌ Evite | ✅ Use assim |
|----------|-------------|
| "É óbvio que uma semínima vale 2 tempos." | "Uma semínima equivale a 2 tempos — vamos ver isso na prática?" |
| "Qualquer um consegue aprender música!" | "Com método certo e prática constante, música está ao alcance de todos." |
| "Assunto complexo demais para iniciantes." | "Esse é um tópico mais avançado — construiremos até lá juntos." |
| "Você precisa saber isso para não errar." | "Entender isso vai fazer toda a diferença na sua leitura de partitura." |

---

## 7. Grid e Espaçamento

### Escala de espaçamento (base 8pt)

Todos os espaçamentos devem ser múltiplos de 4 ou 8px.

| Token | px | Tailwind | Uso |
|-------|----|----------|-----|
| `space-1` | 4px | `gap-1 / p-1` | Micro espaço, ícones inline |
| `space-2` | 8px | `gap-2 / p-2` | Espaço mínimo entre elementos |
| `space-3` | 12px | `gap-3 / p-3` | Padding interno de chips/badges |
| `space-4` | 16px | `gap-4 / p-4` | Padding padrão de cards |
| `space-6` | 24px | `gap-6 / p-6` | Espaço entre seções internas |
| `space-8` | 32px | `gap-8 / p-8` | Padding de containers |
| `space-12` | 48px | `gap-12 / p-12` | Espaço entre seções de página |
| `space-16` | 64px | `gap-16 / p-16` | Espaço entre blocos maiores |
| `space-20` | 80px | `gap-20 / p-20` | Seções hero |

### Border radius

| Token | Valor | Tailwind | Uso |
|-------|-------|----------|-----|
| `radius-sm` | 4px | `rounded` | Inputs, chips pequenos |
| `radius-md` | 8px | `rounded-lg` | Cards, botões |
| `radius-xl` | 12px | `rounded-xl` | Modais, painéis |
| `radius-full` | 9999px | `rounded-full` | Avatares, badges circulares |

### Grid responsivo

| Breakpoint | Colunas | Gutter | Margin | Tailwind prefix |
|------------|---------|--------|--------|-----------------|
| Mobile `< 768px` | 4 | 12px | 16px | (default) |
| Tablet `768–1024px` | 8 | 16px | 24px | `md:` |
| Desktop `> 1024px` | 12 | 24px | 32px | `lg:` |

### Tokens de sombra

```css
:root {
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.12);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.18);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.24);
  --shadow-gold: 0 0 20px rgba(201,168,17,0.25);  /* glow para elementos em destaque */
}
```

---

## 8. Aplicações Digitais

### Formatos de logo por canal

| Canal / Formato | Versão | Dimensão | Fundo |
|-----------------|--------|----------|-------|
| YouTube — Avatar | Ícone isolado | 800×800px | `#1A1A1A` |
| YouTube — Banner | Horizontal completa | 2560×1440px | `#1A1A1A` ou ouro |
| TikTok — Avatar | Ícone isolado (circular) | 200×200px | `#1A1A1A` |
| Plataforma — Favicon | Ícone isolado | 32×32px / 16×16px | Transparente |
| Plataforma — Header | Horizontal completa | min. 120px largura | `#1A1A1A` |
| App mobile — Ícone | Ícone isolado arredondado | 1024×1024px | `#1A1A1A` |
| Open Graph / Social Card | Horizontal ou vertical | 1200×630px | `#1A1A1A` + ouro |

### Favicon (Next.js `app/`)

```tsx
// app/icon.tsx  — gera o favicon automaticamente via Next.js
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#1A1A1A',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Substituir por <img> do ícone real quando disponível */}
      <div style={{ color: '#C9A811', fontSize: 20, fontWeight: 800 }}>N</div>
    </div>
  )
}
```

### Open Graph (`app/layout.tsx`)

```tsx
// app/layout.tsx
export const metadata = {
  title: 'Nota Dentro',
  description: 'Aprenda música de forma acessível, envolvente e gamificada.',
  openGraph: {
    title: 'Nota Dentro',
    description: 'Aprenda música de forma acessível, envolvente e gamificada.',
    url: 'https://notadentro.com.br',
    siteName: 'Nota Dentro',
    images: [
      {
        url: '/og-image.png',   // 1200×630px, logo horizontal ouro sobre preto
        width: 1200,
        height: 630,
        alt: 'Nota Dentro',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nota Dentro',
    description: 'Aprenda música de forma acessível, envolvente e gamificada.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}
```

### Componentes de botão (seguindo a paleta)

```tsx
// Botão primário — usa o Nota Ouro
<button className="bg-brand-gold text-brand-black font-semibold px-6 py-3 rounded-lg hover:bg-brand-gold-hover transition-colors">
  Começar agora
</button>

// Botão secundário — outline ouro
<button className="border border-brand-gold text-brand-gold font-semibold px-6 py-3 rounded-lg hover:bg-brand-gold hover:text-brand-black transition-colors">
  Saiba mais
</button>

// Botão ghost — sobre fundo escuro
<button className="text-brand-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
  Entrar
</button>
```

---

## Referências rápidas

### Cores (copiar/colar)

```
Nota Ouro:    #C9A811
Nota Preto:   #1A1A1A
Nota Branco:  #F8F6F0
Ouro Claro:   #EDD033
Ouro Escuro:  #A88A0D
Grafite:      #3A3A3A
Cinza Médio:  #6B6B6B
Areia:        #E8E6DF
Sucesso:      #2D8A5C
Erro:         #C0392B
Aviso:        #E67E22
Info:         #5B9BD5
```

### Fontes

```
Primária (títulos): Nunito — weights 700, 800
Secundária (corpo): Inter  — weights 400, 500, 600
```

### Links úteis

- [Nunito — Google Fonts](https://fonts.google.com/specimen/Nunito)
- [Inter — Google Fonts](https://fonts.google.com/specimen/Inter)
- [Canal YouTube](https://www.youtube.com/@notadentro)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

---

*Manual de Identidade Visual — Nota Dentro · v1.0 · 2025*
