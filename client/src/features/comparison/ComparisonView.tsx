import { useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SecondaryButton, SegmentedTabs, TextInput } from "@typglow/sdk/ui";
import { api, type ApiResponse } from "../../api";
import { MetricToggles } from "../../components/MetricToggles";
import { barCursor, calculateFilm, lineCursor, money, shortDate, type Split } from "../../lib";

type Film = ApiResponse<typeof api, "listFilmOptions">["options"][number];
type Metric = "budget" | "domestic" | "international" | "worldwide" | "grossProfit" | "studioRevenue" | "studioProfit";
type WeeklyMode = "cumulative" | "gross";

const maxFilms = 8;
const colors = ["#efb35b", "#4f9bd8", "#d87555", "#83b89a", "#b58bd2", "#e48ab0", "#8dc7c7", "#d4c47a"];
const metrics: Array<{ id: Metric; label: string; color: string; description: string }> = [
  { id: "worldwide", label: "Worldwide", color: "var(--app-accent)", description: "Total ticket sales everywhere: domestic plus international." },
  { id: "domestic", label: "Domestic", color: "var(--chart-secondary)", description: "Ticket sales in the US and Canada." },
  { id: "international", label: "International", color: "var(--chart-tertiary)", description: "Ticket sales outside the US and Canada: worldwide minus domestic." },
  { id: "budget", label: "Budget", color: "var(--chart-muted)", description: "Reported production budget. Marketing is not included." },
  { id: "grossProfit", label: "Gross profit", color: "var(--series-4)", description: "Worldwide gross minus budget, before theaters take their share." },
  { id: "studioRevenue", label: "Studio revenue", color: "var(--series-5)", description: "The studio's modeled share: 60% of domestic plus 40% of international." },
  { id: "studioProfit", label: "Studio profit", color: "var(--series-6)", description: "Studio revenue minus budget." },
];
const tooltipStyle = { background: "var(--app-card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" };

function shortTitle(title: string) {
  return title.length > 18 ? `${title.slice(0, 17)}…` : title;
}

