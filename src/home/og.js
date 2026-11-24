// Renders /preview.png, the home page share image, 1200x630.
// Left: kicker, DATA STORIES, one line. Right: 3x3 grid of the first nine home-row images, read from index.html in page order.
// Re-run whenever a story row is added. Fonts from npm @fontsource (sofia-sans-extra-condensed, ibm-plex-sans, ibm-plex-mono).
// usage: NODE_PATH=$(npm root -g) node src/home/og.js [fontsource dir]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ROOT=path.join(__dirname,'../..');
const FD=process.argv[2]||'/home/claude/fonts/node_modules/@fontsource/';
const ff=(fam,pkg,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(path.join(FD,pkg,'files',pkg+'-latin-'+w+'-normal.woff2')).toString('base64')+')}';
const FF=ff('Sofia Sans Extra Condensed','sofia-sans-extra-condensed',900)+ff('IBM Plex Sans','ibm-plex-sans',400)+ff('IBM Plex Mono','ibm-plex-mono',600);
const home=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const row=home.slice(home.indexOf('<div class="row">'));
const imgs=[...row.matchAll(/<img src="([^"]+)"/g)].map(m=>m[1]).slice(0,9);
if(imgs.length<9)throw new Error('found only '+imgs.length+' home-row images');
const uri=f=>'data:image/png;base64,'+fs.readFileSync(path.join(ROOT,f)).toString('base64');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${FF}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0e1730;color:#e9edf7;overflow:hidden;display:flex;align-items:center;gap:44px;padding:0 56px}
.txt{flex:0 0 440px}
.k{font:600 19px/1 "IBM Plex Mono";letter-spacing:.14em;text-transform:uppercase;color:#e8b93e;white-space:nowrap}
.t{font:900 168px/.88 "Sofia Sans Extra Condensed";text-transform:uppercase;margin-top:22px}
.s{font:400 25px/1.4 "IBM Plex Sans";margin-top:26px}
.g{flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.g img{display:block;width:100%;aspect-ratio:1200/630;object-fit:cover;border:1px solid #2a3860}
</style></head><body>
<div class="txt"><div class="k">Interactive pages by Yonatan</div><div class="t">Data<br>Stories</div><div class="s">One subject per page, explained through its numbers.</div></div>
<div class="g">${imgs.map(f=>`<img src="${uri(f)}">`).join('')}</div>
</body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:path.join(ROOT,'preview.png')});await b.close();console.log('ok',imgs.join(' '))})();
