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
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      console.error('❌ Variáveis de ambiente do Google Sheets não configuradas:', {
        hasSpreadsheetId: !!SPREADSHEET_ID,
        hasServiceAccountEmail: !!SERVICE_ACCOUNT_EMAIL,
        hasPrivateKey: !!PRIVATE_KEY
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

    // Nome da aba
    const SHEET_NAME = 'Quiz Responses';

    // Verificar se a aba existe, se não, criar
    console.log(`📋 Verificando se a aba "${SHEET_NAME}" existe...`);
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
      });
      console.log('✅ Aba já existe');
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

      // Adicionar cabeçalhos
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:I1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'Timestamp',
            'Nome',
            'Email',
            'Telefone',
            'Resultado',
            'Tipo Resultado',
            'Variação',
            'Variação Key',
            'Resumo'
          ]],
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

    // Preparar dados para inserir
    const row = [
      new Date().toLocaleString('pt-BR'),
      body.name,
      body.email,
      body.phone,
      body.resultLabel,
      body.resultType,
      body.variationUtm,
      body.variationKey,
      body.summary.join(' | '),
    ];

    // Adicionar linha na planilha
    console.log('📝 Adicionando dados na planilha...');
    console.log('📊 Spreadsheet ID:', SPREADSHEET_ID);
    console.log('📋 Sheet Name:', SHEET_NAME);
    console.log('📄 Dados:', row);

    try {
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:I`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
      
      console.log('✅ Resposta do Google Sheets:', JSON.stringify(appendResponse.data, null, 2));
      console.log('✅ Dados salvos com sucesso na planilha!');
      
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

