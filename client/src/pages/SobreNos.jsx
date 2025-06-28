import React from 'react';
import { FaPlay, FaUsers, FaHeart, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const equipe = [
  { 
    nome: 'Gustavo Sauder', 
    foto: '/equipe/gustavo.jpg', 
    cargo: 'Coordenador de Projeto e Full Stack Developer',
    descricao: 'Responsável pela coordenação geral do projeto, desenvolvimento full-stack e arquitetura de sistemas. Especialista em React, Node.js e tecnologias web modernas.',
    github: 'https://github.com/gustavosauder',
    linkedin: 'https://linkedin.com/in/gustavosauder',
    email: 'gustavo.sauder@email.com'
  },
  { 
    nome: 'Ana Marinho', 
    foto: '/equipe/ana.jpg', 
    cargo: 'Gestora de Conteúdo e Comunicação',
    descricao: 'Responsável pela criação de conteúdo educativo, estratégias de comunicação e engajamento com a comunidade escolar.',
    github: 'https://github.com/anamarinho',
    linkedin: 'https://linkedin.com/in/anamarinho',
    email: 'ana.marinho@email.com'
  },
  { 
    nome: 'Giovanna Tigrinho', 
    foto: '/equipe/giovanna.jpg', 
    cargo: 'Designer e UX/UI',
    descricao: 'Especialista em design de interfaces, experiência do usuário e identidade visual do projeto.',
    github: 'https://github.com/giovannatigrinho',
    linkedin: 'https://linkedin.com/in/giovannatigrinho',
    email: 'giovanna.tigrinho@email.com'
  },
  { 
    nome: 'Stefanny Leopatko', 
    foto: '/equipe/stefanny.jpg', 
    cargo: 'Desenvolvedora Frontend',
    descricao: 'Desenvolvedora especializada em React, responsável pela interface do usuário e experiência mobile.',
    github: 'https://github.com/stefannyleopatko',
    linkedin: 'https://linkedin.com/in/stefannyleopatko',
    email: 'stefanny.leopatko@email.com'
  },
  { 
    nome: 'Kevin Murilo', 
    foto: '/equipe/kevin.jpg', 
    cargo: 'Desenvolvedor Backend',
    descricao: 'Especialista em desenvolvimento backend, APIs e banco de dados. Responsável pela infraestrutura do sistema.',
    github: 'https://github.com/kevinmurilo',
    linkedin: 'https://linkedin.com/in/kevinmurilo',
    email: 'kevin.murilo@email.com'
  },
  { 
    nome: 'Camila Lau', 
    foto: '/equipe/camila.jpg', 
    cargo: 'Analista de Dados e QA',
    descricao: 'Responsável pela análise de dados, qualidade de software e testes de usabilidade.',
    github: 'https://github.com/camilalau',
    linkedin: 'https://linkedin.com/in/camilalau',
    email: 'camila.lau@email.com'
  },
];

export default function SobreEquipe() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="w-full max-w-7xl mx-auto space-y-12 px-4">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sobre a Equipe
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Nossa equipe multidisciplinar é apaixonada por educação ambiental, tecnologia e impacto social. 
            Juntos, desenvolvemos soluções inovadoras para transformar o mundo através da sustentabilidade e da colaboração.
          </p>
          <div className="flex justify-center items-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaUsers className="text-2xl text-green-600 dark:text-green-400" />
              <span className="font-semibold">6 Especialistas</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="text-2xl text-red-500" />
              <span className="font-semibold">100% Comprometidos</span>
            </div>
          </div>
        </div>

        {/* Missão e Valores */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nossa Missão</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Transformar a educação ambiental através da tecnologia, criando uma geração consciente 
              e engajada com a sustentabilidade. Queremos democratizar o acesso à educação ambiental 
              de qualidade, tornando-a acessível e envolvente para todos.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nossos Valores</h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sustentabilidade e responsabilidade ambiental</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Inovação e criatividade tecnológica</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Educação de qualidade para todos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Colaboração e trabalho em equipe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Equipe */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Conheça o Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipe.map((membro) => (
              <div key={membro.nome} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg mb-4 mx-auto bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <img 
                    src={membro.foto} 
                    alt={membro.nome} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-gray-500 dark:text-gray-400">
                    <FaUsers size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {membro.nome}
                </h3>
                <p className="text-green-600 dark:text-green-400 font-semibold mb-3">
                  {membro.cargo}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {membro.descricao}
                </p>
                <div className="flex justify-center gap-3">
                  <a 
                    href={membro.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a 
                    href={membro.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a 
                    href={`mailto:${membro.email}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    <FaEnvelope size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Nossos Números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Escolas Atendidas</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10k+</div>
              <div className="text-green-100">Estudantes Impactados</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">5k+</div>
              <div className="text-green-100">Kg de Resíduos Coletados</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
              <div className="text-green-100">Satisfação</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quer fazer parte da nossa missão?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Entre em contato conosco e descubra como podemos trabalhar juntos para criar um futuro mais sustentável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contato" 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Entre em Contato
            </a>
            <a 
              href="/sobre-projeto" 
              className="border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Conheça o Projeto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 