import http from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {createHandler,signLink} from '../netlify/lib/corrections-core.js';
const root=process.cwd(),secret=randomBytes(32).toString('hex');
const roster=[{code:'R24',email:'autor@example.invalid',title:'Colorimetric Dopamine Sensing Using Fe-Doped Carbon Nanozymes',authors:'Autor de demonstração, Coautor de demonstração',affiliations:'Universidade de demonstração',abstract:'Iron-doped carbon nanodots were evaluated as peroxidase-like nanozymes for colorimetric dopamine sensing. The optical response was assessed by spectrophotometry and digital color analysis. This is a fictional preview record used only to demonstrate the correction submission page.'}];
const entries=new Map();
const store={async setJSON(key,value){if(entries.has(key))return {modified:false};entries.set(key,value);await mkdir('.corrections-local',{recursive:true});await writeFile(path.join('.corrections-local',key.replace('/','_')+'.json'),JSON.stringify(value,null,2));return {modified:true};},async get(key){return entries.get(key)||null;}};
const handler=createHandler({secret,roster,store,preview:true});
const token=signLink(roster[0].code,roster[0].email,secret);
const server=http.createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/abstract-corrections'){
  let body='';for await(const chunk of req){body+=chunk;if(body.length>30000){res.writeHead(413);res.end();return;}}
  const result=await handler({httpMethod:req.method,headers:req.headers,body});res.writeHead(result.statusCode,result.headers);res.end(result.body);return;
 }
 let name=url.pathname==='/'?'abstract-corrections.html':decodeURIComponent(url.pathname.slice(1));
 const file=path.resolve(root,'public',name);if(!file.startsWith(path.resolve(root,'public')+path.sep)){res.writeHead(403);res.end();return;}
 const data=await readFile(file);const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg'}[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
const port=Number(process.env.PORT||4174);
server.listen(port,'127.0.0.1',()=>console.log(`DEMONSTRAÇÃO: http://127.0.0.1:${port}/abstract-corrections.html#token=`+token));
