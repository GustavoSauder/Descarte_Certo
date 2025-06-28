// Sistema de Analytics
class Analytics {
  constructor() {
    this.isInitialized = false;
    this.events = [];
  }

  // Inicializar Google Analytics
  init(measurementId) {
    if (this.isInitialized || !measurementId) return;

    // Carregar Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    window.gtag = gtag;
    this.isInitialized = true;
  }

  // Rastrear evento
  trackEvent(eventName, parameters = {}) {
    if (!this.isInitialized) {
      this.events.push({ eventName, parameters });
      return;
    }

    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }

    // Log local para debug
    console.log('Analytics Event:', eventName, parameters);
  }

  // Rastrear página
  trackPage(pageName, pageUrl) {
    if (!this.isInitialized) return;

    if (window.gtag) {
      window.gtag('config', window.gtag('config', 'GA_MEASUREMENT_ID'), {
        page_title: pageName,
        page_location: pageUrl,
      });
    }
  }

  // Rastrear conversão
  trackConversion(conversionId, value = null) {
    if (!this.isInitialized) return;

    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
      });
    }
  }

  // Rastrear erro
  trackError(error, context = {}) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  // Rastrear performance
  trackPerformance(metric) {
    this.trackEvent('performance', metric);
  }
}

// Sistema de Monitoramento de Erros
class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
  }

  // Capturar erro
  captureError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
    };

    this.errors.push(errorInfo);

    // Manter apenas os últimos erros
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Enviar para analytics
    if (window.analytics) {
      window.analytics.trackError(error, context);
    }

    // Log para console em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Error captured:', errorInfo);
    }

    return errorInfo;
  }

  // Obter erros
  getErrors() {
    return [...this.errors];
  }

  // Limpar erros
  clearErrors() {
    this.errors = [];
  }
}

// Sistema de Performance
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  // Medir tempo de carregamento
  measureLoadTime() {
    if (performance && performance.timing) {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      this.metrics.loadTime = loadTime;
      
      if (window.analytics) {
        window.analytics.trackPerformance({ loadTime });
      }
      
      return loadTime;
    }
    return null;
  }

  // Medir tempo de resposta da API
  measureApiResponse(url, startTime, endTime) {
    const responseTime = endTime - startTime;
    
    if (!this.metrics.apiResponses) {
      this.metrics.apiResponses = {};
    }
    
    this.metrics.apiResponses[url] = responseTime;
    
    if (window.analytics) {
      window.analytics.trackPerformance({ 
        type: 'api_response',
        url,
        responseTime 
      });
    }
    
    return responseTime;
  }
}

// Instâncias globais
const analytics = new Analytics();
const errorMonitor = new ErrorMonitor();
const performanceMonitor = new PerformanceMonitor();

// Inicializar Google Analytics automaticamente se houver Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  analytics.init(GA_MEASUREMENT_ID);
}

// Expor globalmente
window.analytics = analytics;
window.errorMonitor = errorMonitor;
window.performanceMonitor = performanceMonitor;

// Capturar erros globais
window.addEventListener('error', (event) => {
  errorMonitor.captureError(event.error, {
    type: 'global_error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorMonitor.captureError(new Error(event.reason), {
    type: 'unhandled_promise_rejection',
  });
});

export { analytics, errorMonitor, performanceMonitor }; 