(function(){
'use strict';
const A=ATLAS,G=A.GROUPS,NG=G.length,GI={};G.forEach((g,i)=>GI[g.id]=i);
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const C={sea:css('--sea'),land:css('--land'),coast:css('--coast'),on:css('--on'),mut:css('--on-muted'),line:css('--on-line'),gold:css('--gold-n'),panel:css('--panel')};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- time ---------- */
const WARP=A.WARP;
function y2p(y){if(y<=WARP[0][0])return 0;for(let i=1;i<WARP.length;i++)if(y<=WARP[i][0]){const a=WARP[i-1],b=WARP[i];return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0])}return 1}
function p2y(p){if(p<=0)return WARP[0][0];for(let i=1;i<WARP.length;i++)if(p<=WARP[i][1]){const a=WARP[i-1],b=WARP[i];return a[0]+(b[0]-a[0])*(p-a[1])/(b[1]-a[1])}return WARP[WARP.length-1][0]}
function val(s,y){
  if(y<s[0][0])return 0;const n=s.length;if(y>=s[n-1][0])return s[n-1][1];
  let i=1;while(s[i][0]<y)i++;
  const a=s[i-1],b=s[i],t=(y-a[0])/(b[0]-a[0]);
  return (a[1]>0&&b[1]>0)?a[1]*Math.pow(b[1]/a[1],t):a[1]+(b[1]-a[1])*t;
}
function fmtYear(y){const r=Math.round(y);if(r<=0)return{n:String(Math.max(1,-r)),e:'BCE'};if(r<1000)return{n:String(r),e:'CE'};return{n:String(r),e:''}}
function yearText(y){const f=fmtYear(y);return f.n+(f.e?' '+f.e:'')}
function fmtPop(k){
  if(k>=9950)return (k/1000).toFixed(1)+'M';if(k>=995)return (k/1000).toFixed(2)+'M';
  if(k>=10)return Math.round(k)+'K';if(k>=1)return k.toFixed(1)+'K';
  if(k>=0.05)return String(Math.round(k*10)*100);return '0';
}

/* ---------- projection (Miller) ---------- */
const mill=lat=>1.25*Math.log(Math.tan(Math.PI/4+0.4*lat*Math.PI/180))*180/Math.PI;
const PY=lat=>-mill(lat);
const WORLD=[-128,156,-42,66];

/* ---------- prepared data ---------- */
const REG=A.REGIONS.map(r=>{
  const gs=Object.keys(r.series).map(g=>({gi:GI[g],s:r.series[g]}));
  const o={id:r.id,name:r.name,x:r.lon,y:PY(r.lat),gs,v:new Float64Array(NG),tot:0,sx:0,sy:0,rad:0,peak:0,peakY:0};
  return o;
});
const RID={};REG.forEach(r=>RID[r.id]=r);
function regionAt(r,y,out){let t=0;out.fill(0);for(const g of r.gs){const v=val(g.s,y);out[g.gi]+=v;t+=v}return t}
(function peaks(){const tmp=new Float64Array(NG);
  for(const r of REG){const ys=new Set();for(const g of r.gs)for(const a of g.s)ys.add(a[0]);
    for(const y of ys){const t=regionAt(r,y,tmp);if(t>r.peak){r.peak=t;r.peakY=y}}}})();
const FLOWS=A.FLOWS.map(f=>({a:RID[f[0]],b:RID[f[1]],y0:f[2],y1:f[3],gi:GI[f[4]],p0:y2p(f[2]),p1:y2p(f[3])}));
const EVENTS=A.EVENTS.map(e=>({x:e.lon,y:PY(e.lat),p:y2p(e.y),yr:e.y,t:e.t}));
const CH=A.CHAPTERS.map(c=>Object.assign({p0:y2p(c.y0),p1:y2p(c.y1)},c));

