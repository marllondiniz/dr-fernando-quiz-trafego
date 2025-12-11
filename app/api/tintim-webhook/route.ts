import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

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

async function saveLeadToSheet(data: any) {
  const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Missing Google Sheets environment variables');
  }

  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const SHEET_NAME = 'Leads Qualificados';
  const HEADERS = [
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

  try {
    // Ensure sheet exists with proper headers
    await ensureSheetSetup(sheets, SPREADSHEET_ID, SHEET_NAME, HEADERS);

    // Append lead data
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

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:N`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });

    return {
      success: true,
      message: 'Lead saved successfully',
      updatedRange: response.data.updates?.updatedRange,
    };
  } catch (error: any) {
    if (error.code === 403) {
      throw new Error(
        `Permission denied. Share spreadsheet with: ${SERVICE_ACCOUNT_EMAIL}`
      );
    }
    if (error.code === 404) {
      throw new Error(`Spreadsheet not found: ${SPREADSHEET_ID}`);
    }
    throw error;
  }
}

async function ensureSheetSetup(
  sheets: any,
  spreadsheetId: string,
  sheetName: string,
  headers: string[]
) {
  // Check if sheet exists
  const sheetExists = await checkSheetExists(sheets, spreadsheetId, sheetName);

  if (!sheetExists) {
    await createSheet(sheets, spreadsheetId, sheetName);
  }

  // Set headers if missing or incorrect
  await ensureHeaders(sheets, spreadsheetId, sheetName, headers);
}

async function checkSheetExists(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
): Promise<boolean> {
  try {
    await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1`,
    });
    return true;
  } catch {
    return false;
  }
}

async function createSheet(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: sheetName } } }],
    },
  });
}

async function ensureHeaders(
  sheets: any,
  spreadsheetId: string,
  sheetName: string,
  expectedHeaders: string[]
) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z1`,
    });

    const currentHeaders = response.data.values?.[0] || [];
    const headersMatch =
      currentHeaders.length === expectedHeaders.length &&
      expectedHeaders.every((h, i) => currentHeaders[i] === h);

    if (headersMatch) return;
  } catch {
    // No headers exist, will create below
  }

  const endColumn = String.fromCharCode(64 + expectedHeaders.length); // A=65, so N=78
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1:${endColumn}1`,
    valueInputOption: 'RAW',
    requestBody: { values: [expectedHeaders] },
  });

  const sheetId = await getSheetId(sheets, spreadsheetId, sheetName);
  if (sheetId !== null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: { textFormat: { bold: true } },
              },
              fields: 'userEnteredFormat.textFormat.bold',
            },
          },
        ],
      },
    });
  }
}

function extractDataFromWebhook(body: any) {
  const phone = body.lead?.phone;
  const name = body.lead?.name;
  const messageText = body.message;
  const funnel = body.lead?.visit?.name;
  let linkId = '';

  if (funnel) {
    const funnelToLinkId: Record<string, string> = {
      'lipedema (quiz)': '855a2f73-2af0-445f-aaa2-6e5d42a4a6bf',
      'jejum-hormonal-direto (Direto — tráfego direto)': '86f4d522-0c48-4f0e-a861-83d7d89de2a0',
      'jejum-hormonal (Quiz — vem do quiz)': '49a1ace3-3239-4e38-b9a9-95009cf50efd',
      'lipedema-direto (Direto — tráfego direto)': 'e51943c9-7a5f-45ce-9c5e-b67996047881',
    };

    linkId = funnelToLinkId[funnel.toLowerCase()] || linkId;
  }

  const utms = {
    utm_source: body.lead?.utm_source,
    utm_medium: body.lead?.utm_medium,
    utm_campaign: body.lead?.utm_campaign,
    utm_term: body.lead?.utm_term,
    utm_content: body.lead?.utm_content,
    fbclid: body.lead?.fbclid,
    gclid: body.lead?.gclid,
  };

  const isMessageSent = body.from_me === false && body.event_type === "message.create";

  return { phone, name, messageText, funnel, linkId, utms, isMessageSent };
}

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();

    const { phone, name, messageText, funnel, linkId, utms, isMessageSent } = extractDataFromWebhook(body);

    const payload = {
      timestamp: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
      name: name || 'Não informado',
      phone,
      message: messageText,
      funnel: funnel,
      linkId: linkId || 'desconhecido',
      status: isMessageSent ? 'Mensagem Recebida' : "Evento não mapeado",
      ...utms,
    }

    const saveToSheetResponse = await saveLeadToSheet(payload);

    return NextResponse.json(saveToSheetResponse, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Erro ao processar requisição', error: error.message },
      { status: 400 }
    );
  }
}
