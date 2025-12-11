# 🔍 Diagnóstico: Webhook não está salvando na planilha

## ✅ **Passo 1: Verificar se o webhook está sendo recebido**

### 1.1 Verificar logs do servidor

Abra o terminal onde o servidor Next.js está rodando e procure por:

```
📦 PAYLOAD COMPLETO RECEBIDO:
```

**O que procurar:**
- ✅ Se aparecer essa mensagem, o webhook está chegando
- ❌ Se não aparecer, o Tintim pode não estar enviando ou a URL está errada

### 1.2 Verificar URL do webhook no Tintim

A URL deve ser exatamente:
```
https://drfernandodelpiero.com/api/tintim-webhook
```

**Problemas comuns:**
- ❌ `https://drfernandodelpiero.com//api/tintim-webhook` (barra dupla)
- ❌ `https://drfernandodelpiero.com/tintim-webhook` (sem `/api/`)
- ❌ `http://drfernandodelpiero.com/api/tintim-webhook` (http em vez de https)

---

## ✅ **Passo 2: Verificar extração de dados**

### 2.1 Verificar logs após receber o webhook

Procure por esta mensagem nos logs:
```
🔍 Dados extraídos (inicial):
```

**O que verificar:**
- ✅ `phone` deve estar presente (não "NÃO ENCONTRADO")
- ✅ `messageText` deve estar presente (não "NÃO ENCONTRADO")
- ✅ `linkId` deve estar presente (não "NÃO ENCONTRADO")

**Se faltar algum dado:**
- O payload do Tintim pode ter uma estrutura diferente
- Verifique o payload completo nos logs (`📦 PAYLOAD COMPLETO RECEBIDO:`)

---

## ✅ **Passo 3: Verificar processamento**

### 3.1 Verificar se chegou ao processamento

Procure por estas mensagens nos logs:
```
🔍 Dados extraídos do webhook:
🎯 Funnel identificado:
💾 Tentando salvar lead no Google Sheets...
```

**Se não aparecer:**
- O webhook pode estar sendo ignorado
- Verifique mensagens como:
  - `⚠️ Webhook ignorado: sem mensagem para processar`
  - `❌ Dados obrigatórios faltando: telefone não encontrado`

### 3.2 Casos especiais

**Se aparecer:**
```
💾 Webhook de Criação de Conversa - armazenando dados no cache
```
- Isso significa que o webhook tem telefone mas não tem mensagem
- Aguarde o próximo webhook com a mensagem

**Se aparecer:**
```
🔍 Webhook de Criação de Mensagem - buscando telefone no cache
```
- Isso significa que o webhook tem mensagem mas não tem telefone
- Verifique se o webhook de "Criação de Conversa" foi recebido antes

---

## ✅ **Passo 4: Verificar Google Sheets**

### 4.1 Verificar variáveis de ambiente

Procure por esta mensagem nos logs:
```
🔧 Verificando variáveis de ambiente...
```

**Verifique:**
- ✅ `SPREADSHEET_ID` deve estar configurado
- ✅ `SERVICE_ACCOUNT_EMAIL` deve estar configurado
- ✅ `PRIVATE_KEY` deve estar configurado

**Se alguma estiver "NÃO CONFIGURADO":**
- Configure as variáveis de ambiente no Vercel/provedor de hospedagem

### 4.2 Verificar salvamento

Procure por estas mensagens:
```
✅ Lead salvo com sucesso no Google Sheets
```
ou
```
❌ Erro ao salvar lead no Google Sheets:
```

**Se aparecer erro:**
- Verifique a mensagem de erro completa nos logs
- Erros comuns:
  - `PERMISSION_DENIED`: Service Account não tem acesso à planilha
  - `NOT_FOUND`: ID da planilha está errado
  - `UNAUTHENTICATED`: Chave privada está incorreta

---

## ✅ **Passo 5: Verificar planilha manualmente**

1. Abra o Google Sheets
2. Verifique se a aba "Leads Qualificados" existe
3. Verifique se os cabeçalhos estão corretos:
   - Timestamp, Nome, Telefone, Mensagem, Funnel, Link ID, Status, UTM Source, etc.
4. Verifique se há linhas novas na planilha

---

## 🧪 **Teste rápido**

### Endpoint de diagnóstico

Acesse no navegador (ou curl):
```
https://drfernandodelpiero.com/api/tintim-webhook
```

Você deve ver uma resposta JSON com:
- Status do sistema
- Status das variáveis de ambiente
- Tamanho do cache
- Payload esperado

---

## 📋 **Checklist de verificação**

- [ ] Servidor está rodando?
- [ ] URL do webhook no Tintim está correta?
- [ ] Webhook está sendo recebido (ver logs)?
- [ ] Dados estão sendo extraídos corretamente (phone, message, linkId)?
- [ ] Variáveis de ambiente estão configuradas?
- [ ] Service Account tem acesso à planilha?
- [ ] Planilha existe e tem a aba "Leads Qualificados"?

---

## 🔧 **Soluções comuns**

### Problema: Webhook não está chegando

**Solução:**
1. Verifique a URL no Tintim
2. Verifique se o servidor está online
3. Teste a URL manualmente (endpoint GET)

### Problema: Telefone não encontrado

**Solução:**
1. Verifique o payload completo nos logs
2. Verifique se o webhook de "Criação de Conversa" foi recebido antes
3. Pode ser necessário ajustar a extração de dados

### Problema: Erro ao salvar no Google Sheets

**Solução:**
1. Verifique se as variáveis de ambiente estão configuradas
2. Verifique se o Service Account tem acesso à planilha
3. Verifique o ID da planilha

---

## 📞 **Próximos passos**

Se ainda não funcionar após seguir todos os passos:

1. **Copie os logs completos** do servidor (especialmente as linhas com emojis)
2. **Copie o payload completo** que aparece nos logs (`📦 PAYLOAD COMPLETO RECEBIDO:`)
3. **Verifique o status** através do endpoint GET
4. **Envie essas informações** para análise

---

## 💡 **Dica importante**

Os logs são sua melhor ferramenta de diagnóstico! Eles mostram exatamente o que está acontecendo em cada etapa do processo.
