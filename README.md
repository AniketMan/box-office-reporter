# Box Office Reporter

Film performance calculator - data package and build brief for the Film Calculator artifact.

## Contents
- `BUILD_BRIEF.md` - build instructions and architecture
- `seed-data.json` - 6 franchises + singles + yearly market data
- `new-pages.json` - Cameron, Nolan, Potter collections
- `the-numbers-urls.json` - 150 verified the-numbers.com canonical URLs

Formulas:
- international = worldwide - domestic
- gross profit = worldwide - budget
- studio revenue = domestic * 0.60 + international * 0.40
- studio profit = studio revenue - budget

Source: https://www.the-numbers.com