/* ---------- state ---------- */
const S={p:0,playing:false,speed:1,auto:true,arcs:true,stopAt:null,hidden:new Array(NG).fill(false),colors:G.map(g=>g.color),ch:-1,hover:null};
try{const c=JSON.parse(localStorage.getItem('cousins.colors')||'null');if(Array.isArray(c)&&c.length===NG)S.colors=c.map((x,i)=>/^#[0-9a-f]{6}$/i.test(x)?x:G[i].color)}catch(e){}
function applyColors(){G.forEach((g,i)=>document.documentElement.style.setProperty('--g-'+g.id,S.colors[i]))}
applyColors();
const DUR=95; // seconds for a full run at 1x

/* ---------- map canvas ---------- */
const cv=$('map'),ctx=cv.getContext('2d'),box=$('mapbox');
let W=800,H=500,dpr=1;
const landPath=new Path2D(),borderPath=new Path2D();
(function decode(){
  const P=MAP.p;
  for(const ring of MAP.land){let x=0,y=0;for(let i=0;i<ring.length;i+=2){x+=ring[i];y+=ring[i+1];const px=x/P,py=PY(Math.max(-85,Math.min(85,y/P)));i?landPath.lineTo(px,py):landPath.moveTo(px,py)}landPath.closePath()}
  for(const l of MAP.borders){let x=0,y=0;for(let i=0;i<l.length;i+=2){x+=l[i];y+=l[i+1];const px=x/P,py=PY(y/P);i?borderPath.lineTo(px,py):borderPath.moveTo(px,py)}}
})();
const cam={x:35,y:PY(32),k:20},kW={v:3};
function fit(b){const x0=b[0],x1=b[1],y0=PY(b[3]),y1=PY(b[2]);const k=Math.min(W/(x1-x0),H/(y1-y0))*0.94;return{x:(x0+x1)/2,y:(y0+y1)/2,k}}
function clampCam(){cam.k=Math.max(kW.v*0.85,Math.min(kW.v*60,cam.k));cam.x=Math.max(-170,Math.min(178,cam.x));cam.y=Math.max(PY(80),Math.min(PY(-56),cam.y))}
let camGoal=null; // one-off goal from buttons
function chapterAt(p){let i=0;for(let j=0;j<CH.length;j++)if(p>=CH[j].p0-1e-9)i=j;return i}
function resize(){
  const r=box.getBoundingClientRect();W=Math.max(200,r.width);H=Math.max(200,r.height);dpr=Math.min(window.devicePixelRatio||1,2);
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);kW.v=fit(WORLD).k;
}
function setAuto(on){S.auto=on;$('auto').setAttribute('aria-pressed',on);if(on)camGoal=null}

/* ---------- drawing ---------- */
const placed=[];
function free(x,y,w,h){if(x<2||y<2||x+w>W-2||y+h>H-2)return false;for(const b of placed)if(x<b[0]+b[2]&&x+w>b[0]&&y<b[1]+b[3]&&y+h>b[1])return false;return true}
function hitsCircle(x,y,w,h,self){for(const r of REG){if(r===self||r.rad<9)continue;const cx=Math.max(x,Math.min(r.sx,x+w)),cy=Math.max(y,Math.min(r.sy,y+h));if(Math.hypot(cx-r.sx,cy-r.sy)<r.rad*0.85)return true}return false}
function halo(text,x,y,fill){ctx.lineJoin='round';ctx.lineWidth=3.5;ctx.strokeStyle=C.sea;ctx.strokeText(text,x,y);ctx.fillStyle=fill;ctx.fillText(text,x,y)}
function scr(o){return[(o.x-cam.x)*cam.k+W/2,(o.y-cam.y)*cam.k+H/2]}
let order=REG.slice();
function draw(now){
  const year=p2y(S.p);
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=C.sea;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(cam.k,cam.k);ctx.translate(-cam.x,-cam.y);
  ctx.fillStyle=C.land;ctx.fill(landPath);
  ctx.lineWidth=0.6/cam.k;ctx.strokeStyle=C.coast;ctx.globalAlpha=Math.min(.75,.18+cam.k/kW.v*.05);ctx.stroke(borderPath);ctx.globalAlpha=1;
  ctx.restore();

  /* values */
  const zf=Math.max(1,Math.min(5,Math.pow(cam.k/kW.v,0.42)));
  const RS=0.58*Math.max(.6,Math.min(1.15,W/1000))*zf;
  for(const r of REG){
    let t=0;r.v.fill(0);for(const g of r.gs){if(S.hidden[g.gi])continue;const v=val(g.s,year);r.v[g.gi]+=v;t+=v}
    r.tot=t;r.rad=t>=0.04?Math.max(2.4,RS*Math.sqrt(t)):0;const q=scr(r);r.sx=q[0];r.sy=q[1];
  }
  order.sort((a,b)=>b.rad-a.rad);

  /* migration arcs */
  if(S.arcs){
    const t=reduce?0.5:(now/1000);
    for(const f of FLOWS){
      if(S.p<f.p0-0.004||S.p>f.p1+0.004||S.hidden[f.gi])continue;
      const a=scr(f.a),b=scr(f.b),dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);if(d<14)continue;
      const fade=Math.min(1,(S.p-f.p0+0.004)/0.006,(f.p1+0.004-S.p)/0.006);
      const bend=Math.min(d*0.22,90),cx=(a[0]+b[0])/2+dy/d*bend*(dx>0?1:-1),cy=(a[1]+b[1])/2-Math.abs(dx)/d*bend-(Math.abs(dx)<d*0.3?0:0);
      ctx.strokeStyle=S.colors[f.gi];ctx.globalAlpha=.42*fade;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(cx,cy,b[0],b[1]);ctx.stroke();
      ctx.fillStyle=S.colors[f.gi];ctx.globalAlpha=.95*fade;
      const n=d>260?4:3;
      for(let i=0;i<n;i++){const u=reduce?(i+.5)/n:((t*0.32+i/n)%1),m=1-u;const x=m*m*a[0]+2*m*u*cx+u*u*b[0],y=m*m*a[1]+2*m*u*cy+u*u*b[1];ctx.beginPath();ctx.arc(x,y,2.4,0,6.3);ctx.fill()}
    }
    ctx.globalAlpha=1;
  }

  /* bubbles */
  for(const r of order){
    if(!r.rad||r.sx<-r.rad||r.sx>W+r.rad||r.sy<-r.rad||r.sy>H+r.rad)continue;
    let a0=-Math.PI/2,parts=0;for(let i=0;i<NG;i++)if(r.v[i]>r.tot*0.004)parts++;
    ctx.globalAlpha=.9;
    for(let i=0;i<NG;i++){const v=r.v[i];if(v<=r.tot*0.004)continue;
      ctx.fillStyle=S.colors[i];ctx.beginPath();
      if(parts===1){ctx.arc(r.sx,r.sy,r.rad,0,6.2832)}else{const a1=a0+v/r.tot*6.2832;ctx.moveTo(r.sx,r.sy);ctx.arc(r.sx,r.sy,r.rad,a0,a1);ctx.closePath();a0=a1}
      ctx.fill();
      if(parts>1&&r.rad>7){ctx.strokeStyle=C.sea;ctx.lineWidth=1;ctx.stroke()}
    }
    ctx.globalAlpha=1;ctx.strokeStyle=(S.hover===r)?C.on:C.sea;ctx.lineWidth=(S.hover===r)?2:1.5;ctx.beginPath();ctx.arc(r.sx,r.sy,r.rad+.5,0,6.2832);ctx.stroke();
  }

  /* event pulses and labels */
  placed.length=0;placed.push([0,0,Math.min(W*.5,300),H*.2]);placed.push([W-52,0,52,130]);
  ctx.textBaseline='middle';
  const win=0.02;
  for(const e of EVENTS){
    const age=(S.p-e.p)/win;if(age<0||age>1)continue;
    const q=scr(e);if(q[0]<0||q[0]>W||q[1]<0||q[1]>H)continue;
    const al=age<.75?1:(1-age)/.25;
    ctx.strokeStyle=C.gold;ctx.lineWidth=2;ctx.globalAlpha=al*(1-age*.6);ctx.beginPath();ctx.arc(q[0],q[1],6+age*30,0,6.2832);ctx.stroke();
    ctx.globalAlpha=al;ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(q[0],q[1],3,0,6.2832);ctx.fill();
    const txt=yearText(e.yr)+' · '+e.t;ctx.font='600 12.5px "IBM Plex Mono",ui-monospace,monospace';
    const tw=ctx.measureText(txt).width;let lx=q[0]+12,ly=q[1]-16;if(lx+tw>W-6)lx=q[0]-12-tw;if(lx<6)lx=6;if(ly<H*.2+10)ly=q[1]+18;
    ctx.textAlign='left';halo(txt,lx,ly,C.gold);placed.push([lx-4,ly-10,tw+8,20]);ctx.globalAlpha=1;
  }

  /* region labels */
  let shown=0;
  for(const r of order){
    if(!r.rad||shown>=14)break;
    if(r.sx<0||r.sx>W||r.sy<0||r.sy>H)continue;
    if(r.rad<7&&shown>=5&&r!==S.hover)continue;
    ctx.font='600 12.5px "IBM Plex Sans",system-ui,sans-serif';
    const nm=r.name,nw=ctx.measureText(nm).width;ctx.font='400 11px "IBM Plex Mono",ui-monospace,monospace';
    const pv=fmtPop(r.tot),pw=ctx.measureText(pv).width,w=Math.max(nw,pw),h=29;
    const opts=[[r.sx+r.rad+6,r.sy-h/2,'left'],[r.sx-r.rad-6-w,r.sy-h/2,'right'],[r.sx-w/2,r.sy+r.rad+4,'center'],[r.sx-w/2,r.sy-r.rad-4-h,'center']];
    if(r.rad>w/2+10)opts.unshift([r.sx-w/2,r.sy-h/2,'center']);
    for(const o of opts){
      if(!free(o[0]-2,o[1]-1,w+4,h+2)||hitsCircle(o[0],o[1],w,h,r))continue;
      const tx=o[2]==='left'?o[0]:o[2]==='right'?o[0]+w:o[0]+w/2;
      ctx.textAlign=o[2];ctx.font='600 12.5px "IBM Plex Sans",system-ui,sans-serif';halo(nm,tx,o[1]+8,C.on);
      ctx.font='400 11px "IBM Plex Mono",ui-monospace,monospace';halo(pv,tx,o[1]+22,C.on);
      placed.push([o[0]-2,o[1]-1,w+4,h+2]);shown++;break;
    }
  }
}

