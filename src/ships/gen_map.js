const t=require('topojson-client'),w=require('world-atlas/countries-50m.json'),fs=require('fs');
const fc=t.feature(w,w.objects.countries).features;
const P={lon0:34.15,lat0:33.42,S:190,k:Math.cos(31.5*Math.PI/180)};
const pr=([lon,lat])=>[((lon-P.lon0)*P.k*P.S).toFixed(1),((P.lat0-lat)*P.S).toFixed(1)];
const path=f=>{const g=f.geometry,polys=g.type=='Polygon'?[g.coordinates]:g.coordinates;return polys.map(p=>p.map(r=>'M'+r.map(c=>pr(c).join(',')).join('L')+'Z').join('')).join('')};
const get=id=>fc.find(f=>f.id==id);
const out={P,w:Math.round((35.95-P.lon0)*P.k*P.S),h:Math.round((P.lat0-29.42)*P.S),isr:path(get('376')),pal:path(get('275'))};
fs.writeFileSync(process.argv[2],JSON.stringify(out));console.log(out.w,out.h,out.isr.length,out.pal.length);
