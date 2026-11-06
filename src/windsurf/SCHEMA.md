# Windsurfing results collection

One CSV per collector, UTF-8, header exactly:
year,competition,class,gender,age_category,athlete,position,field_size,source_url,notes

- competition: Olympics | World Championship | European Championship | Youth World Championship | Youth European Championship | Youth Olympics | ISAF/World Sailing Worlds (if a Worlds was held inside the combined ISAF Sailing World Championships, write "World Championship" and note "ISAF combined" in notes)
- class: Lechner A-390 | Mistral | RS:X | iQFOiL | Techno 293 | Techno 293 Plus | Bic Techno | other (write it)
- gender: M | W
- age_category: senior | U21 | U19 | U17 | U15 | youth (if unclear)
- athlete: full name as in the source, Latin letters. One row per Israeli competitor per event. If an Israeli competed and finished outside the published list (e.g. DNF), still add a row with notes.
- position: final overall position (integer). Unknown -> blank.
- field_size: number of competitors in that fleet (last position number in the results). Unknown -> blank. Never guess.
- source_url: the page or file the row was read from. Required.
- notes: anything odd: medal race, ties, partial results, name spelling variants.

Also keep coverage.csv with header:
year,competition,class,gender,status,source_url,notes
status: full (all positions + field size) | partial (positions of Israelis but no field size, or medalists only) | none (event found, no results reachable) | not_held
Write a coverage row for EVERY year/competition/gender you looked for, including years with no Israeli entrants (status full/partial, athlete rows absent) so missing data is visible.
