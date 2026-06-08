export function getRankName(level: number): string {
  if (level < 5) return 'Curioso';
  if (level < 10) return 'Iniciante';
  if (level < 20) return 'Estudante de Conservatório';
  if (level < 30) return 'Músico';
  if (level < 40) return 'Solista';
  if (level < 50) return 'Spalla da Orquestra';
  return 'Concertista';
}
