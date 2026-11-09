# Builds winter/index.html from page.html + data.json. Run: python3 src/winter/build.py
# Data pipeline: data/*.csv are the collected figures (see README.md), prep.py writes data.json.
import os, json
os.chdir(os.path.dirname(os.path.abspath(__file__)))
page = open('page.html', encoding='utf8').read()
data = open('data.json', encoding='utf8').read()
json.loads(data)
page = page.replace('/*DATA*/', data, 1).replace('/*FONTS*/', '')
assert '/*DATA*/' not in page

T = "יום אחד מכל חמישה"
D = "כמה פעמים פעוט בגן יהיה חולה החורף, מתי זה יקרה, ומה זה אומר לשנים הבאות. גן מדומה של 16 פעוטות, נתוני משרד הבריאות ומחקרים שעקבו אחרי אלפי ילדים."
U = "https://backyonatan-alt.github.io/winter/"
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
<meta name="theme-color" content="#f6f3ec">
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
'''
anchor = f'<title>{T}</title>\n'
assert anchor in page
page = page.replace(anchor, anchor + meta, 1)
page = page.replace('<a class="back" href="/">→ All stories</a>', '<a class="back" href="../">&larr; All stories</a>')
assert 'href="../">&larr; All stories' in page
os.makedirs('../../winter', exist_ok=True)
open('../../winter/index.html', 'w', encoding='utf8').write(page)
print('wrote winter/index.html', len(page))
