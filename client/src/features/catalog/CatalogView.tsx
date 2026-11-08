import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SegmentedTabs, Select, TextInput } from "@typglow/sdk/ui";
import { api, type ApiResponse } from "../../api";
import { average, calculateFilm, cinemaScoreOrder, money, shortDate, type Split } from "../../lib";
// Marvel prints "STUDIOS" in white on dark grounds; this copy only swaps that black fill.
import marvelLogo from "../../assets/marvel-studios-on-dark.svg";
import starWarsLogo from "../../assets/starwars-mask.png";
import dcLogo from "../../assets/dc-studios.svg";
import harryPotterLogo from "../../assets/harrypotter.png";
import pixarLogo from "../../assets/pixar-mask.png";
import transformersLogo from "../../assets/transformers.png";
import fastFuriousLogo from "../../assets/fast-furious-mask.png";

type Film = ApiResponse<typeof api, "getCatalog">["catalog"] extends infer C ? C extends { films: Array<infer F> } ? F : never : never;
type SortKey = "release" | "title" | "budget" | "domestic" | "international" | "worldwide" | "grossProfit" | "studioRevenue" | "studioProfit" | "rt_critics" | "rt_audience" | "cinemascore";

type FinancialTotals = { budget: number; domestic: number; international: number; worldwide: number; grossProfit: number; studioRevenue: number; studioProfit: number };
type FilmSummary = { totals: FinancialTotals; count: number; averages: FinancialTotals; avgCritic: number | null; avgAudience: number | null };

const sortOptions = [
  { value: "release:asc", label: "Release date ↑" },
  { value: "release:desc", label: "Release date ↓" },
  { value: "title:asc", label: "Title A–Z" },
  { value: "title:desc", label: "Title Z–A" },
  { value: "budget:desc", label: "Budget high–low" },
  { value: "domestic:desc", label: "Domestic high–low" },
  { value: "international:desc", label: "International high–low" },
  { value: "worldwide:desc", label: "Worldwide high–low" },
  { value: "grossProfit:desc", label: "Gross profit high–low" },
  { value: "studioRevenue:desc", label: "Studio revenue high–low" },
  { value: "studioProfit:desc", label: "Studio profit high–low" },
  { value: "rt_critics:desc", label: "RT critics high–low" },
  { value: "rt_audience:desc", label: "RT audience high–low" },
  { value: "cinemascore:asc", label: "CinemaScore A–Z" },
];

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
      {mark === "cameron" && <span>The films of</span>}
      <strong>{name}</strong>
    </div>
  );
}

function rating(value: number | null) {
  return value == null ? "—" : `${Math.round(value)}%`;
}

