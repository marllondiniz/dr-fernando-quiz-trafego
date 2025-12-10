# ⚡ Guia Rápido: Configurar n8n em 5 Minutos

## 🎯 O que você precisa fazer

1. **Configurar webhook no Tintim** → Apontar para seu site
2. **Criar workflow no n8n** → Enviar para VTurb
3. **Pronto!** → Leads serão salvos automaticamente

---

## 📝 Passo 1: Configurar Tintim (2 minutos)

1. Acesse o painel do Tintim
2. Vá em **Integrações → Webhooks**
3. Crie webhook:
   - **URL**: `https://drfernandodelpiero.com/api/tintim-webhook`
   - **Evento**: "Mensagem recebida"
   - **Método**: POST
4. Salve

---

## 🔧 Passo 2: Criar Workflow no n8n (3 minutos)

### Workflow Simples:

```
Webhook (Tintim)
  ↓
HTTP Request (Seu Endpoint)
  ↓
HTTP Request (VTurb)
```

### Node 1: Webhook
- **Path**: `/webhook/tintim`
- **Método**: POST

### Node 2: HTTP Request (Seu Endpoint)
- **URL**: `https://drfernandodelpiero.com/api/tintim-webhook`
- **Método**: POST
- **Body**: `{{ $json }}`

### Node 3: HTTP Request (VTurb)
- **URL**: `https://api.vturb.com.br/api/v1/events`
- **Método**: POST
- **Headers**:
  ```
  Authorization: Bearer SEU_TOKEN_VTURB
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "event": "lead",
    "properties": {
      "phone": "{{ $json.vturb.data.phone }}",
      "funnel": "{{ $json.vturb.data.funnel }}"
    }
  }
  ```

---

## ✅ Pronto!

Agora:
- ✅ Tintim envia webhook quando recebe mensagem
- ✅ Seu endpoint salva no Google Sheets
- ✅ n8n envia para VTurb
- ✅ Tudo automático!

---

## 🧪 Testar

1. Envie mensagem pelo WhatsApp usando link do Tintim
2. Verifique a planilha "Leads Qualificados"
3. Verifique o VTurb

---

## 📚 Documentação Completa

Veja `N8N_SETUP.md` para guia detalhado.

