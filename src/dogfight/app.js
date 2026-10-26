(function(){
const $=id=>document.getElementById(id);
const KT=0.5144,G=9.81,VS=150*KT;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function maxN(v){return Math.min(9,(v/VS)**2)}
function maxRate(v){const n=maxN(v);return n<=1?0:G*Math.sqrt(n*n-1)/v}
function wrap(a){while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a}

/* ================= turn chart (SVG) ================= */
(function(){
  const W=520,H=300,L=46,Rt=14,T=20,B=44,x0=150,x1=700,y1=25;
  const sx=k=>L+(k-x0)/(x1-x0)*(W-L-Rt),sy=d=>T+(1-d/y1)*(H-T-B);
  const rateDeg=k=>maxRate(k*KT)*180/Math.PI;
  function chart(k){
    let g='<g class="grid">';
    for(let d=0;d<=25;d+=5)g+='<line x1="'+L+'" x2="'+(W-Rt)+'" y1="'+sy(d)+'" y2="'+sy(d)+'"/><text class="t-mu" x="'+(L-8)+'" y="'+(sy(d)+4)+'" text-anchor="end">'+d+'</text>';
    for(let v=200;v<=700;v+=100)g+='<text class="t-mu" x="'+sx(v)+'" y="'+(H-B+18)+'" text-anchor="middle">'+v+'</text>';
    g+='</g><text class="t-mu" x="'+(W-Rt)+'" y="'+(H-8)+'" text-anchor="end">airspeed, knots</text><text class="t-mu" x="'+L+'" y="12">turn rate, degrees per second</text>';
    let p='';for(let v=x0;v<=x1;v+=5)p+=(p?'L':'M')+sx(v).toFixed(1)+','+sy(rateDeg(v)).toFixed(1);
    g+='<path d="'+p+'" class="s-me"/>';
    g+='<line class="s-dim" x1="'+sx(450)+'" x2="'+sx(450)+'" y1="'+sy(rateDeg(450))+'" y2="'+sy(0)+'"/><text x="'+(sx(450)+6)+'" y="'+(sy(rateDeg(450))-8)+'">corner speed</text>';
    g+='<circle class="f-bd" r="5" cx="'+sx(584)+'" cy="'+sy(rateDeg(584))+'"/><text class="t-bd" x="'+(sx(584)+8)+'" y="'+(sy(rateDeg(584))-8)+'">the screenshot</text>';
    g+='<line stroke="currentColor" stroke-width="1.5" x1="'+sx(k)+'" x2="'+sx(k)+'" y1="'+T+'" y2="'+sy(0)+'"/><circle class="f-ink" r="5" cx="'+sx(k)+'" cy="'+sy(rateDeg(k))+'"/>';
    $('chart').innerHTML=g;
  }
  function circ(r){
    const s=0.088,pr=Math.min(r*s,78),big=r*s>78;
    let g='<circle cx="85" cy="85" r="'+pr.toFixed(1)+'" class="s-me"'+(big?' stroke-dasharray="4 4"':'')+'/>';
    g+='<text class="t-me" x="85" y="89" text-anchor="middle">your turn circle</text>';
    g+='<line stroke="currentColor" stroke-width="3" x1="180" x2="180" y1="'+(160-2100*s).toFixed(1)+'" y2="160"/><text x="190" y="'+(164-1050*s).toFixed(1)+'">2.1 km</text>';
    $('circ').innerHTML=g;
  }
  function upd(){
    const k=+$('spd').value,v=k*KT,w=maxRate(v),r=v/w;
    $('spdV').textContent=k;$('oRate').textContent=(w*180/Math.PI).toFixed(1)+'°/s';
    $('oRad').textContent=Math.round(r/10)*10+' m';$('oT').textContent=(Math.PI/w).toFixed(1)+' s';
    chart(k);circ(r);
  }
  $('spd').addEventListener('input',upd);upd();
})();

/* ================= drills ================= */
(function(){
  let done={};try{done=JSON.parse(localStorage.getItem('drills')||'{}')}catch(e){}
  document.querySelectorAll('#drillList input').forEach(c=>{c.checked=!!done[c.id];
    c.addEventListener('change',()=>{done[c.id]=c.checked;try{localStorage.setItem('drills',JSON.stringify(done))}catch(e){}})});
})();

/* ================= 3D ================= */
if(!window.THREE){document.querySelectorAll('.stage').forEach(s=>s.insertAdjacentHTML('beforeend','<p class="nogl">The 3D clip could not load in this browser.</p>'));return}
const T=THREE,V=(x,y,z)=>new T.Vector3(x,y,z);
const P={fog:0x9cc9ea,fogNF:[130,420],ground:0x2a6fa6,grid:0x9ccbe6,gridOp:.2,hemi:[0xffffff,0x4f86b5,.95],sun:.9,me:0x1556b0,bd:0xd23a24,body:0xb3bec6,under:0xe3e9ed,trailOp:.36,edgeMix:.8,shadow:.22,drop:0xffffff,cloud:[0xffffff,.5]};
const JET=1.3,WING=3.05*JET;

/* ---------- jet model: single-engine fighter, nose toward +z ---------- */
function loft(secs,seg,n){
  const pos=[],idx=[],e=2/n;
  secs.forEach(q=>{for(let j=0;j<seg;j++){const a=j/seg*6.28318,c=Math.cos(a),sn=Math.sin(a);
    pos.push(q[1]*Math.sign(c)*Math.pow(Math.abs(c),e),q[3]+q[2]*Math.sign(sn)*Math.pow(Math.abs(sn),e),q[0])}});
  for(let i=0;i<secs.length-1;i++)for(let j=0;j<seg;j++){const a=i*seg+j,b=i*seg+(j+1)%seg,c=a+seg,d=b+seg;idx.push(a,c,b,b,c,d)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function slab(pts,d){const sh=new T.Shape();pts.forEach((q,i)=>i?sh.lineTo(q[0],q[1]):sh.moveTo(q[0],q[1]));
  return new T.ExtrudeGeometry(sh,{depth:d,steps:1,bevelEnabled:true,bevelThickness:.012,bevelSize:.03,bevelSegments:1})}
const GEO=(()=>{
  const nose=[[4.75,.015,.015,-.04],[4.45,.09,.09,-.03],[3.9,.2,.19,-.01],[3.3,.3,.29,.02]];
  const fus=[[3.3,.3,.29,.02],[2.6,.42,.42,.05],[1.8,.55,.5,.05],[.8,.66,.55,.02],[-.4,.7,.56,0],[-1.6,.66,.54,0],[-2.8,.56,.5,.02],[-3.7,.47,.46,.03],[-4.4,.43,.43,.03]];
  const W=[[0,2.95],[.42,2.7],[.78,1.1],[3.05,-.95],[3.05,-1.7],[.5,-1.95],[-.5,-1.95],[-3.05,-1.7],[-3.05,-.95],[-.78,1.1],[-.42,2.7]];
  const St=[[0,-2.6],[.5,-2.6],[1.85,-3.6],[1.85,-4.05],[.5,-4.0],[-.5,-4.0],[-1.85,-4.05],[-1.85,-3.6],[-.5,-2.6]];
  return {nose:loft(nose,20,2.1),fus:loft(fus,20,2.5),intake:loft([[2.15,.3,.17,-.5],[1.3,.37,.21,-.55],[-.2,.36,.17,-.5],[-1.4,.2,.04,-.46]],16,2.6),
    lip:new T.CircleGeometry(1,16),wing:slab(W,.045).rotateX(Math.PI/2),stab:slab(St,.04).rotateX(Math.PI/2),
    fin:slab([[-1.4,.4],[-3.25,2.6],[-4.0,2.6],[-3.95,.4]],.07).rotateY(-Math.PI/2).translate(.035,0,0),
    can:new T.SphereGeometry(1,22,14),msl:new T.CylinderGeometry(.065,.065,2.2,8).rotateX(Math.PI/2),mslTip:new T.ConeGeometry(.065,.35,8).rotateX(Math.PI/2),
    noz:new T.CylinderGeometry(.43,.34,.5,18,1,true).rotateX(Math.PI/2).translate(0,.03,-4.62),glow:new T.CircleGeometry(.31,16),
    f1:new T.ConeGeometry(.3,3.2,14,1,true).rotateX(-Math.PI/2).translate(0,0,-1.6),f2:new T.ConeGeometry(.17,1.9,12,1,true).rotateX(-Math.PI/2).translate(0,0,-.95)};
})();
function makeJet(col){
  const g=new T.Group(),ph=o=>new T.MeshPhongMaterial(Object.assign({shininess:38,specular:0x333b40},o)),c=new T.Color(col);
  const m={body:ph({color:new T.Color(P.body).lerp(c,.28)}),radome:ph({color:0x3d474e,shininess:20}),top:ph({color:c}),bot:ph({color:new T.Color(P.under).lerp(c,.38)}),
    can:ph({color:0x0d1a22,shininess:160,specular:0xffffff,transparent:true,opacity:.93}),dark:ph({color:0x15191c,side:T.DoubleSide,shininess:8}),msl:ph({color:0xe9edf0}),
    glow:new T.MeshBasicMaterial({color:0xffb347}),
    f1:new T.MeshBasicMaterial({color:0xff7a2e,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),
    f2:new T.MeshBasicMaterial({color:0xd7ecff,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide})};
  const add=(geo,mat)=>{const me=new T.Mesh(geo,mat);g.add(me);return me};
  add(GEO.nose,m.radome);add(GEO.fus,m.body);add(GEO.intake,m.body);
  const lip=add(GEO.lip,m.dark);lip.scale.set(.27,.14,1);lip.position.set(0,-.5,2.16);
  add(GEO.wing,m.top).position.y=.06;add(GEO.wing,m.bot).position.y=0;
  add(GEO.stab,m.top).position.y=.07;add(GEO.stab,m.bot).position.y=.02;
  add(GEO.fin,m.top);
  const can=add(GEO.can,m.can);can.scale.set(.31,.37,1.3);can.position.set(0,.4,2.05);
  [-1,1].forEach(sd=>{add(GEO.msl,m.msl).position.set(sd*3.13,.02,-1.25);add(GEO.mslTip,m.msl).position.set(sd*3.13,.02,.02)});
  add(GEO.noz,m.dark);const gl=add(GEO.glow,m.glow);gl.rotation.y=Math.PI;gl.position.set(0,.03,-4.7);
  const fl=new T.Group();fl.position.set(0,.03,-4.82);g.add(fl);fl.add(new T.Mesh(GEO.f1,m.f1),new T.Mesh(GEO.f2,m.f2));
  g.scale.setScalar(JET);
  g.userData.burn=v=>{fl.scale.set(.8+.3*v,.8+.3*v,Math.max(.05,v))};
  return g;
}

/* ---------- paths ---------- */
function keyed(keys){return t=>{let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;
  const k0=keys[Math.max(0,i-1)],k1=keys[i],k2=keys[i+1],k3=keys[Math.min(keys.length-1,i+2)],s=clamp((t-k1[0])/(k2[0]-k1[0]),0,1),o=[];
  for(let j=1;j<k1.length;j++){const a=k0[j],b=k1[j],c=k2[j],d=k3[j];o.push(.5*(2*b+(-a+c)*s+(2*a-5*b+4*c-d)*s*s+(-a+3*b-3*c+d)*s*s*s))}return o}}
function lin(keys){return t=>{let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;const a=keys[i],b=keys[i+1],s=clamp((t-a[0])/(b[0]-a[0]),0,1);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*s)}}
const N=360;
function sample(fn,upFn,g){
  const Pp=[],F=[],U=[],R=[];
  for(let i=0;i<=N;i++)Pp.push(fn(i/N));
  for(let i=0;i<=N;i++){F.push(Pp[Math.min(N,i+1)].clone().sub(Pp[Math.max(0,i-1)]).normalize());
    if(upFn)U.push(upFn(i/N));else{const k=8,a=clamp(i,k,N-k),h=k/N;U.push(Pp[a+k].clone().add(Pp[a-k]).addScaledVector(Pp[a],-2).multiplyScalar(1/(h*h)).add(V(0,g,0)))}}
  if(!upFn)for(let pass=0;pass<3;pass++){const S=U.map((_,i)=>{const s=V(0,0,0);let n=0;for(let j=-6;j<=6;j++){const q=U[i+j];if(q){s.add(q);n++}}return s.multiplyScalar(1/n)});S.forEach((s,i)=>U[i]=s)}
  for(let i=0;i<=N;i++){const r=U[i].clone().cross(F[i]).normalize();R.push(r);U[i]=F[i].clone().cross(r).normalize()}
  return {P:Pp,F,U,R};
}
const polar=k=>{const f=keyed(k);return t=>{const [th,r,y]=f(t);return V(r*Math.cos(th),y,r*Math.sin(th))}};
const xyz=k=>{const f=keyed(k);return t=>{const [x,y,z]=f(t);return V(x,y,z)}};
function halfLoop(dir){ // dir 1 = Immelmann (up), -1 = Split-S (down)
  const L1=30,Rr=13,L3=30,arc=Math.PI*Rr,tot=L1+arc+L3,x0=-34,y0=dir>0?8:34;
  const seg=t=>{const s=t*tot;if(s<L1)return [0,s];if(s<L1+arc)return [1,(s-L1)/Rr];return [2,s-L1-arc]};
  if(dir>0)return {who:'me',
    fn:t=>{const [k,v]=seg(t);if(k===0)return V(x0+v,y0,0);if(k===1)return V(x0+L1+Rr*Math.sin(v),y0+Rr*(1-Math.cos(v)),0);return V(x0+L1-v,y0+2*Rr,0)},
    up:t=>{const [k,v]=seg(t);if(k===0)return V(0,1,0);if(k===1)return V(-Math.sin(v),Math.cos(v),0);const ro=Math.PI*clamp((v-3)/(L3-12),0,1),e=(1-Math.cos(ro))/2*Math.PI;return V(0,-Math.cos(e),Math.sin(e))}};
  return {who:'me',
    fn:t=>{const [k,v]=seg(t);if(k===0)return V(x0+v,y0,0);if(k===1)return V(x0+L1+Rr*Math.sin(v),y0-Rr*(1-Math.cos(v)),0);return V(x0+L1-v,y0-2*Rr,0)},
    up:t=>{const [k,v]=seg(t);if(k===0){const ro=Math.PI*clamp((v-8)/(L1-12),0,1),e=(1-Math.cos(ro))/2*Math.PI;return V(0,Math.cos(e),Math.sin(e))}if(k===1)return V(-Math.sin(v),-Math.cos(v),0);return V(0,1,0)}};
}
const MV={
  yoyo:{name:'High yo-yo',dur:10,g:45,alt:y=>6600+y*250,burn:{me:.3,bd:.65},
    steps:['Ease the roll so your wings are about halfway to level.','Pull. The nose goes up and outside the turn, and speed drops.','As the bandit passes below your nose, roll back toward it and pull down onto its tail.'],at:[0,.24,.56],
    read:lin([[0,550,2],[.2,535,4.5],[.5,440,3],[.75,450,6],[1,460,5]]),
    cam:{t:[6,16,8],r:78,h:24,a0:.15,sw:1.3},
    jets:[{who:'bd',fn:t=>{const th=-.5+2.5*t;return V(30*Math.cos(th),12,30*Math.sin(th))}},
          {who:'me',fn:polar([[0,-1.3,31,12],[.2,-.55,33.5,13.5],[.38,.05,37,21],[.54,.55,37.5,27],[.7,1.0,35,24.5],[.85,1.35,32,18],[1,1.62,30,12.6]])}]},
  lowyoyo:{name:'Low yo-yo',dur:10,g:45,alt:y=>6600+y*250,burn:{me:.8,bd:.6},
    steps:['Roll a little past the bandit so your nose points below and ahead of it (lead).','Pull. You dive across the inside of the turn and gain speed.','Roll back, pull up to the bandit. Don\'t hold the dive long or you\'ll overshoot.'],at:[0,.28,.66],
    read:lin([[0,420,4],[.3,470,3],[.55,500,4],[.8,470,6.5],[1,455,5]]),
    cam:{t:[4,12,8],r:78,h:30,a0:.15,sw:1.3},
    jets:[{who:'bd',fn:t=>{const th=-.4+2.5*t;return V(30*Math.cos(th),16,30*Math.sin(th))}},
          {who:'me',fn:polar([[0,-1.3,31,16],[.18,-.75,30,14],[.35,-.25,26.5,9.5],[.52,.35,24,7],[.7,1.0,26,10],[.86,1.4,28.5,14],[1,1.68,29.6,15.6]])}]},
  brk:{name:'Break turn',dur:10,g:45,alt:y=>7000+y*250,burn:{me:.5,bd:.9},flares:true,
    steps:['Roll toward the side the attacker is on and pull as hard as you can. Drop a few flares.','Keep pulling. You\'re trading speed for angle on purpose.','When they flash past, reverse your roll and turn after them. Now you\'re the one behind.'],at:[0,.3,.6],
    read:lin([[0,450,1],[.2,430,8],[.45,360,8],[.62,330,4],[1,340,6]]),
    cam:{t:[14,14,-2],r:90,h:40,a0:-1.35,sw:.75},
    jets:[{who:'bd',fn:xyz([[0,14,14,-95],[.2,10,14,-60],[.36,6,14,-30],[.5,4,14,-5],[.64,6,14,18],[.8,14,14,38],[1,30,14,55]])},
          {who:'me',fn:xyz([[0,0,14,-45],[.18,0,14,-24],[.3,2,14,-10],[.42,9,14,0],[.54,19,14,4],[.64,28,14,3],[.74,33,14,9],[.86,32,14,22],[1,28,14,40]])}]},
  sciss:{name:'Scissors',dur:11,g:260,alt:y=>7000+y*250,burn:{me:.1,bd:.2},
    steps:['Throttle back, airbrake out, and turn toward the bandit.','Each time you cross its path, reverse your roll and pull back toward it.','The moment it drifts ahead of your wing line, stop weaving and point at its tail.'],at:[0,.3,.72],
    read:lin([[0,330,3],[.5,270,4],[1,240,3.5]]),
    cam:{t:[0,14,34],r:72,h:32,a0:-1.35,sw:.35},
    jets:[{who:'bd',fn:t=>V(9*Math.cos(2*Math.PI*1.5*t),14,-30+86*t)},
          {who:'me',fn:t=>V(-9*Math.cos(2*Math.PI*1.5*t),14,-30+66*t)}]},
  immel:{name:'Immelmann',dur:8,g:45,alt:y=>6000+y*300,burn:{me:1},
    steps:['Arrive fast, 450 knots or more. Burner on.','Pull straight up and over the top. Speed turns into height.','You are upside down and pointing the other way. Roll upright.'],at:[0,.27,.7],
    read:lin([[0,480,1],[.27,475,5],[.5,380,5],[.7,300,2.5],[1,320,1]]),
    cam:{t:[-8,29,0],r:74,h:-2,a0:1.15,sw:.7},jets:[halfLoop(1)]},
  splits:{name:'Split-S',dur:8,g:45,alt:y=>6000+y*300,burn:{me:.1},
    steps:['You are slow and high. Throttle back.','Roll upside down.','Pull through the bottom half of a loop and level off, much faster, pointing the other way.'],at:[0,.1,.3],
    read:lin([[0,280,1],[.3,290,1],[.5,360,5],[.7,440,6],[1,470,2]]),
    cam:{t:[-8,20,0],r:74,h:2,a0:1.15,sw:.7},jets:[halfLoop(-1)]},
  merge:{name:'The merge',dur:10,g:45,alt:y=>7000+y*250,burn:{me:.7,bd:.5},
    steps:['Arrive at 450 kt. Pass close, don\'t turn early.','As the bandit passes your wing, roll toward it and pull maximum G.','Halfway around, look for it. If your nose is coming onto it first, you won the turn. Go to lag and settle in.'],at:[0,.3,.62],
    read:lin([[0,450,1],[.3,450,2],[.4,440,9],[.7,410,8],[1,400,7]]),
    cam:{t:[2,14,0],r:92,h:48,a0:.45,sw:.6},
    jets:[{who:'bd',fn:t=>{if(t<.3)return V(-4,14,45-150*t);const ps=(t-.3)/.7*Math.PI*.95;return V(18-22*Math.cos(ps),14,-5-22*Math.sin(ps))}},
          {who:'me',fn:t=>{if(t<.3)return V(4,14,-40+150*t);const ps=(t-.3)/.7*Math.PI*1.25;return V(-9+13*Math.cos(ps),14,5+13*Math.sin(ps))}}]}
};

/* ---------- stage: scene + lazily created renderer ---------- */
const stages=[];
function Stage(canvas){
  const S=new T.Scene(),cam=new T.PerspectiveCamera(36,1,1,1200);
  const amb=new T.HemisphereLight(P.hemi[0],P.hemi[1],P.hemi[2]),sun=new T.DirectionalLight(0xffffff,P.sun);sun.position.set(50,90,20);S.add(amb,sun);
  const ground=new T.Mesh(new T.PlaneGeometry(2400,2400).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:P.ground}));ground.position.y=-.1;S.add(ground);
  const grid=new T.GridHelper(720,72,P.grid,P.grid);grid.material.transparent=true;grid.material.opacity=P.gridOp;grid.renderOrder=1;S.add(grid);
  S.fog=new T.Fog(P.fog,P.fogNF[0],P.fogNF[1]);
  const cv=document.createElement('canvas');cv.width=cv.height=128;const c2=cv.getContext('2d'),gr=c2.createRadialGradient(64,64,4,64,64,62);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.5,'rgba(255,255,255,.4)');gr.addColorStop(1,'rgba(255,255,255,0)');c2.fillStyle=gr;c2.fillRect(0,0,128,128);
  const ctex=new T.CanvasTexture(cv),cmat=new T.SpriteMaterial({map:ctex,transparent:true,depthWrite:false,color:P.cloud[0],opacity:P.cloud[1]}),clouds=new T.Group();let seed=11;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
  for(let i=0;i<18;i++){const sp=new T.Sprite(cmat),a=rnd()*6.283,d=50+rnd()*200,wd=50+rnd()*80;sp.position.set(Math.cos(a)*d,1.5+rnd()*3,Math.sin(a)*d);sp.scale.set(wd,wd*.2,1);clouds.add(sp)}
  S.add(clouds);
  let w=0,h=0,R=null;
  const st={S,cam,live:false,dirty:true,ctex,get aspect(){return w/h||1},get w(){return w},get h(){return h},
    show(){if(!R){R=new T.WebGLRenderer({canvas,antialias:true,alpha:true});R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));w=h=0;st.dirty=true}},
    hide(){if(R){R.dispose();R.forceContextLoss();R=null}},
    size(){const cw=canvas.clientWidth,ch=canvas.clientHeight;if(R&&cw&&ch&&(cw!==w||ch!==h)){w=cw;h=ch;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();st.dirty=true}},
    draw(){if(R){R.render(S,cam);st.dirty=false}}};
  new IntersectionObserver(e=>{st.live=e[0].isIntersecting;if(st.live)st.show();else st.hide()},{rootMargin:'160px'}).observe(canvas);
  stages.push(st);return st;
}
function ribbon(Pts,Rs,wd){
  const n=Pts.length,pos=new Float32Array(n*6),idx=[],L=[[],[]];
  for(let i=0;i<n;i++){const a=Pts[i].clone().addScaledVector(Rs[i],wd),b=Pts[i].clone().addScaledVector(Rs[i],-wd);L[0].push(a);L[1].push(b);pos.set([a.x,a.y,a.z,b.x,b.y,b.z],i*6);if(i<n-1){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setIndex(idx);
  const grp=new T.Group(),sheet=new T.Mesh(g,new T.MeshBasicMaterial({transparent:true,side:T.DoubleSide,depthWrite:false}));sheet.renderOrder=3;grp.add(sheet);
  const lm=new T.LineBasicMaterial({transparent:true,opacity:.95}),lines=L.map(q=>{const l=new T.Line(new T.BufferGeometry().setFromPoints(q),lm);l.renderOrder=4;grp.add(l);return l});
  grp.userData.paint=(c,k)=>{sheet.material.color.set(c);sheet.material.opacity=P.trailOp*(k||1);lm.color.set(c).lerp(new T.Color(0xffffff),P.edgeMix)};
  grp.userData.range=i=>{sheet.geometry.setDrawRange(0,i*6);lines.forEach(l=>l.geometry.setDrawRange(0,i+1))};
  return grp;
}
function track(Pts,c){const g=new T.BufferGeometry().setFromPoints(Pts.map(p=>V(p.x,.05,p.z)));return new T.Line(g,new T.LineBasicMaterial({color:c,transparent:true,opacity:.45}))}
function dropLine(){const g=new T.BufferGeometry().setFromPoints([V(0,0,0),V(0,0,0)]);return new T.Line(g,new T.LineBasicMaterial({color:P.drop,transparent:true,opacity:.55}))}
function shadow(){return new T.Mesh(new T.CircleGeometry(3.6,20).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:P.shadow,depthWrite:false}))}
const M4=new T.Matrix4(),tmp=V(0,0,0);
function place(st,el,p,dy){tmp.copy(p).project(st.cam);el.style.transform='translate('+((tmp.x*.5+.5)*st.w+12).toFixed(1)+'px,'+((-tmp.y*.5+.5)*st.h+dy).toFixed(1)+'px)'}
function fmtT(sec,dur){return '0:'+String(Math.floor(sec)).padStart(2,'0')+' / 0:'+String(dur).padStart(2,'0')}

