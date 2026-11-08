import { SecondaryButton } from "@typglow/sdk/ui";

export type MetricOption<T extends string> = { id: T; label: string; color: string };

type Props<T extends string> = {
  options: readonly MetricOption<T>[];
  active: readonly T[];
  onChange: (next: T[]) => void;
  ariaLabel: string;
};

// Any number of metrics can be on at once (the last one cannot be turned off).
// An "on" key is the kit's gold key held down; "off" is the graphite key.
export function MetricToggles<T extends string>({ options, active, onChange, ariaLabel }: Props<T>) {
  function toggle(id: T) {
    if (active.includes(id)) {
      if (active.length > 1) onChange(active.filter((value) => value !== id));
      return;
    }
    onChange(options.map((option) => option.id).filter((value) => value === id || active.includes(value)));
  }

  return (
    <div className="metric-toggles" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const on = active.includes(option.id);
        return (
          <SecondaryButton key={option.id} color={on ? "gold" : "graphite"} size="sm" pressed={on} ariaLabel={`${option.label}${on ? ", shown" : ", hidden"}`} onClick={() => toggle(option.id)}>
            <i className="metric-dot" style={{ background: option.color }} aria-hidden="true" />{option.label}
          </SecondaryButton>
        );
      })}
    </div>
  );
}
