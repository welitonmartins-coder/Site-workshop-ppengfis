# Página de correções do VII Workshop

Atualização de 19/10/2026: os textos completos corrigidos agora também são recebidos no Netlify Forms, no formulário `abstract-corrections`, que passa a ser o local de consulta e exportação em CSV. O Blobs permanece como cópia técnica e controle de reenvio. Consulte `FORMS_CORRECTIONS.md` para selecionar a versão mais recente e excluir testes.

Implementação local em `/abstract-corrections.html`, com função privada `/api/abstract-corrections`. O formulário original `abstract` não é modificado. O recebimento utiliza Netlify Blobs, em armazenamento separado por contexto de deploy. Cada correção tem protocolo, checksum e estado `recebido_para_conferencia`; nenhuma versão é marcada automaticamente como validada. O armazenamento usa escrita condicional e não substitui versões anteriores. Não há e-mails automáticos nesta primeira implementação: o comprovante aparece na página e pode ser baixado.

## Antes de publicar

1. Gerar `netlify/private/corrections-roster.json` a partir do cadastro privado dos 26 trabalhos. Cada item deve conter `code`, `email`, `title`, `authors`, `affiliations`, `abstract`. Executar `node tools/prepare-corrections-config.mjs` para criar a chave privada (ou reutilizar a existente), criptografar o cadastro com AES-256-GCM e preparar os links individuais. Apenas `netlify/data/corrections-roster.enc.json`, com conteúdo criptografado, entra no repositório e no pacote da função. A chave e os arquivos em `netlify/private` são ignorados pelo Git. Não copiar para `public` ou `dist`.
2. Configurar no Netlify `CORRECTIONS_SECRET`, com ao menos 32 caracteres aleatórios. Manter a mesma chave no ambiente local ao gerar os links. Não incluir a chave em commits, arquivos públicos ou logs. Alterar a chave invalida os links já enviados.
3. Gerar os links com `node tools/generate-correction-links.mjs CAMINHO_MENSAGENS_JSON SAIDA_PRIVADA_JSON`. Cada autor recebe apenas o próprio link. O token é uma credencial de acesso; não deve ser encaminhado a terceiros. Ele é transportado no fragmento da URL, retirado do endereço após a leitura e enviado apenas no cabeçalho da API.
4. O prazo adotado é 30/10/2026 até 23h59 no fuso de Fortaleza, validado no servidor. Se a organização escolher outro horário, alterar `DEADLINE` e gerar novos links antes de disparar.
5. Publicar e verificar a função no Netlify, antes de usar os links reais. Usar armazenamento de preview para testes de gravação; não acrescentar trabalhos fictícios ao cadastro aprovado de produção.
6. Para vincular ao pacote Resend, substituir a instrução de resposta ao e-mail pelo link individual de cada código, e gerar novas prévias. O campo global `url_formulario` do pacote anterior sozinho não basta: a autorização exige o link individual. Manter o disparo bloqueado até validar o deploy.

## Conferência pela organização

No painel Netlify Blobs, o armazenamento de produção `ppengfis-corrections-2026` contém registros por código e ID do envio. Não editar o conteúdo recebido; exportar os registros para conferência e manter a decisão sobre a versão validada num controle separado, com responsável e data. O livro final deve ser gerado a partir dessa decisão, não simplesmente do último envio. Não foi criado um painel de gestão nesta etapa.

## Demonstrar e testar

`node tools/preview-corrections.mjs` abre um servidor restrito a `127.0.0.1:4174`, com dados fictícios e sem acesso a Netlify ou Resend. O link é exibido no terminal. Os registros de demonstração são locais em `.corrections-local/` e não entram em produção.

`node --test tools/corrections.test.mjs` verifica assinatura e vínculo, validação, prazo, falhas de persistência, versões e submissões concorrentes. `npm.cmd run build` verifica o site.

Referência: https://docs.netlify.com/build/data-and-storage/netlify-blobs/
