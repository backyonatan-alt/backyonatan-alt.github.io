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

## Ships reel (Hebrew, done 19 Nov 2026)

`reel/ships/reel.js` builds `ships-reel.mp4` (1080x1920, 27s, captions only, silent audio track) and `cover.png`.
Scenes: personal opening over the real photos, the map filling with 29 ships, the burned ones turning red, end card with the link.
Run: `node reel.js <node_modules>` (needs playwright matching the installed browser, plus @fontsource/frank-ruhl-libre and amatic-sc), then
`ffmpeg -framerate 30 -i f/%04d.png -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -movflags +faststart ships-reel.mp4`.
Posts for all four platforms are in `launch/ships-posts.md`.

## Ships photo reel (22 Nov 2026)

`reel/ships/photos-reel.js` makes a photo-first reel with almost no text: title, the nine photos one after another, the map filling up, end card.
Two sizes from the same script: `ships-photos-feed-4x5.mp4` (1080x1350, Facebook and LinkedIn feeds) and `ships-photos-vertical-9x16.mp4` (1080x1920, Instagram). 26s, silent.
Run `node photos-reel.js <node_modules> 45` or `916`, then the same ffmpeg line as above with `f45/` or `f916/`.

## Settlements reel (Hebrew, 27 Nov 2026)

`reel/settlements/reel.js` builds three files:
- `settlements-reel-voice-9x16.mp4` (1080x1920) and `settlements-reel-voice-4x5.mp4` (1080x1350): 41.5s, Yonatan's own narration, Hebrew subtitles burnt in.
- `settlements-reel-silent-9x16.mp4`: the first cut, 27.5s, subtitles only.
One scene: a big map across the frame fills from 1870 to 2023, with the year, period and count over the sea and the subtitles at the top, then an end card with the link. No bar chart: Yonatan asked for a bigger map without it.
Voice timing: line starts and ends were taken from the pauses in the recording (`T` in `reel.js`), since there was no Hebrew transcription tool. Yonatan watched it and said the sync is right. The raw recording (`voice/narration.m4a`) is kept out of the repo; a new recording means new timings.
`script.md` has the subtitle lines and the narration text.
Run: `NODE_PATH=$(npm root -g) node reel.js [voice] [45]` (needs @fontsource/heebo and @fontsource/ibm-plex-sans-hebrew), then
`ffmpeg -framerate 30 -i f/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 v.mp4` and, for the voice cuts,
`ffmpeg -i v.mp4 -i voice/narration.m4a -filter_complex "[1:a]highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100,apad[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -shortest -movflags +faststart out.mp4`.
Add times such as `3,12.8,22` to get preview stills instead of frames.
Posts for LinkedIn, Facebook, X and Instagram are in `launch/settlements-posts.md`.