/* ---------- side panel ---------- */
const legendBtns=[],barSegs=[];
(function buildPanel(){
  const ul=$('legend'),bar=$('sharebar'),sw=$('swgrid');
  G.forEach((g,i)=>{
    const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed','true');b.title=g.note;
    b.innerHTML='<i style="background:var(--g-'+g.id+')"></i><span class="n">'+esc(g.name)+'</span><span class="v">0</span><span class="s">0%</span>';
    b.addEventListener('click',()=>{S.hidden[i]=!S.hidden[i];b.setAttribute('aria-pressed',String(!S.hidden[i]));stackDirty=true;lastPanel=0});
    li.appendChild(b);ul.appendChild(li);legendBtns.push({b,v:b.querySelector('.v'),s:b.querySelector('.s')});
    const seg=document.createElement('i');seg.style.background='var(--g-'+g.id+')';seg.style.flex='0 1 0%';bar.appendChild(seg);barSegs.push(seg);
    const lab=document.createElement('label');lab.htmlFor='c-'+g.id;lab.innerHTML=esc(g.name.split(' / ')[0])+'<input type="color" id="c-'+g.id+'" value="'+S.colors[i]+'">';
    lab.querySelector('input').addEventListener('input',e=>{S.colors[i]=e.target.value;applyColors();stackDirty=true;try{localStorage.setItem('cousins.colors',JSON.stringify(S.colors))}catch(err){}});
    sw.appendChild(lab);
  });
  $('creset').addEventListener('click',()=>{S.colors=G.map(g=>g.color);applyColors();stackDirty=true;G.forEach((g,i)=>{$('c-'+g.id).value=S.colors[i]});try{localStorage.removeItem('cousins.colors')}catch(err){}});
})();
let lastPanel=0;
const tmpT=new Float64Array(NG);
function updatePanel(now){
  if(now-lastPanel<90)return;lastPanel=now;
  const year=p2y(S.p),f=fmtYear(year);
  $('yr').innerHTML=f.n+(f.e?'<small>'+f.e+'</small>':'');
  tmpT.fill(0);let tot=0;
  for(const r of REG)for(let i=0;i<NG;i++){tmpT[i]+=r.v[i];tot+=r.v[i]}
  $('tot').textContent=fmtPop(tot);
  for(let i=0;i<NG;i++){
    const L=legendBtns[i],v=tmpT[i],sh=tot?v/tot*100:0;
    L.v.textContent=S.hidden[i]?'–':fmtPop(v);L.s.textContent=S.hidden[i]?'':(sh>=10?sh.toFixed(0):sh>=0.05?sh.toFixed(1):'0')+'%';
    L.b.classList.toggle('zero',!(v>=0.05)&&!S.hidden[i]);barSegs[i].style.flex=(v>0?v/tot*100:0)+' 1 0%';barSegs[i].hidden=!(v>0);
  }
  const top=REG.filter(r=>r.tot>=0.05).sort((a,b)=>b.tot-a.tot).slice(0,5);
  $('top').innerHTML=top.map(r=>{let mi=0;for(let i=1;i<NG;i++)if(r.v[i]>r.v[mi])mi=i;return '<li><i style="background:var(--g-'+G[mi].id+')"></i><span>'+esc(r.name)+'</span><b>'+fmtPop(r.tot)+'</b></li>'}).join('');
  const ci=chapterAt(S.p);
  if(ci!==S.ch){S.ch=ci;const c=CH[ci];
    $('chno').textContent=ci+1;$('chtitle').textContent=c.title;$('chtext').textContent=c.text;$('yrsub').textContent=c.title;
    $('chyrs').textContent='Chapter '+(ci+1)+' of '+CH.length+' · '+yearText(c.y0)+' to '+yearText(c.y1);
    chipBtns.forEach((b,j)=>{b.setAttribute('aria-current',String(j===ci))});
    const cb=chipBtns[ci],cc=$('chips');if(cb&&cc.scrollWidth>cc.clientWidth)cc.scrollTo({left:cb.offsetLeft-cc.clientWidth/2+cb.offsetWidth/2,behavior:reduce?'auto':'smooth'});
  }
  const tw=$('tlwrap');tw.setAttribute('aria-valuenow',Math.round(year));tw.setAttribute('aria-valuetext',yearText(year));
  if(S.hover)showTip(S.hover);
}

