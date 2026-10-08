const A=require('./data.js');
function val(arr,y){ if(!arr||y<arr[0][0])return 0; const n=arr.length; if(y>=arr[n-1][0])return arr[n-1][0]>=2025||arr[n-1][1]===0?arr[n-1][1]:arr[n-1][1];
  for(let i=1;i<n;i++)if(y<=arr[i][0]){const [a,va]=arr[i-1],[b,vb]=arr[i];const t=(y-a)/(b-a);return (va>0&&vb>0)?va*Math.pow(vb/va,t):va+(vb-va)*t}return 0}
// validate monotonic years
for(const r of A.REGIONS)for(const g in r.series){const s=r.series[g];for(let i=1;i<s.length;i++)if(s[i][0]<=s[i-1][0])console.log('ORDER',r.id,g,s[i-1],s[i]);
  if(!A.GROUPS.find(x=>x.id===g))console.log('BADGROUP',r.id,g);const last=s[s.length-1];if(last[0]<2025&&last[1]!==0)console.log('OPEN END',r.id,g,last)}
for(const f of A.FLOWS)for(const k of [0,1])if(!A.REGIONS.find(r=>r.id===f[k]))console.log('BADFLOW',f);
const yrs=[-1000,-750,-700,-580,-500,-300,-100,1,66,150,300,650,1000,1170,1300,1400,1491,1500,1600,1700,1800,1850,1880,1900,1914,1925,1939,1945,1950,1960,1970,1980,1990,2000,2010,2020,2025];
console.log('year'.padStart(6),'total'.padStart(8),A.GROUPS.map(g=>g.id.padStart(7)).join(''),'  ash%');
for(const y of yrs){const t={};let tot=0;for(const r of A.REGIONS)for(const g in r.series){const v=val(r.series[g],y);t[g]=(t[g]||0)+v;tot+=v}
  console.log(String(y).padStart(6),tot.toFixed(0).padStart(8),A.GROUPS.map(g=>(t[g.id]||0).toFixed(0).padStart(7)).join(''),'  '+(100*(t.ash||0)/tot).toFixed(1));}
const y=2025;console.log(A.REGIONS.map(r=>[r.name,Object.values(r.series).reduce((s,a)=>s+val(a,y),0)]).sort((a,b)=>b[1]-a[1]).slice(0,12).map(x=>x[0]+' '+x[1].toFixed(0)).join(' | '));
