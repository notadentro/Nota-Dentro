'use client';

import { useState } from 'react';
import { RichEditor } from '@/components/ui/rich-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BlogAdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !content) return alert('Preencha título e conteúdo!');
    
    setIsSaving(true);
    
    // Transforma o título em um ID/slug (ex: "Meu Artigo" -> "meu-artigo")
    const id = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'blog',
          id: id,
          data: {
            id,
            title,
            date: new Date().toISOString(),
            content
          }
        }),
      });
      
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Erro ao salvar');
      
      alert('Artigo salvo com sucesso em: ' + resData.path);
      setTitle('');
      setContent('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Novo Artigo (Blog)</h1>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !title || !content}
          className="bg-[#2D8A5C] text-white hover:bg-[#2D8A5C]/80"
        >
          {isSaving ? 'Salvando...' : 'Salvar no Repositório'}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-brand-gray mb-1">Título do Artigo</label>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Como entender a Teoria de Scliar rapidamente"
            className="text-lg py-6"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-gray mb-1">Conteúdo (Markdown)</label>
          <RichEditor 
            value={content}
            onChange={setContent}
            placeholder="Comece a escrever o seu artigo aqui... Você pode colar imagens ou clicar no ícone de foto."
          />
        </div>
      </div>
    </div>
  );
}
