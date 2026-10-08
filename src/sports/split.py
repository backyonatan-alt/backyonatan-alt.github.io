import re,html,os,sys
HERE=os.path.dirname(os.path.abspath(__file__))
src=open(os.path.join(HERE,'sports-analytics-by-the-numbers.html'),encoding='utf8').read()
REPO=os.path.normpath(os.path.join(HERE,'..','..'))
BASE='https://backyonatan-alt.github.io/'
si=src.find('<style>');se=src.find('</style>');sc=src.find('<script>');sce=src.rfind('</script>')
fonts=re.search(r'<link rel="stylesheet" href="https://fonts[^>]+>',src).group(0)
style=src[si:se]+'\n.nextup a{font-family:var(--display);font-weight:800;font-size:22px;text-transform:uppercase;padding:12px 18px;background:var(--ink);color:var(--bg);text-decoration:none}\n.nextup a.home{background:transparent;color:var(--ink);border:2px solid var(--ink);padding:10px 16px}\n[hidden]{display:none!important}\n@media (max-width:520px){.hero{padding-block:22px 26px}.hero .lede{font-size:17px}.board table{min-width:0}.board th,.board td{padding:8px 7px}.board td{font-size:15px}.board th{font-size:9.5px;letter-spacing:.05em}.series{margin-bottom:18px}.innings{font-size:12px}}\n</style>'
body=src[se+8:sc];js=src[sc+8:sce];L=js.split('\n')
shared='\n'.join(L[:84])
STARTS=[i for i,l in enumerate(L) if l.startswith('(function(){const root=document.getElementById("sport-')]+[next(i for i,l in enumerate(L) if l.startswith('const SP='))]
def block(key):
    a=next(i for i in STARTS[:-1] if 'sport-%s"'%key in L[i]);b=STARTS[STARTS.index(a)+1]
    return '\n'.join(L[a:b]).rstrip()
P={'mlb':('moneyball','Moneyball by the Numbers','The 2002 Oakland Athletics rebuilt from the raw season data: every team, every salary, every game. Nine interactive chapters on how a poor team bought wins cheaply.'),
   'nba':('moreyball','Moreyball by the Numbers','How the NBA moved its shots to two places on the floor in twenty years, rebuilt from 4.4 million shot locations.'),
   'soc':('expected-goals','Expected Goals by the Numbers','What expected goals is, whether it predicts anything, and why the league table lies. An interactive investigation of soccer analytics.')}
def links(seg):
    def rep(m):
        k=m.group(2);cur=' aria-current="page"' if 'aria-current' in m.group(0) else ''
        return '<a href="../%s/"%s>%s</a>'%(P[k][0],cur,m.group(4))
    return re.sub(r'<button type="button" (class="[^"]*" )?data-go="(\w+)"( aria-current="page")?>(.*?)</button>',rep,seg)
icon="data:image/svg+xml,"+__import__('urllib.parse').parse.quote('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0b4a35"/><circle cx="16" cy="16" r="8" fill="#efb21e"/></svg>')
for key,(slug,title,desc) in P.items():
    a=body.find('<div class="sport" data-sport="%s"'%key)
    nxt=body.find('<div class="sport"',a+10)
    seg=body[a:nxt if nxt>0 else len(body)].rstrip()
    seg=seg.replace(' id="sport-%s" hidden>'%key,' id="sport-%s">'%key)
    seg,n1=re.subn(r'<nav class="series"[^>]*>.*?</nav>','<nav class="series" aria-label="Site"><a href="../">&larr; All stories</a></nav>',seg,count=1,flags=re.S)
    i=seg.rfind('<div class="wrap" style="padding-bottom:50px">');assert n1==1 and i>0
    seg=seg[:i]+'<div class="wrap" style="padding-bottom:50px"><div class="nextup"><a class="home" href="../">&larr; All stories</a></div></div></div>'
    assert 'data-go' not in seg, key
    url=BASE+slug+'/'
    head=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:image" content="{url}preview.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{html.escape(desc)}">
<meta name="twitter:image" content="{url}preview.png">
<meta name="theme-color" content="#0b4a35">
<link rel="icon" href="{icon}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{fonts}
{style}
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
</head>
<body style="margin:0">
<div id="tip" hidden></div>
'''
    out=head+seg+'\n<script>'+shared+'\n'+block(key)+'\n</script>\n</body>\n</html>\n'
    os.makedirs(f'{REPO}/{slug}',exist_ok=True)
    open(f'{REPO}/{slug}/index.html','w',encoding='utf8').write(out)
    print(slug,len(out))
