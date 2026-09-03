# Box Office Reporter Rebuild Design

## Goal

Turn the current Film Calculator into a responsive, trustworthy box-office analysis app with complete source-linked data, useful reporting, and true multi-film comparisons.

## Current problems addressed

- Source links are maintained separately from film records and can drift from titles.
- Added director/collection pages do not use the same link-validation path as the original collections.
- Missing and duplicate source fields are not explained to users.
- Comparison state is effectively single-film.
- Weekly reporting exposes only a narrow view instead of a usable multi-film series.
- The interface emphasizes raw tables over analysis, hierarchy, and interaction.

## Design

### Data and provenance

Use a canonical film record containing a stable ID, display title, collection, release date, financial fields, ratings, CinemaScore, canonical The Numbers URL, and provenance metadata. Keep source-row identity for duplicate or alternate spreadsheet rows, but do not merge distinct source rows silently. Represent unavailable values as null and render them as “Not reported.” Validate every URL as a canonical `https://www.the-numbers.com/movie/...` URL and match links by normalized title plus release year where needed.

### Reporting

Catalog views provide headline totals, averages, ranked films, filters, sorting, and expandable detail. Financial reporting uses the existing intended model: international = worldwide - domestic; studio revenue = domestic × 0.60 + international × 0.40; studio profit = studio revenue - budget; gross profit = worldwide - budget.

The comparison workspace supports multiple films from any collection. Films can be added from tables or search, remain selected while navigating, and be removed individually or all at once. It provides aligned metric cards, a grouped financial chart, and a ratings/release comparison. A film can appear only once in the comparison set.

Weekly performance is modeled as a complete ordered series per film. The chart supports multiple selected films, a film legend, all available weeks, and a cumulative-vs-weekly toggle. If a source has no weekly data, the UI explains that instead of showing a misleading partial chart.

### Interface

Use a dark editorial dashboard aesthetic: clear page title and context, compact metric cards, restrained accent colors by collection, responsive tables, sticky comparison tray, visible “source” affordances, and deliberate loading/error/empty states. Preserve the existing full-width desktop behavior and dark mode.

### Testing

Add tests for calculation formulas, canonical URL validation, title/year link matching, duplicate-row preservation, multi-film selection, duplicate prevention, weekly-series parsing, and null-field rendering. Run typecheck, production build, and a browser-level smoke pass through catalog, search, comparison, and weekly reporting flows.

## Scope boundaries

This pass does not invent missing financial or rating values, change the intended studio split, or remove source rows solely because they look duplicated. It also does not add authentication, user accounts, or unrelated administration features.
