#!/usr/bin/env node

/**
 * Teste simples e direto para verificar envio de leads qualificados
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

console.log('\n🧪 TESTE SIMPLES DE LEADS QUALIFICADOS\n');
console.log(`🌐 Base URL: ${BASE_URL}\n`);

// Teste 1: Webhook Tintim
async function testTintimWebhook() {
  console.log('📱 Testando Webhook Tintim...');
  
  const payload = {
    event: 'message_received',
    contact: {
      phone: '5511999999999',
      name: 'Teste Lead Qualificado',
    },
    message: {
      text: 'Olá, quero saber mais sobre o tratamento',
    },
    link_id: '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf',
    utm_source: 'facebook',
    utm_medium: 'social',
    utm_campaign: 'teste-leads-qualificados',
  };

  try {
    const response = await fetch(`${BASE_URL}/api/tintim-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook Tintim: SUCESSO');
      console.log(`   Status: ${response.status}`);
      console.log(`   Resposta: ${JSON.stringify(data)}`);
      return true;
    } else {
      console.log('❌ Webhook Tintim: FALHOU');
      console.log(`   Status: ${response.status}`);
      console.log(`   Erro: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Webhook Tintim: ERRO DE CONEXÃO');
    console.log(`   Erro: ${error.message}`);
    return false;
  }
}

// Teste 2: Quiz Submit
async function testQuizSubmit() {
  console.log('\n📝 Testando Quiz Submit...');
  
  const payload = {
    name: 'Teste Lead Quiz',
    email: 'teste-quiz@example.com',
    phone: '5511888888888',
    summary: ['Resposta 1: Teste', 'Resposta 2: Teste'],
    resultType: 'type_a',
    resultLabel: 'Resultado Tipo A',
    variationKey: 'variation1',
    variationUtm: 'variation1',
    timestamp: new Date().toISOString(),
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'teste-quiz',
  };

  try {
    const response = await fetch(`${BASE_URL}/api/quiz-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Quiz Submit: SUCESSO');
      console.log(`   Status: ${response.status}`);
      console.log(`   Resposta: ${JSON.stringify(data)}`);
      return true;
    } else {
      console.log('❌ Quiz Submit: FALHOU');
      console.log(`   Status: ${response.status}`);
      console.log(`   Erro: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Quiz Submit: ERRO DE CONEXÃO');
    console.log(`   Erro: ${error.message}`);
    return false;
  }
}

// Executar testes
async function main() {
  const tintimResult = await testTintimWebhook();
  const quizResult = await testQuizSubmit();

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(60));
  console.log(`📱 Webhook Tintim: ${tintimResult ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`📝 Quiz Submit: ${quizResult ? '✅ PASSOU' : '❌ FALHOU'}`);
  
  if (tintimResult && quizResult) {
    console.log('\n🎉 Todos os testes passaram!');
    console.log('\n⚠️  IMPORTANTE: Verifique o Google Sheets para confirmar que os dados foram salvos.');
  } else {
    console.log('\n⚠️  Alguns testes falharam.');
    console.log('\n💡 DICAS:');
    console.log('   1. Certifique-se de que o servidor está rodando: npm run dev');
    console.log('   2. Verifique se as variáveis de ambiente estão configuradas');
    console.log('   3. Verifique os logs do servidor para mais detalhes');
  }
  console.log('\n');
}

main().catch(console.error);