/* ---------- chapters ---------- */
const chipBtns=[];
(function buildChips(){const box=$('chips');
  CH.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<b>'+esc(c.title)+'</b><span>'+yearText(c.y0)+'</span>';
    b.addEventListener('click',()=>goChapter(i));box.appendChild(b);chipBtns.push(b)});
})();
function goChapter(i,play){i=Math.max(0,Math.min(CH.length-1,i));S.p=CH[i].p0+1e-6;S.stopAt=null;setAuto(true);lastPanel=0;if(play){S.stopAt=CH[i].p1;setPlaying(true)}}
$('chprev').addEventListener('click',()=>goChapter(S.ch-1));
$('chnext').addEventListener('click',()=>goChapter(S.ch+1));
$('chplay').addEventListener('click',()=>goChapter(S.ch,true));

/* ---------- controls ---------- */
function setPlaying(on){
  if(on&&S.p>=0.9995){S.p=0;S.stopAt=null}
  S.playing=on;$('playlab').textContent=on?'Pause':'Play';
  $('playicon').setAttribute('d',on?'M3 1.5h3.5v13H3zM9.5 1.5H13v13H9.5z':'M3 1.5v13l11-6.5z');
}
$('play').addEventListener('click',()=>{if(!S.playing)S.stopAt=null;setPlaying(!S.playing)});
$('speed').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;S.speed=+b.dataset.s;[...$('speed').children].forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
$('auto').addEventListener('click',()=>setAuto(!S.auto));
$('arcs').addEventListener('click',()=>{S.arcs=!S.arcs;$('arcs').setAttribute('aria-pressed',String(S.arcs))});
$('views').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;setAuto(false);camGoal=fit(b.dataset.v.split(',').map(Number))});
$('zworld').addEventListener('click',()=>{setAuto(false);camGoal=fit(WORLD)});
function zoomBy(f,px,py){setAuto(false);camGoal=null;const wx=(px-W/2)/cam.k+cam.x,wy=(py-H/2)/cam.k+cam.y;cam.k*=f;clampCam();cam.x=wx-(px-W/2)/cam.k;cam.y=wy-(py-H/2)/cam.k;clampCam()}
$('zin').addEventListener('click',()=>zoomBy(1.6,W/2,H/2));
$('zout').addEventListener('click',()=>zoomBy(1/1.6,W/2,H/2));
cv.addEventListener('wheel',e=>{if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();const r=cv.getBoundingClientRect();zoomBy(Math.exp(-e.deltaY*0.01),e.clientX-r.left,e.clientY-r.top)},{passive:false});
cv.addEventListener('dblclick',e=>{const r=cv.getBoundingClientRect();zoomBy(1.8,e.clientX-r.left,e.clientY-r.top)});
const ptrs=new Map();let pinch=0,moved=false;
cv.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,[e.clientX,e.clientY]);moved=false;try{cv.setPointerCapture(e.pointerId)}catch(err){}if(ptrs.size===2){const a=[...ptrs.values()];pinch=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}});
cv.addEventListener('pointermove',e=>{
  const r=cv.getBoundingClientRect();
  if(!ptrs.has(e.pointerId)){hoverAt(e.clientX-r.left,e.clientY-r.top);return}
  const prev=ptrs.get(e.pointerId),dx=e.clientX-prev[0],dy=e.clientY-prev[1];ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===1){if(!moved&&Math.hypot(dx,dy)<2)return;moved=true;cv.classList.add('drag');setAuto(false);camGoal=null;cam.x-=dx/cam.k;cam.y-=dy/cam.k;clampCam();hideTip()}
  else if(ptrs.size===2){const a=[...ptrs.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pinch>0)zoomBy(d/pinch,(a[0][0]+a[1][0])/2-r.left,(a[0][1]+a[1][1])/2-r.top);pinch=d;moved=true}
});
function endPtr(e){const r=cv.getBoundingClientRect();if(ptrs.has(e.pointerId)&&!moved&&e.type==='pointerup')hoverAt(e.clientX-r.left,e.clientY-r.top);ptrs.delete(e.pointerId);pinch=0;cv.classList.remove('drag')}
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hideTip()});

