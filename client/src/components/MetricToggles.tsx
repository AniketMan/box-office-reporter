import { PrimaryButton } from "@typglow/sdk/ui";

// `description` is shown when the key is hovered.
export type MetricOption<T extends string> = { id: T; label: string; color: string; description?: string };

type Props<T extends string> = {
  options: readonly MetricOption<T>[];
  active: readonly T[];
  onChange: (next: T[]) => void;
  ariaLabel: string;
};

// Any number of metrics can be on at once (the last one cannot be turned off).
// Black keys with a white lit edge: an "on" key is held down at full strength,
// an "off" key is dimmed (.metric-toggle-off).
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
          <PrimaryButton key={option.id} size="sm" title={option.description ?? option.label} pressed={on} className={on ? undefined : "metric-toggle-off"} ariaLabel={`${option.label}${on ? ", shown" : ", hidden"}`} onClick={() => toggle(option.id)}>
            <i className="metric-dot" style={{ background: option.color }} aria-hidden="true" />{option.label}
          </PrimaryButton>
        );
      })}
    </div>
  );
}
