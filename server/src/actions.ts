import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { desc } from "drizzle-orm";
import * as schema from "./schema";
import { addedData, seedData } from "./data/catalogs";
import theNumbersUrls from "./data/the-numbers-urls.json";

type RawFilm = {
  n?: number;
  title: string;
  release: string | null;
  budget: number;
  domestic: number;
  worldwide: number;
  rt_critics: number | null;
  rt_audience: number | null;
  cinemascore: string | null;
  url?: string;
};

type SourceLink = { title: string; url: string };
const verifiedSourceUrls = theNumbersUrls as Record<string, SourceLink[]>;

function withVerifiedUrls(name: string, rows: readonly RawFilm[]): RawFilm[] {
  const links = verifiedSourceUrls[name] ?? [];
  if (links.length !== rows.length) {
    throw new Error(`${name}: expected one verified The Numbers link per row (${rows.length}), received ${links.length}`);
  }

  // Match by title rather than position so a later spreadsheet reorder cannot
  // silently point a film at the wrong source page. Repeated DC rows consume
  // repeated links in order and still retain a link on every supplied row.
  const linksByTitle = new Map<string, SourceLink[]>();
  for (const link of links) {
    const key = normalizeTitle(link.title);
    linksByTitle.set(key, [...(linksByTitle.get(key) ?? []), link]);
  }

  const matched = rows.map((row) => {
    const matches = linksByTitle.get(normalizeTitle(row.title));
    const link = matches?.shift();
    if (!link) throw new Error(`${name}: no verified The Numbers link for ${row.title}`);
    return { ...row, url: link.url };
  });

  const leftovers = [...linksByTitle.values()].reduce((count, group) => count + group.length, 0);
  if (leftovers) throw new Error(`${name}: ${leftovers} verified The Numbers links were not assigned`);
  return matched;
}

const baseCatalogs: Record<string, readonly RawFilm[]> = {
  Pixar: withVerifiedUrls("Pixar", seedData.Pixar),
  MCU: withVerifiedUrls("MCU", seedData.MCU),
  "Star Wars": withVerifiedUrls("Star Wars", seedData["Star Wars"]),
  // Keep all 55 spreadsheet rows exactly as supplied. The workbook contains a
  // later DC ratings block with repeated titles; it is part of the requested
  // page and therefore must not be silently merged away.
  DC: withVerifiedUrls("DC", seedData.DC),
  Transformers: withVerifiedUrls("Transformers", seedData.Transformers),
  "Fast & Furious": withVerifiedUrls("Fast & Furious", seedData["Fast & Furious"]),
};

const addedCatalogs: Record<string, readonly RawFilm[]> = {
  "James Cameron": addedData["James Cameron"],
  "Christopher Nolan": addedData["Christopher Nolan"],
  "Harry Potter": addedData["Harry Potter"],
};

const singleFilms: readonly RawFilm[] = seedData._singles.map((row) => ({
  ...row,
  release: null,
  rt_critics: null,
  rt_audience: null,
  cinemascore: null,
}));

const catalogMeta = [
  { id: "pixar", name: "Pixar", group: "franchise", accent: "#36a4e8", mark: "pixar" },
  { id: "mcu", name: "MCU", group: "franchise", accent: "#ef3340", mark: "marvel" },
  { id: "star-wars", name: "Star Wars", group: "franchise", accent: "#ffd83d", mark: "starwars" },
  { id: "dc", name: "DC", group: "franchise", accent: "#3e8be8", mark: "dc" },
  { id: "transformers", name: "Transformers", group: "franchise", accent: "#b7c0c9", mark: "transformers" },
  { id: "fast-furious", name: "Fast & Furious", group: "franchise", accent: "#ff7138", mark: "fast" },
  { id: "james-cameron", name: "James Cameron", group: "director", accent: "#25b7d3", mark: "cameron" },
  { id: "christopher-nolan", name: "Christopher Nolan", group: "director", accent: "#d5dde5", mark: "nolan" },
  { id: "harry-potter", name: "Harry Potter", group: "franchise", accent: "#d7a94b", mark: "harrypotter" },
] as const;

