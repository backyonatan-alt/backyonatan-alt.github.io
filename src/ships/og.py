# Renders ships/preview.png (Hebrew share image) and ships/card.png (English home row), 1200x630.
# The picture is a frame of the 3D model in ship3d.html. Needs playwright, plus three@0.128 and the
# @fontsource fonts from npm (paths below): python3 src/ships/og.py /path/to/node_modules
import sys, os, base64
from playwright.sync_api import sync_playwright
here=os.path.dirname(os.path.abspath(__file__)); nm=sys.argv[1]
three=open(f'{nm}/three/build/three.min.js','rb').read()
def font(pkg,f): return 'data:font/woff2;base64,'+base64.b64encode(open(f'{nm}/@fontsource/{pkg}/files/{f}','rb').read()).decode()
css=''.join(f"@font-face{{font-family:'{fam}';font-weight:{w};src:url({font(pkg,f'{pkg}-{sub}-{w}-normal.woff2')})}}" for fam,pkg,w in (('FR','frank-ruhl-libre',900),('AM','amatic-sc',700)) for sub in ('hebrew','latin'))
def html(img,kick,title,rtl):
    side='right' if rtl else 'left'
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8"><style>{css}
body{{margin:0;width:1200px;height:630px;background:#f1e8d4;position:relative;overflow:hidden;color:#2b2118}}
img{{position:absolute;top:0;{'left' if rtl else 'right'}:0;width:700px;height:630px;object-fit:cover;filter:sepia(.2) saturate(.88) contrast(.97)}}
.t{{position:absolute;top:0;bottom:0;{side}:0;width:500px;box-sizing:border-box;padding:0 54px;display:flex;flex-direction:column;justify-content:center;direction:{'rtl' if rtl else 'ltr'}}}
.k{{font-family:AM;font-size:56px;line-height:1;color:#a8472e}}
h1{{margin:6px 0 0;font-family:FR;font-weight:900;font-size:{80 if rtl else 62}px;line-height:1.02}}
</style></head><body><img src="{img}"><div class="t"><div class="k">{kick}</div><h1>{title}</h1></div></body></html>'''
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1200,'height':630})
    pg.route('**/three.min.js',lambda r:r.fulfill(body=three,content_type='application/javascript'))
    pg.route('**/fonts.g*/**',lambda r:r.abort())
    pg.goto('file://'+here+'/ship3d.html'); pg.wait_for_timeout(1000)
    pg.add_style_tag(content='.top,.panel,#pins{display:none!important}canvas{filter:none!important}')
    shots={}
    for name,az in (('he',0.75),('en',0.75)):
        pg.evaluate(f'(()=>{{var o=__ship.orbit;o.auto=false;o.az={az};o.pol=1.2;o.r=21}})()'); pg.wait_for_timeout(1200)
        shots[name]='data:image/png;base64,'+base64.b64encode(pg.screenshot()).decode()
    for out,name,kick,title,rtl in (('preview.png','he','ישראל, 1988','כל ילד היה בטוח שרק לו יש ספינה',True),('card.png','en','Israel, 1988','Every Kid Thought the Ship Was Theirs',False)):
        pg.set_content(html(shots[name],kick,title,rtl)); pg.wait_for_timeout(500)
        pg.screenshot(path=f'{here}/../../ships/{out}'); print('wrote',out)
    b.close()
