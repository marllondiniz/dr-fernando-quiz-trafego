# 🚀 Guia Completo: Configurar n8n para VTurb e Google Sheets

Este guia explica passo a passo como configurar o rastreamento de conversões no VTurb e salvar leads qualificados via n8n.

---

## 📋 Pré-requisitos

- Conta no Tintim configurada
- Conta no n8n (cloud ou self-hosted)
- Acesso ao painel do VTurb
- Google Sheets configurado (mesma planilha do quiz)

---

## 🔗 Links do Tintim Configurados

```
lipedema (quiz):         855a2f73-2af0-445f-aaa2-6e5d42a4a6bf
lipedema-direto:         e51943c9-7a5f-45ce-9c5e-b67996047881
jejum-hormonal (quiz):   49a1ace3-3239-4e38-b9a9-95009cf50efd
jejum-hormonal-direto:   86f4d522-0c48-4f0e-a861-83d7d89de2a0
```

---

## 📝 Passo 1: Configurar Webhook no Tintim

1. **Acesse o painel do Tintim**
   - Faça login na sua conta

2. **Vá em Integrações → Webhooks**
   - Procure pela seção de webhooks/integrações

3. **Crie um novo webhook:**
   - **URL**: `https://drfernandodelpiero.com/api/tintim-webhook` (URL do seu site em produção)
   - **Ou via n8n**: `https://seu-n8n.com/webhook/tintim-message` (se preferir usar n8n como intermediário)
   - **Evento**: "Mensagem recebida" ou "Nova conversa iniciada"
   - **Método**: POST
   - **Headers** (opcional): Pode adicionar autenticação se necessário

4. **Salve o webhook**

---

## 🔧 Passo 2: Criar Workflow no n8n

### Opção A: Usar Endpoint Direto (Recomendado)

Se você configurou o webhook do Tintim para apontar diretamente para `/api/tintim-webhook`, o n8n não é necessário para receber os dados. Mas você pode usar o n8n para:

1. **Enviar para VTurb** (se o endpoint não fizer isso automaticamente)
2. **Notificações adicionais** (email, Slack, etc.)

### Opção B: n8n como Intermediário (Mais Controle)

Use esta opção se quiser mais controle sobre o fluxo.

#### Estrutura do Workflow:

```
Webhook (Tintim) 
  → IF (Filtrar mensagens válidas)
  → HTTP Request (Endpoint /api/tintim-webhook)
  → HTTP Request (VTurb - se necessário)
  → (Opcional) Notificação
```

---

## 🎯 Passo 3: Configurar Nodes no n8n

### Node 1: Webhook

**Configuração:**
- **Tipo**: Webhook
- **Método**: POST
- **Path**: `/webhook/tintim-message`
- **Response Mode**: Respond When Last Node Finishes
- **Response Code**: 200

**Dados esperados do Tintim:**
```json
{
  "event": "message_received",
  "contact": {
    "phone": "5511999999999",
    "name": "João Silva"
  },
  "message": {
    "text": "Olá, quero saber mais"
  },
  "link_id": "855a2f73-2af0-445f-aaa2-6e5d42a4a6bf"
}
```

---

### Node 2: IF (Filtrar Mensagens Válidas)

**Condição:**
```
{{ $json.event }} === "message_received" && {{ $json.message.text }} !== ""
```

**Ou:**
```
{{ $json.message && $json.message.text && $json.message.text.length > 0 }}
```

**Ação**: Continue se verdadeiro

---

### Node 3: HTTP Request (Enviar para seu Endpoint)

**Configuração:**
- **Método**: POST
- **URL**: `https://drfernandodelpiero.com/api/tintim-webhook`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body (JSON)**:
  ```json
  {{ $json }}
  ```

Este endpoint já:
- ✅ Salva no Google Sheets
- ✅ Identifica o funnel
- ✅ Retorna dados formatados para VTurb

---

### Node 4: HTTP Request (Enviar para VTurb)

