import React from 'react';
import { FaCamera, FaMapMarkerAlt, FaTrophy, FaRobot } from 'react-icons/fa';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Como funciona o App Descarte Certo?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubra como nossa tecnologia revoluciona o descarte consciente e a educação ambiental
          </p>
        </div>

        {/* Lista de Funcionalidades */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Funcionalidades Principais
          </h2>
          <ol className="list-decimal list-inside text-left space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="font-semibold text-green-600 dark:text-green-400">Upload de fotos:</span>
              <span>Fotografe o resíduo a ser descartado com qualidade.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Reconhecimento de materiais:</span>
              <span>IA identifica Plástico, Vidro, Papel, Metal, Orgânico, Eletrônico automaticamente.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-purple-600 dark:text-purple-400">Tempo de decomposição:</span>
              <span>Saiba quanto tempo o material leva para se decompor na natureza.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-orange-600 dark:text-orange-400">Sugestão de descarte correto:</span>
              <span>Veja pontos de coleta próximos via Google Maps integrado.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-green-600 dark:text-green-400">Pontos ecológicos:</span>
              <span>Ganhe pontos por cada descarte correto (sistema de gamificação).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Impressão 3D:</span>
              <span>Veja materiais compatíveis para uso em impressoras 3D sustentáveis.</span>
            </li>
          </ol>
        </div>

        {/* Ícones de Funcionalidades */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Tecnologias Utilizadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <FaCamera className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Upload de Fotos</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Captura inteligente</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <FaRobot className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Reconhecimento IA</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Machine Learning</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                <FaMapMarkerAlt className="text-2xl text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Pontos de Coleta</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Geolocalização</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors">
                <FaTrophy className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Gamificação</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sistema de pontos</span>
            </div>
          </div>
        </div>

        {/* Vídeo de Demonstração */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Demonstração do App
          </h2>
          <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700">
            <iframe
              title="Demonstração do App Descarte Certo"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/1Q8fG0TtVAY"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Assista ao vídeo para ver o app em ação
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Baixe o app agora e comece a fazer a diferença no meio ambiente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/apps/descarte-certo-android.apk" 
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              download
            >
              Baixar para Android
            </a>
            <a 
              href="/apps/descarte-certo-ios.ipa" 
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              download
            >
              Baixar para iOS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 