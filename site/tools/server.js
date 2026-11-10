const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2]||require('path').resolve(__dirname,'..');const port=+process.argv[3]||8787;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.pdf':'application/pdf','.webmanifest':'application/manifest+json','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{
  if(req.method==='POST'){ let b='';req.on('data',d=>b+=d);req.on('end',()=>{res.writeHead(200);res.end('ok');}); return; }
  let p=decodeURIComponent(req.url.split('?')[0]); let f=path.join(root,p);
  if(fs.existsSync(f)&&fs.statSync(f).isFile()){ res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(res); return; }
  if(fs.existsSync(f+'.html')){ res.writeHead(200,{'Content-Type':'text/html'}); fs.createReadStream(f+'.html').pipe(res); return; }
  if(fs.existsSync(path.join(f,'index.html'))){ res.writeHead(200,{'Content-Type':'text/html'}); fs.createReadStream(path.join(f,'index.html')).pipe(res); return; }
  res.writeHead(200,{'Content-Type':'text/html'}); fs.createReadStream(path.join(root,'index.html')).pipe(res);
}).listen(port,()=>console.log('up',port));
