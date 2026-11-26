# settlements (work in progress)

Hebrew article: when and where Jewish localities were founded, 1870 to today. Working title: כך התמלאה המפה.
Not a page on the site yet. No row on the home page.

## Files
- `data/cbs_localities_2023.csv`: CBS localities file 2023 (data.gov.il), taken from the GitHub mirror khodossss/israeli-localities. To be replaced by the official download.
- `prep.py` makes `data.json`: 1,088 Jewish and mixed localities with a founding year, plus 4 old cities with no year (Jerusalem, Haifa, Tiberias, Tzfat).
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
