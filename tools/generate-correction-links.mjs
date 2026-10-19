import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {signLink} from '../netlify/lib/corrections-core.js';
// Input is the private mensagens.json from the reviewed email package.
const [input,output]=process.argv.slice(2);
if(!input||!output)throw new Error('Uso: node tools/generate-correction-links.mjs mensagens.json saida-privada.json');
const secret=process.env.CORRECTIONS_SECRET;
if(!secret||secret.length<32)throw new Error('Defina CORRECTIONS_SECRET (mínimo de 32 caracteres aleatórios), o mesmo configurado no Netlify.');
const base=new URL(process.env.CORRECTIONS_BASE_URL||'https://workshop-ppengfis.netlify.app/abstract-corrections.html');
if(base.protocol!=='https:')throw new Error('Use uma URL HTTPS de produção.');
const messages=JSON.parse(await readFile(input,'utf8'));
const seen=new Set();
const links=messages.map(row=>{
 if(!/^R\d{2}$/.test(row.codigo)||seen.has(row.codigo)||!row.email)throw new Error('Registro inválido');seen.add(row.codigo);
 const url=new URL(base);url.hash=new URLSearchParams({token:signLink(row.codigo,row.email,secret)}).toString();
 return {codigo:row.codigo,email:row.email,url:url.toString()};
});
await writeFile(output,JSON.stringify(links,null,2));console.log(`${links.length} links individuais salvos em arquivo privado. Não publique nem compartilhe o arquivo completo.`);