const filmSchema = z.object({
  n: z.number(),
  title: z.string(),
  release: z.string().nullable(),
  budget: z.number(),
  domestic: z.number(),
  worldwide: z.number(),
  rt_critics: z.number().nullable(),
  rt_audience: z.number().nullable(),
  cinemascore: z.string().nullable(),
  source_url: z.string().nullable(),
  valid: z.boolean(),
});

const searchMatchSchema = z.object({
  id: z.string(),
  title: z.string(),
  release: z.string().nullable(),
  budget: z.number(),
  domestic: z.number(),
  worldwide: z.number(),
  source_url: z.string(),
  as_of: z.string(),
  from_cache: z.boolean(),
});

function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sourceUrl(row: RawFilm | undefined) {
  if (!row?.url) return null;
  try {
    return validatedNumbersMovieUrl(row.url);
  } catch {
    // A title is linked only when the source supplied an exact canonical movie
    // URL. Search URLs belong exclusively to the Single Film search workflow.
    return null;
  }
}

function cleanFilms(rows: readonly RawFilm[]) {
  // The JSON files are a row-for-row extraction of the workbook. Preserve
  // their order, duplicate rows, display titles, and source figures exactly;
  // negative derived values are meaningful when that is what the sheet data
  // produces.
  return rows.map((row, index) => ({
    n: row.n ?? index + 1,
    title: row.title,
    release: row.release,
    budget: row.budget,
    domestic: row.domestic,
    worldwide: row.worldwide,
    rt_critics: row.rt_critics,
    rt_audience: row.rt_audience,
    cinemascore: row.cinemascore,
    source_url: sourceUrl(row),
    valid:
      Number.isFinite(row.budget) &&
      Number.isFinite(row.domestic) &&
      Number.isFinite(row.worldwide) &&
      row.worldwide >= row.domestic,
  }));
}

function toSearchMatch(row: typeof schema.filmLookupCache.$inferSelect, fromCache: boolean) {
  return {
    id: `cached:${row.id}`,
    title: row.title,
    release: row.release,
    budget: row.budget,
    domestic: row.domestic,
    worldwide: row.worldwide,
    source_url: row.sourceUrl,
    as_of: row.retrievedAt.toISOString(),
    from_cache: fromCache,
  };
}

function textFromHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replaceAll("&nbsp;", " ").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).replace(/\s+/g, " ").trim();
}

function validatedNumbersMovieUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "www.the-numbers.com" || !url.pathname.startsWith("/movie/")) throw new Error("Unsupported source URL");
  return value;
}

function parseWeeklyProgression(html: string) {
  // Prefer the full-week table: its grosses add up to the running total and the
  // last total equals the domestic gross. The weekend table (Fri-Sun only) is
  // the fallback for pages without one.
  const heading = "Box Office Performance";
  let start = html.search(/Weekly Box Office Performance/i);
  if (start < 0) start = html.search(/Weekend Box Office Performance/i);
  if (start < 0) return [];
  const rest = html.slice(start + heading.length);
  const end = rest.search(/(?:Weekend Box Office Performance|Weekly Box Office Performance|Daily Box Office Performance|Box Office Summary Per Territory|Home Market Performance)/i);
  const section = end > 0 ? rest.slice(0, end) : rest.slice(0, 120000);
  const rows: Array<{ week: number; date: string; gross: number; cumulative: number }> = [];
  for (const match of section.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const rowHtml = match[1];
    if (!rowHtml) continue;
    const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => textFromHtml(cell[1] ?? ""));
    if (cells.length < 5) continue;
    const date = cells[0]?.match(/[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}/)?.[0];
    if (!date) continue;
    const amounts = cells.map((cell) => cell.match(/\$([0-9,]+)/)?.[1]).filter((value): value is string => Boolean(value)).map((value) => Number(value.replaceAll(",", "")));
    const gross = amounts[0];
    const cumulative = amounts.at(-1);
    if (gross == null || cumulative == null) continue;
    const weekCell = cells.at(-1)?.match(/\d+/)?.[0];
    rows.push({ week: weekCell ? Number(weekCell) : rows.length + 1, date, gross, cumulative });
  }
  return rows.slice(0, 80);
}

