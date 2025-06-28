const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Criar diretório para QR codes se não existir
const qrDir = path.join(__dirname, 'public', 'qr');
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true });
}

// URLs para os QR codes
const qrData = {
  android: {
    url: 'https://descarte-certo.com/apps/descarte-certo-android.apk',
    filename: 'qr-android.png',
    title: 'Descarte Certo - Android'
  },
  ios: {
    url: 'https://descarte-certo.com/apps/descarte-certo-ios.ipa',
    filename: 'qr-ios.png',
    title: 'Descarte Certo - iOS'
  },
  website: {
    url: 'https://descarte-certo.com',
    filename: 'qr-website.png',
    title: 'Descarte Certo - Website'
  },
  app: {
    url: 'https://descarte-certo.com/app',
    filename: 'qr-app.png',
    title: 'Descarte Certo - App Web'
  }
};

// Gerar QR codes
async function generateQRCodes() {
  console.log('🔄 Gerando QR codes...');
  
  for (const [key, data] of Object.entries(qrData)) {
    try {
      const filepath = path.join(qrDir, data.filename);
      
      await QRCode.toFile(filepath, data.url, {
        color: {
          dark: '#059669',  // Verde do tema
          light: '#FFFFFF'
        },
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H'
      });
      
      console.log(`✅ QR Code gerado: ${data.filename} (${data.title})`);
    } catch (error) {
      console.error(`❌ Erro ao gerar QR code para ${key}:`, error);
    }
  }
  
  console.log('🎉 Todos os QR codes foram gerados!');
}

// Executar se chamado diretamente
if (require.main === module) {
  generateQRCodes();
}

module.exports = { generateQRCodes, qrData }; 