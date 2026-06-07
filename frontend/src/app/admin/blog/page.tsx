'use client';

import { useState } from 'react';
import { RichEditor } from '@/components/ui/rich-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BlogAdminPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      alert('Título e conteúdo são obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      const id = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          id: id,
          data: {
            id,
            title,
            subtitle,
            date: new Date().toISOString(),
            content,
            author: 'Annie Larcher'
          }
        }),
      });

      if (!response.ok) throw new Error('Falha ao salvar');

      alert('Artigo salvo com sucesso!');
      // Limpa o form
      setTitle('');
      setSubtitle('');
      setContent('');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar artigo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Novo Artigo</h1>
          <p className="text-brand-gray">Crie um novo artigo para a plataforma.</p>
        </div>
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
          <label className="block text-sm font-bold text-brand-gray mb-1">Subtítulo (Opcional)</label>
          <Input 
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ex: Um guia prático para iniciantes no estudo de partituras"
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
