const topo=require('topojson-client'),fs=require('fs');
const P=20; // 0.05 deg precision
function dp(pts,tol){ // Douglas-Peucker
  if(pts.length<3)return pts;
  const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;
  const st=[[0,pts.length-1]];
  while(st.length){const [a,b]=st.pop();let md=0,mi=-1;const [x1,y1]=pts[a],[x2,y2]=pts[b];const dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy;
    for(let i=a+1;i<b;i++){const [x,y]=pts[i];let d;if(L===0)d=Math.hypot(x-x1,y-y1);else{let t=((x-x1)*dx+(y-y1)*dy)/L;t=Math.max(0,Math.min(1,t));d=Math.hypot(x-x1-t*dx,y-y1-t*dy)}
      if(d>md){md=d;mi=i}}
    if(md>tol){keep[mi]=1;st.push([a,mi],[mi,b])}}
  return pts.filter((_,i)=>keep[i]);
}
function area(r){let s=0;for(let i=0;i<r.length-1;i++)s+=r[i][0]*r[i+1][1]-r[i+1][0]*r[i][1];return Math.abs(s/2)}
function enc(r){const o=[];let px=0,py=0;for(const [x,y] of r){const X=Math.round(x*P),Y=Math.round(y*P);if(o.length&&X===px&&Y===py)continue;o.push(X-px,Y-py);px=X;py=Y}return o}
const land=require('world-atlas/land-50m.json');
const f=topo.feature(land,land.objects.land);
const polys=[];for(const ft of (f.features||[f])){const g=ft.geometry;if(g.type==='MultiPolygon')polys.push(...g.coordinates);else polys.push(g.coordinates)}
const rings=[];
for(const poly of polys){const outer=poly[0];if(area(outer)<0.25)continue;
  if(outer.every(p=>p[1]<-60))continue;
  let r=dp(outer,0.06);if(r.length<4)continue;rings.push(enc(r));}
const c=require('world-atlas/countries-50m.json');
const mesh=topo.mesh(c,c.objects.countries,(a,b)=>a!==b);
const lines=[];
for(const l of mesh.coordinates){if(l.every(p=>p[1]<-60))continue;const r=dp(l,0.06);if(r.length<2)continue;lines.push(enc(r))}
const out={p:P,land:rings,borders:lines};
const s=JSON.stringify(out);fs.writeFileSync('map.json',s);
console.log('rings',rings.length,'lines',lines.length,'bytes',s.length);
