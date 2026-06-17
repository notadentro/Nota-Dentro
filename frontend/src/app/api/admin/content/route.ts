import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  // Proteção rigorosa: Esta rota SÓ funciona no seu computador local (npm run dev).
  // Em produção (Vercel, AWS), isso será bloqueado, garantindo 100% de segurança da sua plataforma.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'O Painel de Admin Git-Backed só está disponível no ambiente local (localhost).' },
      { status: 403 }
    );
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    
    // ==========================================
    // 1. FLUXO DE UPLOAD DE IMAGEM (MARKDOWN/BLOG)
    // ==========================================
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });

      // Lógica de nomenclatura pedida: public/uploads/blog/YYYY/img_N_DD.MM.YYYY.ext
      const date = new Date();
      const year = date.getFullYear().toString();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dateStr = `${dd}.${mm}.${year}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog', year);
      
      // Cria a pasta do ano atual caso não exista
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Conta quantos arquivos já existem hoje para determinar o "N"
      const filesInDir = await fs.readdir(uploadDir).catch(() => []);
      const todayFiles = filesInDir.filter(f => f.includes(dateStr));
      const N = todayFiles.length + 1;
      
      const ext = path.extname(file.name) || '.png';
      const fileName = `img_${N}_${dateStr}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Converte e salva fisicamente no disco
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);
      
      // Retorna a URL pública que o navegador vai usar para exibir a imagem
      return NextResponse.json({ url: `/uploads/blog/${year}/${fileName}` });
    }
    
    // ==========================================
    // 2. FLUXO DE SALVAMENTO DE LIÇÕES/CURSOS (JSON)
    // ==========================================
    const body = await req.json();
    const { type, id, data } = body;
    
    // type pode ser 'lessons', 'courses', 'blog'
    if (!type || !id || !data) {
      return NextResponse.json({ error: 'Faltam parâmetros obrigatórios (type, id, data)' }, { status: 400 });
    }
    
    const contentDir = path.join(process.cwd(), 'src', 'content', type);
    
    // Garante que a pasta src/content/lessons (ou courses) exista
    await fs.mkdir(contentDir, { recursive: true });
    
    const filePath = path.join(contentDir, `${id}.json`);
    
    // Salva o JSON formatado no seu repositório
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, path: filePath });
    
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
    console.error('Erro na API de Admin:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Bloqueado em produção' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (!type) return NextResponse.json({ error: 'Forneça o type' }, { status: 400 });

  try {
    const contentDir = path.join(process.cwd(), 'src', 'content', type);
    await fs.mkdir(contentDir, { recursive: true });
    
    const files = await fs.readdir(contentDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const items = await Promise.all(jsonFiles.map(async (file) => {
      const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
      return JSON.parse(content);
    }));

    return NextResponse.json({ items });
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
