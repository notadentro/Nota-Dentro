'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading, List, Eye, Edit3, Loader2 } from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichEditor({ value, onChange, placeholder = 'Escreva aqui usando Markdown...' }: RichEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Reposition cursor inside the tags if no text was selected
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Usando a nossa nova API local de upload
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Falha no upload');
      
      // Insere o markdown da imagem no local do cursor
      insertText(`![Imagem](${data.url})`, '');
      
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border border-brand-graphite/30 rounded-2xl overflow-hidden bg-background flex flex-col font-body">
      {/* TOOLBAR */}
      <div className="flex items-center justify-between p-2 bg-brand-graphite/10 border-b border-brand-graphite/30">
        
        {/* Formatting Buttons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setMode('write')} className={mode === 'write' ? 'bg-brand-graphite/20' : ''}>
            <Edit3 size={16} className="mr-2" /> Escrever
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setMode('preview')} className={mode === 'preview' ? 'bg-brand-graphite/20' : ''}>
            <Eye size={16} className="mr-2" /> Visualizar
          </Button>
          
          <div className="w-px h-6 bg-brand-graphite/30 mx-2" />
          
          <Button variant="ghost" size="icon" onClick={() => insertText('**', '**')} disabled={mode !== 'write'} title="Negrito">
            <Bold size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText('*', '*')} disabled={mode !== 'write'} title="Itálico">
            <Italic size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText('### ', '')} disabled={mode !== 'write'} title="Subtítulo">
            <Heading size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText('- ', '')} disabled={mode !== 'write'} title="Lista">
            <List size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertText('[Texto](', ')')} disabled={mode !== 'write'} title="Link">
            <LinkIcon size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={mode !== 'write' || isUploading} title="Upload de Imagem">
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          </Button>
          
          {/* Input file invisível para imagens */}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageUpload} 
          />
        </div>
      </div>

      {/* EDITOR AREA */}
      <div className="min-h-[300px]">
        {mode === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[300px] p-4 bg-transparent resize-y outline-none text-brand-black dark:text-brand-white focus:ring-0"
          />
        ) : (
          <div className="p-4 prose prose-lg dark:prose-invert max-w-none min-h-[300px]">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-brand-gray italic">Nada para visualizar.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