/* ---------- tooltip ---------- */
const tip=$('tip');
function hoverAt(x,y){let best=null;for(let i=order.length-1;i>=0;i--){const r=order[i];if(!r.rad)continue;if(Math.hypot(x-r.sx,y-r.sy)<=Math.max(r.rad,9)+3){best=r;break}}
  if(best){S.hover=best;showTip(best)}else hideTip()}
function showTip(r){
  if(!r.rad){hideTip();return}
  let h='<b>'+esc(r.name)+'</b> · '+fmtPop(r.tot);
  for(let i=0;i<NG;i++)if(r.v[i]>=0.05&&r.v[i]>r.tot*0.004)h+='<div class="row"><i style="background:var(--g-'+G[i].id+')"></i>'+esc(G[i].name)+'<span>'+fmtPop(r.v[i])+'</span></div>';
  h+='<div class="pk">Peak '+fmtPop(r.peak)+' in '+yearText(r.peakY)+'</div>';
  tip.innerHTML=h;tip.hidden=false;
  const tw=tip.offsetWidth,th=tip.offsetHeight;let x=r.sx+r.rad+12,y=r.sy-th/2;if(x+tw>W-6)x=r.sx-r.rad-12-tw;if(x<6)x=6;y=Math.max(6,Math.min(H-th-6,y));
  tip.style.left=x+'px';tip.style.top=y+'px';
}
function hideTip(){S.hover=null;tip.hidden=true}

