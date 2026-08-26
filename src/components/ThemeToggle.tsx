export type ThemeName = 'classic' | 'cityConnect' | 'steelhead';

interface Props {
  theme: ThemeName;
  onChange: (theme: ThemeName) => void;
}

const LABELS: Record<ThemeName, string> = {
  classic: 'Classic',
  cityConnect: 'City Connect',
  steelhead: 'Steelhead',
};

export function ThemeToggle({ theme, onChange }: Props) {
  return (
    <div className="theme-toggle">
      {(Object.keys(LABELS) as ThemeName[]).map((key) => (
        <button
          key={key}
          className={key === theme ? 'theme-btn active' : 'theme-btn'}
          onClick={() => onChange(key)}
        >
          {LABELS[key]}
        </button>
      ))}
    </div>
  );
}