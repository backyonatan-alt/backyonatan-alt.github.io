// Winter article reel: 1080x1920, the gan of 16 running through one winter.
// Data: gan.json (one simulated winter from src/winter, seed 10, contagion 0.5).
// usage: node reel.js            -> frames in f/ then ffmpeg to winter-reel.mp4
//        node reel.js 3,9,16,22  -> preview stills p<t>.png
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const D=__dirname;
const FD='/home/claude/fonts/node_modules/@fontsource/';
const ff=(fam,pkg,sub,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(FD+pkg+'/files/'+pkg+'-'+sub+'-'+w+'-normal.woff2').toString('base64')+')}';
let FF='';for(const sub of ['hebrew','latin']){for(const w of [400,500,700])FF+=ff('Heebo','heebo',sub,w);for(const w of [700,800])FF+=ff('Rubik','rubik',sub,w)}
const G=JSON.parse(fs.readFileSync(path.join(D,'gan.json')));
const html=`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${FF}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:#f6f3ec;color:#1d2230;font-family:Heebo;overflow:hidden;position:relative}
.k{position:absolute;top:120px;right:70px;font-weight:700;font-size:34px;letter-spacing:.06em;color:#e0482b}
.t{position:absolute;top:176px;right:70px;left:70px;font-family:Rubik;font-weight:800;font-size:84px;line-height:1.05}
#room{position:absolute;top:420px;right:70px;width:470px;height:470px}
.now{position:absolute;top:470px;left:70px;width:440px;text-align:right}
.now .n{font-family:Rubik;font-weight:800;font-size:230px;line-height:.9;color:#e0482b;direction:ltr;text-align:right}
.now .n small{font-size:96px;color:#1d2230}
.now .l{font-size:42px;color:#3c4458;margin-top:14px;line-height:1.2}
.now .d{font-size:36px;color:#6a6f7c;margin-top:12px}
#cnt{position:absolute;top:960px;left:50px;width:980px;height:520px}
.cap{position:absolute;right:70px;left:70px;top:1540px;font-family:Rubik;font-weight:700;font-size:62px;line-height:1.15;opacity:0}
.cap em{font-style:normal;color:#e0482b}
.foot{position:absolute;right:70px;left:70px;bottom:90px;font-size:27px;color:#6a6f7c;line-height:1.35}
.end{position:absolute;inset:0;background:#f6f3ec;opacity:0;display:flex;flex-direction:column;justify-content:center;padding:0 80px}
.end .t2{font-family:Rubik;font-weight:800;font-size:150px;line-height:1}
.end .s{font-size:46px;color:#3c4458;margin-top:34px;line-height:1.3}
.end .u{font-size:38px;color:#e0482b;margin-top:60px;direction:ltr;text-align:right;font-weight:700}
.end .c{font-size:38px;color:#6a6f7c;margin-top:14px}
svg text{font-family:Heebo}
</style></head><body>
<div class="k">סיפור בנתונים · חורף</div>
<div class="t">חורף אחד בגן<br>של 16 פעוטות</div>
<svg id="room" viewBox="0 0 470 470"></svg>
<div class="now"><div class="n" id="n"></div><div class="l">ילדים עם<br>סימני מחלה</div><div class="d" id="d"></div></div>
<svg id="cnt" viewBox="0 0 980 520"></svg>
<div class="cap" data-a="1.2" data-b="6.4">כל ילד אדום:<br>יום עם <em>סימני מחלה</em></div>
<div class="cap" data-a="6.4" data-b="10.6">ביום הכי גרוע:<br><em>10 מתוך 16</em></div>
<div class="cap" data-a="10.6" data-b="14.6">וכמעט אין יום<br>שכולם <em>בריאים</em></div>
<div class="cap" data-a="14.6" data-b="18.4">בממוצע: <em>כ-5 ילדים</em><br>חולים בכל יום</div>
<div class="cap" data-a="18.4" data-b="21.4"><em>7-8 מחלות בשנה</em> לפעוט.<br>זה לא מזל רע. זה הממוצע.</div>
<div class="foot">מודל מבוסס מחקר: 7.7 מחלות בשנה לפעוט, מחלה נמשכת כ-10 ימים, עונה לפי נתוני גילאי 0-4. "סימני מחלה" זה לא בהכרח יום בבית. מקורות בכתבה.</div>
<div class="end" id="end"><div class="t2">יום אחד<br>מכל חמישה</div><div class="s">כמה פעוט בגן חולה בחורף, מתי זה מגיע, ומה זה אומר לשנים הבאות.</div><div class="u">backyonatan-alt.github.io/winter</div><div class="c">כתבה אינטראקטיבית. הקישור בתגובה.</div></div>
<script>
const G=${JSON.stringify(G)},NK=16,ND=151,START=new Date(2026,10,1);
const NS='http://www.w3.org/2000/svg';
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
function tx(p,x,y,s,size,fill,anchor,weight){anchor=anchor||'middle';const heb=/[\\u0590-\\u05FF]/.test(s);if(heb&&anchor!=='middle')anchor=anchor==='start'?'end':'start';const e=el('text',{x,y,'font-size':size,fill,'text-anchor':anchor,'font-weight':weight||400},p);if(heb){e.setAttribute('direction','rtl');s='\\u200F'+s+'\\u200F'}e.textContent=s;return e}
const MON=['נוב׳','דצמ׳','ינו׳','פבר׳','מרץ'];
const avg=G.counts.reduce((a,b)=>a+b,0)/ND,mx=Math.max(...G.counts),md=G.counts.indexOf(mx);
const P0=1.0,P1=13.6; // playback window in seconds
const ease=x=>x<0?0:x>1?1:1-Math.pow(1-x,3);
window.at=t=>{
  const prog=Math.max(0,Math.min(1,(t-P0)/(P1-P0))),upto=Math.max(1,Math.round(prog*ND)),d=upto-1;
  // room
  const R=document.getElementById('room');R.innerHTML='';const c=470/4;
  for(let i=0;i<NK;i++){const cx=(i%4)*c+c/2,cy=Math.floor(i/4)*c+c/2,r=c*.38,on=t>=P0&&G.sick[i][d],f=on?'#e0482b':'#e6e0d2';
    el('circle',{cx,cy:cy-r*.5,r:r*.42,fill:f},R);el('path',{d:'M'+(cx-r*.78)+','+(cy+r*.9)+'a'+r*.78+','+r*.72+' 0 0 1 '+r*1.56+',0z',fill:f},R)}
  const today=t>=P0?G.counts[d]:0;
  document.getElementById('n').innerHTML=today+'<small>/16</small>';
  const dd=new Date(+START+d*864e5);document.getElementById('d').textContent=dd.toLocaleDateString('he-IL',{day:'numeric',month:'long'});
  // count chart
  const S=document.getElementById('cnt');S.innerHTML='';const W=980,H=520,l=56,r=10,top=60,ch=380,dw=(W-l-r)/ND,x=q=>l+q*dw,y=v=>top+ch-(v/NK)*ch;
  tx(S,W-r,30,'כמה ילדים חולים בכל יום',34,'#1d2230','end',700);
  [0,4,8,12,16].forEach(v=>{el('line',{x1:l,x2:W-r,y1:y(v),y2:y(v),stroke:'#dcd6c8','stroke-width':v?1.5:2.5},S);tx(S,l-14,y(v)+10,String(v),28,'#6a6f7c','end')});
  let lm=-1;for(let q=0;q<ND;q++){const m=new Date(+START+q*864e5).getMonth();if(m!==lm){lm=m;tx(S,x(q)+4,top+ch+44,MON[(m+2)%12],30,'#6a6f7c','start')}}
  for(let q=upto;q<ND;q++)el('rect',{x:x(q),y:y(G.counts[q]),width:dw-.6,height:top+ch-y(G.counts[q]),fill:'#e9e4d7'},S);
  if(t>=P0)for(let q=0;q<upto;q++)el('rect',{x:x(q),y:y(G.counts[q]),width:dw-.6,height:top+ch-y(G.counts[q]),fill:'#e0482b',opacity:q===d&&prog<1?1:.8},S);
  if(t>=P0&&prog<1)el('line',{x1:x(upto),x2:x(upto),y1:top-6,y2:top+ch,stroke:'#1d2230','stroke-width':2.5},S);
  if(upto>md){const xx=x(md);const lb=tx(S,xx+10,y(mx)-14,'הכי גרוע: '+mx+' מתוך 16',32,'#e0482b','start',700);const bb=lb.getBBox();S.insertBefore(el('rect',{x:bb.x-6,y:bb.y,width:bb.width+12,height:bb.height,fill:'#f6f3ec'},S),lb)}
  // average line draws in after playback
  const pa=ease((t-14.6)/1.2);if(pa>0){el('line',{x1:l,x2:l+(W-l-r)*pa,y1:y(avg),y2:y(avg),stroke:'#1d2230','stroke-width':4,'stroke-dasharray':'14 10'},S);
    const lab=tx(S,l+12,y(avg)-16,'ממוצע: '+avg.toFixed(1),34,'#1d2230','start',700);lab.setAttribute('opacity',ease((t-15.4)/.5));
    // white halo behind the label
    const bb=lab.getBBox();const bg=el('rect',{x:bb.x-8,y:bb.y-2,width:bb.width+16,height:bb.height+4,fill:'#f6f3ec',opacity:.9*ease((t-15.4)/.5)},S);S.insertBefore(bg,lab)}
  // captions
  document.querySelectorAll('.cap').forEach(e=>{const a=+e.dataset.a,b=+e.dataset.b;let o=0,dy=30;if(t>=a&&t<b){o=Math.min(ease((t-a)/.35),ease((b-t)/.25));dy=(1-ease((t-a)/.35))*30}e.style.opacity=o;e.style.transform='translateY('+dy+'px)'});
  document.getElementById('end').style.opacity=ease((t-21.4)/.45);
};
</script></body></html>`;
fs.writeFileSync(path.join(D,'reel.html'),html);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
await pg.goto('file://'+path.join(D,'reel.html'));await pg.waitForTimeout(600);
const only=process.argv[2];
if(only){for(const t of only.split(',').map(Number)){await pg.evaluate(t=>at(t),t);await pg.screenshot({path:path.join(D,'p'+t+'.png')})}await b.close();return}
const FPS=30,T=25.5;fs.rmSync(path.join(D,'f'),{recursive:true,force:true});fs.mkdirSync(path.join(D,'f'));
for(let i=0;i<Math.ceil(T*FPS);i++){await pg.evaluate(t=>at(t),i/FPS);await pg.screenshot({path:path.join(D,'f',String(i).padStart(4,'0')+'.png')})}
await b.close();console.log('frames done')})();
