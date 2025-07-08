// Script para testar a configuração do Google OAuth no Supabase
// Execute este script no console do navegador na página de login

console.log('🔍 Testando configuração do Google OAuth...');

// Verificar se o Supabase está carregado
if (typeof supabase === 'undefined') {
  console.error('❌ Supabase não está carregado');
} else {
  console.log('✅ Supabase carregado');
}

// Testar configuração do cliente
try {
  console.log('📋 Configuração do Supabase:');
  console.log('- URL:', supabase.supabaseUrl);
  console.log('- Anon Key:', supabase.supabaseKey ? '✅ Configurado' : '❌ Não configurado');
} catch (error) {
  console.error('❌ Erro ao verificar configuração:', error);
}

// Testar login com Google
async function testGoogleAuth() {
  try {
    console.log('🔄 Iniciando teste de login com Google...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      console.error('❌ Erro no login com Google:', error);
      
      // Análise do erro
      if (error.message.includes('redirect_uri_mismatch')) {
        console.error('💡 Solução: Verifique se a URL de redirecionamento está configurada corretamente no Google Console');
      } else if (error.message.includes('invalid_client')) {
        console.error('💡 Solução: Verifique se o Client ID e Secret estão corretos no Supabase');
      } else if (error.message.includes('access_denied')) {
        console.error('💡 Solução: Verifique se o domínio está autorizado no Google Console');
      }
    } else {
      console.log('✅ Login com Google iniciado com sucesso');
      console.log('📊 Dados:', data);
    }
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Verificar status da sessão
async function checkSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao verificar sessão:', error);
    } else if (session) {
      console.log('✅ Usuário logado:', session.user.email);
    } else {
      console.log('ℹ️ Nenhuma sessão ativa');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar sessão:', error);
  }
}

// Funções disponíveis para teste
window.testGoogleAuth = testGoogleAuth;
window.checkSession = checkSession;

console.log('📝 Funções disponíveis:');
console.log('- testGoogleAuth(): Testa login com Google');
console.log('- checkSession(): Verifica status da sessão');

// Verificar sessão automaticamente
checkSession();

console.log('🎯 Para testar o login com Google, execute: testGoogleAuth()'); 