import {readFile,writeFile} from 'node:fs/promises';
import dotenv from 'dotenv';dotenv.config({quiet:true});
const target='weliton.martins@ufrpe.br';
const link=JSON.parse(await readFile('netlify/private/forms-test-link.json','utf8')).url;
const receipt=JSON.parse(await readFile('netlify/private/forms-live-test.json','utf8'));
if(receipt.status!=='confirmed')throw new Error('Confirme primeiro o recebimento no Forms.');
const file='netlify/private/forms-test-email-weliton.json';
try{const prior=JSON.parse(await readFile(file,'utf8'));console.log(JSON.stringify({status:'already_attempted',...prior}));process.exit(0);}catch(e){if(e.code!=='ENOENT')throw e;}
const from=process.env.MAIL_FROM||process.env.FROM_EMAIL;
if(!from||!process.env.RESEND_API_KEY)throw new Error('Credenciais ausentes');
const text=`Olá, Weliton.\n\nO recebimento de correções foi atualizado para o Netlify Forms, no formulário separado abstract-corrections.\n\nEste é um link exclusivo de TESTE. Você pode preencher e enviar por ele: os registros serão identificados como is_test=true e excluídos do livro. Ele não modifica as submissões originais dos estudantes.\n\n${link}\n\nJá foi realizado um envio de verificação, com o protocolo ${receipt.receipt}.\n\nNo painel Netlify, acesse Forms → abstract-corrections. Depois poderá exportar o CSV para organizar o livro com a correção mais recente de cada código. Originais sem correção serão mantidos.\n\nPrazo das correções dos estudantes: 30 de outubro de 2026, às 23h59 (Fortaleza).\n\nNenhum e-mail desta rodada foi enviado aos estudantes.\n\nComissão Organizadora — VII Workshop PPENGFIS/UFRPE`;
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const message={from,to:[target],reply_to:process.env.REPLY_TO||'workshop.ppengfis@ufrpe.br',subject:'[TESTE FORMS] Correções dos resumos — VII Workshop PPENGFIS',text,html:`<div style="font:16px/1.6 Arial;max-width:760px">${text.split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('')}<p><a href="${esc(link)}">Abrir formulário de teste</a></p></div>`};
await writeFile(file,JSON.stringify({status:'pending',to:target}),{flag:'wx'});
const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'ppengfis-forms-test-weliton-20261019'},body:JSON.stringify(message),signal:AbortSignal.timeout(30000)});
const data=await response.json();const result={status:response.ok&&data.id?'accepted':'failed',to:target,id:data.id,http_status:response.status};
await writeFile(file,JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(result.status!=='accepted')process.exitCode=1;
