# Builds dogfight/index.html from page.html and app.js. Run: python3 src/dogfight/build.py
import os;os.chdir(os.path.dirname(os.path.abspath(__file__)));page=open('page.html',encoding='utf8').read()
app=open('app.js',encoding='utf8').read()
page=page.replace('{{APP}}',app)
assert '{{' not in page and '\u2014' not in page
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
print('wrote dogfight/index.html',len(site))
