# CDC ILINet % ILI by age (0-4, 5-24): source notes

File: `cdc_ilinet_age.csv` (355 rows). Collected 2026-11-08 via WebFetch (curl can't reach cdc.gov).
Raw per-page extracts kept in `raw/`.

Source: "U.S. Outpatient Influenza-like Illness Surveillance Network (ILINet): Percentage of Visits for ILI
by Age Group Reported by A Subset of ILINet Providers". Note: a subset of providers, not all of ILINet.
Values are each archive page's final (end-of-archive) version; earlier weekly pages may show slightly different numbers.

Header labels on these pages are misaligned ("0-4 years" spans 3 pairs). Columns were taken by position:
pairs 1-5 = 0-4, 5-24, 25-49, 50-64, 65+. Spot checks of full rows (all 5 pairs) done for every page.

## Seasons

| season | weeks | rows | complete? | source |
|---|---|---|---|---|
| 2015-16 to 2018-19 | none | 0 | NOT AVAILABLE | see below |
| 2019-20 | 201940-202039 | 52 | yes | weeklyarchives2020-2021/data/iliage39.html |
| 2020-21 | 202040-202139 | 53 (incl. week 202053) | yes | weeklyarchives2020-2021/data/iliage39.html |
| 2021-22 | 202140-202239 | 52 | yes | weeklyarchives2021-2022/data/iliage39.html |
| 2022-23 | 202240-202339 | 52 | yes | weeklyarchives2022-2023/data/iliage39.html |
| 2023-24 | 202340-202434 | 47 | partial: weeks 202435-202439 missing | weeklyarchives2023-2024/data/iliage34.html |
| 2024-25 | 202440-202533 | 46 | partial: weeks 202534-202539 missing | weeklyarchives2024-2025/data/iliage33.html |
| 2025-26 | 202540-202639 | 53 (incl. week 202553) | yes | weeklyarchives2025-2026/data/iliage39.html |

All URLs are under https://www.cdc.gov/flu/weekly/. Missing weeks were left out, not estimated.
The off-season gaps (late Aug to Sep) don't touch any winter peak.

## Why 2015-16 to 2018-19 are missing
The age-group page with visits-by-age (iliage) starts at week 201940. The 2020-2021 page itself begins at 201940,
and iliageNN pages for 2018-2019, 2019-2020 and 2015-2016 return errors (tried 39, 38, 20).
Older archives only have `senAllregtNN.html`, which gives ILI *counts* by age plus one all-ages "Total Patients"
figure. No per-age denominator, so % ILI by age can't be computed for those seasons.
Example checked: weeklyarchives2017-2018/data/senAllregt40.html.

## Other caveats
- 2019-20 comes from the 2020-21 archive page (2019-20 has no iliage page of its own).
- Total visits jump between 2019-20 (~56k for 0-4) and later seasons (~110k+). The reporting subset grew, so
  compare % ILI across seasons, not visit counts.
- Spring 2020 (from ~202012) visits collapse: COVID lockdowns. 2020-21 has no winter peak; 0-4 peaks in
  summer 2021 (8.9% at 202133, tied with 202134 and 202135), mostly RSV/other viruses, not flu.
- ILI = fever plus cough or sore throat, any cause. It's not lab-confirmed flu.
