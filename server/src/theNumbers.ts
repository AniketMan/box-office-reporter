// Reads The Numbers directly: its site search for movie URLs, and a movie
// page's summary table for budget and box office.
const origin = "https://www.the-numbers.com";
const headers = { "User-Agent": "Mozilla/5.0 Film Calculator" };

export async function fetchPage(url: string) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

function words(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
}

// Movie URLs from the site search, in the site's order, keeping only those
// whose slug contains every word of the query.
export async function searchMovieUrls(query: string, limit = 5) {
  const html = await fetchPage(`${origin}/search?q=${encodeURIComponent(query)}`);
  const wanted = words(query);
  const urls: string[] = [];
  for (const match of html.matchAll(/href="(\/movie\/[^"#?]+)"/g)) {
    const path = match[1]!;
    const slug = words(decodeURIComponent(path.slice("/movie/".length)));
    if (!wanted.every((word) => slug.includes(word))) continue;
    const url = `${origin}${path}`;
    if (!urls.includes(url)) urls.push(url);
    if (urls.length >= limit) break;
  }
  return urls;
}

function amountAfter(html: string, label: RegExp) {
  const value = html.match(new RegExp(`${label.source}[\\s\\S]{0,200}?\\$([0-9,]+)`, "i"))?.[1];
  return value ? Number(value.replaceAll(",", "")) : null;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function firstDomesticRelease(html: string) {
  const cell = html.match(/Domestic Releases:<\/b><\/td>\s*<td>([\s\S]*?)<\/td>/i)?.[1];
  const date = cell?.match(/([A-Z][a-z]+) (\d{1,2})(?:st|nd|rd|th), (\d{4})/);
  const month = date ? months.indexOf(date[1]!) + 1 : 0;
  if (!date || month === 0) return null;
  return `${date[3]}-${String(month).padStart(2, "0")}-${date[2]!.padStart(2, "0")}`;
}

export async function fetchMovieRecord(url: string) {
  const html = await fetchPage(url);
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (!heading) return null;
  return {
    title: heading.replace(/<[^>]+>/g, "").replaceAll("&amp;", "&").replace(/\s*\(\d{4}\)\s*$/, "").trim(),
    release: firstDomesticRelease(html),
    budget: amountAfter(html, /Production&nbsp;Budget:/),
    domestic: amountAfter(html, /<b>Domestic Box Office<\/b>/),
    worldwide: amountAfter(html, /<b>Worldwide Box Office<\/b>/),
    url,
  };
}
