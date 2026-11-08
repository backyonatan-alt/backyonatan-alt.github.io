const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const D=__dirname;
const ff=(fam,pkg,w,sub)=>{const p=path.join(D,'node_modules/@fontsource/'+pkg+'/files/'+pkg+'-'+sub+'-'+w+'-normal.woff2');return fs.existsSync(p)?'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(p).toString('base64')+')}':''};
let FF='';for(const s of ['hebrew','latin']){FF+=ff('Secular One','secular-one',400,s);for(const w of [400,700])FF+=ff('Heebo','heebo',w,s);}
FF+=ff('IBM Plex Mono','ibm-plex-mono',500,'latin');
const img='data:image/png;base64,'+fs.readFileSync(path.join(D,'tl.png')).toString('base64');
// crop region of tl.png (2360 wide): y 270..1545
const cy=270,ch=1275,W=2360,dispH=760,sc=dispH/ch,dispW=Math.round(W*sc);
const html=`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${FF}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;background:#0f2230;color:#fff;font-family:Heebo,sans-serif;overflow:hidden}
.top{padding:58px 90px 0;display:flex;justify-content:space-between;align-items:flex-end}
.k{font-family:"IBM Plex Mono",Heebo,monospace;font-size:26px;color:#ff7a59;letter-spacing:.06em;margin-bottom:14px}
h1{font-family:"Secular One",Heebo;font-size:96px;font-weight:400;line-height:1.05}
.key{display:flex;gap:34px;font-size:30px;color:#cfe3ea;padding-bottom:14px}
.key span{display:flex;align-items:center;gap:12px}
.d{width:22px;height:22px;border-radius:50%;border:2px solid #0f2230}
.r{width:30px;height:30px;border-radius:50%;border:3px solid #ffd166;display:flex;align-items:center;justify-content:center}
.r i{width:16px;height:16px;border-radius:50%;background:#cfe3ea}
.chart{margin:36px auto 0;width:${dispW}px;height:${dispH}px;background:url(${img}) 0 -${Math.round(cy*sc)}px/${dispW}px auto no-repeat;border-radius:14px}
</style></head><body>
<div class="top"><div><div class="k">גלישת רוח אולימפית · ישראל 1992-2026</div><h1>הנבחרת הכי טובה שהייתה לנו? חצי ממנה.</h1></div></div>
<div style="display:flex;justify-content:flex-start;padding:22px 90px 0" class="key"><span><b class="d" style="background:#ff7a59"></b>נשים</span><span><b class="d" style="background:#3cc8dc"></b>גברים</span><span><b class="r"><i></i></b>מדליה</span></div>
<div class="chart" style="margin-top:14px"></div>
</body></html>`;
fs.writeFileSync(path.join(D,'cover.html'),html);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
await pg.goto('file://'+path.join(D,'cover.html'));await pg.waitForTimeout(600);
const h=await pg.evaluate(()=>document.body.scrollHeight);console.log(h);
await pg.screenshot({path:path.join(D,'windsurf-linkedin-cover.png')});await b.close()})();
