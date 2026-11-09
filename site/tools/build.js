/* Build: prerendert elke route naar een statisch HTML-bestand in dist/, plus sitemap, robots en _redirects. */
const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const SRC='/home/claude/site', DIST='/home/claude/dist', SITE='https://www.tbmedsolutions.nl';
(async()=>{
  fs.rmSync(DIST,{recursive:true,force:true}); fs.mkdirSync(DIST,{recursive:true});
  for(const d of ['assets','brochures']) fs.cpSync(path.join(SRC,d), path.join(DIST,d), {recursive:true});
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1366,height:900}});
  await p.goto('http://localhost:8787/');await p.waitForTimeout(500);
  const routes=await p.evaluate(()=>{const r=['/','/kennismaking','/kennismaking/agenda','/bedankt','/privacy','/algemene-voorwaarden','/disclaimer','/over-ons','/contact'];for(const b of ['bloomea','winback']){r.push('/'+b,'/'+b+'/producten','/'+b+'/indicaties','/'+b+'/totaaloplossingen','/'+b+'/kennisbank','/'+b+'/kennisbank/blog','/'+b+'/kennisbank/studies','/'+b+'/kennisbank/faq','/'+b+'/evenementen','/'+b+'/contact');PRODUCTS.filter(x=>x.brand===b).forEach(x=>r.push('/'+b+'/producten/'+x.id));brandIndications(b).forEach(i=>r.push('/'+b+'/indicaties/'+i.id));BLOGS.filter(x=>x.brand===b).forEach(x=>r.push('/'+b+'/blog/'+x.id));STUDIES.filter(x=>x.brand===b).forEach(x=>r.push('/'+b+'/studies/'+x.id));}return r});
  const noindex=['/bedankt','/kennismaking/agenda'];
  for(const r of routes){
    await p.goto('http://localhost:8787'+r);await p.waitForTimeout(350);
    const html=await p.evaluate((ni)=>{ document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in')); if(ni){const m=document.createElement('meta');m.name='robots';m.content='noindex';document.head.appendChild(m);} return '<!DOCTYPE html>\n'+document.documentElement.outerHTML; }, noindex.includes(r));
    const out = r==='/' ? path.join(DIST,'index.html') : path.join(DIST, r.replace(/^\//,''), 'index.html');
    fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out, html);
  }
  const today=new Date().toISOString().slice(0,10);
  fs.writeFileSync(path.join(DIST,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.filter(r=>!noindex.includes(r)).map(r=>`  <url><loc>${SITE}${r==='/'?'/':r}</loc><lastmod>${today}</lastmod></url>`).join('\n')+'\n</urlset>\n');
  fs.writeFileSync(path.join(DIST,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /bedankt\nSitemap: ${SITE}/sitemap.xml\n`);
  fs.writeFileSync(path.join(DIST,'_redirects'),'/*  /index.html  200\n');
  fs.writeFileSync(path.join(DIST,'netlify.toml'),'[[headers]]\n  for = "/assets/*"\n  [headers.values]\n    Cache-Control = "public, max-age=31536000, immutable"\n[[headers]]\n  for = "/*.html"\n  [headers.values]\n    Cache-Control = "public, max-age=0, must-revalidate"\n');
  console.log('prerendered',routes.length,'routes'); await b.close();
})();
