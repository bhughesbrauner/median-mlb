import { useState } from 'react';
import { DIVISION_ORDER, MARINERS_ID } from '../data/teams';
import type { TeamRunStats } from '../utils/stats';
import { diffColorClass } from '../utils/diffColor';

type SortKey = 'median' | 'mean' | 'diff';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'division' | 'flat';

const DIVISION_COLORS: Record<string, string> = {
  'AL West': '#8A4B24',
  'AL Central': '#5C6B26',
  'NL Central': '#2E6B47',
  'AL East': '#24597A',
  'NL West': '#4B3B8A',
  'NL East': '#7A2E62',
};

interface Props {
  stats: TeamRunStats[];
}

export function LeagueRunsTable({ stats }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('division');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }

  function indicator(key: SortKey) {
    if (sortKey !== key) return <span className="sort-arrow idle"> ⇅</span>;
    return (
      <span className="sort-arrow active">
        {sortDirection === 'asc' ? ' ▲' : ' ▼'}
      </span>
    );
  }

  function sortTeams(teams: TeamRunStats[]): TeamRunStats[] {
    if (sortKey) {
      return [...teams].sort((a, b) => {
        const delta = a[sortKey] - b[sortKey];
        return sortDirection === 'asc' ? delta : -delta;
      });
    }
    return [...teams].sort((a, b) => a.teamName.localeCompare(b.teamName));
  }

  const byDivision = DIVISION_ORDER.map((division) => ({
    division,
    teams: sortTeams(stats.filter((s) => s.division === division)),
  }));

  const flatTeams = sortTeams(stats);

  return (
    <div className="league-table-wrapper">
      <div className="view-toggle">
        <button
          className={viewMode === 'division' ? 'view-btn active' : 'view-btn'}
          onClick={() => setViewMode('division')}
        >
          By Division
        </button>
        <button
          className={viewMode === 'flat' ? 'view-btn active' : 'view-btn'}
          onClick={() => setViewMode('flat')}
        >
          All 30 Teams
        </button>
      </div>

      <table className="retro-table" cellSpacing={0} cellPadding={4} border={1}>
        <thead>
          <tr>
            <th>Team</th>
            {viewMode === 'flat' && <th>Division</th>}
            <th className="sortable" onClick={() => handleSort('median')}>
              Median RPG{indicator('median')}
            </th>
            <th className="sortable" onClick={() => handleSort('mean')}>
              Average RPG{indicator('mean')}
            </th>
            <th className="sortable" onClick={() => handleSort('diff')}>
              Diff (Avg − Median){indicator('diff')}
            </th>
          </tr>
        </thead>
        <tbody>
          {viewMode === 'division'
            ? byDivision.map(({ division, teams }) => (
                <>
                  <tr key={division} style={{ backgroundColor: DIVISION_COLORS[division] }}>
                    <td colSpan={4} className="division-header">{division}</td>
                  </tr>
                  {teams.map((t) => (
                    <tr key={t.teamId} className={t.teamId === MARINERS_ID ? 'mariners-row' : ''}>
                      <td>{t.teamName}</td>
                      <td>{t.median.toFixed(2)}</td>
                      <td>{t.mean.toFixed(2)}</td>
                      <td className={diffColorClass(t.diff)}>
                        {t.diff >= 0 ? '+' : ''}{t.diff.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </>
              ))
            : flatTeams.map((t) => (
                <tr key={t.teamId} className={t.teamId === MARINERS_ID ? 'mariners-row' : ''}>
                  <td>{t.teamName}</td>
                  <td>
                    <span
                      className="division-pill"
                      style={{ backgroundColor: DIVISION_COLORS[t.division] }}
                    >
                      {t.division}
                    </span>
                  </td>
                  <td>{t.median.toFixed(2)}</td>
                  <td>{t.mean.toFixed(2)}</td>
                  <td className={diffColorClass(t.diff)}>
                    {t.diff >= 0 ? '+' : ''}{t.diff.toFixed(2)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}