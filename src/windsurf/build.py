# Builds windsurf/index.html from page.html + data.json. Run: python3 src/windsurf/build.py
# Data pipeline: data/*.csv are the collected results (see SCHEMA.md), prep.py merges spellings, adds Hebrew names and writes data.json.
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
page=open('page.html',encoding='utf8').read()
page=page.replace('{{DATA}}',open('data.json',encoding='utf8').read())
assert '{{' not in page
T="נבחרת הגלישה הטובה אי פעם? חצי ממנה."; D="האם נבחרת גלישת הרוח של ישראל טובה היום יותר מאי פעם? 1,224 תוצאות מ-1992 ועד היום, מגל פרידמן ועד תמר שטיינברג. התשובה: כן לנשים, לא לגברים, והסיבה מפתיעה."
U="https://backyonatan-alt.github.io/windsurf/"
head=f'''<!doctype html>
<html lang="he" dir="rtl">
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
<meta property="og:locale" content="he_IL">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{T}">
<meta name="twitter:description" content="{D}">
<meta name="twitter:image" content="{U}preview.png">
<meta name="theme-color" content="#0f2230">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
'''
body=page[page.index('<link rel="stylesheet"'):]
j=body.index('</style>')+8
site=head+body[:j]+'\n</head>\n<body>\n'+body[j:].lstrip()+'\n</body>\n</html>\n'
site=site.replace('href="#top">&larr; All stories','href="../">&larr; All stories')
open('../../windsurf/index.html','w',encoding='utf8').write(site)
print('wrote windsurf/index.html',len(site))
