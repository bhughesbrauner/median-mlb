import type { MlbScheduleResponse } from '../types/mlb';

const BASE_URL = 'https://statsapi.mlb.com/api/v1';

export async function fetchScheduleForDate(date: string): Promise<MlbScheduleResponse> {
  const url = `${BASE_URL}/schedule?sportId=1&date=${date}&hydrate=linescore`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`MLB API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function extractFinalScores(schedule: MlbScheduleResponse): number[] {
  const scores: number[] = [];
  for (const dateEntry of schedule.dates) {
    for (const game of dateEntry.games) {
      if (game.status.abstractGameState !== 'Final') continue;
      const awayScore = game.teams.away.score;
      const homeScore = game.teams.home.score;
      if (typeof awayScore === 'number') scores.push(awayScore);
      if (typeof homeScore === 'number') scores.push(homeScore);
    }
  }
  return scores;
}