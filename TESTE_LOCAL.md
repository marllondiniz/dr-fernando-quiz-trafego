# 🧪 Guia de Teste Local do Webhook Tintim

Este guia explica como testar o webhook do Tintim localmente antes de fazer deploy.

---

## ✅ Pré-requisitos

- Node.js instalado
- Dependências instaladas (`npm install`)
- Variáveis de ambiente configuradas (`.env.local`)

---

## 🚀 Passo 1: Iniciar o Servidor Local

### Opção A: Terminal único

```bash
cd /Users/marllondiniz/Desktop/projetos/dr-fernando-trafego
npm run dev
```

Aguarde até ver: `✓ Ready in Xs` e `○ Local: http://localhost:3000`

### Opção B: Terminal separado (recomendado)

**Terminal 1** (servidor):
```bash
cd /Users/marllondiniz/Desktop/projetos/dr-fernando-trafego
npm run dev
```

**Terminal 2** (testes):
```bash
cd /Users/marllondiniz/Desktop/projetos/dr-fernando-trafego
./test-webhook-local.sh
```

---

## 🧪 Passo 2: Testar o Endpoint

### Teste 1: Verificar se está acessível (GET)

**No navegador:**
```
http://localhost:3000/api/tintim-webhook
```

**Via terminal:**
```bash
curl http://localhost:3000/api/tintim-webhook
```

**Resultado esperado:**
```json
{
  "message": "Webhook do Tintim está funcionando",
  "endpoint": "/api/tintim-webhook",
  "method": "POST",
  "expectedPayload": { ... }
}
```

---

### Teste 2: Enviar POST com dados simulados

**Via terminal:**
```bash
curl -X POST http://localhost:3000/api/tintim-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {
      "phone": "5511999999999",
      "name": "João Silva"
    },
    "message": {
      "text": "Olá, quero saber mais sobre lipedema"
    },
    "link_id": "855a2f73-2af0-445f-aaa2-6e5d42a4a6bf"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Webhook recebido"
}
```

---

### Teste 3: Usar o script automatizado

```bash
./test-webhook-local.sh
```

Este script testa:
- ✅ GET (verificar se endpoint está acessível)
- ✅ POST com dados completos
- ✅ POST com teste de validação (sem dados)
- ✅ POST com diferentes funnels

---

## 📊 Passo 3: Verificar os Logs

No terminal onde o servidor está rodando, você verá:

```
📥 Webhook recebido do Tintim: {
  event: 'message_received',
  hasContact: true,
  hasMessage: true,
  linkId: '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf'
}
✅ Lead processado com sucesso: {
  timestamp: '15/01/2024 10:30:00',
  name: 'João Silva',
  phone: '5511999999999',
  message: 'Olá, quero saber mais sobre lipedema',
  funnel: 'lipedema',
  linkId: '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf'
}
✅ Lead qualificado salvo no Google Sheets: { ... }
```

---

## 📋 Passo 4: Verificar a Planilha (se configurado)

Se você tiver as variáveis de ambiente configuradas:

1. Abra a planilha do Google Sheets
2. Procure pela aba **"Leads Qualificados"**
3. Verifique se uma nova linha foi adicionada

**Nota**: Se as variáveis de ambiente não estiverem configuradas, você verá um erro nos logs, mas o endpoint ainda retornará 200 OK.

---

## 🧪 Teste 5: Testar Diferentes Funnels

### Lipedema (quiz)
```bash
curl -X POST http://localhost:3000/api/tintim-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {"phone": "5511999999999", "name": "João"},
    "message": {"text": "Fiz o teste"},
    "link_id": "855a2f73-2af0-445f-aaa2-6e5d42a4a6bf"
  }'
```
**Funnel esperado**: `lipedema`

### Lipedema Direto
```bash
curl -X POST http://localhost:3000/api/tintim-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {"phone": "5511888888888", "name": "Maria"},
    "message": {"text": "Quero começar"},
    "link_id": "e51943c9-7a5f-45ce-9c5e-b67996047881"
  }'
```
**Funnel esperado**: `lipedema-direto`

### Jejum Hormonal (quiz)
```bash
curl -X POST http://localhost:3000/api/tintim-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {"phone": "5511777777777", "name": "Pedro"},
    "message": {"text": "Fiz o teste"},
    "link_id": "49a1ace3-3239-4e38-b9a9-95009cf50efd"
  }'
```
**Funnel esperado**: `jejum-hormonal`

### Jejum Hormonal Direto
```bash
curl -X POST http://localhost:3000/api/tintim-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {"phone": "5511666666666", "name": "Ana"},
    "message": {"text": "Quero começar"},
    "link_id": "86f4d522-0c48-4f0e-a861-83d7d89de2a0"
  }'
```
**Funnel esperado**: `jejum-hormonal-direto`

---

## 🔍 Troubleshooting Local

### Problema: Porta 3000 já está em uso

**Solução:**
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
PORT=3001 npm run dev
```

### Problema: Endpoint retorna 404

**Solução:**
- Verifique se o servidor está rodando
- Verifique se acessou `http://localhost:3000/api/tintim-webhook`
- Verifique se o arquivo `app/api/tintim-webhook/route.ts` existe

### Problema: Erro ao salvar no Google Sheets

**Solução:**
- Verifique se o arquivo `.env.local` existe
- Verifique se as variáveis estão configuradas:
  - `GOOGLE_SHEETS_SPREADSHEET_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`
- Reinicie o servidor após adicionar variáveis

### Problema: CORS errors

**Solução:**
- O endpoint já tem suporte a CORS configurado
- Se ainda tiver problemas, verifique se está usando `http://localhost:3000` (não `https://`)

---

## ✅ Checklist de Teste Local

- [ ] Servidor iniciado (`npm run dev`)
- [ ] Endpoint acessível via GET
- [ ] POST retorna `{"success": true, "message": "Webhook recebido"}`
- [ ] Logs mostram processamento correto
- [ ] Diferentes funnels são identificados corretamente
- [ ] Planilha é atualizada (se variáveis configuradas)

---

## 🚀 Próximos Passos

Após testar localmente e confirmar que está funcionando:

1. ✅ Fazer commit das alterações
2. ✅ Fazer deploy para produção
3. ✅ Testar em produção
4. ✅ Configurar webhook no Tintim com URL de produção

---

## 💡 Dicas

1. **Mantenha o servidor rodando** enquanto testa
2. **Observe os logs** no terminal do servidor
3. **Teste todos os funnels** para garantir que estão corretos
4. **Use o script automatizado** para testes rápidos

---

**Pronto!** Agora você pode testar tudo localmente antes de fazer deploy. 🎉

