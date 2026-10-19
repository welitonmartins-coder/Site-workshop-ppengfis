const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.hash.slice(1));
const token=params.get('token');
history.replaceState(null,'',location.pathname+location.search);
let requestId=crypto.randomUUID(),pendingBody=null,sending=false,receiptData=null,dirty=false;
const api='/api/abstract-corrections';
const counter=()=>{const n=Array.from($('abstract').value).length;$('counter').textContent=n+' / 2.000';$('counter').classList.toggle('over',n>2000);};
async function call(method,body){const response=await fetch(api,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});let data;try{data=await response.json();}catch{throw new Error('Não foi possível acessar o recebimento. Tente novamente mais tarde.');}if(!response.ok){const err=new Error(data.error||'Não foi possível confirmar o envio.');err.status=response.status;throw err;}return data;}
async function init(){
 if(!token){$('loading').hidden=true;$('locked').hidden=false;return;}
 try{const data=await call('GET');$('code').textContent=data.code;$('originalTitle').textContent=data.title;
 for(const field of ['title','authors','affiliations','abstract'])$(field).value=data[field]||'';
 counter();$('correctionForm').hidden=false;$('preview').hidden=!data.preview;
 }catch(err){$('problem').textContent=err.message;$('problem').hidden=false;$('locked').hidden=false;}finally{$('loading').hidden=true;}
}
$('abstract').addEventListener('input',counter);
$('correctionForm').addEventListener('input',()=>{dirty=true;if(pendingBody){$('formError').textContent='Há um envio sem confirmação. Tente enviá-lo novamente antes de fazer outra versão.';$('formError').hidden=false;}});
$('correctionForm').addEventListener('submit',async e=>{
 e.preventDefault();if(sending)return;
 if(!pendingBody){const fd=new FormData(e.target);pendingBody=Object.fromEntries(fd.entries());pendingBody.confirm=$('confirm').checked;pendingBody.requestId=requestId;}
 sending=true;$('submit').disabled=true;$('submit').textContent='Confirmando recebimento…';$('formError').hidden=true;
 try{receiptData=await call('POST',pendingBody);$('receipt').textContent=receiptData.receipt;$('receivedAt').textContent='Recebido em '+new Date(receiptData.receivedAt).toLocaleString('pt-BR',{timeZone:'America/Fortaleza'})+' · Fortaleza';$('correctionForm').hidden=true;$('success').hidden=false;$('success').focus();dirty=false;pendingBody=null;}
 catch(err){$('formError').textContent=err.message;$('formError').hidden=false;if([400,413].includes(err.status)){pendingBody=null;requestId=crypto.randomUUID();}
 // A fresh request is safe only after a definite client validation rejection.
 }finally{sending=false;$('submit').disabled=false;$('submit').innerHTML='Enviar versão corrigida <span>→</span>';}
});
$('newVersion').addEventListener('click',()=>{requestId=crypto.randomUUID();pendingBody=null;receiptData=null;$('success').hidden=true;$('correctionForm').hidden=false;$('changes').value='';$('confirm').checked=false;$('title').focus();});
$('download').addEventListener('click',()=>{const text=`VII Workshop PPENGFIS\nProtocolo: ${receiptData.receipt}\nRecebido: ${receiptData.receivedAt}\nSituação: recebido para conferência\n${receiptData.preview?'DEMONSTRAÇÃO LOCAL — sem envio real':''}`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=receiptData.receipt+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
window.addEventListener('beforeunload',e=>{if(dirty||pendingBody){e.preventDefault();e.returnValue='';}});
init();
