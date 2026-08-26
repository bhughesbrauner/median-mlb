import type { MlbGame } from '../types/mlb';
import type { TeamInfo } from '../data/teams';

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(values: number[]): number[] {
  if (values.length === 0) return [];
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const maxCount = Math.max(...counts.values());
  return [...counts.entries()]
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value);
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export interface TeamRunStats {
  teamId: number;
  teamName: string;
  division: string;
  median: number;         // interpolated
  rawMedian: number;      // traditional, for reference
  mean: number;
  diff: number;
  gamesPlayed: number;
}

export function computeTeamRunStats(games: MlbGame[], teams: TeamInfo[]): TeamRunStats[] {
  const runsByTeam = new Map<number, number[]>();

  for (const g of games) {
    const { away, home } = g.teams;
    if (typeof away.score === 'number') {
      const arr = runsByTeam.get(away.team.id) ?? [];
      arr.push(away.score);
      runsByTeam.set(away.team.id, arr);
    }
    if (typeof home.score === 'number') {
      const arr = runsByTeam.get(home.team.id) ?? [];
      arr.push(home.score);
      runsByTeam.set(home.team.id, arr);
    }
  }

  return teams.map((t) => {
    const runs = runsByTeam.get(t.id) ?? [];
    const rawMed = median(runs) ?? 0;
    const interpMed = interpolatedMedian(runs) ?? 0;
    const avg = mean(runs) ?? 0;
    return {
      teamId: t.id,
      teamName: t.name,
      division: t.division,
      median: interpMed,
      rawMedian: rawMed,
      mean: avg,
      diff: avg - interpMed,
      gamesPlayed: runs.length,
    };
  });
}

export function interpolatedMedian(values: number[]): number | null {
  if (values.length === 0) return null;

  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const target = n / 2;

  const distinctValues = Array.from(new Set(sorted)).sort((a, b) => a - b);

  let cumulative = 0;
  for (const v of distinctValues) {
    const freq = sorted.filter((x) => x === v).length;
    const cumulativeBefore = cumulative;
    cumulative += freq;

    if (cumulative >= target) {
      const lowerBound = v - 0.5;
      return lowerBound + ((target - cumulativeBefore) / freq) * 1;
    }
  }

  return median(sorted); // fallback, shouldn't be reached
}

export type RankKey = 'median' | 'mean' | 'diff';

export function computeRanks(stats: TeamRunStats[], key: RankKey): Map<number, number> {
  // Descending: highest value = rank 1, across all 30 teams.
  const sorted = [...stats].sort((a, b) => b[key] - a[key]);
  const ranks = new Map<number, number>();
  sorted.forEach((team, index) => {
    ranks.set(team.teamId, index + 1);
  });
  return ranks;
}