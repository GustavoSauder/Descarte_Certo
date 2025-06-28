const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Configurações de segurança máxima
const securityConfig = {
  // Rate limiting agressivo
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // máximo 50 requests por IP
    message: {
      error: 'Muitas requisições detectadas. Acesso temporariamente bloqueado.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Configurações do Helmet
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
    frameguard: { action: 'deny' }
  },

  // CORS restritivo
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400
  }
};

// Middleware de autenticação avançada
const advancedAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso não fornecido',
        code: 'MISSING_TOKEN'
      });
    }

    // Verificar assinatura do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o token não foi revogado
    if (decoded.revoked) {
      return res.status(401).json({
        error: 'Token revogado',
        code: 'TOKEN_REVOKED'
      });
    }

    // Verificar expiração
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    // Verificar IP do usuário (opcional)
    const clientIP = req.ip || req.connection.remoteAddress;
    if (decoded.allowedIPs && !decoded.allowedIPs.includes(clientIP)) {
      return res.status(401).json({
        error: 'Acesso não autorizado deste IP',
        code: 'IP_NOT_ALLOWED'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// Middleware de autorização por role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Acesso negado. Permissão insuficiente.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

// Middleware de auditoria
const auditLog = (req, res, next) => {
  const auditData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    userRole: req.user?.role || 'anonymous',
    requestBody: req.method !== 'GET' ? req.body : null,
    headers: {
      'content-type': req.get('Content-Type'),
      'authorization': req.get('Authorization') ? '***' : null,
      'x-api-key': req.get('X-API-Key') ? '***' : null
    }
  };

  // Log de auditoria (em produção, salvar em banco ou arquivo seguro)
  console.log('🔒 AUDIT LOG:', JSON.stringify(auditData, null, 2));

  // Adicionar dados de auditoria à resposta
  res.on('finish', () => {
    auditData.responseStatus = res.statusCode;
    auditData.responseTime = Date.now() - req.startTime;
    
    // Log de resposta
    console.log('📊 RESPONSE AUDIT:', {
      status: res.statusCode,
      time: auditData.responseTime + 'ms',
      userId: auditData.userId
    });
  });

  req.startTime = Date.now();
  next();
};

// Middleware de sanitização de dados
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Remover scripts e tags perigosas
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else if (typeof value === 'object') {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

// Middleware de proteção contra ataques
const securityHeaders = (req, res, next) => {
  // Headers de segurança adicionais
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Header personalizado para identificação
  res.setHeader('X-Powered-By', 'Descarte Certo v2.0');
  
  next();
};

// Middleware de verificação de integridade
const integrityCheck = (req, res, next) => {
  // Verificar se a requisição vem do frontend autorizado
  const origin = req.get('Origin');
  const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
  
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      error: 'Origem não autorizada',
      code: 'UNAUTHORIZED_ORIGIN'
    });
  }

  // Verificar se não é um bot malicioso
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  if (isSuspicious && !req.path.includes('/api/public')) {
    return res.status(403).json({
      error: 'Acesso negado para bots',
      code: 'BOT_ACCESS_DENIED'
    });
  }

  next();
};

// Função para gerar token seguro
const generateSecureToken = (userData) => {
  const payload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 dias
    jti: crypto.randomBytes(16).toString('hex'), // ID único do token
    ip: userData.allowedIPs || [],
    revoked: false
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    issuer: 'descarte-certo',
    audience: 'descarte-certo-users'
  });
};

// Função para revogar token
const revokeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    decoded.revoked = true;
    // Em produção, salvar em banco de tokens revogados
    return true;
  } catch (error) {
    return false;
  }
};

// Middleware de rate limiting específico para login
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'LOGIN_RATE_LIMIT'
  },
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.ip
});

// Middleware de rate limiting para API pública
const publicApiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 100, // máximo 100 requests por hora
  message: {
    error: 'Limite de API excedido. Tente novamente em 1 hora.',
    code: 'API_RATE_LIMIT'
  },
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip
});

module.exports = {
  securityConfig,
  advancedAuth,
  requireRole,
  auditLog,
  sanitizeInput,
  securityHeaders,
  integrityCheck,
  generateSecureToken,
  revokeToken,
  loginRateLimit,
  publicApiRateLimit
}; 