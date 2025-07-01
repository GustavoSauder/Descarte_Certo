const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRankingSystem() {
  console.log('🧪 Testando Sistema de Ranking...\n');

  try {
    // Teste 1: Ranking de reciclagem individual
    console.log('1️⃣ Testando ranking de reciclagem individual...');
    const recyclingResponse = await axios.get(`${BASE_URL}/users/ranking`);
    console.log('✅ Ranking de reciclagem:', recyclingResponse.data);
    
    // Teste 2: Ranking de escolas
    console.log('\n2️⃣ Testando ranking de escolas...');
    const schoolsResponse = await axios.get(`${BASE_URL}/api/schools`);
    console.log('✅ Ranking de escolas:', schoolsResponse.data);
    
    // Teste 3: Leaderboard geral
    console.log('\n3️⃣ Testando leaderboard geral...');
    const leaderboardResponse = await axios.get(`${BASE_URL}/api/leaderboard`);
    console.log('✅ Leaderboard geral:', leaderboardResponse.data);
    
    // Teste 4: Ranking de impacto
    console.log('\n4️⃣ Testando ranking de impacto...');
    const impactResponse = await axios.get(`${BASE_URL}/impact/schools`);
    console.log('✅ Ranking de impacto:', impactResponse.data);
    
    console.log('\n🎉 Todos os testes de ranking passaram!');
    
  } catch (error) {
    console.error('❌ Erro no teste de ranking:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
  }
}

// Executar teste
testRankingSystem(); 