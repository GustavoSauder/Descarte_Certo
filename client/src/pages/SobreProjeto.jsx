import React from 'react';
import { FaPlay, FaLightbulb, FaRecycle, FaGraduationCap, FaMobile, FaChartLine, FaAward, FaUsers, FaLeaf } from 'react-icons/fa';

const fotos = [
  { src: '/projeto/foto1.jpg', legenda: 'Lixeira inteligente em funcionamento.' },
  { src: '/projeto/foto2.jpg', legenda: 'Equipe apresentando o projeto em evento.' },
  { src: '/projeto/foto3.jpg', legenda: 'Van laboratório móvel.' },
  { src: '/projeto/foto4.jpg', legenda: 'Aplicativo em uso nas escolas.' },
  { src: '/projeto/foto5.jpg', legenda: 'Produtos reciclados e impressos em 3D.' },
  { src: '/projeto/foto6.jpg', legenda: 'Estudantes participando das atividades.' },
];

const tecnologias = [
  { nome: 'React & Node.js', descricao: 'Desenvolvimento full-stack moderno' },
  { nome: 'Supabase', descricao: 'Banco de dados e autenticação' },
  { nome: 'IoT & Arduino', descricao: 'Sensores e automação' },
  { nome: 'Machine Learning', descricao: 'Análise de dados e predições' },
  { nome: '3D Printing', descricao: 'Fabricação de produtos sustentáveis' },
  { nome: 'Mobile App', descricao: 'Aplicativo nativo para Android/iOS' },
];

const conquistas = [
  { ano: '2024', titulo: 'Prêmio Inovação Ambiental', descricao: 'Reconhecimento pela inovação em educação ambiental' },
  { ano: '2023', titulo: '50+ Escolas Atendidas', descricao: 'Expansão para múltiplas instituições educacionais' },
  { ano: '2023', titulo: '10k+ Estudantes Impactados', descricao: 'Alcance significativo na comunidade escolar' },
  { ano: '2022', titulo: 'Protótipo Funcional', descricao: 'Primeira versão operacional do sistema' },
];

export default function SobreProjeto() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto space-y-16 px-4">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sobre o Projeto
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            O Descarte Certo é uma iniciativa inovadora que une tecnologia, educação e sustentabilidade 
            para promover o descarte consciente e o engajamento social em escolas e comunidades.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaLeaf className="text-2xl text-green-600 dark:text-green-400" />
              <span className="font-semibold">Sustentabilidade</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGraduationCap className="text-2xl text-blue-600 dark:text-blue-400" />
              <span className="font-semibold">Educação</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLightbulb className="text-2xl text-yellow-500" />
              <span className="font-semibold">Inovação</span>
            </div>
          </div>
        </div>

        {/* Visão Geral */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nossa Visão</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Criar uma geração consciente e engajada com a sustentabilidade, transformando 
              a educação ambiental através da tecnologia e gamificação.
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <FaRecycle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Promover o descarte correto de resíduos</span>
              </li>
              <li className="flex items-start gap-3">
                <FaGraduationCap className="text-blue-500 mt-1 flex-shrink-0" />
                <span>Educar através da tecnologia e gamificação</span>
              </li>
              <li className="flex items-start gap-3">
                <FaUsers className="text-purple-500 mt-1 flex-shrink-0" />
                <span>Engajar comunidades escolares</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Como Funciona</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Coleta Inteligente</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Lixeiras com sensores detectam e categorizam resíduos automaticamente</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Gamificação</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Sistema de pontos e recompensas motiva a participação</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Educação</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Conteúdo educativo personalizado baseado no comportamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vídeo do Projeto */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Vídeo do Projeto
          </h2>
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700">
            <video controls className="w-full h-full">
              <source src="/projeto/video.mp4" type="video/mp4" />
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FaPlay size={60} className="mx-auto mb-4" />
                  <p>Vídeo do projeto em breve</p>
                </div>
              </div>
            </video>
          </div>
        </div>

        {/* Tecnologias */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Tecnologias Utilizadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tecnologias.map((tech) => (
              <div key={tech.nome} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {tech.nome}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tech.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Galeria */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Galeria do Projeto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {fotos.map((foto, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full h-48 rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <img 
                    src={foto.src} 
                    alt={foto.legenda} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <FaLeaf size={40} className="mx-auto mb-2" />
                      <p className="text-sm">Imagem em breve</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center text-sm mt-3">
                  {foto.legenda}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conquistas */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Nossas Conquistas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conquistas.map((conquista) => (
              <div key={conquista.ano} className="text-center">
                <div className="text-2xl font-bold mb-2">{conquista.ano}</div>
                <h3 className="font-semibold mb-2">{conquista.titulo}</h3>
                <p className="text-green-100 text-sm">{conquista.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impacto */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Nosso Impacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Escolas Atendidas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">10k+</div>
              <div className="text-gray-600 dark:text-gray-300">Estudantes Impactados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">5k+</div>
              <div className="text-gray-600 dark:text-gray-300">Kg de Resíduos Coletados</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quer conhecer mais sobre o projeto?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Entre em contato conosco para saber como implementar o Descarte Certo em sua escola ou comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contato" 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Solicitar Demonstração
            </a>
            <a 
              href="/sobre-nos" 
              className="border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Conheça a Equipe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 