'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies anteriormente
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      // Pequeno delay para não aparecer logo na cara ao piscar na tela
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_accepted', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-[9999]"
        >
          <div className="bg-brand-graphite/90 backdrop-blur-md border border-brand-gray/20 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <p className="text-sm text-brand-gray leading-relaxed">
              Nós usamos cookies essenciais para manter sua conta segura e garantir o funcionamento da plataforma. 
              Ao continuar, você concorda com nossa{' '}
              <Link href="/politica-de-privacidade" className="text-brand-gold hover:underline font-bold">
                Política de Privacidade
              </Link>.
            </p>
            <div className="flex justify-end">
              <Button 
                onClick={handleAccept}
                className="bg-brand-gold text-brand-black hover:bg-yellow-500 font-bold px-6 py-2 rounded-xl transition-all hover:scale-105"
              >
                Entendi
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
