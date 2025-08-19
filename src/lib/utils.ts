import wordsData from '@/data/words.json';

export function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getRandomWord(): string {
  const randomIndex = Math.floor(Math.random() * wordsData.words.length);
  return wordsData.words[randomIndex];
}

export function generatePlayerId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateRoundPoints(
  isSUS: boolean,
  susGuessedCorrectly: boolean,
  wasVotedFor: boolean,
  correctVote: boolean
): number {
  let points = 0;
  
  if (isSUS) {
    // SUS gets points for not being caught
    if (!wasVotedFor) points += 2;
    // Bonus points for guessing correctly
    if (susGuessedCorrectly) points += 3;
  } else {
    // Regular players get points for correct voting
    if (correctVote) points += 2;
    // Bonus for not being voted for (showing good deception)
    if (!wasVotedFor) points += 1;
  }
  
  return points;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function assignSUSRole(players: string[]): string {
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
}

export function validateRoomCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function validatePlayerName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 20;
} 