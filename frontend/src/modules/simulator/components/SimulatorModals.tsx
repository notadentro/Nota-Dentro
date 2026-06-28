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
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-slate-950/95 backdrop-blur-md px-4">
          <div className="max-w-xl text-center flex flex-col items-center">
            <h2 className="text-5xl font-headline font-black text-cyan-400 mb-8 uppercase tracking-tight drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
              Pausado
            </h2>
            <div className="flex flex-col gap-4 w-64">
              <Button onClick={resumeGame} className="w-full py-6 text-xl font-bold rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                Continuar
              </Button>
              <Button onClick={repeatLevel} variant="outline" className="w-full py-6 text-xl font-bold rounded-full border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 backdrop-blur-sm">
                Recomeçar Fase
              </Button>
              <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="w-full py-6 text-xl font-bold rounded-full text-pink-400 hover:text-pink-300 hover:bg-pink-500/20">
                Sair para o Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === 'instruction' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-slate-950/95 backdrop-blur-md px-4">
          <div className="max-w-xl text-center flex flex-col items-center">
            <Info className="w-16 h-16 text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            <h2 className="text-4xl font-headline font-black text-white mb-6 uppercase tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{levelDef.instruction?.title || "Nível " + level}</h2>
            <p className="text-slate-300 text-xl mb-12 leading-relaxed">{levelDef.instruction?.text || "Prepare-se para tocar a partitura!"}</p>
            <div className="flex flex-col gap-4 w-full">
              <Button onClick={acceptInstruction} className="px-10 py-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-2xl font-bold shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                Toque para Iniciar
              </Button>
              <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="px-10 py-6 rounded-full text-slate-400 hover:text-white hover:bg-white/10 text-xl font-bold">
                Sair para o Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === 'level_failed' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-slate-950/95 backdrop-blur-md px-4">
          <div className="max-w-xl text-center flex flex-col items-center">
            <ShieldAlert className="w-16 h-16 text-pink-500 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
            <h2 className="text-4xl font-headline font-black text-pink-500 mb-2 uppercase tracking-tight drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">Você Errou!</h2>
            <p className="text-slate-400 text-xl mb-8">O ritmo saiu de controle e a música parou.</p>
            <div className="mb-8">
              <span className="text-white text-lg block mb-2">Tentativas Restantes da Fase</span>
              <div className="flex gap-2 justify-center">
                {[...Array(INITIAL_RETRIES)].map((_, i) => (
                  <div key={i} className={cn("w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]", i < retries ? "bg-pink-500 text-pink-500" : "bg-slate-800 text-transparent")} />
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button onClick={repeatLevel} className="px-8 py-8 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-2xl font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                <RefreshCw className="mr-3 w-6 h-6" /> Tentar Novamente
              </Button>
              <Button onClick={nextLevel} className="px-8 py-8 rounded-full bg-slate-900/50 hover:bg-slate-800/80 text-slate-400 hover:text-white text-xl font-bold border-2 border-slate-700/50">
                Pular Fase
              </Button>
            </div>
            <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-bold">
              Sair para o Menu
            </Button>
          </div>
        </div>
      )}

      {status === 'gameover' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-slate-950/95 backdrop-blur-md">
          <h2 className="text-5xl font-headline font-black text-red-500 mb-2 uppercase tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">Game Over Total</h2>
          <p className="text-slate-400 text-xl mb-8">Você esgotou todas as tentativas para esta fase.</p>
          <Button onClick={() => router.push('/ritmo-insano')} className="px-10 py-8 rounded-full bg-red-600 hover:bg-red-500 text-white text-2xl font-bold shadow-[0_0_30px_rgba(239,68,68,0.5)]">
            Voltar para o Menu
          </Button>
        </div>
      )}

      {status === 'level_complete' && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex flex-col items-center justify-center p-6 text-center backdrop-blur-md animate-in fade-in duration-500">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 mb-2 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">Concluído!</h2>
          <div className="text-white text-xl mb-4 font-bold flex items-center justify-center gap-2">
            Precisão: <span className={accuracy >= 80 ? 'text-green-400 text-2xl drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : accuracy >= 50 ? 'text-yellow-400 text-2xl' : 'text-red-400 text-2xl'}>{accuracy}%</span>
          </div>
          {accuracy >= 98 && (
            <div className="mb-6 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Zap className="w-5 h-5 fill-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              +1 Cachê Bônus! (&ge; 98%)
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={() => startLevel(level, bpm, true)} className="px-8 py-4 bg-slate-800/80 text-cyan-300 font-bold rounded-xl border border-cyan-500/30 hover:bg-cyan-500/20">Repetir</Button>
            <Button onClick={nextLevel} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">Avançar</Button>
          </div>
          <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="mt-4 text-slate-400 hover:text-white hover:bg-white/10 px-8 py-2 rounded-full font-bold">
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