/* ---------- hero: endless lag chase ---------- */
(function(){
  const cv=$('cHero');if(!cv)return;const st=Stage(cv);
  const Rr=30,alt=13,bank=1.25,up=V(-Math.sin(bank),Math.cos(bank),0),fw=V(0,0,1),rt=up.clone().cross(fw).normalize();
  const basis=new T.Matrix4().makeBasis(rt,up,fw),pivots=[],jets=[];
  [['bd',0],['me',-.62]].forEach(([who,ph])=>{
    const c=who==='me'?P.me:P.bd,pv=new T.Group(),jet=makeJet(c);jet.position.set(Rr,alt,0);jet.quaternion.setFromRotationMatrix(basis);pv.add(jet);jets.push(jet);
    const pts=[],rs=[];for(let i=0;i<=60;i++){const a=-1.7*(1-i/60);pts.push(V(Rr*Math.cos(a),alt,Rr*Math.sin(a)));rs.push(V(Math.cos(bank)*Math.cos(a),Math.sin(bank),Math.cos(bank)*Math.sin(a)))}
    const rb=ribbon(pts,rs,WING);rb.userData.paint(c,.55);pv.add(rb,track(pts,c));
    const drop=new T.Line(new T.BufferGeometry().setFromPoints([V(Rr,alt,0),V(Rr,0,0)]),new T.LineBasicMaterial({color:P.drop,transparent:true,opacity:.5}));pv.add(drop);
    st.S.add(pv);pivots.push([pv,ph]);
  });
  const ring=new T.LineLoop(new T.BufferGeometry().setFromPoints(Array.from({length:96},(_,i)=>V(Rr*Math.cos(i/96*6.2832),alt,Rr*Math.sin(i/96*6.2832)))),new T.LineDashedMaterial({color:P.drop,dashSize:2,gapSize:2,transparent:true,opacity:.5}));
  ring.computeLineDistances();st.S.add(ring);
  let t0=0;
  st.update=dt=>{
    if(!reduce)t0+=dt;else if(!st.dirty)return;
    const th=t0*.42;pivots.forEach(([pv,ph])=>pv.rotation.y=-(th+ph));jets.forEach(j=>j.userData.burn(.55+.25*Math.random()));
    const wide=st.aspect>1.7,a=.9+t0*.05,r=(wide?92:98)*Math.max(1,1.35/st.aspect);
    st.cam.position.set(r*Math.cos(a),30,r*Math.sin(a));st.cam.lookAt(0,9,0);
    if(wide)st.cam.setViewOffset(st.w,st.h,-st.w*.2,0,st.w,st.h);else st.cam.clearViewOffset();
    st.dirty=true;
  };
})();

