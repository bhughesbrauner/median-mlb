import { useEffect, useState } from 'react';
import { fetchScheduleForDate, extractFinalScores } from '../api/mlbApi';
import { median, mode, mean } from '../utils/stats';

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

export function ScoreStats() {
  const [date, setDate] = useState(todayIso());
  const [scores, setScores] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchScheduleForDate(date)
      .then((schedule) => {
        if (cancelled) return;
        setScores(extractFinalScores(schedule));
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
  }, [date]);

  return (
    <div>
      <label>
        Date:{' '}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <div>
          <p>Games with final scores: {scores.length / 2}</p>
          <p>Median score: {median(scores) ?? 'N/A'}</p>
          <p>Mode score(s): {mode(scores).join(', ') || 'N/A'}</p>
          <p>Mean score: {mean(scores)?.toFixed(2) ?? 'N/A'}</p>
        </div>
      )}
    </div>
  );
}