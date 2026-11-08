# Social assets scripts (Playwright + ffmpeg)

- `rec.js` record a page's hero animation to webm. `shot.js` screenshot chart figures.
- `card.js` 1080x1350 Hebrew card. `cover.js` + `cover2.js` 1920x1080 LinkedIn cover from a page chart.
- `reel/reel.js` 1080x1920 reel frames timed to voiceover word timings (`words.json` from Tonpit read_voiceover),
  then ffmpeg to mp4, then Tonpit studio to add the voice and export. Fonts come from npm @fontsource packages.

## Plan: one reel per article (waiting until the medals article is done)

Articles: cousins, moneyball, moreyball, expected-goals, dogfight, flyers, windsurf (+ medals when live).
Format: 1080x1920, 20-30s. Hook line, one or two findings, "link in bio". Visuals recorded from the live page.
Subtitles always (most people watch muted). Keep the bottom ~430px clear for app buttons.

Voice: default is no voice, captions only, rendered locally (free).
AI voice only for the 2-3 best performers on LinkedIn: Tonpit, voice "Ryan", about 7 credits per reel.
Tonpit free plan = 3 exports a month (1 used in Nov 2026). Hebrew AI voice is weaker; for Hebrew, Yonatan may record himself.
Language: open question, Hebrew, English or both.

Done so far: Flyers test reel (English, AI voice), Tonpit studio gnKMMosUHE6E6542urmH.
Steps that worked: generate_voiceover -> read_voiceover (word timings) -> reel.js frames timed to words
-> ffmpeg mp4 -> import to Tonpit via a public URL (jsDelivr from a temp branch) -> place both -> export.
