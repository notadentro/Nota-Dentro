'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Keyboard, Music2, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HowToPlayProps {
  onClose: () => void;
}

export function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-brand-graphite to-brand-black rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-brand-gold/30 shadow-2xl shadow-brand-gold/20"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-headline font-black text-brand-gold uppercase tracking-wider">Como Jogar</h2>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-brand-gray/20 hover:bg-brand-gray/40 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Objetivo */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-brand-gold" />
              <h3 className="text-2xl font-headline font-black text-white">Objetivo</h3>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              Toque as notas musicais no momento exato, seguindo o ritmo do metrônomo. 
              Quanto mais preciso você for, maior será sua pontuação!
            </p>
          </section>

          {/* Controles */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Keyboard className="w-8 h-8 text-brand-gold" />
              <h3 className="text-2xl font-headline font-black text-white">Controles</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-brand-black/50 p-6 rounded-2xl border border-brand-gray/20">
                <div className="flex items-center gap-3 mb-3">
                  <kbd className="px-4 py-2 bg-brand-gold text-brand-black font-black text-xl rounded-lg">F</kbd>
                  <span className="text-white font-bold">Mão Esquerda</span>
                </div>
                <p className="text-slate-400">Use para tocar a linha inferior da pauta (quando houver duas linhas)</p>
              </div>
              
              <div className="bg-brand-black/50 p-6 rounded-2xl border border-brand-gray/20">
                <div className="flex items-center gap-3 mb-3">
                  <kbd className="px-4 py-2 bg-brand-gold text-brand-black font-black text-xl rounded-lg">J</kbd>
                  <span className="text-white font-bold">Mão Direita</span>
                </div>
                <p className="text-slate-400">Use para tocar a linha superior (ou a única linha em fases simples)</p>
              </div>
            </div>
          </section>

          {/* Como Funciona */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Music2 className="w-8 h-8 text-brand-gold" />
              <h3 className="text-2xl font-headline font-black text-white">Mecânica</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-green-500">
                <h4 className="text-green-400 font-bold mb-2">✓ Notas</h4>
                <p className="text-slate-300">Toque a tecla correta quando a nota passar pela linha de referência (25% da tela)</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-purple-500">
                <h4 className="text-purple-400 font-bold mb-2">◯ Pausas</h4>
                <p className="text-slate-300">NÃO toque nada! Aguarde em silêncio até a próxima nota</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-yellow-500">
                <h4 className="text-yellow-400 font-bold mb-2">⌐ Ligaduras</h4>
                <p className="text-slate-300">Pressione e SEGURE a tecla durante toda a duração da nota ligada</p>
              </div>
            </div>
          </section>

          {/* Sistema de Pontuação */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-black text-white">Pontuação</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <div className="text-3xl mb-2">👌</div>
                <div className="text-green-400 font-black">PERFEITO</div>
                <div className="text-xs text-slate-400">±50ms</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <div className="text-3xl mb-2">⏪</div>
                <div className="text-yellow-400 font-black">ADIANTADO</div>
                <div className="text-xs text-slate-400">Muito cedo</div>
              </div>
              
              <div className="text-center p-4 bg-orange-500/20 border border-orange-500/50 rounded-xl">
                <div className="text-3xl mb-2">⏩</div>
                <div className="text-orange-400 font-black">ATRASADO</div>
                <div className="text-xs text-slate-400">Muito tarde</div>
              </div>
              
              <div className="text-center p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <div className="text-3xl mb-2">❌</div>
                <div className="text-red-400 font-black">ERRO</div>
                <div className="text-xs text-slate-400">-1 vida</div>
              </div>
            </div>
          </section>

          {/* Dicas */}
          <section className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl border-2 border-yellow-500/30">
            <h3 className="text-2xl font-black text-yellow-400 mb-4">💡 Dicas Importantes</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Use fones de ouvido para melhor sincronia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Ouça o metrônomo antes de começar a tocar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Precisão acima de 98% garante bônus de Cachê!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Você tem 5 tentativas por fase - use com sabedoria</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            onClick={onClose}
            className="px-10 py-6 text-xl font-headline font-black bg-brand-gold hover:bg-yellow-400 text-brand-black rounded-2xl shadow-lg shadow-brand-gold/30"
          >
            Entendi! Vamos Jogar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
