const MonitoringService = require('../services/monitoringService');

// Middleware para monitorar performance das requisições
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  // Capturar informações da requisição
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || null
  };

  // Interceptar o final da resposta
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = (seconds * 1000) + (nanoseconds / 1000000); // Converter para milissegundos

    // Registrar métrica de performance
    MonitoringService.logPerformanceMetric(
      req.originalUrl,
      req.method,
      duration,
      res.statusCode
    );

    // Registrar atividade se houver usuário autenticado
    if (req.user?.id) {
      const action = `${req.method} ${req.originalUrl}`;
      MonitoringService.logActivity(req.user.id, action, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        duration: duration.toFixed(2)
      });
    }
  });

  next();
};

// Middleware para capturar erros
const errorMonitor = (error, req, res, next) => {
  // Registrar erro no sistema de monitoramento
  MonitoringService.logError(error, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || null,
    body: req.body,
    query: req.query,
    params: req.params
  });

  next(error);
};

module.exports = {
  performanceMonitor,
  errorMonitor
}; 