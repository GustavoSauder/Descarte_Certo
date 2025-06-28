import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Send error to analytics/error tracking service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({ 
      showDetails: !prevState.showDetails 
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-large p-8 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </motion.div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ops! Algo deu errado
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Encontramos um problema inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6">
                <button
                  onClick={this.toggleDetails}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
                >
                  {this.state.showDetails ? 'Ocultar' : 'Mostrar'} detalhes do erro
                </button>
                
                {this.state.showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-left text-xs overflow-auto max-h-40"
                  >
                    <div className="font-mono text-red-600 dark:text-red-400">
                      <div className="font-semibold mb-2">Error:</div>
                      <div className="mb-2">{this.state.error.toString()}</div>
                      
                      {this.state.errorInfo && (
                        <>
                          <div className="font-semibold mb-2">Component Stack:</div>
                          <div className="whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleReset}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaRedo className="w-4 h-4 mr-2" />
                Tentar Novamente
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaHome className="w-4 h-4 mr-2" />
                Voltar ao Início
              </motion.button>
            </div>

            {/* Additional Help */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Se o problema persistir, entre em contato:
              </p>
              <div className="space-y-1 text-sm">
                <a 
                  href="mailto:suporte@descarte-certo.com" 
                  className="text-primary-600 dark:text-primary-400 hover:underline block"
                >
                  suporte@descarte-certo.com
                </a>
                <a 
                  href="/contato" 
                  className="text-primary-600 dark:text-primary-400 hover:underline block"
                >
                  Página de Contato
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar Error Boundary em componentes funcionais
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const handleError = React.useCallback((error) => {
    setError(error);
    
    // Log error
    console.error('Error caught by hook:', error);
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

// Componente para exibir erros em componentes funcionais
export const ErrorDisplay = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4"
    >
      <div className="flex items-start">
        <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Erro
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            {error.message || 'Ocorreu um erro inesperado.'}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
            >
              Tentar novamente
            </button>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-red-400 hover:text-red-600 dark:hover:text-red-300"
          >
            <span className="sr-only">Fechar</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorBoundary; 