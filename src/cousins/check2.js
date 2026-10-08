// community totals by year, and coverage check: every family series in every region must have a split
const A=require('./data.js');
const lin=(a,y)=>{if(y<=a[0][0])return a[0][1];for(let i=1;i<a.length;i++)if(y<=a[i][0]){const p=a[i-1],q=a[i];return p[1]+(q[1]-p[1])*(y-p[0])/(q[0]-p[0])}return a[a.length-1][1]};
function val(s,y){if(y<s[0][0])return 0;const n=s.length;if(y>=s[n-1][0])return s[n-1][1];let i=1;while(s[i][0]<y)i++;const a=s[i-1],b=s[i],t=(y-a[0])/(b[0]-a[0]);return(a[1]>0&&b[1]>0)?a[1]*Math.pow(b[1]/a[1],t):a[1]+(b[1]-a[1])*t}
const CI={};A.COMMUNITIES.forEach((c,i)=>CI[c.id]=i);
for(const c of A.COMMUNITIES)if(!A.GROUPS.find(g=>g.id===c.fam))console.log('BAD FAM',c.id);
for(const r of A.REGIONS)for(const f in r.series){const sp=(A.SPLIT[r.id]||{})[f];if(!sp){console.log('NO SPLIT',r.id,f);continue}
  if(typeof sp==='string'){if(CI[sp]==null||A.COMMUNITIES[CI[sp]].fam!==f)console.log('BAD',r.id,f,sp)}
  else for(const k in sp){if(k==='_home'){if(CI[sp[k]]==null)console.log('BAD HOME',r.id);continue}if(CI[k]==null||A.COMMUNITIES[CI[k]].fam!==f)console.log('BAD',r.id,f,k);for(let i=1;i<sp[k].length;i++)if(sp[k][i][0]<=sp[k][i-1][0])console.log('ORDER',r.id,f,k)}}
for(const f of A.FLOWS)if(f[5])for(const c of f[5])if(CI[c]==null)console.log('BAD FLOW COM',f);
for(const y of [1,1170,1500,1800,1900,1939,1950,2025]){const t={};let tot=0;
  for(const r of A.REGIONS)for(const f in r.series){const v=val(r.series[f],y);if(!v)continue;tot+=v;const sp=A.SPLIT[r.id][f];if(typeof sp==='string'){t[sp]=(t[sp]||0)+v}else{let s=0;const sh={};for(const k in sp){if(k==='_home')continue;sh[k]=Math.max(0,lin(sp[k],y));s+=sh[k]}for(const k in sh)t[k]=(t[k]||0)+v*sh[k]/s}}
  console.log(y,'total',Math.round(tot),Object.entries(t).filter(e=>e[1]>=1).sort((a,b)=>b[1]-a[1]).map(e=>e[0]+' '+Math.round(e[1])).join(', '))}