export function ComparisonView({ split }: { split: Split }) {
  const query = useQuery({ queryKey: ["film-options"], queryFn: () => api.listFilmOptions({}), staleTime: Infinity });
  const films = query.data?.options ?? [];
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>(["worldwide", "budget", "studioRevenue", "studioProfit"]);
  const [weeklyMode, setWeeklyMode] = useState<WeeklyMode>("cumulative");
  const matches = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return films.filter((film) => !needle || `${film.title} ${film.catalog_title} ${film.release ?? ""}`.toLowerCase().includes(needle)).slice(0, 30);
  }, [films, search]);
  const selected = selectedIds.map((id) => films.find((film) => film.id === id)).filter((film): film is Film => Boolean(film));

  // Same query key as ProgressionChart, so a film already opened elsewhere is not fetched twice.
  const progressions = useQueries({
    queries: selected.map((film) => ({
      queryKey: ["film-progression", film.id],
      queryFn: () => api.getFilmProgression({ film_id: film.id }),
      staleTime: 6 * 60 * 60 * 1000,
    })),
  });

  const weeklyData = useMemo(() => {
    const byWeek = new Map<number, Record<string, number>>();
    selected.forEach((film, index) => {
      const weeks = progressions[index]?.data?.status === "available" ? progressions[index]?.data?.weeks ?? [] : [];
      for (const week of weeks) {
        const row = byWeek.get(week.week) ?? { week: week.week };
        row[film.id] = weeklyMode === "cumulative" ? week.cumulative : week.gross;
        byWeek.set(week.week, row);
      }
    });
    return [...byWeek.values()].sort((a, b) => (a.week ?? 0) - (b.week ?? 0));
  }, [selected, progressions, weeklyMode]);
  const weeklyLoading = progressions.some((result) => result.isPending);
  const withoutWeekly = selected.filter((_, index) => !progressions[index]?.isPending && progressions[index]?.data?.status !== "available");

  const totalsData = selected.map((film) => {
    const calc = calculateFilm(film, split);
    return { name: film.title, budget: film.budget, domestic: film.domestic, international: calc.international, worldwide: film.worldwide, grossProfit: calc.grossProfit, studioRevenue: calc.studioRevenue, studioProfit: calc.studioProfit };
  });

  function toggle(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length >= maxFilms ? current : [...current, id]);
  }


  const full = selectedIds.length >= maxFilms;

  if (query.isPending) return <div className="loading-state">Loading comparison index…</div>;
  if (query.error) return <div className="error-state">The comparison index could not be loaded.</div>;
  return <section className="comparison-view">
    <header className="comparison-hero"><span className="section-label">Film comparison</span><h1>Put the movies next to each other.</h1><p>Choose up to {maxFilms} films from every collection. Your selection stays together while you compare the numbers.</p></header>
    <div className="comparison-picker">
      <TextInput label="Find films" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or collection" />
      <div className="comparison-picker-meta"><span aria-live="polite">{full ? `${maxFilms} of ${maxFilms} selected · remove one to add another` : `${selected.length} of ${maxFilms} selected`}</span><SecondaryButton color="graphite" size="sm" onClick={() => setSelectedIds([])} disabled={!selected.length}>Clear all</SecondaryButton></div>
      <div className="comparison-options" aria-label="Film options">{matches.map((film) => <button type="button" key={film.id} className={selectedIds.includes(film.id) ? "selected" : ""} aria-pressed={selectedIds.includes(film.id)} disabled={full && !selectedIds.includes(film.id)} onClick={() => toggle(film.id)}><span>{selectedIds.includes(film.id) ? "✓" : "+"}</span><b>{film.title}</b><small>{film.catalog_title}{film.release ? ` · ${film.release.slice(0, 4)}` : ""}</small></button>)}</div>
    </div>
    {!selected.length ? <div className="comparison-empty"><h2>Pick films to compare</h2><p>Select titles above. Each one you add stays in the charts and table until you remove it.</p></div> : <>
      <section className="comparison-summary">
        <div className="section-heading">
          <div><span>Domestic run · The Numbers</span><h2>Week by week</h2></div>
          <SegmentedTabs ariaLabel="Weekly value" tabs={[{ id: "cumulative", label: "Running total" }, { id: "gross", label: "Weekly gross" }]} value={weeklyMode} onChange={(id) => setWeeklyMode(id as WeeklyMode)} />
        </div>
        {weeklyData.length ? (
          <div className="comparison-chart weekly-chart" role="img" aria-label={`${weeklyMode === "cumulative" ? "Running domestic total" : "Weekly domestic gross"} by week of release`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 12, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="week" tickFormatter={(value) => `W${value}`} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
                <Tooltip cursor={lineCursor} formatter={(value: number, name: string) => [money(value, false), name]} labelFormatter={(value) => `Week ${value}`} contentStyle={tooltipStyle} />
                <Legend />
                {selected.map((film, index) => progressions[index]?.data?.status === "available" && <Line key={film.id} type="monotone" dataKey={film.id} name={film.title} stroke={colors[index % colors.length]} strokeWidth={2.5} dot={false} connectNulls />)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="comparison-note">{weeklyLoading ? "Checking The Numbers for each film’s weekly run…" : "None of the selected films has a weekly run on The Numbers."}</p>}
        {weeklyData.length > 0 && weeklyLoading && <p className="comparison-note">Still loading some films’ weekly runs…</p>}
        {withoutWeekly.length > 0 && <p className="comparison-note">No weekly data on The Numbers for {withoutWeekly.map((film) => film.title).join(", ")}. Nothing is estimated.</p>}
      </section>

      <section className="comparison-summary">
        <div className="section-heading">
          <div><span>Pick any number of metrics</span><h2>Totals</h2></div>
        </div>
        <MetricToggles options={metrics} active={activeMetrics} onChange={setActiveMetrics} ariaLabel="Metrics to chart" />
        <div className="comparison-chart totals-chart" role="img" aria-label={`${activeMetrics.length} metrics for ${selected.length} films`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={totalsData} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="name" interval={0} tickFormatter={shortTitle} tick={{ fill: "var(--text)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
              <Tooltip cursor={barCursor} formatter={(value: number, name: string) => [money(value, false), name]} contentStyle={tooltipStyle} />
              {metrics.filter((item) => activeMetrics.includes(item.id)).map((item) => <Bar key={item.id} dataKey={item.id} name={item.label} fill={item.color} radius={[3, 3, 0, 0]} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>Film</th><th>Collection</th><th>Release</th><th>Budget</th><th>Domestic</th><th>International</th><th>Worldwide</th><th>Intl. share</th><th>Gross profit</th><th>Studio revenue</th><th>Studio profit</th><th>Source</th></tr></thead><tbody>{selected.map((film, index) => { const calc = calculateFilm(film, split); return <tr key={film.id}><th><span className="swatch" style={{ background: colors[index % colors.length] }} />{film.title}<button className="remove-film" onClick={() => toggle(film.id)} aria-label={`Remove ${film.title}`}>×</button></th><td>{film.catalog_title}</td><td>{shortDate(film.release)}</td><td>{money(film.budget, false)}</td><td>{money(film.domestic, false)}</td><td>{money(calc.international, false)}</td><td>{money(film.worldwide, false)}</td><td>{film.worldwide ? `${(calc.international / film.worldwide * 100).toFixed(1)}%` : "—"}</td><td className={calc.grossProfit >= 0 ? "positive" : "negative"}>{money(calc.grossProfit, false)}</td><td>{money(calc.studioRevenue, false)}</td><td className={calc.studioProfit >= 0 ? "positive" : "negative"}>{money(calc.studioProfit, false)}</td><td>{film.id.startsWith("cached:") ? "Cached" : "Sheet"}</td></tr>})}</tbody></table></div>
    </>}
  </section>;
}
