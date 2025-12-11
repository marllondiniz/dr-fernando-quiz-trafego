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
 * Interface para dados de conversa armazenados no cache
 */
interface ConversationCache {
  phone: string;
  name?: string;
  linkId?: string;
  utms?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    fbclid?: string;
    gclid?: string;
  };
  timestamp: number;
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
 * Cache em memória para armazenar dados de conversas
 * Chave: link_id (ou 'unknown' se não houver)
 * Valor: dados da conversa
 * Expira após 1 hora (3600000ms)
 */
const conversationCache = new Map<string, ConversationCache>();
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hora

/**
 * Limpar cache expirado
 */
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of conversationCache.entries()) {
    if (now - value.timestamp > CACHE_EXPIRY_MS) {
      conversationCache.delete(key);
    }
  }
}

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
  status?: string;
}) {
  try {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    console.log('🔧 Verificando variáveis de ambiente...');
    console.log('📋 SPREADSHEET_ID:', SPREADSHEET_ID ? `${SPREADSHEET_ID.substring(0, 10)}...` : 'NÃO CONFIGURADO');
    console.log('📋 SERVICE_ACCOUNT_EMAIL:', SERVICE_ACCOUNT_EMAIL || 'NÃO CONFIGURADO');
    console.log('📋 PRIVATE_KEY:', PRIVATE_KEY ? `${PRIVATE_KEY.substring(0, 20)}...` : 'NÃO CONFIGURADO');

    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      console.error('❌ Variáveis de ambiente do Google Sheets não configuradas');
      const missing = [];
      if (!SPREADSHEET_ID) missing.push('GOOGLE_SHEETS_SPREADSHEET_ID');
      if (!SERVICE_ACCOUNT_EMAIL) missing.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
      if (!PRIVATE_KEY) missing.push('GOOGLE_PRIVATE_KEY');
      console.error('📋 Variáveis faltando:', missing.join(', '));
      return { success: false, error: `Configuração faltando: ${missing.join(', ')}` };
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
      data.status || 'Mensagem Enviada',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || '',
      data.utm_term || '',
      data.utm_content || '',
      data.fbclid || '',
      data.gclid || '',
    ];

    // Inserir dados
    console.log('📝 Inserindo linha na planilha...');
    console.log('📋 Range:', `${SHEET_NAME}!A:O`);
    console.log('📋 Row preview:', row.slice(0, 7).join(' | '));
    
    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:O`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log('✅ Lead qualificado salvo no Google Sheets');
    console.log('📋 Response:', JSON.stringify(appendResult.data, null, 2));
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao salvar lead no Google Sheets:');
    console.error('📋 Error message:', error.message);
    console.error('📋 Error code:', error.code);
    console.error('📋 Error response:', error.response?.data);
    console.error('📋 Stack trace:', error.stack);
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      details: error.response?.data 
    };
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
    // Limpar cache expirado periodicamente
    cleanExpiredCache();

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

    // Extrair dados de forma flexível (o Tintim pode enviar em diferentes formatos)
    // PRIORIZAR estrutura real do Tintim: lead.phone, lead.name, message como string direta
    const bodyAny = body as any;
    
    // Extrair telefone - PRIORIZAR lead.phone e lead.phone_e164
    let phone = bodyAny.lead?.phone || 
                (bodyAny.lead?.phone_e164?.replace(/\+/g, '') || null) ||
                body.contact?.phone || 
                bodyAny.phone || 
                bodyAny.from || 
                bodyAny.sender?.phone ||
                bodyAny.conversation?.contact?.phone ||
                bodyAny.conversation?.phone ||
                bodyAny.contact_phone ||
                bodyAny.whatsapp_number ||
                bodyAny.wa_id ||
                bodyAny.message?.from ||
                bodyAny.message?.contact?.phone ||
                bodyAny.data?.phone ||
                bodyAny.data?.contact?.phone;
    
    // Extrair nome - PRIORIZAR lead.name
    let name = bodyAny.lead?.name || 
               body.contact?.name || 
               bodyAny.name || 
               bodyAny.sender?.name ||
               bodyAny.conversation?.contact?.name ||
               bodyAny.conversation?.name ||
               bodyAny.contact_name ||
               bodyAny.message?.contact?.name ||
               bodyAny.data?.name ||
               bodyAny.data?.contact?.name;
    
    // Extrair mensagem - PRIORIZAR message como string direta (estrutura real do Tintim)
    const messageText = (typeof bodyAny.message === 'string' ? bodyAny.message : null) ||
                        body.message?.text || 
                        bodyAny.text || 
                        bodyAny.message?.body ||
                        bodyAny.body ||
                        bodyAny.content ||
                        bodyAny.message?.content ||
                        bodyAny.data?.message ||
                        bodyAny.data?.text;
    
    // Extrair linkId - tentar mapear visit.name para linkId conhecido
    let linkId = body.link_id || 
                 bodyAny.linkId || 
                 bodyAny.link_id ||
                 bodyAny.conversation?.link_id ||
                 bodyAny.conversation?.linkId ||
                 bodyAny.link ||
                 bodyAny.data?.link_id;
    
    // Mapear visit.name para linkId conhecido (ex: "lipedema (quiz)" -> linkId do quiz)
    const visitName = bodyAny.lead?.visit?.name;
    if (!linkId && visitName) {
      // Mapear nomes de visitas conhecidas para linkIds
      const visitNameToLinkId: Record<string, string> = {
        'lipedema (quiz)': '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf',
        // Adicionar outros mapeamentos conforme necessário
      };
      linkId = visitNameToLinkId[visitName.toLowerCase()] || linkId;
    }

    // Extrair UTMs do payload - PRIORIZAR lead.utm_*
    let utms = {
      utm_source: bodyAny.lead?.utm_source || body.utm_source || bodyAny.utmSource || bodyAny.utm_source,
      utm_medium: bodyAny.lead?.utm_medium || body.utm_medium || bodyAny.utmMedium || bodyAny.utm_medium,
      utm_campaign: bodyAny.lead?.utm_campaign || body.utm_campaign || bodyAny.utmCampaign || bodyAny.utm_campaign,
      utm_term: bodyAny.lead?.utm_term || body.utm_term || bodyAny.utmTerm || bodyAny.utm_term,
      utm_content: bodyAny.lead?.utm_content || body.utm_content || bodyAny.utmContent || bodyAny.utm_content,
      fbclid: bodyAny.lead?.fbclid || body.fbclid || bodyAny.fbclid,
      gclid: bodyAny.lead?.gclid || body.gclid || bodyAny.gclid,
    };

    // Se não tiver UTMs no payload, tentar extrair da URL de referência
    if (!utms.utm_source && (body.referrer || body.source_url || bodyAny.referrer || bodyAny.sourceUrl)) {
      const referrerUrl = body.referrer || body.source_url || bodyAny.referrer || bodyAny.sourceUrl;
      const utmsFromUrl = extractUTMsFromUrl(referrerUrl);
      utms = { ...utms, ...utmsFromUrl };
    }

    // Usar telefone como chave de cache também (além do linkId) para melhor matching
    const cacheKey = linkId || phone || 'unknown';
    
    // Verificar se é um evento de mensagem enviada (não apenas recebida)
    // PRIORIZAR from_me (estrutura real do Tintim)
    const isMessageSent = bodyAny.from_me === true ||
                         body.event === 'message_sent' || 
                         body.event === 'sent' || 
                         bodyAny.type === 'sent' ||
                         bodyAny.direction === 'outbound' ||
                         bodyAny.direction === 'outgoing' ||
                         bodyAny.event_type === 'message.sent';

    console.log('🔍 Tipo de evento detectado:', {
      event: body.event,
      isMessageSent,
      hasPhone: !!phone,
      hasMessage: !!messageText,
      linkId: linkId || 'não informado',
    });

    // CASO 1: Webhook de "Criação de Conversa" - tem telefone mas pode não ter mensagem
    // Armazenar no cache para usar quando chegar a mensagem
    if (phone && !messageText && !isMessageSent) {
      console.log('💾 Webhook de Criação de Conversa - armazenando dados no cache');
      conversationCache.set(cacheKey, {
        phone,
        name,
        linkId,
        utms,
        timestamp: Date.now(),
      });
      console.log(`✅ Dados de conversa armazenados no cache (chave: ${cacheKey})`);
      return; // Não processar ainda, esperar pela mensagem
    }

    // CASO 2: Webhook de "Criação de Mensagem" ou "Mensagem Enviada" - tem mensagem mas pode não ter telefone
    // Buscar telefone no cache se não estiver no payload
    if ((messageText || isMessageSent) && !phone) {
      console.log('🔍 Webhook de Mensagem - buscando telefone no cache');
      
      // Tentar buscar no cache usando linkId primeiro
      let cachedConversation = conversationCache.get(cacheKey);
      
      // Se não encontrou com a chave principal, tentar buscar por linkId em todas as entradas do cache
      if (!cachedConversation && linkId) {
        for (const [key, value] of conversationCache.entries()) {
          if (value.linkId === linkId) {
            cachedConversation = value;
            console.log(`✅ Encontrado no cache usando linkId (chave: ${key})`);
            break;
          }
        }
      }
      
      // Se ainda não encontrou, tentar buscar pela primeira entrada do cache (fallback)
      if (!cachedConversation && conversationCache.size > 0) {
        const firstEntry = Array.from(conversationCache.values())[0];
        if (firstEntry && firstEntry.phone) {
          cachedConversation = firstEntry;
          console.log(`✅ Usando primeira entrada do cache como fallback`);
        }
      }
      
      if (cachedConversation) {
        phone = cachedConversation.phone;
        name = name || cachedConversation.name;
        // Mesclar UTMs: prioridade para o payload atual (se não for undefined), depois cache
        if (cachedConversation.utms) {
          const cachedUtms = cachedConversation.utms;
          utms = {
            utm_source: utms.utm_source || cachedUtms.utm_source,
            utm_medium: utms.utm_medium || cachedUtms.utm_medium,
            utm_campaign: utms.utm_campaign || cachedUtms.utm_campaign,
            utm_term: utms.utm_term || cachedUtms.utm_term,
            utm_content: utms.utm_content || cachedUtms.utm_content,
            fbclid: utms.fbclid || cachedUtms.fbclid,
            gclid: utms.gclid || cachedUtms.gclid,
          };
        }
        // Se o linkId não estava no payload mas estava no cache, usar do cache
        if (!linkId && cachedConversation.linkId) {
          const cachedLinkId = cachedConversation.linkId;
          console.log(`✅ LinkId encontrado no cache: ${cachedLinkId}`);
        }
        console.log(`✅ Telefone encontrado no cache: ${phone}`);
      } else {
        console.error('❌ Telefone não encontrado no cache nem no payload');
        console.log('📋 Chave de cache usada:', cacheKey);
        console.log('📋 Cache atual:', Array.from(conversationCache.keys()));
        
        // Log detalhado de todas as propriedades do payload
        console.log('🔎 Buscando telefone em todas as propriedades do payload...');
        const allKeys: string[] = [];
        const getKeys = (obj: any, prefix = ''): void => {
          if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
              const fullKey = prefix ? `${prefix}.${key}` : key;
              allKeys.push(fullKey);
              if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                getKeys(obj[key], fullKey);
              }
            });
          }
        };
        getKeys(body);
        console.log('📋 Todas as chaves do payload:', allKeys.slice(0, 50));
        
        // Buscar valores que parecem telefones
        const phonePattern = /(\+?55)?\d{10,15}/;
        const findPhones = (obj: any, path = ''): string[] => {
          const phones: string[] = [];
          if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
              const fullPath = path ? `${path}.${key}` : key;
              const value = obj[key];
              if (typeof value === 'string' && phonePattern.test(value)) {
                phones.push(`${fullPath}: ${value}`);
              } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                phones.push(...findPhones(value, fullPath));
              }
            });
          }
          return phones;
        };
        const foundPhones = findPhones(body);
        if (foundPhones.length > 0) {
          console.log('📞 Possíveis telefones encontrados no payload:', foundPhones);
          // Tentar usar o primeiro telefone encontrado
          const firstPhone = foundPhones[0].split(': ')[1];
          if (firstPhone) {
            phone = firstPhone;
            console.log(`✅ Usando telefone encontrado automaticamente: ${phone}`);
          }
        }
        
        // Se ainda não tiver telefone, não processar
        if (!phone) {
          console.error('❌ Não foi possível encontrar telefone. Webhook não será processado.');
          return;
        }
      }
    }

    // CASO 3: Processar mensagens (recebidas ou enviadas)
    // IMPORTANTE: Processar também mensagens enviadas (isMessageSent) mesmo sem texto
    // Se for mensagem enviada, processar mesmo sem texto (usaremos texto padrão)
    // Se não for mensagem enviada e não tiver texto, não processar
    if (!isMessageSent && !messageText) {
      console.log('⚠️ Webhook ignorado: sem mensagem para processar');
      console.log('📋 Dados extraídos:', { phone, name, linkId, hasMessage: !!messageText, isMessageSent });
      return;
    }

    // Se ainda não tiver telefone após buscar no cache, tentar uma última busca
    if (!phone) {
      // Tentar buscar telefone em qualquer entrada do cache que tenha linkId correspondente
      if (linkId) {
        for (const [key, value] of conversationCache.entries()) {
          if (value.linkId === linkId && value.phone) {
            phone = value.phone;
            name = name || value.name;
            console.log(`✅ Telefone encontrado no cache na última tentativa (chave: ${key}): ${phone}`);
            break;
          }
        }
      }
      
      // Se ainda não tiver telefone, não processar
      if (!phone) {
        console.error('❌ Dados obrigatórios faltando: telefone não encontrado no payload nem no cache');
        console.log('💡 Verifique se o webhook de "Criação de Conversa" foi recebido antes');
        console.log('📋 Dados extraídos:', { phone, name, linkId, messageText: messageText?.substring(0, 50), isMessageSent });
        console.log('📋 Chave de cache:', cacheKey);
        console.log('📋 Cache disponível:', Array.from(conversationCache.keys()));
        return;
      }
    }
    
    // Para mensagens enviadas, usar uma mensagem padrão se não houver texto
    const finalMessageText = messageText || (isMessageSent ? 'Mensagem enviada via WhatsApp' : '');
    
    // Esta verificação não deve ser necessária agora, mas mantemos como segurança
    if (!finalMessageText) {
      console.log('⚠️ Webhook ignorado: sem mensagem para processar (caso inesperado)');
      return;
    }

    // Log dos dados extraídos antes de processar
    console.log('🔍 Dados extraídos do webhook:', {
      phone,
      name: name || 'Não informado',
      messageLength: finalMessageText?.length || 0,
      linkId: linkId || 'desconhecido',
      hasUtms: !!(utms.utm_source || utms.utm_medium || utms.utm_campaign),
      isMessageSent,
      event: body.event,
    });

    // Identificar funnel
    const funnel = identifyFunnel(linkId);
    console.log('🎯 Funnel identificado:', funnel);

    // Preparar dados
    const leadData = {
      timestamp: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
      name: name || 'Não informado',
      phone: phone,
      message: finalMessageText,
      funnel: funnel,
      linkId: linkId || 'desconhecido',
      ...utms,
    };

    console.log('💾 Tentando salvar lead no Google Sheets...');
    console.log('📋 Dados do lead:', JSON.stringify(leadData, null, 2));

    // Determinar status baseado no tipo de evento
    const status = isMessageSent ? 'Mensagem Enviada' : 'Mensagem Recebida';

    // Salvar no Google Sheets (em background)
    const saveResult = await saveLeadToSheet({
      ...leadData,
      status,
    });
    
    if (saveResult.success) {
      console.log('✅ Lead salvo com sucesso no Google Sheets');
    } else {
      console.error('❌ Erro ao salvar lead no Google Sheets:', saveResult.error);
    }

    // Limpar do cache após processar
    if (conversationCache.has(cacheKey)) {
      conversationCache.delete(cacheKey);
      console.log(`🗑️ Dados removidos do cache (chave: ${cacheKey})`);
    }

    console.log('✅ Lead processado com sucesso:', leadData);
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook do Tintim:', error);
    console.error('📋 Stack trace:', error.stack);
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

    // Log completo do payload recebido (para diagnóstico)
    console.log('PAYLOAD DO TIMTIM AQUI:', JSON.stringify(body, null, 2));

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
 * Endpoint GET para testar o webhook e diagnóstico
 */
export async function GET() {
  // Verificar variáveis de ambiente
  const hasSpreadsheetId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;
  const hasN8nUrl = !!process.env.N8N_WEBHOOK_URL;
  
  const envStatus = {
    GOOGLE_SHEETS_SPREADSHEET_ID: hasSpreadsheetId ? '✅ Configurado' : '❌ Não configurado',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: hasServiceAccount ? '✅ Configurado' : '❌ Não configurado',
    GOOGLE_PRIVATE_KEY: hasPrivateKey ? '✅ Configurado' : '❌ Não configurado',
    N8N_WEBHOOK_URL: hasN8nUrl ? '✅ Configurado' : '⚠️ Opcional',
  };
  
  // Verificar cache
  const cacheSize = conversationCache.size;
  const cacheKeys = Array.from(conversationCache.keys()).slice(0, 10);
  
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook do Tintim está funcionando',
    endpoint: '/api/tintim-webhook',
    method: 'POST',
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      variables: envStatus,
    },
    cache: {
      size: cacheSize,
      keys: cacheKeys,
    },
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
    diagnostic: {
      note: 'Envie uma requisição POST para este endpoint com os dados do webhook do Tintim',
      checkLogs: 'Verifique os logs do servidor para ver o payload completo recebido',
    },
  });
}
