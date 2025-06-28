import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index.js';

describe('Health Check API', () => {
  it('should return 200 and success response', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('status', 'OK');
    expect(response.body.data).toHaveProperty('version');
    expect(response.body.data).toHaveProperty('features');
    expect(Array.isArray(response.body.data.features)).toBe(true);
  });

  it('should return correct API structure', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    const { data } = response.body;
    
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('owner');
    expect(data).toHaveProperty('integrity');
    expect(typeof data.integrity).toBe('boolean');
  });
}); 