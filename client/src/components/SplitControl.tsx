import type { Split } from "../lib";

type Props = { split: Split; onChange: (next: Split) => void };

export function SplitControl({ split, onChange }: Props) {
  return (
    <details className="split-panel">
      <summary>
        <span>Studio share assumption</span>
        <strong>{split.domestic}% Domestic · {split.international}% International</strong>
      </summary>
      <div className="split-grid">
        <label>
          <span>Domestic studio share <b>{split.domestic}%</b></span>
          <input aria-label="Domestic studio share" type="range" min="0" max="100" step="5" value={split.domestic} onChange={(event) => onChange({ ...split, domestic: Number(event.target.value) })} />
        </label>
        <label>
          <span>International studio share <b>{split.international}%</b></span>
          <input aria-label="International studio share" type="range" min="0" max="100" step="5" value={split.international} onChange={(event) => onChange({ ...split, international: Number(event.target.value) })} />
        </label>
      </div>
      <p>The remainder represents the modeled theatrical share retained outside the studio.</p>
    </details>
  );
}