/* ---------- timeline ---------- */
const tl=$('tl'),tctx=tl.getContext('2d'),tlw=$('tlwrap');
let TW=600,TH=86,stack=null,stackDirty=true;
const NS=520,TLAB=22;
function buildStack(){
  stack=document.createElement('canvas');stack.width=Math.round(TW*dpr);stack.height=Math.round(TH*dpr);
  const c=stack.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
  const cols=[];let mx=0;const tmp=new Float64Array(NG);
  for(let j=0;j<=NS;j++){const y=p2y(j/NS),t=new Float64Array(NG);for(const r of REG){regionAt(r,y,tmp);for(let i=0;i<NG;i++)if(!S.hidden[i])t[i]+=tmp[i]}let s=0;for(let i=0;i<NG;i++)s+=t[i];mx=Math.max(mx,s);cols.push(t)}
  const top=8,bot=TH-TLAB,hh=bot-top;mx=mx||1;
  /* chapter bands */
  CH.forEach((ch,i)=>{if(i%2)return;c.fillStyle='rgba(255,255,255,.035)';c.fillRect(ch.p0*TW,0,(ch.p1-ch.p0)*TW,bot)});
  const base=new Float64Array(NS+1);
  for(let i=0;i<NG;i++){
    c.fillStyle=S.colors[i];c.beginPath();
    for(let j=0;j<=NS;j++){const x=j/NS*TW,y=bot-(base[j]+cols[j][i])/mx*hh;j?c.lineTo(x,y):c.moveTo(x,y)}
    for(let j=NS;j>=0;j--)c.lineTo(j/NS*TW,bot-base[j]/mx*hh);
    c.closePath();c.fill();for(let j=0;j<=NS;j++)base[j]+=cols[j][i];
  }
  c.strokeStyle=C.line;c.lineWidth=1;c.beginPath();c.moveTo(0,bot+.5);c.lineTo(TW,bot+.5);c.stroke();
  c.font='400 10.5px "IBM Plex Mono",ui-monospace,monospace';c.textBaseline='middle';c.fillStyle=C.mut;
  const ticks=[[-1000,'1000 BCE'],[2025,'2025'],[1,'1 CE'],[1492,'1492'],[1939,'1939'],[-586,'586 BCE'],[1000,'1000'],[1800,'1800'],[650,'650'],[1945,'1945'],[1880,'1880'],[135,'135']];
  const used=[];
  for(const [y,t] of ticks){const x=y2p(y)*TW,w=c.measureText(t).width;let lx=x-w/2;if(lx<4)lx=4;if(lx+w>TW-4)lx=TW-4-w;
    if(used.some(u=>lx<u[1]+10&&lx+w>u[0]-10))continue;used.push([lx,lx+w]);c.textAlign='left';c.fillText(t,lx,bot+TLAB/2+1);
    c.strokeStyle=C.mut;c.beginPath();c.moveTo(x+.5,bot);c.lineTo(x+.5,bot+4);c.stroke()}
  stackDirty=false;
}
function drawTL(){
  if(stackDirty||!stack)buildStack();
  tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,tl.width,tl.height);tctx.drawImage(stack,0,0);
  tctx.setTransform(dpr,0,0,dpr,0,0);
  const x=S.p*TW,bot=TH-TLAB;
  tctx.fillStyle='rgba(14,23,48,.55)';tctx.fillRect(x,0,TW-x,bot);
  tctx.strokeStyle=C.on;tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(x,0);tctx.lineTo(x,bot+3);tctx.stroke();
  tctx.fillStyle=C.gold;tctx.beginPath();tctx.moveTo(x-6,0);tctx.lineTo(x+6,0);tctx.lineTo(x,8);tctx.closePath();tctx.fill();
}
function resizeTL(){const r=tlw.getBoundingClientRect();TW=Math.max(100,r.width-2);TH=Math.max(40,r.height-2);tl.width=Math.round(TW*dpr);tl.height=Math.round(TH*dpr);stackDirty=true}
let scrub=false;
function scrubTo(e){const r=tl.getBoundingClientRect();S.p=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));S.stopAt=null;lastPanel=0}
tlw.addEventListener('pointerdown',e=>{scrub=true;try{tlw.setPointerCapture(e.pointerId)}catch(err){}scrubTo(e)});
tlw.addEventListener('pointermove',e=>{if(scrub)scrubTo(e)});
tlw.addEventListener('pointerup',()=>{scrub=false});tlw.addEventListener('pointercancel',()=>{scrub=false});
tlw.addEventListener('keydown',e=>{
  let d=0;if(e.key==='ArrowRight'||e.key==='ArrowUp')d=0.004;else if(e.key==='ArrowLeft'||e.key==='ArrowDown')d=-0.004;
  else if(e.key==='Home'){S.p=0;e.preventDefault()}else if(e.key==='End'){S.p=1;e.preventDefault()}
  else if(e.key===' '||e.key==='Enter'){e.preventDefault();setPlaying(!S.playing)}
  if(d){e.preventDefault();S.p=Math.max(0,Math.min(1,S.p+d*(e.shiftKey?5:1)));S.stopAt=null}lastPanel=0;
});

/* ---------- main loop ---------- */
let last=0,visible=true,first=true;
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(0.1,(now-last)/1000||0);last=now;
  if(!visible||document.hidden)return;
  if(S.playing){
    S.p+=dt/DUR*S.speed;
    if(S.stopAt!==null&&S.p>=S.stopAt){S.p=S.stopAt;S.stopAt=null;setPlaying(false)}
    if(S.p>=1){S.p=1;setPlaying(false)}
  }
  let goal=camGoal;if(S.auto)goal=fit(CH[chapterAt(S.p)].cam);
  if(goal){
    const a=first||reduce?1:1-Math.exp(-dt*2.4);
    cam.x+=(goal.x-cam.x)*a;cam.y+=(goal.y-cam.y)*a;cam.k*=Math.pow(goal.k/cam.k,a);
    if(camGoal&&Math.abs(Math.log(goal.k/cam.k))<0.003&&Math.abs(goal.x-cam.x)*cam.k<0.5)camGoal=null;
  }
  first=false;
  draw(now);drawTL();updatePanel(now);
}
function onResize(){resize();resizeTL();lastPanel=0}
if(window.ResizeObserver){new ResizeObserver(onResize).observe(box);new ResizeObserver(onResize).observe(tlw)}else addEventListener('resize',onResize);
if(window.IntersectionObserver)new IntersectionObserver(es=>{visible=es[0].isIntersecting},{rootMargin:'200px'}).observe(document.querySelector('.atlas'));
onResize();requestAnimationFrame(frame);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{stackDirty=true});

