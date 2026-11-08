import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select } from "@typglow/sdk/ui";
import { api, type ApiResponse } from "../../api";
import { money } from "../../lib";
import { MetricToggles, type MetricOption } from "../../components/MetricToggles";

type MarketYear = ApiResponse<typeof api, "getMarketOverview">["years"][number];
type Metric = "domestic" | "top10" | "rest" | "average" | "films" | "share";
type Unit = "money" | "average" | "count" | "percent";

const seriesColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--tep-green)"];
const metrics: Array<MetricOption<Metric> & { unit: Unit }> = [
  { id: "domestic", label: "Total domestic", color: seriesColors[0]!, unit: "money" },
  { id: "top10", label: "Top-ten gross", color: seriesColors[1]!, unit: "money" },
  { id: "rest", label: "Rest of market", color: seriesColors[2]!, unit: "money" },
  { id: "average", label: "Average per film", color: seriesColors[3]!, unit: "average" },
  { id: "films", label: "Films released", color: seriesColors[4]!, unit: "count" },
  { id: "share", label: "Top-ten share", color: seriesColors[5]!, unit: "percent" },
];
const tooltipStyle = { background: "var(--app-card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" };

function metricValue(year: MarketYear, metric: Metric) {
  if (metric === "top10") return year.top10;
  if (year.domestic == null) return null;
  if (metric === "domestic") return year.domestic;
  if (metric === "rest") return year.domestic - year.top10;
  if (metric === "share") return year.top10 / year.domestic * 100;
  if (year.films == null) return null;
  return metric === "films" ? year.films : year.domestic / year.films;
}

function formatUnit(unit: Unit, value: number, compact = true) {
  if (unit === "count") return Math.round(value).toLocaleString();
  if (unit === "percent") return `${value.toFixed(1)}%`;
  return money(value, compact);
}

