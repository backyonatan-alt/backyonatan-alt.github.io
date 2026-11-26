// Renders settlements/preview.png (Hebrew share image) and settlements/card.png (English home row), 1200x630.
// Map of every locality in the period colours plus the founding-year bars. Fonts from npm @fontsource.
// usage: NODE_PATH=$(npm root -g) node src/settlements/og.js [fontsource dir] [out dir]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const FD=process.argv[2]||'/home/claude/fonts/node_modules/@fontsource/';
const OUT=process.argv[3]||path.join(__dirname,'../../settlements');
const ff=(fam,pkg,sub,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(path.join(FD,pkg,'files',pkg+'-'+sub+'-'+w+'-normal.woff2')).toString('base64')+')}';
let FF='';for(const sub of ['hebrew','latin']){for(const w of [400,700])FF+=ff('Heebo','heebo',sub,w);FF+=ff('Plex','ibm-plex-sans-hebrew',sub,700)}
const MAP=JSON.parse(fs.readFileSync(path.join(__dirname,'map.json'))),DATA=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json')));
const PAL=['#1d4ed8','#ea580c','#0d9488','#be185d','#ca8a04','#15803d','#7c3aed','#b91c1c'],ENDS=[1918,1935,1939,1947,1951,1966,1976,2023];
const era=y=>ENDS.findIndex(e=>y<=e),P=MAP.P,px=(lon,lat)=>[(lon-P.lon0)*P.k*P.S,(P.lat0-lat)*P.S];
const T={he:{dir:'rtl',k:'סיפור בנתונים · התיישבות',t:'מתי קם<br>היישוב שלכם?',s:DATA.pts.length.toLocaleString('en')+' יישובים, 153 שנים,<br>מפה אחת',lab:'יישובים חדשים בכל שנה, 1870 עד 2023'},
         en:{dir:'ltr',k:'DATA STORY · IN HEBREW',t:'When Was Your<br>Town Founded?',s:DATA.pts.length.toLocaleString('en')+' localities, 153 years,<br>one map',lab:'New localities per year, 1870 to 2023'}};
function html(L){const c=T[L],H=600,k=H/MAP.h,mw=MAP.w*k;
 const dots=DATA.pts.map(p=>{const[x,y]=px(p[3],p[2]);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="${PAL[era(p[1])]}" fill-opacity=".9"/>`}).join('');
 const per={};DATA.pts.forEach(p=>per[p[1]]=(per[p[1]]||0)+1);const mx=Math.max(...Object.values(per)),W=640,BH=150,bw=W/154;let bars='';
 for(let y=1870;y<=2023;y++){const n=per[y]||0,h=n?Math.max(2,n/mx*BH):0;bars+=`<rect x="${((y-1870)*bw+.5).toFixed(1)}" y="${(BH-h).toFixed(1)}" width="${(bw-1).toFixed(1)}" height="${h.toFixed(1)}" fill="${PAL[era(y)]}"/>`}
 const side=c.dir==='rtl'?'right':'left',other=c.dir==='rtl'?'left':'right';
 return `<!doctype html><html dir="${c.dir}"><head><meta charset="utf-8"><style>${FF}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#fff;color:#111827;font-family:Heebo;position:relative;overflow:hidden}
.txt{position:absolute;top:56px;${side}:64px;width:700px}
.k{font-weight:700;font-size:23px;letter-spacing:.04em;color:#b91c1c}
.t{font-family:Plex;font-weight:700;font-size:${L==='he'?92:80}px;line-height:1.04;margin-top:16px}
.s{font-size:31px;color:#374151;margin-top:20px;line-height:1.3}
.bars{position:absolute;bottom:44px;${side}:64px;width:640px;direction:ltr}
.lab{font-size:19px;color:#6b7280;margin-top:8px;direction:${c.dir};text-align:${c.dir==='rtl'?'right':'left'}}
.map{position:absolute;top:15px;${other}:70px;width:${mw}px;height:${H}px;background:#e6edf3;border-radius:6px;overflow:hidden}
</style></head><body>
<div class="txt"><div class="k">${c.k}</div><div class="t">${c.t}</div><div class="s">${c.s}</div></div>
<div class="bars"><svg width="640" height="${BH}" style="display:block">${bars}<line x1="0" x2="640" y1="${BH-.5}" y2="${BH-.5}" stroke="#9ca3af"/></svg><div class="lab">${c.lab}</div></div>
<div class="map"><svg width="${mw}" height="${H}" viewBox="0 0 ${MAP.w} ${MAP.h}"><path d="${MAP.nb}" fill="#f1f3f5"/><path d="${MAP.isr}" fill="#fff" stroke="#c3c9d1" stroke-width=".7"/><path d="${MAP.pal}" fill="#f4f5f7" stroke="#c3c9d1" stroke-width=".9" stroke-dasharray="3 3"/>${dots}</svg></div>
</body></html>`}
(async()=>{fs.mkdirSync(OUT,{recursive:true});const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
for(const [L,out] of [['he','preview.png'],['en','card.png']]){await p.setContent(html(L));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:path.join(OUT,out)})}
await b.close();console.log('ok',OUT)})();
