import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaQrcode, 
  FaKeyboard, 
  FaCamera, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaRecycle,
  FaLeaf,
  FaCoins
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { collectionService } from '../services/collectionService';

const CollectPointsPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [recentCodes, setRecentCodes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef(null);
  const { user } = useAuth();
  const { addNotification } = useAppState();

  // Simular códigos já utilizados (em produção viria do backend)
  const usedCodes = ['QR-ABC123', 'QR-DEF456', 'CODE-789'];

  useEffect(() => {
    // Carregar códigos recentes do localStorage
    const saved = localStorage.getItem('recentCodes');
    if (saved) {
      setRecentCodes(JSON.parse(saved));
    }
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setScannedCode('');
      
      // Simular acesso à câmera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simular detecção de QR Code após 3 segundos
      setTimeout(() => {
        setScannedCode('');
        stopScanning();
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      setErrorMessage('Não foi possível acessar a câmera. Verifique as permissões.');
      setShowError(true);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processCode(manualCode.trim());
    }
  };

  const processCode = async (code) => {
    setIsProcessing(true);
    setErrorMessage('');
    setPointsEarned(0);

    // Verificar autenticação
    if (!user) {
      setErrorMessage('Você precisa estar logado para coletar pontos.');
      setShowError(true);
      setIsProcessing(false);
      return;
    }

    try {
      // Chamar backend para validar e coletar pontos
      const response = await collectionService.collectPointsByQrCode(code);
      setPointsEarned(response.pointsEarned || 0);
      setShowSuccess(true);
      // Atualizar pontos do usuário no frontend (opcional: buscar novamente do backend)
      if (user && response.pointsEarned) {
        user.points = (user.points || 0) + response.pointsEarned;
      }
      // Adicionar à lista de códigos recentes (opcional: pode ser removido se não quiser mostrar localmente)
      const newRecent = [
        { code, points: response.pointsEarned || 0, date: new Date().toISOString() },
        ...recentCodes.slice(0, 4)
      ];
      setRecentCodes(newRecent);
      localStorage.setItem('recentCodes', JSON.stringify(newRecent));
      setManualCode('');
      setScannedCode('');
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao coletar pontos.');
      setShowError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanSuccess = () => {
    if (scannedCode) {
      processCode(scannedCode);
    }
  };

  const closeModals = () => {
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');
    setPointsEarned(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <FaQrcode className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Coletar Pontos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Escaneie QR codes ou digite códigos das lixeiras automáticas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner QR Code */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Scanner QR Code
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Aponte a câmera para o QR Code da lixeira automática
                </p>

                {/* Área da Câmera */}
                <div className="relative mb-6">
                  <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                    {isScanning ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaCamera className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay de escaneamento */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative">
                        <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-pulse" />
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Controles */}
                <div className="space-y-4">
                  {!isScanning ? (
                    <Button
                      onClick={startScanning}
                      className="w-full"
                      variant="primary"
                    >
                      <FaCamera className="mr-2" />
                      Iniciar Scanner
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={stopScanning}
                        className="w-full"
                        variant="outline"
                      >
                        <FaTimes className="mr-2" />
                        Parar Scanner
                      </Button>
                      
                      {scannedCode && (
                        <Button
                          onClick={handleScanSuccess}
                          className="w-full"
                          variant="primary"
                        >
                          <FaCheck className="mr-2" />
                          Usar Código: {scannedCode}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Código Manual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Código Manual
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Digite o código que aparece na lixeira automática
                </p>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="manual-code"
                      name="manualCode"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      placeholder="Ex: QR-ABC123"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono"
                      disabled={isProcessing}
                      maxLength={10}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="primary"
                    disabled={!manualCode.trim() || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <FaSpinner className="mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <FaKeyboard className="mr-2" />
                        Coletar Pontos
                      </>
                    )}
                  </Button>
                </form>

                {/* Informações */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Como funciona?
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Cada código só pode ser usado uma vez</li>
                    <li>• Ganhe 30-80 pontos por descarte</li>
                    <li>• Códigos são gerados automaticamente pelas lixeiras</li>
                    <li>• Após uso, o código fica inválido</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Códigos Recentes */}
        {recentCodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Códigos Recentes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentCodes.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-bold text-green-600 dark:text-green-400">
                          {item.code}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <FaCoins className="mr-1" />
                        <span className="font-bold">+{item.points}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Simulação de Lixeira Automática */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Simulação de Lixeira Automática
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Veja como funciona o processo na lixeira automática
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaRecycle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Descarte</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Coloque o material na lixeira
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaQrcode className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Código</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lixeira gera código único
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaCoins className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Pontos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Escaneie e ganhe pontos
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Modal de Sucesso */}
      <Modal isOpen={showSuccess} onClose={closeModals}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pontos Coletados!
          </h2>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
            +{pointsEarned} pontos
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Parabéns! Você contribuiu para um mundo mais sustentável.
          </p>
          <Button onClick={closeModals} className="w-full">
            Continuar
          </Button>
        </div>
      </Modal>

      {/* Modal de Erro */}
      <Modal isOpen={showError} onClose={closeModals}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Erro
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage}
          </p>
          <Button onClick={closeModals} className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CollectPointsPage; 