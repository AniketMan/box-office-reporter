import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { ConnectionNotice, Select, TypicalAppHeader, useBarFit } from "@typglow/sdk/ui";
import { api } from "./api";
import { CalculatorView } from "./features/calculator/CalculatorView";
import { CatalogView } from "./features/catalog/CatalogView";
import { MarketView } from "./features/market/MarketView";
import { ComparisonView } from "./features/comparison/ComparisonView";
import type { Split } from "./lib";

type Page = "calculator" | "comparison" | "market" | string;

const studioSplit: Split = { domestic: 60, international: 40 };
const defaultCatalog = "pixar";
const toolLabels: Record<string, string> = {
  calculator: "Single Film",
  comparison: "Compare",
  market: "Market",
};

// The page lives in the URL hash so refresh, Back/Forward, and shared links
// land where the viewer left off.
function pageFromHash() {
  return decodeURIComponent(window.location.hash.replace(/^#\/?/, "")) || defaultCatalog;
}

export function App() {
  const [page, setPageState] = useState<Page>(pageFromHash);
  const [lastCatalog, setLastCatalog] = useState(() => toolLabels[pageFromHash()] ? defaultCatalog : pageFromHash());
  const catalogs = useQuery({ queryKey: ["catalogs"], queryFn: () => api.listCatalogs({}) });
  const catalogList = catalogs.data?.catalogs ?? [];
  const isTool = page in toolLabels;
  const selectedCatalog = catalogList.find((item) => item.id === page);
  const activeCatalog = isTool ? lastCatalog : page;
  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  // Step 0 shows every section key; step 1 folds them into one section picker.
  const fit = useBarFit(headerRef, 2);

  useEffect(() => {
    const onHashChange = () => setPageState(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // An unknown collection id in the URL falls back to the default collection.
  useEffect(() => {
    if (!isTool && catalogList.length && !selectedCatalog) setPage(defaultCatalog);
  }, [isTool, catalogList.length, selectedCatalog]);

  useEffect(() => {
    if (!isTool) setLastCatalog(page);
  }, [isTool, page]);

  // The collection bar sticks just under the header, whose height follows its content.
  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const update = () => document.documentElement.style.setProperty("--header-height", `${shell.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  function setPage(next: Page) {
    if (next === page) return;
    window.location.hash = `/${encodeURIComponent(next)}`;
  }

  const sections = [
    { id: lastCatalog, label: "Collections", active: !isTool },
    { id: "calculator", label: toolLabels.calculator!, active: page === "calculator" },
    { id: "comparison", label: toolLabels.comparison!, active: page === "comparison" },
    { id: "market", label: toolLabels.market!, active: page === "market" },
  ];

  return (
    <div className="app-frame">
      <SafeAreaTopScrim backgroundColor="#000000" />
      <div className="app-header-shell" ref={shellRef}>
        <TypicalAppHeader
          ref={headerRef}
          title="Box Office"
          navItems={fit === 0 ? sections.map((section) => ({ id: section.id, label: section.label, active: section.active, onClick: () => setPage(section.id) })) : []}
          actions={fit === 0 ? undefined : (
            <Select size="sm" aria-label="Section" value={sections.find((section) => section.active)?.id ?? ""} options={sections.map((section) => ({ value: section.id, label: section.label }))} onChange={(event) => setPage(event.target.value)} />
          )}
        />
      </div>
      {!isTool && (
        <div className="collection-bar">
          <nav className="collection-bar-inner" aria-label="Film collections">
            {/* A collection's name already leads its page, so the bar only carries the switcher. */}
            <Select
              size="sm"
              aria-label="Choose a collection"
              placeholder="Choose collection"
              value={selectedCatalog?.id ?? ""}
              options={catalogList.map((catalog) => ({ value: catalog.id, label: `${catalog.name} · ${catalog.film_count} films` }))}
              onChange={(event) => setPage(event.target.value)}
            />
            <span className="model-label">Studio share: 60% domestic · 40% international</span>
          </nav>
        </div>
      )}
      <main className="app-content">
        {page === "calculator" ? <CalculatorView split={studioSplit} /> : page === "comparison" ? <ComparisonView split={studioSplit} /> : page === "market" ? <MarketView /> : catalogs.error ? <div className="error-state">Film data could not be loaded.</div> : <CatalogView key={activeCatalog} catalogId={activeCatalog} split={studioSplit} />}
      </main>
      <ConnectionNotice />
    </div>
  );
}
