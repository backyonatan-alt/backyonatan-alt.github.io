const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const D=__dirname;const NM=path.join(D,'../fl/node_modules/@fontsource/');
const ff=(fam,pkg,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(NM+pkg+'/files/'+pkg+'-latin-'+w+'-normal.woff2').toString('base64')+')}';
const FF=[800,900].map(w=>ff('BSD','big-shoulders-display',w)).join('')+[500,600].map(w=>ff('Mono','ibm-plex-mono',w)).join('')+[400,600].map(w=>ff('Sans','ibm-plex-sans',w)).join('');
const W=JSON.parse(fs.readFileSync(path.join(D,'words.json')));
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${FF}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:#0b1530;color:#eef2ff;font-family:Sans;overflow:hidden;position:relative}
.k{position:absolute;top:190px;left:70px;font-family:Mono;font-weight:600;font-size:30px;letter-spacing:.12em;color:#f5b942}
.mapbox{position:absolute;top:260px;left:0;width:1080px;height:649px;overflow:hidden}
video{width:1080px;height:649px;object-fit:cover;transition:none}
.scene{position:absolute;left:70px;right:70px;top:970px;opacity:0}
.h{font-family:BSD;font-weight:900;font-size:118px;line-height:.98;text-transform:uppercase}
.h em{font-style:normal;color:#f5b942}
.s{font-size:40px;color:#9fb0d8;margin-top:24px}
.bar{height:34px;border-radius:17px;background:#f5b942;margin:6px 0 34px}
.bl{display:flex;justify-content:space-between;font-family:BSD;font-weight:800;font-size:64px;text-transform:uppercase}
.big{display:flex;gap:60px}.big div{flex:1}.big b{display:block;font-family:BSD;font-weight:900;font-size:230px;line-height:1}
.big span{font-size:36px;color:#9fb0d8}
.sub{position:absolute;left:70px;right:70px;bottom:430px;text-align:center;font-size:44px;font-weight:600;line-height:1.3;color:#fff}
.sub i{font-style:normal;color:#f5b942}
.x{color:#ff6b6b}.ok{color:#5fd38a}
</style></head><body>
<div class="k">FREQUENT FLYERS · NBA 2024-25</div>
<div class="mapbox"><video id="v" src="map.mp4" muted></video></div>
<div class="scene" data-a="0" data-b="3.9"><div class="h">An NBA team flies <em>45,000</em> miles a season</div></div>
<div class="scene" data-a="3.9" data-b="9.1">
 <div class="bl"><span>San Antonio</span><span style="color:#f5b942">56,886 mi</span></div><div class="bar" id="b1" style="width:100%"></div>
 <div class="bl"><span>Detroit</span><span>35,302 mi</span></div><div class="bar" id="b2" style="width:62%;background:#4b6fc4"></div></div>
<div class="scene" data-a="9.1" data-b="14.0"><div class="h">Does all that flying <em>cost wins?</em></div><div class="s">Four seasons of NBA games</div></div>
<div class="scene" data-a="14.0" data-b="18.0"><div class="h">Distance: <span class="x">no effect</span></div><div class="h" id="tz" style="margin-top:20px">Time zones: <span class="x">no effect</span></div></div>
<div class="scene" data-a="18.0" data-b="20.5"><div class="h">What hurts is <em>no rest</em></div></div>
<div class="scene" data-a="20.5" data-b="26.1"><div class="s" style="margin:0 0 20px">Road teams win</div><div class="big"><div><b style="color:#f5b942">40%</b><span>on a back-to-back</span></div><div id="d2"><b>46%</b><span>with a day off</span></div></div></div>
<div class="scene" data-a="26.1" data-b="28.7"><div class="h">It's not the flight.</div><div class="h" id="cal" style="margin-top:16px"><em>It's the calendar.</em></div></div>
<div class="scene" data-a="28.7" data-b="99"><div class="h">Full interactive map</div><div class="s" style="font-family:Mono;color:#f5b942;font-size:36px">backyonatan-alt.github.io/flyers</div><div class="s">Link in bio</div></div>
<div class="sub" id="sub"></div>
<script>
const W=${JSON.stringify(W)};
// group words into phrases ending with punctuation
const P=[];let cur=[];W.forEach(w=>{cur.push(w);if(/[.?,:]$/.test(w.text)&&cur.length>=2||/[.?]$/.test(w.text)){P.push(cur);cur=[]}});if(cur.length)P.push(cur);
const sc=[...document.querySelectorAll('.scene')];
window.at=async t=>{
 const v=document.getElementById('v');const vt=Math.min(t+2,21.5);
 if(t<9.1){v.style.opacity=1}else{v.style.opacity=Math.max(.4,1-(t-9.1)*1.5)}
 await new Promise(r=>{if(Math.abs(v.currentTime-vt)<0.001)return r();v.onseeked=()=>r();v.currentTime=vt});
 sc.forEach(s=>{const a=+s.dataset.a,b=+s.dataset.b;let o=0,y=0;if(t>=a&&t<b){const p=Math.min(1,(t-a)/.3);o=p;y=(1-p)*40}s.style.opacity=o;s.style.transform='translateY('+y+'px)'});
 const p1=Math.min(1,Math.max(0,(t-4.0)/.8)),p2=Math.min(1,Math.max(0,(t-7.2)/.8));
 document.getElementById('b1').style.width=(100*p1)+'%';document.getElementById('b2').style.width=(62*p2)+'%';
 document.getElementById('tz').style.opacity=t>=15.95?1:0;document.getElementById('d2').style.opacity=t>=23.8?1:0;document.getElementById('cal').style.opacity=t>=27.3?1:0;
 const ph=P.find(p=>t>=p[0].startSeconds-0.15&&t<=p[p.length-1].endSeconds+0.35);
 document.getElementById('sub').innerHTML=ph?ph.map(w=>t>=w.startSeconds?'<i>'+w.text+'</i>':w.text).join(' '):'';
};
</script></body></html>`;
fs.writeFileSync(path.join(D,'reel.html'),html);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
await pg.goto('file://'+path.join(D,'reel.html'));await pg.waitForTimeout(800);
fs.mkdirSync(path.join(D,'f'),{recursive:true});const FPS=30,T=31.8;
const only=process.argv[2];
if(only){for(const t of only.split(',').map(Number)){await pg.evaluate(t=>at(t),t);await pg.screenshot({path:path.join(D,'p'+t+'.png')})}await b.close();return}
for(let i=0;i<Math.ceil(T*FPS);i++){await pg.evaluate(t=>at(t),i/FPS);await pg.screenshot({path:path.join(D,'f',String(i).padStart(4,'0')+'.png')})}
await b.close();console.log('frames done')})();
