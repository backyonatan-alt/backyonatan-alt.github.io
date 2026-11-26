# python3 build.py        -> draft.html (self-contained preview, git-ignored)
# python3 build.py site   -> ../../settlements/index.html (the page on the site: GA tag, share tags, no draft badge)
import os, sys, json
D = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(D + '/' + f, encoding='utf-8').read()
json.loads(rd('data.json')); json.loads(rd('map.json'))
html = rd('page.html').replace('/*MAP*/null', rd('map.json')).replace('/*DATA*/null', rd('data.json'))
assert '/*MAP*/' not in html and '/*DATA*/' not in html
if len(sys.argv) < 2:
    open(D + '/draft.html', 'w', encoding='utf-8').write(html)
    print('draft.html', len(html) // 1024, 'KB')
    sys.exit()

T = "מתי קם היישוב שלכם?"
DESC = "1,115 יישובים, 153 שנים. איפה ומתי קמו היישובים היהודיים בארץ, מ-1870 ועד היום: מפה שאפשר לנגן ולחפש בה, שמונה תקופות, ואיך ההתיישבות ירדה דרומה. נתוני הלשכה המרכזית לסטטיסטיקה."
U = "https://yonatanback.com/settlements/"
meta = f'''<meta name="description" content="{DESC}">
<link rel="canonical" href="{U}">
<meta property="og:type" content="article">
<meta property="og:url" content="{U}">
<meta property="og:title" content="{T}">
<meta property="og:description" content="{DESC}">
<meta property="og:image" content="{U}preview.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="he_IL">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{T}">
<meta name="twitter:description" content="{DESC}">
<meta name="twitter:image" content="{U}preview.png">
<meta name="theme-color" content="#ffffff">
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
'''
def swap(a, b):
    global html
    assert html.count(a) == 1, a
    html = html.replace(a, b)
swap('<title>טיוטה: מפת ההתיישבות 1870-2023</title>\n', f'<title>{T}</title>\n' + meta)
swap('<a class="back" href="/">→ All stories</a>', '<a class="back" href="../">&larr; All stories</a>')
swap('<div class="draft">טיוטה, לא לפרסום</div>\n', '')
assert 'prefers-color-scheme' not in html and '—' not in html
os.makedirs(D + '/../../settlements', exist_ok=True)
open(D + '/../../settlements/index.html', 'w', encoding='utf-8').write(html)
print('wrote settlements/index.html', len(html) // 1024, 'KB')
