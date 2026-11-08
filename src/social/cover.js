const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const D=__dirname;
const ff=(fam,pkg,w,sub)=>{const p=path.join(D,'node_modules/@fontsource/'+pkg+'/files/'+pkg+'-'+sub+'-'+w+'-normal.woff2');if(!fs.existsSync(p))return '';return '@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(p).toString('base64')+')}'};
let FF='';for(const s of ['hebrew','latin']){FF+=ff('Secular One','secular-one',400,s);for(const w of [400,500,700,900])FF+=ff('Heebo','heebo',w,s);}
for(const w of [500,600])FF+=ff('IBM Plex Mono','ibm-plex-mono',w,'latin');
let html=fs.readFileSync('/home/claude/backyonatan-alt.github.io/windsurf/index.html','utf8');
html=html.replace(/<link[^>]*fonts\.g[^>]*>/g,'').replace(/<script async src="https:\/\/www.googletagmanager[^<]*<\/script>/,'').replace('</head>','<style>'+FF+'</style></head>');
fs.writeFileSync(path.join(D,'ws.html'),html);
(async()=>{const b=await chromium.launch();
const pg=await b.newPage({viewport:{width:1700,height:1100},deviceScaleFactor:2});
await pg.goto('file://'+path.join(D,'ws.html'));await pg.waitForTimeout(2000);
const el=await pg.$('#tlStage');await el.scrollIntoViewIfNeeded();await pg.waitForTimeout(500);
await el.screenshot({path:path.join(D,'tl.png')});
const bb=await el.boundingBox();console.log(JSON.stringify(bb));await b.close()})();
