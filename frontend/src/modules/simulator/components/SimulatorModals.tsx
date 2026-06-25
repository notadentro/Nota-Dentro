import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Info, ShieldAlert, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { GameState } from '../types';
import { LevelDefinition } from '../constants/levels';

interface SimulatorModalsProps {
  status: GameState;
  showStore: boolean;
  setShowStore: (show: boolean) => void;
  level: number;
  levelDef: LevelDefinition;
  bpm: number;
  retries: number;
  accuracy: number;
  resumeGame: () => void;
  repeatLevel: () => void;
  acceptInstruction: () => void;
  nextLevel: () => void;
  startLevel: (l: number, b: number, keepSeq: boolean) => void;
  INITIAL_RETRIES: number;
}

export function SimulatorModals({
  status, showStore, setShowStore, level, levelDef, bpm, retries, accuracy, 
  resumeGame, repeatLevel, acceptInstruction, nextLevel, startLevel, INITIAL_RETRIES
}: SimulatorModalsProps) {
  const router = useRouter();
  const { user, buyLives } = useUser();

  return (
    <>
      {status === 'paused' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
          <div className="max-w-xl text-center flex flex-col items-center">
            <h2 className="text-5xl font-headline font-black text-brand-gold mb-8 uppercase tracking-tight drop-shadow-[0_0_15px_rgba(242,211,73,0.5)]">
              Pausado
            </h2>
            <div className="flex flex-col gap-4 w-64">
              <Button onClick={resumeGame} className="w-full py-6 text-xl font-bold rounded-full bg-white text-brand-black hover:bg-gray-200 shadow-lg">
                Continuar
              </Button>
              <Button onClick={repeatLevel} variant="outline" className="w-full py-6 text-xl font-bold rounded-full border-2 border-brand-gray text-white hover:bg-brand-gray/20">
                Recomeçar Fase
              </Button>
              <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="w-full py-6 text-xl font-bold rounded-full text-red-400 hover:text-red-300 hover:bg-red-400/10">
                Sair para o Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === 'instruction' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
          <div className="max-w-xl text-center flex flex-col items-center">
            <Info className="w-16 h-16 text-brand-gold mb-6" />
            <h2 className="text-4xl font-headline font-black text-white mb-6 uppercase tracking-tight">{levelDef.instruction?.title || "Nível " + level}</h2>
            <p className="text-brand-gray text-xl mb-12 leading-relaxed">{levelDef.instruction?.text || "Prepare-se para tocar a partitura!"}</p>
            <div className="flex flex-col gap-4 w-full">
              <Button onClick={acceptInstruction} className="px-10 py-8 rounded-full bg-brand-gold hover:bg-yellow-400 text-brand-black text-2xl font-bold shadow-lg shadow-brand-gold/20">
                Toque para Iniciar
              </Button>
              <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="px-10 py-6 rounded-full text-brand-gray hover:text-white hover:bg-white/10 text-xl font-bold">
                Sair para o Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === 'level_failed' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
          <div className="max-w-xl text-center flex flex-col items-center">
            <ShieldAlert className="w-16 h-16 text-orange-500 mb-6" />
            <h2 className="text-4xl font-headline font-black text-orange-500 mb-2 uppercase tracking-tight">Você Errou!</h2>
            <p className="text-brand-gray text-xl mb-8">O ritmo saiu de controle e a música parou.</p>
            <div className="mb-8">
              <span className="text-white text-lg block mb-2">Tentativas Restantes da Fase</span>
              <div className="flex gap-2 justify-center">
                {[...Array(INITIAL_RETRIES)].map((_, i) => (
                  <div key={i} className={cn("w-4 h-4 rounded-full", i < retries ? "bg-orange-500" : "bg-brand-graphite")} />
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button onClick={repeatLevel} className="px-8 py-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-2xl font-bold shadow-lg shadow-orange-500/20">
                <RefreshCw className="mr-3 w-6 h-6" /> Tentar Novamente
              </Button>
              <Button onClick={nextLevel} className="px-8 py-8 rounded-full bg-brand-graphite hover:bg-brand-gray/20 text-brand-gray text-xl font-bold border-2 border-brand-gray/30">
                Pular Fase
              </Button>
            </div>
            <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="text-brand-gray hover:text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-bold">
              Sair para o Menu
            </Button>
          </div>
        </div>
      )}

      {status === 'game_over' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md">
          <h2 className="text-5xl font-headline font-black text-red-500 mb-2 uppercase tracking-tight">Game Over Total</h2>
          <p className="text-brand-gray text-xl mb-8">Você esgotou todas as tentativas para esta fase.</p>
          <Button onClick={() => router.push('/ritmo-insano')} className="px-10 py-8 rounded-full bg-red-600 hover:bg-red-500 text-white text-2xl font-bold shadow-lg shadow-red-500/20">
            Voltar para o Menu
          </Button>
        </div>
      )}

      {status === 'level_complete' && (
        <div className="fixed inset-0 bg-brand-black/90 z-[100] flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm animate-in fade-in duration-500">
          <h2 className="text-4xl font-black text-brand-gold mb-2 uppercase tracking-widest drop-shadow-lg">Concluído!</h2>
          <div className="text-white text-xl mb-4 font-bold flex items-center justify-center gap-2">
            Precisão: <span className={accuracy >= 80 ? 'text-green-400 text-2xl' : accuracy >= 50 ? 'text-yellow-400 text-2xl' : 'text-red-400 text-2xl'}>{accuracy}%</span>
          </div>
          {accuracy >= 98 && (
            <div className="mb-6 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce">
              <Zap className="w-5 h-5 fill-brand-gold" />
              +1 Cachê Bônus! (&ge; 98%)
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={() => startLevel(level, bpm, true)} className="px-8 py-4 bg-brand-graphite text-white font-bold rounded-xl">Repetir</Button>
            <Button onClick={nextLevel} className="px-8 py-4 bg-brand-gold text-brand-black font-bold rounded-xl">Avançar</Button>
          </div>
          <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="mt-4 text-brand-gray hover:text-white hover:bg-white/10 px-8 py-2 rounded-full font-bold">
            Sair para o Menu
          </Button>
        </div>
      )}
      
      {showStore && (
        <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-2xl relative">
            <button onClick={() => setShowStore(false)} className="absolute top-4 right-4 text-brand-gray hover:text-brand-black">✕</button>
            <div className="w-16 h-16 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 fill-brand-gold" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-brand-black">Suas vidas acabaram!</h3>
            <p className="text-brand-gray mb-6">Você precisa de mais Vidas para continuar treinando o ritmo. Use seu Cachê ou adquira mais!</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">
              <span className="font-bold text-slate-600">Seu Saldo:</span>
              <span className="font-black text-brand-gold text-xl flex items-center gap-1">
                <Zap className="w-5 h-5 fill-brand-gold" />
                {user?.stats?.cache ?? 0}
              </span>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={async () => {
                  if (!user) return;
                  const success = await buyLives(50, 3);
                  if (success) {
                    setShowStore(false);
                  } else {
                    alert('Cachê insuficiente!');
                  }
                }}
                className="w-full bg-brand-black hover:bg-brand-gray text-white font-bold py-6 text-lg rounded-xl flex justify-between items-center px-6"
              >
                <span>Recuperar 5 Vidas</span>
                <span className="flex items-center text-brand-gold gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                  50 <Zap className="w-4 h-4 fill-brand-gold" />
                </span>
              </Button>
              
              <Button 
                onClick={() => alert('Integração com Stripe em breve!')}
                className="w-full border-brand-gold/30 border-2 text-brand-gold font-bold py-6 text-lg rounded-xl hover:bg-brand-gold hover:text-white transition-colors"
              >
                Comprar 100 Cachês por R$ 4,90
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
