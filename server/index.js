const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const projectOwnership = require('./config/ownership');
const { performanceMonitor, errorMonitor } = require('./middleware/monitoring');
const path = require('path');
const { securityConfig } = require('./middleware/security');
require('dotenv').config();

const app = express();

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar CSP para desenvolvimento
  xssFilter: false, // Desabilitar XSS filter que pode estar causando problemas
  hsts: false // Desabilitar HSTS para desenvolvimento local
}));
app.use(cors({
  origin: true, // Permitir qualquer origem para desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// Middleware de monitoramento
app.use(performanceMonitor);

// Logging
app.use(morgan('combined'));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos para downloads
app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use('/apps', express.static(path.join(__dirname, 'public', 'apps')));
app.use('/qr', express.static(path.join(__dirname, 'public', 'qr')));

// Middleware de resposta padronizada
const apiResponse = require('./middleware/response');
app.use(apiResponse);

// Headers de segurança adicionais
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  // Removendo X-XSS-Protection que estava causando problemas
  // res.setHeader('X-XSS-Protection', '1; mode=block');
  // Removendo headers restritivos para desenvolvimento
  // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('X-Powered-By', 'Descarte Certo v2.0 - Secure');
  next();
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/disposals', require('./routes/disposals'));
app.use('/api/impact', require('./routes/impact'));
app.use('/api/collection', require('./routes/collection'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/comments', require('./routes/comments'));

// Novas rotas implementadas
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/support', require('./routes/support'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/public', require('./routes/api'));
app.use('/api/feedback', require('./routes/feedback'));

// Rotas de propriedade (apenas proprietário)
app.use('/api/ownership', require('./routes/ownership'));

// Rotas de exportação
app.use('/api/export', require('./routes/export'));

// Rotas de monitoramento
app.use('/api/monitoring', require('./routes/monitoring'));

// Middleware de autenticação
const { authenticateToken } = require('./middleware/auth');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar status da API
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
app.get('/api/health', (req, res) => {
  res.success({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    owner: projectOwnership.ownerEmail,
    integrity: projectOwnership.verifyIntegrity(),
    features: [
      'Autenticação e Autorização',
      'Sistema de Descarte',
      'Impacto Ambiental',
      'Pontos de Coleta',
      'Histórias de Sucesso',
      'Painel Administrativo',
      'Notificações Push/Email',
      'Sistema de Desafios',
      'Feed de Atividades',
      'Marketplace de Recompensas',
      'Blog e Conteúdo',
      'Sistema de Suporte',
      'Relatórios PDF',
      'API Pública',
      'Gamificação Avançada',
      'Ranking Geolocalizado',
      'Simulador de Impacto',
      'PWA/Modo Offline',
      'Sistema de Propriedade',
      'Segurança Máxima'
    ]
  });
});

// Rota protegida de exemplo
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Rota protegida acessada com sucesso',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    },
    isOwner: projectOwnership.verifyOwnership(req.user.id, req.user.email)
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.fail('Erro interno do servidor', 500);
});

// Rota 404
app.use('*', (req, res) => {
  res.fail('Rota não encontrada', 404, {
    message: 'A rota solicitada não existe',
    owner: projectOwnership.ownerEmail,
    availableRoutes: [
      '/api/health',
      '/api/auth',
      '/api/users',
      '/api/disposals',
      '/api/impact',
      '/api/collection',
      '/api/contact',
      '/api/stories',
      '/api/admin',
      '/api/notifications',
      '/api/challenges',
      '/api/activities',
      '/api/marketplace',
      '/api/blog',
      '/api/support',
      '/api/reports',
      '/api/public',
      '/api/ownership'
    ]
  });
});

const PORT = process.env.PORT || 3002;

// Só iniciar o servidor se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`👨‍💼 Proprietário: ${projectOwnership.ownerEmail}`);
  });
}

module.exports = app; 