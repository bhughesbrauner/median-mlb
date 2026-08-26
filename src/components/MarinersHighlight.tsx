import type { TeamRunStats } from "../utils/stats";
import { diffColorClass } from "../utils/diffColor";

interface Ranks {
  median: number | null;
  mean: number | null;
  diff: number | null;
}

interface Props {
  stats: TeamRunStats | undefined;
  ranks: Ranks | null;
}

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

export function MarinersHighlight({ stats, ranks }: Props) {
  if (!stats) return null;

  return (
    <div className="retro-box mariners-highlight">
      <h3 role="status">⚾ SEATTLE MARINERS ⚾</h3>
      <table className="mariners-stat-table">
        <thead>
          <tr>
            <th></th>
            <th>Value</th>
            <th>MLB Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Median Runs/Game</td>
            <td className="big-stat">{stats.median.toFixed(2)}</td>
            <td className="big-stat">
              {ranks?.median ? ordinal(ranks.median) : '—'}
            </td>
          </tr>
          <tr>
            <td>Average Runs/Game</td>
            <td className="big-stat">{stats.mean.toFixed(2)}</td>
            <td className="big-stat">
              {ranks?.mean ? ordinal(ranks.mean) : '—'}
            </td>
          </tr>
          <tr>
            <td>Difference (Avg − Median)</td>
            <td className={`big-stat ${diffColorClass(stats.diff)}`}>
              {stats.diff >= 0 ? "+" : ""}
              {stats.diff.toFixed(2)}
            </td>
            <td className="big-stat">
              {ranks?.diff ? ordinal(ranks.diff) : '—'}
            </td>
          </tr>
        </tbody>
      </table>
      <p>Based on {stats.gamesPlayed} games played.</p>
    </div>
  );
}