/* ---------- maneuver clips ---------- */
function buildClip(root){
  const keys=root.dataset.m.split(','),txt=root.closest('.move')||root.parentElement;
  root.innerHTML='<figure class="stage"><canvas aria-label="3D animation of the maneuver"></canvas><div class="read" aria-hidden="true"><span>SPD KT<b class="rS"></b></span><span>ALT FT<b class="rA"></b></span><span>G<b class="rG"></b></span></div><span class="tag me">You</span><span class="tag bd">Bandit</span><span class="flag"></span></figure>'+
    '<div class="ctl"><button type="button" class="pp">Pause</button><input type="range" min="0" max="1000" value="0" aria-label="Clip position"><span class="tm"></span></div>';
  const q=s=>root.querySelector(s),steps=txt.querySelector('.steps'),pick=txt.querySelector('.pick');
  const st=Stage(q('canvas'));let cur=null,u=reduce?.8:0,playing=!reduce,hold=0;
  function setPlay(p){playing=p;q('.pp').textContent=p?'Pause':'Play'}
  function load(key){
    if(cur)cur.objs.forEach(o=>{st.S.remove(o);o.traverse(c=>{if(c.geometry&&!Object.values(GEO).includes(c.geometry))c.geometry.dispose()})});
    const def=MV[key],objs=[],jets=[];
    def.jets.forEach(j=>{const c=j.who==='me'?P.me:P.bd,s=sample(j.fn,j.up,def.g),jet=makeJet(c),rb=ribbon(s.P,s.R,WING),tr=track(s.P,c),drop=dropLine(),sh=shadow();
      rb.userData.paint(c,.75);[jet,rb,tr,drop,sh].forEach(o=>{st.S.add(o);objs.push(o)});jets.push({s,jet,rb,tr,drop,sh,who:j.who,p:V(0,0,0)})});
    let flares=null;
    if(def.flares){const fm=new T.SpriteMaterial({map:st.ctex,color:0xffd166,transparent:true,depthWrite:false,blending:T.AdditiveBlending});flares=[];
      const me=jets.find(j=>j.who==='me');for(let k=0;k<6;k++){const t=.3+k*.04,i=Math.round(t*N),sp=new T.Sprite(fm);sp.scale.set(5,5,1);sp.userData={t,p:me.s.P[i].clone()};st.S.add(sp);objs.push(sp);flares.push(sp)}}
    cur={def,objs,jets,flares,key};
    if(steps)steps.innerHTML=def.steps.map(s=>'<li>'+s+'</li>').join('');
    q('.tag.bd').hidden=!def.jets.some(j=>j.who==='bd');
    u=reduce?.8:0;hold=0;st.dirty=true;
  }
  function frame(){
    u=clamp(u,0,1);const d=cur.def,f=u*N,i=Math.min(N-1,Math.floor(f)),fr=f-i;
    cur.jets.forEach(j=>{const s=j.s,p=s.P[i].clone().lerp(s.P[i+1],fr);
      j.jet.position.copy(p);M4.makeBasis(s.R[i],s.U[i],s.F[i]);j.jet.quaternion.setFromRotationMatrix(M4);
      j.rb.userData.range(i);j.tr.geometry.setDrawRange(0,i+1);j.jet.userData.burn(((d.burn&&d.burn[j.who])||.5)*(.8+.3*Math.random()));
      const a=j.drop.geometry.attributes.position;a.setXYZ(0,p.x,p.y,p.z);a.setXYZ(1,p.x,0,p.z);a.needsUpdate=true;j.sh.position.set(p.x,.06,p.z);j.p=p});
    if(cur.flares)cur.flares.forEach(sp=>{const on=u>=sp.userData.t;sp.visible=on;if(on){const age=(u-sp.userData.t)*d.dur;sp.position.copy(sp.userData.p);sp.position.y-=age*2.2;sp.material.opacity=clamp(1.2-age*.3,0,1)}});
    const c=d.cam,a=c.a0+c.sw*u,r=c.r*Math.max(1,1.5/st.aspect);
    st.cam.position.set(c.t[0]+r*Math.cos(a),c.t[1]+c.h,c.t[2]+r*Math.sin(a));st.cam.lookAt(c.t[0],c.t[1],c.t[2]);st.cam.updateMatrixWorld();
    cur.jets.forEach(j=>j.who==='me'?place(st,q('.tag.me'),j.p,cur.jets.length>1?10:-28):place(st,q('.tag.bd'),j.p,-30));
    const me=cur.jets.find(j=>j.who==='me'),rd=d.read(u);
    q('.rS').textContent=Math.round(rd[0]/5)*5;q('.rG').textContent=rd[1].toFixed(1);q('.rA').textContent=(Math.round(d.alt(me.p.y)/100)*100).toLocaleString('en-US');
    let on=0;d.at.forEach((t,k)=>{if(u>=t)on=k});if(steps)[...steps.children].forEach((li,k)=>li.classList.toggle('on',k===on));
    q('input').value=Math.round(u*1000);q('.tm').textContent=fmtT(u*d.dur,d.dur);
  }
  st.update=dt=>{if(playing){if(u>=1){hold+=dt;if(hold>1.6){u=0;hold=0}}else u=Math.min(1,u+dt/cur.def.dur);st.dirty=true}if(st.dirty)frame()};
  q('.pp').addEventListener('click',()=>{if(!playing&&u>=1){u=0;hold=0}setPlay(!playing)});
  q('input').addEventListener('input',e=>{u=e.target.value/1000;hold=0;st.dirty=true});
  if(pick&&keys.length>1){pick.innerHTML=keys.map((k,i)=>'<button type="button" data-k="'+k+'" aria-pressed="'+(i?'false':'true')+'">'+MV[k].name+'</button>').join('');
    pick.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;[...pick.children].forEach(x=>x.setAttribute('aria-pressed',x===b));load(b.dataset.k);if(!reduce)setPlay(true)})}
  load(keys[0]);setPlay(playing);
}
document.querySelectorAll('.clip[data-m]').forEach(buildClip);

