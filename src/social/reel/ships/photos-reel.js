// Ships photo reel (Hebrew): photos first, a little text, the map, no voice. Two sizes from one script.
// usage: node photos-reel.js <node_modules> 45  [t1,t2,...]   -> 1080x1350 for Facebook and LinkedIn feeds
//        node photos-reel.js <node_modules> 916 [t1,t2,...]   -> 1080x1920 for Instagram
// Without the time list it writes frames to f<size>/; encode with ffmpeg (see src/social/README.md).
const NM=process.argv[2],SZ=process.argv[3]||'45';const {chromium}=require(NM+'/playwright');const fs=require('fs');const path=require('path');const D=__dirname;
const W=1080,H=SZ=='916'?1920:1350,TALL=H>1500;
const S=path.join(D,'../../../ships/');
const ff=(fam,pkg,sub,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(NM+'/@fontsource/'+pkg+'/files/'+pkg+'-'+sub+'-'+w+'-normal.woff2').toString('base64')+')}';
let FF='';for(const sub of ['hebrew','latin']){for(const w of [400,900])FF+=ff('FR','frank-ruhl-libre',sub,w);FF+=ff('AM','amatic-sc',sub,700)}
const img=k=>'data:image/jpeg;base64,'+fs.readFileSync(S+'photos/'+k+'.jpg').toString('base64');
const DATA=JSON.parse(fs.readFileSync(S+'data.json')),MAP=JSON.parse(fs.readFileSync(S+'map.json'));
// order: old film photos first, then the rest
const PH=[['migdal-1','מגדל העמק'],['kiryat-shmona','קריית שמונה'],['dimona','דימונה'],['givatayim','גבעתיים'],['rekhasim','רכסים'],['afula','עפולה עילית'],['migdal-2','מגדל העמק'],['eilat','אילת'],['emanuel','עמנואל']];
const T0=2.4,STEP=1.55,TM=T0+PH.length*STEP,TE=TM+6.2,TT=TE+3.6;   // photos start, map start, end card, total
const top=TALL?330:170,fw=TALL?940:900,ih=TALL?900:790;             // photo frame
const mapW=TALL?520:480,mapTop=TALL?610:140;
const html=`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${FF}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden}body{width:${W}px;height:${H}px;background:#f1e8d4;color:#2b2118;font-family:FR;overflow:hidden;position:relative}
#st{position:absolute;top:0;left:0;width:${W}px;height:${H}px;overflow:hidden}
.sc{position:absolute;inset:0;opacity:0}
.k{font-family:AM;font-weight:700;color:#a8472e;line-height:1}
#opn{display:flex;flex-direction:column;justify-content:center;padding:0 80px;background:#f1e8d4}
#opn .k{font-size:84px}#opn h1{font-weight:900;font-size:${TALL?150:132}px;line-height:1.0;padding-top:14px}
.ph{position:absolute;left:50%;top:${top}px;width:${fw}px;margin-left:-${fw/2}px;background:#33291f;padding:40px 34px 26px;opacity:0}
.ph .in{background:#f8f3e7;padding:16px;overflow:hidden}
.ph .cl{height:${ih}px;overflow:hidden}
.ph img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.28) saturate(.82) contrast(.96)}
.ph b{display:block;font-family:AM;font-weight:700;font-size:92px;color:#f8f3e7;text-align:center;line-height:1.05;padding-top:14px}
.ph i{position:absolute;top:-18px;width:170px;height:44px;background:#d6a43a;opacity:.93}
.ph i.a{right:-50px;transform:rotate(32deg)}.ph i.b{left:-46px;transform:rotate(-28deg)}
.tag{position:absolute;top:${TALL?200:0}px;right:0;left:0;text-align:center;font-size:70px;display:${TALL?'block':'none'}}
.big{position:absolute;top:${TALL?170:330}px;right:80px;left:${TALL?80:610}px;font-weight:900;font-size:${TALL?108:92}px;line-height:1.02}
.big .n{color:#a8472e;font-size:${TALL?200:170}px;line-height:.95;display:inline-block}
.sub{position:absolute;top:${TALL?1700:790}px;right:80px;left:${TALL?80:610}px;font-size:${TALL?58:54}px;line-height:1.2;text-align:${TALL?'center':'right'}}
.mapbox{position:absolute;top:${mapTop}px;left:${TALL?'50%':'90px'};width:${mapW}px;${TALL?'margin-left:-'+mapW/2+'px;':''}background:#d6a43a;padding:14px;box-shadow:0 16px 40px rgba(43,33,24,.25);transform:rotate(.6deg)}
.mapbox .in{background:#e6d6aa;border:3px solid #2b2118;outline:1.5px solid #2b2118;outline-offset:-10px;box-shadow:inset 0 0 70px rgba(120,84,40,.38)}
.mapbox svg{display:block;width:100%;height:auto;direction:ltr}
#end{background:#f1e8d4;padding:${TALL?260:110}px 80px 0}
#end .k{font-size:74px}
#end h1{font-weight:900;font-size:${TALL?124:108}px;line-height:1.02;padding-top:10px}
#end .s{font-size:${TALL?54:48}px;line-height:1.3;padding-top:30px}
#end .u{font-size:46px;color:#a8472e;font-weight:900;padding-top:36px;direction:ltr;text-align:right}
#end .row{position:absolute;left:60px;right:60px;top:${TALL?1130:800}px;display:flex;gap:26px;direction:ltr}
#end .row div{flex:1;background:#f8f3e7;padding:12px;box-shadow:0 8px 20px rgba(43,33,24,.22)}
#end .row div:nth-child(1){transform:rotate(-2.4deg)}#end .row div:nth-child(2){transform:rotate(1.6deg) translateY(18px)}#end .row div:nth-child(3){transform:rotate(-1deg)}
#end .row img{display:block;width:100%;height:${TALL?330:290}px;object-fit:cover;filter:sepia(.28) saturate(.82) contrast(.96)}
</style></head><body><div id="st">
<div class="k tag" id="tag">ישראל, 1988</div>
<div id="photos">${PH.map((p,i)=>`<div class="ph" data-i="${i}"><i class="a"></i><i class="b"></i><div class="in"><div class="cl"><img src="${img(p[0])}"></div></div><b>${p[1]}</b></div>`).join('')}</div>
<div class="sc" id="opn"><div class="k">ישראל, 1988</div><h1>כל ילד היה בטוח שרק לו יש ספינה</h1></div>
<div class="sc" id="s3">
 <div class="big"><span class="n" id="n">0</span> ספינות<br>ב־<span id="c">0</span> ערים</div>
 <div class="mapbox"><div class="in"><svg id="map"></svg></div></div>
 <div class="sub" id="sub">מקריית שמונה ועד אילת</div>
</div>
<div class="sc" id="end"><div class="k">איפה הייתה שלכם?</div><h1>כל ילד היה בטוח שרק לו יש ספינה</h1><div class="s">המפה, התמונות, וספינה בתלת־ממד שאפשר לעלות עליה שוב.</div><div class="u">backyonatan-alt.github.io/ships</div>
 <div class="row"><div><img src="${img('kiryat-shmona')}"></div><div><img src="${img('migdal-1')}"></div><div><img src="${img('dimona')}"></div></div></div>
</div><script>
const DATA=${JSON.stringify(DATA)},MAP=${JSON.stringify(MAP)},P=MAP.P,NS='http://www.w3.org/2000/svg',TALL=${TALL};
const T0=${T0},STEP=${STEP},TM=${TM},TE=${TE},NP=${PH.length};
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
const svg=document.getElementById('map'),OX=70,OY=18,W=MAP.w+OX+40,H=MAP.h+OY+16;svg.setAttribute('viewBox','0 0 '+W+' '+H);
[[20,96],[24,200],[40,300],[18,380],[30,455]].forEach(w=>el('path',{d:'M'+w[0]+','+w[1]+'q5,-6 10,0t10,0',fill:'none',stroke:'#4f7a78','stroke-width':1.6,'stroke-linecap':'round'},svg));
const land=el('g',{transform:'translate('+OX+','+OY+')'},svg);
el('path',{d:MAP.isr,fill:'#f4ecd6',stroke:'#2b2118','stroke-width':1.8,'stroke-linejoin':'round'},land);
el('path',{d:MAP.pal,fill:'#f4ecd6',stroke:'#2b2118','stroke-width':1.1,'stroke-dasharray':'2 3'},land);
const LAB={'קריית שמונה':'l','חיפה':'l','גבעתיים':'l','ירושלים':'r','דימונה':'r','אילת':'r'};
const T=DATA.towns,dots=[];let cum=0;
T.forEach(t=>{const x=(t.lon-P.lon0)*P.k*P.S,y=(P.lat0-t.lat)*P.S,g=el('g',{transform:'translate('+x.toFixed(1)+','+y.toFixed(1)+')'},land);
 el('circle',{r:8,fill:'#2b2118',stroke:'#f4ecd6','stroke-width':1.6},g);
 if(LAB[t.town]){const l=LAB[t.town]=='l',tx=el('text',{x:l?-14:14,y:9,direction:'rtl','text-anchor':l?'start':'end','font-family':'FR','font-size':27,fill:'#2b2118','paint-order':'stroke',stroke:'#f4ecd6','stroke-width':4.5},g);tx.textContent=t.town}
 cum+=t.ships.length;dots.push({g,cum})});
const ease=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
const win=(t,a,b,fi,fo)=>t<a||t>=b?0:Math.min(ease((t-a)/(fi||.4)),ease((b-t)/(fo||.3)));
const ROT=[-1.6,1.4,-1,1.8,-1.4,1,-1.8,1.2,-.8];
// the mini side stack for the wide-ish feed format: photos sit to the right of the map
window.at=t=>{
 opn.style.opacity=win(t,0,T0+.15,.01,.35);
 tag.style.opacity=win(t,T0,TM,.4,.3);
 const out=1-ease((t-(TM-.1))/.4);
 document.querySelectorAll('.ph').forEach(e=>{const i=+e.dataset.i,a=T0+i*STEP-(i?0:.6),o=ease((t-a)/.38),age=Math.max(0,t-a);
  const hide=i<NP-1&&t>a+STEP*2.2?0:1;   // keep at most three on the pile
  e.style.opacity=o*out*hide;e.style.transform='translate('+((1-o)*(i%2?90:-90))+'px,'+((1-o)*-40)+'px) rotate('+(ROT[i]+(1-o)*(i%2?7:-7))+'deg)';
  e.querySelector('img').style.transform='scale('+(1.02+Math.min(age,STEP*1.4)*.035)+')'});
 s3.style.opacity=win(t,TM,TE,.5,.35);
 const pr=Math.max(0,Math.min(1,(t-TM-.6)/3.4)),k=Math.round(pr*T.length);let ships=0;
 dots.forEach((d,i)=>{const on=i<k;if(on)ships=d.cum;d.g.setAttribute('opacity',on?1:0)});
 n.textContent=ships;c.textContent=k;sub.style.opacity=ease((t-TM-4.2)/.4);
 end.style.opacity=ease((t-TE)/.45);
};
</script></body></html>`;
fs.writeFileSync(path.join(D,'photos-reel.html'),html);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:W,height:H}});
await pg.goto('file://'+path.join(D,'photos-reel.html'));await pg.waitForTimeout(800);
const only=process.argv[4];
if(only){for(const t of only.split(',').map(Number)){await pg.evaluate(t=>at(t),t);await pg.screenshot({path:path.join(D,'q'+SZ+'_'+t+'.png')})}await b.close();return}
const FPS=30,F=path.join(D,'f'+SZ);fs.rmSync(F,{recursive:true,force:true});fs.mkdirSync(F);
for(let i=0;i<Math.ceil(TT*FPS);i++){await pg.evaluate(t=>at(t),i/FPS);await pg.screenshot({path:path.join(F,String(i).padStart(4,'0')+'.png')})}
await b.close();console.log("frames done",TT)})();
