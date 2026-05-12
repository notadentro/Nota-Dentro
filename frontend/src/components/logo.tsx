import Image from 'next/image';
import type { ComponentProps } from 'react';

// Ajustamos as propriedades para o que o componente Image espera
export function Logo(props: Omit<ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
      src="/logo.png" // O caminho para a sua imagem na pasta public
      alt="Nota Dentro Logo"
      width={80}      // A largura padrão do seu logo
      height={80}     // A altura padrão do seu logo
      {...props}      // Permite passar outras propriedades como className
    />
  );
}
