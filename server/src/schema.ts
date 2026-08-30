import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const filmLookupCache = sqliteTable(
  "film_lookup_cache",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    normalizedTitle: text("normalized_title").notNull(),
    title: text("title").notNull(),
    release: text("release"),
    budget: integer("budget").notNull(),
    domestic: integer("domestic").notNull(),
    worldwide: integer("worldwide").notNull(),
    sourceUrl: text("source_url").notNull(),
    retrievedAt: integer("retrieved_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    uniqueIndex("film_lookup_cache_source_url_unique").on(table.sourceUrl),
    index("film_lookup_cache_normalized_title_idx").on(table.normalizedTitle),
  ],
);
