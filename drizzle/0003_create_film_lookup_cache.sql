CREATE TABLE `film_lookup_cache` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `normalized_title` text NOT NULL,
  `title` text NOT NULL,
  `release` text,
  `budget` integer NOT NULL,
  `domestic` integer NOT NULL,
  `worldwide` integer NOT NULL,
  `source_url` text NOT NULL,
  `retrieved_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `film_lookup_cache_source_url_unique` ON `film_lookup_cache` (`source_url`);
--> statement-breakpoint
CREATE INDEX `film_lookup_cache_normalized_title_idx` ON `film_lookup_cache` (`normalized_title`);