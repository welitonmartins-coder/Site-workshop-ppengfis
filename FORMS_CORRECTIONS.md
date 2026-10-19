# Correções no Netlify Forms

O formulário `abstract` mantém os originais. As revisões completas são encaminhadas pela função de validação ao formulário `abstract-corrections`, com código, email, título, autores, afiliações, resumo, alterações, protocolo, horário de recebimento, indicação de teste e assinatura do registro. Os links individuais existentes continuam válidos.

No painel Netlify, abrir Forms → abstract-corrections → Export CSV. Para compor o livro, entregar esse CSV e o cadastro original à organização. A seleção deve considerar a data `received_at`, agrupar por código e manter o original quando não houver revisão. Não ordenar apenas pelo título: ele pode mudar. Mudanças de autoria devem ser conferidas.

`tools/select-latest-corrections.py` seleciona a revisão mais recente por código, verifica a assinatura de cada registro, ignora testes e sinaliza protocolos repetidos, conteúdo divergente e mudanças de autoria. Precisa da chave local em `netlify/private/corrections-secret.txt`; ela não deve acompanhar arquivos públicos. A pasta de saída deve ser nova. A execução não modifica os arquivos de entrada.

Os dados de cada versão também permanecem no Blobs como cópia técnica e controle de reenvio. O Forms é o local de consulta e exportação. Em uma falha de comunicação, o mesmo protocolo pode aparecer duas vezes no Forms; o consolidador elimina a duplicata. A página só confirma sucesso depois que o Forms aceita o envio. Os registros originais do formulário `abstract` não são alterados.

Os testes autorizados para weliton.martins@ufrpe.br usam um link assinado com finalidade específica e geram registros `is_test=true`, com email da organização, sem alterar textos de estudantes. Esses registros não entram na seleção final. O formulário não manda e-mails a estudantes automaticamente.

Referência: https://docs.netlify.com/manage/forms/setup/
