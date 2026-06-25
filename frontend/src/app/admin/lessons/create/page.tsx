'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { Lesson, LessonStep, StepType } from '@/types/lesson';
import { StepBuilder } from '../components/StepBuilder';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function CreateLessonPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [lesson, setLesson] = useState<Partial<Lesson>>({
    id: generateId(),
    status: 'locked',
    steps: []
  });

  const addStep = (type: StepType) => {
    const newStep: LessonStep = {
      id: generateId(),
      type,
      title: '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {} as any
    };
    setLesson(prev => ({ ...prev, steps: [...(prev.steps || []), newStep] }));
  };

  const updateStep = (index: number, updatedStep: LessonStep) => {
    const newSteps = [...(lesson.steps || [])];
    newSteps[index] = updatedStep;
    setLesson({ ...lesson, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = (lesson.steps || []).filter((_, i) => i !== index);
    setLesson({ ...lesson, steps: newSteps });
  };

  const handleSave = async () => {
    if (!lesson.title || !lesson.slug || !lesson.module) {
      alert('Preencha pelo menos Título, Slug e Módulo da lição.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lessons',
          id: lesson.slug,
          data: lesson
        })
      });

      if (!response.ok) throw new Error('Falha ao salvar a lição');
      
      alert('Lição salva com sucesso no repositório!');
      router.push('/admin/lessons');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar a lição');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/admin/lessons"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline text-foreground">Nova Lição</h1>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-bold px-8 h-12"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Lição'}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold font-headline mb-4 text-brand-gold border-b border-border pb-2">Configurações Gerais</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Título da Lição</label>
            <Input 
              value={lesson.title || ''} 
              onChange={(e) => setLesson({...lesson, title: e.target.value})}
              placeholder="Ex: Qualidades do Som"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Slug (Identificador URL)</label>
            <Input 
              value={lesson.slug || ''} 
              onChange={(e) => setLesson({...lesson, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
              placeholder="ex: qualidades-do-som"
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Módulo Pai (Número)</label>
            <Input 
              type="number"
              value={lesson.module || ''} 
              onChange={(e) => setLesson({...lesson, module: parseInt(e.target.value)})}
              placeholder="Ex: 1"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Status Inicial</label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={lesson.status || 'locked'}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setLesson({...lesson, status: e.target.value as any})}
            >
              <option value="locked">Bloqueada</option>
              <option value="available">Disponível</option>
              <option value="completed">Concluída (Debug)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">Descrição Curta</label>
          <Textarea 
            value={lesson.description || ''} 
            onChange={(e) => setLesson({...lesson, description: e.target.value})}
            placeholder="Aparece no card da lição..."
            className="h-20"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-2xl font-bold font-headline text-foreground">Passos da Lição (Slides)</h2>
        </div>

        {lesson.steps?.map((step, index) => (
          <StepBuilder 
            key={step.id} 
            step={step} 
            index={index} 
            onChange={(updated) => updateStep(index, updated)}
            onRemove={() => removeStep(index)}
          />
        ))}

        {(!lesson.steps || lesson.steps.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-card">
            <p className="text-muted-foreground mb-4">Esta lição ainda não possui nenhum passo ou desafio.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => addStep('theory')} className="border-brand-gold text-brand-gold hover:bg-brand-gold/10">
            <Plus className="w-4 h-4 mr-2" /> Teoria
          </Button>
          <Button variant="outline" onClick={() => addStep('quiz')} className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
            <Plus className="w-4 h-4 mr-2" /> Múltipla Escolha
          </Button>
          <Button variant="outline" onClick={() => addStep('true_false')} className="border-purple-500 text-purple-500 hover:bg-purple-500/10">
            <Plus className="w-4 h-4 mr-2" /> Verdadeiro / Falso
          </Button>
          <Button variant="outline" onClick={() => addStep('match_columns')} className="border-green-500 text-green-500 hover:bg-green-500/10">
            <Plus className="w-4 h-4 mr-2" /> Colunas
          </Button>
          <Button variant="outline" onClick={() => addStep('memory_game')} className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
            <Plus className="w-4 h-4 mr-2" /> Memória
          </Button>
          <Button variant="outline" onClick={() => addStep('fill_blanks')} className="border-pink-500 text-pink-500 hover:bg-pink-500/10">
            <Plus className="w-4 h-4 mr-2" /> Lacunas
          </Button>
        </div>
      </div>
    </div>
  );
}