**Configuração:**
- **Método**: POST
- **URL**: `https://api.vturb.com.br/api/v1/events` (ou a URL da API do VTurb)
- **Authentication**: Bearer Token
- **Token**: `SEU_TOKEN_VTURB`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_VTURB
```

**Body (JSON):**
```json
{
  "event": "lead",
  "timestamp": "{{ $json.vturb.timestamp }}",
  "properties": {
    "phone": "{{ $json.vturb.data.phone }}",
    "name": "{{ $json.vturb.data.name }}",
    "funnel": "{{ $json.vturb.data.funnel }}",
    "link_id": "{{ $json.vturb.data.linkId }}",
    "message": "{{ $json.vturb.data.message }}"
  }
}
```

**Como obter o token do VTurb:**
1. Acesse o painel do VTurb
2. Vá em **Configurações → API** ou **Integrações**
3. Gere um token de API
4. Copie e use no header `Authorization: Bearer SEU_TOKEN_VTURB`

**Nota**: Se o VTurb não tiver API REST, você pode precisar usar outro método (pixel, script, etc.). Consulte a documentação do VTurb.

---

### Node 5: (Opcional) Notificação

Você pode adicionar nodes para:
- Enviar email
- Enviar para Slack
- Enviar para Discord
- Etc.

---

## 📊 Passo 4: Estrutura da Planilha "Leads Qualificados"

O endpoint `/api/tintim-webhook` cria automaticamente a aba "Leads Qualificados" com as seguintes colunas:

| Timestamp | Nome | Telefone | Mensagem | Funnel | Link ID | Status |
|-----------|------|----------|----------|--------|---------|--------|
| 15/01/2024 10:30:00 | João Silva | 5511999999999 | Olá, quero saber mais | lipedema | 855a2f73... | Mensagem Enviada |

---

## 🧪 Passo 5: Testar o Workflow

### Teste 1: Testar Endpoint Direto

```bash
curl -X POST https://drfernandodelpiero.com/api/tintim-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {
      "phone": "5511999999999",
      "name": "João Silva"
    },
    "message": {
      "text": "Olá, quero saber mais"
    },
    "link_id": "855a2f73-2af0-445f-aaa2-6e5d42a4a6bf"
  }'
```

### Teste 2: Testar via n8n

1. Ative o workflow no n8n
2. Envie uma mensagem de teste pelo WhatsApp usando um link do Tintim
3. Verifique:
   - ✅ Webhook recebeu os dados (veja os logs no n8n)
   - ✅ Endpoint processou corretamente (veja os logs do servidor)
   - ✅ Planilha foi atualizada (abra a planilha e confira)
   - ✅ VTurb recebeu o evento (verifique no painel do VTurb)

---

## 🔍 Troubleshooting

### Problema: Webhook não recebe dados do Tintim

**Soluções:**
- Verifique se a URL do webhook está correta
- Teste o webhook manualmente com um POST
- Verifique os logs do n8n
- Verifique se o Tintim está enviando os dados no formato correto

### Problema: Endpoint retorna erro 500

**Soluções:**
- Verifique as variáveis de ambiente do Google Sheets
- Verifique os logs do servidor
- Confirme que a planilha existe e tem permissões corretas

### Problema: VTurb não recebe o evento

**Soluções:**
- Confirme a URL da API do VTurb
- Verifique se o token está correto
- Teste a API do VTurb manualmente (Postman/curl)
- Verifique se o formato dos dados está correto

### Problema: Planilha não atualiza

**Soluções:**
- Verifique as credenciais do Google Sheets
- Confirme o ID da planilha e o nome da aba
- Verifique se as colunas estão na ordem correta
- Verifique os logs do servidor

---

## 📝 Checklist Final

- [ ] Webhook configurado no Tintim
- [ ] Endpoint `/api/tintim-webhook` funcionando
- [ ] Workflow criado no n8n (se usar)
- [ ] Token do VTurb obtido e configurado
- [ ] Planilha "Leads Qualificados" criada/verificada
- [ ] Mapeamento de link_id → funnel funcionando
- [ ] Workflow testado e funcionando
- [ ] Verificado que apenas mensagens válidas são processadas

---

## 🎯 Resumo do Fluxo

```
1. Usuário clica no link do Tintim → Abre WhatsApp
2. Usuário envia mensagem no WhatsApp
3. Tintim detecta mensagem → Envia webhook
4. Webhook chega no endpoint /api/tintim-webhook
5. Endpoint:
   - Identifica o funnel (baseado no link_id)
   - Salva no Google Sheets (aba "Leads Qualificados")
   - Retorna dados formatados para VTurb
6. n8n (opcional) recebe resposta e envia para VTurb
7. VTurb registra o evento 'lead'
```

---

## 💡 Dicas

1. **Teste sempre em ambiente de desenvolvimento primeiro**
2. **Monitore os logs** do servidor e do n8n
3. **Use webhooks de teste** antes de colocar em produção
4. **Mantenha backups** da planilha
5. **Documente** qualquer mudança no workflow

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do servidor
2. Verifique os logs do n8n
3. Teste cada node individualmente
4. Verifique a documentação do Tintim e VTurb

---

**Pronto!** Agora você tem um sistema completo de rastreamento de conversões. 🎉

