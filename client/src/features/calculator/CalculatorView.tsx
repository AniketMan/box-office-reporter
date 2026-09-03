import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, type ApiResponse } from "../../api";
import { calculateFilm, money, type Split } from "../../lib";
import { ProgressionChart } from "../../components/ProgressionChart";

type SearchMatch = ApiResponse<typeof api, "searchFilms">["matches"][number];

type Props = { split: Split };

export function CalculatorView({ split }: Props) {
  const [query, setQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const search = useMutation({ mutationFn: ({ title, refresh }: { title: string; refresh: boolean }) => api.searchFilms({ query: title, refresh }) });
  const matches = search.data?.matches ?? [];
  const selected: SearchMatch | undefined = matches.find((match) => match.source_url === selectedUrl) ?? matches[0];
  const result = useMemo(() => selected ? calculateFilm(selected, split) : null, [selected, split]);

  function submit(refresh = false) {
    const title = query.trim();
    if (title.length < 2) return;
    setSelectedUrl(null);
    search.mutate({ title, refresh });
  }

  const chartData = selected && result ? [
    { name: "Budget", value: selected.budget, color: "var(--chart-muted)" },
    { name: "Domestic", value: selected.domestic, color: "var(--chart-secondary)" },
    { name: "International", value: result.international, color: "var(--chart-tertiary)" },
    { name: "Studio revenue", value: result.studioRevenue, color: "var(--accent)" },
    { name: "Studio profit", value: result.studioProfit, color: "var(--ink)" },
  ] : [];

  return (
    <section className="calculator-view">
      <header className="search-hero">
        <span className="section-label">Single film</span>
        <h1>Follow the money from box office to studio.</h1>
        <form onSubmit={(event) => { event.preventDefault(); submit(false); }} className="search-form">
          <label htmlFor="film-search">Film title</label>
          <div className="search-input-row">
            <input id="film-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Oppenheimer" autoComplete="off" />
            <button type="submit" disabled={search.isPending || query.trim().length < 2}>{search.isPending ? "Searching…" : "Search"}</button>
          </div>
        </form>
        <p className="source-note">Searches The Numbers and returns only records with an explicit budget, domestic gross, and worldwide gross.</p>
      </header>

      {search.data?.status === "empty" || search.data?.status === "error" ? (
        <div className="empty-result"><h2>No complete match</h2><p>{search.data.message}</p><button onClick={() => submit(true)}>Try again</button></div>
      ) : null}

      {matches.length > 1 && (
        <div className="match-picker">
          <span>Choose a match</span>
          <div>{matches.map((match) => <button key={match.source_url} className={selected?.source_url === match.source_url ? "active" : ""} onClick={() => setSelectedUrl(match.source_url)}>{match.title}</button>)}</div>
        </div>
      )}

      {selected && result && (
        <div className="result-stage metric-change-motion" key={selected.id}>
          <header className="result-heading">
            <div><span>{selected.from_cache ? "Cached lookup" : "Fresh lookup"}</span><h2>{selected.title}</h2><p>Retrieved {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(selected.as_of))}</p></div>
            <a href={selected.source_url} target="_blank" rel="noreferrer">View source ↗</a>
          </header>
          <div className="result-profit">
            <span>Estimated studio profit</span>
            <strong className={result.studioProfit >= 0 ? "positive" : "negative"}>{money(result.studioProfit, false)}</strong>
            <p>{money(result.studioRevenue, false)} modeled studio revenue less {money(selected.budget, false)} production budget.</p>
          </div>
          <div className="result-grid">
            <div><small>Budget</small><b>{money(selected.budget)}</b></div>
            <div><small>Domestic</small><b>{money(selected.domestic)}</b></div>
            <div><small>International</small><b>{money(result.international)}</b></div>
            <div><small>Worldwide</small><b>{money(selected.worldwide)}</b></div>
            <div><small>Gross less budget</small><b>{money(result.grossProfit)}</b></div>
            <div><small>Studio revenue</small><b>{money(result.studioRevenue)}</b></div>
          </div>
          <div className="single-chart" role="img" aria-label={`${selected.title} budget and revenue chart`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 18, left: 18, bottom: 8 }}>
                <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />
                <XAxis type="number" domain={["auto", "auto"]} tickFormatter={(value) => money(Number(value))} tick={{ fill: "var(--chart-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: "var(--text)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => money(value, false)} contentStyle={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 8, color: "var(--text)" }} />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ProgressionChart filmId={selected.id} sourceUrl={selected.source_url} title={selected.title} domestic={selected.domestic} />
          <button className="refresh-button" onClick={() => submit(true)} disabled={search.isPending}>Refresh this title</button>
        </div>
      )}
    </section>
  );
}
