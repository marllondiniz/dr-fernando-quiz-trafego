#!/bin/bash

# Script de teste do webhook Tintim LOCAL
# Uso: ./test-webhook-local.sh

URL="http://localhost:3000"
ENDPOINT="${URL}/api/tintim-webhook"

echo "🧪 Testando Webhook Tintim LOCAL"
echo "================================="
echo "URL: ${ENDPOINT}"
echo ""
echo "⚠️  Certifique-se de que o servidor está rodando (npm run dev)"
echo ""

# Aguardar um pouco para o servidor iniciar
sleep 2

# Teste 1: GET
echo "📋 Teste 1: Verificando se endpoint está acessível (GET)"
echo "--------------------------------------------------------"
curl -s "${ENDPOINT}" | jq '.' 2>/dev/null || curl -s "${ENDPOINT}"
echo ""
echo ""

# Teste 2: POST com dados simulados
echo "📋 Teste 2: Enviando POST com dados simulados"
echo "--------------------------------------------------------"
curl -X POST "${ENDPOINT}" \
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
  }' | jq '.' 2>/dev/null || echo "Resposta recebida (pode não ser JSON válido)"
echo ""
echo ""

# Teste 3: POST com teste de validação (sem dados)
echo "📋 Teste 3: Teste de validação do Tintim (sem dados)"
echo "--------------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.' 2>/dev/null || echo "Resposta recebida"
echo ""
echo ""

# Teste 4: POST com diferentes funnels
echo "📋 Teste 4: Testando diferentes funnels"
echo "--------------------------------------------------------"

echo "Testando: lipedema-direto"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {
      "phone": "5511888888888",
      "name": "Maria Santos"
    },
    "message": {
      "text": "Quero começar agora"
    },
    "link_id": "e51943c9-7a5f-45ce-9c5e-b67996047881"
  }' | jq '.lead.funnel' 2>/dev/null || echo "Resposta recebida"
echo ""

echo "Testando: jejum-hormonal"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "contact": {
      "phone": "5511777777777",
      "name": "Pedro Costa"
    },
    "message": {
      "text": "Fiz o teste e quero saber mais"
    },
    "link_id": "49a1ace3-3239-4e38-b9a9-95009cf50efd"
  }' | jq '.lead.funnel' 2>/dev/null || echo "Resposta recebida"
echo ""

echo "✅ Testes locais concluídos!"
echo ""
echo "📝 Verificações:"
echo "1. ✅ Verifique se o Teste 1 retornou JSON com informações do endpoint"
echo "2. ✅ Verifique se o Teste 2 retornou {'success': true, 'message': 'Webhook recebido'}"
echo "3. ✅ Verifique os logs do terminal onde o servidor está rodando"
echo "4. ✅ Verifique a planilha 'Leads Qualificados' no Google Sheets (se configurado)"
echo ""
echo "💡 Dica: Os logs do servidor mostrarão:"
echo "   - 📥 Webhook recebido do Tintim"
echo "   - ✅ Lead processado com sucesso"
echo "   - ✅ Lead qualificado salvo no Google Sheets"

