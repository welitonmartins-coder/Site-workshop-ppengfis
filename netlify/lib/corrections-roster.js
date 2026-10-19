import {createHash,createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
const key=secret=>createHash('sha256').update('ppengfis-roster-v1:'+secret).digest();
export function encryptRoster(roster,secret){
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(secret),iv);
 const ciphertext=Buffer.concat([cipher.update(JSON.stringify(roster),'utf8'),cipher.final()]);
 return {version:1,iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),ciphertext:ciphertext.toString('base64')};
}
export function decryptRoster(data,secret){
 if(data.version!==1)throw new Error('Unsupported roster format');
 const decipher=createDecipheriv('aes-256-gcm',key(secret),Buffer.from(data.iv,'base64'));decipher.setAuthTag(Buffer.from(data.tag,'base64'));
 return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data.ciphertext,'base64')),decipher.final()]).toString('utf8'));
}
