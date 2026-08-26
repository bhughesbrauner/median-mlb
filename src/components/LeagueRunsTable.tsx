import { DIVISION_ORDER } from '../data/teams';
import type { TeamRunStats } from '../utils/stats';
import { MARINERS_ID } from '../data/teams';

interface Props {
  stats: TeamRunStats[];
}

const DIVISION_COLORS: Record<string, string> = {
  'AL West': '#ff9900',
  'AL East': '#3366ff',
  'AL Central': '#009933',
  'NL East': '#cc0000',
  'NL Central': '#9900cc',
  'NL West': '#006666',
};

export function LeagueRunsTable({ stats }: Props) {
  const byDivision = DIVISION_ORDER.map((division) => ({
    division,
    teams: stats
      .filter((s) => s.division === division)
      .sort((a, b) => a.teamName.localeCompare(b.teamName)),
  }));

  return (
    <table className="retro-table" cellSpacing={0} cellPadding={4} border={1}>
      <thead>
        <tr>
          <th>Team</th>
          <th>Median RPG</th>
          <th>Average RPG</th>
          <th>Diff (Avg − Median)</th>
        </tr>
      </thead>
      <tbody>
        {byDivision.map(({ division, teams }) => (
          <>
            <tr key={division} style={{ backgroundColor: DIVISION_COLORS[division] }}>
              <td colSpan={4} className="division-header">{division}</td>
            </tr>
            {teams.map((t) => (
              <tr
                key={t.teamId}
                className={t.teamId === MARINERS_ID ? 'mariners-row' : ''}
              >
                <td>{t.teamName}</td>
                <td>{t.median.toFixed(2)}</td>
                <td>{t.mean.toFixed(2)}</td>
                <td>{t.diff >= 0 ? '+' : ''}{t.diff.toFixed(2)}</td>
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  );
}