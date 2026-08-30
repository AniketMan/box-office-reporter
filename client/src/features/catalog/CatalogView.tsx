import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, type ApiResponse } from "../../api";
import { average, calculateFilm, money, shortDate, type Split } from "../../lib";
import marvelLogo from "../../assets/marvel-mask.png";
import starWarsLogo from "../../assets/starwars-mask.png";
import dcLogo from "../../assets/dc.png";
import harryPotterLogo from "../../assets/harrypotter.png";
import pixarLogo from "../../assets/pixar-mask.png";
import transformersLogo from "../../assets/transformers.png";
import fastFuriousLogo from "../../assets/fast-furious-mask.png";

type Film = ApiResponse<typeof api, "getCatalog">["catalog"] extends infer C ? C extends { films: Array<infer F> } ? F : never : never;
type CatalogSummary = ApiResponse<typeof api, "listCatalogs">["catalogs"][number];
type SortKey = "release" | "title" | "budget" | "domestic" | "international" | "worldwide" | "grossProfit" | "studioRevenue" | "studioProfit" | "rt_critics" | "rt_audience" | "cinemascore";

type FinancialTotals = { budget: number; domestic: number; international: number; worldwide: number; grossProfit: number; studioRevenue: number; studioProfit: number };
type FilmSummary = { totals: FinancialTotals; count: number; averages: FinancialTotals; avgCritic: number | null; avgAudience: number | null };

const mcuPhases = [
  { name: "Phase 1", numbers: [1, 2, 3, 4, 5, 6] },
  { name: "Phase 2", numbers: [7, 8, 9, 10, 11, 12] },
  { name: "Phase 3", numbers: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
  { name: "Phase 4", numbers: [24, 25, 26, 27, 28, 29, 30] },
  { name: "Phase 5", numbers: [31, 32, 33, 34, 35, 36] },
  { name: "Phase 6", numbers: [37, 42] },
] as const;

function summarizeFilms(films: Film[], split: Split): FilmSummary {
  const totals = films.reduce<FinancialTotals>((acc, film) => {
    const calc = calculateFilm(film, split);
    acc.budget += film.budget;
    acc.domestic += film.domestic;
    acc.international += calc.international;
    acc.worldwide += film.worldwide;
    acc.grossProfit += calc.grossProfit;
    acc.studioRevenue += calc.studioRevenue;
    acc.studioProfit += calc.studioProfit;
    return acc;
  }, { budget: 0, domestic: 0, international: 0, worldwide: 0, grossProfit: 0, studioRevenue: 0, studioProfit: 0 });
  const count = films.length;
  return {
    totals,
    count,
    averages: Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, count ? value / count : 0])) as FinancialTotals,
    avgCritic: average(films.map((film) => film.rt_critics)),
    avgAudience: average(films.map((film) => film.rt_audience)),
  };
}

type Props = {
  catalogId: string;
  catalogs: CatalogSummary[];
  onCatalogChange: (id: string) => void;
  split: Split;
};

const logos: Record<string, string> = {
  pixar: pixarLogo,
  marvel: marvelLogo,
  starwars: starWarsLogo,
  dc: dcLogo,
  transformers: transformersLogo,
  fast: fastFuriousLogo,
  harrypotter: harryPotterLogo,
};

function BrandMark({ mark, name }: { mark: string; name: string }) {
  const image = logos[mark];
  if (image) {
    return (
      <div className={`brand-lockup brand-${mark}`}>
        <img className="brand-logo-image" src={image} alt={`${name} official mark`} />
        {mark === "transformers" && <strong>TRANSFORMERS</strong>}
      </div>
    );
  }
  if (mark === "fast") {
    return <div className="brand-type brand-fast" aria-label="Fast & Furious"><span>The Fast Saga</span><strong>FAST <i>&amp;</i> FURIOUS</strong></div>;
  }
  return (
    <div className={`brand-type brand-${mark}`} aria-label={name}>
      {mark === "cameron" && <span>FILMS OF JAMES</span>}
      <strong>{name}</strong>
    </div>
  );
}

function rating(value: number | null) {
  return value == null ? "—" : `${Math.round(value)}%`;
}