/* ---------- world series for charts ---------- */
function worldAt(y){const t=new Float64Array(NG),tmp=new Float64Array(NG);for(const r of REG){regionAt(r,y,tmp);for(let i=0;i<NG;i++)t[i]+=tmp[i]}return t}
const sum=a=>{let s=0;for(const v of a)s+=v;return s};

/* ---------- bottleneck chart ---------- */
(function bottleneck(){
  const svg=$('bchart'),Wd=860,Hd=400,L=52,Rr=96,T=16,B=34,x0=900,x1=2025,ASH=GI.ash;
  const sx=y=>L+(y-x0)/(x1-x0)*(Wd-L-Rr),lg=v=>Math.log10(Math.max(v,0.3)),sy=v=>T+(1-(lg(v)-lg(1))/(lg(20000)-lg(1)))*(Hd-T-B);
  const pts=[];for(let y=x0;y<=x1;y+=(y>=1930&&y<1950?1:5)){const w=worldAt(y),a=w[ASH];pts.push([y,a,sum(w)-a])}
  if(pts[pts.length-1][0]!==2025){const w=worldAt(2025);pts.push([2025,w[ASH],sum(w)-w[ASH]])}
  let g='';
  for(const [v,t] of [[1,'1K'],[10,'10K'],[100,'100K'],[1000,'1M'],[10000,'10M']])g+='<line x1="'+L+'" x2="'+(Wd-Rr)+'" y1="'+sy(v)+'" y2="'+sy(v)+'" stroke="var(--on-line)" stroke-width="1"/><text x="'+(L-8)+'" y="'+(sy(v)+4)+'" text-anchor="end">'+t+'</text>';
  for(let y=1000;y<=2000;y+=200)g+='<text x="'+sx(y)+'" y="'+(Hd-B+18)+'" text-anchor="middle">'+y+'</text><line x1="'+sx(y)+'" x2="'+sx(y)+'" y1="'+(Hd-B)+'" y2="'+(Hd-B+4)+'" stroke="var(--on-muted)"/>';
  const path=k=>pts.filter(p=>p[k]>=0.3).map((p,i)=>(i?'L':'M')+sx(p[0]).toFixed(1)+','+sy(p[k]).toFixed(1)).join('');
  g+='<path d="'+path(2)+'" fill="none" stroke="var(--on-muted)" stroke-width="2" stroke-linejoin="round"/>';
  g+='<path d="'+path(1)+'" fill="none" stroke="var(--g-ash)" stroke-width="2.5" stroke-linejoin="round"/>';
  const lastP=pts[pts.length-1];
  g+='<text class="strong" x="'+(Wd-Rr+8)+'" y="'+(sy(lastP[1])+4)+'">Ashkenazi</text><text x="'+(Wd-Rr+8)+'" y="'+(sy(lastP[1])+18)+'">'+fmtPop(lastP[1])+'</text>';
  g+='<text class="strong" x="'+(Wd-Rr+8)+'" y="'+(sy(lastP[2])+10)+'">All others</text><text x="'+(Wd-Rr+8)+'" y="'+(sy(lastP[2])+24)+'">'+fmtPop(lastP[2])+'</text>';
  const at=y=>{const w=worldAt(y);return w[ASH]};
  const notes=[[1096,'1096 Crusade',-1,0],[1306,'1306 France expels',-1,0],[1348,'1348 Black Death',1,0],[1648,'1648 massacres',1,0],[1945,'1939–45 Shoah',1,0]];
  for(const [y,t,dir,dx] of notes){const v=at(y),px=sx(y),py=sy(v),ty=py+dir*34;
    g+='<line x1="'+px+'" x2="'+px+'" y1="'+(py+dir*5)+'" y2="'+(ty-dir*(dir>0?11:4))+'" stroke="var(--gold-n)" stroke-width="1"/><circle cx="'+px+'" cy="'+py+'" r="3.5" fill="var(--gold-n)" stroke="var(--sea)" stroke-width="1.5"/><text x="'+(px+dx)+'" y="'+(ty+(dir>0?4:0))+'" text-anchor="'+(dx<0?'end':'middle')+'" style="fill:var(--gold-n)">'+t+'</text>'}
  g+='<line id="bx" y1="'+T+'" y2="'+(Hd-B)+'" stroke="var(--on)" stroke-width="1" visibility="hidden"/><circle id="bd1" r="4.5" fill="var(--g-ash)" stroke="var(--sea)" stroke-width="2" visibility="hidden"/><circle id="bd2" r="4.5" fill="var(--on-muted)" stroke="var(--sea)" stroke-width="2" visibility="hidden"/>';
  g+='<rect id="bhit" x="'+L+'" y="'+T+'" width="'+(Wd-L-Rr)+'" height="'+(Hd-T-B)+'" fill="transparent"/>';
  svg.innerHTML=g;
  const bt=$('btip'),bx=$('bx'),d1=$('bd1'),d2=$('bd2');
  function move(e){const r=svg.getBoundingClientRect(),ux=(e.clientX-r.left)/r.width*Wd,y=Math.max(x0,Math.min(x1,Math.round(x0+(ux-L)/(Wd-L-Rr)*(x1-x0))));
    const w=worldAt(y),a=w[ASH],o=sum(w)-a,px=sx(y);
    bx.setAttribute('x1',px);bx.setAttribute('x2',px);bx.setAttribute('visibility','visible');
    d1.setAttribute('cx',px);d1.setAttribute('cy',sy(a));d1.setAttribute('visibility',a>=0.3?'visible':'hidden');
    d2.setAttribute('cx',px);d2.setAttribute('cy',sy(o));d2.setAttribute('visibility','visible');
    bt.innerHTML='<b>'+y+'</b><br>Ashkenazi '+fmtPop(a)+'<br>All others '+fmtPop(o)+'<br>Ashkenazi share '+(a/(a+o)*100).toFixed(a/(a+o)<.1?1:0)+'%';bt.hidden=false;
    const cx=px/Wd*r.width;let lx=cx+12;if(lx+bt.offsetWidth>r.width-4)lx=cx-12-bt.offsetWidth;bt.style.left=lx+'px';bt.style.top='8px'}
  function out(){bt.hidden=true;[bx,d1,d2].forEach(n=>n.setAttribute('visibility','hidden'))}
  svg.addEventListener('pointermove',move);svg.addEventListener('pointerdown',move);svg.addEventListener('pointerleave',out);
})();