export const Actions = {
  listCatalogs: defineAction({
    request: z.object({}),
    response: z.object({
      catalogs: z.array(z.object({
        id: z.string(),
        name: z.string(),
        group: z.enum(["franchise", "director"]),
        accent: z.string(),
        mark: z.string(),
        film_count: z.number(),
        valid_count: z.number(),
      })),
    }),
    async handler() {
      return {
        catalogs: catalogMeta.map((meta) => {
          const source = baseCatalogs[meta.name] ?? addedCatalogs[meta.name] ?? [];
          const rows = cleanFilms(source);
          return { ...meta, film_count: source.length, valid_count: rows.filter((row) => row.valid).length };
        }),
      };
    },
  }),

  getCatalog: defineAction({
    request: z.object({ id: z.string() }),
    response: z.object({
      catalog: z.object({
        id: z.string(),
        name: z.string(),
        group: z.enum(["franchise", "director"]),
        accent: z.string(),
        mark: z.string(),
        films: z.array(filmSchema),
      }).nullable(),
    }),
    async handler(_ctx, args) {
      const meta = catalogMeta.find((item) => item.id === args.id);
      if (!meta) return { catalog: null };
      const source = baseCatalogs[meta.name] ?? addedCatalogs[meta.name] ?? [];
      return { catalog: { ...meta, films: cleanFilms(source) } };
    },
  }),

  getMarketOverview: defineAction({
    request: z.object({}),
    response: z.object({
      years: z.array(z.object({
        year: z.number(),
        films: z.number().nullable(),
        domestic: z.number().nullable(),
        top10: z.number(),
        source_url: z.string().nullable(),
        as_of: z.string().nullable(),
        tiers_estimated: z.boolean(),
        tiers: z.array(z.object({ name: z.string(), revenue: z.number(), films: z.number() })),
        top_films: z.array(z.object({ rank: z.number(), title: z.string(), gross: z.number() })),
      })),
    }),
    async handler() {
      const source2024 = "https://www.the-numbers.com/market/2024/summary";
      const source2025 = "https://www.the-numbers.com/market/2025/summary";
      const topFilms2024 = [
        { rank: 1, title: "Inside Out 2", gross: 652_980_194 },
        { rank: 2, title: "Deadpool & Wolverine", gross: 636_745_858 },
        { rank: 3, title: "Wicked", gross: 432_943_285 },
        { rank: 4, title: "Moana 2", gross: 404_017_489 },
        { rank: 5, title: "Despicable Me 4", gross: 361_004_205 },
        { rank: 6, title: "Beetlejuice Beetlejuice", gross: 294_100_435 },
        { rank: 7, title: "Dune Part Two", gross: 282_709_065 },
        { rank: 8, title: "Twisters", gross: 267_762_265 },
        { rank: 9, title: "Godzilla x Kong", gross: 196_805_338 },
        { rank: 10, title: "Kung Fu Panda 4", gross: 193_590_620 },
      ];
      const sourceTiers2024 = [
        { name: ">$200M", revenue: 439_981_243.89, films: 0 },
        { name: "$100–200M", revenue: 1_581_129_888.42, films: 14 },
        { name: "$50–100M", revenue: 1_592_696_807.06, films: 34 },
        { name: "$25–50M", revenue: 1_028_045_053.6, films: 65 },
        { name: "$10–25M", revenue: 585_455_017.94, films: 85 },
        { name: "<$10M", revenue: 212_917_257.09, films: 364 },
      ];
      const revenueBase = sourceTiers2024.reduce((sum, tier) => sum + tier.revenue, 0);
      const countBase = sourceTiers2024.reduce((sum, tier) => sum + tier.films, 0);
      const remaining2025 = 8_715_978_892 - 3_282_660_879;
      const remainingFilms2025 = 670 - 10;
      const rawCounts = sourceTiers2024.map((tier) => remainingFilms2025 * tier.films / countBase);
      const estimatedCounts = rawCounts.map(Math.floor);
      const countRemainder = remainingFilms2025 - estimatedCounts.reduce((sum, count) => sum + count, 0);
      [...rawCounts.keys()]
        .sort((a, b) => {
          const right = rawCounts[b] ?? 0;
          const left = rawCounts[a] ?? 0;
          return (right - Math.floor(right)) - (left - Math.floor(left));
        })
        .slice(0, countRemainder)
        .forEach((index) => { estimatedCounts[index] = (estimatedCounts[index] ?? 0) + 1; });
      const estimatedTiers2025 = sourceTiers2024.map((tier, index) => ({
        name: tier.name,
        revenue: Math.round(remaining2025 * tier.revenue / revenueBase),
        films: estimatedCounts[index] ?? 0,
      }));

      const years: Array<{
        year: number;
        films: number | null;
        domestic: number | null;
        top10: number;
        source_url: string | null;
        as_of: string | null;
        tiers_estimated: boolean;
        tiers: Array<{ name: string; revenue: number; films: number }>;
        top_films: Array<{ rank: number; title: string; gross: number }>;
      }> = [];
      for (const row of seedData._yearly) {
        if (row.year === 2025) {
          years.push({
            year: 2025,
            films: 670,
            domestic: 8_715_978_892,
            top10: 3_282_660_879,
            source_url: source2025,
            as_of: null,
            tiers_estimated: true,
            tiers: estimatedTiers2025,
            top_films: [],
          });
          continue;
        }
        if (row.films == null || row.domestic == null || row.top10 == null || row.tier2 == null || row.tier3 == null || row.tier4 == null || row.tier5 == null || row.tier6 == null || row.tier7 == null || row.n_t2 == null || row.n_t3 == null || row.n_t4 == null || row.n_t5 == null || row.n_t6 == null || row.n_t7 == null) continue;
        const is2024 = row.year === 2024;
        years.push({
          year: row.year,
          films: row.films,
          domestic: is2024 ? 8_604_990_784 : row.domestic,
          top10: is2024 ? 3_722_658_754 : row.top10,
          source_url: is2024 ? source2024 : null,
          as_of: null,
          tiers_estimated: false,
          tiers: is2024 ? sourceTiers2024 : [
            { name: ">$200M", revenue: row.tier2, films: row.n_t2 },
            { name: "$100–200M", revenue: row.tier3, films: row.n_t3 },
            { name: "$50–100M", revenue: row.tier4, films: row.n_t4 },
            { name: "$25–50M", revenue: row.tier5, films: row.n_t5 },
            { name: "$10–25M", revenue: row.tier6, films: row.n_t6 },
            { name: "<$10M", revenue: row.tier7, films: row.n_t7 },
          ],
          top_films: is2024 ? topFilms2024 : [],
        });
      }
      // 2026 is still running. The redesigned The Numbers year page lists the
      // top-grossing films but no longer publishes a yearly total or film count,
      // so those stay null rather than being estimated.
      const topFilms2026 = [
        { rank: 1, title: "Spider-Man: Brand New Day", gross: 958_944_095 },
        { rank: 2, title: "The Odyssey", gross: 625_595_435 },
        { rank: 3, title: "Toy Story 5", gross: 480_294_461 },
        { rank: 4, title: "The Super Mario Galaxy Movie", gross: 429_814_610 },
        { rank: 5, title: "Michael", gross: 372_303_388 },
        { rank: 6, title: "Project Hail Mary", gross: 344_050_007 },
        { rank: 7, title: "Obsession", gross: 263_451_715 },
        { rank: 8, title: "The Devil Wears Prada 2", gross: 220_556_651 },
        { rank: 9, title: "Backrooms", gross: 197_523_512 },
        { rank: 10, title: "Minions & Monsters", gross: 183_171_260 },
      ];
      years.push({
        year: 2026,
        films: null,
        domestic: null,
        top10: topFilms2026.reduce((sum, film) => sum + film.gross, 0),
        source_url: "https://www.the-numbers.com/market/2026/top-grossing-movies",
        as_of: "2026-11-07",
        tiers_estimated: false,
        tiers: [],
        top_films: topFilms2026,
      });
      return { years };
    },
  }),

  listFilmOptions: defineAction({
    request: z.object({}),
    response: z.object({ options: z.array(z.object({ id: z.string(), catalog_id: z.string(), catalog_title: z.string(), title: z.string(), release: z.string().nullable(), budget: z.number(), domestic: z.number(), worldwide: z.number(), rt_critics: z.number().nullable(), rt_audience: z.number().nullable(), cinemascore: z.string().nullable() })) }),
    async handler(ctx) {
      const seeded = catalogMeta.flatMap((definition) => {
        const source = baseCatalogs[definition.name] ?? addedCatalogs[definition.name] ?? [];
        return source.map((film, index) => ({ id: `${definition.id}:${index}`, catalog_id: definition.id, catalog_title: definition.name, title: film.title, release: film.release ?? null, budget: film.budget, domestic: film.domestic, worldwide: film.worldwide, rt_critics: film.rt_critics ?? null, rt_audience: film.rt_audience ?? null, cinemascore: film.cinemascore ?? null }));
      });
      const singles = singleFilms.map((film, index) => ({ id: `single:${index}`, catalog_id: "single", catalog_title: "Single-film sheet", title: film.title, release: null, budget: film.budget, domestic: film.domestic, worldwide: film.worldwide, rt_critics: null, rt_audience: null, cinemascore: null }));
      const cached = await ctx.db<typeof schema>().select().from(schema.filmLookupCache);
      return { options: [...seeded, ...singles, ...cached.map((row) => ({ id: `cached:${row.id}`, catalog_id: "cached", catalog_title: "Single-film searches", title: row.title, release: row.release, budget: row.budget, domestic: row.domestic, worldwide: row.worldwide, rt_critics: null, rt_audience: null, cinemascore: null }))] };
    },
  }),

  getFilmProgression: defineAction({
    request: z.object({ film_id: z.string() }),
    response: z.object({
      status: z.enum(["available", "unavailable"]),
      weeks: z.array(z.object({ week: z.number(), date: z.string(), gross: z.number(), cumulative: z.number() })),
      checked_at: z.string(),
    }),
    async handler(ctx, args) {
      const unavailable = () => ({ status: "unavailable" as const, weeks: [], checked_at: new Date().toISOString() });
      let suppliedUrl: string | null = null;
      let filmTitle: string | null = null;
      if (args.film_id.startsWith("cached:")) {
        const id = Number(args.film_id.slice(7));
        const rows = await ctx.db<typeof schema>().select().from(schema.filmLookupCache);
        const row = rows.find((candidate) => candidate.id === id);
        suppliedUrl = row?.sourceUrl ?? null;
        filmTitle = row?.title ?? null;
      } else {
        const [catalogId, indexText] = args.film_id.split(":");
        const index = Number(indexText);
        if (catalogId === "single") {
          suppliedUrl = sourceUrl(singleFilms[index]);
          filmTitle = singleFilms[index]?.title ?? null;
        } else {
          const definition = catalogMeta.find((item) => item.id === catalogId);
          const rows = definition ? (baseCatalogs[definition.name] ?? addedCatalogs[definition.name] ?? []) : [];
          suppliedUrl = sourceUrl(rows[index]);
          filmTitle = rows[index]?.title ?? null;
        }
      }
      if (!suppliedUrl || !filmTitle) return unavailable();
      try {
        let movieUrl: string | null = null;
        try {
          movieUrl = validatedNumbersMovieUrl(suppliedUrl);
        } catch {
          // Spreadsheet rows provide titles but not canonical links. Resolve a
          // real movie URL through search instead of constructing a slug.
          const search = await ctx.tool.web_search(`site:the-numbers.com/movie "${filmTitle}" The Numbers`);
          const candidate = search.content.results.find((result) => {
            if (!result.url) return false;
            try { validatedNumbersMovieUrl(result.url); return true; } catch { return false; }
          });
          movieUrl = candidate?.url ? validatedNumbersMovieUrl(candidate.url) : null;
        }
        if (!movieUrl) return unavailable();
        const response = await fetch(movieUrl, { headers: { "User-Agent": "Mozilla/5.0 Film Calculator" }, signal: AbortSignal.timeout(15000) });
        if (!response.ok) return unavailable();
        const weeks = parseWeeklyProgression(await response.text());
        return { status: weeks.length ? "available" as const : "unavailable" as const, weeks, checked_at: new Date().toISOString() };
      } catch {
        return unavailable();
      }
    },
  }),

  searchFilms: defineAction({
    request: z.object({ query: z.string().trim().min(2).max(100), refresh: z.boolean().default(false) }),
    response: z.object({
      status: z.enum(["ok", "empty", "error"]),
      matches: z.array(searchMatchSchema),
      message: z.string().nullable(),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const normalized = normalizeTitle(args.query);
      const freshAfter = Date.now() - 24 * 60 * 60 * 1000;
      if (!args.refresh) {
        const cached = await db.select().from(schema.filmLookupCache).orderBy(desc(schema.filmLookupCache.retrievedAt)).limit(100);
        const matches = cached.filter((row) => row.retrievedAt.getTime() >= freshAfter && (row.normalizedTitle.includes(normalized) || normalized.includes(row.normalizedTitle))).slice(0, 5);
        if (matches.length > 0) return { status: "ok" as const, matches: matches.map((row) => toSearchMatch(row, true)), message: null };
      }

      try {
        // This is the managed equivalent of the user-authorized
        // /search?searchterm=TITLE lookup. Two tightly scoped queries improve
        // the chance that the search result exposes all required figures while
        // keeping The Numbers as the only accepted source.
        const [primary, financials] = await Promise.all([
          ctx.tool.web_search(`site:the-numbers.com/movie "${args.query}" The Numbers`),
          ctx.tool.web_search(`site:the-numbers.com/movie "${args.query}" "Production Budget" "Domestic Box Office" "Worldwide Box Office"`),
        ]);
        const candidates = [...primary.content.results, ...financials.content.results]
          .filter((result) => {
            if (!result.url || !result.snippet) return false;
            try { validatedNumbersMovieUrl(result.url); return true; } catch { return false; }
          })
          .filter((result, index, all) => all.findIndex((candidate) => candidate.url === result.url) === index)
          .slice(0, 10);
        if (candidates.length === 0) return { status: "empty" as const, matches: [], message: "No complete The Numbers result was found for that title." };

        const extracted = await ctx.inference.complete(
          `Extract film records only when title, production budget, domestic box office, and worldwide box office are explicitly present in these The Numbers results. Never infer, combine different films, or fill missing values. Prefer the canonical www.the-numbers.com result when duplicates exist.\n${JSON.stringify(candidates)}`,
          {
            schema: z.object({
              matches: z.array(z.object({
                title: z.string(),
                url: z.string(),
                release: z.string().nullable(),
                budget: z.number().nullable(),
                domestic: z.number().nullable(),
                worldwide: z.number().nullable(),
              })).max(5),
            }),
          },
        );

        const validUrls = new Set(candidates.map((candidate) => candidate.url).filter((url): url is string => url != null));
        const now = new Date();
        const complete = extracted.matches.filter((match) => validUrls.has(match.url) && match.budget != null && match.domestic != null && match.worldwide != null && match.worldwide >= match.domestic);
        for (const match of complete) {
          const values = {
            normalizedTitle: normalizeTitle(match.title),
            title: match.title.replace(/\s+-\s+Box Office.*$/i, ""),
            release: match.release,
            budget: match.budget ?? 0,
            domestic: match.domestic ?? 0,
            worldwide: match.worldwide ?? 0,
            sourceUrl: match.url,
            retrievedAt: now,
          };
          await db.insert(schema.filmLookupCache).values(values).onConflictDoUpdate({ target: schema.filmLookupCache.sourceUrl, set: values });
        }
        if (complete.length === 0) return { status: "empty" as const, matches: [], message: "The Numbers results did not include a complete budget and box-office record." };
        const saved = await db.select().from(schema.filmLookupCache).orderBy(desc(schema.filmLookupCache.retrievedAt)).limit(20);
        const sourceUrls = new Set(complete.map((match) => match.url));
        return { status: "ok" as const, matches: saved.filter((row) => sourceUrls.has(row.sourceUrl)).map((row) => toSearchMatch(row, false)), message: null };
      } catch {
        return { status: "error" as const, matches: [], message: "The Numbers lookup is temporarily unavailable. Try again in a moment." };
      }
    },
  }),
} satisfies ActionsModule;
