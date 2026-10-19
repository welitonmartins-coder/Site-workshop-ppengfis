"""Combine private original register and Netlify Forms CSV without overwrites.
Usage: python tools/select-latest-corrections.py ORIGINALS.csv FORMS.csv OUTPUT_DIR
"""
import csv,json,hmac,hashlib,sys
from pathlib import Path
from datetime import datetime

FIELDS=['form-name','code','email','title','authors','affiliations','abstract','changes','receipt','received_at','checksum','is_test','status']
def valid_record(row,secret):
    fields={key:('abstract-corrections' if key=='form-name' else row.get(key,'')) for key in FIELDS}
    serialized=json.dumps(fields,ensure_ascii=False,separators=(',',':'))
    signature=hmac.new(secret.encode(),serialized.encode(),hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature,row.get('signature',''))

def consolidate(originals,corrections,secret):
    original_by_code={r['codigo']:r for r in originals}
    latest={};issues=[];seen={}
    for row in corrections:
        code=row.get('code','');reason=None
        if row.get('is_test','').lower()=='true':reason='Teste excluído'
        elif not valid_record(row,secret):reason='Assinatura ausente ou inválida'
        elif code not in original_by_code:reason='Código desconhecido'
        elif row.get('email','').lower()!=original_by_code[code]['email'].lower():reason='E-mail divergente'
        else:
            try:when=datetime.fromisoformat(row['received_at'].replace('Z','+00:00'))
            except (ValueError,KeyError):reason='Data inválida'
            if not reason:
                receipt=row['receipt']
                if receipt in seen:
                    reason='Protocolo repetido' if seen[receipt]==row['checksum'] else 'Protocolo com conteúdos conflitantes'
                else:
                    seen[receipt]=row['checksum']
                    if code not in latest or when>latest[code][0]:latest[code]=(when,row)
        if reason:issues.append({'codigo':code,'protocolo':row.get('receipt',''),'motivo':reason})
    output=[]
    for original in originals:
        row=dict(original);code=row['codigo'];row.update(origem_versao='original',protocolo_correcao='',data_correcao='',conferir_autoria='')
        if code in latest:
            corrected=latest[code][1]
            row.update({k:corrected[k] for k in ['title','authors','affiliations','abstract']})
            row.update(origem_versao='correcao_mais_recente',protocolo_correcao=corrected['receipt'],data_correcao=corrected['received_at'])
            if corrected['authors'].strip()!=original['authors'].strip():row['conferir_autoria']='Sim'
        output.append(row)
    return output,issues

def main():
    original_path,forms_path,outpath=map(Path,sys.argv[1:4])
    outpath.mkdir(exist_ok=False)
    secret=Path('netlify/private/corrections-secret.txt').read_text().strip()
    with original_path.open(encoding='utf-8-sig',newline='') as f:originals=list(csv.DictReader(f))
    with forms_path.open(encoding='utf-8-sig',newline='') as f:corrections=list(csv.DictReader(f))
    if corrections and not set(['code','email','signature','received_at']).issubset(corrections[0]):raise ValueError('CSV não corresponde ao formulário abstract-corrections')
    output,issues=consolidate(originals,corrections,secret)
    for filename,records in [('Resumos_versao_mais_recente.csv',output),('Conferencia_da_selecao.csv',issues)]:
        with (outpath/filename).open('w',encoding='utf-8-sig',newline='') as f:
            if records:w=csv.DictWriter(f,fieldnames=list(records[0]));w.writeheader();w.writerows(records)
    print(f'{len(output)} trabalhos; {sum(r["origem_versao"]!="original" for r in output)} correções selecionadas; {len(issues)} ocorrências para conferência. Originais preservados.')
if __name__=='__main__':main()
