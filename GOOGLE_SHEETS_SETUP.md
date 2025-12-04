# Configuração do Google Sheets para o Quiz

Este guia explica como configurar o Google Sheets para receber os dados do quiz.

## Passo 1: Criar a Planilha do Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Copie o **ID da planilha** da URL:
   - A URL será algo como: `https://docs.google.com/spreadsheets/d/SEU_SPREADSHEET_ID/edit`
   - Copie apenas o `SEU_SPREADSHEET_ID`

## Passo 2: Criar o Google Apps Script

1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em "Novo projeto"
3. Cole o código do arquivo `google-apps-script.js`
4. **Substitua** `'SEU_SPREADSHEET_ID'` pelo ID da sua planilha (copiado no passo 1)
5. Salve o projeto (Ctrl+S ou Cmd+S)

## Passo 3: Fazer o Deploy do Script

1. No Google Apps Script, clique em "Implantar" > "Nova implantação"
2. Escolha o tipo: **Aplicativo da Web**
3. Configure:
   - **Descrição**: "Quiz Form Handler"
   - **Executar como**: "Eu"
   - **Quem tem acesso**: "Qualquer pessoa"
4. Clique em "Implantar"
5. **Copie a URL do aplicativo da web** gerada

## Passo 4: Configurar a Variável de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione a seguinte linha:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SUA_URL_AQUI/exec
   ```
3. Substitua `SUA_URL_AQUI` pela URL copiada no passo 3

## Passo 5: Testar

1. Execute o quiz no site
2. Preencha os dados de contato
3. Verifique se os dados aparecem na planilha do Google Sheets

## Estrutura dos Dados

Os dados serão salvos com as seguintes colunas:
- Timestamp
- Nome
- Email
- Telefone
- Resultado
- Tipo Resultado
- Variação
- Variação Key
- Resumo

## Notas Importantes

- A primeira vez que o script rodar, ele criará automaticamente a aba "Quiz Responses" se ela não existir
- Os dados são enviados de forma assíncrona, então o usuário não precisa esperar
- Se houver erro no envio, o fluxo do quiz continua normalmente (não bloqueia o usuário)

