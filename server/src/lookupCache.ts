// Single Film search results, kept in a JSON file so Compare can offer them
// after a restart. One row per The Numbers movie URL.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export type LookupRow = {
  id: number;
  normalizedTitle: string;
  title: string;
  release: string | null;
  budget: number;
  domestic: number;
  worldwide: number;
  sourceUrl: string;
  retrievedAt: number;
};

const cacheFile = resolve(process.cwd(), ".cache/film-lookups.json");

export async function listLookups(): Promise<LookupRow[]> {
  try {
    return JSON.parse(await readFile(cacheFile, "utf8")) as LookupRow[];
  } catch {
    return [];
  }
}

export async function upsertLookup(values: Omit<LookupRow, "id">): Promise<LookupRow> {
  const rows = await listLookups();
  const existing = rows.find((row) => row.sourceUrl === values.sourceUrl);
  const row = { ...values, id: existing?.id ?? rows.reduce((max, candidate) => Math.max(max, candidate.id), 0) + 1 };
  const next = [...rows.filter((candidate) => candidate.sourceUrl !== values.sourceUrl), row];
  await mkdir(dirname(cacheFile), { recursive: true });
  await writeFile(cacheFile, JSON.stringify(next, null, 2));
  return row;
}
