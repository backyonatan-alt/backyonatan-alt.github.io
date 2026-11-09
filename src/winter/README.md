# Winter article: working folder for /winter/

Hebrew article: how often does a toddler in gan get sick in winter, and when.
Page: `/winter/`, built by `python3 src/winter/build.py`. Share images: `node src/winter/og.js`. Design preview with local fonts: `node src/winter/preview.js --shots`.

## Data

- `data/cohort_figures.csv` published figures from daycare cohort studies (episodes per year, sick days, episode length, cause mix, daycare vs home, later payback). One row per number, source per row. Notes in `cohort_NOTES.md`.
- `data/israel_hosp_weekly.csv` weekly new hospitalized RSV and flu positives in Israel, from the Health Ministry / ICDC weekly reports (text figures only, all ages). Hospital coverage changes are recorded per row. Notes in `israel_hosp_NOTES.md`.
- `data/cdc_ilinet_age.csv` CDC ILINet weekly % of outpatient visits for flu-like illness, ages 0-4 and 5-24, US. Used for the shape of a season for this age group. Notes in `cdc_NOTES.md`.

Israeli weekly rates by age (Maccabi clinic visits, under 2 and 2-5) exist only as chart images in the ministry PDFs, so they are not used.

## Rules for this piece

- No estimated figures shown as real. The simulator is labeled as a model built from the published rates.
- Written about "a child in gan", no personal references.
- Hebrew, RTL, light mode, no chapter numbers, no em dashes.
