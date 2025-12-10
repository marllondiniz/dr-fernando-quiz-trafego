# 🔗 Como Funciona a URL do Webhook

## ✅ Resposta Rápida

**O caminho precisa ser exato**: `/api/tintim-webhook`

**Mas você pode acessar de várias formas:**
- ✅ Navegador
- ✅ curl (terminal)
- ✅ Postman/Insomnia
- ✅ Scripts automatizados
- ✅ Tintim (webhook)

---

## 📍 URLs que Funcionam

### Local (Desenvolvimento)

```
http://localhost:3000/api/tintim-webhook
```

**Variações que também funcionam:**
- ✅ `http://localhost:3000/api/tintim-webhook` (GET ou POST)
- ✅ `http://127.0.0.1:3000/api/tintim-webhook` (mesma coisa)
- ✅ Qualquer ferramenta que acesse essa URL (curl, Postman, etc.)

### Produção

```
https://drfernandodelpiero.com/api/tintim-webhook
```

**Variações que também funcionam:**
- ✅ `https://drfernandodelpiero.com/api/tintim-webhook` (GET ou POST)
- ✅ Qualquer ferramenta que acesse essa URL

---

## ❌ URLs que NÃO Funcionam

### Caminhos Errados
- ❌ `http://localhost:3000/tintim-webhook` (falta `/api/`)
- ❌ `http://localhost:3000/api/tintim` (caminho incompleto)
- ❌ `http://localhost:3000/api/webhook` (nome errado)

### Protocolos Errados (Local)
- ❌ `https://localhost:3000/api/tintim-webhook` (não use HTTPS local)
- ✅ `http://localhost:3000/api/tintim-webhook` (use HTTP local)

---

## 🎯 Formas de Acessar

### 1. Navegador (GET apenas)

```
http://localhost:3000/api/tintim-webhook
```

**Funciona para:** Verificar se o endpoint está acessível

---

### 2. Terminal (curl)

```bash
# GET
curl http://localhost:3000/api/tintim-webhook

# POST
curl -X POST http://localhost:3000/api/tintim-webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"message_received",...}'
```

**Funciona para:** Testes rápidos

---

### 3. Postman / Insomnia

**Método:** POST  
**URL:** `http://localhost:3000/api/tintim-webhook`  
**Headers:** `Content-Type: application/json`  
**Body:** JSON com dados do webhook

**Funciona para:** Testes visuais e debug

---

### 4. Scripts Automatizados

```bash
./test-webhook-local.sh
```

**Funciona para:** Testes completos automatizados

---

### 5. Tintim (Webhook Real)

**URL de Produção:**
```
https://drfernandodelpiero.com/api/tintim-webhook
```

**Funciona para:** Receber webhooks reais do Tintim

---

## 🔍 Como o Next.js Funciona

No Next.js, quando você cria um arquivo em:
```
app/api/tintim-webhook/route.ts
```

O Next.js automaticamente cria a rota:
```
/api/tintim-webhook
```

**Importante:**
- ✅ O caminho `/api/tintim-webhook` é **fixo** (baseado na estrutura de pastas)
- ✅ Você pode acessar de **qualquer ferramenta** (navegador, curl, Postman, etc.)
- ✅ O **método HTTP** importa (GET, POST, OPTIONS)

---

## 📝 Resumo

| Ambiente | URL Completa | Funciona? |
|----------|---------------|-----------|
| **Local** | `http://localhost:3000/api/tintim-webhook` | ✅ Sim |
| **Produção** | `https://drfernandodelpiero.com/api/tintim-webhook` | ✅ Sim |
| **Qualquer ferramenta** | Mesma URL acima | ✅ Sim |
| **Caminho errado** | `/tintim-webhook` (sem `/api/`) | ❌ Não |
| **HTTPS local** | `https://localhost:3000/...` | ❌ Não (use HTTP) |

---

## 💡 Dica

**O importante é:**
1. ✅ Caminho correto: `/api/tintim-webhook`
2. ✅ Protocolo correto: `http://` (local) ou `https://` (produção)
3. ✅ Domínio correto: `localhost:3000` (local) ou `drfernandodelpiero.com` (produção)

**A ferramenta que você usa não importa!** (navegador, curl, Postman, Tintim, etc.)

---

## 🧪 Teste Rápido

Tente acessar de diferentes formas:

```bash
# 1. Navegador
# Abra: http://localhost:3000/api/tintim-webhook

# 2. curl
curl http://localhost:3000/api/tintim-webhook

# 3. Script
./test-webhook-local.sh

# Todos devem funcionar! ✅
```

---

**Resumo:** O endpoint funciona com a URL exata, mas você pode acessar de qualquer ferramenta! 🎉

