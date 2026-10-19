import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {getStore,connectLambda} from '@netlify/blobs';
import {createHandler} from '../lib/corrections-core.js';
import {decryptRoster} from '../lib/corrections-roster.js';

export async function handler(event){
 let roster;
 try{roster=decryptRoster(JSON.parse(await readFile(path.join(process.cwd(),'netlify/data/corrections-roster.enc.json'),'utf8')),process.env.CORRECTIONS_SECRET);}catch{roster=null;}
 if(!roster||!process.env.CORRECTIONS_SECRET)return createHandler({roster:null})(event);
 try{
  connectLambda(event);
  // Previews never share production correction records.
  const context=process.env.CONTEXT||'production';
  const store=getStore({name:context==='production'?'ppengfis-corrections-2026':`ppengfis-corrections-2026-${context}-${process.env.DEPLOY_ID||'preview'}`,consistency:'strong'});
  return createHandler({secret:process.env.CORRECTIONS_SECRET,roster,store})(event);
 }catch{return {statusCode:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({error:'O recebimento está temporariamente indisponível. Tente novamente mais tarde.'})};}
}
