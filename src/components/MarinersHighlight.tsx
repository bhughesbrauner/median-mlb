import type { TeamRunStats } from "../utils/stats";

interface Props {
  stats: TeamRunStats | undefined;
}

export function MarinersHighlight({ stats }: Props) {
  if (!stats) return null;

  const skewedUp = stats.diff > 0;

  return (
    <div className="retro-box mariners-highlight">
      <div role="status">
        ⚾ SEATTLE MARINERS SPOTLIGHT ⚾
      </div>
      <table className="mariners-stat-table">
        <tbody>
          <tr>
            <td>Median Runs/Game</td>
            <td className="big-stat">{stats.median.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Average Runs/Game</td>
            <td className="big-stat">{stats.mean.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Difference (Avg − Median)</td>
            <td className={`big-stat ${skewedUp ? "diff-up" : "diff-down"}`}>
              {skewedUp ? "+" : ""}
              {stats.diff.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <p>Based on {stats.gamesPlayed} games played.</p>
    </div>
  );
}
