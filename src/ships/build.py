# Builds ships/index.html from page.html + data.json + map.json + the 3D code in ship3d.html.
# Run: python3 src/ships/prep.py (if the data changed), then python3 src/ships/build.py
import os, json, shutil
os.chdir(os.path.dirname(os.path.abspath(__file__)))
page = open('page.html', encoding='utf8').read()
data = open('data.json', encoding='utf8').read(); json.loads(data)
mp = open('map.json', encoding='utf8').read(); json.loads(mp)
s3 = open('ship3d.html', encoding='utf8').read()
ship = s3.split('/*SHIP-START*/')[1].split('/*SHIP-END*/')[0]
for k, v in (('/*DATA*/', data), ('/*MAP*/', mp), ('/*SHIP*/', ship)):
    assert page.count(k) == 1, k
    page = page.replace(k, v)

T = "כל ילד היה בטוח שרק לו יש ספינה"
D = "ספינות הפיראטים מעץ שעמדו בגנים הציבוריים בישראל משנת 1988: איפה עמדו, מי בנה אותן, מה עלה בגורלן, ודגם תלת־ממדי שאפשר לעלות עליו."
U = "https://yonatanback.com/ships/"
meta = f'''<meta name="description" content="{D}">
<link rel="canonical" href="{U}">
<meta property="og:type" content="article">
<meta property="og:url" content="{U}">
<meta property="og:title" content="{T}">
<meta property="og:description" content="{D}">
<meta property="og:image" content="{U}preview.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="he_IL">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{T}">
<meta name="twitter:description" content="{D}">
<meta name="twitter:image" content="{U}preview.png">
<meta name="theme-color" content="#f1e8d4">
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
'''
anchor = f'<title>{T}</title>\n'
assert anchor in page
page = page.replace(anchor, anchor + meta, 1)
old = '<a class="back" href="/">→ All stories</a>'
assert old in page
page = page.replace(old, '<a class="back" href="../">&larr; All stories</a>')
page = page.replace('<footer><a href="/">→ All stories</a></footer>', '<footer><a href="../">&larr; All stories</a></footer>')
assert 'prefers-color-scheme' not in page and '—' not in page and 'שדה' not in page
os.makedirs('../../ships', exist_ok=True)
os.makedirs('../../ships/photos', exist_ok=True)
for k in json.loads(data)['photos']:
    shutil.copy(f'photos/{k}.jpg', f'../../ships/photos/{k}.jpg')
open('../../ships/index.html', 'w', encoding='utf8').write(page)
print('wrote ships/index.html', len(page))
