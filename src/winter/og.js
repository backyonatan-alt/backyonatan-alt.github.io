// Renders winter/preview.png (Hebrew share image) and winter/card.png (English home row), 1200x630.
// Uses the reel's simulated winter (src/social/reel/winter/gan.json). Fonts from npm @fontsource.
// usage: NODE_PATH=$(npm root -g) node src/winter/og.js
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const FD='/home/claude/fonts/node_modules/@fontsource/';
const ff=(fam,pkg,sub,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(FD+pkg+'/files/'+pkg+'-'+sub+'-'+w+'-normal.woff2').toString('base64')+')}';
let FF='';for(const sub of ['hebrew','latin']){for(const w of [400,500,700])FF+=ff('Heebo','heebo',sub,w);for(const w of [700,800])FF+=ff('Rubik','rubik',sub,w)}
const G=JSON.parse(fs.readFileSync(path.join(__dirname,'../social/reel/winter/gan.json')));
const T={he:{dir:'rtl',k:'סיפור בנתונים · חורף',t:'יום אחד<br>מכל חמישה',s:'כמה פעוט בגן חולה בחורף,<br>ומתי זה מגיע',lab:'ילדים חולים בכל יום, גן של 16'},
         en:{dir:'ltr',k:'DATA STORY · IN HEBREW',t:'One Day<br>in Five',s:'How often a toddler in daycare<br>gets sick in winter',lab:'Sick kids per day, a class of 16'}};
function html(L){const c=T[L];
 // daily bars
 const W=520,H=250,dw=W/151,mx=16;let bars='';G.counts.forEach((v,i)=>{const h=v/mx*H;bars+=`<rect x="${(i*dw).toFixed(2)}" y="${(H-h).toFixed(1)}" width="${(dw-.5).toFixed(2)}" height="${h.toFixed(1)}" fill="#e0482b" opacity=".85"/>`});
 const avg=G.counts.reduce((a,b)=>a+b,0)/151,ya=H-avg/mx*H;
 // one day of the gan (peak day)
 const d=G.counts.indexOf(Math.max(...G.counts));let room='';const cs=46;
 for(let i=0;i<16;i++){const cx=(i%4)*cs+cs/2,cy=Math.floor(i/4)*cs+cs/2,r=cs*.38,f=G.sick[i][d]?'#e0482b':'#e3dccc';
  room+=`<circle cx="${cx}" cy="${cy-r*.5}" r="${r*.42}" fill="${f}"/><path d="M${cx-r*.78},${cy+r*.9}a${r*.78},${r*.72} 0 0 1 ${r*1.56},0z" fill="${f}"/>`}
 return `<!doctype html><html dir="${c.dir}"><head><meta charset="utf-8"><style>${FF}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#f6f3ec;color:#1d2230;font-family:Heebo;position:relative;overflow:hidden}
.txt{position:absolute;top:70px;${c.dir==='rtl'?'right':'left'}:70px;width:560px}
.k{font-weight:700;font-size:24px;letter-spacing:.06em;color:#e0482b}
.t{font-family:Rubik;font-weight:800;font-size:${L==='he'?108:104}px;line-height:1;margin-top:18px}
.s{font-size:32px;color:#3c4458;margin-top:26px;line-height:1.3}
.viz{position:absolute;top:70px;${c.dir==='rtl'?'left':'right'}:60px;width:520px}
.lab{font-size:20px;color:#6a6f7c;margin-top:10px;text-align:${c.dir==='rtl'?'right':'left'}}
</style></head><body>
<div class="txt"><div class="k">${c.k}</div><div class="t">${c.t}</div><div class="s">${c.s}</div></div>
<div class="viz"><svg width="184" height="184" style="display:block;margin:${c.dir==='rtl'?'0 auto 26px 0':'0 0 26px 0'}">${room}</svg>
<svg width="520" height="${H}" style="display:block">${bars}<line x1="0" x2="520" y1="${H}" y2="${H}" stroke="#cfc8b8" stroke-width="2"/><line x1="0" x2="520" y1="${ya}" y2="${ya}" stroke="#1d2230" stroke-width="2.5" stroke-dasharray="9 7"/></svg>
<div class="lab">${c.lab}</div></div></body></html>`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
for(const [L,out] of [['he','preview.png'],['en','card.png']]){await p.setContent(html(L));await p.waitForTimeout(300);await p.screenshot({path:path.join(__dirname,'../../winter',out)})}
await b.close();console.log('ok')})();
