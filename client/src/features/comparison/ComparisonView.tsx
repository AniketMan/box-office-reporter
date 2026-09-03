import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, type ApiResponse } from "../../api";
import { calculateFilm, money, shortDate, type Split } from "../../lib";

type Film = ApiResponse<typeof api, "listFilmOptions">["options"][number];
type Metric = "worldwide" | "grossProfit" | "studioProfit" | "studioRevenue" | "budget";
const colors = ["#efb35b", "#4f9bd8", "#d87555", "#83b89a", "#b58bd2", "#e48ab0", "#8dc7c7", "#d4c47a"];

export function ComparisonView({ split }: { split: Split }) {
  const query = useQuery({ queryKey: ["film-options"], queryFn: () => api.listFilmOptions({}), staleTime: Infinity });
  const films = query.data?.options ?? [];
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [metric, setMetric] = useState<Metric>("worldwide");
  const matches = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return films.filter((film) => !needle || `${film.title} ${film.catalog_title} ${film.release ?? ""}`.toLowerCase().includes(needle)).slice(0, 30);
  }, [films, search]);
  const selected = selectedIds.map((id) => films.find((film) => film.id === id)).filter((film): film is Film => Boolean(film));
  const chart = selected.map((film) => ({ name: film.title, value: metric === "budget" ? film.budget : metric === "worldwide" ? film.worldwide : calculateFilm(film, split)[metric] }));

  function toggle(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length >= 8 ? current : [...current, id]);
  }

  if (query.isPending) return <div className="loading-state">Loading comparison index…</div>;
  if (query.error) return <div className="error-state">The comparison index could not be loaded.</div>;
  return <section className="comparison-view">
    <header className="comparison-hero"><span className="section-label">Film comparison</span><h1>Put the movies next to each other.</h1><p>Choose up to eight films from every collection. Your selection stays together while you compare the numbers.</p></header>
    <div className="comparison-picker">
      <label>Find films<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or collection" /></label>
      <div className="comparison-picker-meta"><span>{selected.length} selected</span><button type="button" onClick={() => setSelectedIds([])} disabled={!selected.length}>Clear all</button></div>
      <div className="comparison-options" aria-label="Film options">{matches.map((film) => <button type="button" key={film.id} className={selectedIds.includes(film.id) ? "selected" : ""} onClick={() => toggle(film.id)}><span>{selectedIds.includes(film.id) ? "✓" : "+"}</span><b>{film.title}</b><small>{film.catalog_title}{film.release ? ` · ${film.release.slice(0, 4)}` : ""}</small></button>)}</div>
    </div>
    {!selected.length ? <div className="comparison-empty"><h2>Start with two films</h2><p>Select titles above to build a real comparison instead of replacing one film at a time.</p></div> : <>
      <section className="comparison-summary"><div className="section-heading"><div><span>{selected.length} films</span><h2>Selected films</h2></div><div className="metric-picker">{(["worldwide", "budget", "grossProfit", "studioRevenue", "studioProfit"] as Metric[]).map((item) => <button key={item} className={metric === item ? "active" : ""} onClick={() => setMetric(item)}>{item === "worldwide" ? "Worldwide" : item === "grossProfit" ? "Gross profit" : item === "studioRevenue" ? "Studio revenue" : item === "studioProfit" ? "Studio profit" : "Budget"}</button>)}</div></div><div className="comparison-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart} layout="vertical" margin={{ left: 12, right: 24 }}><CartesianGrid stroke="var(--chart-grid)" horizontal={false} /><XAxis type="number" tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={170} tick={{ fill: "var(--text)", fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip formatter={(value: number) => money(value, false)} contentStyle={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} /><Bar dataKey="value" name={metric} fill="var(--accent)" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></section>
      <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>Film</th><th>Collection</th><th>Release</th><th>Budget</th><th>Worldwide</th><th>Intl. share</th><th>Gross profit</th><th>Studio profit</th><th>Source</th></tr></thead><tbody>{selected.map((film, index) => { const calc = calculateFilm(film, split); return <tr key={film.id}><th><span className="swatch" style={{ background: colors[index % colors.length] }} />{film.title}<button className="remove-film" onClick={() => toggle(film.id)} aria-label={`Remove ${film.title}`}>×</button></th><td>{film.catalog_title}</td><td>{shortDate(film.release)}</td><td>{money(film.budget, false)}</td><td>{money(film.worldwide, false)}</td><td>{(calc.international / film.worldwide * 100).toFixed(1)}%</td><td className={calc.grossProfit >= 0 ? "positive" : "negative"}>{money(calc.grossProfit, false)}</td><td className={calc.studioProfit >= 0 ? "positive" : "negative"}>{money(calc.studioProfit, false)}</td><td>{film.id.startsWith("cached:") ? "Cached" : "Sheet"}</td></tr>})}</tbody></table></div>
    </>}
  </section>;
}
