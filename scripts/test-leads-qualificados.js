#!/usr/bin/env node

/**
 * Script para testar o envio de leads qualificados
 * Testa ambos os endpoints:
 * 1. /api/tintim-webhook - Leads qualificados via WhatsApp/Tintim
 * 2. /api/quiz-submit - Leads qualificados via Quiz
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

/**
 * Teste do webhook do Tintim
 */
async function testTintimWebhook() {
  logSection('📱 TESTE: Webhook Tintim (Leads Qualificados)');

  const testPayload = {
    event: 'message_received',
    timestamp: new Date().toISOString(),
    contact: {
      phone: '5511999999999',
      name: 'Teste Lead Qualificado',
      email: 'teste@example.com',
    },
    message: {
      text: 'Olá, quero saber mais sobre o tratamento',
      timestamp: new Date().toISOString(),
    },
    link_id: '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf', // lipedema
    utm_source: 'facebook',
    utm_medium: 'social',
    utm_campaign: 'teste-leads-qualificados',
    utm_term: 'teste',
    utm_content: 'teste-webhook',
    fbclid: 'teste-fbclid-123456',
  };

  try {
    log(`🔄 Enviando requisição para ${BASE_URL}/api/tintim-webhook...`, 'blue');
    log(`📦 Payload: ${JSON.stringify(testPayload, null, 2)}`, 'yellow');

    const response = await fetch(`${BASE_URL}/api/tintim-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const responseData = await response.json();

    if (response.ok) {
      log('✅ Webhook respondido com sucesso!', 'green');
      log(`📥 Resposta: ${JSON.stringify(responseData, null, 2)}`, 'green');
      log('\n⚠️  NOTA: O webhook processa em background. Verifique o Google Sheets (aba "Leads Qualificados") para confirmar que o lead foi salvo.', 'yellow');
    } else {
      log(`❌ Erro na resposta: ${response.status}`, 'red');
      log(`📥 Resposta: ${JSON.stringify(responseData, null, 2)}`, 'red');
    }

    return { success: response.ok, status: response.status, data: responseData };
  } catch (error) {
    log(`❌ Erro ao testar webhook: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

/**
 * Teste do endpoint de quiz submit
 */
async function testQuizSubmit() {
  logSection('📝 TESTE: Quiz Submit');

  const testPayload = {
    name: 'Teste Lead Quiz',
    email: 'teste-quiz@example.com',
    phone: '5511888888888',
    summary: [
      'Resposta 1: Teste',
      'Resposta 2: Teste',
      'Resposta 3: Teste',
    ],
    resultType: 'type_a',
    resultLabel: 'Resultado Tipo A',
    variationKey: 'variation1',
    variationUtm: 'variation1',
    timestamp: new Date().toISOString(),
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'teste-quiz',
    utm_term: 'teste',
    utm_content: 'teste-quiz-submit',
    gclid: 'teste-gclid-123456',
  };

  try {
    log(`🔄 Enviando requisição para ${BASE_URL}/api/quiz-submit...`, 'blue');
    log(`📦 Payload: ${JSON.stringify(testPayload, null, 2)}`, 'yellow');

    const response = await fetch(`${BASE_URL}/api/quiz-submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const responseData = await response.json();

    if (response.ok && responseData.success) {
      log('✅ Quiz submit respondido com sucesso!', 'green');
      log(`📥 Resposta: ${JSON.stringify(responseData, null, 2)}`, 'green');
      log('\n⚠️  NOTA: Verifique o Google Sheets (abas "Quiz Responses" e "Quiz Resumos") para confirmar que os dados foram salvos.', 'yellow');
    } else {
      log(`❌ Erro na resposta: ${response.status}`, 'red');
      log(`📥 Resposta: ${JSON.stringify(responseData, null, 2)}`, 'red');
    }

    return { success: response.ok && responseData.success, status: response.status, data: responseData };
  } catch (error) {
    log(`❌ Erro ao testar quiz submit: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

/**
 * Teste de conectividade básica
 */
async function testConnectivity() {
  logSection('🔌 TESTE: Conectividade');

  try {
    log(`🔄 Testando GET em ${BASE_URL}/api/tintim-webhook...`, 'blue');
    const response = await fetch(`${BASE_URL}/api/tintim-webhook`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      log('✅ Endpoint acessível!', 'green');
      log(`📥 Resposta: ${JSON.stringify(data, null, 2)}`, 'green');
      return true;
    } else {
      log(`⚠️  Endpoint respondeu com status ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erro de conectividade: ${error.message}`, 'red');
    log(`💡 Certifique-se de que o servidor Next.js está rodando em ${BASE_URL}`, 'yellow');
    return false;
  }
}

/**
 * Função principal
 */
async function main() {
  console.clear();
  log('\n🧪 TESTE DE LEADS QUALIFICADOS', 'bright');
  log(`🌐 Base URL: ${BASE_URL}\n`, 'blue');

  const results = {
    connectivity: false,
    tintimWebhook: false,
    quizSubmit: false,
  };

  // Teste 1: Conectividade
  results.connectivity = await testConnectivity();

  if (!results.connectivity) {
    log('\n❌ Teste de conectividade falhou. Abortando outros testes.', 'red');
    log('\n💡 DICA: Execute "npm run dev" para iniciar o servidor de desenvolvimento.', 'yellow');
    process.exit(1);
  }

  // Aguardar um pouco entre os testes
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Teste 2: Tintim Webhook
  const tintimResult = await testTintimWebhook();
  results.tintimWebhook = tintimResult.success;

  // Aguardar um pouco entre os testes
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Teste 3: Quiz Submit
  const quizResult = await testQuizSubmit();
  results.quizSubmit = quizResult.success;

  // Resumo final
  logSection('📊 RESUMO DOS TESTES');

  log(`🔌 Conectividade: ${results.connectivity ? '✅ PASSOU' : '❌ FALHOU'}`, results.connectivity ? 'green' : 'red');
  log(`📱 Tintim Webhook: ${results.tintimWebhook ? '✅ PASSOU' : '❌ FALHOU'}`, results.tintimWebhook ? 'green' : 'red');
  log(`📝 Quiz Submit: ${results.quizSubmit ? '✅ PASSOU' : '❌ FALHOU'}`, results.quizSubmit ? 'green' : 'red');

  const allPassed = Object.values(results).every((r) => r === true);

  if (allPassed) {
    log('\n🎉 Todos os testes passaram!', 'green');
    log('\n⚠️  LEMBRE-SE: Verifique o Google Sheets para confirmar que os dados foram salvos corretamente.', 'yellow');
  } else {
    log('\n⚠️  Alguns testes falharam. Verifique os logs acima para mais detalhes.', 'yellow');
  }

  log('\n');
}

// Executar
main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
