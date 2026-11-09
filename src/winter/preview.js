// Inline data (+ local fonts for screenshots) into page.html, write _preview.html and screenshots.
// usage: node src/winter/preview.js [--shots]
const fs=require('fs'),path=require('path');
const dir=__dirname;
let h=fs.readFileSync(path.join(dir,'page.html'),'utf8').replace('/*DATA*/',fs.readFileSync(path.join(dir,'data.json'),'utf8'));
fs.writeFileSync(path.join(dir,'_preview.html'),h);
if(process.argv.includes('--shots')){
  const FD='/home/claude/fonts/node_modules/@fontsource/';
  const F=(fam,pkg,sub,w)=>'@font-face{font-family:"'+fam+'";font-weight:'+w+';src:url(data:font/woff2;base64,'+fs.readFileSync(FD+pkg+'/files/'+pkg+'-'+sub+'-'+w+'-normal.woff2').toString('base64')+')}';
  let ff='';for(const sub of ['hebrew','latin']){for(const w of [400,500,700])ff+=F('Heebo','heebo',sub,w);for(const w of [700,800])ff+=F('Rubik','rubik',sub,w)}
  const t=path.join(dir,'_shot.html');fs.writeFileSync(t,h.replace('/*FONTS*/',ff));
  const {chromium}=require('playwright');
  (async()=>{const b=await chromium.launch();
    for(const [name,vw] of [['desk',1100],['m390',390]]){const p=await b.newPage({viewport:{width:vw,height:900},deviceScaleFactor:2});
      await p.goto('file://'+t);await p.waitForTimeout(600);await p.evaluate(()=>{stop();shown=151;sel=3;draw();startSeen=halfSeen=true;anim.splice(0).forEach(f=>f());animH.splice(0).forEach(f=>f())});await p.waitForTimeout(1500);
      const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);console.log(name,'overflow px',ov);
      await p.screenshot({path:path.join(dir,'_'+name+'.png'),fullPage:true});
      await (await p.$('.hero')).screenshot({path:path.join(dir,'_'+name+'_hero.png')});}
    await b.close()})();
}
