# GAPS: olympics.csv

Source: Olympedia results pages (one per event, URL in `source_url`). 31 events, 1103 rows.
Every table was checked: ranked rows equal the participant count Olympedia states ("N from N countries"), ranks run 1..N with no gaps or ties, and the top 3 match the medalists on the page.

No year or class is missing. Items to know:

1. **2008, laser, M (https://www.olympedia.org/results/261311).** The results table on this page came through with an empty / misaligned NOC column, so the nation codes are not from the results page itself. Names and ranks are from the results page. Nations come from Olympedia's participant list for the same event (https://www.olympedia.org/athletes/event/261311), which lists 43 names. Three sailors carry two career nations there; the 2008 nation was taken from the Wikipedia page "Sailing at the 2008 Summer Olympics – Laser" (https://en.wikipedia.org/wiki/Sailing_at_the_2008_Summer_Olympics_%E2%80%93_Laser), whose ranking matches Olympedia's 1 to 43:
   - Thomas Barrows: ISV (Olympedia also lists USA)
   - Diego Romero (bronze): ITA (Olympedia also lists ARG; he sailed for ARG in 2000 and 2004)
   - Greg Douglas: BAR (Olympedia also lists CAN)

2. **2012, windsurf, W (https://www.olympedia.org/results/320105).** Olympedia states 25 participants and ranks 1 to 25, then lists one extra row: Carol Borges-Mendelblatt (POR) marked DNS. She is in the CSV with empty rank and status `DNS`. Drop her if you want starters only.

3. **Laser men 1996, 2000, 2004** are listed by Olympedia as "One-Person Dinghy (Laser), Open". No women took part (the 1996 page says so; the 2000 and 2004 lists show only men). Coded gender M.

4. **NOC codes are as Olympedia writes them for that Games**, including historical and special codes: TCH (1992), AHO, IOA (Philipine van Aanholt 2012, Netherlands Antilles athletes as Independent Olympic Athletes), ROC (Tokyo 2021 Russian athletes), RUS for earlier years. Not normalised.

5. **Name spellings change across years for the same person** (as Olympedia writes them per event): Zofia Klepacka / Zofia Noceti-Klepacka, Tuuli Petäjä / Tuuli Petäjä-Sirén, Irina Konstantinova / Irina Konstantinova-Bontemps, Gintarė Volungevičiūtė / Gintarė Scheidt, Veronika Fenclová / Veronika Kozelská-Fenclová, Carol Borges / Carol Borges-Mendelblatt, Maksym Oberemko (UKR) / Maksim Oberemko (RUS 2016), Vicky Chan / Hayley Victoria Chan. Single-name entry: "Bimba" (Ricardo Santos, BRA) as Olympedia lists him. Merge these before any per-athlete analysis.

6. Minor source quirk, no effect on ranks: Tokyo 2021 laser men, ranks 28 and 29 show net points above total points on Olympedia (likely a typo on the page).

Tables were read through WebFetch (a model summarising the page). Each table was returned complete in one fetch and passed the count and medalist checks, but individual name diacritics were not re-checked letter by letter against the raw HTML.