/* ---------- pedigree ---------- */
(function pedigree(){
  const inp=$('gen'),ASH=GI.ash;
  function big(n){if(n>=1e12)return (n/1e12).toFixed(n>=1e13?0:1)+'T';if(n>=1e9)return (n/1e9).toFixed(n>=1e10?0:2)+'B';if(n>=1e6)return (n/1e6).toFixed(n>=1e7?0:1)+'M';if(n>=1e4)return Math.round(n/1e3)+'K';return n.toLocaleString('en-US')}
  function upd(){
    const g=+inp.value,yr=2000-25*g,slots=Math.pow(2,g),w=worldAt(yr);let pop=w[ASH]*1000,lab='Ashkenazi Jews alive';
    if(pop<1000){pop=sum(w)*1000;lab='Jews alive, all communities'}
    $('genv').textContent=g;$('pyr').textContent=yearText(yr);$('pslots').textContent=big(slots);$('ppop').textContent=fmtPop(pop/1000);$('ppoplab').textContent=lab;
    $('bar1').style.width=Math.min(100,Math.log10(slots)/12*100)+'%';$('bar2').style.width=Math.min(100,Math.log10(pop)/12*100)+'%';
    const ratio=slots/pop,v=$('pverdict');
    if(lab!=='Ashkenazi Jews alive')v.textContent='Before about 950 there is no Ashkenaz to count. The tree runs back into the wider Jewish and European populations of late antiquity, and it needs '+big(slots)+' slots from a Jewish world of '+fmtPop(pop/1000)+'.';
    else if(ratio<0.02)v.textContent='Plenty of room. The tree needs '+big(slots)+' people and there are '+fmtPop(pop/1000)+' to choose from. Your ancestors here can all be different people.';
    else if(ratio<1)v.textContent='Getting tight. The tree needs '+big(slots)+' people out of '+fmtPop(pop/1000)+'. Some ancestors already appear more than once.';
    else v.textContent='Impossible without repeats. The tree has '+big(slots)+' slots and only '+fmtPop(pop/1000)+' people to fill them. On average each person would have to appear '+big(Math.round(ratio))+' times. Any two people who descend from this group share ancestors here.';
  }
  inp.addEventListener('input',upd);upd();
})();

/* ---------- data table ---------- */
(function table(){
  const ys=[-1000,-750,-586,-500,-300,-100,1,66,150,300,650,1000,1170,1300,1400,1491,1500,1600,1700,1800,1850,1880,1900,1914,1939,1945,1950,1970,1990,2000,2010,2025];
  let h='<thead><tr><th>Year</th><th>World</th>'+G.map(g=>'<th>'+esc(g.name)+'</th>').join('')+'</tr></thead><tbody>';
  for(const y of ys){const w=worldAt(y);h+='<tr><td>'+yearText(y)+'</td><td>'+fmtPop(sum(w))+'</td>'+Array.from(w).map(v=>'<td>'+(v>=0.05?fmtPop(v):'')+'</td>').join('')+'</tr>'}
  $('dtable').innerHTML=h+'</tbody>';
})();
})();
