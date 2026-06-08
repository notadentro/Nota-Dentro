'use client';

import { LessonStep, StepType } from '@/types/lesson';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, GripVertical } from 'lucide-react';

import { TheoryForm } from './TheoryForm';
import { QuizForm } from './QuizForm';
import { TrueFalseForm } from './TrueFalseForm';
import { MatchColumnsForm } from './MatchColumnsForm';
import { MemoryGameForm } from './MemoryGameForm';
import { FillBlanksForm } from './FillBlanksForm';

interface Props {
  step: LessonStep;
  index: number;
  onChange: (updatedStep: LessonStep) => void;
  onRemove: () => void;
}

const typeLabels: Record<StepType, string> = {
  theory: 'Teoria',
  quiz: 'Múltipla Escolha',
  true_false: 'Verdadeiro ou Falso',
  match_columns: 'Ligar Colunas',
  memory_game: 'Jogo da Memória',
  fill_blanks: 'Preencher Lacunas'
};

export function StepBuilder({ step, index, onChange, onRemove }: Props) {
  const updateBaseField = (field: keyof LessonStep, value: string) => {
    onChange({ ...step, [field]: value });
  };

  const updateData = (newData: any) => {
    onChange({ ...step, data: newData });
  };

  const renderForm = () => {
    switch (step.type) {
      case 'theory': return <TheoryForm data={step.data as any} onChange={updateData} />;
      case 'quiz': return <QuizForm data={step.data as any} onChange={updateData} />;
      case 'true_false': return <TrueFalseForm data={step.data as any} onChange={updateData} />;
      case 'match_columns': return <MatchColumnsForm data={step.data as any} onChange={updateData} />;
      case 'memory_game': return <MemoryGameForm data={step.data as any} onChange={updateData} />;
      case 'fill_blanks': return <FillBlanksForm data={step.data as any} onChange={updateData} />;
      default: return null;
    }
  };

  return (
    <Card className="border-2 border-border mb-6">
      <CardHeader className="bg-muted/50 py-3 flex flex-row items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="cursor-move text-muted-foreground hover:text-foreground">
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">Passo {index + 1}</span>
          <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-graphite/20 text-brand-gold ml-2">
            {typeLabels[step.type]}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8">
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Título do Passo</label>
            <Input 
              value={step.title} 
              onChange={(e) => updateBaseField('title', e.target.value)}
              placeholder="Ex: A Matéria-Prima da Música"
              className="font-bold text-foreground bg-card"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Fonte / Autor (Opcional)</label>
            <Input 
              value={step.source || ''} 
              onChange={(e) => updateBaseField('source', e.target.value)}
              placeholder="Ex: Teoria Contemporânea"
              className="bg-card"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          {renderForm()}
        </div>
      </CardContent>
    </Card>
  );
}
