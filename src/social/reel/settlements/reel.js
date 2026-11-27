// Settlements article reel: 1080x1920, a big map filling up from 1870 to 2023, Hebrew captions burnt in at the top.
// Year, period and count sit over the sea. No bar chart: Yonatan asked for a bigger map and no bars.
// Data: ../../../settlements/data.json and map.json (same files as the page).
// usage: node reel.js [voice] [45]         -> frames in f/ (jpg), then the ffmpeg lines in src/social/README.md
//        node reel.js [voice] [45] 3,8,12.5 -> preview stills p<t>.png
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const D=__dirname;
const FD=process.env.FONTS||'/home/claude/fonts/node_modules/@fontsource/';
const ff=(fam,pkg,sub,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(path.join(FD,pkg,'files',pkg+'-'+sub+'-'+w+'-normal.woff2')).toString('base64')+')}';
let FF='';for(const sub of ['hebrew','latin']){for(const w of [400,500,700])FF+=ff('Heebo','heebo',sub,w);FF+=ff('Plex','ibm-plex-sans-hebrew',sub,700)}
const S=path.join(D,'../../../settlements/');
const MAP=JSON.parse(fs.readFileSync(S+'map.json')),DATA=JSON.parse(fs.readFileSync(S+'data.json'));
// Two timings. Default: silent cut, 27.5s. 'voice': timed to Yonatan's own narration (voice/narration.m4a),
// line starts and ends taken from the pauses in the recording.
const VOICE=process.argv.includes('voice');
const T=VOICE?{dur:41.5,end:37.9,k:[[1.13,1870],[5.58,1919],[12.9,1948],[16.9,1950],[23.3,1952],[28.2,1977],[34.0,2024]],
   cap:[[1.13,5.58],[5.58,12.9],[12.9,16.9],[16.9,23.3],[23.3,28.2],[28.2,34.0],[34.0,37.7]]}
 :{dur:27.5,end:23.4,k:[[1.2,1870],[4.6,1919],[9.2,1948],[14.2,1952],[17.2,1977],[20.4,2024]],
   cap:[[1.2,4.6],[4.6,9.2],[9.2,11.7],[11.7,14.2],[14.2,17.2],[17.2,20.4],[20.4,23.2]]};
const DUR=T.dur;
// '45' = 1080x1350 feed cut (LinkedIn, Facebook). Default is 1080x1920.
const FEED=process.argv.includes('45'),H=FEED?1350:1920,VB=FEED?'-420 0 795 766':'-244 0 590.8 766';
const CSS45=FEED?`body{height:1350px}.k{top:54px}.t,.cap{top:100px;font-size:62px}#map{top:262px;height:1040px}.side{top:292px}.yr{font-size:140px}.era{font-size:30px}.n{font-size:104px;margin-top:22px}.nl{font-size:30px}.foot{top:1118px;font-size:21px}.src{top:1310px;font-size:23px}.end .t2{font-size:120px}`:'';
const CAPS=['זה מתחיל ב-<em>1870</em>.<br>בית ספר חקלאי אחד.','עד קום המדינה:<br><em>284 יישובים</em> ב-78 שנים','ואז, בארבע שנים:<br><em>עוד 308</em>','ב-1949 לבדה: <em>123</em>.<br>יישוב חדש כל שלושה ימים','אחרי 1967 המפה<br>חוצה את <em>הקו הירוק</em>','הגל הגדול האחרון:<br><em>226 יישובים</em> ב-13 שנים','היום: <em>1,095 יישובים</em>.<br>מתי קם שלכם?'];
const html=`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${FF}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:#fff;color:#111827;font-family:Heebo;overflow:hidden;position:relative}
.k{position:absolute;top:92px;right:64px;font-weight:700;font-size:33px;letter-spacing:.04em;color:#b91c1c}
.t,.cap{position:absolute;top:146px;right:64px;left:64px;font-family:Plex;font-weight:700;font-size:70px;line-height:1.12}
.cap{opacity:0}.cap em{font-style:normal;color:#b91c1c}
#map{position:absolute;top:330px;left:0;width:1080px;height:1400px;background:#e6edf3}
.side{position:absolute;top:372px;left:56px;width:430px;text-align:right}
.yr{font-family:Plex;font-weight:700;font-size:160px;line-height:.95;direction:ltr;text-align:right;letter-spacing:-3px}
.era{font-weight:700;font-size:33px;margin-top:10px;display:flex;align-items:center;gap:12px;min-height:46px;white-space:nowrap}
.era i{width:24px;height:24px;border-radius:50%;flex:none}
.n{font-family:Plex;font-weight:700;font-size:118px;line-height:1;margin-top:34px;direction:ltr;text-align:right}
.nl{font-size:34px;color:#374151;margin-top:2px}
.foot{position:absolute;left:56px;width:400px;top:1500px;font-size:23px;color:#6b7280;line-height:1.35}
.src{position:absolute;right:64px;left:64px;top:1760px;font-size:26px;color:#6b7280}
.end{position:absolute;inset:0;background:#fff;opacity:0;display:flex;flex-direction:column;justify-content:center;padding:0 76px}
.end .t2{font-family:Plex;font-weight:700;font-size:138px;line-height:1.04}
.end .s{font-size:46px;color:#374151;margin-top:34px;line-height:1.3}
.end .u{font-size:40px;color:#b91c1c;margin-top:60px;direction:ltr;text-align:right;font-weight:700}
.end .c{font-size:38px;color:#6b7280;margin-top:14px}
${CSS45}
</style></head><body>
<div class="k">סיפור בנתונים · התיישבות</div>
<div class="t" id="ttl">כל יישוב בארץ,<br>לפי השנה שבה קם</div>
<svg id="map" viewBox="${VB}"></svg>
<div class="side"><div class="yr" id="yr">1870</div><div class="era" id="era"></div><div class="n" id="n">0</div><div class="nl">יישובים על המפה</div></div>
${CAPS.map((c,i)=>`<div class="cap" data-a="${T.cap[i][0]}" data-b="${T.cap[i][1]}">${c}</div>`).join("\n")}
<div class="foot">הנתונים: קובץ היישובים של הלשכה המרכזית לסטטיסטיקה. שנת הייסוד כפי שהיא רשומה שם. יישובים יהודיים ומעורבים שקיימים היום, ועוד 24 שפונו.</div>
<div class="src">yonatanback.com/settlements</div>
<div class="end" id="end"><div class="t2">מתי קם<br>היישוב שלכם?</div><div class="s">מפה שאפשר לנגן ולחפש בה.<br>153 שנים, 1,119 יישובים.</div><div class="u">yonatanback.com/settlements</div><div class="c">כתבה אינטראקטיבית. הקישור בתגובה.</div></div>
<script>
const MAP=${JSON.stringify(MAP)},DATA=${JSON.stringify(DATA)};
const NS='http://www.w3.org/2000/svg';
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
const PAL=['#1d4ed8','#ea580c','#0d9488','#be185d','#ca8a04','#15803d','#7c3aed','#b91c1c'],ENDS=[1918,1935,1939,1947,1951,1966,1976,2023];
const NAMES=['המושבות הראשונות','העמקים והשרון','חומה ומגדל','ערב המדינה','העלייה ההמונית','עיירות הפיתוח','אחרי ששת הימים','ההתנחלויות והמצפים'];
const era=y=>ENDS.findIndex(e=>y<=e),P=MAP.P,px=(lon,lat)=>[(lon-P.lon0)*P.k*P.S,(P.lat0-lat)*P.S];
// time -> year, slower through the busy years. [t, year] knots; captions above follow the same knots.
const K=${JSON.stringify(T.k)},TEND=${T.end};
const yearAt=t=>{if(t<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(t<=K[i][0]){const[a,ya]=K[i-1],[b,yb]=K[i];return ya+(yb-ya)*(t-a)/(b-a)}return K[K.length-1][1]};
const tOf=y=>{for(let i=1;i<K.length;i++)if(y<=K[i][1]){const[a,ya]=K[i-1],[b,yb]=K[i];return a+(b-a)*(y-ya)/(yb-ya)}return K[K.length-1][0]};
const M=document.getElementById('map');
el('path',{d:MAP.nb,fill:'#f1f3f5'},M);el('path',{d:MAP.isr,fill:'#fff',stroke:'#c3c9d1','stroke-width':.7},M);el('path',{d:MAP.pal,fill:'#f4f5f7',stroke:'#aeb5bf','stroke-width':.9,'stroke-dasharray':'3 3'},M);
const gO=el('g',{},M),gD=el('g',{},M),gL=el('g',{},M);
const lab=(x,y,s,side)=>{const t=el('text',{x:side=='l'?x-6:x+6,y:y+4,'font-size':15.5,'font-weight':700,'text-anchor':side=='l'?'start':'end',direction:'rtl',fill:'#111827','font-family':'Heebo',stroke:'#fff','stroke-width':3,'paint-order':'stroke'},gL);t.textContent=s;return t};
const TAG={'תל אביב-יפו':['תל אביב','l'],'באר שבע':['באר שבע','r'],'אילת':['אילת','r'],'חיפה':['חיפה','l'],'ירושלים':['ירושלים','r']};
DATA.old.forEach(p=>{const[x,y]=px(p[3],p[2]);el('circle',{cx:x,cy:y,r:3.6,fill:'#fff',stroke:'#111827','stroke-width':1.4},gO);if(TAG[p[0]])lab(x,y,TAG[p[0]][0],TAG[p[0]][1])});
const pts=DATA.pts.map((p,i)=>{const[x,y]=px(p[3],p[2]),ya=p[1]+((i*7919)%100)/100,o={yr:p[1],e:era(p[1]),ta:tOf(ya),end:p[7]?tOf(p[7]):1e9,x,y};
 o.c=el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:0,fill:PAL[o.e]},gD);if(TAG[p[0]]){o.tag=lab(x,y,TAG[p[0]][0],TAG[p[0]][1]);o.tag.setAttribute('opacity',0)}return o});
const ease=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
window.at=t=>{
 const yf=yearAt(t),y=Math.min(2023,Math.floor(yf)),e=era(y);let n=0;
 pts.forEach(p=>{const a=t-p.ta;
  if(a<0){p.c.setAttribute('r',0);return}
  if(t>=p.end){p.c.setAttribute('r',2.3);p.c.setAttribute('fill','none');p.c.setAttribute('stroke','#6b7280');p.c.setAttribute('stroke-width',1);p.c.setAttribute('stroke-opacity',1);return}
  n++;const k=ease(a/.45);p.c.setAttribute('fill',PAL[p.e]);p.c.setAttribute('r',(2.5+3.2*(1-k)).toFixed(2));p.c.setAttribute('stroke',PAL[p.e]);p.c.setAttribute('stroke-width',(9*(1-k)).toFixed(2));p.c.setAttribute('stroke-opacity',.28);
  if(p.tag)p.tag.setAttribute('opacity',Math.min(1,a/.3))});
 document.getElementById('yr').textContent=y;
 document.getElementById('era').innerHTML='<i style="background:'+PAL[e]+'"></i>'+NAMES[e];
 document.getElementById('n').textContent=n.toLocaleString('en');
 document.getElementById('ttl').style.opacity=Math.max(0,Math.min(1,(K[0][0]-t)/.25));
 document.querySelectorAll('.cap').forEach(c=>{const a=+c.dataset.a,b=+c.dataset.b;c.style.opacity=Math.max(0,Math.min(1,(t-a)/.3,(b-t)/.25))});
 document.getElementById('end').style.opacity=ease((t-TEND)/.6);
};
</script></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:H}});
 await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 const arg=process.argv.slice(2).find(a=>a!=='45'&&/^[0-9.,]+$/.test(a));
 if(arg){for(const t of arg.split(',')){await p.evaluate(t=>at(+t),t);await p.screenshot({path:path.join(D,'p'+t+'.png')})}}
 else{fs.mkdirSync(path.join(D,'f'),{recursive:true});const N=Math.round(DUR*30);
  for(let i=0;i<N;i++){await p.evaluate(t=>at(t),i/30);await p.screenshot({path:path.join(D,'f',String(i).padStart(4,'0')+'.jpg'),type:'jpeg',quality:92})}
  console.log('frames',N)}
 await b.close()})();
