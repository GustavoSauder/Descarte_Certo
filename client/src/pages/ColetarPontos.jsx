import { Alert } from '../components/ui/Alert';

export default function ColetarPontos() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow">
            <strong>Aviso:</strong> A coleta de pontos ainda está em desenvolvimento. A lixeira inteligente ainda não está 100% funcional. Em breve, a experiência será aprimorada!
          </div>
        </div>
        {/* ...restante da página... */}
      </div>
    </div>
  );
} 