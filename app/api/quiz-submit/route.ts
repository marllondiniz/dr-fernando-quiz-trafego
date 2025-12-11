import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

interface QuizSubmitPayload {
  name: string;
  email: string;
  phone: string;
  summary: string[];
  resultType: string;
  resultLabel: string;
  variationKey: string;
  variationUtm: string;
  timestamp: string;
  // Campos de UTM
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
}

// Função auxiliar para obter o ID da aba
async function getSheetId(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
): Promise<number> {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    const sheet = response.data.sheets?.find((s: any) => s.properties?.title === sheetName);
    return sheet?.properties?.sheetId || 0;
  } catch {
    return 0;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: QuizSubmitPayload = await request.json();
    console.log('body aqui teste euuuuuuuuu', body);
    console.log('📥 Recebendo dados do quiz:', { 
      name: body.name, 
      email: body.email, 
      phone: body.phone,
      resultType: body.resultType 
    });

    // Validar dados obrigatórios
    if (!body.name || !body.email || !body.phone) {
      console.error('❌ Dados obrigatórios faltando');
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    
    // Processar a chave privada - lidar com diferentes formatos
    let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
    
    if (PRIVATE_KEY) {
      // Se a chave contém \n literal (string), substituir por quebra de linha real
      PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
      
      // Se a chave não começa com -----BEGIN, pode estar faltando quebras de linha
      if (!PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('❌ Formato de chave privada inválido');
        return NextResponse.json({ 
          success: false, 
          message: 'Formato de chave privada inválido' 
        }, { status: 500 });
      }
    }

    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      console.error('❌ Variáveis de ambiente do Google Sheets não configuradas:', {
        hasSpreadsheetId: !!SPREADSHEET_ID,
        hasServiceAccountEmail: !!SERVICE_ACCOUNT_EMAIL,
        hasPrivateKey: !!PRIVATE_KEY,
        privateKeyLength: PRIVATE_KEY?.length || 0,
        privateKeyStartsWith: PRIVATE_KEY?.substring(0, 30) || 'N/A'
      });
      return NextResponse.json({ success: false, message: 'Configuração faltando' }, { status: 500 });
    }

    console.log('✅ Variáveis de ambiente configuradas');

    // Autenticar com Service Account
    console.log('🔐 Autenticando com Google Sheets API...');
    console.log('📧 Service Account:', SERVICE_ACCOUNT_EMAIL);
    console.log('📊 Spreadsheet ID:', SPREADSHEET_ID);
    
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Testar autenticação
    try {
      const token = await auth.getAccessToken();
      console.log('✅ Token obtido com sucesso');
    } catch (authError: any) {
      console.error('❌ ERRO NA AUTENTICAÇÃO:', authError.message);
      console.error('Código:', authError.code);
      throw new Error(`Falha na autenticação: ${authError.message}`);
    }

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Cliente Sheets criado');

    // Nome das abas
    const SHEET_NAME = 'Quiz Responses';
    const RESUMOS_SHEET_NAME = 'Quiz Resumos';
    
    // Cabeçalhos esperados (sem Resumo - será em aba separada)
    const EXPECTED_HEADERS = [
      'Timestamp',
      'Nome',
      'Email',
      'Telefone',
      'Resultado',
      'Tipo Resultado',
      'Variação',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Term',
      'UTM Content',
      'FB Click ID',
      'Google Click ID'
    ];
    
    // Cabeçalhos da aba de resumos
    const RESUMOS_HEADERS = [
      'Timestamp',
      'Email',
      'Nome',
      'Resumo'
    ];

    // Verificar se a aba existe, se não, criar
    console.log(`📋 Verificando se a aba "${SHEET_NAME}" existe...`);
    let sheetExists = false;
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
      });
      console.log('✅ Aba já existe');
      sheetExists = true;
    } catch (error: any) {
      console.log('⚠️ Aba não existe, criando...', error.message);
      // Criar a aba se não existir
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
        console.log('📋 Cabeçalhos atuais:', currentHeaders);
        console.log('📋 Cabeçalhos esperados:', EXPECTED_HEADERS);
        
        // Verificar se os cabeçalhos estão exatamente corretos
        // Comparar apenas as primeiras 14 colunas (A-N) para evitar problemas com colunas extras
        const currentHeadersTrimmed = currentHeaders.slice(0, EXPECTED_HEADERS.length);
        const needsUpdate = currentHeadersTrimmed.length !== EXPECTED_HEADERS.length || 
                           !EXPECTED_HEADERS.every((header, index) => currentHeadersTrimmed[index] === header);
        
        if (needsUpdate) {
          console.log('⚠️ Cabeçalhos incorretos ou incompletos, atualizando...');
          // Limpar colunas extras primeiro (se houver mais de 14 colunas)
          if (currentHeaders.length > EXPECTED_HEADERS.length) {
            console.log(`⚠️ Detectadas ${currentHeaders.length} colunas, limpando colunas extras (O em diante)...`);
          // Limpar colunas O em diante (coluna 15+)
            await sheets.spreadsheets.values.clear({
              spreadsheetId: SPREADSHEET_ID,
              range: `${SHEET_NAME}!O1:Z1`,
            });
          }
          // Atualizar cabeçalhos exatamente como esperado (14 colunas: A-N)
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1:N1`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [EXPECTED_HEADERS],
            },
          });
          console.log('✅ Cabeçalhos atualizados com sucesso!');
          
          // Formatar cabeçalhos em negrito
          const sheetId = await getSheetId(sheets, SPREADSHEET_ID, SHEET_NAME);
          if (sheetId) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: SPREADSHEET_ID,
              requestBody: {
                requests: [
                  {
                    repeatCell: {
                      range: {
                        sheetId: sheetId,
                        startRowIndex: 0,
                        endRowIndex: 1,
                      },
                      cell: {
                        userEnteredFormat: {
                          textFormat: {
                            bold: true,
                          },
                        },
                      },
                      fields: 'userEnteredFormat.textFormat.bold',
                    },
                  },
                ],
              },
            });
          }
        } else {
          console.log('✅ Cabeçalhos já estão completos');
        }
      } catch (error: any) {
        console.log('⚠️ Erro ao verificar cabeçalhos, tentando criar...', error.message);
        // Se der erro, tentar criar os cabeçalhos
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1:N1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [EXPECTED_HEADERS],
          },
        });
      }
    } else {
      // Se acabou de criar a aba, adicionar cabeçalhos
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:N1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [EXPECTED_HEADERS],
        },
      });

      // Formatar cabeçalhos em negrito
      const sheetId = await getSheetId(sheets, SPREADSHEET_ID, SHEET_NAME);
      if (sheetId) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: {
                        bold: true,
                      },
                    },
                  },
                  fields: 'userEnteredFormat.textFormat.bold',
                },
              },
            ],
          },
        });
      }
    }

    // Preparar dados para inserir (sem Resumo - será em aba separada)
    const row = [
      new Date().toLocaleString('pt-BR'),
      body.name,
      body.email,
      body.phone,
      body.resultLabel,
      body.resultType,
      body.variationUtm,
      // Adicionar UTMs
      body.utm_source || '',
      body.utm_medium || '',
      body.utm_campaign || '',
      body.utm_term || '',
      body.utm_content || '',
      body.fbclid || '',
      body.gclid || '',
    ];
    
    // Preparar dados do resumo para aba separada
    const resumoRow = [
      new Date().toLocaleString('pt-BR'),
      body.email,
      body.name,
      body.summary.join(' | '),
    ];

    // Criar/verificar aba de resumos
    console.log(`📋 Verificando se a aba "${RESUMOS_SHEET_NAME}" existe...`);
    let resumosSheetExists = false;
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${RESUMOS_SHEET_NAME}!A1`,
      });
      console.log('✅ Aba de resumos já existe');
      resumosSheetExists = true;
    } catch (error: any) {
      console.log('⚠️ Aba de resumos não existe, criando...', error.message);
      // Criar a aba de resumos se não existir
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: RESUMOS_SHEET_NAME,
                },
              },
            },
          ],
        },
      });
      resumosSheetExists = true;
    }

    // Verificar/criar cabeçalhos da aba de resumos
    if (resumosSheetExists) {
      try {
        const resumosHeadersResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${RESUMOS_SHEET_NAME}!A1:Z1`,
        });
        const currentResumosHeaders = resumosHeadersResponse.data.values?.[0] || [];
        const needsResumosUpdate = currentResumosHeaders.length !== RESUMOS_HEADERS.length || 
                                  !RESUMOS_HEADERS.every((header, index) => currentResumosHeaders[index] === header);
        
        if (needsResumosUpdate) {
          console.log('⚠️ Cabeçalhos da aba de resumos incorretos, atualizando...');
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${RESUMOS_SHEET_NAME}!A1:D1`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [RESUMOS_HEADERS],
            },
          });
          
          // Formatar cabeçalhos em negrito
          const resumosSheetId = await getSheetId(sheets, SPREADSHEET_ID, RESUMOS_SHEET_NAME);
          if (resumosSheetId) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: SPREADSHEET_ID,
              requestBody: {
                requests: [
                  {
                    repeatCell: {
                      range: {
                        sheetId: resumosSheetId,
                        startRowIndex: 0,
                        endRowIndex: 1,
                      },
                      cell: {
                        userEnteredFormat: {
                          textFormat: {
                            bold: true,
                          },
                        },
                      },
                      fields: 'userEnteredFormat.textFormat.bold',
                    },
                  },
                ],
              },
            });
          }
          console.log('✅ Cabeçalhos da aba de resumos atualizados!');
        }
      } catch (error: any) {
        console.log('⚠️ Erro ao verificar cabeçalhos de resumos, criando...', error.message);
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${RESUMOS_SHEET_NAME}!A1:D1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [RESUMOS_HEADERS],
          },
        });
      }
    } else {
      // Se acabou de criar a aba de resumos, adicionar cabeçalhos
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${RESUMOS_SHEET_NAME}!A1:D1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [RESUMOS_HEADERS],
        },
      });
      
      // Formatar cabeçalhos em negrito
      const resumosSheetId = await getSheetId(sheets, SPREADSHEET_ID, RESUMOS_SHEET_NAME);
      if (resumosSheetId) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: resumosSheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: {
                        bold: true,
                      },
                    },
                  },
                  fields: 'userEnteredFormat.textFormat.bold',
                },
              },
            ],
          },
        });
      }
    }

    // Adicionar linha na planilha principal
    console.log('📝 Adicionando dados na planilha principal...');
    console.log('📊 Spreadsheet ID:', SPREADSHEET_ID);
    console.log('📋 Sheet Name:', SHEET_NAME);
    console.log('📄 Dados:', row);

    try {
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:N`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
      
      console.log('✅ Dados salvos na planilha principal!');
      
      // Adicionar resumo na aba separada
      console.log('📝 Adicionando resumo na aba separada...');
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${RESUMOS_SHEET_NAME}!A:D`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [resumoRow],
        },
      });
      
      console.log('✅ Resumo salvo na aba separada!');
      console.log('✅ Resposta do Google Sheets:', JSON.stringify(appendResponse.data, null, 2));
      console.log('✅ Todos os dados salvos com sucesso!');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Dados enviados com sucesso',
        updatedRange: appendResponse.data.updates?.updatedRange 
      });
    } catch (appendError: any) {
      console.error('❌ ERRO AO SALVAR NA PLANILHA:');
      console.error('Mensagem:', appendError.message);
      console.error('Código:', appendError.code);
      console.error('Detalhes:', appendError.response?.data);
      
      // Erro específico de permissão
      if (appendError.code === 403 || appendError.message?.includes('permission')) {
        throw new Error(`ERRO DE PERMISSÃO: A planilha não foi compartilhada com ${SERVICE_ACCOUNT_EMAIL}. Compartilhe a planilha com este email e dê permissão de Editor.`);
      }
      
      // Erro de planilha não encontrada
      if (appendError.code === 404) {
        throw new Error(`PLANILHA NÃO ENCONTRADA: Verifique se o ID da planilha está correto: ${SPREADSHEET_ID}`);
      }
      
      throw appendError;
    }
  } catch (error: any) {
    console.error('❌ Erro ao processar requisição:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao salvar dados',
      error: error.message 
    }, { status: 500 });
  }
}

