# Film Calculator — Build Brief (self-contained, for a fresh chat/session)

## Why this file exists
The original side chat ("Access Film Calculator Google Sheet", chat_id 0f32a337-6553-4360-9d56-93e7c28d924d) hit a session bug on 2026-08-26: `artifact_create_web_fullstack` (and `chat_create`/`chat_send_message`) receive empty arguments on every call there, so the build could never start. All data collection is DONE. If you are an agent in a fresh chat reading this: execute the build now per below, then tell the user.

## Step 1 — Create the artifact
Call `artifact_create_web_fullstack` (load the `artifact` namespace first if needed) with:
- name: `Film Calculator`
- icon_subject: `film clapperboard`
- verbatim_request (the user's own words, assembled from their original messages):
  "Can you make me an artifact for that which does the thing each page does but has the proper links and all and proper calculations and with the most up to date data from the numbers... for the single film calculator page it shouldnt just list them like it does it should let me search and then pull the data and then show me the chart. Please use both of these for this: https://github.com/pbakaus/impeccable.git and https://github.com/alan2207/bulletproof-react.git. Make the franchise pages actually have their graphics logos and styling if you can that would be fun, and could you also add a page for James Cameron and a page for Christopher Nolan and a Harry Potter page."

## Step 2 — Immediately after the create returns a slug, call `artifact_send_input` with this build brief:

### Data (already collected, verified 2026-08-26 — read these files and load into the app DB as seed data)
- `~/workspace/film-calculator/seed-data.json` — extracted from the user's Google Sheet "Film Calculator" (https://docs.google.com/spreadsheets/d/1Hn0hwbqVDmHgKTVADGk4lxgmlvK5RXZtK5nJvigWQbo/edit): franchise film tables for Pixar (28 films), MCU (38), Star Wars (11), DC (55), Transformers (7), Fast & Furious (11); `_singles` single-film examples; `_yearly` yearly market totals (2015, 2017-2019, 2022-2024; 2025 row was empty in source).
- `~/workspace/film-calculator/new-pages.json` — James Cameron (9 directed films, Terminator through Avatar: Fire and Ash), Christopher Nolan (12, Following through Oppenheimer), Harry Potter (11 = 8 HP + 3 Fantastic Beasts). Each film: title, release, budget, domestic, worldwide, rt_critics, rt_audience, cinemascore, canonical the-numbers.com URL. All financials scraped live from the-numbers.com 2026-08-26. Following/Memento have no CinemaScore (never polled) — show "—", never invent one.

### Calculation model (from the sheet's VAR tab)
- Studio keeps 60% of domestic gross, 40% of international. Theaters keep 40% domestic, 60% international.
- international = worldwide − domestic
- studio revenue = domestic × 0.6 + international × 0.4
- studio profit = studio revenue − budget
- profit = worldwide − budget

### Pages
1. Franchise pages (Pixar, MCU, Star Wars, DC, Transformers, Fast & Furious, James Cameron, Christopher Nolan, Harry Potter): per-film table — release, title, budget, domestic, international, worldwide, profit, studio revenue, studio profit, RT critics %, RT audience %, CinemaScore. Film titles link to their the-numbers.com movie pages. Franchise totals row, per-film averages, average RT scores.
2. Each franchise/director page gets its own branding: franchise logo/wordmark + themed palette (MCU red, Star Wars yellow-on-black, DC blue, Pixar blue, Transformers metallic, Fast & Furious steel, Harry Potter burgundy/gold, Cameron deep-ocean blue, Nolan dark slate).
3. Single Film Calculator: search box — user types any film title, server searches the-numbers.com (https://www.the-numbers.com/search?searchterm=TITLE), scrapes the film's page for production budget + domestic + worldwide, runs the split math, renders a chart (budget vs domestic vs international vs studio revenue vs profit). Cache scraped results in the app DB so repeats are instant.
4. Market Overview (from `_yearly`): yearly domestic gross trend, top-10 films' share vs remainder, tier breakdown (Tier 2 >$200M … Tier 7 <$10M), with charts.

### Design / engineering requirements
- Dark mode, full horizontal width on desktop (user's standing preference).
- React app structured per bulletproof-react conventions (feature-based folders).
- Styling conventions per pbakaus/impeccable (the user explicitly asked for both repos to be used).
- Real verified figures only; never fabricate data. The sheet itself had some broken formulas — use the intended formulas above, don't reproduce the sheet's mistakes.

## Step 3
Follow the build with `artifact_status`. Report completion to the user only from the builder's verified result, and hand over the app link/name in the same message.
