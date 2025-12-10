import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * Interface para dados recebidos do Tintim via webhook
 */
interface TintimWebhookPayload {
  event: string;
  timestamp?: string;
  contact?: {
    phone: string;
    name?: string;
    email?: string;
  };
  message?: {
    text: string;
    timestamp?: string;
  };
  link_id?: string;
  // Campos de UTM que o Tintim pode enviar
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  // URL de referência (pode conter UTMs)
  referrer?: string;
  source_url?: string;
  // Outros campos que o Tintim pode enviar
  [key: string]: any;
}

/**
 * Mapeamento de link_id para funnel
 */
const FUNNEL_MAP: Record<string, string> = {
  '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf': 'lipedema',
  'e51943c9-7a5f-45ce-9c5e-b67996047881': 'lipedema-direto',
  '49a1ace3-3239-4e38-b9a9-95009cf50efd': 'jejum-hormonal',
  '86f4d522-0c48-4f0e-a861-83d7d89de2a0': 'jejum-hormonal-direto',
};

/**
 * Identificar funnel baseado no link_id
 */
function identifyFunnel(linkId?: string): string {
  if (!linkId) return 'desconhecido';
  return FUNNEL_MAP[linkId] || 'desconhecido';
}

/**
 * Extrair UTMs de uma URL
 */
