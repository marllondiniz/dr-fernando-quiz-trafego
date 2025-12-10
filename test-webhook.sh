#!/bin/bash

# Script de teste do webhook Tintim
# Uso: ./test-webhook.sh [URL]
# Exemplo: ./test-webhook.sh https://drfernandodelpiero.com

URL="${1:-https://drfernandodelpiero.com}"
ENDPOINT="${URL}/api/tintim-webhook"

echo "🧪 Testando Webhook Tintim"
echo "=========================="
echo "URL: ${ENDPOINT}"
echo ""

# Teste 1: GET
echo "📋 Teste 1: Verificando se endpoint está acessível (GET)"
echo "--------------------------------------------------------"
curl -s "${ENDPOINT}" | jq '.' || curl -s "${ENDPOINT}"
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
  }' | jq '.' || echo "Resposta recebida (pode não ser JSON válido)"
echo ""
echo ""

# Teste 3: POST com teste de validação (sem dados)
echo "📋 Teste 3: Teste de validação do Tintim (sem dados)"
echo "--------------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.' || echo "Resposta recebida"
echo ""
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "📝 Próximos passos:"
echo "1. Verifique se o Teste 1 retornou JSON com informações do endpoint"
echo "2. Verifique se o Teste 2 retornou {'success': true, 'message': 'Webhook recebido'}"
echo "3. Verifique a planilha 'Leads Qualificados' no Google Sheets"
echo "4. Se tudo estiver OK, reative o webhook no Tintim"

