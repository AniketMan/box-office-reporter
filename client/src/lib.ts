export type Split = { domestic: number; international: number };

export type FinancialInput = {
  budget: number;
  domestic: number;
  worldwide: number;
};

export function calculateFilm(input: FinancialInput, split: Split) {
  const international = input.worldwide - input.domestic;
  const studioRevenue = input.domestic * (split.domestic / 100) + international * (split.international / 100);
  return {
    international,
    studioRevenue,
    grossProfit: input.worldwide - input.budget,
    studioProfit: studioRevenue - input.budget,
  };
}

export function money(value: number, compact = true) {
  if (compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: value >= 1_000_000_000 ? 2 : 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function shortDate(value: string | null) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function average(values: Array<number | null>) {
  const real = values.filter((value): value is number => value != null);
  return real.length ? real.reduce((sum, value) => sum + value, 0) / real.length : null;
}
