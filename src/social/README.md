# Social assets scripts (Playwright + ffmpeg)

- `rec.js` record a page's hero animation to webm. `shot.js` screenshot chart figures.
- `card.js` 1080x1350 Hebrew card. `cover.js` + `cover2.js` 1920x1080 LinkedIn cover from a page chart.
- `reel/reel.js` 1080x1920 reel frames timed to voiceover word timings (`words.json` from Tonpit read_voiceover),
  then ffmpeg to mp4, then Tonpit studio to add the voice and export. Fonts come from npm @fontsource packages.
