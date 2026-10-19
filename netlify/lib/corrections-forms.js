import {createHmac} from 'node:crypto';
export const FORM_NAME='abstract-corrections';
export function formFields(record,secret){
 const fields={'form-name':FORM_NAME,code:record.code,email:record.email,title:record.title,authors:record.authors,affiliations:record.affiliations,abstract:record.abstract,changes:record.changes,receipt:record.receipt,received_at:record.receivedAt,checksum:record.checksum,is_test:record.isTest?'true':'false',status:'recebido_para_conferencia'};
 fields.signature=createHmac('sha256',secret).update(JSON.stringify(fields)).digest('hex');
 return fields;
}
export function createFormsTransport({secret,url,fetchImpl=fetch}){
 const endpoint=new URL('/corrections-received.html',url);
 return async record=>{
  const response=await fetchImpl(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(formFields(record,secret)).toString(),signal:AbortSignal.timeout(25000)});
  if(!response.ok)throw new Error('Forms HTTP '+response.status);
 };
}
