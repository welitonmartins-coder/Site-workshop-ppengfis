import {readFile,writeFile} from 'node:fs/promises';
import {createHmac,randomUUID} from 'node:crypto';
import {DEADLINE} from '../netlify/lib/corrections-core.js';
const secret=(await readFile('netlify/private/corrections-secret.txt','utf8')).trim();
const roster=JSON.parse(await readFile('netlify/private/corrections-roster.json','utf8'));
const original=roster.find(r=>r.code==='R18');
const payload=Buffer.from(JSON.stringify({code:original.code,email:original.email,expires:Date.parse(DEADLINE),purpose:'forms-test'})).toString('base64url');
const token=payload+'.'+createHmac('sha256',secret).update(payload).digest('base64url');
const url='https://workshop-ppengfis.netlify.app/abstract-corrections.html#'+new URLSearchParams({token});
await writeFile('netlify/private/forms-test-link.json',JSON.stringify({url},null,2));
const endpoint='https://workshop-ppengfis.netlify.app/api/abstract-corrections';
const get=await fetch(endpoint,{headers:{Authorization:'Bearer '+token}});const initial=await get.json();
if(!initial.isTest)throw new Error('O deploy com modo de teste ainda não está ativo. Nenhum envio realizado.');
let previous;try{previous=JSON.parse(await readFile('netlify/private/forms-live-test.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const body=previous?.body||{title:'[TESTE] Recebimento de correções no Netlify Forms',authors:'Weliton Soares Martins',affiliations:'UFRPE',abstract:'This is an organizational test of the corrected abstract submission workflow. It must be excluded from the final abstract book.',changes:'Teste autorizado pela organização: conferir gravação e exportação no Forms. Não utilizar no livro.',confirm:true,requestId:randomUUID()};
if(previous?.status==='confirmed'){console.log(JSON.stringify({status:'already_confirmed',receipt:previous.receipt}));process.exit(0);}
await writeFile('netlify/private/forms-live-test.json',JSON.stringify({body,status:'pending'},null,2));
const response=await fetch(endpoint,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
const result=await response.json();
await writeFile('netlify/private/forms-live-test.json',JSON.stringify({body,...result,status:response.ok?'confirmed':'failed',http_status:response.status},null,2));
console.log(JSON.stringify({http_status:response.status,receipt:result.receipt,isTest:result.isTest,error:result.error}));
if(!response.ok||!result.isTest)process.exitCode=1;
