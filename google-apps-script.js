/**
 * Google Apps Script para receber dados do quiz e salvar no Google Sheets
 * 
 * INSTRUÇÕES:
 * 1. Acesse https://script.google.com
 * 2. Crie um novo projeto
 * 3. Cole este código
 * 4. Substitua 'SEU_SPREADSHEET_ID' pelo ID da sua planilha
 * 5. Vá em "Implantar" > "Nova implantação" > "Tipo: Aplicativo da Web"
 * 6. Execute como: "Eu"
 * 7. Quem tem acesso: "Qualquer pessoa"
 * 8. Copie a URL gerada e adicione como variável de ambiente GOOGLE_SCRIPT_URL
 */

function doPost(e) {
  try {
    // ID da sua planilha do Google Sheets
    const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID'; // SUBSTITUA AQUI
    
    // Nome da aba onde os dados serão salvos
    const SHEET_NAME = 'Quiz Responses';
    
    // Obter a planilha
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // Se a aba não existir, criar
    if (!sheet) {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      // Adicionar cabeçalhos
      newSheet.getRange(1, 1, 1, 9).setValues([[
        'Timestamp',
        'Nome',
        'Email',
        'Telefone',
        'Resultado',
        'Tipo Resultado',
        'Variação',
        'Variação Key',
        'Resumo'
      ]]);
      newSheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Sheet created' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Preparar linha para inserir
    const row = [
      data.timestamp || new Date().toLocaleString('pt-BR'),
      data.nome || '',
      data.email || '',
      data.telefone || '',
      data.resultado || '',
      data.tipoResultado || '',
      data.variacao || '',
      data.variacaoKey || '',
      data.resumo || ''
    ];
    
    // Adicionar linha na planilha
    sheet.appendRow(row);
    
    // Retornar sucesso
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Dados salvos com sucesso' 
    }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar erro
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para testar o script (opcional)
 */
function testDoPost() {
  const mockData = {
    timestamp: new Date().toLocaleString('pt-BR'),
    nome: 'Teste',
    email: 'teste@example.com',
    telefone: '(00) 00000-0000',
    resultado: 'Mulher 40+ / Tríade',
    tipoResultado: 'triad',
    variacao: 'A',
    variacaoKey: 'a',
    resumo: 'Teste de resumo'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(mockData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

