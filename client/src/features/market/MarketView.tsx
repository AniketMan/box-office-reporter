import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, type ApiResponse } from "../../api";
import { money } from "../../lib";

type MarketYear = ApiResponse<typeof api, "getMarketOverview">["years"][number];
type MarketMetric = "domestic" | "films" | "top10" | "average" | "tiers";

const metricOptions: Array<{ id: MarketMetric; label: string }> = [
  { id: "domestic", label: "Total domestic" },
  { id: "films", label: "Films released" },
  { id: "top10", label: "Top-10 gross" },
  { id: "average", label: "Average per film" },
  { id: "tiers", label: "Tier breakdown" },
];

const seriesColors = ["var(--accent)", "var(--chart-secondary)", "var(--chart-tertiary)", "var(--series-4)", "var(--series-5)", "var(--series-6)", "var(--series-7)"];

function metricValue(year: MarketYear, metric: Exclude<MarketMetric, "tiers">) {
  if (metric === "films") return year.films;
  if (metric === "top10") return year.top10;
  if (metric === "average") return year.domestic / year.films;
  return year.domestic;
}

export function MarketView() {
  const query = useQuery({ queryKey: ["market-overview"], queryFn: () => api.getMarketOverview({}) });
  const years = query.data?.years ?? [];
  const initialYears = useMemo(() => years.slice(-3).map((year) => year.year), [years]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [focusYear, setFocusYear] = useState<number | null>(null);
  const [metric, setMetric] = useState<MarketMetric>("domestic");
  const comparedYears = selectedYears.length ? selectedYears : initialYears;
  const active = years.find((year) => year.year === focusYear) ?? years[years.length - 1];
  const selectedData = useMemo(() => years.filter((year) => comparedYears.includes(year.year)), [years, comparedYears]);
  const scalarData = useMemo(() => metric === "tiers" ? [] : selectedData.map((year) => ({ year: String(year.year), value: metricValue(year, metric) })), [selectedData, metric]);
  const tierData = useMemo(() => {
    const tierNames = years.flatMap((year) => year.tiers.map((tier) => tier.name)).filter((name, index, all) => all.indexOf(name) === index);
    return tierNames.map((name) => Object.fromEntries([
      ["name", name],
      ...selectedData.map((year) => [String(year.year), year.tiers.find((tier) => tier.name === name)?.revenue ?? 0]),
    ]));
  }, [years, selectedData]);

  if (query.isPending) return <div className="loading-state">Loading the market ledger…</div>;
  if (query.error || !active) return <div className="error-state">Market data could not be loaded.</div>;

  const topShare = active.top10 / active.domestic * 100;
  const currentMetric = metricOptions.find((option) => option.id === metric)?.label ?? "Metric";

  function toggleYear(year: number) {
    if (comparedYears.includes(year)) {
      if (comparedYears.length <= 2) return;
      setSelectedYears(comparedYears.filter((value) => value !== year));
      return;
    }
    setSelectedYears([...comparedYears, year].sort((a, b) => a - b));
  }

  return (
    <section className="market-view">
      <header className="market-hero">
        <span className="section-label">Domestic market</span>
        <h1>Compare the shape of the box office.</h1>
        <div className="market-big-number"><strong>{topShare.toFixed(1)}%</strong><span>of {active.year} domestic gross came from the top ten.</span></div>
        <label className="focus-year-control">Focused year
          <select aria-label="Focused market year" value={active.year} onChange={(event) => setFocusYear(Number(event.target.value))}>
            {years.map((year) => <option key={year.year} value={year.year}>{year.year}</option>)}
          </select>
        </label>
      </header>

      <section className="market-control-deck" aria-label="Market chart controls">
        <div className="control-group">
          <div><span>Comparison years</span><small>Select at least two years</small></div>
          <div className="year-picker" aria-label="Years to compare">
            {years.map((year) => {
              const selected = comparedYears.includes(year.year);
              return <button key={year.year} className={selected ? "active" : ""} aria-pressed={selected} disabled={selected && comparedYears.length <= 2} onClick={() => toggleYear(year.year)}>{year.year}</button>;
            })}
          </div>
        </div>
        <div className="control-group">
          <div><span>Metric</span><small>{currentMetric}</small></div>
          <div className="metric-picker" role="group" aria-label="Market metric">
            {metricOptions.map((option) => <button key={option.id} className={metric === option.id ? "active" : ""} aria-pressed={metric === option.id} onClick={() => setMetric(option.id)}>{option.label}</button>)}
          </div>
        </div>
      </section>

      <div className="market-stats">
        <div><small>Total domestic</small><b>{money(active.domestic)}</b></div>
        <div><small>Films released</small><b>{active.films.toLocaleString()}</b></div>
        <div><small>Top ten</small><b>{money(active.top10)}</b></div>
        <div><small>Average per film</small><b>{money(active.domestic / active.films)}</b></div>
      </div>

      <section className="chart-panel market-comparison-panel">
        <div className="section-heading">
          <div><span>{comparedYears.length}-year comparison</span><h2>{currentMetric}</h2></div>
          <p>{comparedYears.join(" · ")}</p>
        </div>
        <div className="chart-wrap market-comparison-chart" role="img" aria-label={`${currentMetric} comparison for ${comparedYears.join(", ")}`}>
          <ResponsiveContainer width="100%" height="100%">
            {metric === "tiers" ? (
              <LineChart data={tierData} margin={{ top: 16, right: 12, left: -2, bottom: 4 }}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
                <Tooltip formatter={(value: number) => money(value, false)} contentStyle={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} />
                <Legend />
                {selectedData.map((year, index) => <Line key={year.year} type="monotone" dataKey={String(year.year)} name={`${year.year}${year.tiers_estimated ? " estimate" : ""}`} stroke={seriesColors[index % seriesColors.length]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />)}
              </LineChart>
            ) : (
              <BarChart data={scalarData} margin={{ top: 16, right: 12, left: -2, bottom: 4 }}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "var(--chart-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => metric === "films" ? Number(value).toLocaleString() : money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
                <Tooltip formatter={(value: number) => metric === "films" ? Number(value).toLocaleString() : money(value, false)} contentStyle={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} />
                <Bar dataKey="value" name={currentMetric} fill="var(--accent)" radius={[5, 5, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        {metric === "tiers" && selectedData.some((year) => year.tiers_estimated) && <p className="chart-estimate-note">2025 tier revenue and film counts are estimates derived proportionally from the 2024 tier distribution; the 2025 annual totals are sourced figures.</p>}
      </section>

      <section className="tier-section">
        <div className="section-heading"><div><span>{active.year} tiers</span><h2>Revenue beyond the top ten</h2></div><p>{active.tiers_estimated ? "Estimated from 2024 distribution" : "Tier model"}</p></div>
        {active.tiers_estimated && <div className="estimate-badge">Estimate — proportional to 2024 tier revenue and film-count shares</div>}
        <div className="tier-list">
          {active.tiers.map((tier) => {
            const max = Math.max(...active.tiers.map((item) => item.revenue));
            return <div className="tier-row" key={tier.name}><span>{tier.name}</span><div className="tier-track"><i style={{ width: `${tier.revenue / max * 100}%` }} /></div><b>{money(tier.revenue)}</b><small>{tier.films} films{active.tiers_estimated ? " est." : ""}</small></div>;
          })}
        </div>
      </section>

      {active.top_films.length > 0 && (
        <section className="top-films-section">
          <div className="section-heading"><div><span>{active.year} leaders</span><h2>Top ten films</h2></div><strong>{money(active.top10, false)}</strong></div>
          <ol>{active.top_films.map((film) => <li key={film.rank}><span>{film.rank}</span><b>{film.title}</b><strong>{money(film.gross, false)}</strong></li>)}</ol>
        </section>
      )}

      <p className="footnote">{active.source_url ? <a href={active.source_url} target="_blank" rel="noreferrer">View {active.year} source on The Numbers ↗</a> : "Earlier annual figures follow the workbook data."} {active.tiers_estimated ? "2025 tier values are estimates, not reported figures." : "Tier totals follow the workbook model and may not reconcile exactly to the annual total."}</p>
    </section>
  );
}
