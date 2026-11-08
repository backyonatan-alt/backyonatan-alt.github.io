const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const F=(fam,pkg,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(path.join(__dirname,'node_modules/@fontsource/'+pkg+'/files/'+pkg+'-latin-'+w+'-normal.woff2')).toString('base64')+')}';
const ff=[400,600,700].map(w=>F('Libre Franklin','libre-franklin',w)).join('')+[400,700].map(w=>F('Source Serif 4','source-serif-4',w)).join('');
const src='/home/claude/medals/charts/charts.html';let h=fs.readFileSync(src,'utf8').replace('/*FONTS*/',ff);
const t='/home/claude/medals/charts/_r.html';fs.writeFileSync(t,h);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:720,height:1200},deviceScaleFactor:2});
await p.goto('file://'+t);await p.waitForTimeout(500);
for(const id of ['f1','f2','f3'])await (await p.$('#'+id)).screenshot({path:'/home/claude/medals/charts/'+id+'.png'});await b.close()})();
