import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache } from './useCache';

// Dados reais da equipe
const equipePadrao = [
  { 
    nome: 'Gustavo Sauder', 
    foto: '/equipe/gustavo.jpg', 
    cargo: 'Desenvolvedor Full-Stack, Analista de Dados/QA e Coordenador Técnico',
    descricao: 'Faz o curso Técnico em Desenvolvimento de Sistemas e está atualmente no 3º ano do EM. Atuou como Desenvolvedor Full-Stack, Analista de Dados/QA e Coordenador Técnico no projeto do site Descarte Certo. Foi o responsável por todo o desenvolvimento do site, desde o planejamento da estrutura até a implementação final. Desenvolveu sozinho todas as funcionalidades da aplicação, organizou a arquitetura do sistema, realizou testes e garantiu a qualidade e usabilidade do produto. Além disso, coordenou a parte técnica do projeto, assegurando que tudo funcionasse de forma eficiente e integrada.',
    github: '',
    linkedin: '',
    email: ''
  },
  { 
    nome: 'Ana Marinho', 
    foto: '/equipe/ana.jpg', 
    cargo: 'Gestora de Projetos e Ideias',
    descricao: 'Faz o curso Técnico em Farmácia e está no 3º ano EM, onde aprende sobre medicamentos, manipulação dos mesmos, controle de qualidade, procedimentos laboratoriais e a importância da ética e segurança na área da saúde. Nesse curso, tem tanto aulas teóricas quanto práticas, que preparam os estudantes para atuar com responsabilidade e conhecimento técnico. No projeto EcoTech, ajudou com ideias para o site, na organização da equipe e na parte inicial do relatório.',
    github: '',
    linkedin: '',
    email: ''
  },
  { 
    nome: 'Giovanna Tigrinho', 
    foto: '/equipe/giovanna.jpg', 
    cargo: 'Designer dos Protótipos e Decoradora',
    descricao: 'Faz o curso de Formação de Docentes, um curso voltado para preparar futuros professores para atuarem na educação básica, abrangendo a educação infantil. O principal objetivo é capacitar os alunos com conhecimentos teóricos e práticos sobre pedagogia, didática, psicologia da educação e metodologias de ensino. No projeto, foi responsável pela decoração e pela parte estética do projeto, além de ter criado a logo que dá vida à nossa identidade visual.',
    github: '',
    linkedin: '',
    email: ''
  },
  { 
    nome: 'Stefany Leopatko', 
    foto: '/equipe/stefanny.jpg', 
    cargo: 'Decoradora Auxiliar',
    descricao: 'Faz o curso de Farmácia e está no 3° ano do EM, gosta do curso porque fazem aulas teóricas e práticas, pois isso ajuda muito no seu desenvolvimento. A parte que ela ajudou no projeto foi na confecção do projeto, contribuindo como decoradora auxiliar.',
    github: '',
    linkedin: '',
    email: ''
  },
  { 
    nome: 'Kevin Murilo', 
    foto: '/equipe/kevin.jpg', 
    cargo: 'Engenheiro e Diretor do Projeto',
    descricao: 'Aluno do 3° ano do EM do curso Técnico em Desenvolvimento de Sistemas, aprofunda seus conhecimentos em programação, banco de dados e desenvolvimento de aplicações web e mobile, criando projetos completos com interface, lógica e integração com banco de dados. Também aprende sobre segurança da informação, versionamento de código com Git e trabalho em equipe, o que o prepara para o mercado de trabalho e futuros estudos na área de tecnologia. Líder do projeto e o "engenheiro" das maquetes, fez toda a parte Elétrica das maquetes, e é a mente por trás do projeto ECHO TEC, ele que pensou no projeto em si.',
    github: '',
    linkedin: '',
    email: ''
  },
  { 
    nome: 'Camila Lau', 
    foto: '/equipe/camila.jpg', 
    cargo: 'Decoradora e Designer',
    descricao: 'Faz o curso de Formação de Docentes e está no 3° ano do EM, uma das responsáveis pela decoração e pela parte estética do projeto. Junto com a Giovanna Tigrinho, trabalha na criação da identidade visual e elementos decorativos do projeto.',
    github: '',
    linkedin: '',
    email: ''
  },
];

// Classe para gerenciar WebSocket
class EquipeWebSocket {
  constructor(onDataUpdate) {
    this.ws = null;
    this.onDataUpdate = onDataUpdate;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnecting = false;
  }

  connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;

    this.isConnecting = true;
    
