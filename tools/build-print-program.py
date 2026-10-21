from pathlib import Path
import json,html,sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4,landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader

root=Path(__file__).resolve().parents[1]
out=root/'output'/'folder_programacao_2026';out.mkdir(parents=True,exist_ok=True)
data=json.loads((out/'programa.json').read_text(encoding='utf-8'))
for name,file in [('Arial','arial.ttf'),('ArialB','arialbd.ttf'),('ArialI','ariali.ttf')]:pdfmetrics.registerFont(TTFont(name,str(Path('C:/Windows/Fonts')/file)))
W,H=landscape(A4);P=W/2;M=30
ink=HexColor('#153e42');green=HexColor('#226b69');muted=HexColor('#4d6264')
pdf_path=out/(sys.argv[1] if len(sys.argv)>1 else 'Folder_programacao_VII_Workshop_2026.pdf')
c=canvas.Canvas(str(pdf_path),pagesize=(W,H))
c.setTitle('Programação do VII Workshop Internacional do PPENGFIS 2026')
def text(txt,x,y,width,size=10,font='Arial',color=ink,leading=None):
 p=Paragraph(txt,ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.2,textColor=color,spaceAfter=0))
 _,h=p.wrap(width,H);p.drawOn(c,x,y-h);return y-h
def image(name,x,y,w,h):
 im=ImageReader(str(root/'public/img'/name));iw,ih=im.getSize();scale=min(w/iw,h/ih);c.drawImage(im,x+(w-iw*scale)/2,y+(h-ih*scale)/2,iw*scale,ih*scale,mask='auto')
def panel_title(label,x):
 y=text(label,x+M,H-38,P-2*M,20,'ArialB');c.setStrokeColor(green);c.setLineWidth(1.2);c.line(x+M,y-12,x+P-M,y-12);return y-30
def bottom(x,note):text(note,x+M,26,P-2*M,8,color=muted)
# Outside spread: back cover at left, front cover at right.
y=panel_title('Informações do evento',0)
y=text('21 e 22 de outubro de 2026',M,y,P-2*M,13,'ArialB')-20
y=text('<b>Local</b><br/>UFRPE · Unidade Acadêmica do Cabo de Santo Agostinho<br/>Rua Cento e Sessenta e Três, 300<br/>Cohab · Cabo de Santo Agostinho · PE',M,y,P-2*M,11)-24
y=text('<b>Programação e resumos das palestras</b><br/>workshop-ppengfis.netlify.app',M,y,P-2*M,11)-12
c.linkURL('https://workshop-ppengfis.netlify.app/#program',(M,y,P-M,y+45),relative=0)
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
widget=qr.QrCodeWidget('https://workshop-ppengfis.netlify.app/#program');b=widget.getBounds();s=90;drawing=Drawing(s,s,transform=[s/(b[2]-b[0]),0,0,s/(b[3]-b[1]),0,0]);drawing.add(widget);renderPDF.draw(drawing,c,M,y-100)
y-=125
y=text('<b>Contato da organização</b><br/>workshop.ppengfis@ufrpe.br',M,y,P-2*M,10)-24
y=text('<b>Apoio</b>',M,y,P-2*M,11)
for j,f in enumerate(['logo-horiba.jpg','logo-setup.jpg','logo-capes.jpg']):image(f,M+j*115,y-65,95,48)
bottom(0,'Horários locais · Programação atualizada em 21/10/2026')
image('logo-ppengfis.png',P+M,H-145,P-2*M,100)
y=text('VII WORKSHOP<br/>INTERNACIONAL',P+M,H-185,P-2*M,29,'ArialB',leading=33)-18
y=text('Programa de Pós-Graduação<br/>em Engenharia Física',P+M,y,P-2*M,18)-22
y=text('21 e 22 de outubro de 2026',P+M,y,P-2*M,15,'ArialB')-13
y=text('UFRPE · UACSA<br/>Cabo de Santo Agostinho · PE',P+M,y,P-2*M,12)-28
y=text('PROGRAMAÇÃO',P+M,y,P-2*M,21,'ArialB')
image('ufrpe-logo.png',P+M,42,110,60);image('logo-uacsa.jpg',P+P-140,42,100,60)
c.showPage()
def clean(s):
 return s.replace('PROF. DR. ','').replace('DR. ','').replace(' – ',' · ')
for idx,(day,items) in enumerate(data.items()):
 x=idx*P;y=panel_title('21 de outubro' if idx==0 else '22 de outubro',x)
 y=text('Quarta-feira' if idx==0 else 'Quinta-feira',x+M,y+6,P-2*M,10,color=muted)-15
 for t in items:
  top=y
  text(t['time'].replace(' - ','–'),x+M,top,75,9.3,'ArialB',green)
  tx=x+M+82;tw=P-2*M-82
  if t.get('abstractUrl'):
   nm=clean(t['item'])
   # Preserve spelling; compact upper case only in the printed name line.
   y=text(html.escape(nm),tx,top,tw,9.1,'ArialB')-3
   y=text(html.escape(t['title']),tx,y,tw,9.0,leading=10.6)-8
  else:
   label={'COFFEE BREAK':'Coffee break','LUNCH':'Almoço'}.get(t['item'],t['item'])
   if t.get('type')=='Opening':label='Abertura · Coordenação do PPENGFIS<br/>'+html.escape(clean(t['item']))
   y=text(label,tx,top,tw,9.1,'ArialB',green)-10
  if y<38:raise RuntimeError(f'Conteúdo ultrapassa painel {idx+1}: {y}')
 bottom(x,'VII Workshop Internacional do PPENGFIS · 2026')
c.save()
print(pdf_path)
