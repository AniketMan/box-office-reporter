import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, type ApiResponse } from "../../api";
import { ProgressionChart } from "../../components/ProgressionChart";
import { calculateFilm, money, shortDate, type Split } from "../../lib";

type FilmOption = ApiResponse<typeof api, "listAllFilms">["films"][number];
type Film = NonNullable<ApiResponse<typeof api, "getFilmDetail">["film"]>;
type SortKey = "title" | "release" | "budget" | "domestic" | "international" | "worldwide" | "grossProfit" | "studioRevenue" | "studioProfit" | "rtCritics" | "rtAudience" | "cinemaScore";

type Props = { split: Split };

export function ExplorerView({ split }: Props) {
  const collection = useQuery({ queryKey: ["all-films"], queryFn: () => api.listAllFilms({}), staleTime: Infinity });
  const films: FilmOption[] = collection.data?.films ?? [];
  const catalogs = useMemo(() => [...new Map(films.map((film) => [film.catalog_id, film.catalog_title])).entries()], [films]);
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return films.filter((film) => (catalog === "all" || film.catalog_id === catalog) && (!needle || `${film.title} ${film.release ?? ""} ${film.catalog_title} ${film.rt_critics ?? ""} ${film.rt_audience ?? ""} ${film.cinemascore ?? ""}`.toLowerCase().includes(needle))).sort((a, b) => {
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "release") return (a.release ?? "").localeCompare(b.release ?? "");
      if (sortKey === "cinemaScore") return (a.cinemascore ?? "").localeCompare(b.cinemascore ?? "");
      const ac = calculateFilm(a, split);
      const bc = calculateFilm(b, split);
      if (sortKey === "international") return bc.international - ac.international;
      if (sortKey === "grossProfit") return bc.grossProfit - ac.grossProfit;
      if (sortKey === "studioRevenue") return bc.studioRevenue - ac.studioRevenue;
      if (sortKey === "studioProfit") return bc.studioProfit - ac.studioProfit;
      if (sortKey === "rtCritics") return (b.rt_critics ?? -1) - (a.rt_critics ?? -1);
      if (sortKey === "rtAudience") return (b.rt_audience ?? -1) - (a.rt_audience ?? -1);
      return b[sortKey] - a[sortKey];
    });
  }, [films, catalog, query, sortKey, split]);
  useEffect(() => { if (!filtered.some((film) => film.id === selectedId)) setSelectedId(filtered[0]?.id ?? null); }, [filtered, selectedId]);
  const selectedOption = filtered.find((film) => film.id === selectedId) ?? filtered[0];
  const detail = useQuery({ queryKey: ["film-detail", selectedOption?.id], queryFn: () => api.getFilmDetail({ id: selectedOption!.id }), enabled: Boolean(selectedOption) });
  const selected: Film | undefined = detail.data?.film ?? undefined;
  const calc = selected && selected.valid ? calculateFilm(selected, split) : null;
  const chartData = selected && calc ? [
    { name: "Budget", value: selected.budget, color: "var(--chart-muted)" }, { name: "Domestic", value: selected.domestic, color: "var(--chart-secondary)" },
    { name: "International", value: calc.international, color: "var(--chart-tertiary)" }, { name: "Studio revenue", value: calc.studioRevenue, color: "var(--accent)" },
    { name: "Gross profit", value: calc.grossProfit, color: "var(--ink)" },
  ] : [];

  return (
    <section className="explorer-view">
      <header className="explorer-heading"><div><span className="section-label">Unified film picker</span><h1>Every film. One financial lens.</h1><p>Choose any title across the collections and cached searches, then inspect its full calculation and available box-office trajectory.</p></div><b>{films.length}<small> records</small></b></header>
      <div className="explorer-controls">
        <label>Find a film<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, year, or collection" /></label>
        <label>Sort<select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}><option value="title">Title A–Z</option><option value="release">Release date</option><option value="budget">Budget high–low</option><option value="domestic">Domestic high–low</option><option value="international">International high–low</option><option value="worldwide">Worldwide high–low</option><option value="grossProfit">Gross profit high–low</option><option value="studioRevenue">Studio revenue high–low</option><option value="studioProfit">Studio profit high–low</option><option value="rtCritics">RT critics high–low</option><option value="rtAudience">RT audience high–low</option><option value="cinemaScore">CinemaScore A–Z</option></select></label>
        <label>Selected film<select aria-label="Selected film" value={selectedOption?.id ?? ""} onChange={(event) => setSelectedId(event.target.value)}>{filtered.map((film) => <option key={film.id} value={film.id}>{film.title} — {film.catalog_title}</option>)}</select></label>
      </div>
      <div className="filter-chips" aria-label="Collection filter"><button className={catalog === "all" ? "active" : ""} onClick={() => setCatalog("all")}>All</button>{catalogs.map(([id, name]) => <button key={id} className={catalog === id ? "active" : ""} onClick={() => setCatalog(id)}>{name}</button>)}</div>
      {collection.isPending ? <div className="loading-state">Loading the unified film index…</div> : collection.error ? <div className="error-state">The film index could not be loaded.</div> : !selectedOption ? <div className="empty-result"><h2>No films match</h2><p>Clear the search or choose another collection.</p></div> : detail.isPending ? <div className="loading-state">Loading {selectedOption.title}…</div> : !selected ? <div className="error-state">That film could not be loaded.</div> : !calc ? <div className="empty-result"><h2>Calculation unavailable</h2><p>This supplied row reports worldwide gross below domestic gross, so derived values are withheld.</p></div> : (
        <div className="metric-change-motion" key={selected.id}>
          <section className="explorer-stage">
            <header><div><span>{selected.catalog_title}</span><h2>{selected.title}</h2><p>{shortDate(selected.release)}{selected.as_of ? ` · retrieved ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(selected.as_of))}` : ""}</p></div>{selected.source_url ? <a href={selected.source_url} target="_blank" rel="noreferrer">The Numbers ↗</a> : <small>Source link unavailable in supplied row</small>}</header>
            <div className="film-full-row" aria-label={`${selected.title} full financial details`}>
              <div><small>Budget</small><b>{money(selected.budget, false)}</b></div><div><small>Domestic</small><b>{money(selected.domestic, false)}</b></div><div><small>International</small><b>{money(calc.international, false)}</b></div><div><small>Worldwide</small><b>{money(selected.worldwide, false)}</b></div><div><small>Profit</small><b>{money(calc.grossProfit, false)}</b></div><div><small>Studio revenue</small><b>{money(calc.studioRevenue, false)}</b></div><div><small>Studio profit</small><b>{money(calc.studioProfit, false)}</b></div><div><small>RT critics</small><b>{selected.rt_critics == null ? "—" : `${selected.rt_critics}%`}</b></div><div><small>RT audience</small><b>{selected.rt_audience == null ? "—" : `${selected.rt_audience}%`}</b></div><div><small>CinemaScore</small><b>{selected.cinemascore ?? "—"}</b></div>
            </div>
            <div className="single-chart" role="img" aria-label={`${selected.title} budget and revenue comparison`}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 18, left: 18, bottom: 8 }}><CartesianGrid stroke="var(--chart-grid)" horizontal={false} /><XAxis type="number" domain={["auto", "auto"]} tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={100} tick={{ fill: "var(--text)", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip formatter={(value: number) => money(value, false)} contentStyle={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} /><Bar dataKey="value" radius={[0, 3, 3, 0]}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></div>
          </section>
          <ProgressionChart filmId={selected.id} sourceUrl={selected.source_url} title={selected.title} domestic={selected.domestic} />
        </div>
      )}
    </section>
  );
}
