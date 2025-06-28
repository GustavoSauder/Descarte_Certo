#!/usr/bin/env node

/**
 * Script de Teste Completo - Descarte Certo
 * Testa todas as funcionalidades implementadas
 */

const axios = require('axios');
const colors = require('colors');

// Configuração
const BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  name: 'Teste Usuário',
  email: 'teste@descarte-certo.com',
  password: 'Teste123!',
  school: 'Escola Teste',
  grade: '9º ano'
};

let authToken = null;
let userId = null;

// Utilitários
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`.blue),
  success: (msg) => console.log(`✅ ${msg}`.green),
  error: (msg) => console.log(`❌ ${msg}`.red),
  warning: (msg) => console.log(`⚠️  ${msg}`.yellow),
  section: (msg) => console.log(`\n📋 ${msg}`.cyan.bold)
};

// Função para fazer requisições
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
}

// Testes de Autenticação
async function testAuth() {
  log.section('🔐 Testando Autenticação');

  // Teste de registro
  log.info('Testando registro de usuário...');
  const registerResult = await makeRequest('POST', '/auth/register', TEST_USER);
  
  if (registerResult.success) {
    log.success('Registro realizado com sucesso');
    authToken = registerResult.data.token;
    userId = registerResult.data.user.id;
  } else {
    log.warning('Usuário já existe, tentando login...');
    const loginResult = await makeRequest('POST', '/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (loginResult.success) {
      log.success('Login realizado com sucesso');
      authToken = loginResult.data.token;
      userId = loginResult.data.user.id;
    } else {
      log.error('Falha no login');
      return false;
    }
  }

  // Teste de perfil
  log.info('Testando busca de perfil...');
  const profileResult = await makeRequest('GET', '/auth/profile', null, authToken);
  
  if (profileResult.success) {
    log.success('Perfil carregado com sucesso');
  } else {
    log.error('Falha ao carregar perfil');
    return false;
  }

  return true;
}

// Testes de Descarte
async function testDisposals() {
  log.section('♻️ Testando Sistema de Descarte');

  const disposalData = {
    materialType: 'PLASTICO',
    weight: 2.5,
    location: 'São Paulo, SP',
    description: 'Teste de descarte'
  };

  // Teste de criação de descarte
  log.info('Testando criação de descarte...');
  const createResult = await makeRequest('POST', '/disposals', disposalData, authToken);
  
  if (createResult.success) {
    log.success('Descarte criado com sucesso');
  } else {
    log.error('Falha ao criar descarte');
    return false;
  }

  // Teste de listagem de descartes
  log.info('Testando listagem de descartes...');
  const listResult = await makeRequest('GET', '/disposals', null, authToken);
  
  if (listResult.success) {
    log.success(`Listados ${listResult.data.data.length} descartes`);
  } else {
    log.error('Falha ao listar descartes');
    return false;
  }

  return true;
}

// Testes de Dashboard
async function testDashboard() {
  log.section('📊 Testando Dashboard');

  // Teste de estatísticas
  log.info('Testando estatísticas do dashboard...');
  const statsResult = await makeRequest('GET', '/dashboard/stats', null, authToken);
  
  if (statsResult.success) {
    log.success('Estatísticas carregadas com sucesso');
  } else {
    log.error('Falha ao carregar estatísticas');
    return false;
  }

  return true;
}

// Testes de Notificações
async function testNotifications() {
  log.section('🔔 Testando Sistema de Notificações');

  // Teste de listagem de notificações
  log.info('Testando listagem de notificações...');
  const listResult = await makeRequest('GET', '/notifications', null, authToken);
  
  if (listResult.success) {
    log.success(`Listadas ${listResult.data.data.length} notificações`);
  } else {
    log.error('Falha ao listar notificações');
    return false;
  }

  return true;
}

// Testes de Ranking
async function testRanking() {
  log.section('🏆 Testando Sistema de Ranking');

  // Teste de ranking
  log.info('Testando busca de ranking...');
  const rankingResult = await makeRequest('GET', '/ranking', null, authToken);
  
  if (rankingResult.success) {
    log.success('Ranking carregado com sucesso');
  } else {
    log.error('Falha ao carregar ranking');
    return false;
  }

  return true;
}

// Testes de Conquistas
async function testAchievements() {
  log.section('🎖️ Testando Sistema de Conquistas');

  // Teste de listagem de conquistas
  log.info('Testando listagem de conquistas...');
  const achievementsResult = await makeRequest('GET', '/achievements', null, authToken);
  
  if (achievementsResult.success) {
    log.success(`Listadas ${achievementsResult.data.data.length} conquistas`);
  } else {
    log.error('Falha ao listar conquistas');
    return false;
  }

  return true;
}

// Testes de Recompensas
async function testRewards() {
  log.section('🎁 Testando Sistema de Recompensas');

  // Teste de listagem de recompensas
  log.info('Testando listagem de recompensas...');
  const rewardsResult = await makeRequest('GET', '/rewards', null, authToken);
  
  if (rewardsResult.success) {
    log.success(`Listadas ${rewardsResult.data.data.length} recompensas`);
  } else {
    log.error('Falha ao listar recompensas');
    return false;
  }

  return true;
}

// Testes de Histórico
async function testHistory() {
  log.section('📜 Testando Histórico');

  // Teste de histórico
  log.info('Testando busca de histórico...');
  const historyResult = await makeRequest('GET', '/disposals/history', null, authToken);
  
  if (historyResult.success) {
    log.success('Histórico carregado com sucesso');
  } else {
    log.error('Falha ao carregar histórico');
    return false;
  }

  return true;
}

// Testes de Impacto
async function testImpact() {
  log.section('🌍 Testando Sistema de Impacto');

  // Teste de impacto
  log.info('Testando cálculo de impacto...');
  const impactResult = await makeRequest('GET', '/impact', null, authToken);
  
  if (impactResult.success) {
    log.success('Impacto calculado com sucesso');
  } else {
    log.error('Falha ao calcular impacto');
    return false;
  }

  return true;
}

// Testes de Configurações
async function testSettings() {
  log.section('⚙️ Testando Configurações');

  // Teste de configurações
  log.info('Testando busca de configurações...');
  const settingsResult = await makeRequest('GET', '/users/settings', null, authToken);
  
  if (settingsResult.success) {
    log.success('Configurações carregadas com sucesso');
  } else {
    log.error('Falha ao carregar configurações');
    return false;
  }

  return true;
}

// Testes de Suporte
async function testSupport() {
  log.section('🎫 Testando Sistema de Suporte');

  const ticketData = {
    subject: 'Teste de Ticket',
    message: 'Este é um ticket de teste',
    category: 'TECHNICAL',
    priority: 'MEDIUM'
  };

  // Teste de criação de ticket
  log.info('Testando criação de ticket...');
  const createResult = await makeRequest('POST', '/support', ticketData, authToken);
  
  if (createResult.success) {
    log.success('Ticket criado com sucesso');
  } else {
    log.error('Falha ao criar ticket');
    return false;
  }

  return true;
}

// Testes de Contato
async function testContact() {
  log.section('📞 Testando Sistema de Contato');

  const contactData = {
    name: 'Teste Contato',
    email: 'contato@teste.com',
    subject: 'Teste de Contato',
    message: 'Esta é uma mensagem de teste'
  };

  // Teste de envio de contato
  log.info('Testando envio de contato...');
  const contactResult = await makeRequest('POST', '/contact', contactData);
  
  if (contactResult.success) {
    log.success('Contato enviado com sucesso');
  } else {
    log.error('Falha ao enviar contato');
    return false;
  }

  return true;
}

// Testes de Health Check
async function testHealth() {
  log.section('🏥 Testando Health Check');

  // Teste de health check
  log.info('Testando health check...');
  const healthResult = await makeRequest('GET', '/health');
  
  if (healthResult.success) {
    log.success('Health check realizado com sucesso');
  } else {
    log.error('Falha no health check');
    return false;
  }

  return true;
}

// Testes de Documentação
async function testDocs() {
  log.section('📚 Testando Documentação');

  // Teste de acesso à documentação
  log.info('Testando acesso à documentação...');
  try {
    const docsResult = await axios.get(`${BASE_URL.replace('/api', '')}/api/docs`);
    if (docsResult.status === 200) {
      log.success('Documentação acessível');
    } else {
      log.error('Falha ao acessar documentação');
      return false;
    }
  } catch (error) {
    log.error('Falha ao acessar documentação');
    return false;
  }

  return true;
}

// Função principal
async function runAllTests() {
  console.log('🚀 Iniciando Testes Completos - Descarte Certo\n'.rainbow.bold);

  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Autenticação', fn: testAuth },
    { name: 'Descarte', fn: testDisposals },
    { name: 'Dashboard', fn: testDashboard },
    { name: 'Notificações', fn: testNotifications },
    { name: 'Ranking', fn: testRanking },
    { name: 'Conquistas', fn: testAchievements },
    { name: 'Recompensas', fn: testRewards },
    { name: 'Histórico', fn: testHistory },
    { name: 'Impacto', fn: testImpact },
    { name: 'Configurações', fn: testSettings },
    { name: 'Suporte', fn: testSupport },
    { name: 'Contato', fn: testContact },
    { name: 'Documentação', fn: testDocs }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      log.error(`Erro no teste ${test.name}: ${error.message}`);
      failed++;
    }
  }

  // Resumo final
  log.section('📊 Resumo dos Testes');
  console.log(`✅ Testes aprovados: ${passed}`.green);
  console.log(`❌ Testes falharam: ${failed}`.red);
  console.log(`📈 Taxa de sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`.cyan);

  if (failed === 0) {
    console.log('\n🎉 Todos os testes passaram! A aplicação está funcionando perfeitamente!'.green.bold);
  } else {
    console.log('\n⚠️  Alguns testes falharam. Verifique os logs acima.'.yellow.bold);
  }

  console.log('\n🌱 Descarte Certo - Testes Concluídos!'.rainbow.bold);
}

// Executar testes
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests }; 