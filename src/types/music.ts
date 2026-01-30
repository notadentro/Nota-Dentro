/**
 * Matérias-primas da música segundo Esther Scliar.
 * O Som é fundamental e o Silêncio é secundário (dependente do som).
 */
export type MusicalMaterial = 'Som' | 'Silêncio';

/**
 * Qualidades básicas. 
 * O Som possui as quatro. O Silêncio possui apenas a Duração.
 */
export type MusicalQuality = 'Altura' | 'Intensidade' | 'Timbre' | 'Duração';

/**
 * Interface que define as propriedades de um Material Musical
 */
export interface MaterialProperties {
  type: MusicalMaterial;
  qualities: MusicalQuality[];
}

// Exemplo de como usar no código para validar a lógica da Scliar:
export const SILENCE_PROPERTIES: MaterialProperties = {
  type: 'Silêncio',
  qualities: ['Duração'] // Única qualidade do silêncio segundo a pág. 7
};

export const SOUND_PROPERTIES: MaterialProperties = {
  type: 'Som',
  qualities: ['Altura', 'Intensidade', 'Timbre', 'Duração']
};