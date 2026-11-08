# Medals article (working folder, not yet a page)

Hebrew article: does a strong national team and a consistent sailor predict an Olympic windsurfing medal?
Draft text lives in the Claude Doc "המדליה מתחילה ארבע שנים קודם".

- `data/` one row per sailor per event, see `SCHEMA.md`. Olympics 2008-2024 complete (Olympedia).
  Worlds: windsurf 2008-2024 (missing 2022, women 2016), Laser 2006-2025 (missing 2007, 2018, men 2008).
  2024 iQFOiL Worlds parsed from Sailti PDFs Yonatan downloaded.
- `data/paris_legs/` Paris 2024 medal series, leg by leg, from the public SAP Sailing Analytics API. GPS tracks need permission.
- `analyze.py` window = two Worlds before each Games (stayed home, medal by Worlds rank).
  `predict.py` medal rate by best Worlds rank + depth. `ticket.py` who gets the national spot.
  `cycle.py` the article's main frame: four-year cycle, consistency x team depth.
- `charts/charts.html` English draft charts (render with `src/social/shot.js`). Need Hebrew versions.
