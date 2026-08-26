export type DiffLevel = 'pos-1' | 'pos-2' | 'pos-3' | 'pos-4' | 'neg-1' | 'neg-2' | 'neg-3' | 'neg-4' | 'zero';

// Thresholds tuned to the observed range (~0.24 to ~1.05).
// Adjust these if a season produces values outside this band.
const THRESHOLDS = [0.3, 0.6, 0.9]; // boundaries between tier 1→2, 2→3, 3→4

export function diffColorClass(diff: number): string {
  if (diff === 0) return 'diff-zero';

  const abs = Math.abs(diff);
  let tier = 1;
  if (abs >= THRESHOLDS[2]) tier = 4;
  else if (abs >= THRESHOLDS[1]) tier = 3;
  else if (abs >= THRESHOLDS[0]) tier = 2;

  const sign = diff > 0 ? 'pos' : 'neg';
  return `diff-${sign}-${tier}`;
}