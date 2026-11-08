const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const D=__dirname;
const f=(w)=>'@font-face{font-family:"Heebo";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(path.join(D,'node_modules/@fontsource/heebo/files/heebo-hebrew-'+w+'-normal.woff2')).toString('base64')+')}';
const g=(w)=>'@font-face{font-family:"Heebo";font-weight:'+w+';unicode-range:U+0000-00FF;src:url(data:font/woff2;base64,'+fs.readFileSync(path.join(D,'node_modules/@fontsource/heebo/files/heebo-latin-'+w+'-normal.woff2')).toString('base64')+')}';
const FF=[400,700,900].map(f).join('')+[400,700,900].map(g).join('');
const html=`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${FF}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#0b1530;color:#eef2ff;font-family:Heebo,sans-serif;overflow:hidden;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 20%,#17305a 0%,#0b1530 60%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:90px 90px}
.wrap{position:relative;padding:100px 90px;height:100%;display:flex;flex-direction:column}
.kicker{font-size:30px;font-weight:700;letter-spacing:.04em;color:#f5b942;margin-bottom:34px}
h1{font-size:74px;font-weight:900;line-height:1.12;margin-bottom:70px}
.row{display:flex;align-items:baseline;gap:28px;margin-bottom:38px}
.team{font-size:38px;font-weight:700;width:270px;color:#c9d3ef}
.num{font-size:118px;font-weight:900;line-height:1;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.num.hi{color:#f5b942}
.bar{height:22px;border-radius:11px;margin:10px 0 56px;background:#f5b942}
.bar.lo{background:#4b6fc4}
.unit{font-size:26px;color:#8fa0cc;font-weight:400;margin-right:12px}
.foot{margin-top:auto;font-size:32px;line-height:1.5;color:#c9d3ef}
.foot b{color:#fff;font-weight:700}
.line{position:absolute;left:90px;right:90px;top:430px;height:1px;background:rgba(255,255,255,.12)}
</style></head><body><div class="bg"></div><div class="grid"></div>
<div class="wrap">
<div class="kicker">עונה אחת ב-NBA</div>
<h1>כמה טסה קבוצה בעונה?<br>תלוי איפה היא גרה.</h1>
<div class="row"><div class="team">סן אנטוניו</div><div class="num hi">56,886<span class="unit">מייל</span></div></div>
<div class="bar" style="width:100%"></div>
<div class="row"><div class="team">דטרויט</div><div class="num">35,302<span class="unit">מייל</span></div></div>
<div class="bar lo" style="width:62%"></div>
<div class="foot">הפרש של <b>21,584 מייל</b> בין הקבוצה שטסה הכי הרבה להכי מעט.<br>כמעט פעם סביב כדור הארץ.<br><br>אבל המרחק לא עולה ניצחונות. משהו אחר כן.</div>
</div></body></html>`;
fs.writeFileSync(path.join(D,'card.html'),html);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium/chrome-linux/chrome'}).catch(()=>chromium.launch());
const pg=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
await pg.goto('file://'+path.join(D,'card.html'));await pg.waitForTimeout(500);
await pg.screenshot({path:path.join(D,'flyers-card-he.png')});await b.close();console.log('ok')})();
