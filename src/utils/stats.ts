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

  // Standard (non-interpolated) median position
  const rawMedian = median(sorted)!;

  // Count how many values fall strictly below the median's integer band,
  // and how many fall exactly within it.
  const lowerBound = rawMedian - 0.5;
  const cumulativeBelow = sorted.filter((v) => v < rawMedian).length;
  const freqAtMedian = sorted.filter((v) => v === rawMedian).length;

  if (freqAtMedian === 0) {
    // Median landed exactly between two different integers (even n, no tie) —
    // already has real precision (e.g. 3.5), nothing to interpolate.
    return rawMedian;
  }

  // Interpolated median formula for grouped/discrete data:
  // L + ((n/2 - CF) / f) * h,  where h = 1 (width of one run-value band)
  const interpolated = lowerBound + ((n / 2 - cumulativeBelow) / freqAtMedian) * 1;
  return interpolated;
}