import http from 'http';
const PORT=8931;
const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'content-type,authorization',
  'Access-Control-Allow-Methods':'POST,OPTIONS',
  'Content-Type':'application/json'
};
http.createServer((req,res)=>{
  let body='';
  req.on('data',c=>body+=c);
  req.on('end',()=>{
    if(req.method==='OPTIONS'){ res.writeHead(204,cors); res.end(); return; }
    const u=new URL(req.url,'http://x');
    if(u.pathname.startsWith('/401')){ res.writeHead(401,cors); res.end('{"error":"bad key"}'); return; }
    if(u.pathname.startsWith('/empty')){ res.writeHead(200,cors); res.end(JSON.stringify({choices:[{message:{content:''}}]})); return; }
    let j={}; try{ j=JSON.parse(body||'{}'); }catch(e){}
    const msgs=j.messages||[];
    const user=msgs.find(m=>m.role==='user')||{content:''};
    let content;
    const bad=u.searchParams.get('bad');
    if(bad){ content='顺便说一句，'+bad+'也很值得一试，整体体验还行，先记录下来。'; }
    else{
      let d={}; try{ d=JSON.parse(user.content||'{}'); }catch(e){}
      const dishes=(d.dishes||[]).join('、'), tags=(d.tags||[]).join('、');
      content=String(user.content)==='ping'
        ? 'ok-'+Math.random().toString(36).slice(2,7)
        : '这次点的'+dishes+'，'+tags+'也都对得上我的预期。第'+Math.floor(Math.random()*9999)+'号记录，整体符合'+(d.stars||0)+'星，愿意分享出来。';
    }
    res.writeHead(200,cors);
    res.end(JSON.stringify({choices:[{message:{content}}]}));
  });
}).listen(PORT,'127.0.0.1',()=>console.log('mock llm listening on '+PORT));
