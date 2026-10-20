import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {encryptRoster,decryptRoster} from '../netlify/lib/corrections-roster.js';
import {signLink} from '../netlify/lib/corrections-core.js';
await mkdir('netlify/private',{recursive:true});await mkdir('netlify/data',{recursive:true});
let secret;try{secret=(await readFile('netlify/private/corrections-secret.txt','utf8')).trim();}catch(err){if(err.code!=='ENOENT')throw err;secret=randomBytes(48).toString('base64url');await writeFile('netlify/private/corrections-secret.txt',secret,{flag:'wx'});}
const roster=JSON.parse(await readFile('netlify/private/corrections-roster.json','utf8'));
if(roster.length<26||new Set(roster.map(r=>r.code)).size!==roster.length||roster.some(r=>!/^R\d{2}$/.test(r.code)||!r.email||!r.abstract))throw new Error('Invalid roster records');
const encrypted=encryptRoster(roster,secret);
await writeFile('netlify/data/corrections-roster.enc.json',JSON.stringify(encrypted));
if(decryptRoster(encrypted,secret).length!==roster.length)throw new Error('Encryption validation failed');
const links=roster.map(r=>({codigo:r.code,email:r.email,url:'https://workshop-ppengfis.netlify.app/abstract-corrections.html#'+new URLSearchParams({token:signLink(r.code,r.email,secret)})}));
await writeFile('netlify/private/correction-links.json',JSON.stringify(links,null,2));
console.log(`Cadastro criptografado validado; chave privada preservada; ${roster.length} links individuais preparados. Nenhum segredo exibido.`);
