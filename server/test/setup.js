import { beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import app from '../index.js';

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'testpass';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-key';
process.env.JWT_SECRET = 'test-secret';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpar banco de dados de teste se necessário
  // await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { app }; 