import {createHmac,timingSafeEqual,createHash,randomUUID} from 'node:crypto';

export const DEADLINE='2026-10-31T02:59:59.999Z'; // 30/10, 23h59, America/Fortaleza
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
const json=(statusCode,data)=>({statusCode,headers,body:JSON.stringify(data)});
export function signLink(code,email,secret,expires=Date.parse(DEADLINE)){
 if(!secret||secret.length<32)throw new Error('Secret must have at least 32 characters');
 const payload=Buffer.from(JSON.stringify({code,email,expires})).toString('base64url');
 return payload+'.'+createHmac('sha256',secret).update(payload).digest('base64url');
}
export function verifyLink(token,secret,now){
 if(!secret||secret.length<32)throw new Error('unconfigured');
 const [payload,sig,...extra]=String(token).split('.');
 if(extra.length||!payload||!sig||token.length>2048)throw new Error('invalid');
 const expected=createHmac('sha256',secret).update(payload).digest();const got=Buffer.from(sig,'base64url');
 if(expected.length!==got.length||!timingSafeEqual(expected,got))throw new Error('invalid');
 const data=JSON.parse(Buffer.from(payload,'base64url').toString());
 if(!/^R\d{2}$/.test(data.code)||typeof data.email!=='string'||!Number.isFinite(data.expires)||now>data.expires)throw new Error('invalid');
 return data;
}
export function createHandler({secret,roster,store,now=()=>Date.now(),preview=false}){
 return async event=>{
  if(!['GET','POST'].includes(event.httpMethod))return json(405,{error:'Método não permitido.'});
  if(!secret||secret.length<32||!Array.isArray(roster))return json(503,{error:'O recebimento ainda não foi habilitado pela organização.'});
  const timestamp=now();
  if(timestamp>Date.parse(DEADLINE))return json(410,{error:'O prazo para correções encerrou em 30 de outubro de 2026.'});
  let data;
  try{data=verifyLink((event.headers.authorization||event.headers.Authorization||'').replace(/^Bearer /,''),secret,timestamp);}catch{return json(401,{error:'Link inválido ou expirado. Use o link individual enviado por e-mail.'});}
  const original=roster.find(r=>r.code===data.code&&r.email.toLowerCase()===data.email.toLowerCase());
  if(!original)return json(401,{error:'Link inválido ou expirado. Solicite seu link à organização.'});
  // Only an explicitly signed administrative claim can test real storage.
  // Test entries stay under a reserved prefix, outside all Rxx versions.
  if(data.purpose==='readiness'&&event.httpMethod==='POST'){
   const key='_health/'+randomUUID();
   try{const result=await store.setJSON(key,{probe:true,at:new Date(timestamp).toISOString()},{onlyIfNew:true});const saved=await store.get(key,{type:'json',consistency:'strong'});return result.modified&&saved?.probe?json(200,{ready:true}):json(503,{ready:false});}catch(err){console.error('Corrections storage readiness:',err.name,err.message);return json(503,{ready:false});}
  }
  if(event.httpMethod==='GET')return json(200,{code:original.code,title:original.title,authors:original.authors,affiliations:original.affiliations,abstract:original.abstract,deadline:'30 de outubro de 2026',preview});
  if(Buffer.byteLength(event.body||'')>24000)return json(413,{error:'O conteúdo enviado excede o tamanho permitido.'});
  let input;try{input=JSON.parse(event.body||'');}catch{return json(400,{error:'Não foi possível ler o envio.'});}
  if(input.website)return json(400,{error:'Envio inválido.'});
  const fields={title:300,authors:1800,affiliations:3500,abstract:2000,changes:2500};
  for(const [key,max] of Object.entries(fields)){
   if(typeof input[key]!=='string'||!input[key].trim()||Array.from(input[key].trim()).length>max)return json(400,{error:`Confira o campo ${key}: obrigatório, com até ${max} caracteres.`});
  }
  if(input.confirm!==true)return json(400,{error:'Confirme a revisão e a anuência dos coautores.'});
  if(!/^[0-9a-f-]{36}$/i.test(input.requestId||''))return json(400,{error:'Identificador do envio inválido. Recarregue a página.'});
  const key=`${original.code}/${input.requestId}`;
  const content=Object.fromEntries(Object.keys(fields).map(k=>[k,input[k].trim()]));
  const checksum=createHash('sha256').update(JSON.stringify(content)).digest('hex');
  const receipt=original.code+'-'+input.requestId.toUpperCase();
  const record={receipt,code:original.code,email:original.email,receivedAt:new Date(timestamp).toISOString(),status:'recebido_para_conferencia',checksum,...content};
  try{
   const result=await store.setJSON(key,record,{onlyIfNew:true});
   if(!result.modified){const previous=await store.get(key,{type:'json',consistency:'strong'});if(!previous||previous.checksum!==checksum)return json(409,{error:'Este envio já foi registrado com outro conteúdo. Inicie uma nova revisão.'});return json(200,{receipt:previous.receipt,receivedAt:previous.receivedAt,preview,repeated:true});}
   return json(201,{receipt,receivedAt:record.receivedAt,preview});
  }catch{return json(503,{error:'Não foi possível confirmar o recebimento. Tente novamente sem fechar esta página; o mesmo envio não será duplicado.'});}
 };
}
