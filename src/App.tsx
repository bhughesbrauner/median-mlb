import { useEffect, useState } from 'react';
import { fetchSeasonSchedule, extractFinalGames } from './api/mlbApi';
import { computeTeamRunStats } from './utils/stats';
import type { TeamRunStats } from './utils/stats';
import TEAMS, { MARINERS_ID } from './data/teams';
import { MarinersHighlight } from './components/MarinersHighlight';
import { LeagueRunsTable } from './components/LeagueRunsTable';
import './App.css';

function App() {
  const [season, setSeason] = useState(new Date().getFullYear());
  const [teamStats, setTeamStats] = useState<TeamRunStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSeasonSchedule(season)
      .then((schedule) => {
        if (cancelled) return;
        const finalGames = extractFinalGames(schedule);
        setTeamStats(computeTeamRunStats(finalGames, TEAMS));
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [season]);

  const mariners = teamStats.find((t) => t.teamId === MARINERS_ID);

  return (
    <div>
      <h1>⚾ MLB Runs Per Game: Median vs Average ⚾</h1>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <label>
          Season:{' '}
          <input
            type="number"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
          />
        </label>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading full season data...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <MarinersHighlight stats={mariners} />
          <LeagueRunsTable stats={teamStats} />
        </>
      )}

      <hr style={{ margin: '32px 0' }} />
    </div>
  );
}

export default App;