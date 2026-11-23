# shotmaking (working folder, no page yet)

Planned Hebrew article: do NBA champions take better shots, or just make them? And how much of a hot or cold shooting start is real?

Status (23 Nov 2026): data and analysis only. No page, nothing on the home page.

## Files

| File | What |
|---|---|
| `fetch.sh` | Downloads the raw NBA.com files into `raw/` (not in git, about 4 GB unpacked) |
| `build.py` | `raw/shotdetail_*.csv` -> `data/team_games.csv` |
| `scores.py` | `raw/nbastatsv3_*.csv` (play-by-play) -> `data/scores.csv` |
| `finals.py` | Prints each season's two finalists, to check `data/champions.csv` |
| `halfrule.py` | First 20 games vs the rest, placebo, how fast it settles |
| `champions.py` | Where the 30 champions ranked, shooting vs plain record |
| `report.txt` | Output of `halfrule.py` and `champions.py` |

Rerun the analysis from the data in git: `python3 src/shotmaking/halfrule.py; python3 src/shotmaking/champions.py`.
Rebuild the data: `sh src/shotmaking/fetch.sh`, then `build.py` and `scores.py`.

## Data

- Source: github.com/shufinskiy/nba_data, scraped from NBA.com. Every regular-season shot from 1996-97 to 2025-26 (about 5.9 million), 30 seasons, 892 team-seasons.
- `data/team_games.csv`: one row per team per game. `pts` field-goal points, `xp` expected points, `fga` attempts, `n` the team's game number, `yr` season start year (2025 = 2025-26).
- `data/scores.csv`: final score per team per game. 32 team-games of 2012-13 have no score.
- `data/champions.csv`: champion per season. 2025-26 is the Knicks (over the Spurs, 4-1).
- Not available: defender distance and shot clock per shot, the 2026-27 season. NBA.com has team shooting by defender distance (`leaguedashteamptshot`) but it could not be reached from the cloud workspace.

## Definitions

- Expected points of a shot: that season's league average for the same NBA.com zone (basic zone x area x range), with the shooting team left out.
- Shot quality: expected points per shot. It only knows where the shot was taken from.
- Shot making: actual points per shot minus expected.
- Field goals only. No free throws, turnovers or rebounds.

## Findings so far

Champions (full season ranks, 30 champions):
- Shot making: median rank 4.5 on offense, 19 of 30 in the top 5.
- Making opponents miss: median rank 4, 19 of 30 in the top 5.
- Shot quality on offense: median rank 13.5. No champion ranked first, 9 of 30 were in the bottom half. 2024-25 Thunder 27th, 2017-18 Warriors 25th, 1996-97 Bulls 29th.
- Only 1 champion was top 5 in both shot quality and shot making.

Spotting the champion early:
- After 20 games the champion was top 5 in net points per shot in 23 of 30 seasons. Win percentage: 23 of 30. Point differential: 23 of 30.
- So shooting data does not beat the plain record. The prediction angle is weak. The "what champions look like" angle carries the story.

The half rule (first 20 games vs the rest, 892 team-seasons):
- About half of a team's shot-making gap carries over (slope 0.55, r 0.67). Same in every era.
- Teams 0.05 points per shot off after 20 games (about 4 points a game) stayed on the same side 92% of the time.
- Shot quality settles faster: slope 0.56 after 5 games, 0.77 after 20. Shot making: 0.27 after 5, 0.55 after 20, 0.68 after 41.
- Mostly sample size, not something special about early season: 20 random games give slope 0.60.
- Hook: the 2024-25 Trail Blazers had the second-coldest start in the data (-0.124 points per shot), then -0.050 the rest of the way. Only the 2009-10 Nets started colder.

Tested and dropped:
- "Hot starts are real, cold starts are luck." Hottest 10% keep 59%, coldest 10% keep 50%. The interval on the difference touches zero and the gap is absent before 2004.

## Caveats to state on the page

- Shot quality is location only. An open three and a contested three count the same. Part of "shot making" is really unmeasured shot quality, and "average shot quality" may partly mean stars taking hard mid-range shots.
- Opponents' missing is partly contesting, which is defense, not luck.
- 30 champions is a small sample.

## Draft outline (Hebrew page, RTL, no chapter numbers)

1. Hook: champions take average shots.
2. Chart: 30 champions, rank in shot quality vs rank in shot making.
3. Both ends: they make shots and make opponents miss.
4. Can you see it early? Yes by game 20, but the standings see it too.
5. The half rule, with the 2024-25 Blazers.
6. Chart: how fast shot quality and shot making settle.
7. Method and caveats.

## Open

- `/moreyball/` already covers shot location and expected points. This article is the counterpoint: optimizing where to shoot is not what separates champions. Keep the two from repeating each other.
- Pull NBA.com defender-distance data from a local machine to test whether "average shot quality" survives.
- Playoff shooting has not been looked at yet (`raw/shotdetail_po_*.csv`).
