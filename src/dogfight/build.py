import re
src=open('/home/claude/backyonatan-alt.github.io/dogfight/index.html',encoding='utf8').read()
def between(a,b,inc=True):
    i=src.index(a);j=src.index(b,i+len(a));return src[i:j+len(b)] if inc else src[i+len(a):j]
HUD=between('<div class="hud">','</div>\n  <p>Three fixes')[:-len('\n  <p>Three fixes')]
ENTRY=between('<figure>\n    <div class="scroll"><svg viewBox="0 0 360 240"','</figure>')
KEYS=between('<div class="keys">','</div>\n  <p class="note">Check which arrow')[:-len('\n  <p class="note">Check which arrow')]+'\n  '+between('<p class="note">Check which arrow','</p>')
WEAPONS=between('<h2>Weapons</h2>\n','</section>',False)
FLOW=between('<div class="tblwrap">','</table></div>')
DRILLS=between('<ol class="drills" id="drillList">','</ol>')
SOURCES=between('<h2>Sources</h2>\n  <ul>','</ul>').replace('<h2>Sources</h2>\n  ','')
import os;os.chdir(os.path.dirname(os.path.abspath(__file__)));page=open('page.html',encoding='utf8').read()
app=open('app.js',encoding='utf8').read()
page=page.replace('{{APP}}',app)
assert '{{' not in page and '—' not in page
open('../../dogfight/draft-artifact.html','w',encoding='utf8').write(page) if False else None
# site version
T="Dogfight Ground School"; D="A beginner's ground school for anyone who has tried a flight simulator: why the jet you are chasing keeps getting away, corner speed, and six classic maneuvers in 3D."
U="https://backyonatan-alt.github.io/dogfight/"
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
<meta name="theme-color" content="#174f9e">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
'''
body=page[page.index('<link rel="stylesheet"'):]
j=body.index('</style>')+8
site=head+body[:j]+'\n</head>\n<body>\n'+body[j:].lstrip()+'\n</body>\n</html>\n'
open('../../dogfight/index.html','w',encoding='utf8').write(site)
print(len(page),len(site))
