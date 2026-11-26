// node gen_map.js  -> map.json (Israel + West Bank/Gaza outlines at 10m, neighbours at 50m)
const t=require('topojson-client'),hi=require('world-atlas/countries-10m.json'),lo=require('world-atlas/countries-50m.json'),fs=require('fs');
const P={lon0:34.05,lat0:33.45,S:190,k:Math.cos(31.5*Math.PI/180)};
const pr=([lon,lat])=>[((lon-P.lon0)*P.k*P.S).toFixed(1),((P.lat0-lat)*P.S).toFixed(1)];
const path=f=>{const g=f.geometry,polys=g.type=='Polygon'?[g.coordinates]:g.coordinates;return polys.map(p=>p.map(r=>'M'+r.map(c=>pr(c).join(',')).join('L')+'Z').join('')).join('')};
const get=(w,id)=>t.feature(w,w.objects.countries).features.find(f=>f.id==id);
const out={P,w:Math.round((36.0-P.lon0)*P.k*P.S),h:Math.round((P.lat0-29.42)*P.S),
 isr:path(get(hi,'376')),pal:path(get(hi,'275')),nb:['422','760','400','818'].map(id=>path(get(lo,id))).join('')};
fs.writeFileSync(__dirname+'/map.json',JSON.stringify(out));console.log(out.w,out.h,out.isr.length,out.pal.length,out.nb.length);
