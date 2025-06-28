import React from 'react';

export default function Admin() {
  return (
    <section className="w-full max-w-4xl mx-auto space-y-8 px-4">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Painel Administrativo</h2>
      </div>
      
      <div className="bg-yellow-100 dark:bg-yellow-800 rounded-lg p-6 md:p-8 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Gestão de Reciclagem</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Atualize dados de impacto, resíduos e estatísticas em tempo real.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Histórias e Fotos</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Gerencie histórias de impacto social e fotos enviadas pelos usuários.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Recompensas</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Adicione, edite ou remova recompensas disponíveis na loja ecológica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 