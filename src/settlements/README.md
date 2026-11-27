# settlements (work in progress)

Hebrew article: when and where Jewish localities were founded, 1870 to today. Working title: כך התמלאה המפה.
Not a page on the site yet. No row on the home page.

## Files
- `data/bycode2023.xlsx`: the official CBS localities file for 2023 (קובץ היישובים), downloaded by Yonatan. Checked against the earlier GitHub mirror: founding year, type, religion code and names match on all 1,484 rows.
- `data/bycode2004.xls`: the CBS localities file for 2004, downloaded by Yonatan. Used only for the 20 localities evacuated in 2005 (16 Gaza, 4 northern Samaria): name, founding year, position.
- `prep.py` (needs openpyxl, xlrd, pyproj) makes `data.json`: 1,088 Jewish and mixed localities with a founding year, 20 evacuated ones with end year 2005, plus 4 old cities with no year (Jerusalem, Haifa, Tiberias, Tzfat).
- `gen_map.js` makes `map.json` (needs `npm i world-atlas topojson-client`).
- `page.html` is the source. `python3 build.py` writes `draft.html` (self-contained, git-ignored).
- `options-v2.html`: earlier draft with three views (live map, eight maps, year by latitude chart) and other themes. Kept for the north-south chart.

## Decisions so far
- Design: clean (white page, cool gray map), headline font IBM Plex Sans Hebrew 700, body Heebo.
- Eight periods, one color each (`THEMES` in `page.html`, checked with the dataviz palette validator). First and second aliyah are merged, and so is everything from 1977.
- New localities show as a bigger dot with a soft halo in the period color. No black outline: Yonatan disliked it.
- Tel Aviv, Be'er Sheva and Eilat are tagged and appear with their founding year.
- The eight small maps (one per period) stay in the final page under the live map. Yonatan asked for that.

## Known gaps
- Only localities that exist today. Destroyed, abandoned or evacuated places (Gush Katif, Yamit, 1948 losses) are missing and need a second source.
- CBS founding years: Lod, Ramla, Akko, Be'er Sheva are 1948. Kfar Etzion is 1967 (re-founding).
- Open: how to show West Bank and Golan localities. Open: the 1947 partition line (no map data yet, do not draw by hand).
- Still to do before publishing: build into `/settlements/`, GA tag, OG image, "← All stories", 390px check, home row.

## Found while comparing 2004 and 2023
- Evacuated localities stay on the map after 2005 as hollow gray rings and drop out of the count.
- Seven localities with a founding year are in 2004 but not in 2023 because they were merged into a neighbour, not because they ended: Kfar Azar (1932), Neve Efal (1950), Ramat Pinkas (1952), Ramat Efal (1969), Ma'ale Shomron (1980), Sha'arei Tikva (1983), Etz Efraim (1985). Yonatan asked to keep them: they are on the map as regular dots, taken from the 2004 file (`MERGED` in `prep.py`). Mergers before 2004 are not known.
- Sansana changed code and founding year (1997 in 2004, 2013 in 2023). Holon is 1933 in 2004 and 1940 in 2023. The map uses 2023.
- Gaza: CBS 2004 lists 16 localities with a founding year. Shalev is listed with no year. The other small ones are not listed.

## Page structure (draft, 26 Nov 2026)
- Opening: starts from the first one (Mikveh Israel, 1870), then 1949 with 123 localities in one year. Yonatan asked to mention the first year at the start.
- Headline: "מתי קם היישוב שלכם?" (Yonatan picked it from five options; he rejected "כך התמלאה המפה").
- "Two waves" section: names the waves (1948-1951, 1977-1989) and shows them as two small maps above the live map. He asked for that.
- Live map, then the eight period maps with four short paragraphs of numbers.
- Last chart: scatter of founding year by latitude, in an earth ramp (`EARTH` in `page.html`, oldest darkest), no map beside or behind it. He tried and rejected: a line chart of the southern edge, a district grid, three other scatter variants, four maps, one annotated map, a faint map in the background, and other colour sets. Do not bring those back.
- The earth colours are for the last chart only. The maps keep the eight period colours.
- All numbers in the text are computed from `data.json`. Type of locality is today's type.

## Site plumbing (prepared, not published)
- `python3 build.py site` writes `/settlements/index.html` with the GA tag, share tags, `../` back link and no draft badge.
- `NODE_PATH=$(npm root -g) node og.js` renders `settlements/preview.png` (Hebrew) and `settlements/card.png` (English). Fonts: `npm i @fontsource/heebo @fontsource/ibm-plex-sans-hebrew` in `/home/claude/fonts`.
- Still to do on publish: home page row, README line, CLAUDE.md table row, re-render the home share image.
- Search box under the headline answers the headline question and jumps to the map.
- Localities beyond the Green Line: Yonatan picked 'marked area' (hatch over the West Bank and Gaza outline plus area names, dots unchanged). The Golan has no outline in the map data, so it is named, not shaded. Live map only.

## Missing places research
- `data/gone_research.csv`: first pass for Sinai (1982) and 1948. Names and sources are in, most founding years and coordinates are not. Nothing from it is on the map. Rule: a row goes on the map only with a sourced founding year and position, after Yonatan sees the table.

## Sinai (27 Nov 2026)
- Four Yamit-region localities are on the map from `gone_research.csv` (rows marked ready): Yamit 1975, Sufa 1974, Pri'el 1978, Hatzer Adar 1981, all ending 1982. Yonatan chose to add these four and list the rest by name in the page notes.
- 12 more Yamit-region localities have no sourced position and 5 southern Sinai ones are south of the map frame. They are named in the notes, not drawn.
- Totals in the text are now 1,119 dated localities (1,095 exist today, 24 ended). If rows are added, recheck every number in the prose, `DESC` in `build.py`, and re-render the share images.
- 1948 losses: Yonatan chose not to draw them. They are named in the page notes. `gone_research.csv` keeps the rows for later.