export function MarketView() {
  const query = useQuery({ queryKey: ["market-overview"], queryFn: () => api.getMarketOverview({}) });
  const years = query.data?.years ?? [];
  const [focusYear, setFocusYear] = useState<number | null>(null);
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>(["domestic", "top10"]);
  const tierNames = useMemo(() => [...new Set(years.flatMap((year) => year.tiers.map((tier) => tier.name)))], [years]);
  const tierOptions = tierNames.map((name, index) => ({ id: name, label: name, color: seriesColors[index % seriesColors.length]! }));
  const [hiddenTiers, setHiddenTiers] = useState<string[]>([]);
  const activeTiers = tierNames.filter((name) => !hiddenTiers.includes(name));

  const trendData = useMemo(() => years.map((year) => Object.fromEntries([["year", String(year.year)], ...metrics.map((metric) => [metric.id, metricValue(year, metric.id)])])), [years]);
  const tierData = useMemo(() => years.filter((year) => year.tiers.length).map((year) => Object.fromEntries([["year", `${year.year}${year.tiers_estimated ? " est." : ""}`], ...year.tiers.map((tier) => [tier.name, tier.revenue])])), [years]);

  if (query.isPending) return <div className="loading-state">Loading the market ledger…</div>;
  // Open on the latest complete year; a year still running has blanks.
  const active = years.find((year) => year.year === focusYear) ?? [...years].reverse().find((year) => !year.as_of) ?? years[years.length - 1];
  if (query.error || !active) return <div className="error-state">Market data could not be loaded.</div>;

  const shown = metrics.filter((metric) => activeMetrics.includes(metric.id));
  const units = [...new Set(shown.map((metric) => metric.unit))];
  const share = active.domestic ? active.top10 / active.domestic * 100 : null;

  return (
    <section className="market-view">
      <header className="market-hero">
        <div>
          <span className="section-label">Domestic market</span>
          <h1>The shape of the box office, year by year.</h1>
        </div>
        <div className="market-year-picker">
          <Select size="sm" label="Year" value={String(active.year)} options={years.map((year) => ({ value: String(year.year), label: year.as_of ? `${year.year} (to date)` : String(year.year) }))} onChange={(event) => setFocusYear(Number(event.target.value))} />
        </div>
      </header>

      <div className="market-stats" aria-label={`${active.year} figures`}>
        <div><small>Total domestic</small><b>{active.domestic == null ? "—" : money(active.domestic)}</b></div>
        <div><small>Top-ten share</small><b>{share == null ? "—" : `${share.toFixed(1)}%`}</b></div>
        <div><small>Top-ten gross</small><b>{money(active.top10)}</b></div>
        <div><small>Films released</small><b>{active.films == null ? "—" : active.films.toLocaleString()}</b></div>
        <div><small>Average per film</small><b>{active.domestic == null || active.films == null ? "—" : money(active.domestic / active.films)}</b></div>
      </div>
      {active.as_of && <p className="market-note">{active.year} is still running: figures are as of {active.as_of}. The Numbers no longer publishes a yearly total or film count, so those are left blank rather than estimated.</p>}

      <section className="chart-panel">
        <div className="section-heading"><div><span>Pick any number of metrics</span><h2>Market trends</h2></div></div>
        <MetricToggles options={metrics} active={activeMetrics} onChange={setActiveMetrics} ariaLabel="Market metrics to chart" />
        <div className="chart-wrap market-trend-chart" role="img" aria-label={`${shown.map((metric) => metric.label).join(", ")} by year`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: "var(--chart-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              {/* One axis per unit in view: dollars on the left, anything else on the right. */}
              {units.map((unit, index) => <YAxis key={unit} yAxisId={unit} orientation={index === 0 ? "left" : "right"} tickFormatter={(value) => formatUnit(unit, Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />)}
              <Tooltip formatter={(value: number, name: string) => { const metric = metrics.find((item) => item.label === name); return [metric ? formatUnit(metric.unit, value, false) : value, name]; }} contentStyle={tooltipStyle} />
              <Legend />
              {shown.map((metric) => <Line key={metric.id} yAxisId={metric.unit} type="monotone" dataKey={metric.id} name={metric.label} stroke={metric.color} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="market-note">Years missing from the workbook (2016, 2020, 2021) have no points; the lines join across them.</p>
      </section>

      <section className="chart-panel">
        <div className="section-heading"><div><span>Revenue outside the top ten</span><h2>Tiers over time</h2></div></div>
        <MetricToggles options={tierOptions} active={activeTiers} onChange={(next) => setHiddenTiers(tierNames.filter((name) => !next.includes(name)))} ariaLabel="Revenue tiers to chart" />
        <div className="chart-wrap market-trend-chart" role="img" aria-label="Revenue by tier by year">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tierData} margin={{ top: 16, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: "var(--chart-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
              <Tooltip formatter={(value: number, name: string) => [money(value, false), name]} contentStyle={tooltipStyle} />
              <Legend />
              {tierOptions.filter((tier) => activeTiers.includes(tier.id)).map((tier) => <Line key={tier.id} type="monotone" dataKey={tier.id} name={tier.label} stroke={tier.color} strokeWidth={2.5} dot={{ r: 3 }} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="market-note">Tier totals follow the workbook model and may not reconcile exactly to the annual total. 2025 tiers are estimates in proportion to 2024; 2026 has no tier data yet.</p>
      </section>

      {active.top_films.length > 0 && (
        <section className="top-films-section">
          <div className="section-heading"><div><span>{active.year} leaders{active.as_of ? " to date" : ""}</span><h2>Top ten films</h2></div><strong>{money(active.top10, false)}</strong></div>
          <ol>{active.top_films.map((film) => <li key={film.rank}><span>{film.rank}</span><b>{film.title}</b><strong>{money(film.gross, false)}</strong></li>)}</ol>
        </section>
      )}

      <p className="footnote">{active.source_url ? <a href={active.source_url} target="_blank" rel="noreferrer">View {active.year} on The Numbers ↗</a> : "Earlier annual figures follow the workbook data."}</p>
    </section>
  );
}
