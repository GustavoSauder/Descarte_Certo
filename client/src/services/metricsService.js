import { supabase } from '../lib/supabase';

export async function fetchUserMetrics(userId) {
  const { data, error } = await supabase
    .from('user_metrics')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createUserMetrics(userId) {
  const { data, error } = await supabase
    .from('user_metrics')
    .insert([{ user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserMetrics(userId, updates) {
  const { data, error } = await supabase
    .from('user_metrics')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
} 

class MetricsService {
  // Buscar número de escolas atendidas
  async getSchoolsCount() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('school_id')
        .not('school_id', 'is', null);

      if (error) throw error;

      // Contar escolas únicas
      const uniqueSchools = new Set(data.map(user => user.school_id));
      return uniqueSchools.size;
    } catch (error) {
      console.error('Erro ao buscar contagem de escolas:', error);
      return 0;
    }
  }

  // Buscar número de estudantes impactados
  async getStudentsCount() {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erro ao buscar contagem de estudantes:', error);
      return 0;
    }
  }

  // Buscar total de resíduos coletados (em kg)
  async getTotalWasteCollected() {
    try {
      const { data, error } = await supabase
        .from('disposals')
        .select('weight');

      if (error) throw error;

      const totalWeight = data.reduce((sum, disposal) => sum + (disposal.weight || 0), 0);
      return Math.round(totalWeight * 100) / 100; // Arredondar para 2 casas decimais
    } catch (error) {
      console.error('Erro ao buscar total de resíduos:', error);
      return 0;
    }
  }

  // Buscar índice de satisfação
  async getSatisfactionRate() {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('rating, satisfaction');

      if (error) throw error;

      if (data.length === 0) return 0;

      // Calcular satisfação baseada em ratings e níveis de satisfação
      let totalSatisfaction = 0;
      let totalResponses = 0;

      data.forEach(feedback => {
        // Converter rating (1-5) para porcentagem
        const ratingPercentage = (feedback.rating / 5) * 100;
        
        // Converter satisfaction para porcentagem
        let satisfactionPercentage = 0;
        switch (feedback.satisfaction) {
          case 'muito_satisfeito':
            satisfactionPercentage = 100;
            break;
          case 'satisfeito':
            satisfactionPercentage = 80;
            break;
          case 'neutro':
            satisfactionPercentage = 60;
            break;
          case 'insatisfeito':
            satisfactionPercentage = 40;
            break;
          case 'muito_insatisfeito':
            satisfactionPercentage = 20;
            break;
          default:
            satisfactionPercentage = 60;
        }

        // Média entre rating e satisfaction
        totalSatisfaction += (ratingPercentage + satisfactionPercentage) / 2;
        totalResponses++;
      });

      return Math.round(totalSatisfaction / totalResponses);
    } catch (error) {
      console.error('Erro ao buscar taxa de satisfação:', error);
      return 0;
    }
  }

  // Calcular impacto ambiental
  async getEnvironmentalImpact() {
    try {
      const { data, error } = await supabase
        .from('disposals')
        .select('weight, material_type');

      if (error) throw error;

      let totalWeight = 0;
      let plasticWeight = 0;
      let paperWeight = 0;
      let glassWeight = 0;
      let metalWeight = 0;

      data.forEach(disposal => {
        const weight = disposal.weight || 0;
        totalWeight += weight;
        
        const materialType = disposal.material_type?.toLowerCase() || '';
        if (materialType.includes('plástico') || materialType.includes('plastic')) {
          plasticWeight += weight;
        } else if (materialType.includes('papel') || materialType.includes('paper')) {
          paperWeight += weight;
        } else if (materialType.includes('vidro') || materialType.includes('glass')) {
          glassWeight += weight;
        } else if (materialType.includes('metal') || materialType.includes('alumínio')) {
          metalWeight += weight;
        }
      });

      // Cálculos de impacto ambiental (baseados em estudos reais)
      const treesSaved = Math.round(paperWeight * 0.017); // 1kg papel = ~0.017 árvores
      const waterSaved = Math.round(plasticWeight * 2.5 + paperWeight * 2.5); // litros economizados
      const co2Reduced = Math.round(totalWeight * 1.6); // kg de CO2 reduzidos por kg reciclado

      return {
        totalWeight: Math.round(totalWeight * 100) / 100,
        treesSaved,
        waterSaved,
        co2Reduced,
        plasticWeight: Math.round(plasticWeight * 100) / 100,
        paperWeight: Math.round(paperWeight * 100) / 100,
        glassWeight: Math.round(glassWeight * 100) / 100,
        metalWeight: Math.round(metalWeight * 100) / 100
      };
    } catch (error) {
      console.error('Erro ao calcular impacto ambiental:', error);
      return {
        totalWeight: 0,
        treesSaved: 0,
        waterSaved: 0,
        co2Reduced: 0,
        plasticWeight: 0,
        paperWeight: 0,
        glassWeight: 0,
        metalWeight: 0
      };
    }
  }

  // Buscar todas as métricas de uma vez
  async getAllMetrics() {
    try {
      const [schoolsCount, studentsCount, wasteCollected, satisfactionRate, environmentalImpact] = await Promise.all([
        this.getSchoolsCount(),
        this.getStudentsCount(),
        this.getTotalWasteCollected(),
        this.getSatisfactionRate(),
        this.getEnvironmentalImpact()
      ]);

      return {
        schoolsCount,
        studentsCount,
        wasteCollected,
        satisfactionRate,
        ...environmentalImpact
      };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return {
        schoolsCount: 0,
        studentsCount: 0,
        wasteCollected: 0,
        satisfactionRate: 0,
        totalWeight: 0,
        treesSaved: 0,
        waterSaved: 0,
        co2Reduced: 0,
        plasticWeight: 0,
        paperWeight: 0,
        glassWeight: 0,
        metalWeight: 0
      };
    }
  }

  // Buscar estatísticas detalhadas
  async getDetailedStats() {
    try {
      const { data: disposals, error: disposalsError } = await supabase
        .from('disposals')
        .select('*');

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .select('*');

      if (disposalsError || usersError || feedbackError) {
        throw new Error('Erro ao buscar dados detalhados');
      }

      // Calcular estatísticas
      const totalDisposals = disposals.length;
      const totalUsers = users.length;
      const totalFeedback = feedback.length;
      const totalWeight = disposals.reduce((sum, d) => sum + (d.weight || 0), 0);
      
      // Média de pontos por usuário
      const totalPoints = disposals.reduce((sum, d) => sum + (d.points || 0), 0);
      const avgPointsPerUser = users.length > 0 ? Math.round(totalPoints / users.length) : 0;

      // Distribuição de materiais
      const materialDistribution = disposals.reduce((acc, disposal) => {
        const material = disposal.material_type || 'outro';
        acc[material] = (acc[material] || 0) + 1;
        return acc;
      }, {});

      return {
        totalDisposals,
        totalUsers,
        totalFeedback,
        totalWeight: Math.round(totalWeight * 100) / 100,
        avgPointsPerUser,
        materialDistribution
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas detalhadas:', error);
      return {
        totalDisposals: 0,
        totalUsers: 0,
        totalFeedback: 0,
        totalWeight: 0,
        avgPointsPerUser: 0,
        materialDistribution: {}
      };
    }
  }
}

export default new MetricsService(); 