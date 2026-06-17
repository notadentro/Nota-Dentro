export const PROFESSORS = {
  bohdan: {
    id: 'bohdan',
    displayName: 'Prof. Bohdan',
    avatar: '/avatares/bohdan.png',
    instrument: 'Teoria Musical',
  },
  ester: {
    id: 'ester',
    displayName: 'Profa. Ester',
    avatar: '/avatares/ester.png',
    instrument: 'Musicologia',
  },
  maria_luisa: {
    id: 'maria_luisa',
    displayName: 'Profa. Maria Luísa',
    avatar: '/avatares/maria_luisa.png',
    instrument: 'Piano',
  },
  marcio: {
    id: 'marcio',
    displayName: 'Prof. Márcio',
    avatar: '/avatares/marcio.png',
    instrument: 'Acordeão',
  },
  odette: {
    id: 'odette',
    displayName: 'Profa. Odette',
    avatar: '/avatares/odette.png',
    instrument: 'Flauta',
  },
  annie: {
    id: 'annie',
    displayName: 'Annie',
    avatar: '/avatares/annie.png',
    instrument: 'Mentora',
  }
} as const;

export type ProfessorId = keyof typeof PROFESSORS;
