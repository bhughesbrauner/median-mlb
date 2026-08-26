export interface MlbGameTeamScore {
  team: { id: number; name: string };
  score?: number;
  isWinner?: boolean;
}

export interface MlbGame {
  gamePk: number;
  status: { abstractGameState: string; detailedState: string };
  teams: {
    away: MlbGameTeamScore;
    home: MlbGameTeamScore;
  };
}

export interface MlbScheduleDate {
  date: string;
  games: MlbGame[];
}

export interface MlbScheduleResponse {
  dates: MlbScheduleDate[];
  totalGames: number;
}