function extractUTMsFromUrl(url?: string): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
} {
  if (!url) return {};
  
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined,
      fbclid: params.get('fbclid') || undefined,
      gclid: params.get('gclid') || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Salvar lead qualificado no Google Sheets
 */
async function saveLeadToSheet(data: {
  timestamp: string;
  name: string;
  phone: string;
  message: string;
  funnel: string;
  linkId: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
}) {
  try {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      console.error('❌ Variáveis de ambiente do Google Sheets não configuradas');
      return { success: false, error: 'Configuração faltando' };
    }

    // Processar chave privada
    if (PRIVATE_KEY) {
      PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
    }

    // Autenticar com Service Account
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const SHEET_NAME = 'Leads Qualificados';

    // Cabeçalhos esperados
    const EXPECTED_HEADERS = [
      'Timestamp',
      'Nome',
      'Telefone',
      'Mensagem',
      'Funnel',
      'Link ID',
      'Status',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Term',
      'UTM Content',
      'FB Click ID',
      'Google Click ID',
    ];

    // Verificar se a aba existe, se não, criar
    let sheetExists = false;
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
      });
      sheetExists = true;
    } catch (error: any) {
      // Aba não existe, criar
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                },
              },
            },
          ],
        },
      });
      sheetExists = true;
    }

    // Verificar e atualizar cabeçalhos se necessário
    if (sheetExists) {
      try {
        // Buscar cabeçalhos atuais
        const headersResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1:Z1`,
        });

        const currentHeaders = headersResponse.data.values?.[0] || [];

        // Verificar se os cabeçalhos estão corretos
        const headersMatch = 
          currentHeaders.length === EXPECTED_HEADERS.length &&
          EXPECTED_HEADERS.every((header, index) => currentHeaders[index] === header);

        if (!headersMatch) {
          console.log('📋 Atualizando cabeçalhos da planilha...');
          // Atualizar cabeçalhos
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1:O1`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [EXPECTED_HEADERS],
            },
          });
          console.log('✅ Cabeçalhos atualizados');
        }
      } catch (error) {
        console.error('❌ Erro ao verificar/atualizar cabeçalhos:', error);
        // Se der erro, tentar criar cabeçalhos mesmo assim
        try {
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1:O1`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [EXPECTED_HEADERS],
            },
          });
        } catch (createError) {
          console.error('❌ Erro ao criar cabeçalhos:', createError);
        }
      }
    }

    // Preparar dados para inserir
    const row = [
      data.timestamp,
      data.name,
      data.phone,
      data.message,
      data.funnel,
      data.linkId,
      'Mensagem Enviada',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || '',
      data.utm_term || '',
      data.utm_content || '',
      data.fbclid || '',
      data.gclid || '',
    ];

    // Inserir dados
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:O`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log('✅ Lead qualificado salvo no Google Sheets:', data);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao salvar lead no Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Enviar evento lead para VTurb
 * Nota: Esta função pode ser chamada pelo n8n ou você pode implementar a chamada direta aqui
 */
async function sendToVTurb(data: {
  phone: string;
  name: string;
  funnel: string;
  linkId: string;
  message: string;
}) {
  // Se você tiver uma API do VTurb, implemente aqui
  // Por enquanto, retornamos os dados para o n8n processar
  console.log('📤 Dados para VTurb:', data);
  return { success: true, data };
}

/**
 * Suporte a CORS para webhooks
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Processar webhook em background
 */
async function processWebhook(body: TintimWebhookPayload) {
  try {

    console.log('📥 Webhook recebido do Tintim:', {
      event: body.event,
      hasContact: !!body.contact,
      hasMessage: !!body.message,
      linkId: body.link_id,
    });

    // Se for um teste de validação do Tintim (sem dados), apenas confirmar
    if (!body.event && !body.contact && !body.message) {
      console.log('✅ Teste de validação do Tintim recebido');
      return;
    }

    // Validar que é uma mensagem recebida
    if (body.event !== 'message_received' && body.event !== 'new_message') {
      console.log('⚠️ Evento ignorado:', body.event);
      return;
    }

    // Validar dados obrigatórios
    if (!body.contact?.phone || !body.message?.text) {
      console.error('❌ Dados obrigatórios faltando');
      return;
    }

    // Identificar funnel
    const funnel = identifyFunnel(body.link_id);

    // Extrair UTMs (prioridade: payload direto > URL de referência)
    let utms = {
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_term: body.utm_term,
      utm_content: body.utm_content,
      fbclid: body.fbclid,
      gclid: body.gclid,
    };

    // Se não tiver UTMs no payload, tentar extrair da URL de referência
    if (!utms.utm_source && (body.referrer || body.source_url)) {
      const utmsFromUrl = extractUTMsFromUrl(body.referrer || body.source_url);
      utms = { ...utms, ...utmsFromUrl };
    }

    // Preparar dados
    const leadData = {
      timestamp: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
      name: body.contact.name || 'Não informado',
      phone: body.contact.phone,
      message: body.message.text,
      funnel: funnel,
      linkId: body.link_id || 'desconhecido',
      ...utms,
    };

    // Salvar no Google Sheets (em background)
    await saveLeadToSheet(leadData);

    console.log('✅ Lead processado com sucesso:', leadData);
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook do Tintim:', error);
  }
}

/**
 * Endpoint POST para receber webhook do Tintim
 * Retorna 200 OK imediatamente e processa em background
 */
export async function POST(request: NextRequest) {
  try {
    // Ler o body antes de processar em background
    const body: TintimWebhookPayload = await request.json();

    // Retornar 200 OK imediatamente (antes de processar)
    const response = NextResponse.json({
      success: true,
      message: 'Webhook recebido',
    });

    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Processar em background (não bloquear a resposta)
    processWebhook(body).catch((error) => {
      console.error('❌ Erro ao processar webhook em background:', error);
    });

    return response;
  } catch (error: any) {
    console.error('❌ Erro ao processar requisição POST:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao processar requisição', error: error.message },
      { status: 400 }
    );
  }
}

/**
 * Endpoint GET para testar o webhook
 */
export async function GET() {
  return NextResponse.json({
    message: 'Webhook do Tintim está funcionando',
    endpoint: '/api/tintim-webhook',
    method: 'POST',
    expectedPayload: {
      event: 'message_received',
      contact: {
        phone: '5511999999999',
        name: 'João Silva',
      },
      message: {
        text: 'Olá, quero saber mais',
      },
      link_id: '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf',
    },
  });
}