export function CatalogView({ catalogId, split }: Props) {
  const [sort, setSort] = useState<SortKey>("worldwide");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");
  const [groupByPhase, setGroupByPhase] = useState(true);
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>(() => Object.fromEntries(mcuPhases.map((phase) => [phase.name, true])));
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
      if (sort === "cinemascore") return cinemaScoreOrder(film.cinemascore);
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
    else { setSort(key); setDirection(key === "release" || key === "title" || key === "cinemascore" ? "asc" : "desc"); }
  }

  const sortIndicator = (key: SortKey) => sort === key ? (direction === "asc" ? " ↑" : " ↓") : "";

  if (query.isPending) return <div className="loading-state">Loading collection…</div>;
  if (query.error || !catalog || !summary) return <div className="error-state">That collection could not be loaded.</div>;

  const chartData = [
    { name: "Budget", value: summary.totals.budget, color: "var(--chart-muted)" },
    { name: "Domestic", value: summary.totals.domestic, color: "var(--chart-secondary)" },
    { name: "International", value: summary.totals.international, color: "var(--chart-tertiary)" },
    { name: "Studio revenue", value: summary.totals.studioRevenue, color: "var(--app-accent)" },
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
      <header className="catalog-hero">
        <BrandMark mark={catalog.mark} name={catalog.name} />
        <div className={`hero-stat ${sort === "worldwide" && direction === "desc" ? "hero-stat-pair" : ""}`} aria-live="polite">
          <div className="hero-metric-motion" key={`${sort}-${direction}`}>
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
              <Tooltip formatter={(value: number) => money(value, false)} contentStyle={{ background: "var(--app-card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} />
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
            <SegmentedTabs ariaLabel="Phase grouping" tabs={[{ id: "grouped", label: "By phase" }, { id: "all", label: "All films" }]} value={groupByPhase ? "grouped" : "all"} onChange={(id) => setGroupByPhase(id === "grouped")} />
          )}
          <TextInput label="Filter films" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Title, year, score…" />
          <Select label="Sort" value={`${sort}:${direction}`} options={sortOptions} onChange={(event) => { const [key, nextDirection] = event.target.value.split(":"); setSort(key as SortKey); setDirection(nextDirection as "asc" | "desc"); }} />
        </div>
      </div>

      {catalogId === "mcu" && groupByPhase ? (
        <div className="phase-stack ledger-results-motion" key={`phases-${sort}-${direction}`} aria-label="MCU phases">
          {phaseGroups.map((phase) => {
            const isOpen = openPhases[phase.name] ?? true;
            return (
            <section className="phase-section" key={phase.name} data-open={isOpen}>
              <button type="button" className="phase-heading" aria-expanded={isOpen} onClick={() => setOpenPhases((current) => ({ ...current, [phase.name]: !isOpen }))}>
                <span className="phase-name"><small>Marvel Cinematic Universe</small><strong>{phase.name}</strong></span>
                <span className="phase-meta"><b>{phase.summary.count} films</b><span>{money(phase.summary.totals.worldwide)} worldwide</span></span>
                <span className="phase-chevron" aria-hidden="true">⌄</span>
              </button>
              <div className="phase-collapse">
              <div className="phase-content">
                {phase.films.length ? (
                  <>
                    <div className="film-table-card phase-table-card">
                      <div className="film-table-scroll"><table className="film-table">
                        <colgroup>{columns.map(([key]) => <col key={key} className={sort === key ? "is-sorted" : ""} />)}</colgroup>
                        <thead><tr>{columns.map(([key, label]) => <th key={key} className={key === "title" ? "title-cell" : ""} aria-sort={sort === key ? (direction === "asc" ? "ascending" : "descending") : "none"}><button onClick={() => sortBy(key)} aria-label={`Sort ${phase.name} by ${label}`}>{label}{sortIndicator(key)}</button></th>)}</tr></thead>
                        <tbody key={`${phase.name}-${sort}-${direction}`} className="film-rows-motion">{phase.films.map((film, index) => { const calc = calculateFilm(film, split); return (
                          <tr key={`${film.n}-${film.title}-${index}`}>
                            <td>{shortDate(film.release)}</td><td className="title-cell">{film.source_url ? <a href={film.source_url} target="_blank" rel="noreferrer">{film.title} ↗</a> : film.title}</td><td>{money(film.budget, false)}</td><td>{money(film.domestic, false)}</td><td>{money(calc.international, false)}</td><td>{money(film.worldwide, false)}</td><td>{money(calc.grossProfit, false)}</td><td>{money(calc.studioRevenue, false)}</td><td>{money(calc.studioProfit, false)}</td><td>{rating(film.rt_critics)}</td><td>{rating(film.rt_audience)}</td><td>{film.cinemascore ?? "—"}</td>
                          </tr>
                        ); })}</tbody>
                        <tfoot>
                          <tr><th colSpan={2}>{phase.name} totals</th><td>{money(phase.summary.totals.budget, false)}</td><td>{money(phase.summary.totals.domestic, false)}</td><td>{money(phase.summary.totals.international, false)}</td><td>{money(phase.summary.totals.worldwide, false)}</td><td>{money(phase.summary.totals.grossProfit, false)}</td><td>{money(phase.summary.totals.studioRevenue, false)}</td><td>{money(phase.summary.totals.studioProfit, false)}</td><td>—</td><td>—</td><td>—</td></tr>
                          <tr><th colSpan={2}>{phase.name} averages</th><td>{money(phase.summary.averages.budget, false)}</td><td>{money(phase.summary.averages.domestic, false)}</td><td>{money(phase.summary.averages.international, false)}</td><td>{money(phase.summary.averages.worldwide, false)}</td><td>{money(phase.summary.averages.grossProfit, false)}</td><td>{money(phase.summary.averages.studioRevenue, false)}</td><td>{money(phase.summary.averages.studioProfit, false)}</td><td>{rating(phase.summary.avgCritic)}</td><td>{rating(phase.summary.avgAudience)}</td><td>—</td></tr>
                        </tfoot>
                      </table></div>
                    </div>
                  </>
                ) : <p className="phase-empty">No films in this phase match the current filter.</p>}
              </div>
              </div>
            </section>
            );
          })}
        </div>
      ) : (
        <div className="ledger-results-motion" key={`all-${sort}-${direction}`}>
          <div className="film-table-card">
            <div className="film-table-scroll"><table className="film-table">
              <colgroup>{columns.map(([key]) => <col key={key} className={sort === key ? "is-sorted" : ""} />)}</colgroup>
              <thead><tr>{columns.map(([key, label]) => <th key={key} className={key === "title" ? "title-cell" : ""} aria-sort={sort === key ? (direction === "asc" ? "ascending" : "descending") : "none"}><button onClick={() => sortBy(key)} aria-label={`Sort by ${label}`}>{label}{sortIndicator(key)}</button></th>)}</tr></thead>
              <tbody key={`${sort}-${direction}`} className="film-rows-motion">{sortedFilms.map((film, index) => { const calc = calculateFilm(film, split); return (
                <tr key={`${film.n}-${film.title}-${index}`}>
                  <td>{shortDate(film.release)}</td><td className="title-cell">{film.source_url ? <a href={film.source_url} target="_blank" rel="noreferrer">{film.title} ↗</a> : film.title}</td><td>{money(film.budget, false)}</td><td>{money(film.domestic, false)}</td><td>{money(calc.international, false)}</td><td>{money(film.worldwide, false)}</td><td>{money(calc.grossProfit, false)}</td><td>{money(calc.studioRevenue, false)}</td><td>{money(calc.studioProfit, false)}</td><td>{rating(film.rt_critics)}</td><td>{rating(film.rt_audience)}</td><td>{film.cinemascore ?? "—"}</td>
                </tr>
              ); })}</tbody>
              <tfoot>
                <tr><th colSpan={2}>Totals</th><td>{money(summary.totals.budget, false)}</td><td>{money(summary.totals.domestic, false)}</td><td>{money(summary.totals.international, false)}</td><td>{money(summary.totals.worldwide, false)}</td><td>{money(summary.totals.grossProfit, false)}</td><td>{money(summary.totals.studioRevenue, false)}</td><td>{money(summary.totals.studioProfit, false)}</td><td>—</td><td>—</td><td>—</td></tr>
                <tr><th colSpan={2}>Per-film averages</th><td>{money(summary.averages.budget, false)}</td><td>{money(summary.averages.domestic, false)}</td><td>{money(summary.averages.international, false)}</td><td>{money(summary.averages.worldwide, false)}</td><td>{money(summary.averages.grossProfit, false)}</td><td>{money(summary.averages.studioRevenue, false)}</td><td>{money(summary.averages.studioProfit, false)}</td><td>—</td><td>—</td><td>—</td></tr>
                <tr><th colSpan={2}>Average ratings</th><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>{rating(summary.avgCritic)}</td><td>{rating(summary.avgAudience)}</td><td>—</td></tr>
              </tfoot>
            </table></div>
          </div>
        </div>
      )}
    </section>
  );
}
