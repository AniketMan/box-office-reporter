import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { api } from "./api";
import { CalculatorView } from "./features/calculator/CalculatorView";
import { CatalogView } from "./features/catalog/CatalogView";
import { MarketView } from "./features/market/MarketView";
import { ExplorerView } from "./features/explorer/ExplorerView";
import { ComparisonView } from "./features/comparison/ComparisonView";
import type { Split } from "./lib";

type Page = "calculator" | "explorer" | "comparison" | "market" | string;

const studioSplit: Split = { domestic: 60, international: 40 };
const toolLabels: Record<string, string> = {
  calculator: "Single Film",
  explorer: "All Films",
  comparison: "Compare",
  market: "Market Overview",
};

export function App() {
  const [page, setPage] = useState<Page>("pixar");
  const catalogs = useQuery({ queryKey: ["catalogs"], queryFn: () => api.listCatalogs({}) });
  const catalogList = catalogs.data?.catalogs ?? [];
  const selectedCatalog = catalogList.find((item) => item.id === page);
  const activeCatalog = selectedCatalog?.id ?? "pixar";
  const currentLabel = toolLabels[page] ?? selectedCatalog?.name ?? "Collections";

  return (
    <div className="app-frame">
      <SafeAreaTopScrim backgroundColor="#000000" />
      <header className="global-nav">
        <nav aria-label="Film analysis tools" className="global-nav-inner">
          <button className={page === "calculator" ? "active" : ""} onClick={() => setPage("calculator")}>Single Film</button>
          <button className={page === "explorer" ? "active" : ""} onClick={() => setPage("explorer")}>All Films</button>
          <button className={page === "comparison" ? "active" : ""} onClick={() => setPage("comparison")}>Compare</button>
          <button className={page === "market" ? "active" : ""} onClick={() => setPage("market")}>Market</button>
          <span className="model-label">60% domestic · 40% international</span>
        </nav>
      </header>
      <div className="sub-nav-frosted">
        <nav className="sub-nav-inner" aria-label="Film collections">
          <strong>{currentLabel}</strong>
          <div className="catalog-tabs">
            {catalogList.map((catalog) => (
              <button key={catalog.id} className={catalog.id === page ? "active" : ""} onClick={() => setPage(catalog.id)}>{catalog.name}</button>
            ))}
          </div>
          <select className="catalog-select" aria-label="Choose a collection" value={selectedCatalog?.id ?? ""} onChange={(event) => setPage(event.target.value)}>
            <option value="" disabled>Choose collection</option>
            {catalogList.map((catalog) => <option key={catalog.id} value={catalog.id}>{catalog.name} · {catalog.film_count}</option>)}
          </select>
        </nav>
      </div>
      <main className="app-content">
        {page === "calculator" ? <CalculatorView split={studioSplit} /> : page === "explorer" ? <ExplorerView split={studioSplit} /> : page === "comparison" ? <ComparisonView split={studioSplit} /> : page === "market" ? <MarketView /> : catalogs.error ? <div className="error-state">Film data could not be loaded.</div> : <CatalogView key={activeCatalog} catalogId={activeCatalog} catalogs={catalogList} onCatalogChange={setPage} split={studioSplit} />}
      </main>
    </div>
  );
}
