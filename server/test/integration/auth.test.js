import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../setup.js';

describe('Authentication API', () => {
  let mockToken;

  beforeEach(() => {
    // Mock token para testes (em produção, seria um token real do Supabase)
    mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL254cXFvbWpuY3d4dGN4Y2R6bHBpeC5zdXBhYmFzZS5jbyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTczNzc0OTYwMCwiZXhwIjoxNzM3ODM2MDAwfQ.test';
  });

  describe('GET /auth/me', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acesso necessário');
    });

    it('should return 403 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token inválido ou expirado');
    });
  });

  describe('PUT /auth/profile', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({ name: 'Test User' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de acesso necessário');
    });
  });
}); 