function FilmLedger({ film, split, sort }: { film: Film; split: Split; sort: SortKey }) {
  const calc = calculateFilm(film, split);
  const sortedMetric = (() => {
    if (sort === "budget") return { label: "Budget", value: money(film.budget), tone: "" };
    if (sort === "domestic") return { label: "Domestic", value: money(film.domestic), tone: "" };
    if (sort === "international") return { label: "International", value: money(calc.international), tone: "" };
    if (sort === "grossProfit") return { label: "Gross profit", value: money(calc.grossProfit), tone: calc.grossProfit >= 0 ? "positive" : "negative" };
    if (sort === "studioRevenue") return { label: "Studio revenue", value: money(calc.studioRevenue), tone: "" };
    if (sort === "studioProfit") return { label: "Studio profit", value: money(calc.studioProfit), tone: calc.studioProfit >= 0 ? "positive" : "negative" };
    if (sort === "rt_critics") return { label: "RT critics", value: rating(film.rt_critics), tone: "" };
    if (sort === "rt_audience") return { label: "RT audience", value: rating(film.rt_audience), tone: "" };
    if (sort === "cinemascore") return { label: "CinemaScore", value: film.cinemascore ?? "—", tone: "" };
    if (sort === "worldwide") return { label: "Domestic", value: money(film.domestic), tone: "" };
    return { label: "Worldwide", value: money(film.worldwide), tone: "" };
  })();
  return (
    <details className="film-ledger">
      <summary>
        <span className="film-title-wrap">
          <span className="film-title">{film.title}</span>
          <span className="film-date">{shortDate(film.release)}</span>
        </span>
        <span className="summary-money"><small>Worldwide</small>{money(film.worldwide)}</span>
        <span className={`summary-money ${sortedMetric.tone}`}><small>{sortedMetric.label}</small>{sortedMetric.value}</span>
        <span className="open-cue" aria-hidden="true">⌄</span>
      </summary>
      <div className="film-detail-grid">
        <div><small>Budget</small><b>{money(film.budget, false)}</b></div>
        <div><small>Domestic</small><b>{money(film.domestic, false)}</b></div>
        <div><small>International</small><b>{money(calc.international, false)}</b></div>
        <div><small>Worldwide</small><b>{money(film.worldwide, false)}</b></div>
        <div><small>Gross profit</small><b>{money(calc.grossProfit, false)}</b></div>
        <div><small>Studio revenue</small><b>{money(calc.studioRevenue, false)}</b></div>
        <div><small>Studio profit</small><b>{money(calc.studioProfit, false)}</b></div>
        <div><small>RT critics</small><b>{rating(film.rt_critics)}</b></div>
        <div><small>RT audience</small><b>{rating(film.rt_audience)}</b></div>
        <div><small>CinemaScore</small><b>{film.cinemascore ?? "—"}</b></div>
        <div className="film-source">{film.source_url ? <a href={film.source_url} target="_blank" rel="noreferrer">Open on The Numbers ↗</a> : <span>Source link unavailable</span>}</div>
      </div>
    </details>
  );
}

