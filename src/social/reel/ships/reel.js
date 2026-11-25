// Ships article reel (Hebrew): 1080x1920, 27s, captions only, no voice.
// Personal opening, the real photos, then the map of 29 ships, the fires, and the link.
// Data: src/ships/data.json + map.json, photos from src/ships/photos.
// usage: node reel.js <node_modules with playwright + @fontsource>            -> frames in f/, then ffmpeg (see README)
//        node reel.js <node_modules> 2,6,9,14,19,25                            -> preview stills p<t>.png
const NM=process.argv[2];const {chromium}=require(NM+'/playwright');const fs=require('fs');const path=require('path');const D=__dirname;
const S=path.join(D,'../../../ships/');
const ff=(fam,pkg,sub,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(NM+'/@fontsource/'+pkg+'/files/'+pkg+'-'+sub+'-'+w+'-normal.woff2').toString('base64')+')}';
let FF='';for(const sub of ['hebrew','latin']){for(const w of [400,900])FF+=ff('FR','frank-ruhl-libre',sub,w);FF+=ff('AM','amatic-sc',sub,700)}
const img=k=>'data:image/jpeg;base64,'+fs.readFileSync(S+'photos/'+k+'.jpg').toString('base64');
const DATA=JSON.parse(fs.readFileSync(S+'data.json')),MAP=JSON.parse(fs.readFileSync(S+'map.json'));
const PH=[['migdal-1','מגדל העמק',-2.2,0,0],['kiryat-shmona','קריית שמונה',2.6,40,60],['dimona','דימונה',-3.2,-50,110],['rekhasim','רכסים',1.8,60,30],['givatayim','גבעתיים',-1.4,-10,90]];
const html=`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${FF}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:#f1e8d4;color:#2b2118;font-family:FR;overflow:hidden;position:relative}
.sc{position:absolute;inset:0;opacity:0}
.k{position:absolute;top:130px;right:76px;font-family:AM;font-weight:700;font-size:66px;color:#a8472e;line-height:1}
.h{position:absolute;top:226px;right:76px;left:76px;font-weight:900;font-size:92px;line-height:1.04}
.h em{font-style:normal;color:#a8472e}
.ln{opacity:0;display:block}
.ph{position:absolute;left:50%;top:1090px;width:700px;margin-left:-350px;background:#33291f;padding:34px 30px 22px;opacity:0}
.ph .in{background:#f8f3e7;padding:14px}
.ph img{display:block;width:100%;height:470px;object-fit:cover;filter:sepia(.28) saturate(.82) contrast(.96)}
.ph b{display:block;font-family:AM;font-weight:700;font-size:62px;color:#f8f3e7;text-align:center;line-height:1.1;padding-top:10px}
.ph i{position:absolute;top:-16px;width:150px;height:40px;background:#d6a43a;opacity:.93}
.ph i.a{right:-44px;transform:rotate(32deg)}.ph i.b{left:-40px;transform:rotate(-28deg)}
.mapbox{position:absolute;top:640px;left:50%;width:480px;margin-left:-240px;background:#d6a43a;padding:16px;box-shadow:0 16px 40px rgba(43,33,24,.25);transform:rotate(.6deg)}
.mapbox .in{background:#e6d6aa;border:3px solid #2b2118;outline:1.5px solid #2b2118;outline-offset:-10px;box-shadow:inset 0 0 70px rgba(120,84,40,.38)}
.mapbox svg{display:block;width:100%;height:auto;direction:ltr}
.big{position:absolute;top:130px;right:76px;left:76px;font-weight:900;font-size:104px;line-height:1.02}
.big .n{color:#a8472e;font-size:190px;line-height:.95;display:inline-block;direction:ltr}
.sub{position:absolute;top:505px;right:76px;left:76px;font-size:58px;line-height:1.2}
.end{position:absolute;inset:0;background:#f1e8d4;opacity:0;padding:0 76px}
.end .k2{font-family:AM;font-weight:700;font-size:66px;color:#a8472e;padding-top:200px}
.end .t2{font-weight:900;font-size:116px;line-height:1.02;padding-top:10px}
.end .s{font-size:52px;line-height:1.3;padding-top:40px}
.end .u{font-size:44px;color:#a8472e;font-weight:900;padding-top:56px;direction:ltr;text-align:right}
.end .c{font-family:AM;font-weight:700;font-size:64px;padding-top:8px}
.end img{position:absolute;left:76px;right:76px;top:1010px;width:928px;height:440px;object-fit:cover;border:14px solid #f8f3e7;box-shadow:0 0 0 26px #33291f;filter:sepia(.28) saturate(.82) contrast(.96);transform:rotate(-1.2deg)}
</style></head><body>
<div class="sc" id="s1">
 <div class="k">מסע לזיכרונות ילדות</div>
 <div class="h"><span class="ln" data-a="0.3">ההורים שלי לקחו אותי פעם לספינת פיראטים מעץ.</span><span class="ln" data-a="2.3" style="padding-top:26px"><em>זה היה היום הכי טוב בעולם.</em></span></div>
</div>
<div class="sc" id="s2">
 <div class="k">ואז גיליתי</div>
 <div class="h"><span class="ln" data-a="4.7">הייתי בטוח שהיא רק שלנו.</span><span class="ln" data-a="7.2" style="padding-top:26px"><em>מסתבר שהייתה כזאת כמעט בכל עיר.</em></span></div>
</div>
<div id="photos">${PH.map((p,i)=>`<div class="ph" data-i="${i}" data-r="${p[2]}" data-x="${p[3]}" data-y="${p[4]}"><i class="a"></i><i class="b"></i><div class="in"><img src="${img(p[0])}"></div><b>${p[1]}</b></div>`).join('')}</div>
<div class="sc" id="s3">
 <div class="big"><span class="n" id="n">0</span> ספינות<br>ב־<span id="c">0</span> ערים</div>
 <div class="sub" id="sub"></div>
 <div class="mapbox"><div class="in"><svg id="map"></svg></div></div>
</div>
<div class="end" id="end"><div class="k2">סיפור בנתונים</div><div class="t2">כל ילד היה בטוח שרק לו יש ספינה</div><div class="s">המפה, התמונות, וספינה בתלת־ממד שאפשר לעלות עליה שוב.</div><div class="u">yonatanback.com/ships</div><div class="c">הקישור בביו</div><img src="${img('migdal-1')}"></div>
<script>
const DATA=${JSON.stringify(DATA)},MAP=${JSON.stringify(MAP)},P=MAP.P,NS='http://www.w3.org/2000/svg';
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
const svg=document.getElementById('map'),OX=70,OY=18,W=MAP.w+OX+40,H=MAP.h+OY+16;svg.setAttribute('viewBox','0 0 '+W+' '+H);
[[20,96],[24,200],[40,300],[18,380],[30,455]].forEach(w=>el('path',{d:'M'+w[0]+','+w[1]+'q5,-6 10,0t10,0',fill:'none',stroke:'#4f7a78','stroke-width':1.6,'stroke-linecap':'round'},svg));
const land=el('g',{transform:'translate('+OX+','+OY+')'},svg);
el('path',{d:MAP.isr,fill:'#f4ecd6',stroke:'#2b2118','stroke-width':1.8,'stroke-linejoin':'round'},land);
el('path',{d:MAP.pal,fill:'#f4ecd6',stroke:'#2b2118','stroke-width':1.1,'stroke-dasharray':'2 3'},land);
const LAB={'קריית שמונה':'l','חיפה':'l','גבעתיים':'l','ירושלים':'r','דימונה':'r','אילת':'r'};
const T=DATA.towns,dots=[];let cum=0;
T.forEach(t=>{const x=(t.lon-P.lon0)*P.k*P.S,y=(P.lat0-t.lat)*P.S,g=el('g',{transform:'translate('+x.toFixed(1)+','+y.toFixed(1)+')'},land);
 const c=el('circle',{r:7.5,fill:'#2b2118',stroke:'#f4ecd6','stroke-width':1.6},g);let tx=null;
 if(LAB[t.town]){const l=LAB[t.town]=='l';tx=el('text',{x:l?-13:13,y:8,direction:'rtl','text-anchor':l?'start':'end','font-family':'FR','font-size':25,fill:'#2b2118','paint-order':'stroke',stroke:'#f4ecd6','stroke-width':4},g);tx.textContent=t.town}
 cum+=t.ships.length;dots.push({g,c,cum,fire:t.ships.some(s=>s.end=='fire')})});
const NF=[].concat(...T.map(t=>t.ships)).filter(s=>s.end=='fire').length;
const ease=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
const win=(t,a,b,fi,fo)=>t<a||t>=b?0:Math.min(ease((t-a)/(fi||.4)),ease((b-t)/(fo||.3)));
window.at=t=>{
 s1.style.opacity=win(t,0,4.5);s2.style.opacity=win(t,4.5,10.4);
 document.querySelectorAll('.ln').forEach(e=>{const a=+e.dataset.a,o=ease((t-a)/.45);e.style.opacity=o;e.style.transform='translateY('+(1-o)*26+'px)'});
 // photos: first one from the start, then one every 1.25s, all leave before the map
 const out=1-ease((t-10.1)/.4);
 document.querySelectorAll('.ph').forEach(e=>{const i=+e.dataset.i,a=i==0?0.9:4.8+(i-1)*1.3,o=ease((t-a)/.4);
  e.style.opacity=o*out;e.style.transform='translate('+e.dataset.x+'px,'+((1-o)*-70+ +e.dataset.y-140)+'px) rotate('+(+e.dataset.r+(1-o)*6)+'deg) scale('+(1.12-.12*o)+')'});
 // map
 s3.style.opacity=win(t,10.4,22.2,.5,.4);
 const pr=Math.max(0,Math.min(1,(t-11.2)/4.2)),k=Math.round(pr*T.length);let ships=0;
 dots.forEach((d,i)=>{const on=i<k;if(on)ships=d.cum;d.g.setAttribute('opacity',on?1:0);const burn=d.fire&&t>=18.2;d.c.setAttribute('fill',burn?'#a8472e':'#2b2118');d.c.setAttribute('r',burn?9.5:7.5)});
 n.textContent=ships;c.textContent=k;
 let sub='';if(t>=15.9&&t<18.2)sub='הראשונות עגנו ביוני 1988';else if(t>=18.2&&t<20.4)sub='לפחות <b style="color:#a8472e">'+NF+'</b> מהן נשרפו';else if(t>=20.4)sub='בכוכב יאיר פירקו אחת רק ב־2025';
 const sb=document.getElementById('sub');sb.innerHTML=sub;const a=t<18.2?15.9:t<20.4?18.2:20.4;sb.style.opacity=ease((t-a)/.35);
 end.style.opacity=ease((t-22.2)/.5);
};
</script></body></html>`;
fs.writeFileSync(path.join(D,'reel.html'),html);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
await pg.goto('file://'+path.join(D,'reel.html'));await pg.waitForTimeout(800);
const only=process.argv[3];
if(only){for(const t of only.split(',').map(Number)){await pg.evaluate(t=>at(t),t);await pg.screenshot({path:path.join(D,'p'+t+'.png')})}await b.close();return}
const FPS=30,TT=27;fs.rmSync(path.join(D,'f'),{recursive:true,force:true});fs.mkdirSync(path.join(D,'f'));
for(let i=0;i<Math.ceil(TT*FPS);i++){await pg.evaluate(t=>at(t),i/FPS);await pg.screenshot({path:path.join(D,'f',String(i).padStart(4,'0')+'.png')})}
await b.close();console.log('frames done')})();
