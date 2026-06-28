import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';

interface TutorialOverlayProps {
  onFinish: () => void;
}

type StepConfig = {
  id: string;
  targets: string[]; // IDs dos elementos
  title: string;
  description: string;
  showFigures?: boolean;
};

const STEPS: StepConfig[] = [
  {
    id: 'step-0',
    targets: [],
    title: 'Bem-vindo ao Tutorial!',
    description: 'Vamos aprender a ler e executar as notas musicais no Ritmo Insano.',
  },
  {
    id: 'step-hearts',
    targets: ['hud-hearts'],
    title: 'Corações (Vidas)',
    description: 'Você começa com 3 corações. A cada batida fora de tempo (ou nota perdida), você perde 1 coração.',
  },
  {
    id: 'step-retries',
    targets: ['hud-retries'],
    title: 'Chances da Fase',
    description: 'Se os 3 corações acabarem, você gasta uma Chance (retentativa). Se as 3 chances acabarem... Game Over Total!',
  },
  {
    id: 'step-bpm',
    targets: ['hud-bpm'],
    title: 'BPM (Velocidade)',
    description: 'Indica as Batidas Por Minuto. Quanto maior o BPM, mais rápido as notas vão passar.',
  },
  {
    id: 'step-time-signature',
    targets: ['level-title'],
    title: 'Fórmula de Compasso',
    description: 'Mostra o tamanho do compasso. 4/4 significa que cabem 4 tempos dentro de cada ciclo.',
  },
  {
    id: 'step-pause',
    targets: ['hud-pause-button'],
    title: 'Pausar',
    description: 'Sinta-se livre para pausar o jogo a qualquer momento se precisar respirar.',
  },
  {
    id: 'step-1',
    targets: ['pad-left'],
    title: 'Voz 2 (Mão Esquerda)',
    description: 'O botão esquerdo controla a pauta inferior (Voz 2). No teclado (PC), você pode usar a tecla F.',
  },
  {
    id: 'step-2',
    targets: ['pad-right'],
    title: 'Voz 1 (Mão Direita)',
    description: 'O botão direito controla a pauta superior (Voz 1). No teclado (PC), você pode usar a tecla J.',
  },
  {
    id: 'step-3',
    targets: ['pad-left', 'pad-right'],
    title: 'Voz Única',
    description: 'Quando a música tiver apenas uma pauta, qualquer um dos dois botões funcionará!',
  },
  {
    id: 'step-4',
    targets: ['track-container'],
    title: 'Notas Longas',
    description: 'Figuras como Semibreve, Mínima e Semínima devem ser SEGURADAS! Mantenha o botão pressionado pela duração inteira da nota.',
    showFigures: true,
  },
  {
    id: 'step-5',
    targets: [],
    title: 'Tudo Pronto!',
    description: 'Foque na pauta e sinta o pulso!',
  },
];

export function TutorialOverlay({ onFinish }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRects, setTargetRects] = useState<DOMRect[]>([]);

  const step = STEPS[currentStep];

  const updateRects = useCallback(() => {
    if (!step) return;
    const rects: DOMRect[] = [];
    step.targets.forEach((targetId) => {
      const el = document.getElementById(targetId);
      if (el) {
        rects.push(el.getBoundingClientRect());
      }
    });
    setTargetRects(rects);
  }, [step]);

  useEffect(() => {
    updateRects();
    window.addEventListener('resize', updateRects);
    window.addEventListener('scroll', updateRects);
    return () => {
      window.removeEventListener('resize', updateRects);
      window.removeEventListener('scroll', updateRects);
    };
  }, [updateRects]);

  // Se não encontrar os elementos, tenta novamente em 500ms (pode estar renderizando)
  useEffect(() => {
    if (step.targets.length > 0 && targetRects.length === 0) {
      const timeout = setTimeout(() => updateRects(), 500);
      return () => clearTimeout(timeout);
    }
  }, [step, targetRects, updateRects]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center">
      {/* SVG Mask for Spotlight */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 100 }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRects.map((rect, i) => (
              <rect
                key={i}
                x={rect.x - 10}
                y={rect.y - 10}
                width={rect.width + 20}
                height={rect.height + 20}
                rx={16}
                fill="black"
              />
            ))}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#spotlight-mask)"
        />
        {/* Borders around highlights */}
        {targetRects.map((rect, i) => (
          <rect
            key={`border-${i}`}
            x={rect.x - 10}
            y={rect.y - 10}
            width={rect.width + 20}
            height={rect.height + 20}
            rx={16}
            fill="none"
            stroke="#C9A811" // brand-gold
            strokeWidth="4"
            className="animate-pulse"
          />
        ))}
      </svg>

      {/* Tutorial Dialog Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-[101] bg-slate-900 border-2 border-brand-gold/50 p-6 rounded-2xl shadow-[0_0_40px_rgba(201,168,17,0.3)] max-w-md w-[90%] mx-auto text-center"
        >
          <h2 className="text-2xl font-headline font-black text-brand-gold mb-3 uppercase tracking-wider">
            {step.title}
          </h2>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">
            {step.description}
          </p>

          {step.showFigures && (
            <div className="flex justify-center gap-6 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 relative mb-2 opacity-80 mix-blend-screen invert">
                  <Image src="/assets/svg/semibreve.svg" alt="Semibreve" fill className="object-contain" />
                </div>
                <span className="text-xs font-bold text-slate-400">Semibreve</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 relative mb-2 opacity-80 mix-blend-screen invert">
                  <Image src="/assets/svg/minima.svg" alt="Mínima" fill className="object-contain" />
                </div>
                <span className="text-xs font-bold text-slate-400">Mínima</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 relative mb-2 opacity-80 mix-blend-screen invert">
                  <Image src="/assets/svg/seminima.svg" alt="Semínima" fill className="object-contain" />
                </div>
                <span className="text-xs font-bold text-slate-400">Semínima</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 mt-6 w-full">
            <div className="flex justify-center gap-1.5 flex-wrap px-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors shrink-0 ${
                    i === currentStep ? 'bg-brand-gold shadow-[0_0_10px_rgba(201,168,17,0.8)]' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center w-full gap-2">
              <Button
                variant="ghost"
                onClick={onFinish}
                className="text-slate-400 hover:text-white hover:bg-slate-800 px-2 sm:px-4 text-xs sm:text-sm uppercase font-bold tracking-wider"
              >
                Pular
              </Button>
              <Button
                onClick={handleNext}
                className="bg-brand-gold hover:bg-yellow-500 text-black font-black uppercase tracking-wider rounded-xl px-4 sm:px-6 text-xs sm:text-sm shrink-0"
              >
                {currentStep < STEPS.length - 1 ? (
                  <>Próximo <ChevronRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" /></>
                ) : (
                  <>Vamos lá! <Check className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" /></>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
