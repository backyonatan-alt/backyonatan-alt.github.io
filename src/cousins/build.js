const fs=require('fs');
const path=require('path');const here=p=>path.join(__dirname,p);
// 1) assemble the page from its parts
let h=fs.readFileSync(here('page.html'),'utf8');
const data=fs.readFileSync(here('data.js'),'utf8').replace(/if \(typeof module[^\n]*\n?/,'');
h=h.replace('/*DATA*/',()=>data).replace('/*MAP*/',()=>fs.readFileSync(here('map.json'),'utf8')).replace('/*APP*/',()=>fs.readFileSync(here('app.js'),'utf8'));
// 2) wrap it as a standalone page for the site
const cut=h.indexOf('<div class="night">');
let head=h.slice(0,cut),body=h.slice(cut);
const SITE='https://backyonatan-alt.github.io/cousins/';
const desc='An animated map of the Jewish people from 1000 BCE to today: where they lived, how many they were, and why any two Ashkenazi Jews are about fourth cousins.';
const icon="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0e1730"/><circle cx="12" cy="18" r="8" fill="#3987e5"/><circle cx="22" cy="12" r="5" fill="#e8b93e"/></svg>');
const meta=`<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="canonical" href="${SITE}">
<meta property="og:url" content="${SITE}">
<meta property="og:image" content="${SITE}cousins-preview.png">
<meta name="twitter:image" content="${SITE}cousins-preview.png">
<meta name="description" content="${desc}">
<meta property="og:type" content="article">
<meta property="og:title" content="A Nation of Cousins">
<meta property="og:description" content="${desc}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="A Nation of Cousins">
<meta name="twitter:description" content="${desc}">
<meta name="theme-color" content="#0e1730">
<link rel="icon" href="${icon}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<style>html{-webkit-text-size-adjust:100%}body{margin:0}img{max-width:100%}[hidden]{display:none!important}
.topbar{flex-basis:100%;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-bottom:2px}.hero .topbar .kicker{flex-basis:auto}@media (max-width:520px){.hero .topbar .kicker{order:3;flex-basis:100%}}.topbar a{text-decoration:none}.sharebtn{margin-left:auto}#shared{font:600 11px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--gold-n);margin-left:auto}#shared+.sharebtn{margin-left:0}#shared[hidden]+.sharebtn{margin-left:auto}</style>
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZHETPL7EV5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-ZHETPL7EV5');</script>
`;
// share button in the kicker row
body=body.replace('<span class="kicker">3,000 years · 36 regions · 29 communities</span>','<div class="topbar"><a class="txtbtn" href="../">&larr; All stories</a><span class="kicker">3,000 years · 36 regions · 29 communities</span><span id="shared" hidden>Link copied</span><button type="button" class="txtbtn sharebtn" id="share">Share</button></div>');
if(!body.includes('id="share"'))throw new Error('share not injected');
const shareJs=`<script>
(function(){var b=document.getElementById('share'),n=document.getElementById('shared');if(!b)return;
b.addEventListener('click',function(){var u=location.href.split('#')[0],d={title:'A Nation of Cousins',text:'3,000 years of the Jewish people on one map',url:u};
 function done(){n.hidden=false;setTimeout(function(){n.hidden=true},2200)}
 if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share(d).catch(function(){});return}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(done,function(){window.prompt('Copy this link',u)})}else window.prompt('Copy this link',u)})})();
</script>
<script>
(function(){var b=document.getElementById('play'),sent=false;if(!b)return;b.addEventListener('click',function(){if(sent||typeof gtag!=='function')return;sent=true;gtag('event','map_play')})})();
</script>`;
const out='<!doctype html>\n<html lang="en">\n<head>\n'+meta+head+'</head>\n<body>\n'+body+shareJs+'\n</body>\n</html>\n';
fs.writeFileSync(here('../../cousins/index.html'),out);
console.log('wrote cousins/index.html',out.length);
