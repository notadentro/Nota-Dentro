import React from 'react';

export function AuthorFooter() {
  return (
    <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center md:items-start gap-6 bg-card p-6 rounded-2xl border">
      <div className="w-24 h-24 rounded-full bg-brand-gold/20 flex-shrink-0 overflow-hidden flex items-center justify-center relative border-2 border-brand-gold">
        <span className="text-4xl font-bold font-headline text-brand-gold">AL</span>
        {/* Quando você tiver sua foto profissional, pode substituir esta div por um <img /> ou <Image /> */}
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold font-headline mb-2 text-foreground">Annie Larcher</h3>
        <p className="text-muted-foreground text-sm leading-relaxed font-body">
          Bacharel em Música (habilitação em Flauta Transversal) pelo Conservatório Brasileiro de Música e pós-graduada em Musicoterapia pela ETEP. <strong>Fui 1º lugar geral no concurso da ESA 2019</strong>. Minha missão é simplificar a teoria musical e te ajudar a alcançar sua farda ou sua vaga na universidade!
        </p>
      </div>
    </div>
  );
}
