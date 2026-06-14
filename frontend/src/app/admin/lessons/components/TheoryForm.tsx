'use client';

import { Input } from '@/components/ui/input';
import { RichEditor } from '@/components/ui/rich-editor';
import { TheoryStep } from '@/types/lesson';

interface Props {
  data: Partial<TheoryStep>;
  onChange: (data: Partial<TheoryStep>) => void;
}

export function TheoryForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-muted-foreground mb-1">Conteúdo Teórico</label>
        <RichEditor 
          value={data.content || ''} 
          onChange={(content) => onChange({ ...data, content })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">URL de Áudio (Opcional)</label>
          <Input 
            value={data.audioUrl || ''} 
            onChange={(e) => onChange({ ...data, audioUrl: e.target.value })}
            placeholder="Ex: /audio/som.mp3"
            className="bg-card"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">URL de Imagem (Opcional)</label>
          <Input 
            value={data.imageUrl || ''} 
            onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
            placeholder="Ex: /images/pauta.png"
            className="bg-card"
          />
        </div>
      </div>
    </div>
  );
}