export function CatalogView({ catalogId, catalogs, onCatalogChange, split }: Props) {
  const [sort, setSort] = useState<SortKey>("worldwide");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");
  const [groupByPhase, setGroupByPhase] = useState(true);
  const query = useQuery({ queryKey: ["catalog", catalogId], queryFn: () => api.getCatalog({ id: catalogId }) });
  const catalog = query.data?.catalog;

  const summary = useMemo(() => catalog ? summarizeFilms(catalog.films, split) : null, [catalog, split]);

  const sortedFilms = useMemo(() => {
    if (!catalog) return [];
    const needle = filter.trim().toLowerCase();
    const getValue = (film: Film): string | number => {
      const calc = calculateFilm(film, split);
      if (sort === "international") return calc.international;
      if (sort === "grossProfit") return calc.grossProfit;
      if (sort === "studioRevenue") return calc.studioRevenue;
      if (sort === "studioProfit") return calc.studioProfit;
      return film[sort] ?? "";
    };
    return catalog.films
      .filter((film) => !needle || `${film.title} ${film.release ?? ""} ${film.cinemascore ?? ""} ${film.rt_critics ?? ""} ${film.rt_audience ?? ""}`.toLowerCase().includes(needle))
      .sort((a, b) => {
        const av = getValue(a); const bv = getValue(b);
        const result = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true });
        return direction === "asc" ? result : -result;
      });
  }, [catalog, sort, direction, filter, split]);

  const phaseGroups = useMemo(() => {
    if (catalogId !== "mcu") return [];
    return mcuPhases.map((phase) => {
      const numberSet = new Set<number>(phase.numbers);
      const films = sortedFilms.filter((film) => numberSet.has(film.n));
      const allFilms = catalog?.films.filter((film) => numberSet.has(film.n)) ?? [];
      return { ...phase, films, summary: summarizeFilms(allFilms, split) };
    });
  }, [catalog, catalogId, sortedFilms, split]);

  function sortBy(key: SortKey) {
    if (sort === key) setDirection((value) => value === "asc" ? "desc" : "asc");
    else { setSort(key); setDirection(key === "release" || key === "title" ? "asc" : "desc"); }
  }

  const sortIndicator = (key: SortKey) => sort === key ? (direction === "asc" ? " ↑" : " ↓") : "";

  if (query.isPending) return <div className="loading-state">Loading collection…</div>;
  if (query.error || !catalog || !summary) return <div className="error-state">That collection could not be loaded.</div>;

  const chartData = [
    { name: "Budget", value: summary.totals.budget, color: "var(--chart-muted)" },
    { name: "Domestic", value: summary.totals.domestic, color: "var(--chart-secondary)" },
    { name: "International", value: summary.totals.international, color: "var(--chart-tertiary)" },
    { name: "Studio revenue", value: summary.totals.studioRevenue, color: "var(--accent)" },
    { name: "Studio profit", value: summary.totals.studioProfit, color: "var(--ink)" },
  ];

  const columns: Array<[SortKey, string]> = [
    ["release", "Release date"], ["title", "Title"], ["budget", "Budget"], ["domestic", "Domestic"], ["international", "International"], ["worldwide", "Worldwide"], ["grossProfit", "Gross profit"], ["studioRevenue", "Studio revenue"], ["studioProfit", "Studio profit"], ["rt_critics", "RT critics %"], ["rt_audience", "RT audience %"], ["cinemascore", "CinemaScore"],
  ];

  const activeMetric = (() => {
    const financialMetrics: Partial<Record<SortKey, { label: string; key: keyof FinancialTotals }>> = {
      budget: { label: "Total budget", key: "budget" },
      domestic: { label: "Domestic gross", key: "domestic" },
      international: { label: "International gross", key: "international" },
      worldwide: { label: "Worldwide gross", key: "worldwide" },
      grossProfit: { label: "Gross profit", key: "grossProfit" },
      studioRevenue: { label: "Studio revenue", key: "studioRevenue" },
      studioProfit: { label: "Studio profit", key: "studioProfit" },
    };
    const financial = financialMetrics[sort];
    if (financial) return { label: financial.label, value: money(summary.totals[financial.key]), detail: `${summary.count} films · sorted ${direction === "desc" ? "high to low" : "low to high"}` };
    if (sort === "rt_critics") return { label: "Average RT critics", value: rating(summary.avgCritic), detail: `${summary.count} films · sorted ${direction === "desc" ? "high to low" : "low to high"}` };
    if (sort === "rt_audience") return { label: "Average RT audience", value: rating(summary.avgAudience), detail: `${summary.count} films · sorted ${direction === "desc" ? "high to low" : "low to high"}` };
    if (sort === "release") return { label: "Release order", value: direction === "asc" ? "Oldest first" : "Newest first", detail: `${summary.count} films` };
    if (sort === "title") return { label: "Title order", value: direction === "asc" ? "A–Z" : "Z–A", detail: `${summary.count} films` };
    return { label: "CinemaScore order", value: direction === "asc" ? "A–Z" : "Z–A", detail: `${summary.count} films` };
  })();

  return (
    <section className={`catalog-view theme-${catalog.mark}`}>
      <div className="mobile-catalog-picker">
        <label htmlFor="catalog-picker">Collection</label>
        <select id="catalog-picker" value={catalogId} onChange={(event) => onCatalogChange(event.target.value)}>{catalogs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      </div>

      <header className="catalog-hero">
        <BrandMark mark={catalog.mark} name={catalog.name} />
        <div className={`hero-stat ${sort === "worldwide" && direction === "desc" ? "hero-stat-pair" : ""}`} aria-live="polite">
          {sort === "worldwide" && direction === "desc" ? (
            <>
              <div className="hero-stat-item"><span>Domestic gross</span><strong>{money(summary.totals.domestic)}</strong></div>
              <div className="hero-stat-item"><span>Worldwide gross</span><strong>{money(summary.totals.worldwide)}</strong></div>
              <small>{summary.count} films · default view</small>
            </>
          ) : (
            <>
              <span>{activeMetric.label}</span>
              <strong>{activeMetric.value}</strong>
              <small>{activeMetric.detail}</small>
            </>
          )}
        </div>
      </header>

      <section className="summary-band" aria-label={`${catalog.name} totals`}>
        <div><small>Total budget</small><strong>{money(summary.totals.budget)}</strong></div>
        <div><small>Worldwide gross</small><strong>{money(summary.totals.worldwide)}</strong></div>
        <div><small>Gross profit</small><strong>{money(summary.totals.grossProfit)}</strong></div>
        <div><small>Studio revenue</small><strong>{money(summary.totals.studioRevenue)}</strong></div>
      </section>

      <div className="chart-panel">
        <div className="section-heading"><div><span>Financial overview</span><h2>Gross and revenue</h2></div><p>{summary.count} films · all values in USD</p></div>
        <div className="chart-wrap" role="img" aria-label={`${catalog.name} financial comparison bar chart`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 8, left: -8, bottom: 6 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={58} />
              <Tooltip formatter={(value: number) => money(value, false)} contentStyle={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} />
              <ReferenceLine y={0} stroke="var(--chart-grid)" />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ledger-heading">
        <div><span>Collection table</span><h2>{catalogId === "mcu" && !groupByPhase ? "All Films" : catalog.name}</h2><p>{sortedFilms.length} of {catalog.films.length} films</p></div>
        <div className="ledger-controls">
          {catalogId === "mcu" && (
            <div className="phase-toggle-field">
              <span>Phase grouping</span>
              <div className="phase-toggle" role="group" aria-label="Phase grouping">
                <button type="button" className={groupByPhase ? "active" : ""} aria-pressed={groupByPhase} onClick={() => setGroupByPhase(true)}>Grouped</button>
                <button type="button" className={!groupByPhase ? "active" : ""} aria-pressed={!groupByPhase} onClick={() => setGroupByPhase(false)}>All films</button>
              </div>
            </div>
          )}
          <label>Filter films<input aria-label="Filter films" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Title, year, score…" /></label>
          <label>Sort
            <select aria-label="Sort films" value={`${sort}:${direction}`} onChange={(event) => { const [key, nextDirection] = event.target.value.split(":"); setSort(key as SortKey); setDirection(nextDirection as "asc" | "desc"); }}>
              <option value="release:asc">Release date ↑</option><option value="release:desc">Release date ↓</option><option value="title:asc">Title A–Z</option><option value="title:desc">Title Z–A</option><option value="budget:desc">Budget high–low</option><option value="domestic:desc">Domestic high–low</option><option value="international:desc">International high–low</option><option value="worldwide:desc">Worldwide high–low</option><option value="grossProfit:desc">Gross profit high–low</option><option value="studioRevenue:desc">Studio revenue high–low</option><option value="studioProfit:desc">Studio profit high–low</option><option value="rt_critics:desc">RT critics high–low</option><option value="rt_audience:desc">RT audience high–low</option><option value="cinemascore:asc">CinemaScore A–Z</option>
            </select>
          </label>
        </div>
      </div>

      {catalogId === "mcu" && groupByPhase ? (
        <div className="phase-stack" aria-label="MCU phases">
          {phaseGroups.map((phase) => (
            <details className="phase-section" key={phase.name} open>
              <summary className="phase-heading">
                <span className="phase-name"><small>Marvel Cinematic Universe</small><strong>{phase.name}</strong></span>
                <span className="phase-meta"><b>{phase.summary.count} films</b><span>{money(phase.summary.totals.worldwide)} worldwide</span></span>
                <span className="phase-chevron" aria-hidden="true">⌄</span>
              </summary>
              <div className="phase-content">
                {phase.films.length ? (
                  <>
                    <div className="film-table-card phase-table-card">
                      <table className="film-table">
                        <colgroup>{columns.map(([key]) => <col key={key} className={sort === key ? "is-sorted" : ""} />)}</colgroup>
                        <thead><tr>{columns.map(([key, label]) => <th key={key} className={key === "title" ? "title-cell" : ""} aria-sort={sort === key ? (direction === "asc" ? "ascending" : "descending") : "none"}><button onClick={() => sortBy(key)} aria-label={`Sort ${phase.name} by ${label}`}>{label}{sortIndicator(key)}</button></th>)}</tr></thead>
                        <tbody>{phase.films.map((film, index) => { const calc = calculateFilm(film, split); return (
                          <tr key={`${film.n}-${film.title}-${index}`}>
                            <td>{shortDate(film.release)}</td><td className="title-cell">{film.source_url ? <a href={film.source_url} target="_blank" rel="noreferrer">{film.title} ↗</a> : film.title}</td><td>{money(film.budget, false)}</td><td>{money(film.domestic, false)}</td><td>{money(calc.international, false)}</td><td>{money(film.worldwide, false)}</td><td>{money(calc.grossProfit, false)}</td><td>{money(calc.studioRevenue, false)}</td><td>{money(calc.studioProfit, false)}</td><td>{rating(film.rt_critics)}</td><td>{rating(film.rt_audience)}</td><td>{film.cinemascore ?? "—"}</td>
                          </tr>
                        ); })}</tbody>
                        <tfoot>
                          <tr><th colSpan={2}>{phase.name} totals</th><td>{money(phase.summary.totals.budget, false)}</td><td>{money(phase.summary.totals.domestic, false)}</td><td>{money(phase.summary.totals.international, false)}</td><td>{money(phase.summary.totals.worldwide, false)}</td><td>{money(phase.summary.totals.grossProfit, false)}</td><td>{money(phase.summary.totals.studioRevenue, false)}</td><td>{money(phase.summary.totals.studioProfit, false)}</td><td>—</td><td>—</td><td>—</td></tr>
                          <tr><th colSpan={2}>{phase.name} averages</th><td>{money(phase.summary.averages.budget, false)}</td><td>{money(phase.summary.averages.domestic, false)}</td><td>{money(phase.summary.averages.international, false)}</td><td>{money(phase.summary.averages.worldwide, false)}</td><td>{money(phase.summary.averages.grossProfit, false)}</td><td>{money(phase.summary.averages.studioRevenue, false)}</td><td>{money(phase.summary.averages.studioProfit, false)}</td><td>{rating(phase.summary.avgCritic)}</td><td>{rating(phase.summary.avgAudience)}</td><td>—</td></tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="film-list phase-film-list">{phase.films.map((film, index) => <FilmLedger key={`${film.n}-${film.title}-${index}`} film={film} split={split} sort={sort} />)}</div>
                    <section className="phase-mobile-summary" aria-label={`${phase.name} totals and averages`}>
                      <div><small>Total budget</small><b>{money(phase.summary.totals.budget)}</b></div>
                      <div><small>Worldwide</small><b>{money(phase.summary.totals.worldwide)}</b></div>
                      <div><small>Studio profit</small><b>{money(phase.summary.totals.studioProfit)}</b></div>
                      <div><small>Average worldwide</small><b>{money(phase.summary.averages.worldwide)}</b></div>
                      <div><small>Avg. critics</small><b>{rating(phase.summary.avgCritic)}</b></div>
                      <div><small>Avg. audience</small><b>{rating(phase.summary.avgAudience)}</b></div>
                    </section>
                  </>
                ) : <p className="phase-empty">No films in this phase match the current filter.</p>}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <>
          <div className="film-table-card">
            <table className="film-table">
              <colgroup>{columns.map(([key]) => <col key={key} className={sort === key ? "is-sorted" : ""} />)}</colgroup>
              <thead><tr>{columns.map(([key, label]) => <th key={key} className={key === "title" ? "title-cell" : ""} aria-sort={sort === key ? (direction === "asc" ? "ascending" : "descending") : "none"}><button onClick={() => sortBy(key)} aria-label={`Sort by ${label}`}>{label}{sortIndicator(key)}</button></th>)}</tr></thead>
              <tbody>{sortedFilms.map((film, index) => { const calc = calculateFilm(film, split); return (
                <tr key={`${film.n}-${film.title}-${index}`}>
                  <td>{shortDate(film.release)}</td><td className="title-cell">{film.source_url ? <a href={film.source_url} target="_blank" rel="noreferrer">{film.title} ↗</a> : film.title}</td><td>{money(film.budget, false)}</td><td>{money(film.domestic, false)}</td><td>{money(calc.international, false)}</td><td>{money(film.worldwide, false)}</td><td>{money(calc.grossProfit, false)}</td><td>{money(calc.studioRevenue, false)}</td><td>{money(calc.studioProfit, false)}</td><td>{rating(film.rt_critics)}</td><td>{rating(film.rt_audience)}</td><td>{film.cinemascore ?? "—"}</td>
                </tr>
              ); })}</tbody>
              <tfoot>
                <tr><th colSpan={2}>Totals</th><td>{money(summary.totals.budget, false)}</td><td>{money(summary.totals.domestic, false)}</td><td>{money(summary.totals.international, false)}</td><td>{money(summary.totals.worldwide, false)}</td><td>{money(summary.totals.grossProfit, false)}</td><td>{money(summary.totals.studioRevenue, false)}</td><td>{money(summary.totals.studioProfit, false)}</td><td>—</td><td>—</td><td>—</td></tr>
                <tr><th colSpan={2}>Per-film averages</th><td>{money(summary.averages.budget, false)}</td><td>{money(summary.averages.domestic, false)}</td><td>{money(summary.averages.international, false)}</td><td>{money(summary.averages.worldwide, false)}</td><td>{money(summary.averages.grossProfit, false)}</td><td>{money(summary.averages.studioRevenue, false)}</td><td>{money(summary.averages.studioProfit, false)}</td><td>—</td><td>—</td><td>—</td></tr>
                <tr><th colSpan={2}>Average ratings</th><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>{rating(summary.avgCritic)}</td><td>{rating(summary.avgAudience)}</td><td>—</td></tr>
              </tfoot>
            </table>
          </div>
          <div className="film-list film-list-mobile">{sortedFilms.map((film, index) => <FilmLedger key={`${film.n}-${film.title}-${index}`} film={film} split={split} sort={sort} />)}</div>
        </>
      )}
      <section className="mobile-summary" aria-label="Collection summary rows">
        <h3>Collection summary</h3>
        <div className="mobile-summary-row">
          <strong>Totals</strong>
          <dl>
            <div><dt>Budget</dt><dd>{money(summary.totals.budget, false)}</dd></div>
            <div><dt>Domestic</dt><dd>{money(summary.totals.domestic, false)}</dd></div>
            <div><dt>International</dt><dd>{money(summary.totals.international, false)}</dd></div>
            <div><dt>Worldwide</dt><dd>{money(summary.totals.worldwide, false)}</dd></div>
            <div><dt>Gross profit</dt><dd>{money(summary.totals.grossProfit, false)}</dd></div>
            <div><dt>Studio revenue</dt><dd>{money(summary.totals.studioRevenue, false)}</dd></div>
            <div><dt>Studio profit</dt><dd>{money(summary.totals.studioProfit, false)}</dd></div>
          </dl>
        </div>
        <div className="mobile-summary-row">
          <strong>Per-film averages</strong>
          <dl>
            <div><dt>Budget</dt><dd>{money(summary.averages.budget, false)}</dd></div>
            <div><dt>Domestic</dt><dd>{money(summary.averages.domestic, false)}</dd></div>
            <div><dt>International</dt><dd>{money(summary.averages.international, false)}</dd></div>
            <div><dt>Worldwide</dt><dd>{money(summary.averages.worldwide, false)}</dd></div>
            <div><dt>Gross profit</dt><dd>{money(summary.averages.grossProfit, false)}</dd></div>
            <div><dt>Studio revenue</dt><dd>{money(summary.averages.studioRevenue, false)}</dd></div>
            <div><dt>Studio profit</dt><dd>{money(summary.averages.studioProfit, false)}</dd></div>
          </dl>
        </div>
        <div className="mobile-summary-row ratings-row"><strong>Average ratings</strong><b>{rating(summary.avgCritic)} critics · {rating(summary.avgAudience)} audience</b></div>
      </section>
    </section>
  );
}