    try {
      // Usar WebSocket se disponível, senão usar polling
      if ('WebSocket' in window) {
        this.connectWebSocket();
      } else {
        this.startPolling();
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      this.startPolling();
    }
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/equipe`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket conectado para dados da equipe');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'equipe_update') {
          this.onDataUpdate(data.equipe);
        }
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket desconectado');
      this.isConnecting = false;
      this.scheduleReconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      this.isConnecting = false;
    };
  }

  startPolling() {
    console.log('Iniciando polling para dados da equipe');
    this.pollingInterval = setInterval(() => {
      this.fetchEquipeData();
    }, 5000); // Polling a cada 5 segundos
  }

  async fetchEquipeData() {
    try {
      const response = await fetch('/api/equipe');
      if (response.ok) {
        const data = await response.json();
        this.onDataUpdate(data.equipe);
      }
    } catch (error) {
      console.error('Erro no polling:', error);
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isConnecting = false;
  }

  sendUpdate(equipeData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'equipe_update',
        equipe: equipeData
      }));
    }
  }
}

export const useEquipe = () => {
  const [equipe, setEquipe] = useState(equipePadrao);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const wsRef = useRef(null);
  const updateTimeoutRef = useRef(null);

  // Função para carregar dados da equipe
  const carregarEquipe = useCallback(async () => {
    try {
      setLoading(true);
      
      // Tentar carregar do localStorage primeiro
      const equipeSalva = localStorage.getItem('equipeData');
      if (equipeSalva) {
        const dadosEquipe = JSON.parse(equipeSalva);
        setEquipe(dadosEquipe);
        setLastUpdate(new Date());
      } else {
        // Se não há dados salvos, usar dados padrão e salvar
        localStorage.setItem('equipeData', JSON.stringify(equipePadrao));
        setEquipe(equipePadrao);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erro ao carregar dados da equipe:', error);
      setEquipe(equipePadrao);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para atualizar dados da equipe
  const atualizarEquipe = useCallback((novosDados) => {
    try {
      setEquipe(novosDados);
      setLastUpdate(new Date());
      localStorage.setItem('equipeData', JSON.stringify(novosDados));
      
      // Invalidar cache se existir
      const cacheKey = 'equipeData';
      if (localStorage.getItem(`cache_${cacheKey}`)) {
        localStorage.removeItem(`cache_${cacheKey}`);
      }
      
      // Enviar atualização via WebSocket
      if (wsRef.current) {
        wsRef.current.sendUpdate(novosDados);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar dados da equipe:', error);
      return false;
    }
  }, []);

  // Função para resetar para dados padrão
  const resetarEquipe = useCallback(() => {
    return atualizarEquipe(equipePadrao);
  }, [atualizarEquipe]);

  // Função para atualizar membro específico
  const atualizarMembro = useCallback((nome, novosDados) => {
    const equipeAtualizada = equipe.map(membro => 
      membro.nome === nome ? { ...membro, ...novosDados } : membro
    );
    return atualizarEquipe(equipeAtualizada);
  }, [equipe, atualizarEquipe]);

  // Função para adicionar novo membro
  const adicionarMembro = useCallback((novoMembro) => {
    const equipeAtualizada = [...equipe, novoMembro];
    return atualizarEquipe(equipeAtualizada);
  }, [equipe, atualizarEquipe]);

  // Função para remover membro
  const removerMembro = useCallback((nome) => {
    const equipeAtualizada = equipe.filter(membro => membro.nome !== nome);
    return atualizarEquipe(equipeAtualizada);
  }, [equipe, atualizarEquipe]);

  // Função para sincronizar com servidor
  const sincronizarComServidor = useCallback(async () => {
    try {
      const response = await fetch('/api/equipe/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ equipe })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Dados sincronizados com sucesso');
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
    }
  }, [equipe]);

  // Função para receber atualizações em tempo real
  const receberAtualizacao = useCallback((novosDados) => {
    setEquipe(novosDados);
    setLastUpdate(new Date());
    localStorage.setItem('equipeData', JSON.stringify(novosDados));
    setIsOnline(true);
  }, []);

  // Inicializar WebSocket e carregar dados
  useEffect(() => {
    carregarEquipe();
    
    // Inicializar WebSocket
    wsRef.current = new EquipeWebSocket(receberAtualizacao);
    wsRef.current.connect();
    
    // Sincronizar periodicamente
    const syncInterval = setInterval(sincronizarComServidor, 30000); // 30 segundos
    
    // Verificar conectividade
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);
    checkOnline();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
      clearInterval(syncInterval);
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, [carregarEquipe, receberAtualizacao, sincronizarComServidor]);

  // Debounce para atualizações
  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      sincronizarComServidor();
    }, 2000);
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [equipe, sincronizarComServidor]);

  return {
    equipe,
    loading,
    isOnline,
    lastUpdate,
    atualizarEquipe,
    resetarEquipe,
    atualizarMembro,
    adicionarMembro,
    removerMembro,
    carregarEquipe,
    sincronizarComServidor
  };
}; 