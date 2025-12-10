# 🧪 Teste de Leads Qualificados

Este script testa se os envios de leads qualificados estão funcionando corretamente.

## 📋 O que é testado:

1. **Webhook Tintim** (`/api/tintim-webhook`)
   - Testa o recebimento de mensagens do Tintim
   - Verifica se os leads são salvos na aba "Leads Qualificados" do Google Sheets

2. **Quiz Submit** (`/api/quiz-submit`)
   - Testa o envio de respostas de quiz
   - Verifica se os dados são salvos nas abas "Quiz Responses" e "Quiz Resumos" do Google Sheets

## 🚀 Como usar:

### Pré-requisitos:
1. Certifique-se de que o servidor Next.js está rodando:
   ```bash
   npm run dev
   ```

2. Configure as variáveis de ambiente (`.env.local`):
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`

### Executar o teste:

```bash
npm run test:leads
```

### Ou executar diretamente:

```bash
node scripts/test-leads-qualificados.js
```

### Para testar em produção:

Defina a variável de ambiente `NEXT_PUBLIC_BASE_URL` antes de executar:

```bash
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com npm run test:leads
```

## ✅ Verificando os resultados:

Após executar o teste, verifique manualmente no Google Sheets:

1. **Aba "Leads Qualificados"** - Deve conter o lead do teste do Tintim
   - Nome: "Teste Lead Qualificado"
   - Telefone: 5511999999999
   - Funnel: lipedema

2. **Aba "Quiz Responses"** - Deve conter o lead do teste do Quiz
   - Nome: "Teste Lead Quiz"
   - Email: teste-quiz@example.com

3. **Aba "Quiz Resumos"** - Deve conter o resumo do quiz

## 🔍 O que o script verifica:

- ✅ Conectividade com os endpoints
- ✅ Respostas HTTP corretas (200 OK)
- ✅ Estrutura das respostas JSON
- ✅ Processamento em background (Tintim Webhook)

## ⚠️ Observações:

- O webhook do Tintim processa em background, então a resposta HTTP será 200 OK mesmo que o processamento ainda esteja em andamento
- Sempre verifique o Google Sheets para confirmar que os dados foram salvos
- Os testes usam dados fictícios que podem ser identificados pelo nome/email

## 🐛 Troubleshooting:

**Erro: "Cannot connect to server"**
- Certifique-se de que o servidor está rodando (`npm run dev`)
- Verifique se a URL está correta

**Erro: "Configuração faltando"**
- Verifique se as variáveis de ambiente estão configuradas no `.env.local`
- Reinicie o servidor após alterar variáveis de ambiente

**Leads não aparecem no Google Sheets**
- Verifique se a planilha foi compartilhada com o email da Service Account
- Verifique os logs do servidor para erros específicos
- Certifique-se de que as permissões da Service Account estão corretas