/* ---------- pursuit simulator in 3D ---------- */
(function(){
  const cv=$('cSim');if(!cv)return;const st=Stage(cv),SC=1/25,ALT=14;
  function simulate(mode,kt){
    const vb=390*KT,wb=G*Math.sqrt(24)/vb,R=vb/wb,va=kt*KT,wa=maxRate(va);
    const d={lead:0.45,pure:0,lag:-0.5}[mode],dt=1/30,F=[];
    let th=0,a={x:R+400,y:-1900,h:Math.PI/2},over=false,zone=0,minR=1e9;
    for(let t=0;t<32;t+=dt){
      const b={x:R*Math.cos(th),y:R*Math.sin(th),h:th+Math.PI/2};
      const aim={x:R*Math.cos(th+d),y:R*Math.sin(th+d)};
      const rx=a.x-b.x,ry=a.y-b.y,rng=Math.hypot(rx,ry);
      const fwd=rx*Math.cos(b.h)+ry*Math.sin(b.h);
      const tail=Math.acos(Math.max(-1,Math.min(1,-fwd/rng)));
      const ho=Math.abs(wrap(a.h-b.h));
      let stt='chase';
      if(fwd>0&&rng<600){stt='over';if(t>3)over=true}
      else if(tail<35*Math.PI/180&&rng>250&&rng<1300&&ho<40*Math.PI/180){stt='zone';zone+=dt}
      minR=Math.min(minR,rng);
      const err=wrap(Math.atan2(aim.y-a.y,aim.x-a.x)-a.h),dh=Math.max(-wa*dt,Math.min(wa*dt,err));
      F.push({ax:a.x,ay:a.y,ah:a.h,aw:dh/dt,bx:b.x,by:b.y,bh:b.h,mx:aim.x,my:aim.y,rng,ho,st:stt,t});
      a.h+=dh;a.x+=va*Math.cos(a.h)*dt;a.y+=va*Math.sin(a.h)*dt;th+=wb*dt;
    }
    return {F,over,zone,minR,R,va,vb,wb};
  }
  function frames(run,kx,ky,kh,kw,v){ // 3D samples every 3rd frame
    const Pp=[],Fw=[],U=[],Rr=[];
    for(let i=0;i<run.F.length;i+=3){const f=run.F[i],h=f[kh],w=kw?f[kw]:run.wb,bank=Math.atan(v*w/G);
      Pp.push(V(f[kx]*SC,ALT,f[ky]*SC));const fw=V(Math.cos(h),0,Math.sin(h)),left=V(-Math.sin(h),0,Math.cos(h));
      const up=V(0,Math.cos(bank),0).addScaledVector(left,Math.sin(bank)),r=up.clone().cross(fw).normalize();Fw.push(fw);U.push(fw.clone().cross(r).normalize());Rr.push(r)}
    return {P:Pp,F:Fw,U,R:Rr};
  }
  const me=makeJet(P.me),bd=makeJet(P.bd),pv=new T.Group();st.S.add(me,bd,pv);
  const zoneSh=new T.Shape();zoneSh.absarc(0,0,10,Math.PI/2-.61,Math.PI/2+.61,false);zoneSh.absarc(0,0,52,Math.PI/2+.61,Math.PI/2-.61,true);
  const zone=new T.Mesh(new T.ShapeGeometry(zoneSh,24).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0x1c7a4c,transparent:true,opacity:.28,side:T.DoubleSide,depthWrite:false}));zone.renderOrder=2;
  const l39=new T.Line(new T.BufferGeometry().setFromPoints([V(-17,0,0),V(17,0,0)]),new T.LineBasicMaterial({color:0x0c2340}));pv.add(zone,l39);
  const aim=new T.Sprite(new T.SpriteMaterial({map:st.ctex,color:0xffc72c,transparent:true,depthWrite:false}));aim.scale.set(5,5,1);st.S.add(aim);
  const sh1=shadow(),sh2=shadow(),d1=dropLine(),d2=dropLine();st.S.add(sh1,sh2,d1,d2);
  let mode='pure',kt=450,run,A,B,rbA,rbB,trA,trB,u=reduce?.6:0,playing=!reduce,hold=0;
  const q=s=>document.querySelector('#simPanel '+s);
  function load(){
    run=simulate(mode,kt);A=frames(run,'ax','ay','ah','aw',run.va);B=frames(run,'bx','by','bh',null,run.vb);
    [rbA,rbB,trA,trB].forEach(o=>{if(o){st.S.remove(o);o.traverse(c=>{if(c.geometry)c.geometry.dispose()})}});
    rbA=ribbon(A.P,A.R,WING);rbA.userData.paint(P.me,.75);rbB=ribbon(B.P,B.R,WING);rbB.userData.paint(P.bd,.75);trA=track(A.P,P.me);trB=track(B.P,P.bd);st.S.add(rbA,rbB,trA,trB);
    const v=q('.verdict'),m=Math.round(run.minR/10)*10;
    if(run.over||run.minR<150){v.className='verdict bad';v.textContent=(m<100?'Overshoot. You flew right through the bandit':'Overshoot. You got within '+m+' m')+' and out past its wing line. Now it can turn onto your tail.'}
    else if(run.zone>=6){v.className='verdict good';v.textContent='Stable behind the bandit for '+Math.round(run.zone)+' s, closest '+m+' m. This is the missile shot.'}
    else{v.className='verdict';v.textContent='Never closed. At '+kt+' kt you are slower than the bandit. Get speed first, then lag.'}
    u=reduce?.6:0;hold=0;st.dirty=true;
  }
  function pose(jet,S,i,fr){const p=S.P[i].clone().lerp(S.P[Math.min(S.P.length-1,i+1)],fr);jet.position.copy(p);M4.makeBasis(S.R[i],S.U[i],S.F[i]);jet.quaternion.setFromRotationMatrix(M4);return p}
  function frame(){
    u=clamp(u,0,1);const n=A.P.length-1,f=u*n,i=Math.min(n-1,Math.floor(f)),fr=f-i,fi=Math.min(run.F.length-1,Math.round(u*(run.F.length-1))),F=run.F[fi];
    const pa=pose(me,A,i,fr),pb=pose(bd,B,i,fr);rbA.userData.range(i);rbB.userData.range(i);trA.geometry.setDrawRange(0,i+1);trB.geometry.setDrawRange(0,i+1);
    me.userData.burn((kt>500?.9:.5)*(.8+.3*Math.random()));bd.userData.burn(.6*(.8+.3*Math.random()));
    pv.position.copy(pb);pv.rotation.y=Math.PI/2-F.bh;aim.position.set(F.mx*SC,ALT,F.my*SC);
    [[sh1,d1,pa],[sh2,d2,pb]].forEach(([s,d,p])=>{s.position.set(p.x,.06,p.z);const a=d.geometry.attributes.position;a.setXYZ(0,p.x,p.y,p.z);a.setXYZ(1,p.x,0,p.z);a.needsUpdate=true});
    const a=-1.05+.55*u,r=150*Math.max(1,1.5/st.aspect);st.cam.position.set(12+r*Math.cos(a),ALT+80,-22+r*Math.sin(a));st.cam.lookAt(12,ALT,-22);st.cam.updateMatrixWorld();
    place(st,q('.tag.me'),pa,10);place(st,q('.tag.bd'),pb,-30);
    const fl=q('.flag');fl.textContent=F.st==='zone'?'In the control zone':F.st==='over'?'Overshoot':'';fl.className='flag '+(F.st==='zone'?'good':F.st==='over'?'bad':'');
    q('.rRng').textContent=Math.round(F.rng/10)*10+' m';q('.rAo').textContent=Math.round(F.ho*180/Math.PI)+'°';q('.tm').textContent=fmtT(F.t,32);q('input').value=Math.round(u*1000);
  }
  st.update=dt=>{if(playing){if(u>=1){hold+=dt;if(hold>2){u=0;hold=0}}else u=Math.min(1,u+dt/32);st.dirty=true}if(st.dirty)frame()};
  function setPlay(p){playing=p;q('.pp').textContent=p?'Pause':'Play'}
  function seg(id,attr,set){$(id).addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;[...$(id).children].forEach(x=>x.setAttribute('aria-pressed',x===b));set(b.dataset[attr]);load();if(!reduce)setPlay(true)})}
  seg('modeSeg','mode',v=>mode=v);seg('spdSeg','kt',v=>kt=+v);
  q('.pp').addEventListener('click',()=>{if(!playing&&u>=1){u=0;hold=0}setPlay(!playing)});
  q('input').addEventListener('input',e=>{u=e.target.value/1000;hold=0;st.dirty=true});
  load();setPlay(playing);
})();

/* ---------- one loop for every stage ---------- */
let last=performance.now();
function loop(now){
  const dt=clamp((now-last)/1000,0,.05);last=now;
  stages.forEach(st=>{if(!st.live)return;st.size();if(st.update)st.update(dt);if(st.dirty)st.draw()});
  requestAnimationFrame(loop);
}
addEventListener('resize',()=>stages.forEach(st=>st.dirty=true));
requestAnimationFrame(loop);
})();
