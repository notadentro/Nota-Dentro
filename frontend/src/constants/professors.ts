export const PROFESSORS = {
  med: {
    id: 'med',
    displayName: 'Prof. Bohdan',
    avatar: '/avatares/med.png',
    instrument: 'Teoria Musical',
  },
  scliar: {
    id: 'scliar',
    displayName: 'Profa. Ester',
    avatar: '/avatares/scliar.png',
    instrument: 'Musicologia',
  },
  priolli: {
    id: 'priolli',
    displayName: 'Profa. Maria Luísa',
    avatar: '/avatares/priolli.png',
    instrument: 'Piano',
  },
  mascarenhas: {
    id: 'mascarenhas',
    displayName: 'Prof. Márcio',
    avatar: '/avatares/mascarenhas.png',
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
