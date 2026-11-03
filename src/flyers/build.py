# Builds flyers/index.html from page.html + map.json + data.json + cost.json. Run: python3 src/flyers/build.py
# Data pipeline: schedules from https://github.com/sportsdataverse/sportsdataverse-data/releases/tag/espn_nba_schedules
#   python3 travel.py nba_schedule_2025.csv  -> per-team routes and stats (writes *_travel.json)
#   pool.py pools four seasons and fits the logistic model; data.json/cost.json were written from those outputs.
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
page=open('page.html',encoding='utf8').read()
page=page.replace('{{MAP}}',open('map.json').read()).replace('{{DATA}}',open('data.json').read()).replace('{{COST}}',open('cost.json').read())
assert '{{' not in page
T="Frequent Flyers"; D="An NBA team flies 45,000 miles a season. Watch all 30 teams do it on one animated map, then see what the miles actually cost. Four seasons, 4,920 road games."
U="https://backyonatan-alt.github.io/flyers/"
head=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{T}</title>
<meta name="description" content="{D}">
<link rel="canonical" href="{U}">
<meta property="og:type" content="article">
<meta property="og:url" content="{U}">
<meta property="og:title" content="{T}">
<meta property="og:description" content="{D}">
<meta property="og:image" content="{U}preview.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{T}">
<meta name="twitter:description" content="{D}">
<meta name="twitter:image" content="{U}preview.png">
<meta name="theme-color" content="#0b1526">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
'''
body=page[page.index('<link rel="stylesheet"'):]
j=body.index('</style>')+8
site=head+body[:j]+'\n</head>\n<body>\n'+body[j:].lstrip()+'\n</body>\n</html>\n'
site=site.replace('href="#top">&larr; All stories','href="../">&larr; All stories')
open('../../flyers/index.html','w',encoding='utf8').write(site)
print('wrote flyers/index.html',len(site))
