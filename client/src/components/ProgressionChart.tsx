import { useQuery } from "@tanstack/react-query";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";
import { money } from "../lib";

type Props = { filmId: string; sourceUrl: string | null; title: string; domestic: number };

export function ProgressionChart({ filmId, sourceUrl, title, domestic }: Props) {
  const progression = useQuery({
    queryKey: ["film-progression", filmId],
    queryFn: () => api.getFilmProgression({ film_id: filmId }),
    enabled: Boolean(sourceUrl),
    staleTime: 6 * 60 * 60 * 1000,
  });

  const cumulativeOnly = (message: string) => (
    <section className="progression-cumulative" aria-label={`${title} cumulative domestic gross`}>
      <div><span>Domestic progression</span><h3>Cumulative total</h3><p>{message}</p></div>
      <strong>{money(domestic, false)}</strong>
    </section>
  );

  if (!sourceUrl) return cumulativeOnly("A real weekly series is not available for this record, so only the supplied cumulative domestic gross is shown.");
  if (progression.isPending) return <div className="progression-loading">Checking The Numbers for real weekly progression…</div>;
  if (progression.error || progression.data?.status !== "available" || !progression.data.weeks.length) {
    return cumulativeOnly("The Numbers does not expose a usable weekly series for this title. No weekly values were estimated.");
  }

  return (
    <section className="progression-block">
      <header><div><span className="section-label">Domestic progression</span><h3>Weekly gross and cumulative total</h3></div><small>Checked {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(progression.data.checked_at))}</small></header>
      <div className="progression-chart" role="img" aria-label={`${title} weekly domestic gross and cumulative trend`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={progression.data.weeks} margin={{ top: 14, right: 16, left: 8, bottom: 10 }}>
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="week" tickFormatter={(value) => `W${value}`} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={58} />
            <Tooltip formatter={(value: number, name: string) => [money(value, false), name === "gross" ? "Weekly gross" : "Cumulative"]} labelFormatter={(value) => `Week ${value}`} contentStyle={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} />
            <Bar dataKey="gross" fill="var(--chart-secondary)" opacity={0.72} radius={[2, 2, 0, 0]} />
            <Line type="monotone" dataKey="cumulative" stroke="var(--accent)" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
