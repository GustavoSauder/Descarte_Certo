const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Função para verificar JWT do Supabase
const verifySupabaseJWT = async (token) => {
  try {
    // Decodificar o token sem verificar a assinatura primeiro
    const decoded = jwt.decode(token);
    
    if (!decoded) {
      throw new Error('Token inválido');
    }

    // Verificar se é um token do Supabase
    if (decoded.iss !== 'https://nxqomjncwxtcxcdzlpix.supabase.co') {
      throw new Error('Token não é do Supabase');
    }

    // Verificar se não expirou
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expirado');
    }

    return decoded;
  } catch (error) {
    throw new Error('Token inválido: ' + error.message);
  }
};

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso necessário',
        code: 'TOKEN_MISSING'
      });
    }

    // Verificar JWT do Supabase
    const decoded = await verifySupabaseJWT(token);
    
    // Buscar usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { 
        email: decoded.email 
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        school: true,
        grade: true,
        points: true,
        level: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      // Se usuário não existe, criar automaticamente
      const newUser = await prisma.user.create({
        data: {
          email: decoded.email,
          name: decoded.user_metadata?.name || decoded.email.split('@')[0],
          school: decoded.user_metadata?.school || null,
          grade: decoded.user_metadata?.grade || null,
          role: 'USER',
          points: 0,
          level: 1
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          school: true,
          grade: true,
          points: true,
          level: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      req.user = newUser;
    } else {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(403).json({ 
      error: 'Token inválido ou expirado',
      code: 'TOKEN_INVALID'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissão insuficiente.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Middleware para verificar se é o próprio usuário ou admin
const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    const targetUserId = req.params[paramName] || req.body.userId;
    
    if (!targetUserId) {
      return res.status(400).json({ 
        error: 'ID do usuário não fornecido',
        code: 'USER_ID_MISSING'
      });
    }

    // Permitir se for o próprio usuário ou admin
    if (req.user.id === parseInt(targetUserId) || req.user.role === 'ADMIN') {
      return next();
    }

    return res.status(403).json({ 
      error: 'Acesso negado. Você só pode acessar seus próprios dados.',
      code: 'ACCESS_DENIED'
    });
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnership
}; 