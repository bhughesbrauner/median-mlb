export type Division =
  | 'AL East' | 'AL Central' | 'AL West'
  | 'NL East' | 'NL Central' | 'NL West';

export interface TeamInfo {
  id: number;
  name: string;
  division: Division;
}

const TEAMS: TeamInfo[] = [
  // AL West
  { id: 108, name: 'Los Angeles Angels', division: 'AL West' },
  { id: 117, name: 'Houston Astros', division: 'AL West' },
  { id: 133, name: 'Athletics', division: 'AL West' },
  { id: 136, name: 'Seattle Mariners', division: 'AL West' },
  { id: 140, name: 'Texas Rangers', division: 'AL West' },
  // AL East
  { id: 110, name: 'Baltimore Orioles', division: 'AL East' },
  { id: 111, name: 'Boston Red Sox', division: 'AL East' },
  { id: 147, name: 'New York Yankees', division: 'AL East' },
  { id: 139, name: 'Tampa Bay Rays', division: 'AL East' },
  { id: 141, name: 'Toronto Blue Jays', division: 'AL East' },
  // AL Central
  { id: 145, name: 'Chicago White Sox', division: 'AL Central' },
  { id: 114, name: 'Cleveland Guardians', division: 'AL Central' },
  { id: 116, name: 'Detroit Tigers', division: 'AL Central' },
  { id: 118, name: 'Kansas City Royals', division: 'AL Central' },
  { id: 142, name: 'Minnesota Twins', division: 'AL Central' },
  // NL East
  { id: 144, name: 'Atlanta Braves', division: 'NL East' },
  { id: 146, name: 'Miami Marlins', division: 'NL East' },
  { id: 121, name: 'New York Mets', division: 'NL East' },
  { id: 143, name: 'Philadelphia Phillies', division: 'NL East' },
  { id: 120, name: 'Washington Nationals', division: 'NL East' },
  // NL Central
  { id: 112, name: 'Chicago Cubs', division: 'NL Central' },
  { id: 113, name: 'Cincinnati Reds', division: 'NL Central' },
  { id: 158, name: 'Milwaukee Brewers', division: 'NL Central' },
  { id: 134, name: 'Pittsburgh Pirates', division: 'NL Central' },
  { id: 138, name: 'St. Louis Cardinals', division: 'NL Central' },
  // NL West
  { id: 109, name: 'Arizona Diamondbacks', division: 'NL West' },
  { id: 115, name: 'Colorado Rockies', division: 'NL West' },
  { id: 119, name: 'Los Angeles Dodgers', division: 'NL West' },
  { id: 135, name: 'San Diego Padres', division: 'NL West' },
  { id: 137, name: 'San Francisco Giants', division: 'NL West' },
];

export const DIVISION_ORDER: Division[] = [
  'AL West', 'AL East', 'AL Central', 'NL East', 'NL Central', 'NL West',
];

export const MARINERS_ID = 136;

export default TEAMS;