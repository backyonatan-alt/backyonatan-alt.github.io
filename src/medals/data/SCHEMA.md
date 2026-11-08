# Medal predictability dataset

One CSV row per sailor per event. Columns (exact header):

event,year,cls,gender,rank,name,nation,status,source_url

- event: olympics | worlds
- year: event year (Tokyo = 2021 games but use 2020 for olympics label consistency? NO: use the actual year it was sailed, Tokyo = 2021)
- cls: windsurf | laser   (windsurf = Lechner/Mistral/RS:X/iQFOiL; laser = Laser/ILCA 7 men, Laser Radial/ILCA 6 women)
- gender: M | W
- rank: final overall place (integer). Ties keep the same rank.
- name: "Firstname Lastname" as the source writes it, no flags
- nation: IOC 3-letter code
- status: blank normally; DNC/DNS/DSQ/RET etc only if the source marks the overall result that way
- source_url: the page the row came from

Rules: never invent or guess a row. If a page is cut off or a year is missing, write it in the agent's GAPS.md (year, class, gender, what is missing, URLs tried). Verify each table: row count vs the source's participant count, and the top 3 vs known medalists.
