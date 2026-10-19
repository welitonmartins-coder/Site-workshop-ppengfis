import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {getStore} from '@netlify/blobs';
import {createHandler} from '../lib/corrections-core.js';
import {decryptRoster} from '../lib/corrections-roster.js';
import {createFormsTransport} from '../lib/corrections-forms.js';

export default async function handler(request){
 const event={httpMethod:request.method,headers:Object.fromEntries(request.headers),body:['GET','HEAD'].includes(request.method)?'':await request.text()};
 const respond=result=>new Response(result.body,{status:result.statusCode,headers:result.headers});
 let roster;
 try{roster=decryptRoster(JSON.parse(await readFile(path.join(process.cwd(),'netlify/data/corrections-roster.enc.json'),'utf8')),process.env.CORRECTIONS_SECRET);}catch{roster=null;}
 if(!roster||!process.env.CORRECTIONS_SECRET)return respond(await createHandler({roster:null})(event));
 try{
  // Previews never share production correction records.
  const context=process.env.CONTEXT||'production';
  const store=getStore({name:context==='production'?'ppengfis-corrections-2026':`ppengfis-corrections-2026-${context}-${process.env.DEPLOY_ID||'preview'}`,consistency:'strong'});
  const submitForm=createFormsTransport({secret:process.env.CORRECTIONS_SECRET,url:process.env.URL||'https://workshop-ppengfis.netlify.app'});
  return respond(await createHandler({secret:process.env.CORRECTIONS_SECRET,roster,store,submitForm})(event));
 }catch{return Response.json({error:'O recebimento está temporariamente indisponível. Tente novamente mais tarde.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
