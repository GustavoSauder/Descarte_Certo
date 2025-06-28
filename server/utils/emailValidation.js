const dns = require('dns').promises;

// Função para validar se o email existe realmente
async function validateEmail(email) {
  try {
    // Regex básica para formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Extrair o domínio do email
    const domain = email.split('@')[1];
    
    // Verificar se o domínio tem registros MX (servidores de email)
    try {
      const mxRecords = await dns.resolveMx(domain);
      return mxRecords.length > 0;
    } catch (error) {
      // Se não conseguir resolver MX, verificar se o domínio existe
      try {
        await dns.resolve(domain);
        return true;
      } catch (domainError) {
        throw new Error('Domínio de e-mail inválido ou inexistente.');
      }
    }
  } catch (error) {
    console.error('Erro na validação de email:', error);
    throw error;
  }
}

// Função síncrona para validação básica (usada em formulários)
function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  validateEmail,
  validateEmailFormat
}; 