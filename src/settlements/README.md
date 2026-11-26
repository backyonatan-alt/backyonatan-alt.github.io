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
- Headline is not chosen yet. He rejected "כך התמלאה המפה". Five options sit as buttons at the top of the draft.
- "Two waves" section: names the waves (1948-1951, 1977-1989) and shows them as two small maps above the live map. He asked for that.
- Live map, then the eight period maps with four short paragraphs of numbers.
- Last chart: scatter of founding year by latitude, in an earth ramp (`EARTH` in `page.html`, oldest darkest), no map beside or behind it. He tried and rejected: a line chart of the southern edge, a district grid, three other scatter variants, four maps, one annotated map, a faint map in the background, and other colour sets. Do not bring those back.
- The earth colours are for the last chart only. The maps keep the eight period colours.
- All numbers in the text are computed from `data.json`. Type of locality is today's type.
